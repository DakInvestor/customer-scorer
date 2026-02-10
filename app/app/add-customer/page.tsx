// app/add-customer/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { addCustomerAction, checkForDuplicateCustomer } from "./actions";

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
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [county, setCounty] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Duplicate detection state
  const [duplicateWarning, setDuplicateWarning] = useState<{
    existingCustomerId: string;
    matchedOn: string;
    existingCustomerName: string;
  } | null>(null);

  // Pre-fill from URL params (from network/property search)
  useEffect(() => {
    const nameParam = searchParams.get("name");
    const phoneParam = searchParams.get("phone");
    const emailParam = searchParams.get("email");
    const addressParam = searchParams.get("address");
    const cityParam = searchParams.get("city");
    const stateParam = searchParams.get("state");
    const countyParam = searchParams.get("county");

    if (nameParam) setFullName(nameParam);
    if (phoneParam) setPhone(phoneParam);
    if (emailParam) setEmail(emailParam);
    if (addressParam) setAddress(addressParam);
    if (cityParam) setCity(cityParam);
    if (stateParam) setState(stateParam);
    if (countyParam) setCounty(countyParam);
  }, [searchParams]);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setIsAuthenticated(true);
    }
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: FormEvent, skipDuplicateCheck: boolean = false) => {
    e.preventDefault();
    setErrorMsg(null);
    setDuplicateWarning(null);

    if (!fullName.trim()) {
      setErrorMsg("Name is required.");
      return;
    }

    if (!phone.trim() && !email.trim()) {
      setErrorMsg("Phone or email is required.");
      return;
    }

    try {
      setLoading(true);

      // Check for duplicates first (unless skipping)
      if (!skipDuplicateCheck) {
        const duplicateCheck = await checkForDuplicateCustomer(
          phone.trim() || null,
          email.trim() || null,
          address.trim() || null,
          fullName.trim()
        );

        if (duplicateCheck.isDuplicate && duplicateCheck.existingCustomerId) {
          setDuplicateWarning({
            existingCustomerId: duplicateCheck.existingCustomerId,
            matchedOn: duplicateCheck.matchedOn || "unknown",
            existingCustomerName: duplicateCheck.existingCustomerName || "Unknown",
          });
          setLoading(false);
          return;
        }
      }

      // Add the customer
      const result = await addCustomerAction(
        fullName.trim(),
        phone.trim() || null,
        email.trim() || null,
        address.trim() || null,
        city.trim() || null,
        state || null,
        county.trim() || null,
        skipDuplicateCheck
      );

      if (!result.success) {
        if (result.isDuplicate && result.existingCustomerId) {
          setDuplicateWarning({
            existingCustomerId: result.existingCustomerId,
            matchedOn: result.matchedOn || "unknown",
            existingCustomerName: result.error?.split(": ")[1] || "Unknown",
          });
        } else {
          setErrorMsg(result.error || "Failed to add customer.");
        }
        return;
      }

      router.push("/app/customers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-2 text-2xl font-bold text-charcoal">Add customer</h1>
      <p className="mb-6 text-sm text-text-muted">
        Create a new customer profile to start tracking their reliability.
      </p>

      {/* Duplicate Warning */}
      {duplicateWarning && (
        <div className="mb-6 rounded-xl border border-amber/30 bg-amber/10 p-5">
          <div className="flex items-start gap-4">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-charcoal">Possible duplicate customer</p>
              <p className="mt-1 text-sm text-text-secondary">
                A customer with the same <strong>{duplicateWarning.matchedOn}</strong> already exists:
              </p>
              <p className="mt-2 font-medium text-charcoal">
                {duplicateWarning.existingCustomerName}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/app/customers/${duplicateWarning.existingCustomerId}`}
                  className="rounded-lg bg-copper px-4 py-2 text-sm font-medium text-white hover:bg-copper-dark"
                >
                  View Existing Customer
                </Link>
                <button
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={loading}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Anyway"}
                </button>
                <button
                  onClick={() => setDuplicateWarning(null)}
                  className="rounded-lg px-4 py-2 text-sm text-text-muted hover:text-charcoal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)} className="max-w-lg space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">
            Full name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Smith"
            className="w-full rounded-md bg-surface px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full rounded-md bg-surface px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
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
              placeholder="john@example.com"
              className="w-full rounded-md bg-surface px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
            />
          </div>
        </div>

        <p className="text-xs text-text-muted">Phone or email is required</p>

        <div className="border-t border-border pt-4">
          <p className="mb-3 text-sm font-medium text-text-secondary">Location (optional)</p>

          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal">
              Street Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main Street"
              className="w-full rounded-md bg-surface px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
            />
            <p className="mt-1 text-xs text-text-muted">
              Adding an address enables property data lookup
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal">
                City / Town
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Springfield"
                className="w-full rounded-md bg-surface px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-md bg-surface px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
              >
                <option value="">Select state...</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-charcoal">
              County (optional)
            </label>
            <input
              type="text"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              placeholder="County name"
              className="w-full rounded-md bg-surface px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-md bg-critical/20 border border-critical/30 px-4 py-2 text-sm text-critical">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isAuthenticated}
          className="w-full rounded-md bg-copper py-2.5 font-semibold text-white hover:bg-copper-dark disabled:opacity-50 sm:w-auto sm:px-6"
        >
          {loading ? "Adding..." : "Add customer"}
        </button>
      </form>
    </div>
  );
}
