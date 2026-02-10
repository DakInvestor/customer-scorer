"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { batchSyncPropertiesToCustomers } from "@/app/app/property/sync-actions";

interface PropertySyncClientProps {
  counties: string[];
  municipalities: string[];
}

export default function PropertySyncClient({
  counties,
  municipalities,
}: PropertySyncClientProps) {
  const router = useRouter();
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");
  const [batchSize, setBatchSize] = useState(500);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setResult(null);

    try {
      const res = await batchSyncPropertiesToCustomers({
        county: selectedCounty || undefined,
        municipality: selectedMunicipality || undefined,
        limit: batchSize,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setResult({ created: res.created, skipped: res.skipped });
        router.refresh();
      }
    } catch (err) {
      console.error("Sync error:", err);
      setError("Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Sync Options */}
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-charcoal">Batch Sync Options</h2>
        <p className="mb-4 text-sm text-text-muted">
          Create customer profiles from residential property records. This allows contractors to look up
          any address and see property details even before anyone has reported on that customer.
        </p>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                County (optional)
              </label>
              <select
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
                className="w-full rounded-md border border-border bg-cream px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
              >
                <option value="">All counties</option>
                {counties.map((county) => (
                  <option key={county} value={county}>
                    {county.charAt(0).toUpperCase() + county.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Municipality (optional)
              </label>
              <select
                value={selectedMunicipality}
                onChange={(e) => setSelectedMunicipality(e.target.value)}
                className="w-full rounded-md border border-border bg-cream px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
              >
                <option value="">All municipalities</option>
                {municipalities.map((municipality) => (
                  <option key={municipality} value={municipality}>
                    {municipality}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              Batch size
            </label>
            <select
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="w-full rounded-md border border-border bg-cream px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper sm:w-48"
            >
              <option value={100}>100 properties</option>
              <option value={500}>500 properties</option>
              <option value={1000}>1,000 properties</option>
              <option value={5000}>5,000 properties</option>
              <option value={10000}>10,000 properties</option>
            </select>
            <p className="mt-1 text-xs text-text-muted">
              Larger batches take longer but process more properties per run.
            </p>
          </div>
        </div>

        {result && (
          <div className="mt-4 rounded-lg border border-emerald/20 bg-emerald/10 p-4">
            <p className="font-medium text-emerald">Sync Complete!</p>
            <p className="mt-1 text-sm text-text-secondary">
              Created: {result.created} profiles | Skipped: {result.skipped} (already linked or ineligible)
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-critical/20 bg-critical/10 p-4">
            <p className="text-sm text-critical">{error}</p>
          </div>
        )}

        <button
          onClick={handleSync}
          disabled={syncing}
          className="mt-6 rounded-lg bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
        >
          {syncing ? "Syncing..." : "Start Batch Sync"}
        </button>
      </div>

      {/* How It Works */}
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-charcoal">How It Works</h2>
        <ol className="space-y-3 text-sm text-text-secondary">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-copper text-xs font-bold text-white">1</span>
            <span>Scans residential properties that haven't been linked yet</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-copper text-xs font-bold text-white">2</span>
            <span>Skips business-owned properties (LLC, Inc, Trust, etc.)</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-copper text-xs font-bold text-white">3</span>
            <span>Creates a customer_identifier with source="property_enrichment"</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-copper text-xs font-bold text-white">4</span>
            <span>Links the property record to the new identifier</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-copper text-xs font-bold text-white">5</span>
            <span>Contractors can now search by address and see property data</span>
          </li>
        </ol>
      </div>

      {/* Notes */}
      <div className="rounded-lg border border-amber/30 bg-amber/10 px-4 py-3">
        <p className="text-xs text-text-secondary">
          <strong className="text-charcoal">Note:</strong> Property-enriched profiles have no reliability score
          until a business reports an event on them. They're marked as "Public Record" to distinguish from
          network-reported customers.
        </p>
      </div>
    </div>
  );
}
