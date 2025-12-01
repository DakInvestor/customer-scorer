// app/signup/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !businessName.trim()) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();

      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!authData.user) {
        setError("Signup failed. Please try again.");
        return;
      }

      const userId = authData.user.id;

      // 2. Create the business
      const { data: business, error: businessError } = await supabase
        .from("businesses")
        .insert({
          owner_user_id: userId,
          name: businessName.trim(),
        })
        .select()
        .single();

      if (businessError) {
        console.error("Error creating business:", businessError);
        setError("Account created but failed to set up business. Please contact support.");
        return;
      }

      // 3. Check if profile exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ business_id: business.id })
          .eq("id", userId);

        if (profileError) {
          console.error("Error updating profile:", profileError);
        }
      } else {
        // Create new profile
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            business_id: business.id,
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      // Success - redirect to dashboard
      router.push("/");
      router.refresh();

    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Start tracking customer reliability in minutes
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">
              Business name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Acme HVAC Services"
              className="w-full rounded-md bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-slate-600"
            />
          </div>

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
            <p className="mt-1 text-xs text-slate-500">At least 6 characters</p>
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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-white underline hover:no-underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}