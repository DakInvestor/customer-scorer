// app/search/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { calculateCustomerScore, getScoreLabel } from "@/lib/scoring";

type Customer = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
};

type CustomerWithScore = Customer & {
  score: number;
  scoreLabel: string;
};

function getScoreBadgeClasses(score: number) {
  if (score >= 90) return "bg-green-600 text-white";
  if (score >= 75) return "bg-lime-600 text-white";
  if (score >= 60) return "bg-yellow-500 text-gray-900";
  if (score >= 40) return "bg-orange-500 text-white";
  return "bg-red-600 text-white";
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [results, setResults] = useState<CustomerWithScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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

  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    if (!businessId || !query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const searchTerm = query.trim().toLowerCase();

      // Search customers
      const { data: customers, error } = await supabase
        .from("customers")
        .select("*")
        .eq("business_id", businessId)
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .order("full_name", { ascending: true })
        .limit(20);

      if (error) {
        console.error("Search error:", error);
        setResults([]);
        return;
      }

      if (!customers || customers.length === 0) {
        setResults([]);
        return;
      }

      // Get notes for scoring
      const customerIds = customers.map((c) => c.id);
      const { data: notes } = await supabase
        .from("customer_notes")
        .select("customer_id, severity, created_at")
        .eq("business_id", businessId)
        .in("customer_id", customerIds);

      // Group notes by customer
      const notesByCustomer: Record<string, { severity: number; created_at: string }[]> = {};
      (notes || []).forEach((n) => {
        if (!notesByCustomer[n.customer_id]) notesByCustomer[n.customer_id] = [];
        notesByCustomer[n.customer_id].push({ severity: n.severity, created_at: n.created_at });
      });

      // Calculate scores
      const customersWithScores: CustomerWithScore[] = customers.map((c) => {
        const customerNotes = notesByCustomer[c.id] || [];
        const score = calculateCustomerScore(customerNotes);
        return {
          ...c,
          score,
          scoreLabel: getScoreLabel(score),
        };
      });

      setResults(customersWithScores);

    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-2 text-3xl font-bold">Search customers</h1>
      <p className="mb-6 text-gray-400">Look up a customer by name, phone, or email.</p>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter name, phone, or email..."
          className="flex-1 rounded-md bg-gray-800 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-600"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-md bg-white px-6 py-2.5 font-semibold text-gray-900 hover:bg-gray-100 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Results */}
      {hasSearched && (
        <>
          {results.length === 0 ? (
            <div className="rounded-lg bg-gray-800 p-6">
              <h2 className="mb-1 font-semibold">No customers found.</h2>
              <p className="mb-4 text-sm text-gray-400">
                You can create a new profile for this customer.
              </p>
              <Link
                href={`/add-customer?name=${encodeURIComponent(query)}`}
                className="inline-block rounded-md bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600"
              >
                + Add customer
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                Found {results.length} customer{results.length !== 1 ? "s" : ""}
              </p>
              {results.map((customer) => (
                <Link
                  key={customer.id}
                  href={`/customers/${customer.id}`}
                  className="flex items-center justify-between rounded-lg bg-gray-800 p-4 hover:bg-gray-700"
                >
                  <div>
                    <h3 className="font-medium">{customer.full_name || "Unnamed"}</h3>
                    <p className="text-sm text-gray-400">
                      {[customer.phone, customer.email, customer.city && customer.state ? `${customer.city}, ${customer.state}` : null]
                        .filter(Boolean)
                        .join(" • ") || "No contact info"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getScoreBadgeClasses(customer.score)}`}>
                      {customer.score}
                    </span>
                    <span className="text-sm text-gray-400">{customer.scoreLabel}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}