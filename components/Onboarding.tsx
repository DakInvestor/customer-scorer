"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { INDUSTRIES, INDUSTRY_CATEGORIES, type BusinessIndustry } from "@/lib/industry-types";

type Props = {
  businessId: string;
  initialStep: number;
};

type Customer = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
};

type NetworkResult = {
  id: string;
  severity: number;
  note_type: string | null;
  created_at: string;
  businesses: { name: string } | { name: string }[] | null;
};

export default function Onboarding({ businessId, initialStep }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(initialStep || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 2: Industry Selection
  const [selectedIndustry, setSelectedIndustry] = useState<BusinessIndustry | "">("");

  // Step 3: Add Customer
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [createdCustomer, setCreatedCustomer] = useState<Customer | null>(null);

  // Step 5: Network Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NetworkResult[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const supabase = createSupabaseBrowserClient();

  // Group industries by category
  const groupedIndustries = INDUSTRIES.reduce((acc, industry) => {
    const category = industry.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(industry);
    return acc;
  }, {} as Record<string, typeof INDUSTRIES[number][]>);

  async function handleIndustrySelect() {
    if (!selectedIndustry) {
      setError("Please select your industry");
      return;
    }

    setLoading(true);
    setError("");

    const { error: updateError } = await supabase
      .from("businesses")
      .update({ industry: selectedIndustry })
      .eq("id", businessId);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    await updateOnboardingStep(3);
    setLoading(false);
    setStep(3);
  }

  async function updateOnboardingStep(newStep: number) {
    await supabase
      .from("businesses")
      .update({ onboarding_step: newStep })
      .eq("id", businessId);
  }

  async function completeOnboarding() {
    setLoading(true);
    await supabase
      .from("businesses")
      .update({ onboarding_completed: true, onboarding_step: 6 })
      .eq("id", businessId);
    router.refresh();
  }

  async function handleAddCustomer() {
    setError("");

    if (!customerName.trim()) {
      setError("Name is required");
      return;
    }
    if (!customerPhone.trim()) {
      setError("Phone is required");
      return;
    }

    setLoading(true);

    const { data, error: insertError } = await supabase
      .from("customers")
      .insert({
        full_name: customerName.trim(),
        phone: customerPhone.trim(),
        email: customerEmail.trim() || null,
        business_id: businessId,
      })
      .select("id, full_name, phone, email")
      .single();

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setCreatedCustomer(data);
    await updateOnboardingStep(4);
    setStep(4);
  }

  async function handleLogEvent(noteType: string, severity: number) {
    if (!createdCustomer) return;

    setLoading(true);

    await supabase.from("customer_notes").insert({
      customer_id: createdCustomer.id,
      business_id: businessId,
      note_type: noteType,
      severity: severity,
      content: `Logged during onboarding: ${noteType}`,
    });

    await updateOnboardingStep(5);
    setLoading(false);
    setStep(5);
  }

  async function handleNetworkSearch() {
    if (!searchQuery.trim()) {
      setError("Enter a phone number or email to search");
      return;
    }

    setLoading(true);
    setError("");

    const query = searchQuery.trim().toLowerCase();

    // Search network reports by phone or email
    const { data } = await supabase
      .from("network_reports")
      .select(`
        id,
        severity,
        note_type,
        created_at,
        businesses:business_id (name)
      `)
      .or(`phone.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(5);

    setSearchResults((data as unknown as NetworkResult[]) || []);
    setHasSearched(true);

    // Mark that they've searched
    await supabase
      .from("businesses")
      .update({ has_searched_network: true })
      .eq("id", businessId);

    await updateOnboardingStep(6);
    setLoading(false);
  }

  async function skipToStep(nextStep: number) {
    await updateOnboardingStep(nextStep);
    setStep(nextStep);
  }

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 border-b border-border px-6 py-4">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-2 w-6 rounded-full transition-colors ${
                s <= step ? "bg-copper" : "bg-surface"
              }`}
            />
          ))}
        </div>

        <div className="p-6">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="mb-4 text-4xl">Welcome!</div>
              <h2 className="mb-2 text-2xl font-bold text-charcoal">
                Welcome to ForSure!
              </h2>
              <p className="mb-6 text-text-secondary">
                Let&apos;s get you set up in under 2 minutes.
              </p>
              <p className="mb-8 text-sm text-text-muted">
                ForSure helps you track customer reliability and find qualified leads
                based on your industry.
              </p>
              <button
                onClick={() => {
                  updateOnboardingStep(2);
                  setStep(2);
                }}
                className="w-full rounded-xl bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark"
              >
                Let&apos;s Go
              </button>
            </div>
          )}

          {/* Step 2: Industry Selection */}
          {step === 2 && (
            <div>
              <h2 className="mb-2 text-xl font-bold text-charcoal">
                What&apos;s your industry?
              </h2>
              <p className="mb-6 text-sm text-text-secondary">
                This unlocks tools and leads specific to your trade.
              </p>

              <div className="max-h-64 overflow-y-auto space-y-4">
                {Object.entries(groupedIndustries).map(([category, industries]) => (
                  <div key={category}>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
                      {INDUSTRY_CATEGORIES[category as keyof typeof INDUSTRY_CATEGORIES]}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {industries.map((industry) => (
                        <button
                          key={industry.value}
                          onClick={() => setSelectedIndustry(industry.value)}
                          className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors ${
                            selectedIndustry === industry.value
                              ? "border-copper bg-copper/10 text-copper"
                              : "border-border bg-white hover:border-copper/50"
                          }`}
                        >
                          <span>{industry.icon}</span>
                          <span className="font-medium">{industry.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <p className="mt-4 text-sm text-critical">{error}</p>
              )}

              <button
                onClick={handleIndustrySelect}
                disabled={loading || !selectedIndustry}
                className="mt-6 w-full rounded-xl bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
              >
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          )}

          {/* Step 3: Add First Customer */}
          {step === 3 && (
            <div>
              <h2 className="mb-2 text-xl font-bold text-charcoal">
                Add your first customer
              </h2>
              <p className="mb-6 text-sm text-text-secondary">
                Start tracking reliability by adding a customer.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-charcoal">
                    Name <span className="text-critical">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-charcoal placeholder-text-muted outline-none focus:border-copper"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-charcoal">
                    Phone <span className="text-critical">*</span>
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(formatPhone(e.target.value))}
                    placeholder="(555) 123-4567"
                    className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-charcoal placeholder-text-muted outline-none focus:border-copper"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-charcoal">
                    Email <span className="text-text-muted">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-charcoal placeholder-text-muted outline-none focus:border-copper"
                  />
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-critical">{error}</p>
              )}

              <button
                onClick={handleAddCustomer}
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Customer"}
              </button>

              <button
                onClick={() => skipToStep(4)}
                className="mt-3 w-full text-sm text-text-muted hover:text-text-secondary"
              >
                I&apos;ll do this later
              </button>
            </div>
          )}

          {/* Step 4: Log First Event */}
          {step === 4 && (
            <div>
              <h2 className="mb-2 text-xl font-bold text-charcoal">
                How has this customer been?
              </h2>
              {createdCustomer ? (
                <p className="mb-6 text-sm text-text-secondary">
                  Log an event for{" "}
                  <span className="font-medium text-charcoal">
                    {createdCustomer.full_name}
                  </span>
                </p>
              ) : (
                <p className="mb-6 text-sm text-text-secondary">
                  Log your first customer event to start tracking reliability.
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleLogEvent("Completed Job", 1)}
                  disabled={loading}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 text-charcoal hover:border-emerald hover:bg-emerald/5 disabled:opacity-50"
                >
                  <span className="text-2xl">✅</span>
                  <span className="text-sm font-medium">Completed Job</span>
                </button>

                <button
                  onClick={() => handleLogEvent("No-Show", 5)}
                  disabled={loading}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 text-charcoal hover:border-critical hover:bg-critical/5 disabled:opacity-50"
                >
                  <span className="text-2xl">❌</span>
                  <span className="text-sm font-medium">No-Show</span>
                </button>

                <button
                  onClick={() => handleLogEvent("Late Payment", 4)}
                  disabled={loading}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 text-charcoal hover:border-amber hover:bg-amber/5 disabled:opacity-50"
                >
                  <span className="text-2xl">💰</span>
                  <span className="text-sm font-medium">Late Payment</span>
                </button>

                <button
                  onClick={() => handleLogEvent("Great Customer", 1)}
                  disabled={loading}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 text-charcoal hover:border-emerald hover:bg-emerald/5 disabled:opacity-50"
                >
                  <span className="text-2xl">⭐</span>
                  <span className="text-sm font-medium">Great Customer</span>
                </button>
              </div>

              <button
                onClick={() => skipToStep(5)}
                className="mt-6 w-full text-sm text-text-muted hover:text-text-secondary"
              >
                Skip for now
              </button>
            </div>
          )}

          {/* Step 5: Network Search */}
          {step === 5 && (
            <div>
              <h2 className="mb-2 text-xl font-bold text-charcoal">
                See if a customer is in the network
              </h2>
              <p className="mb-6 text-sm text-text-secondary">
                Search the ForSure network to see if other businesses have
                worked with this person.
              </p>

              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter phone or email..."
                  className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-charcoal placeholder-text-muted outline-none focus:border-copper"
                />
              </div>

              {error && <p className="mb-4 text-sm text-critical">{error}</p>}

              {hasSearched && (
                <div className="mb-4 rounded-lg bg-surface p-4">
                  {searchResults && searchResults.length > 0 ? (
                    <div>
                      <p className="mb-2 text-sm font-medium text-charcoal">
                        Found {searchResults.length} report(s)
                      </p>
                      {searchResults.map((result) => {
                        const businessName = Array.isArray(result.businesses)
                          ? result.businesses[0]?.name
                          : result.businesses?.name;
                        return (
                          <div
                            key={result.id}
                            className="border-t border-border py-2 text-sm"
                          >
                            <span className="text-text-secondary">
                              {result.note_type || "Event"} from{" "}
                              {businessName || "Unknown Business"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-text-secondary">
                        No network history found yet.
                      </p>
                      <p className="mt-1 text-xs text-text-muted">
                        As more businesses join ForSure, the network gets more
                        valuable!
                      </p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={hasSearched ? () => setStep(6) : handleNetworkSearch}
                disabled={loading}
                className="w-full rounded-xl bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
              >
                {loading
                  ? "Searching..."
                  : hasSearched
                  ? "Continue"
                  : "Search Network"}
              </button>

              <button
                onClick={() => skipToStep(6)}
                className="mt-3 w-full text-sm text-text-muted hover:text-text-secondary"
              >
                Skip for now
              </button>
            </div>
          )}

          {/* Step 6: All Done */}
          {step === 6 && (
            <div className="text-center">
              <div className="mb-4 text-4xl">🚀</div>
              <h2 className="mb-2 text-2xl font-bold text-charcoal">
                You&apos;re all set!
              </h2>
              <p className="mb-6 text-text-secondary">
                Here&apos;s what you can do next:
              </p>

              <div className="mb-6 space-y-3">
                <Link
                  href="/app/import"
                  className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 text-left hover:border-copper hover:bg-cream"
                >
                  <span className="text-xl">📥</span>
                  <div>
                    <p className="font-medium text-charcoal">
                      Import your customer list
                    </p>
                    <p className="text-xs text-text-muted">
                      Upload a CSV of existing customers
                    </p>
                  </div>
                </Link>

                <Link
                  href="/app/add-customer"
                  className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 text-left hover:border-copper hover:bg-cream"
                >
                  <span className="text-xl">➕</span>
                  <div>
                    <p className="font-medium text-charcoal">
                      Add more customers
                    </p>
                    <p className="text-xs text-text-muted">
                      Continue building your customer database
                    </p>
                  </div>
                </Link>

                <Link
                  href="/app"
                  onClick={completeOnboarding}
                  className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 text-left hover:border-copper hover:bg-cream"
                >
                  <span className="text-xl">📊</span>
                  <div>
                    <p className="font-medium text-charcoal">
                      Explore your dashboard
                    </p>
                    <p className="text-xs text-text-muted">
                      See your reliability overview
                    </p>
                  </div>
                </Link>
              </div>

              <button
                onClick={completeOnboarding}
                disabled={loading}
                className="w-full rounded-xl bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
              >
                {loading ? "Loading..." : "Go to Dashboard"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
