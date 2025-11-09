"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

  const oobCode = searchParams.get("oobCode");
  const token = searchParams.get("token");

  // STATE
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [globalMessage, setGlobalMessage] = useState({ type: "", text: "" });

  // Missing OOB code check
  useEffect(() => {
    if (!oobCode) {
      setGlobalMessage({
        type: "error",
        text: "Invalid or missing password reset code. Please start again.",
      });
    }
  }, [oobCode]);

  // Token check
  useEffect(() => {
    if (!token) {
      setGlobalMessage({
        type: "error",
        text: "Invalid or missing password reset token.",
      });
    }
  }, [token]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const passwordCriteria = useMemo(
    () => ({
      minLength: password.length >= 12,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    }),
    [password]
  );

  const areAllCriteriaMet = Object.values(passwordCriteria).every(Boolean);

  const validateForm = () => {
    let newErrors = {};
    let valid = true;

    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (!areAllCriteriaMet) {
      newErrors.password = "Password does not meet requirements.";
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm your password.";
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalMessage({ type: "", text: "" });

    if (!oobCode) {
      setGlobalMessage({
        type: "error",
        text: "Missing reset code.",
      });
      return;
    }

    if (!token) {
      setGlobalMessage({
        type: "error",
        text: "Missing reset token.",
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
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
        text: "Password updated! Redirecting...",
      });

      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setGlobalMessage({
        type: "error",
        text: err.message || "Password reset failed.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // UI Helpers
  const inputDisabled = isLoading || !oobCode || !token;

  const getInputClass = (field) =>
    `px-3 py-2 w-full rounded-md border ${
      errors[field] ? "border-red-500" : "border-gray-300"
    } ${
      inputDisabled ? "bg-gray-100 cursor-not-allowed" : "focus:border-blue-500"
    }`;

  return (
    <div className="min-h-dvh p-4 flex items-center justify-center">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">New Password</h1>
          <p className="text-gray-500">Set your new password</p>
        </div>

        {/* Global message */}
        {globalMessage.text && (
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-md ${
              globalMessage.type === "success"
                ? "bg-green-100 border-l-4 border-green-500 text-green-700"
                : "bg-red-100 border-l-4 border-red-500 text-red-700"
            }`}
          >
            {globalMessage.type === "success" ? (
              <CircleCheckBig className="size-5" />
            ) : (
              <MessageCircleWarning className="size-5" />
            )}
            <span>{globalMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handleInputChange}
                disabled={inputDisabled}
                className={`${getInputClass("password")} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                disabled={inputDisabled}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>

            {errors.password && (
              <span className="text-xs text-red-500">{errors.password}</span>
            )}

            {(!areAllCriteriaMet || isPasswordFocused) && (
              <div className="bg-gray-100 rounded-md p-3 text-sm flex flex-col gap-1">
                <p className="font-semibold text-gray-700">
                  Password Requirements:
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li className={passwordCriteria.minLength ? "text-green-600" : ""}>
                    • At least 12 characters
                  </li>
                  <li className={passwordCriteria.hasUpperCase ? "text-green-600" : ""}>
                    • Uppercase letter
                  </li>
                  <li className={passwordCriteria.hasLowerCase ? "text-green-600" : ""}>
                    • Lowercase letter
                  </li>
                  <li className={passwordCriteria.hasNumber ? "text-green-600" : ""}>
                    • Number
                  </li>
                  <li className={passwordCriteria.hasSymbol ? "text-green-600" : ""}>
                    • Symbol (@, !, #, etc.)
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Confirm Password</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleInputChange}
                disabled={inputDisabled}
                className={`${getInputClass("confirmPassword")} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                disabled={inputDisabled}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showConfirmPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>

            {errors.confirmPassword && (
              <span className="text-xs text-red-500">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={inputDisabled}
              className={`rounded-full py-2 text-white flex justify-center items-center gap-2 ${
                inputDisabled
                  ? "bg-blue-700/60 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isLoading && <Loader2 className="size-5 animate-spin" />}
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            <Link
              href="/login"
              className={`border border-gray-300 rounded-full py-2 text-center ${
                inputDisabled
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:bg-gray-50"
              }`}
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
