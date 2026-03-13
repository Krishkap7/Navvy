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
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    document.cookie = `navvy_user=${encodeURIComponent(email)}; path=/; max-age=${60 * 60 * 24 * 7}`;
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center space-y-1">
          <Link href="/" className="text-2xl font-bold">
            Navvy
          </Link>
          <h2 className="text-lg text-gray-500">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading
              ? "..."
              : mode === "signup"
                ? "Sign up"
                : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-black underline">
                Log in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-black underline">
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
