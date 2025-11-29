// app/search/page.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { calculateCustomerScore, getScoreLabel } from "@/lib/scoring";
import type { NoteForScoring } from "@/lib/scoring";

type Customer = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
};

type CustomerNote = NoteForScoring & {
  id: string;
  customer_id: string;
  note_type: string | null;
  note_text: string | null;
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
  const searchParams = useSearchParams();

  const [query, setQuery] = useState<string>(() => searchParams.get("q") || "");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetch customers + scores for current query
  const runSearch = async (q: string) => {
    if (!q.trim()) {
      setCustomers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // basic text search across name, email, phone
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .or(
          `full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Search error:", error);
        setError(error.message || "Search failed.");
        setCustomers([]);
        return;
      }

      const customers = (data || []) as Customer[];

      // for each customer, pull their notes and compute score
      const customersWithScores: Customer[] & {
        score?: number;
        scoreLabel?: string;
        scoreClasses?: string;
      }[] = [];

      for (const customer of customers) {
        const { data: notesData } = await supabase
          .from("customer_notes")
          .select("*")
          .eq("customer_id", customer.id);

        const notes = (notesData || []) as CustomerNote[];
        const score = calculateCustomerScore(notes);
        const scoreLabel = getScoreLabel(score);
        const scoreClasses = getScoreBadgeClasses(score);

        customersWithScores.push({
          ...customer,
          score,
          scoreLabel,
          scoreClasses,
        });
      }

      // @ts-ignore – we know we just augmented the objects
      setCustomers(customersWithScores);
    } finally {
      setLoading(false);
    }
  };

  // react to ?q= in the URL
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    if (q) {
      runSearch(q);
    } else {
      setCustomers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="p-8">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-xs text-gray-400 underline-offset-2 hover:underline"
        >
          ← Back to dashboard
        </button>
      </div>

      <h1 className="mb-2 text-3xl font-bold">Search customers</h1>
      <p className="mb-6 text-sm text-gray-300">
        Look up a customer by name, phone, or email to see their reliability
        profile.
      </p>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, phone, or email..."
          className="flex-1 rounded bg-gray-900 px-3 py-2 text-sm text-gray-100 outline-none"
        />
        <button
          type="submit"
          className="rounded bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-white"
        >
          Search
        </button>
      </form>

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      {/* No query yet */}
      {!query && !loading && customers.length === 0 && (
        <p className="mt-4 text-sm text-gray-400">
          Enter a name, phone number, or email to search your customers.
        </p>
      )}

      {/* No results + CTA to create customer */}
      {query && !loading && customers.length === 0 && !error && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-800 p-4 text-sm text-gray-100">
          <div>
            <p className="font-semibold">
              No customers found matching that search.
            </p>
            <p className="mt-1 text-xs text-gray-300">
              If this is a new customer, you can create a profile now so you
              (and eventually other businesses) can track their reliability.
            </p>
          </div>
          <Link
            href="/add-customers"
            className="rounded bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:bg-white"
          >
            + Add customer
          </Link>
        </div>
      )}

      {/* Results table */}
      {customers.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-lg bg-gray-900 text-sm text-gray-100">
          <table className="min-w-full">
            <thead className="bg-gray-800 text-xs uppercase tracking-wide text-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">Score</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="cursor-pointer bg-gray-900 hover:bg-gray-800"
                  onClick={() =>
                    router.push(`/customers/${encodeURIComponent(customer.id)}`)
                  }
                >
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        // @ts-ignore
                        customer.scoreClasses || "bg-gray-700 text-gray-100"
                      }`}
                    >
                      {/* @ts-ignore */}
                      {customer.score ?? "--"}{" "}
                      <span className="ml-1 text-[10px] uppercase">
                        {/* @ts-ignore */}
                        {customer.scoreLabel}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {customer.full_name || "—"}
                  </td>
                  <td className="px-4 py-2">{customer.email || "—"}</td>
                  <td className="px-4 py-2">{customer.phone || "—"}</td>
                  <td className="px-4 py-2 text-xs text-gray-300">
                    {customer.created_at
                      ? new Date(customer.created_at).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
