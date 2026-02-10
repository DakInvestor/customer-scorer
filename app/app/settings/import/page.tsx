"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { importPropertyOwnersAsCustomers, getImportableRecordCounts } from "@/app/app/leads/import-actions";

export default function ImportPage() {
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [counts, setCounts] = useState({
    salesCount: 0,
    propertyCount: 0,
    existingCustomerCount: 0,
  });
  const [result, setResult] = useState<{
    success: boolean;
    imported: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  useEffect(() => {
    loadCounts();
  }, []);

  async function loadCounts() {
    setLoading(true);
    try {
      const data = await getImportableRecordCounts();
      setCounts(data);
    } catch (err) {
      console.error("Error loading counts:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleImport() {
    setImporting(true);
    setResult(null);

    try {
      const importResult = await importPropertyOwnersAsCustomers();
      setResult(importResult);
      // Refresh counts after import
      await loadCounts();
    } catch (err) {
      console.error("Error importing:", err);
      setResult({
        success: false,
        imported: 0,
        skipped: 0,
        errors: ["An unexpected error occurred during import"],
      });
    } finally {
      setImporting(false);
    }
  }

  const totalAvailable = counts.salesCount + counts.propertyCount;

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <Link href="/app/settings" className="text-sm text-text-muted hover:text-charcoal">
          ← Back to settings
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-charcoal">Import Property Data</h1>
      <p className="mb-8 text-text-muted">
        Import property owners from your Supabase tables as customers.
      </p>

      {loading ? (
        <div className="rounded-xl border border-border bg-white p-6">
          <p className="text-text-muted">Loading data counts...</p>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          {/* Current Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Property Sales Records
              </p>
              <p className="mt-2 text-3xl font-bold text-charcoal">
                {counts.salesCount.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-text-muted">Available to import</p>
            </div>

            <div className="rounded-xl border border-border bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Property Records
              </p>
              <p className="mt-2 text-3xl font-bold text-charcoal">
                {counts.propertyCount.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-text-muted">Available to import</p>
            </div>

            <div className="rounded-xl border border-border bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Current Customers
              </p>
              <p className="mt-2 text-3xl font-bold text-copper">
                {counts.existingCustomerCount.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-text-muted">Already in your database</p>
            </div>
          </div>

          {/* Import Action */}
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-2">
              Import Property Owners as Customers
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              This will create customer records for all property owners found in your
              property_sales and property_records tables. Duplicates (matching address or name)
              will be automatically skipped.
            </p>

            {totalAvailable === 0 ? (
              <div className="rounded-lg border border-amber/30 bg-amber/10 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="font-medium text-charcoal">No data to import</p>
                    <p className="text-sm text-text-secondary mt-1">
                      Your property_sales and property_records tables are empty.
                      Make sure your scraper has collected data before importing.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleImport}
                disabled={importing}
                className="rounded-lg bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
              >
                {importing ? "Importing..." : `Import ${totalAvailable.toLocaleString()} Records`}
              </button>
            )}
          </div>

          {/* Result */}
          {result && (
            <div className={`rounded-xl border p-6 ${
              result.success
                ? "border-emerald/30 bg-emerald/10"
                : "border-amber/30 bg-amber/10"
            }`}>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                {result.success ? "Import Complete!" : "Import Completed with Issues"}
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <p className="text-sm text-text-muted">Successfully Imported</p>
                  <p className="text-2xl font-bold text-emerald">
                    {result.imported.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Skipped (Duplicates/Errors)</p>
                  <p className="text-2xl font-bold text-text-secondary">
                    {result.skipped.toLocaleString()}
                  </p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-sm font-medium text-charcoal mb-2">Errors:</p>
                  <ul className="text-sm text-text-secondary space-y-1">
                    {result.errors.map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4">
                <Link
                  href="/app/customers"
                  className="text-sm font-medium text-copper hover:text-copper-dark"
                >
                  View all customers →
                </Link>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="font-semibold text-charcoal mb-2">How it works</h3>
            <ul className="text-sm text-text-secondary space-y-2">
              <li>• <strong>property_sales</strong>: Imports buyer names and addresses from recent sales</li>
              <li>• <strong>property_records</strong>: Imports current owner names and addresses</li>
              <li>• Duplicates are detected by matching address or owner name</li>
              <li>• Each import creates a customer with name, address, city, and county</li>
              <li>• You can run this import multiple times - new records will be added</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
