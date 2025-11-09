import admin from "@/app/config/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await admin.auth().listUsers(1);
    return NextResponse.json({ ok: true, user: users.users[0].email });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message });
  }
}
