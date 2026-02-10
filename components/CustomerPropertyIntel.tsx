"use client";

import { useState } from "react";
import type { PropertyProfile } from "@/lib/property-types";

type Props = {
  profile: PropertyProfile;
};

export default function CustomerPropertyIntel({ profile }: Props) {
  const [activeTab, setActiveTab] = useState<"property" | "permits" | "sales" | "court">("property");

  const { property, permits, sales, courtRecords } = profile;

  // Format currency
  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (date: string | null | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const tabs = [
    { id: "property" as const, label: "Property" },
    { id: "permits" as const, label: `Permits (${permits.length})` },
    { id: "sales" as const, label: `Sales (${sales.length})` },
    { id: "court" as const, label: `Court (${courtRecords.length})` },
  ];

  return (
    <div className="rounded-lg bg-surface p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-charcoal">Property Intelligence</h2>
        <span className="rounded bg-copper/20 px-2 py-0.5 text-xs font-medium text-copper">
          Public Record
        </span>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg bg-cream p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-charcoal shadow-sm"
                : "text-text-muted hover:text-charcoal"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Property Details Tab */}
      {activeTab === "property" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-cream p-3">
            <p className="text-sm font-medium text-charcoal">{property.address_full}</p>
            <p className="text-xs text-text-muted">
              {property.municipality && `${property.municipality}, `}
              {property.county && `${property.county} County`}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Owner</p>
              <p className="mt-0.5 text-sm font-medium">{property.owner_name || "—"}</p>
              {property.owner_name_secondary && (
                <p className="text-xs text-text-muted">{property.owner_name_secondary}</p>
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Property Class</p>
              <p className="mt-0.5 text-sm font-medium capitalize">{property.property_class || "—"}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Assessed Value</p>
              <p className="mt-0.5 text-sm font-medium">{formatCurrency(property.assessed_value_total)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Market Value</p>
              <p className="mt-0.5 text-sm font-medium">{formatCurrency(property.market_value_estimate)}</p>
            </div>

            {property.year_built && (
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Year Built</p>
                <p className="mt-0.5 text-sm font-medium">{property.year_built}</p>
              </div>
            )}

            {property.lot_size_acres && (
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Lot Size</p>
                <p className="mt-0.5 text-sm font-medium">{property.lot_size_acres} acres</p>
              </div>
            )}

            {property.square_footage && (
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Sq. Footage</p>
                <p className="mt-0.5 text-sm font-medium">{property.square_footage.toLocaleString()} sqft</p>
              </div>
            )}

            {property.parcel_id && (
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Parcel ID</p>
                <p className="mt-0.5 text-sm font-mono text-xs">{property.parcel_id}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Permits Tab */}
      {activeTab === "permits" && (
        <div className="space-y-2">
          {permits.length === 0 ? (
            <p className="py-4 text-center text-sm text-text-muted">No permit records found</p>
          ) : (
            permits.slice(0, 10).map((permit) => (
              <div key={permit.id} className="rounded-lg border border-border bg-cream p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-charcoal capitalize">
                      {permit.permit_type || "Permit"}
                    </p>
                    {permit.permit_description && (
                      <p className="mt-0.5 truncate text-xs text-text-muted">
                        {permit.permit_description}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                      permit.status === "completed"
                        ? "bg-emerald/20 text-emerald"
                        : permit.status === "issued" || permit.status === "active"
                        ? "bg-amber/20 text-amber"
                        : "bg-gray-200 text-text-muted"
                    }`}
                  >
                    {permit.status || "Unknown"}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-text-muted">
                  {permit.date_issued && <span>Issued: {formatDate(permit.date_issued)}</span>}
                  {permit.contractor_name && <span>By: {permit.contractor_name}</span>}
                  {permit.estimated_cost && <span>Est: {formatCurrency(permit.estimated_cost)}</span>}
                </div>
              </div>
            ))
          )}
          {permits.length > 10 && (
            <p className="pt-2 text-center text-xs text-text-muted">
              + {permits.length - 10} more permits
            </p>
          )}
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === "sales" && (
        <div className="space-y-2">
          {sales.length === 0 ? (
            <p className="py-4 text-center text-sm text-text-muted">No sales history found</p>
          ) : (
            sales.map((sale) => (
              <div key={sale.id} className="rounded-lg border border-border bg-cream p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-charcoal">
                    {formatCurrency(sale.sale_price)}
                  </p>
                  <span className="text-xs text-text-muted">{formatDate(sale.sale_date)}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-text-muted">
                  {sale.buyer_name && <span>Buyer: {sale.buyer_name}</span>}
                  {sale.seller_name && <span>Seller: {sale.seller_name}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Court Records Tab */}
      {activeTab === "court" && (
        <div className="space-y-2">
          {courtRecords.length === 0 ? (
            <p className="py-4 text-center text-sm text-text-muted">No court records found</p>
          ) : (
            courtRecords.map((record) => (
              <div key={record.id} className="rounded-lg border border-border bg-cream p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-charcoal capitalize">
                    {record.case_type?.replace("_", " ") || "Case"}
                  </p>
                  <span className="shrink-0 text-xs text-text-muted">
                    {formatDate(record.filing_date)}
                  </span>
                </div>
                <div className="mt-1 space-y-0.5 text-xs text-text-muted">
                  {record.party_plaintiff && <p>Plaintiff: {record.party_plaintiff}</p>}
                  {record.party_defendant && <p>Defendant: {record.party_defendant}</p>}
                  {record.status && <p className="capitalize">Status: {record.status}</p>}
                  {record.amount && <p>Amount: {formatCurrency(record.amount)}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
