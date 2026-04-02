"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    document.cookie = `navvy_user=${encodeURIComponent(email)}; path=/; max-age=${
      60 * 60 * 24 * 7
    }`;
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <div className="max-w-sm w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-1">
          <Link
            href="/"
            className="inline-block text-2xl font-bold hover:opacity-70 transition-opacity"
          >
            Navvy
          </Link>
          <p className="text-gray-500 text-sm">
            {mode === "signup"
              ? "Create your account to get started"
              : "Welcome back"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
          />

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-2.5">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-black px-6 py-3.5 text-sm font-semibold text-white hover:bg-gray-800 active:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {loading
              ? "..."
              : mode === "signup"
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-center text-sm text-gray-400">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-gray-900 font-medium underline underline-offset-2"
              >
                Log in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-gray-900 font-medium underline underline-offset-2"
              >
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
