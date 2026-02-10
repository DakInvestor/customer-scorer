"use client";

import { useState } from "react";
import type { PropertyProfile, PermitRecord } from "@/lib/property-types";
import { formatNameForDisplay } from "@/lib/name-utils";

interface PropertyProfileCardProps {
  profile: PropertyProfile;
  showNetworkData?: boolean;
  onAddToCustomers?: (propertyId: string) => Promise<void>;
  isAddingCustomer?: boolean;
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

function getPermitTypeIcon(type: string | null): string {
  switch (type) {
    case "hvac":
      return "🌡️";
    case "plumbing":
      return "🔧";
    case "electrical":
      return "⚡";
    case "roofing":
      return "🏠";
    case "mechanical":
      return "⚙️";
    case "general":
      return "🔨";
    case "demolition":
      return "🏗️";
    default:
      return "📋";
  }
}

function getPermitStatusColor(status: string | null): string {
  switch (status) {
    case "completed":
      return "bg-emerald/20 text-emerald";
    case "active":
    case "issued":
      return "bg-amber/20 text-amber";
    case "expired":
      return "bg-critical/20 text-critical";
    default:
      return "bg-surface text-text-muted";
  }
}

export default function PropertyProfileCard({
  profile,
  showNetworkData = true,
  onAddToCustomers,
  isAddingCustomer = false,
}: PropertyProfileCardProps) {
  const [activeTab, setActiveTab] = useState<"details" | "permits" | "sales" | "court">("details");
  const { property, permits, sales, courtRecords, networkData } = profile;

  const currentYear = new Date().getFullYear();
  const propertyAge = property.year_built ? currentYear - property.year_built : null;

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-cream px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-forsure-blue/10 px-2 py-0.5 text-xs font-medium text-forsure-blue">
                Public Record
              </span>
              <span className="text-xs text-text-muted uppercase">
                {property.county} County
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-charcoal">
              {property.address_street || property.address_full || "Address Unknown"}
            </h2>
            <p className="text-sm text-text-secondary">
              {property.address_city}, {property.address_state} {property.address_zip}
            </p>
          </div>
          {property.municipality && (
            <span className="rounded-lg bg-surface px-3 py-1 text-xs text-text-muted">
              {property.municipality}
            </span>
          )}
        </div>
      </div>

      {/* Owner Info */}
      <div className="border-b border-border px-6 py-4">
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Property Owner</p>
        <p className="mt-1 text-lg font-semibold text-charcoal">
          {formatNameForDisplay(property.owner_name)}
        </p>
        {property.owner_name_secondary && (
          <p className="text-sm text-text-secondary">
            & {formatNameForDisplay(property.owner_name_secondary)}
          </p>
        )}
      </div>

      {/* Network Data Banner (if exists) */}
      {showNetworkData && networkData?.hasNetworkProfile && (
        <div className="border-b border-border bg-amber/10 px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-lg">🛡️</span>
            <div>
              <p className="text-sm font-medium text-charcoal">Network Data Available</p>
              <p className="text-xs text-text-secondary">
                Risk tier: <span className="font-medium capitalize">{networkData.riskTier || "Unknown"}</span>
                {networkData.totalIncidents ? ` • ${networkData.totalIncidents} incident(s)` : ""}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Network Data Notice */}
      {showNetworkData && !networkData?.hasNetworkProfile && (
        <div className="border-b border-border bg-surface px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-lg">📋</span>
            <div>
              <p className="text-sm font-medium text-charcoal">Public Records Only</p>
              <p className="text-xs text-text-secondary">
                No reliability data from the ForSure network yet
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex">
          {[
            { key: "details", label: "Property Details" },
            { key: "permits", label: `Permits (${permits.length})` },
            { key: "sales", label: `Sales (${sales.length})` },
            { key: "court", label: `Court (${courtRecords.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-copper text-copper"
                  : "text-text-muted hover:text-charcoal"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-5">
        {activeTab === "details" && (
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Property Info */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
                Property Information
              </h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">Year Built</dt>
                  <dd className="text-sm font-medium text-charcoal">
                    {property.year_built || "N/A"}
                    {propertyAge !== null && <span className="text-text-muted"> ({propertyAge} years old)</span>}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">Square Feet</dt>
                  <dd className="text-sm font-medium text-charcoal">
                    {property.square_footage?.toLocaleString() || "N/A"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">Bedrooms</dt>
                  <dd className="text-sm font-medium text-charcoal">{property.bedrooms || "N/A"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">Bathrooms</dt>
                  <dd className="text-sm font-medium text-charcoal">{property.bathrooms || "N/A"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">Lot Size</dt>
                  <dd className="text-sm font-medium text-charcoal">
                    {property.lot_size_acres ? `${property.lot_size_acres} acres` : "N/A"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">Property Class</dt>
                  <dd className="text-sm font-medium text-charcoal capitalize">
                    {property.property_class || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Value Info */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
                Valuation
              </h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">Assessed Value</dt>
                  <dd className="text-sm font-medium text-charcoal">
                    {formatCurrency(property.assessed_value_total)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">Land Value</dt>
                  <dd className="text-sm font-medium text-charcoal">
                    {formatCurrency(property.assessed_value_land)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">Building Value</dt>
                  <dd className="text-sm font-medium text-charcoal">
                    {formatCurrency(property.assessed_value_building)}
                  </dd>
                </div>
                {property.market_value_estimate && (
                  <div className="flex justify-between border-t border-border pt-2">
                    <dt className="text-sm font-medium text-text-secondary">Est. Market Value</dt>
                    <dd className="text-sm font-bold text-charcoal">
                      {formatCurrency(property.market_value_estimate)}
                    </dd>
                  </div>
                )}
              </dl>

              {/* Last Sale */}
              {property.last_sale_date && (
                <div className="mt-4 rounded-lg bg-surface p-3">
                  <p className="text-xs text-text-muted">Last Sale</p>
                  <p className="text-sm font-medium text-charcoal">
                    {formatCurrency(property.last_sale_price)} on {formatDate(property.last_sale_date)}
                  </p>
                </div>
              )}
            </div>

            {/* Service Suggestions */}
            {propertyAge !== null && propertyAge > 15 && (
              <div className="sm:col-span-2">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
                  Potential Service Needs
                </h3>
                <div className="flex flex-wrap gap-2">
                  {propertyAge > 20 && (
                    <span className="rounded-full bg-amber/20 px-3 py-1 text-xs font-medium text-amber">
                      🌡️ HVAC may need inspection
                    </span>
                  )}
                  {propertyAge > 25 && (
                    <span className="rounded-full bg-amber/20 px-3 py-1 text-xs font-medium text-amber">
                      ⚡ Electrical panel check
                    </span>
                  )}
                  {propertyAge > 30 && (
                    <span className="rounded-full bg-amber/20 px-3 py-1 text-xs font-medium text-amber">
                      🔧 Plumbing inspection
                    </span>
                  )}
                  {propertyAge > 15 && (
                    <span className="rounded-full bg-surface px-3 py-1 text-xs text-text-muted">
                      🏠 Water heater replacement
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "permits" && (
          <div>
            {permits.length === 0 ? (
              <p className="text-center text-sm text-text-muted py-8">
                No permits on record for this property
              </p>
            ) : (
              <div className="space-y-3">
                {permits.map((permit) => (
                  <div
                    key={permit.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{getPermitTypeIcon(permit.permit_type)}</span>
                        <div>
                          <p className="font-medium text-charcoal capitalize">
                            {permit.permit_type || "General"} Permit
                          </p>
                          <p className="text-sm text-text-secondary">
                            {permit.permit_description || "No description"}
                          </p>
                          {permit.contractor_name && (
                            <p className="mt-1 text-xs text-text-muted">
                              Contractor: {permit.contractor_name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${getPermitStatusColor(permit.status)}`}>
                          {permit.status || "Unknown"}
                        </span>
                        <p className="mt-1 text-xs text-text-muted">
                          {formatDate(permit.date_issued)}
                        </p>
                        {permit.estimated_cost && (
                          <p className="text-xs text-text-muted">
                            {formatCurrency(permit.estimated_cost)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "sales" && (
          <div>
            {sales.length === 0 ? (
              <p className="text-center text-sm text-text-muted py-8">
                No sale history on record
              </p>
            ) : (
              <div className="space-y-3">
                {sales.map((sale) => (
                  <div
                    key={sale.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-charcoal">
                          {formatCurrency(sale.sale_price)}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {formatDate(sale.sale_date)}
                        </p>
                        {sale.deed_type && (
                          <p className="mt-1 text-xs text-text-muted capitalize">
                            {sale.deed_type}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-text-muted">Buyer</p>
                        <p className="font-medium text-charcoal">
                          {formatNameForDisplay(sale.buyer_name)}
                        </p>
                        {sale.seller_name && (
                          <>
                            <p className="mt-2 text-text-muted">Seller</p>
                            <p className="text-text-secondary">
                              {formatNameForDisplay(sale.seller_name)}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "court" && (
          <div>
            {courtRecords.length === 0 ? (
              <p className="text-center text-sm text-text-muted py-8">
                No court records found for this property owner
              </p>
            ) : (
              <div className="space-y-3">
                {courtRecords.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-charcoal capitalize">
                          {record.case_type || "Civil"} Case
                        </p>
                        <p className="text-sm text-text-secondary">
                          {record.description || `Case #${record.case_number}`}
                        </p>
                        <div className="mt-2 text-xs text-text-muted">
                          <p>Plaintiff: {formatNameForDisplay(record.party_plaintiff)}</p>
                          <p>Defendant: {formatNameForDisplay(record.party_defendant)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                          record.status === "closed" || record.status === "dismissed"
                            ? "bg-surface text-text-muted"
                            : "bg-amber/20 text-amber"
                        }`}>
                          {record.status || "Unknown"}
                        </span>
                        <p className="mt-1 text-xs text-text-muted">
                          {formatDate(record.filing_date)}
                        </p>
                        {record.amount && (
                          <p className="text-sm font-medium text-charcoal">
                            {formatCurrency(record.amount)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {onAddToCustomers && (
        <div className="border-t border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal">Add to Your Customers</p>
              <p className="text-xs text-text-muted">
                Create a customer profile from this property record
              </p>
            </div>
            <button
              onClick={() => onAddToCustomers(property.id)}
              disabled={isAddingCustomer || networkData?.customerIdentifierId !== undefined}
              className="rounded-lg bg-copper px-4 py-2 text-sm font-medium text-white hover:bg-copper-dark disabled:opacity-50"
            >
              {isAddingCustomer
                ? "Adding..."
                : networkData?.customerIdentifierId
                ? "Already Added"
                : "+ Add Customer"}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-border bg-cream px-6 py-3 text-xs text-text-muted">
        Data from public records • Last updated: {formatDate(property.scraped_at)}
        {property.source_url && (
          <a
            href={property.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-copper hover:underline"
          >
            View source
          </a>
        )}
      </div>
    </div>
  );
}
