// This API endpoint handles the secure token verification logic on the server.

// /app/api/verify-email/route.js
import { NextResponse } from "next/server";
import { db } from "@/app/config/firebase";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteField,
} from "firebase/firestore";

export async function POST(req) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json(
        { error: "Invalid verification link" },
        { status: 400 }
      );
    }

    const q = query(
      collection(db, "emailVerifications"),
      where("token", "==", token)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    // Check expiry
    if (data.expiresAt.toMillis() < Date.now()) {
      return NextResponse.json({ error: "Link expired" }, { status: 400 });
    }

    // ✅ Update user as verified (example assumes you have a "users" collection)
    await updateDoc(doc(db, "users", data.uid), {
      isVerified: true,
      verifiedAt: new Date(),
    });

    // ✅ Sanitize verification record instead of deleting
    await updateDoc(docSnap.ref, {
      verified: true,
      verifiedAt: new Date(),
      token: deleteField(), // remove token
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
