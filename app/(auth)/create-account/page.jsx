"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebase"; // Assuming this path is correct
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth"; // ADD sendEmailVerification
import { doc, setDoc } from "firebase/firestore";
import {
  MessageCircleWarning,
  Eye,
  EyeOff,
  CircleCheckBig,
  Loader2, // Added for loading spinner (optional, but good UX)
} from "lucide-react";
import Link from "next/link";

export default function CreateAccount() {
  // navigation
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // NEW LOADING STATE

  // Form Data State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Error State for input fields
  const [errors, setErrors] = useState({});

  // Global Message State (only visible on submit)
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
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const passwordType = showPassword ? "text" : "password";
  const confirmPasswordType = showConfirmPassword ? "text" : "password";

  const passwordCriteria = useMemo(() => {
    return {
      minLength: formData.password.length >= 12,
      hasUpperCase: /[A-Z]/.test(formData.password),
      hasLowerCase: /[a-z]/.test(formData.password),
      hasNumber: /[0-9]/.test(formData.password),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
        formData.password
      ),
    };
  }, [formData.password]);

  const areAllCriteriaMet = Object.values(passwordCriteria).every(
    (value) => value === true
  );

  useEffect(() => {
    if (areAllCriteriaMet && isPasswordFocused) {
      setIsPasswordFocused(false);
    }
  }, [areAllCriteriaMet, isPasswordFocused]);

  // NEW: Email verification helper
  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user);
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
  };

  // --- VALIDATION AND SUBMISSION ---

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // ... (Validation logic remains the same) ...
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (!areAllCriteriaMet) {
      newErrors.password = "Password must meet all security criteria.";
      isValid = false;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

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

    setIsLoading(true); // START LOADING

    try {
      // 1. Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2. Send email verification link
      await sendVerificationEmail(user);

      // 3. Store additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        isVerified: false, // Initial verification status
        createdAt: new Date(),
      });

      // 4. Success Feedback & Redirect
      setGlobalMessage({
        type: "success",
        text:
          "Account created! A verification link has been sent to your email.",
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      // 5. Handle Firebase errors
      console.error("Firebase Sign-up Error:", error.code, error.message);
      let errorMessage = "An unknown error occurred. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email address is already in use.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is invalid.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email/password sign-in is not enabled in Firebase.";
      } else if (error.code === "permission-denied") {
        errorMessage = "A server error occurred. Check your Firestore Rules.";
      }

      setGlobalMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false); // STOP LOADING
    }
  };

  // --- JSX RENDER ---
  const getBorderClass = (fieldName) =>
    errors[fieldName]
      ? "border-red-500 focus:border-red-500"
      : isLoading
      ? "border-gray-300" // Disabled border
      : "border-gray-300 focus:border-blue-500"; // Normal border

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
          <span className="text-gray-500 ">Create your account</span>
        </div>

        {/* Validation message (Global) */}
        {globalMessage.text && (
          <div
            className={`flex items-center gap-2 w-full px-3 sm:px-4 py-2 rounded-md ${
              globalMessageClasses[globalMessage.type]
            }`}
          >
            <GlobalIcon className="size-4 sm:size-5" />
            <span>{globalMessage.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {/* First Name */}
            <div className="col-span-1 flex flex-col gap-1">
              <label className="font-medium" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className={getInputClasses("firstName")}
                placeholder="e.g. Juan"
                disabled={isLoading}
              />
              {errors.firstName && (
                <span className="text-xs text-red-500">{errors.firstName}</span>
              )}
            </div>
            {/* Last Name */}
            <div className="col-span-1 flex flex-col gap-1">
              <label className="font-medium" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                className={getInputClasses("lastName")}
                placeholder="e.g. Dela Cruz"
                disabled={isLoading}
              />
              {errors.lastName && (
                <span className="text-xs text-red-500">{errors.lastName}</span>
              )}
            </div>
          </div>
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
            <label className="font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={passwordType}
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => {
                  if (!areAllCriteriaMet) setIsPasswordFocused(true);
                }}
                onBlur={() => {
                  if (areAllCriteriaMet) setIsPasswordFocused(false);
                }}
                className={`${getInputClasses("password")} pr-10`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {/* toggle button for show password */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute top-0 right-3 sm:right-4 h-full text-gray-500 transition-colors duration-150 ${
                  isLoading
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:text-blue-600"
                }`}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>

            {/* Password Validation Error */}
            {errors.password && (
              <span className="text-xs text-red-500">{errors.password}</span>
            )}

            {/* Password Requirement Box (Conditional Visibility) */}
            {(!areAllCriteriaMet || isPasswordFocused) && (
              <div className="bg-gray-100 rounded-md flex flex-col gap-2 p-4 text-xs sm:text-sm mt-1">
                <p className="text-gray-700 font-semibold">
                  Password Requirements:
                </p>
                <ul>
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
          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="confirmPassword">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={confirmPasswordType}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`${getInputClasses("confirmPassword")} pr-10`}
                placeholder="Re-enter your password"
                disabled={isLoading}
              />
              {/* toggle button for show password */}
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className={`absolute top-0 right-3 sm:right-4 h-full text-gray-500 transition-colors duration-150 ${
                  isLoading
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:text-blue-600"
                }`}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <span className="text-xs text-red-500">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`
                transition-colors duration-150 rounded-full px-4 py-2 text-center text-white mt-2 font-semibold cursor-pointer flex items-center justify-center gap-2
                ${
                  isLoading
                    ? "bg-blue-700 border-blue-700 cursor-not-allowed" // Loading state styles
                    : "bg-blue-500 border-blue-500 hover:bg-blue-500/90 active:bg-blue-600 hover:border-blue-500/90 active:border-blue-600"
                }
              `}
            >
              {isLoading && <Loader2 className="size-5 animate-spin" />}
              <span>
                {isLoading ? "Creating account..." : "Create account"}
              </span>
            </button>
            <Link
              href="/login"
              className={`
                border rounded-full px-4 py-2 flex items-center justify-center gap-4 transition-colors duration-150 cursor-pointer text-gray-700 font-medium
                ${
                  isLoading
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed pointer-events-none"
                    : "border-gray-300 hover:bg-gray-50 active:bg-gray-100"
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
