"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { searchNetwork, addCustomerFromNetworkAction } from "./actions";
import { formatNameForDisplay } from "@/lib/name-utils";

interface NetworkProfile {
  id: string;
  phone_last_four: string | null;
  email_domain: string | null;
  address_partial: string | null;
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

interface PropertyRecord {
  id: string;
  address_full: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  owner_name: string | null;
  owner_name_secondary: string | null;
  county: string | null;
  municipality: string | null;
  year_built: number | null;
  square_footage: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  property_class: string | null;
}

interface NetworkSearchClientProps {
  businessId: string | null;
}

export default function NetworkSearchClient({ businessId }: NetworkSearchClientProps) {
  const router = useRouter();
  const [searchType, setSearchType] = useState<"phone" | "email" | "address">("phone");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [searched, setSearched] = useState(false);
  const [profile, setProfile] = useState<NetworkProfile | null>(null);
  const [propertyRecords, setPropertyRecords] = useState<PropertyRecord[]>([]);
  const [error, setError] = useState("");

  async function handleAddCustomer() {
    setAddingCustomer(true);
    try {
      const phone = searchType === "phone" ? searchValue : null;
      const email = searchType === "email" ? searchValue : null;
      const address = searchType === "address" ? searchValue : null;

      const result = await addCustomerFromNetworkAction(phone, email, address);

      if (result.error) {
        setError(result.error);
        return;
      }

      // Go directly to the new customer's page
      if (result.customerId) {
        router.push(`/app/customers/${result.customerId}`);
      } else {
        router.push("/app/customers");
      }
    } catch (err) {
      console.error("Error adding customer:", err);
      setError("Failed to add customer. Please try again.");
    } finally {
      setAddingCustomer(false);
    }
  }

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
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

    if (searchType === "address") {
      if (searchValue.trim().length < 5) {
        setError("Please enter a complete address.");
        return;
      }
    }

    setLoading(true);
    setError("");
    setSearched(true);
    setProfile(null);
    setPropertyRecords([]);

    try {
      const result = await searchNetwork(searchType, searchValue);

      if (result.error) {
        setError(result.error);
        return;
      }

      setProfile(result.profile || null);
      if (result.propertyRecords) {
        setPropertyRecords(result.propertyRecords);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function getCategoryName(categoryId: string): string {
    // Category names are stored in the incident breakdown from server
    return categoryId;
  }

  function getRiskColor(tier: string): string {
    if (tier === "low") return "text-emerald";
    if (tier === "medium") return "text-amber";
    if (tier === "high") return "text-orange-500";
    if (tier === "critical") return "text-critical";
    return "text-text-muted";
  }

  function getRiskBgColor(tier: string): string {
    if (tier === "low") return "bg-emerald/20 border-emerald/30";
    if (tier === "medium") return "bg-amber/20 border-amber/30";
    if (tier === "high") return "bg-orange-500/20 border-orange-500/30";
    if (tier === "critical") return "bg-critical/20 border-critical/30";
    return "bg-surface border-border";
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
      {/* FCRA Disclaimer Banner */}
      <div className="mb-6 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3">
        <p className="text-xs text-text-secondary">
          <strong className="text-charcoal">Important:</strong> ForSure is not a consumer reporting agency.
          This tool provides aggregated, anonymized data from verified businesses to help you make informed decisions.
          Information should not be used for credit, employment, insurance, or housing decisions.
          To dispute information, contact <a href="mailto:disputes@myforsure.com" className="text-copper underline">disputes@myforsure.com</a>.
        </p>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal md:text-3xl">Network Search</h1>
        <p className="mt-1 text-text-secondary">
          Search the network to check a customer's reliability before booking.
        </p>
      </div>

      {/* Search Box */}
      <div className="mb-8 rounded-xl border border-border bg-white p-6">
        <div className="mb-4 flex gap-2">
          <button
            onClick={function() { setSearchType("phone"); setSearchValue(""); }}
            className={
              searchType === "phone"
                ? "rounded-lg bg-copper px-4 py-2 text-sm font-medium text-white"
                : "rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:text-charcoal"
            }
          >
            Phone Number
          </button>
          <button
            onClick={function() { setSearchType("email"); setSearchValue(""); }}
            className={
              searchType === "email"
                ? "rounded-lg bg-copper px-4 py-2 text-sm font-medium text-white"
                : "rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:text-charcoal"
            }
          >
            Email Address
          </button>
          <button
            onClick={function() { setSearchType("address"); setSearchValue(""); }}
            className={
              searchType === "address"
                ? "rounded-lg bg-copper px-4 py-2 text-sm font-medium text-white"
                : "rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:text-charcoal"
            }
          >
            Address
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
                className="w-full rounded-lg border border-border bg-cream px-4 py-3 text-charcoal placeholder-text-muted outline-none focus:border-copper"
              />
            ) : searchType === "email" ? (
              <input
                type="email"
                value={searchValue}
                onChange={function(e) { setSearchValue(e.target.value); }}
                onKeyDown={function(e) { if (e.key === "Enter") handleSearch(); }}
                placeholder="customer@example.com"
                className="w-full rounded-lg border border-border bg-cream px-4 py-3 text-charcoal placeholder-text-muted outline-none focus:border-copper"
              />
            ) : (
              <input
                type="text"
                value={searchValue}
                onChange={function(e) { setSearchValue(e.target.value); }}
                onKeyDown={function(e) { if (e.key === "Enter") handleSearch(); }}
                placeholder="123 Main St, Philadelphia PA"
                className="w-full rounded-lg border border-border bg-cream px-4 py-3 text-charcoal placeholder-text-muted outline-none focus:border-copper"
              />
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded-lg bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
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
          {/* Property Records Results (for address search) */}
          {searchType === "address" && propertyRecords.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-text-muted">
                Found {propertyRecords.length} propert{propertyRecords.length !== 1 ? "ies" : "y"} matching your search
              </p>
              {propertyRecords.map((property) => (
                <Link
                  key={property.id}
                  href={`/app/search?tab=properties&id=${property.id}`}
                  className="block rounded-xl border border-border bg-white p-5 hover:border-copper transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="rounded bg-forsure-blue/10 px-2 py-0.5 text-xs font-medium text-forsure-blue">
                          Public Record
                        </span>
                        <span className="text-xs text-text-muted uppercase">
                          {property.county} County
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-charcoal">
                        {property.address_street || property.address_full}
                      </h3>
                      <p className="text-sm text-text-muted">
                        {property.address_city}, {property.address_state} {property.address_zip}
                      </p>
                      <p className="mt-2 text-sm text-text-secondary">
                        Owner: {formatNameForDisplay(property.owner_name)}
                        {property.owner_name_secondary && (
                          <span> & {formatNameForDisplay(property.owner_name_secondary)}</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      {property.year_built && (
                        <p className="text-text-muted">Built {property.year_built}</p>
                      )}
                      {property.square_footage && (
                        <p className="text-text-muted">{property.square_footage.toLocaleString()} sq ft</p>
                      )}
                      {property.bedrooms && property.bathrooms && (
                        <p className="text-text-muted">
                          {property.bedrooms} bed / {property.bathrooms} bath
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No property records found for address search */}
          {searchType === "address" && propertyRecords.length === 0 && (
            <div className="rounded-xl border border-border bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-lg font-semibold text-charcoal">No Properties Found</h3>
              <p className="mt-2 text-text-secondary">
                No property records match this address in our database.
              </p>
              <p className="mt-4 text-sm text-text-muted">
                Property records are currently available for Bucks and Montgomery County, PA.
              </p>
            </div>
          )}

          {/* Network Profile Results (for phone/email search) */}
          {searchType !== "address" && profile ? (
            <div className="rounded-xl border border-border bg-white overflow-hidden">
              {/* Header */}
              <div className="border-b border-border px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-charcoal">Network Profile</h2>
                    <p className="text-sm text-text-muted">
                      {profile.phone_last_four && "Phone: ***-***-" + profile.phone_last_four}
                      {profile.phone_last_four && profile.email_domain && " • "}
                      {profile.email_domain && "Email: ***@" + profile.email_domain}
                      {(profile.phone_last_four || profile.email_domain) && profile.address_partial && " • "}
                      {profile.address_partial && "Address: " + profile.address_partial}
                    </p>
                  </div>
                  <div className="text-right text-sm text-text-muted">
                    First seen: {formatDate(profile.first_seen_at)}
                  </div>
                </div>
              </div>

              {/* Risk Tier Banner */}
              <div className={"border-b border-border px-6 py-5 " + getRiskBgColor(profile.risk_tier)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-muted">Reliability Status</p>
                    <p className={"text-2xl font-bold capitalize " + getRiskColor(profile.risk_tier)}>
                      {profile.risk_tier === "low" ? "Good Standing" :
                       profile.risk_tier === "medium" ? "Some Concerns" :
                       profile.risk_tier === "high" ? "Multiple Concerns" :
                       profile.risk_tier === "critical" ? "Significant Issues" : "Unknown"}
                    </p>
                  </div>
                  {profile.clean_streak_months >= 12 && (
                    <div className="rounded-lg bg-emerald/20 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">✨</span>
                        <div>
                          <p className="text-xs text-emerald">Clean Record</p>
                          <p className="font-semibold text-emerald">
                            12+ months
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3">
                <div className="bg-white px-4 py-4 text-center">
                  <p className="text-2xl font-bold text-charcoal">
                    {profile.total_incidents > 0 ? (profile.total_incidents > 5 ? "Several" : "Few") : "None"}
                  </p>
                  <p className="text-xs text-text-muted">Reported Concerns</p>
                </div>
                <div className="bg-white px-4 py-4 text-center">
                  <p className="text-2xl font-bold text-charcoal">{profile.seen_by_business_count}</p>
                  <p className="text-xs text-text-muted">Businesses Reporting</p>
                </div>
                <div className="bg-white px-4 py-4 text-center">
                  <p className="text-2xl font-bold text-charcoal">{formatDate(profile.last_incident_at)}</p>
                  <p className="text-xs text-text-muted">Last Report</p>
                </div>
              </div>

              {/* Report Summary */}
              <div className="px-6 py-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
                  Report Summary
                </h3>
                {Object.keys(profile.incident_breakdown).length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(profile.incident_breakdown).map(function([categoryId, count]) {
                      return (
                        <div
                          key={categoryId}
                          className="flex items-center justify-between rounded-lg border border-border bg-cream px-4 py-3"
                        >
                          <span className="text-sm text-text-secondary">{getCategoryName(categoryId)}</span>
                          <span className="rounded-full bg-critical/20 px-3 py-1 text-sm font-medium text-critical">
                            Reported
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">No concerns on record.</p>
                )}
              </div>

              {/* Recommendation */}
              <div className="border-t border-border px-6 py-5">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
                  Recommendation
                </h3>
                {profile.risk_tier === "low" && (
                  <div className="flex items-start gap-3 rounded-lg bg-emerald/10 border border-emerald/20 px-4 py-3">
                    <span className="text-lg">✅</span>
                    <div>
                      <p className="font-medium text-emerald">Good to go</p>
                      <p className="text-sm text-text-muted">
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
                      <p className="text-sm text-text-muted">
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
                      <p className="text-sm text-text-muted">
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
                      <p className="text-sm text-text-muted">
                        This customer has serious reliability issues. Require full payment upfront or consider declining the job.
                      </p>
                    </div>
                  </div>
                )}
                {profile.risk_tier === "unknown" && (
                  <div className="flex items-start gap-3 rounded-lg bg-surface border border-border px-4 py-3">
                    <span className="text-lg">❓</span>
                    <div>
                      <p className="font-medium text-charcoal">No data yet</p>
                      <p className="text-sm text-text-muted">
                        Not enough information to make a recommendation. Use your judgment.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="border-t border-border px-6 py-4 text-xs text-text-muted">
                Based on aggregated reports from {profile.seen_by_business_count} verified business{profile.seen_by_business_count !== 1 ? "es" : ""}.
                This information is for business decision-making only and should not be used for credit, employment,
                insurance, or housing decisions. To dispute this information, contact{" "}
                <a href="mailto:disputes@myforsure.com" className="text-copper underline">disputes@myforsure.com</a>.
              </div>

              {/* Add to Customers */}
              <div className="border-t border-border px-6 py-4">
                <button
                  onClick={handleAddCustomer}
                  disabled={addingCustomer}
                  className="w-full rounded-lg bg-copper px-4 py-3 font-medium text-white hover:bg-copper-dark disabled:opacity-50 sm:w-auto"
                >
                  {addingCustomer ? "Adding..." : "+ Add to My Customers"}
                </button>
              </div>
            </div>
          ) : searchType !== "address" ? (
            <div className="rounded-xl border border-border bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-charcoal">No Network Profile Found</h3>
              <p className="mt-2 text-text-secondary">
                This {searchType === "phone" ? "phone number" : "email"} hasn't been reported to the network yet.
              </p>
              <p className="mt-4 text-sm text-text-muted">
                This could mean they're a new customer or have a clean record with no reports.
              </p>
              <button
                onClick={handleAddCustomer}
                disabled={addingCustomer}
                className="mt-6 rounded-lg bg-copper px-6 py-3 font-medium text-white hover:bg-copper-dark disabled:opacity-50"
              >
                {addingCustomer ? "Adding..." : "+ Add to My Customers"}
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Initial State */}
      {!searched && (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <span className="text-2xl">🛡️</span>
          </div>
          <h3 className="text-lg font-semibold text-charcoal">Check Before You Book</h3>
          <p className="mt-2 text-text-secondary">
            Search a customer's phone, email, or address to see their reliability history across the network.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-text-muted">
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
