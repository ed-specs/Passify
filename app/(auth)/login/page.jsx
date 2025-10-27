"use client";

import { MessageCircleWarning, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function SignIn() {
  // toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const passwordType = showPassword ? "text" : "password";

  return (
    <div className="min-h-dvh p-3 sm:p-4 flex items-center justify-center text-sm sm:text-base">
      <div className="p-2 flex flex-col gap-5 w-full max-w-md">
        {/* Title */}
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Welcome to Passify</h1>
          <span className="text-gray-500 ">Sign in to your account</span>
        </div>
        {/* Validation message here. */}
        <div className="flex items-center gap-1 w-full px-3 sm:px-4 py-2 bg-red-100 rounded-md border-l-4 border-red-500 text-red-500">
          <MessageCircleWarning className="size-4 sm:size-5" />
          Validation message here
        </div>
        {/* form */}
        <form action="" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="" htmlFor="">
              Email
            </label>
            <input
              type="email"
              className="px-3 sm:px-4 py-2 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors duration-150 placeholder:text-gray-500"
              placeholder="Enter your email address"
            />
            <span className="text-xs text-red-500">Email required</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between ">
              <label htmlFor="">Password</label>
              <Link
                href="/forgot-password"
                className="text-gray-500 active:text-gray-600"
              >
                Forgot password
              </Link>
            </div>
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

            <span className="text-xs text-red-500">Password required</span>
          </div>

          <button className="border border-blue-500 hover:border-blue-500/90 active:border-blue-600 bg-blue-500 hover:bg-blue-500/90 active:bg-blue-600 transition-colors duration-150 rounded-full px-4 py-2 text-center text-white">
            Sign in
          </button>
        </form>

        {/* or */}
        <div className="flex items-center justify-center text-gray-500">or</div>

        {/* buttons */}
        <div className="flex flex-col gap-2">
          <button className=" border border-gray-300 hover:bg-gray-50 active:bg-gray-100 px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer">
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
            className=" border border-gray-300 hover:bg-gray-50 active:bg-gray-100 px-4 py-2 rounded-full flex items-center justify-center gap-4 transition-colors duration-150 cursor-pointer"
          >
            {/* logo */}
            <span>Create account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
