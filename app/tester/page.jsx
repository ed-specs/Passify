export default function Tester() {
  return (
    <div className="min-h-dvh p-3 sm:p-4 flex items-center justify-center text-sm sm:text-base">
      <div className="p-2 flex flex-col gap-5 w-full max-w-md">
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Welcome to Passify</h1>
          <span className="text-gray-500">
            Your account has been verified.
          </span>
        </div>
        {/* content */}
        <div className="flex items-center justify-center">
          <span className="text-gray-500 animate-pulse text-sm sm:text-sm">
            Redirecting...
          </span>
        </div>
      </div>
    </div>
  );
}
