"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getScoreLabel } from "@/lib/scoring";

type CustomerWithScore = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  score: number;
};

type Props = {
  customers: CustomerWithScore[];
};

function getScoreBadgeClasses(score: number) {
  if (score >= 90) return "bg-green-600 text-white";
  if (score >= 75) return "bg-lime-600 text-white";
  if (score >= 60) return "bg-yellow-500 text-gray-900";
  if (score >= 40) return "bg-orange-500 text-white";
  return "bg-red-600 text-white";
}

export default function CustomersTable({ customers }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;

    return customers.filter((c) => {
      const name = (c.full_name || "").toLowerCase();
      const email = (c.email || "").toLowerCase();
      const phone = (c.phone || "").toLowerCase();
      return (
        name.includes(q) || email.includes(q) || phone.includes(q)
      );
    });
  }, [customers, query]);

  return (
    <>
      {/* Search + add button */}
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or phone…"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-charcoal placeholder:text-text-muted focus:border-copper focus:outline-none"
          />
        </div>
        <Link
          href="/app/add-customer"
          className="rounded bg-surface px-4 py-2 text-sm font-semibold text-charcoal hover:bg-cream"
        >
          Add customer
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-text-secondary">
            <tr>
              <th className="px-4 py-3">Reliability</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-4 text-center text-text-secondary"
                  colSpan={5}
                >
                  {customers.length === 0
                    ? "No customers yet. Add your first one to get started."
                    : "No customers match your search."}
                </td>
              </tr>
            ) : (
              filtered.map((customer) => {
                const createdAt = customer.created_at
                  ? new Date(customer.created_at).toLocaleString()
                  : "";

                const scoreLabel = getScoreLabel(customer.score);
                const scoreClasses = getScoreBadgeClasses(customer.score);

                return (
                  <tr
                    key={customer.id}
                    className="border-t border-border hover:bg-cream"
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${scoreClasses}`}
                      >
                        {scoreLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/app/customers/${customer.id}`}
                        className="text-charcoal underline-offset-2 hover:underline"
                      >
                        {customer.full_name || "Unnamed"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-charcoal">
                      {customer.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-charcoal">
                      {customer.phone || "—"}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{createdAt}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}