"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmailVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // status: "verifying" | "success" | "error"
  const [status, setStatus] = useState("verifying");
  const [countdown, setCountdown] = useState(3); // 👈 countdown timer (3 seconds)

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const res = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          setStatus("error");
          return;
        }

        // ✅ Success
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }

    verify();
  }, [token]);

  // Countdown + redirect effect when success
  useEffect(() => {
    if (status === "success") {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            router.push("/login");
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status, router]);

  // --- RENDERING UI STATES ---
  if (status === "verifying") {
    return (
      <div className="min-h-dvh p-3 sm:p-4 flex items-center justify-center text-sm sm:text-base">
        <div className="p-2 flex flex-col gap-5 w-full max-w-md">
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <h1 className="text-xl sm:text-2xl font-bold">
              Account Verification
            </h1>
            <span className="text-gray-500">Verifying your account</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-gray-500 animate-pulse text-sm sm:text-sm">
              Please wait...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-dvh p-3 sm:p-4 flex items-center justify-center text-sm sm:text-base">
        <div className="p-2 flex flex-col gap-5 w-full max-w-md">
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <h1 className="text-xl sm:text-2xl font-bold">
              Welcome to Passify
            </h1>
            <span className="text-gray-500">
              Your account has been verified.
            </span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-gray-500 text-sm sm:text-sm">
              Redirecting in <span className="font-semibold">{countdown}</span>
              ...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default: error state
  return (
    <div className="min-h-dvh p-3 sm:p-4 flex items-center justify-center text-sm sm:text-base">
      <div className="p-2 flex flex-col gap-5 w-full max-w-md">
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Verification Failed</h1>
          <span className="text-gray-500">
            There's an error verifying your account. Please try again.
          </span>
        </div>
      </div>
    </div>
  );
}
