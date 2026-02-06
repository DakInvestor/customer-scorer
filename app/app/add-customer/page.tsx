// app/add-customer/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

export default function AddCustomerPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [county, setCounty] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

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

    if (!fullName.trim()) {
      setErrorMsg("Name is required.");
      return;
    }

    if (!phone.trim() && !email.trim()) {
      setErrorMsg("Phone or email is required.");
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
        phone: phone.trim() || null,
        city: city.trim() || null,
        state: state || null,
        county: county.trim() || null,
        business_id: businessId,
      });

      if (error) {
        console.error("Error inserting customer:", error);
        setErrorMsg(error.message || "Failed to add customer.");
        return;
      }

      router.push("/customers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-2 text-2xl font-bold">Add customer</h1>
      <p className="mb-6 text-sm text-gray-400">
        Create a new customer profile to start tracking their reliability.
      </p>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-200">
            Full name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Smith"
            className="w-full rounded-md bg-gray-800 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-200">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full rounded-md bg-gray-800 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full rounded-md bg-gray-800 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500">Phone or email is required</p>

        <div className="border-t border-gray-700 pt-4">
          <p className="mb-3 text-sm font-medium text-gray-300">Location (optional)</p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-200">
                City / Town
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Springfield"
                className="w-full rounded-md bg-gray-800 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-200">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-md bg-gray-800 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-600"
              >
                <option value="">Select state...</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-200">
              County (optional)
            </label>
            <input
              type="text"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              placeholder="County name"
              className="w-full rounded-md bg-gray-800 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-md bg-red-900/50 px-4 py-2 text-sm text-red-200">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !businessId}
          className="w-full rounded-md bg-white py-2.5 font-semibold text-gray-900 hover:bg-gray-100 disabled:opacity-50 sm:w-auto sm:px-6"
        >
          {loading ? "Adding..." : "Add customer"}
        </button>
      </form>
    </div>
  );
}