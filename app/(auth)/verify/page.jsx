import Link from "next/link";

export default function Verify() {
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="p-2 flex flex-col gap-6 w-full">
        {/* Title */}
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Password Reset</h1>
          <span className="text-gray-500 text-sm">
            We sent a code to <span className="text-green-500 font-semibold">name@example.com</span>
          </span>
        </div>
        {/* Validation message here. either red or green depending on the message */}
        <div className="flex w-full px-4 py-2 bg-green-100 rounded-lg text-green-500">
          Validation message here
        </div>
        {/* form */}
        <form action="" className="flex flex-col gap-4">
          <div className="grid grid-cols-6 gap-2">
            <input
              type="number"
              className="col-span-1 px-4 py-4 text-center rounded-lg border border-gray-300 outline-none focus:border-green-500 transition-colors duration-150 placeholder:text-gray-500"
            />
            <input
              type="number"
              className="col-span-1 px-4 py-4 text-center rounded-lg border border-gray-300 outline-none focus:border-green-500 transition-colors duration-150 placeholder:text-gray-500"
            />
            <input
              type="number"
              className="col-span-1 px-4 py-4 text-center rounded-lg border border-gray-300 outline-none focus:border-green-500 transition-colors duration-150 placeholder:text-gray-500"
            />
            <input
              type="number"
              className="col-span-1 px-4 py-4 text-center rounded-lg border border-gray-300 outline-none focus:border-green-500 transition-colors duration-150 placeholder:text-gray-500"
            />
            <input
              type="number"
              className="col-span-1 px-4 py-4 text-center rounded-lg border border-gray-300 outline-none focus:border-green-500 transition-colors duration-150 placeholder:text-gray-500"
            />
            <input
              type="number"
              className="col-span-1 px-4 py-4 text-center rounded-lg border border-gray-300 outline-none focus:border-green-500 transition-colors duration-150 placeholder:text-gray-500"
            />
          </div>
          <div className="flex items-center justify-center">
            <span className="text-gray-500 text-sm">Didn't receive the email? <span className="text-green-500 active:text-green-600">Click here</span></span>
          </div>

          <div className="flex flex-col gap-2">
            <button className=" bg-green-500 active:bg-green-600 rounded-lg px-4 py-2 text-center text-white mt-2">
              Continue
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
