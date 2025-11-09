<<<<<<< HEAD
import { MessageCircleWarning } from "lucide-react";
import Link from "next/link";

export default function Verify() {
  return (
    <div className="min-h-dvh p-3 sm:p-4 flex items-center justify-center text-sm sm:text-base">
      <div className="p-2 flex flex-col gap-5 w-full max-w-md">
        {/* Title */}
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Password Reset</h1>
          <span className="text-gray-500 ">
            We sent a code to{" "}
            <span className="text-blue-500 font-semibold">
              name@example.com
            </span>
          </span>
        </div>
        {/* Validation message here. */}
        <div className="flex items-center gap-1 w-full px-3 sm:px-4 py-2 bg-red-100 rounded-md border-l-4 border-red-500 text-red-500">
          <MessageCircleWarning className="size-4 sm:size-5" />
          Validation message here
        </div>
        {/* form */}
        <form action="" className="flex flex-col gap-4">
          <div className="grid grid-cols-6 gap-2">
            <input
              type="number"
              className="col-span-1 text-base sm:text-lg p-3 sm:p-4 text-center rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors duration-150 placeholder:text-gray-500"
            />
            <input
              type="number"
              className="col-span-1 text-base sm:text-lg p-3 sm:p-4 text-center rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors duration-150 placeholder:text-gray-500"
            />
            <input
              type="number"
              className="col-span-1 text-base sm:text-lg p-3 sm:p-4 text-center rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors duration-150 placeholder:text-gray-500"
            />
            <input
              type="number"
              className="col-span-1 text-base sm:text-lg p-3 sm:p-4 text-center rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors duration-150 placeholder:text-gray-500"
            />
            <input
              type="number"
              className="col-span-1 text-base sm:text-lg p-3 sm:p-4 text-center rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors duration-150 placeholder:text-gray-500"
            />
            <input
              type="number"
              className="col-span-1 text-base sm:text-lg p-3 sm:p-4 text-center rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors duration-150 placeholder:text-gray-500"
            />
          </div>
          <div className="flex items-center justify-center">
            <span className="text-gray-500 ">
              Didn't receive the email?{" "}
              <span className="text-blue-500 active:text-blue-600">
                Click here
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <button className="border border-blue-500 hover:border-blue-500/90 active:border-blue-600 bg-blue-500 hover:bg-blue-500/90 active:bg-blue-600 transition-colors duration-150 rounded-full px-4 py-2 text-center text-white">
              Continue
=======
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MessageCircleWarning, Loader2 } from "lucide-react";

export default function PasswordVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email] = useState(emailParam); // provided by the forgot-password redirect
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    // focus first input on mount
    inputsRef.current[0]?.focus();
  }, []);

  // handle single-digit input, move focus
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // only allow single digit or empty
    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // handle backspace to go previous input
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      submitCode();
    }
  };

  // allow pasting full 6-digit code
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    const onlyDigits = pasted.replace(/\D/g, "");
    if (onlyDigits.length === 6) {
      const arr = onlyDigits.split("");
      setDigits(arr);
      // focus last and submit automatically
      inputsRef.current[5]?.focus();
      // small timeout to let state update
      setTimeout(() => submitCode(), 200);
    }
  };

  const submitCode = async () => {
    setError("");
    if (!email) {
      setError("Email is missing. Please restart password reset.");
      return;
    }
    const code = digits.join("");
    if (code.length !== 6 || /\D/.test(code)) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Invalid code. Please try again.");
        setIsLoading(false);
        return;
      }

      // Success: token returned
      const token = data.token;
      // Redirect to reset-password with token
      router.push(`/reset-password?token=${encodeURIComponent(token)}`);
    } catch (err) {
      console.error("Verify code error:", err);
      setError("Server error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    if (!email) {
      setError("Email is missing. Please restart the flow.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success) {
        setInfo(
          "A new code was sent (if the account exists). Check your email."
        );
        setDigits(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
      } else {
        setError(data.message || "Could not resend. Try again later.");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setIsLoading(false);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-dvh p-3 sm:p-4 flex items-center justify-center text-sm sm:text-base">
      <div className="p-2 flex flex-col gap-5 w-full max-w-md">
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Password Reset</h1>
          <span className="text-gray-500">
            We sent a code to{" "}
            <span className="text-blue-500 font-semibold">
              {email || "your email"}
            </span>
          </span>
        </div>

        {(error || info) && (
          <div
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-md ${
              error
                ? "bg-red-100 border-l-4 border-red-500 text-red-700"
                : "bg-green-100 border-l-4 border-green-500 text-green-700"
            }`}
          >
            <MessageCircleWarning className="size-4 sm:size-5" />
            <span>{error || info}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitCode();
          }}
          className="flex flex-col gap-4"
        >
          <div
            className="grid grid-cols-6 gap-2"
            onPaste={handlePaste}
            role="group"
            aria-label="Enter verification code"
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                ref={(el) => (inputsRef.current[i] = el)}
                onChange={(e) =>
                  handleChange(i, e.target.value.replace(/\D/g, ""))
                }
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="col-span-1 text-base sm:text-lg p-3 sm:p-4 text-center rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors duration-150 placeholder:text-gray-500"
                disabled={isLoading}
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className={`text-sm transition-colors duration-150 ${
                isLoading
                  ? "opacity-50 pointer-events-none"
                  : "text-gray-500 hover:underline hover:text-blue-500 cursor-pointer"
              }`}
            >
              {isLoading
                ? "Please wait..."
                : "Didn't receive the email? Resend"}
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <button
              type="submit"
              disabled={isLoading}
              className={`transition-colors duration-150 rounded-full px-4 py-2 text-center text-white mt-2 cursor-pointer flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-blue-700/70 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isLoading && <Loader2 className="size-5 animate-spin" />}
              <span>{isLoading ? "Verifying..." : "Continue"}</span>
>>>>>>> clean-reset
            </button>

            <Link
              href="/login"
<<<<<<< HEAD
              className=" border border-gray-300 px-4 py-2 rounded-full flex items-center justify-center gap-4 transition-colors duration-150 active:bg-gray-100"
            >
              {/* logo */}
=======
              className="border border-gray-300 px-4 py-2 rounded-full flex items-center justify-center gap-4 transition-colors duration-150 active:bg-gray-100"
            >
>>>>>>> clean-reset
              <span>Back to login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
