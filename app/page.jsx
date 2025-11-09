import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-dvh p-4 flex items-center justify-center">
      <div className="p-2 flex flex-col gap-6 w-full">
        {/* Title */}
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-xl font-bold">Welcome to Passify</h1>
          <span className="text-gray-500 text-sm">A password manager web app designed for my mahal</span>
        </div>

      </div>
    </div>
  );
}
