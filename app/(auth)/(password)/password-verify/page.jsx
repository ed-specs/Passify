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
