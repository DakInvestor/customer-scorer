"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatNameForDisplay } from "@/lib/name-utils";
import {
  getNewHomeownerLeads,
  getAgingSystemsLeads,
  getRecentPermits,
  getFlipProperties,
  getHighValueProperties,
  getLargeProperties,
  getCourtRecordLeads,
} from "./actions";

interface LeadsClientProps {
  businessId: string;
  industry: string;
  serviceMunicipalities: string[];
  serviceZips: string[];
  availableMunicipalities: string[];
  hasServiceArea: boolean;
  availableTools: Array<{ id: string; label: string; description: string; icon: string }>;
  initialFilter: string;
}

interface Lead {
  id: string;
  type: "sale" | "property" | "permit" | "court";
  address: string;
  city?: string;
  county?: string;
  municipality?: string;
  ownerName?: string;
  price?: number;
  date?: string;
  yearBuilt?: number;
  squareFootage?: number;
  assessedValue?: number;
  permitType?: string;
  permitDescription?: string;
  caseType?: string;
  amount?: number;
  tags: string[];
  score?: number;
}

function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Map filter types to their display labels
const FILTER_LABELS: Record<string, string> = {
  new_homeowner_feed: "New Homeowners",
  aging: "Aging Systems",
  permits: "Recent Permits",
  flips: "Property Flips",
  "high-value": "High Value Properties",
  "large-homes": "Large Homes",
  "large-lots": "Large Lots",
  court: "Court Records",
  sales: "Recent Sales",
  rentals: "Rental Properties",
  "multi-unit": "Multi-Unit Properties",
};

