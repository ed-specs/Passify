import Link from "next/link";

export default function ResetPassword() {
  return (
    <div className="min-h-dvh p-4 flex items-center justify-center">
      <div className="p-2 flex flex-col gap-6 w-full">
        {/* Title */}
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-2xl font-bold">New Password</h1>
          <span className="text-gray-500 text-sm">
            Set up your new password
          </span>
        </div>
        {/* Validation message here. either red or green depending on the message */}
        <div className="flex w-full px-4 py-2 bg-green-100 rounded-lg text-green-500">
          Validation message here
        </div>
        {/* form */}
        <form action="" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm" htmlFor="">
              Password
            </label>
            <input
              type="password"
              className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-green-500 transition-colors duration-150 placeholder:text-gray-500"
              placeholder="Enter your password"
            />
            <div className="bg-gray-100 rounded-lg flex flex-col gap-2 p-4">
              <ul className="text-sm">
                <li className="text-gray-500">• At least 12 characters</li>
                <li className="text-gray-500">• One uppercase letter</li>
                <li className="text-gray-500">• One lowercase letter</li>
                <li className="text-gray-500">• One number</li>
                <li className="text-gray-500">• One special character</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm" htmlFor="">
              Confirm password
            </label>
            <input
              type="password"
              className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-green-500 transition-colors duration-150 placeholder:text-gray-500"
              placeholder="Re-enter your password"
            />
          </div>

          <div className="flex flex-col gap-2">
            <button className=" bg-green-500 active:bg-green-600 rounded-lg px-4 py-2 text-center text-white mt-2">
              Reset password
            </button>
            <Link
              href="/login"
              className=" border border-gray-300 px-4 py-2 rounded-lg flex items-center justify-center gap-4 transition-colors duration-150 active:bg-gray-100"
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
