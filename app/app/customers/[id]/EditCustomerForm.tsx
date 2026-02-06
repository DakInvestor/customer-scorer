// app/customers/[id]/EditCustomerForm.tsx
"use client";

import { useState, FormEvent } from "react";
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

type Customer = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  county: string | null;
};

type Props = {
  customer: Customer;
};

export default function EditCustomerForm({ customer }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState(customer.full_name || "");
  const [email, setEmail] = useState(customer.email || "");
  const [phone, setPhone] = useState(customer.phone || "");
  const [city, setCity] = useState(customer.city || "");
  const [state, setState] = useState(customer.state || "");
  const [county, setCounty] = useState(customer.county || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Name is required.");
      return;
    }

    if (!phone.trim() && !email.trim()) {
      setError("Phone or email is required.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const { error: updateError } = await supabase
        .from("customers")
        .update({
          full_name: fullName.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
          city: city.trim() || null,
          state: state || null,
          county: county.trim() || null,
        })
        .eq("id", customer.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Failed to update customer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Edit customer</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Full name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-md bg-gray-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md bg-gray-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md bg-gray-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div className="border-t border-gray-700 pt-4">
                <p className="mb-3 text-sm font-medium text-gray-400">Location</p>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-300">
                      City / Town
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-md bg-gray-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-300">
                      State
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-md bg-gray-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="">Select state...</option>
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-300">
                      County
                    </label>
                    <input
                      type="text"
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="w-full rounded-md bg-gray-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-900/50 px-4 py-2 text-sm text-red-200">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-md bg-white py-2.5 font-semibold text-gray-900 hover:bg-gray-100 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-md bg-gray-700 py-2.5 font-semibold hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}