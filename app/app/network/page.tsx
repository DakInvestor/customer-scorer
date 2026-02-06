"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

interface NetworkProfile {
  id: string;
  phone_last_four: string | null;
  email_domain: string | null;
  risk_tier: string;
  weighted_score: number;
  total_incidents: number;
  total_positive_events: number;
  last_incident_at: string | null;
  clean_streak_months: number;
  seen_by_business_count: number;
  first_seen_at: string;
  incident_breakdown: Record<string, number>;
}

interface EventCategory {
  id: string;
  name: string;
  severity: string;
  is_positive: boolean;
}

export default function NetworkSearchPage() {
  const [searchType, setSearchType] = useState<"phone" | "email">("phone");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [profile, setProfile] = useState<NetworkProfile | null>(null);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [error, setError] = useState("");

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
  }

  function normalizePhone(phone: string): string {
    return phone.replace(/\D/g, "");
  }

  function normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  async function hashValue(value: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(function(b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  async function handleSearch() {
    if (!searchValue.trim()) {
      setError("Please enter a phone number or email to search.");
      return;
    }

    if (searchType === "phone") {
      const digits = searchValue.replace(/\D/g, "");
      if (digits.length < 10) {
        setError("Please enter a complete 10-digit phone number.");
        return;
      }
    }

    if (searchType === "email") {
      if (!searchValue.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    setLoading(true);
    setError("");
    setSearched(true);
    setProfile(null);

    try {
      const supabase = createSupabaseBrowserClient();

      // Load categories first if not loaded
      if (categories.length === 0) {
        const { data: cats } = await supabase
          .from("network_event_categories")
          .select("id, name, severity, is_positive");
        if (cats) {
          setCategories(cats);
        }
      }

      // Create hash of the search value
      let hash: string;
      if (searchType === "phone") {
        hash = await hashValue(normalizePhone(searchValue));
      } else {
        hash = await hashValue(normalizeEmail(searchValue));
      }

      // Search for matching customer identifier
      const column = searchType === "phone" ? "phone_hash" : "email_hash";
      const { data, error: searchError } = await supabase
        .from("customer_identifiers")
        .select("*")
        .eq(column, hash)
        .single();

      if (searchError && searchError.code !== "PGRST116") {
        throw searchError;
      }

      if (data) {
        // Get incident breakdown
        const { data: incidents } = await supabase
          .from("network_incident_counts")
          .select("event_category_id, active_count")
          .eq("customer_identifier_id", data.id)
          .gt("active_count", 0);

        const breakdown: Record<string, number> = {};
        if (incidents) {
          incidents.forEach(function(inc) {
            breakdown[inc.event_category_id] = inc.active_count;
          });
        }

        setProfile({
          ...data,
          incident_breakdown: breakdown,
        });
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function getCategoryName(categoryId: string): string {
    const cat = categories.find(function(c) { return c.id === categoryId; });
    return cat ? cat.name : categoryId;
  }

  function getRiskColor(tier: string): string {
    if (tier === "low") return "text-emerald";
    if (tier === "medium") return "text-amber";
    if (tier === "high") return "text-orange-500";
    if (tier === "critical") return "text-critical";
    return "text-slate-400";
  }

  function getRiskBgColor(tier: string): string {
    if (tier === "low") return "bg-emerald/20 border-emerald/30";
    if (tier === "medium") return "bg-amber/20 border-amber/30";
    if (tier === "high") return "bg-orange-500/20 border-orange-500/30";
    if (tier === "critical") return "bg-critical/20 border-critical/30";
    return "bg-slate-800 border-slate-700";
  }

  function formatDate(dateString: string | null): string {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return diffDays + " days ago";
    if (diffDays < 365) return Math.floor(diffDays / 30) + " months ago";
    return Math.floor(diffDays / 365) + " years ago";
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Network Search</h1>
        <p className="mt-1 text-slate-gray">
          Search the network to check a customer's reliability before booking.
        </p>
      </div>

      {/* Search Box */}
      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="mb-4 flex gap-2">
          <button
            onClick={function() { setSearchType("phone"); setSearchValue(""); }}
            className={
              searchType === "phone"
                ? "rounded-lg bg-forsure-blue px-4 py-2 text-sm font-medium text-white"
                : "rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
            }
          >
            Phone Number
          </button>
          <button
            onClick={function() { setSearchType("email"); setSearchValue(""); }}
            className={
              searchType === "email"
                ? "rounded-lg bg-forsure-blue px-4 py-2 text-sm font-medium text-white"
                : "rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
            }
          >
            Email Address
          </button>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            {searchType === "phone" ? (
              <input
                type="tel"
                value={searchValue}
                onChange={function(e) { setSearchValue(formatPhone(e.target.value)); }}
                onKeyDown={function(e) { if (e.key === "Enter") handleSearch(); }}
                placeholder="(555) 123-4567"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
              />
            ) : (
              <input
                type="email"
                value={searchValue}
                onChange={function(e) { setSearchValue(e.target.value); }}
                onKeyDown={function(e) { if (e.key === "Enter") handleSearch(); }}
                placeholder="customer@example.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
              />
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded-lg bg-forsure-blue px-6 py-3 font-semibold text-white hover:bg-forsure-blue/90 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-critical">{error}</p>
        )}
      </div>

      {/* Results */}
      {searched && !loading && (
        <div>
          {profile ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
              {/* Header */}
              <div className="border-b border-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Network Profile</h2>
                    <p className="text-sm text-slate-500">
                      {profile.phone_last_four && "Phone: ***-***-" + profile.phone_last_four}
                      {profile.phone_last_four && profile.email_domain && " • "}
                      {profile.email_domain && "Email: ***@" + profile.email_domain}
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    First seen: {formatDate(profile.first_seen_at)}
                  </div>
                </div>
              </div>

              {/* Risk Tier Banner */}
              <div className={"border-b border-slate-800 px-6 py-5 " + getRiskBgColor(profile.risk_tier)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">Risk Level</p>
                      <p className={"text-2xl font-bold capitalize " + getRiskColor(profile.risk_tier)}>
                        {profile.risk_tier}
                      </p>
                    </div>
                    <div className="h-12 w-px bg-slate-700" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">Score</p>
                      <p className="text-2xl font-bold text-white">
                        {Math.round(profile.weighted_score)}/100
                      </p>
                    </div>
                  </div>
                  {profile.clean_streak_months >= 12 && (
                    <div className="rounded-lg bg-emerald/20 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">✨</span>
                        <div>
                          <p className="text-xs text-emerald">Clean Streak</p>
                          <p className="font-semibold text-emerald">
                            {profile.clean_streak_months} months
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-px bg-slate-800 sm:grid-cols-4">
                <div className="bg-slate-900 px-4 py-4 text-center">
                  <p className="text-2xl font-bold text-white">{profile.total_incidents}</p>
                  <p className="text-xs text-slate-500">Total Incidents</p>
                </div>
                <div className="bg-slate-900 px-4 py-4 text-center">
                  <p className="text-2xl font-bold text-emerald">{profile.total_positive_events}</p>
                  <p className="text-xs text-slate-500">Positive Events</p>
                </div>
                <div className="bg-slate-900 px-4 py-4 text-center">
                  <p className="text-2xl font-bold text-white">{profile.seen_by_business_count}</p>
                  <p className="text-xs text-slate-500">Businesses</p>
                </div>
                <div className="bg-slate-900 px-4 py-4 text-center">
                  <p className="text-2xl font-bold text-white">{formatDate(profile.last_incident_at)}</p>
                  <p className="text-xs text-slate-500">Last Incident</p>
                </div>
              </div>

              {/* Incident Breakdown */}
              <div className="px-6 py-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Incident Breakdown
                </h3>
                {Object.keys(profile.incident_breakdown).length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(profile.incident_breakdown).map(function([categoryId, count]) {
                      const isPositive = categories.find(function(c) { return c.id === categoryId; })?.is_positive;
                      return (
                        <div
                          key={categoryId}
                          className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/30 px-4 py-3"
                        >
                          <span className="text-sm text-slate-300">{getCategoryName(categoryId)}</span>
                          <span className={
                            isPositive
                              ? "rounded-full bg-emerald/20 px-3 py-1 text-sm font-medium text-emerald"
                              : "rounded-full bg-critical/20 px-3 py-1 text-sm font-medium text-critical"
                          }>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No incidents on record.</p>
                )}
              </div>

              {/* Recommendation */}
              <div className="border-t border-slate-800 px-6 py-5">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Recommendation
                </h3>
                {profile.risk_tier === "low" && (
                  <div className="flex items-start gap-3 rounded-lg bg-emerald/10 border border-emerald/20 px-4 py-3">
                    <span className="text-lg">✅</span>
                    <div>
                      <p className="font-medium text-emerald">Good to go</p>
                      <p className="text-sm text-slate-400">
                        This customer has a solid track record. Proceed with normal booking.
                      </p>
                    </div>
                  </div>
                )}
                {profile.risk_tier === "medium" && (
                  <div className="flex items-start gap-3 rounded-lg bg-amber/10 border border-amber/20 px-4 py-3">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <p className="font-medium text-amber">Proceed with caution</p>
                      <p className="text-sm text-slate-400">
                        Consider requiring a deposit or confirming appointment 24 hours before.
                      </p>
                    </div>
                  </div>
                )}
                {profile.risk_tier === "high" && (
                  <div className="flex items-start gap-3 rounded-lg bg-orange-500/10 border border-orange-500/20 px-4 py-3">
                    <span className="text-lg">🚨</span>
                    <div>
                      <p className="font-medium text-orange-500">Require deposit</p>
                      <p className="text-sm text-slate-400">
                        This customer has concerning history. Strongly recommend requiring a deposit or prepayment.
                      </p>
                    </div>
                  </div>
                )}
                {profile.risk_tier === "critical" && (
                  <div className="flex items-start gap-3 rounded-lg bg-critical/10 border border-critical/20 px-4 py-3">
                    <span className="text-lg">🛑</span>
                    <div>
                      <p className="font-medium text-critical">High risk - consider declining</p>
                      <p className="text-sm text-slate-400">
                        This customer has serious reliability issues. Require full payment upfront or consider declining the job.
                      </p>
                    </div>
                  </div>
                )}
                {profile.risk_tier === "unknown" && (
                  <div className="flex items-start gap-3 rounded-lg bg-slate-800 border border-slate-700 px-4 py-3">
                    <span className="text-lg">❓</span>
                    <div>
                      <p className="font-medium text-white">No data yet</p>
                      <p className="text-sm text-slate-400">
                        Not enough information to make a recommendation. Use your judgment.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="border-t border-slate-800 px-6 py-4 text-xs text-slate-500">
                Data based on reports from {profile.seen_by_business_count} verified business{profile.seen_by_business_count !== 1 ? "es" : ""}. 
                This information is provided to help you make informed decisions and is not a guarantee of future behavior.
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-white">No Network Profile Found</h3>
              <p className="mt-2 text-slate-gray">
                This {searchType === "phone" ? "phone number" : "email"} hasn't been reported to the network yet.
              </p>
              <p className="mt-4 text-sm text-slate-500">
                This could mean they're a new customer or have a clean record with no reports.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!searched && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
            <span className="text-2xl">🛡️</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Check Before You Book</h3>
          <p className="mt-2 text-slate-gray">
            Search a customer's phone or email to see their reliability history across the network.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald"></div>
              <span>Low Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber"></div>
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
              <span>High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-critical"></div>
              <span>Critical</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}