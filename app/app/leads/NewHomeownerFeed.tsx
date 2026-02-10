"use client";

import { useState, useEffect } from "react";
import { getRecentHomeSales } from "@/app/app/property/actions";
import { formatNameForDisplay } from "@/lib/name-utils";
import type { PropertySale } from "@/lib/property-types";

interface NewHomeownerFeedProps {
  businessId: string;
  savedMunicipalities: string[];
  savedZipCodes: string[];
  availableMunicipalities: string[];
}

function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getDaysSince(dateString: string | null): number | null {
  if (!dateString) return null;
  const saleDate = new Date(dateString);
  const now = new Date();
  return Math.floor((now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
}

export default function NewHomeownerFeed({
  businessId,
  savedMunicipalities,
  savedZipCodes,
  availableMunicipalities,
}: NewHomeownerFeedProps) {
  const [sales, setSales] = useState<PropertySale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>(savedMunicipalities);
  const [daysBack, setDaysBack] = useState(30);
  const [showFilters, setShowFilters] = useState(false);

  const loadSales = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getRecentHomeSales({
        municipalities: selectedMunicipalities.length > 0 ? selectedMunicipalities : undefined,
        daysBack,
        limit: 100,
      });

      if (result.error) {
        setError(result.error);
        setSales([]);
      } else {
        setSales(result.sales);
      }
    } catch (err) {
      console.error("Error loading sales:", err);
      setError("Failed to load recent sales");
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, [selectedMunicipalities, daysBack]);

  const toggleMunicipality = (municipality: string) => {
    setSelectedMunicipalities((prev) =>
      prev.includes(municipality)
        ? prev.filter((m) => m !== municipality)
        : [...prev, municipality]
    );
  };

  const clearFilters = () => {
    setSelectedMunicipalities([]);
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 rounded-xl border border-border bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm font-medium text-copper hover:text-copper-dark"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            {selectedMunicipalities.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">
                  {selectedMunicipalities.length} area{selectedMunicipalities.length !== 1 ? "s" : ""} selected
                </span>
                <button
                  onClick={clearFilters}
                  className="text-xs text-critical hover:underline"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-text-muted">Time range:</label>
            <select
              value={daysBack}
              onChange={(e) => setDaysBack(Number(e.target.value))}
              className="rounded border border-border bg-cream px-3 py-1.5 text-sm text-charcoal"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="mb-3 text-sm font-medium text-charcoal">Filter by Municipality</p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {availableMunicipalities.map((municipality) => (
                <button
                  key={municipality}
                  onClick={() => toggleMunicipality(municipality)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedMunicipalities.includes(municipality)
                      ? "bg-copper text-white"
                      : "bg-surface text-text-muted hover:bg-cream hover:text-charcoal"
                  }`}
                >
                  {municipality}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <p className="text-text-muted">Loading recent sales...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-critical/20 bg-critical/10 p-6">
          <p className="text-sm text-critical">{error}</p>
        </div>
      ) : sales.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <span className="text-2xl">🏠</span>
          </div>
          <h3 className="text-lg font-semibold text-charcoal">No recent sales found</h3>
          <p className="mt-2 text-text-secondary">
            {selectedMunicipalities.length > 0
              ? "Try expanding your service area or time range."
              : "No home sales recorded in the selected time period."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">
              {sales.length} recent sale{sales.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {sales.map((sale) => {
              const daysSinceSale = getDaysSince(sale.sale_date);
              const isRecent = daysSinceSale !== null && daysSinceSale <= 7;

              return (
                <div
                  key={sale.id}
                  className="rounded-xl border border-border bg-white overflow-hidden hover:border-copper/50 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {isRecent && (
                            <span className="rounded bg-emerald/20 px-2 py-0.5 text-xs font-medium text-emerald">
                              New
                            </span>
                          )}
                          <span className="text-xs text-text-muted uppercase">
                            {sale.county} County
                          </span>
                        </div>
                        <h3 className="font-semibold text-charcoal">
                          {sale.address_full || "Address not available"}
                        </h3>
                        <p className="text-sm text-text-muted">{sale.municipality}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-charcoal">
                          {formatCurrency(sale.sale_price)}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatDate(sale.sale_date)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-text-muted">New Owner</p>
                          <p className="font-medium text-charcoal">
                            {formatNameForDisplay(sale.buyer_name)}
                          </p>
                        </div>
                        {sale.seller_name && (
                          <div className="text-right">
                            <p className="text-text-muted">Previous Owner</p>
                            <p className="text-text-secondary">
                              {formatNameForDisplay(sale.seller_name)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lead Quality Indicators */}
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-text-muted mb-2">Potential services needed:</p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="rounded bg-amber/10 px-2 py-0.5 text-xs text-amber">
                          🌡️ HVAC Inspection
                        </span>
                        <span className="rounded bg-surface px-2 py-0.5 text-xs text-text-muted">
                          🔧 Plumbing Check
                        </span>
                        <span className="rounded bg-surface px-2 py-0.5 text-xs text-text-muted">
                          ⚡ Electrical Eval
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex border-t border-border bg-cream">
                    <button className="flex-1 px-4 py-2.5 text-sm font-medium text-copper hover:bg-surface transition-colors">
                      View Property Details
                    </button>
                    <div className="w-px bg-border" />
                    <button className="flex-1 px-4 py-2.5 text-sm font-medium text-text-muted hover:text-charcoal hover:bg-surface transition-colors">
                      Save Lead
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
