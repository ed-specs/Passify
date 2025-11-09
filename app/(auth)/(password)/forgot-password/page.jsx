"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircleWarning, CircleCheckBig, Loader2 } from "lucide-react";

<<<<<<< HEAD
// Import Firebase Auth method
import { auth } from "@/app/config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
=======
>>>>>>> clean-reset

export default function ForgotPassword() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalMessage, setGlobalMessage] = useState({
    type: "", // 'success' or 'error'
    text: "",
  });

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  // --- VALIDATION ---
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // --- SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalMessage({ type: "", text: "" });

    if (!validateForm()) {
      setGlobalMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    setIsLoading(true);

    try {
<<<<<<< HEAD
      await sendPasswordResetEmail(auth, email);

      // Success or User-Not-Found: Use same message for security (no user enumeration)
      setGlobalMessage({
        type: "success",
        text:
          "Success! If an account exists, a password reset link has been sent to your email.",
      });
      setEmail(""); // Clear the input field
    } catch (error) {
      console.error("Firebase Reset Error:", error.code, error.message);
      let errorMessage = "Could not send the reset link. Please try again.";

      // This handles auth/user-not-found and invalid-email, providing the secure success message
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-email"
      ) {
        setGlobalMessage({
          type: "success",
          text:
            "Success! If an account exists, a password reset link has been sent to your email.",
        });
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many reset attempts. Please try again later.";
        setGlobalMessage({ type: "error", text: errorMessage });
      } else {
        setGlobalMessage({ type: "error", text: errorMessage });
      }
=======
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setGlobalMessage({ type: "success", text: data.message });
        router.push(`/password-verify?email=${encodeURIComponent(email)}`);
      } else {
        setGlobalMessage({ type: "error", text: data.message });
      }
    } catch (err) {
      setGlobalMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
>>>>>>> clean-reset
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX RENDER HELPERS ---
  const getBorderClass = () =>
    errors.email
      ? "border-red-500 focus:border-red-500"
      : isLoading
      ? "border-gray-300"
      : "border-gray-300 focus:border-blue-500";

  const getInputClasses = () => `
    px-4 py-2 rounded-md border outline-none transition-colors duration-150 placeholder:text-gray-500 w-full
    ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}
    ${getBorderClass()}
  `;

  const globalMessageClasses = {
    success: "bg-green-100 border-l-4 border-green-500 text-green-700",
    error: "bg-red-100 border-l-4 border-red-500 text-red-700",
  };

  const GlobalIcon =
    globalMessage.type === "success" ? CircleCheckBig : MessageCircleWarning;

  return (
    <div className="min-h-dvh p-3 sm:p-4 flex items-center justify-center text-sm sm:text-base">
      <div className="p-2 flex flex-col gap-5 w-full max-w-md">
        {/* Title */}
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Forgot Password</h1>
          <span className="text-gray-500 ">Enter your registered email</span>
        </div>

        {/* Validation message (Global) */}
        {globalMessage.text && (
          <div
            className={`flex items-center gap-2 w-full px-3 sm:px-4 py-2 rounded-md ${
              globalMessageClasses[globalMessage.type]
            }`}
          >
            <GlobalIcon className="size-4 sm:size-8" />
            <span>{globalMessage.text}</span>
          </div>
        )}

        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleInputChange}
              className={getInputClasses()}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`
                transition-colors duration-150 rounded-full px-4 py-2 text-center text-white mt-2 cursor-pointer flex items-center justify-center gap-2
                ${
                  isLoading
                    ? "bg-blue-700 border-blue-700 cursor-not-allowed" // Loading state styles
                    : "bg-blue-500 border-blue-500 hover:bg-blue-500/90 active:bg-blue-600 hover:border-blue-500/90 active:border-blue-600"
                }
              `}
            >
              {isLoading && <Loader2 className="size-5 animate-spin" />}
              <span>{isLoading ? "Sending link..." : "Reset password"}</span>
            </button>

            <Link
              href="/login"
              className={`
                border border-gray-300 px-4 py-2 rounded-full flex items-center justify-center gap-4 transition-colors duration-150 text-gray-700
                ${
                  isLoading
<<<<<<< HEAD
                    ? "bg-gray-100 cursor-not-allowed opacity-50 pointer-events-none"
=======
                    ? "bg-gray-100 cursor-not-allowed pointer-events-none"
>>>>>>> clean-reset
                    : "hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                }
              `}
              aria-disabled={isLoading}
              tabIndex={isLoading ? -1 : 0}
            >
              <span>Back to sign in</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