export default function LeadsClient({
  businessId,
  industry,
  serviceMunicipalities,
  serviceZips,
  availableMunicipalities,
  hasServiceArea,
  availableTools,
  initialFilter,
}: LeadsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daysBack, setDaysBack] = useState(30);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>(serviceMunicipalities);

  // Update filter from URL
  useEffect(() => {
    const filter = searchParams.get("filter");
    if (filter) {
      setActiveFilter(filter);
    }
  }, [searchParams]);

  // Load leads when filter changes
  useEffect(() => {
    loadLeads();
  }, [activeFilter, daysBack, selectedMunicipalities]);

  const loadLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      let result: Lead[] = [];
      const municipalities = selectedMunicipalities.length > 0 ? selectedMunicipalities : undefined;

      switch (activeFilter) {
        case "new_homeowner_feed":
        case "sales":
        case "live_sales_feed":
        case "sales_feed_pipeline":
          result = await getNewHomeownerLeads({ municipalities, daysBack });
          break;

        case "aging":
        case "aging_systems_finder":
        case "warranty_expiration_leads":
        case "water_heater_leads":
        case "panel_upgrade_prospects":
        case "sewer_line_prospects":
        case "reroof_calculator":
        case "property_age_targeting":
        case "pool_age_estimator":
        case "age_based_targeting":
        case "energy_efficiency_prospects":
        case "exterior_paint_leads":
          result = await getAgingSystemsLeads({ municipalities, minAge: 15 });
          break;

        case "permits":
        case "competitor_intelligence":
        case "neighborhood_blitz_planner":
        case "new_construction_tracker":
        case "permit_cost_benchmarking":
        case "solar_prewire_leads":
        case "panel_upgrade_crosssell":
        case "new_construction_solar":
        case "renovation_companion_leads":
        case "new_construction_missing":
        case "renovation_companion":
        case "permit_violation_finder":
        case "contractor_performance_tracker":
          result = await getRecentPermits({ municipalities, daysBack });
          break;

        case "flips":
        case "flip_alert":
        case "flip_tracker":
        case "repeat_investor_tracker":
          result = await getFlipProperties({ municipalities });
          break;

        case "high-value":
        case "high_value_property_finder":
        case "high_value_home_finder":
          result = await getHighValueProperties({ municipalities, minValue: 500000 });
          break;

        case "large-homes":
        case "multi_zone_home_finder":
        case "sq_footage_leads":
          result = await getLargeProperties({ municipalities, minSqFt: 3000 });
          break;

        case "large-lots":
        case "lot_size_leads":
          result = await getLargeProperties({ municipalities, minLotAcres: 1 });
          break;

        case "court":
        case "lien_judgment_monitor":
        case "contractor_dispute_tracker":
          result = await getCourtRecordLeads({ municipalities, daysBack: 90 });
          break;

        default:
          // Default to new homeowner feed
          result = await getNewHomeownerLeads({ municipalities, daysBack });
      }

      setLeads(result);
    } catch (err) {
      console.error("Error loading leads:", err);
      setError("Failed to load leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    router.push(`/app/leads?filter=${filter}`, { scroll: false });
  };

  const toggleMunicipality = (municipality: string) => {
    setSelectedMunicipalities((prev) =>
      prev.includes(municipality)
        ? prev.filter((m) => m !== municipality)
        : [...prev, municipality]
    );
  };

  // Get display label for current filter
  const currentFilterLabel = FILTER_LABELS[activeFilter] ||
    availableTools.find(t => t.id === activeFilter)?.label ||
    "Leads";

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal md:text-3xl">Lead Finder</h1>
        <p className="mt-1 text-text-secondary">
          Find qualified leads based on property data and your industry.
        </p>
      </div>

      {/* Service Area Warning */}
      {!hasServiceArea && (
        <div className="mb-6 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-sm font-medium text-charcoal">Set up your service area</p>
              <p className="text-sm text-text-secondary">
                Define your service area to automatically filter leads to your territory.
              </p>
              <Link
                href="/app/settings/service-area"
                className="mt-2 inline-block text-sm font-medium text-copper hover:text-copper-dark"
              >
                Configure Service Area →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tool/Filter Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {availableTools.slice(0, 8).map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleFilterChange(tool.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeFilter === tool.id
                  ? "bg-copper text-white"
                  : "bg-surface text-text-muted hover:bg-cream hover:text-charcoal"
              }`}
            >
              <span>{tool.icon}</span>
              <span>{tool.label}</span>
            </button>
          ))}
        </div>
        {availableTools.length > 8 && (
          <div className="mt-2">
            <select
              value={activeFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="rounded border border-border bg-white px-3 py-2 text-sm"
            >
              <option value="">More tools...</option>
              {availableTools.slice(8).map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.icon} {tool.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

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
                  onClick={() => setSelectedMunicipalities([])}
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

      {/* Results Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-charcoal">{currentFilterLabel}</h2>
        <span className="text-sm text-text-muted">
          {loading ? "Loading..." : `${leads.length} leads found`}
        </span>
      </div>

      {/* Results */}
      {loading ? (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <p className="text-text-muted">Loading leads...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-critical/20 bg-critical/10 p-6">
          <p className="text-sm text-critical">{error}</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-charcoal">No leads found</h3>
          <p className="mt-2 text-text-secondary">
            Try adjusting your filters or expanding your service area.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-xl border border-border bg-white overflow-hidden hover:border-copper/50 transition-colors"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {lead.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="rounded bg-copper/10 px-2 py-0.5 text-xs font-medium text-copper"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="text-xs text-text-muted uppercase">
                        {lead.county} County
                      </span>
                    </div>
                    <h3 className="font-semibold text-charcoal truncate">
                      {lead.address}
                    </h3>
                    <p className="text-sm text-text-muted">{lead.municipality || lead.city}</p>
                  </div>
                  <div className="text-right ml-4">
                    {lead.price && (
                      <p className="text-lg font-bold text-charcoal">
                        {formatCurrency(lead.price)}
                      </p>
                    )}
                    {lead.assessedValue && !lead.price && (
                      <p className="text-lg font-bold text-charcoal">
                        {formatCurrency(lead.assessedValue)}
                      </p>
                    )}
                    {lead.date && (
                      <p className="text-xs text-text-muted">
                        {formatDate(lead.date)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Lead Details */}
                <div className="border-t border-border pt-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {lead.ownerName && (
                      <div>
                        <p className="text-text-muted">Owner</p>
                        <p className="font-medium text-charcoal truncate">
                          {formatNameForDisplay(lead.ownerName)}
                        </p>
                      </div>
                    )}
                    {lead.yearBuilt && (
                      <div>
                        <p className="text-text-muted">Year Built</p>
                        <p className="font-medium text-charcoal">
                          {lead.yearBuilt} ({new Date().getFullYear() - lead.yearBuilt} years)
                        </p>
                      </div>
                    )}
                    {lead.squareFootage && (
                      <div>
                        <p className="text-text-muted">Size</p>
                        <p className="font-medium text-charcoal">
                          {lead.squareFootage.toLocaleString()} sq ft
                        </p>
                      </div>
                    )}
                    {lead.permitType && (
                      <div>
                        <p className="text-text-muted">Permit Type</p>
                        <p className="font-medium text-charcoal capitalize">
                          {lead.permitType}
                        </p>
                      </div>
                    )}
                    {lead.caseType && (
                      <div>
                        <p className="text-text-muted">Case Type</p>
                        <p className="font-medium text-charcoal capitalize">
                          {lead.caseType}
                        </p>
                      </div>
                    )}
                    {lead.amount && lead.type === "court" && (
                      <div>
                        <p className="text-text-muted">Amount</p>
                        <p className="font-medium text-charcoal">
                          {formatCurrency(lead.amount)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score Badge */}
                {lead.score !== undefined && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted">Lead Score:</span>
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                        lead.score >= 80 ? "bg-emerald/20 text-emerald" :
                        lead.score >= 60 ? "bg-amber/20 text-amber" :
                        "bg-surface text-text-muted"
                      }`}>
                        {lead.score}/100
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex border-t border-border bg-cream">
                <Link
                  href={`/app/search?tab=properties&q=${encodeURIComponent(lead.address)}`}
                  className="flex-1 px-4 py-2.5 text-center text-sm font-medium text-copper hover:bg-surface transition-colors"
                >
                  View Details
                </Link>
                <div className="w-px bg-border" />
                <Link
                  href={`/app/add-customer?name=${encodeURIComponent(lead.ownerName || "")}&address=${encodeURIComponent(lead.address)}&city=${encodeURIComponent(lead.city || "")}`}
                  className="flex-1 px-4 py-2.5 text-center text-sm font-medium text-text-muted hover:text-charcoal hover:bg-surface transition-colors"
                >
                  Add Customer
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
