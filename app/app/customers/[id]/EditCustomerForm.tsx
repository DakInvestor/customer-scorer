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
  address: string | null;
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
  const [address, setAddress] = useState(customer.address || "");
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
          address: address.trim() || null,
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
        className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-charcoal hover:bg-cream"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-border bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-charcoal">Edit Customer</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-charcoal">
                  Full name <span className="text-critical">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-md border border-border bg-cream px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-charcoal">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md border border-border bg-cream px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-charcoal">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-border bg-cream px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
                />
              </div>

              <div className="border-t border-border pt-4">
                <p className="mb-3 text-sm font-medium text-text-secondary">Location</p>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main Street"
                      className="w-full rounded-md border border-border bg-cream px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
                    />
                    <p className="mt-1 text-xs text-text-muted">
                      Adding address enables property data lookup
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal">
                      City / Town
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-md border border-border bg-cream px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal">
                      State
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-md border border-border bg-cream px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
                    >
                      <option value="">Select state...</option>
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal">
                      County
                    </label>
                    <input
                      type="text"
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="w-full rounded-md border border-border bg-cream px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-md border border-critical/30 bg-critical/10 px-4 py-2 text-sm text-critical">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-copper py-2.5 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-lg border border-border bg-white py-2.5 font-semibold text-charcoal hover:bg-cream"
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