"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
<<<<<<< HEAD
import { auth } from "@/app/config/firebase";
import { confirmPasswordReset } from "firebase/auth"; // CRITICAL Firebase function
=======
>>>>>>> clean-reset
import {
  MessageCircleWarning,
  CircleCheckBig,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();

<<<<<<< HEAD
  // Get the oobCode (Action Code) from the URL, which is needed to reset the password
  const oobCode = searchParams.get("oobCode");

=======
  // Get the token (Action Code) from the URL, which is needed to reset the password
>>>>>>> clean-reset
  // --- STATE MANAGEMENT ---
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [globalMessage, setGlobalMessage] = useState({
    type: "",
    text: "",
  });

<<<<<<< HEAD
  // Check if the oobCode is missing on load
  useEffect(() => {
    if (!oobCode) {
      setGlobalMessage({
        type: "error",
        text:
          "Invalid or missing password reset code. Please start the process again.",
      });
      setIsLoading(true); // Disable form since we can't proceed
    }
  }, [oobCode]);
=======
  const token = searchParams.get("token");

  useEffect(() => {
    // Avoid triggering until the client-side router is ready
    if (typeof window === "undefined") return;

    if (!token) {
      setGlobalMessage({
        type: "error",
        text:
          "Invalid or missing password reset token. Please start the process again.",
      });
      setIsLoading(false);
    } else {
      setGlobalMessage({ type: "", text: "" });
    }
  }, [searchParams]);
>>>>>>> clean-reset

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);

    // Clear error for field being typed into
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Toggle visibility helpers remain the same
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);
  const passwordType = showPassword ? "text" : "password";
  const confirmPasswordType = showConfirmPassword ? "text" : "password";

  // --- VALIDATION (Adapted from CreateAccount) ---
  const passwordCriteria = useMemo(() => {
    return {
      minLength: password.length >= 12,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  }, [password]);

  const areAllCriteriaMet = Object.values(passwordCriteria).every(
    (value) => value === true
  );

  useEffect(() => {
    if (areAllCriteriaMet && isPasswordFocused) {
      setIsPasswordFocused(false);
    }
  }, [areAllCriteriaMet, isPasswordFocused]);

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (!areAllCriteriaMet) {
      newErrors.password = "Password must meet all security criteria.";
      isValid = false;
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // --- SUBMISSION LOGIC (The New Core) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    setGlobalMessage({ type: "", text: "" });

    if (!oobCode || !validateForm()) {
      if (!oobCode) {
        setGlobalMessage({
          type: "error",
          text: "Missing reset code. Cannot continue.",
        });
      } else {
        setGlobalMessage({
          type: "error",
          text: "Please correct the errors before resetting.",
        });
      }
=======
    const isValid = validateForm();
    if (!isValid) return;

    if (!token) {
      setGlobalMessage({
        type: "error",
        text: "Missing or invalid reset token.",
      });
>>>>>>> clean-reset
      return;
    }

    setIsLoading(true);
<<<<<<< HEAD

    try {
      // 🔑 CRITICAL FIREBASE STEP: Confirms the reset code and updates the password
      await confirmPasswordReset(auth, oobCode, password);

      setGlobalMessage({
        type: "success",
        text:
          "Success! Your password has been updated. Redirecting to login...",
      });

      // Clear inputs
      setPassword("");
      setConfirmPassword("");

      // Redirect user to login page after success
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      console.error("Firebase Reset Error:", error.code, error.message);
      let errorMessage = "Could not reset password. The link may be expired.";

      if (error.code === "auth/expired-action-code") {
        errorMessage = "The reset link has expired. Please request a new one.";
      } else if (error.code === "auth/invalid-action-code") {
        errorMessage =
          "The reset code is invalid. Please ensure the link was copied correctly.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "Your account is disabled. Please contact support.";
      }

      setGlobalMessage({ type: "error", text: errorMessage });
=======
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Reset failed");

      setGlobalMessage({
        type: "success",
        text: "Password updated! Redirecting to login...",
      });

      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setGlobalMessage({
        type: "error",
        text: err.message || "An error occurred during password reset.",
      });
>>>>>>> clean-reset
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX RENDER HELPERS ---
  const getBorderClass = (fieldName) =>
    errors[fieldName]
      ? "border-red-500 focus:border-red-500"
<<<<<<< HEAD
      : isLoading || !oobCode
=======
      : isLoading || !token
>>>>>>> clean-reset
      ? "border-gray-300" // Disabled border
      : "border-gray-300 focus:border-blue-500"; // Normal border

  const getInputClasses = (fieldName) => `
    px-3 sm:px-4 py-2 w-full rounded-md border outline-none transition-colors duration-150 placeholder:text-gray-500
<<<<<<< HEAD
    ${isLoading || !oobCode ? "bg-gray-100 cursor-not-allowed" : ""}
=======
    ${isLoading || !token ? "bg-gray-100 cursor-not-allowed" : ""}
>>>>>>> clean-reset
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
          <h1 className="text-xl sm:text-2xl font-bold">New Password</h1>
          <span className="text-gray-500 ">Set up your new password</span>
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
          {/* Password Input */}
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={passwordType}
                value={password}
                onChange={handleInputChange}
                onFocus={() => {
                  if (!areAllCriteriaMet) setIsPasswordFocused(true);
                }}
                onBlur={() => {
                  if (areAllCriteriaMet) setIsPasswordFocused(false);
                }}
                className={`${getInputClasses("password")} pr-10`}
                placeholder="Enter your password"
<<<<<<< HEAD
                disabled={isLoading || !oobCode}
=======
                disabled={isLoading || !token}
>>>>>>> clean-reset
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute top-2 sm:top-2.5 right-3 sm:right-4 text-gray-500 transition-colors duration-150 ${
<<<<<<< HEAD
                  isLoading || !oobCode
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:text-blue-600"
                }`}
                disabled={isLoading || !oobCode}
=======
                  isLoading || !token
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:text-blue-600"
                }`}
                disabled={isLoading || !token}
>>>>>>> clean-reset
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

            {/* Password Requirement Box */}
            {(!areAllCriteriaMet || isPasswordFocused) && (
              <div className="bg-gray-100 rounded-md flex flex-col gap-2 p-4 text-xs sm:text-sm mt-1">
                <p className="text-gray-700 font-semibold">
                  Password Requirements:
                </p>
                <ul>
                  {/* Logic for requirement color: green if met, gray if not */}
                  <li
                    className={
                      passwordCriteria.minLength
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    • Minimum <span className="font-medium">12 characters</span>
                  </li>
                  <li
                    className={
                      passwordCriteria.hasUpperCase
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    • Contains an{" "}
                    <span className="font-medium">uppercase letter</span>
                  </li>
                  <li
                    className={
                      passwordCriteria.hasLowerCase
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    • Contains a{" "}
                    <span className="font-medium">lowercase letter</span>
                  </li>
                  <li
                    className={
                      passwordCriteria.hasNumber
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    • Contains a <span className="font-medium">number</span>
                  </li>
                  <li
                    className={
                      passwordCriteria.hasSymbol
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    • Contains a{" "}
                    <span className="font-medium">symbol (e.g., @, !, #)</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="confirmPassword">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={confirmPasswordType}
                value={confirmPassword}
                onChange={handleInputChange}
                className={`${getInputClasses("confirmPassword")} pr-10`}
                placeholder="Re-enter your password"
<<<<<<< HEAD
                disabled={isLoading || !oobCode}
=======
                disabled={isLoading || !token}
>>>>>>> clean-reset
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className={`absolute top-2 sm:top-2.5 right-3 sm:right-4 text-gray-500 transition-colors duration-150 ${
<<<<<<< HEAD
                  isLoading || !oobCode
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:text-blue-600"
                }`}
                disabled={isLoading || !oobCode}
=======
                  isLoading || !token
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:text-blue-600"
                }`}
                disabled={isLoading || !token}
>>>>>>> clean-reset
              >
                {showConfirmPassword ? (
                  <Eye className="size-5" />
                ) : (
                  <EyeOff className="size-5" />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <span className="text-xs text-red-500">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <button
              type="submit"
<<<<<<< HEAD
              disabled={isLoading || !oobCode}
              className={`
                transition-colors duration-150 rounded-full px-4 py-2 text-center text-white mt-2 cursor-pointer flex items-center justify-center gap-2
                ${
                  isLoading || !oobCode
=======
              disabled={isLoading || !token}
              className={`
                transition-colors duration-150 rounded-full px-4 py-2 text-center text-white mt-2 cursor-pointer flex items-center justify-center gap-2
                ${
                  isLoading || !token
>>>>>>> clean-reset
                    ? "bg-blue-700/70 border-blue-700/70 cursor-not-allowed"
                    : "bg-blue-500 border-blue-500 hover:bg-blue-500/90 active:bg-blue-600 hover:border-blue-500/90 active:border-blue-600"
                }
              `}
            >
              {isLoading && <Loader2 className="size-5 animate-spin" />}
              <span>{isLoading ? "Resetting..." : "Reset password"}</span>
            </button>
            <Link
              href="/login"
              className={`
                border border-gray-300 px-4 py-2 rounded-full flex items-center justify-center gap-4 transition-colors duration-150 text-gray-700
                ${
<<<<<<< HEAD
                  isLoading || !oobCode
=======
                  isLoading || !token
>>>>>>> clean-reset
                    ? "bg-gray-100 cursor-not-allowed opacity-50 pointer-events-none"
                    : "hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                }
              `}
<<<<<<< HEAD
              aria-disabled={isLoading || !oobCode}
              tabIndex={isLoading || !oobCode ? -1 : 0}
=======
              aria-disabled={isLoading || !token}
              tabIndex={isLoading || !token ? -1 : 0}
>>>>>>> clean-reset
            >
              <span>Back to login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
