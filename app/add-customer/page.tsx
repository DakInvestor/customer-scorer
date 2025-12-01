// app/add-customer/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AddCustomerPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  // Get business_id on mount
  useEffect(() => {
    async function getBusinessId() {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id")
        .eq("id", user.id)
        .single();

      if (profile?.business_id) {
        setBusinessId(profile.business_id);
      }
    }
    getBusinessId();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg("Name and phone are required.");
      return;
    }

    if (!businessId) {
      setErrorMsg("Business not found. Please try logging in again.");
      return;
    }

    try {
      setLoading(true);

      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase.from("customers").insert({
        full_name: fullName.trim(),
        email: email.trim() || null,
        phone: phone.trim(),
        business_id: businessId,
      });

      if (error) {
        console.error("Error inserting customer:", error);
        setErrorMsg(error.message || "Failed to add customer.");
        return;
      }

      setFullName("");
      setEmail("");
      setPhone("");
      router.push("/customers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Add customer</h1>
      <p className="mb-6 text-sm text-gray-300">
        Create a new customer profile to start tracking their reliability.
      </p>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-100">
            Full name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Smith"
            className="w-full rounded bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-100">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full rounded bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-100">
            Phone <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full rounded bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>

        {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading || !businessId}
          className="rounded bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-white disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add customer"}
        </button>
      </form>
    </div>
  );
}