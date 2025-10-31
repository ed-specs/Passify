"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/app/config/firebase";

export default function RedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    async function handleRedirect() {
      try {
        const result = await getRedirectResult(auth);
        console.log("Redirect result:", result);

        if (result && result.user) {
          // Successfully signed in
          router.push("/dashboard");
        } else {
          // No redirect result found → go back to login
          router.push("/login");
        }
      } catch (error) {
        console.error("Redirect Sign-in Error:", error);
        router.push("/login");
      }
    }

    handleRedirect();
  }, [router]);

  return (
    <div className="min-h-dvh p-3 sm:p-4 flex items-center justify-center text-sm sm:text-base">
      <div className="p-2 flex flex-col gap-5 w-full max-w-md text-center">
        <h1 className="text-xl sm:text-2xl font-bold">Welcome to Passify</h1>
        <span className="text-gray-500">Signing in to your account</span>
        <div className="flex items-center justify-center">
          <span className="text-gray-500 animate-pulse">Please wait...</span>
        </div>
      </div>
    </div>
  );
}
