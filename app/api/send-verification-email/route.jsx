// /app/api/send-verification-email/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/app/config/firebase";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const { email, uid } = await req.json();

    if (!email || !uid) {
      return NextResponse.json(
        { error: "Missing email or userId" },
        { status: 400 }
      );
    }

    const token = uuidv4();
    const expiresAt = Timestamp.fromDate(new Date(Date.now() + 1000 * 60 * 60)); // 1 hour

    await setDoc(doc(collection(db, "emailVerifications"), uid), {
      uid: uid,
      token,
      createdAt: serverTimestamp(),
      expiresAt,
      verified: false,
    });

    // Construct verification URL
    const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/email-verify?token=${token}`;

    // --- Mailer config (update credentials) ---
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Passify" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email address",
      html: `
        <p>Click the link below to verify your account:</p>
        <p><a href="${verifyLink}">Verify Account</a></p>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
