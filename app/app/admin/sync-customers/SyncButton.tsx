"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { syncAllCustomers } from "./actions";

export default function SyncButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ synced: number; skipped: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSync() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await syncAllCustomers();
      if (res.error) {
        setError(res.error);
      } else {
        setResult({ synced: res.synced, skipped: res.skipped });
        router.refresh();
      }
    } catch (err) {
      setError("Sync failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleSync}
        disabled={loading}
        className="rounded-lg bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
      >
        {loading ? "Syncing..." : "Sync All Customers"}
      </button>

      {result && (
        <div className="mt-4 rounded-lg border border-emerald/20 bg-emerald/10 p-4">
          <p className="font-medium text-emerald">Sync Complete!</p>
          <p className="mt-1 text-sm text-text-secondary">
            Synced: {result.synced} customers | Skipped: {result.skipped} (no valid phone/email)
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-critical/20 bg-critical/10 p-4">
          <p className="text-sm text-critical">{error}</p>
        </div>
      )}
    </div>
  );
}
