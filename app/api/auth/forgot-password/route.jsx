import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import admin from "@/app/config/firebaseAdmin";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    // fetch user data
    const userRef = admin.firestore().collection("users");
    const querySnap = await userRef.where("email", "==", email).limit(1).get();

    if (querySnap.empty) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const userSnap = querySnap.docs[0];
    const userData = userSnap.data();

    // check if email is verified
    if (!userData.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is not verified. Please verify your account.",
        },
        { status: 400 }
      );
    }

    //retrieve and use uid of user
    const { uid } = userData;
    if (!uid) {
      console.warn("User has no UID field:", email);
      return NextResponse.json(
        {
          success: false,
          message: "User record invalid. Please contact support.",
        },
        { status: 400 }
      );
    }

    // generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // store the reset code in firebase in passwordResets collection
    await admin.firestore().collection("passwordResets").doc(uid).set({
      uid,
      email,
      resetCode,
      expiresAt,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Passify" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>Your password reset code is:</p>
        <h1 style="color:#2563EB; letter-spacing:4px;">${resetCode}</h1>
        <p>This code will expire in <strong>10 minutes</strong>.</p>
        <p>If you didn’t request this, please ignore this email.</p>
        <br/>
        <p>— The Passify Team</p>
      </div>
    `,
    });

    return NextResponse.json({
      success: true,
      message: "Reset code sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    if (error.code === "auth/user-not-found") {
      // Don’t reveal this to prevent enumeration
      return NextResponse.json({
        success: true,
        message: "Reset code sent if account exists.",
      });
    }

    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
