import { NextResponse } from "next/server";
import admin from "@/app/config/firebaseAdmin";
import jwt from "jsonwebtoken";

const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET;
if (!RESET_TOKEN_SECRET) {
  console.warn("RESET_TOKEN_SECRET is not set in env");
}

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email and code are required." },
        { status: 400 }
      );
    }

    // Query passwordResets by email
    const resetsRef = admin.firestore().collection("passwordResets");
    const q = resetsRef.where("email", "==", email).limit(1);
    const snap = await q.get();

    if (snap.empty) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset code." },
        { status: 400 }
      );
    }
    const docSnap = snap.docs[0];
    const data = docSnap.data();
    const { resetCode, expiresAt, uid } = data;

    // Check code match
    if (!resetCode || resetCode !== code) {
      return NextResponse.json(
        { success: false, message: "Incorrect reset code." },
        { status: 400 }
      );
    }

    // Check expiry - support number or Firestore Timestamp
    const expiresMillis =
      typeof expiresAt === "number"
        ? expiresAt
        : expiresAt && typeof expiresAt.toMillis === "function"
        ? expiresAt.toMillis()
        : null;

    if (!expiresMillis) {
      // fallback: if createdAt exists, treat createdAt + 10 min as expiry
      const createdAt = data.createdAt;
      const createdMillis =
        createdAt && typeof createdAt.toMillis === "function"
          ? createdAt.toMillis()
          : Date.parse(createdAt) || null;
      if (!createdMillis) {
        return NextResponse.json(
          { success: false, message: "Invalid reset record." },
          { status: 400 }
        );
      }
      // default 10 minutes
      if (Date.now() - createdMillis > 10 * 60 * 1000) {
        await docSnap.ref.delete().catch(() => {});
        return NextResponse.json(
          {
            success: false,
            message: "Reset code expired. Please request a new one.",
          },
          { status: 400 }
        );
      }
    } else {
      if (Date.now() > expiresMillis) {
        await docSnap.ref.delete().catch(() => {});
        return NextResponse.json(
          {
            success: false,
            message: "Reset code expired. Please request a new one.",
          },
          { status: 400 }
        );
      }
    }

    // All good: create short-lived token (5 minutes)
    const tokenPayload = { email, uid: uid || null };
    const token = jwt.sign(tokenPayload, RESET_TOKEN_SECRET, {
      expiresIn: "5m",
    });

    // Optionally delete the reset doc now to avoid reuse
    await docSnap.ref.delete().catch((err) => {
      console.warn("Could not delete reset doc:", err.message || err);
    });

    return NextResponse.json({
      success: true,
      message: "Reset code verified.",
      token,
    });
  } catch (err) {
    console.error("Verify reset code error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
