import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">Navvy</h1>
          <p className="text-lg text-gray-500">
            Your personal AI concierge. Describe what you want to do and get a
            full itinerary in seconds.
          </p>
        </div>

        <Link
          href="/signup"
          className="inline-block w-full rounded-xl bg-black px-6 py-3.5 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          Get Started
        </Link>

        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-black underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
