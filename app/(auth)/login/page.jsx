"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MessageCircleWarning,
  CircleCheckBig,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

// Import Firebase Auth/Firestore methods
import { auth, db } from "@/app/config/firebase";
import {
  doc,
  updateDoc,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect, // Re-introduce for mobile compatibility
  getRedirectResult, // To handle the callback result
} from "firebase/firestore";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- STATE MANAGEMENT ---
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [globalMessage, setGlobalMessage] = useState({
    type: "", // 'success' or 'error'
    text: "",
  });

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const passwordType = showPassword ? "text" : "password";

  // Handles messages from redirects (e.g., successful registration/verification)
  useEffect(() => {
    const checkRedirectResult = async () => {
      // Start loading to cover the brief period while checking the result
      setIsLoading(true);

      try {
        const result = await getRedirectResult(auth);

        if (result) {
          // This means a sign-in just completed successfully
          const user = result.user;

          // 🔑 Update Firestore profile/verification status
          // We use result.user because it contains the final, authenticated state
          await updateFirestoreVerificationStatus(user);

          router.push("/dashboard");
        }
      } catch (error) {
        console.error(
          "Google Sign-in Callback Error:",
          error.code,
          error.message
        );
        setGlobalMessage({
          type: "error",
          text: "Google Sign-in failed after redirect. Please try again.",
        });
      } finally {
        // Stop loading state only after the result is processed or failed
        setIsLoading(false);
      }
    };

    // Check for general redirect messages first (from registration, etc.)
    const status = searchParams.get("status");
    const message = searchParams.get("message");
    if (status && message) {
      setGlobalMessage({ type: status, text: message });
    }

    // Always run the check for redirect results
    checkRedirectResult();
  }, [searchParams, router]);

  // --- FIRESTORE PROFILE HELPER ---
  const updateFirestoreVerificationStatus = async (user) => {
    // Check if Firebase Auth itself confirms verification
    if (user.isVerified) {
      const userRef = doc(db, "users", user.uid);

      try {
        // We use updateDoc because the document was created during registration
        await updateDoc(userRef, {
          isVerified: true,
          verifiedAt: new Date(),
        });
        console.log("Firestore status updated to verified.");
      } catch (error) {
        console.error("Failed to update Firestore verification status:", error);
      }
    } else {
      setGlobalMessage({
        type: "error",
        text: "Please verify your email address before signing in.",
      });
      // Optional: Force user to re-log in or handle the unverified state gracefully
      throw new Error("Email not verified.");
    }
  };

  // --- EMAIL/PASSWORD SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalMessage({ type: "", text: "" });

    if (!validateForm()) {
      setGlobalMessage({
        type: "error",
        text: "Please correct the errors and fill in all required fields.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 🔑 NEW: Check verification status and update Firestore with timestamp
      await updateFirestoreVerificationStatus(user);

      // Success: Redirect user
      router.push("/dashboard");
    } catch (error) {
      console.error("Firebase Sign-in Error:", error.code, error.message);
      let errorMessage = "Sign in failed. Please try again."; // Default error

      if (error.code === "auth/user-not-found") {
        // 🔑 TARGETED MESSAGE FIX
        errorMessage =
          "No account found with this email. Please create an account first.";
      } else if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        // General failure for security (we don't say if email or password is wrong)
        errorMessage = "Invalid email or password.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage =
          "Your account has been disabled. Please contact support.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "Access temporarily blocked due to too many failed attempts.";
      }

      setGlobalMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // --- GOOGLE SIGN IN (POPUP) ---
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      // *** CRITICAL FIX: Use signInWithRedirect for universal compatibility ***
      await signInWithRedirect(auth, provider);
      // Execution stops here and the browser redirects.
    } catch (error) {
      // This handles errors *before* the redirect starts (e.g., config error)
      console.error(
        "Google Sign-in Redirect Init Error:",
        error.code,
        error.message
      );
      setGlobalMessage({
        type: "error",
        text: "Google Sign-in failed to initiate.",
      });
    }
    // We don't set isLoading(false) here, as the page is redirecting
  };

  // --- VALIDATION AND JSX HELPERS ---
  const validateForm = () => {
    /* ... validation logic remains here ... */ return true;
  }; // Simplified for brevity

  const getBorderClass = (fieldName) =>
    errors[fieldName]
      ? "border-red-500 focus:border-red-500"
      : isLoading
      ? "border-gray-300"
      : "border-gray-300 focus:border-blue-500";

  const getInputClasses = (fieldName) => `
    px-3 sm:px-4 py-2 w-full rounded-md border outline-none transition-colors duration-150 placeholder:text-gray-500
    ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}
    ${getBorderClass(fieldName)}
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
          <h1 className="text-xl sm:text-2xl font-bold">Welcome to Passify</h1>
          <span className="text-gray-500 ">Sign in to your account</span>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={getInputClasses("email")}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between ">
              <label className="font-medium" htmlFor="password">
                Password
              </label>
              <Link
                href="/forgot-password"
                className={`text-gray-500 text-xs sm:text-sm transition-colors duration-150 ${
                  isLoading
                    ? "opacity-50 pointer-events-none"
                    : "hover:text-blue-600 active:text-gray-600"
                }`}
                aria-disabled={isLoading}
                tabIndex={isLoading ? -1 : 0}
              >
                Forgot password
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={passwordType}
                value={formData.password}
                onChange={handleInputChange}
                className={`${getInputClasses("password")} pr-10`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {/* toggle button for show password */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute top-2 sm:top-2.5 right-3 sm:right-4 text-gray-500 transition-colors duration-150 ${
                  isLoading
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:text-blue-600"
                }`}
                disabled={isLoading}
              >
                {showPassword ? (
                  <Eye className="size-5" />
                ) : (
                  <EyeOff className="size-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <span className="text-xs text-red-500">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`
                transition-colors duration-150 rounded-full px-4 py-2 text-center text-white cursor-pointer flex items-center justify-center gap-2
                ${
                  isLoading
                    ? "bg-blue-700 border-blue-700 cursor-not-allowed" // Loading state styles
                    : "bg-blue-500 border-blue-500 hover:bg-blue-500/90 active:bg-blue-600 hover:border-blue-500/90 active:border-blue-600"
                }
              `}
          >
            {isLoading && <Loader2 className="size-5 animate-spin" />}
            <span>{isLoading ? "Signing in..." : "Sign in"}</span>
          </button>
        </form>

        {/* or */}
        <div className="flex items-center justify-center text-gray-500 font-medium before::flex-grow before:border-t before:border-gray-200 after::flex-grow after:border-t after:border-gray-200 gap-4">
          or
        </div>

        {/* buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`
              border border-gray-300 px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-colors duration-150
              ${
                isLoading
                  ? "bg-gray-100 cursor-not-allowed text-gray-500"
                  : "hover:bg-gray-50 active:bg-gray-100 cursor-pointer text-gray-700"
              }
            `}
          >
            {/* Google Logo SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              viewBox="-3 0 262 262"
              preserveAspectRatio="xMidYMid"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              />
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              />
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              />
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
          <Link
            href="/create-account"
            className={`
              border border-gray-300 px-4 py-2 rounded-full flex items-center justify-center gap-4 transition-colors duration-150
              ${
                isLoading
                  ? "bg-gray-100 cursor-not-allowed text-gray-500"
                  : "hover:bg-gray-50 active:bg-gray-100 cursor-pointer text-gray-700"
              }
            `}
            aria-disabled={isLoading}
            tabIndex={isLoading ? -1 : 0}
          >
            <span>Create account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
