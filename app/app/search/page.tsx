// app/search/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { calculateCustomerScore, getScoreLabel } from "@/lib/scoring";
import { searchProperties, getPropertyProfile } from "@/app/app/property/actions";
import { createCustomerFromProperty } from "@/app/app/property/sync-actions";
import PropertyProfileCard from "@/components/PropertyProfileCard";
import { formatNameForDisplay } from "@/lib/name-utils";
import type { PropertySearchResult, PropertyProfile } from "@/lib/property-types";

type Customer = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
};

type CustomerWithScore = Customer & {
  score: number;
  scoreLabel: string;
};

type SearchTab = "customers" | "properties";

function getScoreBadgeClasses(score: number) {
  if (score >= 90) return "bg-emerald text-white";
  if (score >= 75) return "bg-emerald/80 text-white";
  if (score >= 60) return "bg-amber text-white";
  if (score >= 40) return "bg-amber/80 text-white";
  return "bg-critical text-white";
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SearchTab>("customers");

  // Customer search state
  const [customerResults, setCustomerResults] = useState<CustomerWithScore[]>([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerSearched, setCustomerSearched] = useState(false);

  // Property search state
  const [propertyResults, setPropertyResults] = useState<PropertySearchResult[]>([]);
  const [propertyLoading, setPropertyLoading] = useState(false);
  const [propertySearched, setPropertySearched] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyProfile | null>(null);
  const [propertyProfileLoading, setPropertyProfileLoading] = useState(false);
  const [addingCustomer, setAddingCustomer] = useState(false);

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

  const searchCustomers = async () => {
    if (!businessId || !query.trim()) return;

    setCustomerLoading(true);
    setCustomerSearched(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const searchTerm = query.trim().toLowerCase();

      const { data: customers, error } = await supabase
        .from("customers")
        .select("*")
        .eq("business_id", businessId)
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
        .order("full_name", { ascending: true })
        .limit(20);

      if (error) {
        console.error("Search error:", error);
        setCustomerResults([]);
        return;
      }

      if (!customers || customers.length === 0) {
        setCustomerResults([]);
        return;
      }

      const customerIds = customers.map((c) => c.id);
      const { data: notes } = await supabase
        .from("customer_notes")
        .select("customer_id, severity, created_at")
        .eq("business_id", businessId)
        .in("customer_id", customerIds);

      const notesByCustomer: Record<string, { severity: number; created_at: string }[]> = {};
      (notes || []).forEach((n) => {
        if (!notesByCustomer[n.customer_id]) notesByCustomer[n.customer_id] = [];
        notesByCustomer[n.customer_id].push({ severity: n.severity, created_at: n.created_at });
      });

      const customersWithScores: CustomerWithScore[] = customers.map((c) => {
        const customerNotes = notesByCustomer[c.id] || [];
        const score = calculateCustomerScore(customerNotes);
        return {
          ...c,
          score,
          scoreLabel: getScoreLabel(score),
        };
      });

      setCustomerResults(customersWithScores);
    } catch (err) {
      console.error("Search error:", err);
      setCustomerResults([]);
    } finally {
      setCustomerLoading(false);
    }
  };

  const searchPropertyRecords = async () => {
    if (!query.trim()) return;

    setPropertyLoading(true);
    setPropertySearched(true);
    setSelectedProperty(null);

    try {
      const result = await searchProperties(query.trim());

      if (result.error) {
        console.error("Property search error:", result.error);
        setPropertyResults([]);
        return;
      }

      setPropertyResults(result.results);
    } catch (err) {
      console.error("Property search error:", err);
      setPropertyResults([]);
    } finally {
      setPropertyLoading(false);
    }
  };

  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    if (activeTab === "customers") {
      await searchCustomers();
    } else {
      await searchPropertyRecords();
    }
  };

  const handlePropertyClick = async (propertyId: string) => {
    setPropertyProfileLoading(true);
    try {
      const result = await getPropertyProfile(propertyId);
      if (result.profile) {
        setSelectedProperty(result.profile);
      }
    } catch (err) {
      console.error("Error loading property:", err);
    } finally {
      setPropertyProfileLoading(false);
    }
  };

  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab);
    setSelectedProperty(null);
  };

  const handleAddCustomerFromProperty = async (propertyId: string) => {
    setAddingCustomer(true);
    try {
      const result = await createCustomerFromProperty(propertyId);
      if (result.error) {
        console.error("Error adding customer:", result.error);
        return;
      }
      // Refresh the property profile to show the updated link
      if (selectedProperty) {
        const refreshed = await getPropertyProfile(propertyId);
        if (refreshed.profile) {
          setSelectedProperty(refreshed.profile);
        }
      }
    } catch (err) {
      console.error("Error adding customer:", err);
    } finally {
      setAddingCustomer(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-2 text-3xl font-bold text-charcoal">Search</h1>
      <p className="mb-6 text-text-muted">
        Look up customers or search property records by address or owner name.
      </p>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-border">
        <button
          onClick={() => handleTabChange("customers")}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "customers"
              ? "border-b-2 border-copper text-copper"
              : "text-text-muted hover:text-charcoal"
          }`}
        >
          My Customers
        </button>
        <button
          onClick={() => handleTabChange("properties")}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "properties"
              ? "border-b-2 border-copper text-copper"
              : "text-text-muted hover:text-charcoal"
          }`}
        >
          Property Records
          <span className="ml-2 rounded bg-forsure-blue/10 px-1.5 py-0.5 text-xs text-forsure-blue">
            New
          </span>
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            activeTab === "customers"
              ? "Enter name, phone, email, or address..."
              : "Enter address or owner name..."
          }
          className="flex-1 rounded-md border border-border bg-white px-4 py-2.5 text-charcoal placeholder-text-muted outline-none focus:ring-2 focus:ring-copper"
        />
        <button
          type="submit"
          disabled={(activeTab === "customers" ? customerLoading : propertyLoading) || !query.trim()}
          className="rounded-md bg-copper px-6 py-2.5 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
        >
          {(activeTab === "customers" ? customerLoading : propertyLoading) ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Customer Results */}
      {activeTab === "customers" && customerSearched && (
        <>
          {customerResults.length === 0 ? (
            <div className="rounded-lg bg-surface p-6">
              <h2 className="mb-1 font-semibold text-charcoal">No customers found.</h2>
              <p className="mb-4 text-sm text-text-muted">
                You can create a new profile for this customer or search property records.
              </p>
              <div className="flex gap-3">
                <Link
                  href={`/app/add-customer?name=${encodeURIComponent(query)}`}
                  className="inline-block rounded-md bg-copper px-4 py-2 text-sm font-medium text-white hover:bg-copper-dark"
                >
                  + Add customer
                </Link>
                <button
                  onClick={() => {
                    setActiveTab("properties");
                    searchPropertyRecords();
                  }}
                  className="rounded-md bg-cream px-4 py-2 text-sm font-medium text-charcoal hover:bg-surface"
                >
                  Search property records
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-text-muted">
                Found {customerResults.length} customer{customerResults.length !== 1 ? "s" : ""}
              </p>
              {customerResults.map((customer) => (
                <Link
                  key={customer.id}
                  href={`/app/customers/${customer.id}`}
                  className="flex items-center justify-between rounded-lg bg-surface p-4 hover:bg-cream"
                >
                  <div>
                    <h3 className="font-medium text-charcoal">{customer.full_name || "Unnamed"}</h3>
                    <p className="text-sm text-text-muted">
                      {[customer.phone, customer.email, customer.address, customer.city && customer.state ? `${customer.city}, ${customer.state}` : null]
                        .filter(Boolean)
                        .join(" • ") || "No contact info"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getScoreBadgeClasses(customer.score)}`}>
                      {customer.score}
                    </span>
                    <span className="text-sm text-text-muted">{customer.scoreLabel}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Property Results */}
      {activeTab === "properties" && (
        <>
          {/* Selected Property Profile */}
          {selectedProperty && (
            <div className="mb-6">
              <button
                onClick={() => setSelectedProperty(null)}
                className="mb-4 text-sm text-copper hover:text-copper-dark"
              >
                ← Back to results
              </button>
              <PropertyProfileCard
                profile={selectedProperty}
                onAddToCustomers={handleAddCustomerFromProperty}
                isAddingCustomer={addingCustomer}
              />
            </div>
          )}

          {/* Property Search Results */}
          {!selectedProperty && propertySearched && (
            <>
              {propertyProfileLoading ? (
                <div className="rounded-lg bg-surface p-6 text-center">
                  <p className="text-text-muted">Loading property details...</p>
                </div>
              ) : propertyResults.length === 0 ? (
                <div className="rounded-lg bg-surface p-6">
                  <h2 className="mb-1 font-semibold text-charcoal">No properties found.</h2>
                  <p className="text-sm text-text-muted">
                    Try searching with a different address format or owner name.
                    Property records are currently available for Bucks and Montgomery County, PA.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-text-muted">
                    Found {propertyResults.length} propert{propertyResults.length !== 1 ? "ies" : "y"}
                  </p>
                  {propertyResults.map((result) => (
                    <button
                      key={result.property.id}
                      onClick={() => handlePropertyClick(result.property.id)}
                      className="w-full rounded-lg bg-surface p-4 text-left hover:bg-cream transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="rounded bg-forsure-blue/10 px-2 py-0.5 text-xs font-medium text-forsure-blue">
                              Public Record
                            </span>
                            <span className="text-xs text-text-muted uppercase">
                              {result.property.county} County
                            </span>
                            {result.matchType === "name" && (
                              <span className="text-xs text-text-muted">• Matched by name</span>
                            )}
                          </div>
                          <h3 className="font-medium text-charcoal">
                            {result.property.address_street || result.property.address_full}
                          </h3>
                          <p className="text-sm text-text-muted">
                            {result.property.address_city}, {result.property.address_state} {result.property.address_zip}
                          </p>
                          <p className="mt-1 text-sm text-text-secondary">
                            Owner: {formatNameForDisplay(result.property.owner_name)}
                            {result.property.owner_name_secondary && (
                              <span> & {formatNameForDisplay(result.property.owner_name_secondary)}</span>
                            )}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          {result.property.year_built && (
                            <p className="text-text-muted">Built {result.property.year_built}</p>
                          )}
                          {result.property.square_footage && (
                            <p className="text-text-muted">{result.property.square_footage.toLocaleString()} sq ft</p>
                          )}
                          {result.property.bedrooms && result.property.bathrooms && (
                            <p className="text-text-muted">
                              {result.property.bedrooms} bed / {result.property.bathrooms} bath
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Initial State */}
          {!selectedProperty && !propertySearched && (
            <div className="rounded-lg border border-border bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-lg font-semibold text-charcoal">Property Record Search</h3>
              <p className="mt-2 text-text-secondary">
                Search by address or owner name to find property information from public records.
              </p>
              <p className="mt-4 text-sm text-text-muted">
                Currently covering Bucks County and Montgomery County, PA
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                  <span>📋</span>
                  <span>Property details</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔧</span>
                  <span>Permit history</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏷️</span>
                  <span>Sale history</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⚖️</span>
                  <span>Court records</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
