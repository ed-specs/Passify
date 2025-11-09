import { NextResponse } from "next/server";
import admin from "@/app/config/firebaseAdmin"; // Firebase Admin SDK
import jwt from "jsonwebtoken";

const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET;

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing token or new password.",
        },
        { status: 400 }
      );
    }

    if (!RESET_TOKEN_SECRET) {
      console.error("Reset token not defined or misconfigured in the env");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // verify reset token
    let decoded;
    try {
      decoded = jwt.verify(token, RESET_TOKEN_SECRET);
    } catch (err) {
      console.error("JWT verification failed:", err);
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token." },
        { status: 401 }
      );
    }

    const { email, uid } = decoded;

    if (!uid) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload" },
        { status: 400 }
      );
    }

    // Update password securely via Firebase Admin SDK
    await admin.auth().updateUser(uid, { password: newPassword });

    // Optional: clean up any reset docs
    const resetRef = admin.firestore().collection("passwordResets").doc(uid);
    await resetRef.delete().catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err) {
    console.error("Server reset error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
