import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <div className="max-w-sm w-full text-center space-y-10">
        {/* Logo + tagline */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black text-3xl">
            🧭
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight">Navvy</h1>
            <p className="text-base text-gray-500 leading-relaxed">
              Your AI travel concierge. Describe your perfect day and get a
              full itinerary with a map — instantly.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link
            href="/signup"
            className="flex items-center justify-center w-full rounded-2xl bg-black px-6 py-4 text-sm font-semibold text-white hover:bg-gray-800 active:bg-gray-900 transition-colors shadow-sm"
          >
            Get started — it&apos;s free
          </Link>
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-gray-900 font-semibold underline underline-offset-2"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap justify-center gap-2">
          {["AI-powered", "Interactive map", "Real places", "Instant"].map(
            (tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    </main>
  );
}
