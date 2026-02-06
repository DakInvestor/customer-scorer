// app/export/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { logAuditEvent } from "@/lib/audit";

export default function ExportPage() {
  const router = useRouter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const downloadCSV = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const escapeCSV = (value: string | null | undefined): string => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const exportCustomers = async () => {
    if (!businessId) return;
    setExporting("customers");
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();

      const { data: customers, error: fetchError } = await supabase
        .from("customers")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      if (!customers || customers.length === 0) {
        setError("No customers to export.");
        return;
      }

      // Build CSV
      const headers = ["ID", "Full Name", "Email", "Phone", "City", "State", "County", "Created At"];
      const rows = customers.map((c) => [
        escapeCSV(c.id),
        escapeCSV(c.full_name),
        escapeCSV(c.email),
        escapeCSV(c.phone),
        escapeCSV(c.city),
        escapeCSV(c.state),
        escapeCSV(c.county),
        escapeCSV(c.created_at),
      ].join(","));

      const csvContent = [headers.join(","), ...rows].join("\n");
      const date = new Date().toISOString().split("T")[0];
      downloadCSV(`customers-export-${date}.csv`, csvContent);

      // Log audit event
      await logAuditEvent(businessId, "EXPORTED_DATA", undefined, { type: "customers", count: customers.length });

    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to export customers.");
    } finally {
      setExporting(null);
    }
  };

  const exportEvents = async () => {
    if (!businessId) return;
    setExporting("events");
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();

      // Get customers for name lookup
      const { data: customers } = await supabase
        .from("customers")
        .select("id, full_name")
        .eq("business_id", businessId);

      const customerMap: Record<string, string> = {};
      (customers || []).forEach((c) => {
        customerMap[c.id] = c.full_name || "Unknown";
      });

      const { data: notes, error: fetchError } = await supabase
        .from("customer_notes")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      if (!notes || notes.length === 0) {
        setError("No events to export.");
        return;
      }

      // Build CSV
      const headers = ["ID", "Customer ID", "Customer Name", "Event Type", "Severity", "Note", "Created At"];
      const rows = notes.map((n) => [
        escapeCSV(n.id),
        escapeCSV(n.customer_id),
        escapeCSV(customerMap[n.customer_id] || "Unknown"),
        escapeCSV(n.note_type),
        escapeCSV(String(n.severity)),
        escapeCSV(n.note_text),
        escapeCSV(n.created_at),
      ].join(","));

      const csvContent = [headers.join(","), ...rows].join("\n");
      const date = new Date().toISOString().split("T")[0];
      downloadCSV(`events-export-${date}.csv`, csvContent);

      // Log audit event
      await logAuditEvent(businessId, "EXPORTED_DATA", undefined, { type: "events", count: notes.length });

    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to export events.");
    } finally {
      setExporting(null);
    }
  };

  const exportAll = async () => {
    await exportCustomers();
    await exportEvents();
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <Link href="/settings" className="text-sm text-gray-400 hover:text-white">
          ← Back to settings
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-bold">Export Data</h1>
      <p className="mb-8 text-gray-400">
        Download your customer and event data as CSV files.
      </p>

      {error && (
        <div className="mb-6 max-w-md rounded-md bg-red-900/50 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl">
        {/* Customers Export */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-2 text-lg font-semibold">Customers</h2>
          <p className="mb-4 text-sm text-gray-400">
            Export all customer profiles including name, contact info, and location.
          </p>
          <button
            onClick={exportCustomers}
            disabled={exporting !== null || !businessId}
            className="w-full rounded-md bg-gray-700 px-4 py-2.5 font-medium hover:bg-gray-600 disabled:opacity-50"
          >
            {exporting === "customers" ? "Exporting..." : "Download CSV"}
          </button>
        </div>

        {/* Events Export */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-2 text-lg font-semibold">Events</h2>
          <p className="mb-4 text-sm text-gray-400">
            Export all logged events including type, severity, and notes.
          </p>
          <button
            onClick={exportEvents}
            disabled={exporting !== null || !businessId}
            className="w-full rounded-md bg-gray-700 px-4 py-2.5 font-medium hover:bg-gray-600 disabled:opacity-50"
          >
            {exporting === "events" ? "Exporting..." : "Download CSV"}
          </button>
        </div>

        {/* Export All */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-2 text-lg font-semibold">Everything</h2>
          <p className="mb-4 text-sm text-gray-400">
            Download both customers and events as separate CSV files.
          </p>
          <button
            onClick={exportAll}
            disabled={exporting !== null || !businessId}
            className="w-full rounded-md bg-white px-4 py-2.5 font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Download All"}
          </button>
        </div>
      </div>

      <div className="mt-8 max-w-3xl rounded-lg bg-gray-800/50 p-4">
        <h3 className="mb-2 font-medium">Your Data Rights</h3>
        <p className="text-sm text-gray-400">
          You have the right to export all data you have submitted to Customer Scorer at any time. 
          Exported files are in CSV format and can be opened in Excel, Google Sheets, or any 
          spreadsheet application. For questions about your data, contact privacy@customerscorer.com.
        </p>
      </div>
    </div>
  );
}