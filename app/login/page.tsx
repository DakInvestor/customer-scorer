// app/login/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if already logged in
  useEffect(() => {
    async function checkSession() {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.push("/");
        router.refresh();
      } else {
        setChecking(false);
      }
    }
    checkSession();
  }, [router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push("/");
      router.refresh();

    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show nothing while checking session
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to your Customer Scorer account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-md bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-slate-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-slate-600"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-900/50 px-4 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-white py-2.5 font-semibold text-slate-900 hover:bg-slate-100 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link href="/signup" className="text-white underline hover:no-underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}