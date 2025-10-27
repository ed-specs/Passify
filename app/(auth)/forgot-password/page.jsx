import { CircleCheck, MessageCircleWarning } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  return (
    <div className="min-h-dvh p-3 sm:p-4 flex items-center justify-center text-sm sm:text-base">
      <div className="p-2 flex flex-col gap-5 w-full max-w-md">
        {/* Title */}
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Forgot Password</h1>
          <span className="text-gray-500 ">
            Enter your registered email
          </span>
        </div>
        {/* Validation message here. */}
        <div className="flex items-center gap-1 w-full px-3 sm:px-4 py-2 bg-red-100 rounded-md border-l-4 border-red-500 text-red-500">
          <MessageCircleWarning className="size-4 sm:size-5"/>
          Validation message here
        </div>
        {/* form */}
        <form action="" className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="" htmlFor="">
              Email
            </label>
            <input
              type="email"
              className="px-4 py-2 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition-colors duration-150 placeholder:text-gray-500"
              placeholder="Enter your email address"
            />
            <span className="text-xs text-red-500">Email required</span>
          </div>

          <div className="flex flex-col gap-2">
            <button className="border border-blue-500 hover:border-blue-500/90 active:border-blue-600 bg-blue-500 hover:bg-blue-500/90 active:bg-blue-600 transition-colors duration-150 rounded-full px-4 py-2 text-center text-white mt-2 cursor-pointer">
              Reset password
            </button>

            <Link
              href="/login"
              className=" border border-gray-300 hover:bg-gray-50 active:bg-gray-100 px-4 py-2 rounded-full flex items-center justify-center gap-4 transition-colors duration-150 cursor-pointer"
            >
              {/* logo */}
              <span>Back to sign in</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
