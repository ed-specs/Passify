import Link from "next/link";

export default function SignIn() {
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="p-2 flex flex-col gap-6 w-full">
        {/* Title */}
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome to Passify</h1>
          <span className="text-gray-500 text-sm">Sign in to your account</span>
        </div>
        {/* Validation message here. either red or green depending on the message */}
        <div className="flex w-full px-4 py-2 bg-green-100 rounded-lg text-green-500">
          Validation message here
        </div>
        {/* form */}
        <form action="" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm" htmlFor="">
              Email
            </label>
            <input
              type="email"
              className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-green-500 transition-colors duration-150 placeholder:text-gray-500"
              placeholder="Enter your email address"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="">Password</label>
              <Link href="/forgot-password" className="text-gray-500 active:text-gray-600">
                Forgot password
              </Link>
            </div>
            <input
              type="password"
              className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-green-500 transition-colors duration-150 placeholder:text-gray-500"
              placeholder="Enter your password"
            />
          </div>

          <button className=" bg-green-500 active:bg-green-600 rounded-lg px-4 py-2 text-center text-white mt-2">
            Sign in
          </button>
        </form>

        {/* or */}
        <div className="flex items-center justify-center text-gray-500">or</div>

        {/* buttons */}
        <div className="flex flex-col gap-4">
          <button className=" border border-gray-300 px-4 py-2 rounded-lg flex items-center justify-center gap-4 transition-colors duration-150 active:bg-gray-100">
            {/* logo */}
            <span>Sign in with Google</span>
          </button>
          <Link
            href="/create-account"
            className=" border border-gray-300 px-4 py-2 rounded-lg flex items-center justify-center gap-4 transition-colors duration-150 active:bg-gray-100"
          >
            {/* logo */}
            <span>Create account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
