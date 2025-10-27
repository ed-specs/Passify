"use client";

import { MessageCircleWarning, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
export default function ResetPassword() {
  // toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const passwordType = showPassword ? "text" : "password";
  const confirmPasswordType = showConfirmPassword ? "text" : "password";

  return (
    <div className="min-h-dvh p-3 sm:p-4 flex items-center justify-center text-sm sm:text-base">
      <div className="p-2 flex flex-col gap-5 w-full max-w-md">
        {/* Title */}
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">New Password</h1>
          <span className="text-gray-500 ">Set up your new password</span>
        </div>
        {/* Validation message here. */}
        <div className="flex items-center gap-1 w-full px-3 sm:px-4 py-2 bg-red-100 rounded-md border-l-4 border-red-500 text-red-500">
          <MessageCircleWarning className="size-4 sm:size-5" />
          Validation message here
        </div>
        {/* form */}
        <form action="" className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="" htmlFor="">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordType}
                className="px-3 sm:px-4 py-2 w-full rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors duration-150 placeholder:text-gray-500"
                placeholder="Enter your password"
              />
              {/* toggle button for show password */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-0 right-3 sm:right-4 h-full active:text-blue-600 transition-colors duration-150"
              >
                {showPassword ? (
                  <Eye className="size-5" />
                ) : (
                  <EyeOff className="size-5" />
                )}
              </button>
            </div>

            {/* will show depending on the situation */}
            <span className="text-xs text-red-500">Password required</span>

            <div className="bg-gray-100 rounded-md flex flex-col gap-2 p-4 text-xs sm:text-sm mt-1">
              <ul className="">
                <li className="text-gray-500">• At least 12 characters</li>
                <li className="text-gray-500">• One uppercase letter</li>
                <li className="text-gray-500">• One lowercase letter</li>
                <li className="text-gray-500">• One number</li>
                <li className="text-gray-500">• One special character</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="" htmlFor="">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={confirmPasswordType}
                className="px-3 sm:px-4 py-2 w-full rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors duration-150 placeholder:text-gray-500"
                placeholder="Re-enter your password"
              />
              {/* toggle button for show password */}
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute top-0 right-3 sm:right-4 h-full active:text-blue-600 transition-colors duration-150"
              >
                {showConfirmPassword ? (
                  <Eye className="size-5" />
                ) : (
                  <EyeOff className="size-5" />
                )}
              </button>
            </div>

            <span className="text-xs text-red-500">
              Confirm password required
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <button className="border border-blue-500 hover:border-blue-500/90 active:border-blue-600 bg-blue-500 hover:bg-blue-500/90 active:bg-blue-600 transition-colors duration-150 rounded-full px-4 py-2 text-center text-white">
              Reset password
            </button>
            <Link
              href="/login"
              className=" border border-gray-300 px-4 py-2 rounded-full flex items-center justify-center gap-4 transition-colors duration-150 active:bg-gray-100"
            >
              {/* logo */}
              <span>Back to login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
