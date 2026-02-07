// app/import/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ParsedCustomer = {
  full_name: string;
  email: string;
  phone: string;
  valid: boolean;
  error?: string;
};

export default function ImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [businessId, setBusinessId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedCustomer[]>([]);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);

  // Get business_id on mount
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

  const parseCSV = (text: string): ParsedCustomer[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    // Get headers (lowercase, trimmed)
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    // Find column indices
    const nameIndex = headers.findIndex((h) =>
      ["name", "full_name", "fullname", "customer", "customer_name"].includes(h)
    );
    const emailIndex = headers.findIndex((h) =>
      ["email", "e-mail", "email_address"].includes(h)
    );
    const phoneIndex = headers.findIndex((h) =>
      ["phone", "phone_number", "telephone", "tel", "mobile", "cell"].includes(h)
    );
    const cityIndex = headers.findIndex((h) =>
      ["city", "town", "city/town"].includes(h)
    );
    const stateIndex = headers.findIndex((h) =>
      ["state", "st"].includes(h)
    );
    const countyIndex = headers.findIndex((h) =>
      ["county"].includes(h)
    );

    if (nameIndex === -1 && emailIndex === -1 && phoneIndex === -1) {
      return [];
    }

    // Parse rows
    const customers: ParsedCustomer[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle quoted values with commas
      const values: string[] = [];
      let current = "";
      let inQuotes = false;

      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const full_name = nameIndex >= 0 ? values[nameIndex] || "" : "";
      const email = emailIndex >= 0 ? values[emailIndex] || "" : "";
      const phone = phoneIndex >= 0 ? values[phoneIndex] || "" : "";

      // Validate
      let valid = true;
      let errorMsg = "";

      if (!full_name && !phone) {
        valid = false;
        errorMsg = "Name or phone required";
      }

      customers.push({
        full_name,
        email,
        phone,
        valid,
        error: errorMsg || undefined,
      });
    }

    return customers;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResult(null);
    setParsedData([]);

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please upload a CSV file.");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);

      if (parsed.length === 0) {
        setError(
          "Could not parse CSV. Make sure it has headers like: name, email, phone"
        );
        return;
      }

      setParsedData(parsed);
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (!businessId || parsedData.length === 0) return;

    setImporting(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();

    let success = 0;
    let failed = 0;

    const validCustomers = parsedData.filter((c) => c.valid);

    for (const customer of validCustomers) {
      const { error } = await supabase.from("customers").insert({
        business_id: businessId,
        full_name: customer.full_name || null,
        email: customer.email || null,
        phone: customer.phone || null,
      });

      if (error) {
        failed++;
      } else {
        success++;
      }
    }

    setResult({ success, failed });
    setImporting(false);
  };

  const validCount = parsedData.filter((c) => c.valid).length;
  const invalidCount = parsedData.filter((c) => !c.valid).length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/customers"
          className="text-sm text-text-muted hover:text-charcoal"
        >
          ← Back to customers
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-charcoal">Import customers</h1>
      <p className="mb-8 text-text-muted">
        Upload a CSV file to bulk-import your existing customer list.
      </p>

      {/* Success Result */}
      {result && (
        <div className="mb-6 rounded-lg bg-green-900/30 border border-green-800 p-6">
          <h2 className="text-lg font-semibold text-green-200">Import complete!</h2>
          <p className="mt-2 text-green-300">
            Successfully imported {result.success} customers.
            {result.failed > 0 && ` ${result.failed} failed.`}
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/customers"
              className="rounded-md bg-copper px-4 py-2 text-sm font-semibold text-white hover:bg-copper-dark"
            >
              View customers
            </Link>
            <button
              onClick={() => {
                setFile(null);
                setParsedData([]);
                setResult(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="rounded-md bg-surface px-4 py-2 text-sm font-semibold hover:bg-cream"
            >
              Import more
            </button>
          </div>
        </div>
      )}

      {/* Upload Section */}
      {!result && (
        <>
          <div className="mb-6 max-w-xl rounded-lg border-2 border-dashed border-border bg-cream p-8">
            <div className="text-center">
              <p className="mb-4 text-text-secondary">
                Upload a CSV file with columns for name, email, and/or phone.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-block cursor-pointer rounded-md bg-surface px-6 py-3 font-semibold hover:bg-cream"
              >
                Choose CSV file
              </label>
              {file && (
                <p className="mt-3 text-sm text-text-muted">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>

          {/* Format Help */}
          <div className="mb-8 max-w-xl rounded-lg bg-surface p-5">
            <h3 className="mb-2 font-semibold text-charcoal">Expected CSV format</h3>
            <p className="mb-3 text-sm text-text-muted">
              Your CSV should have a header row with any of these column names:
            </p>
            <ul className="mb-4 space-y-1 text-sm text-text-muted">
              <li>• <strong className="text-text-secondary">Name:</strong> name, full_name, customer, customer_name</li>
              <li>• <strong className="text-text-secondary">Email:</strong> email, e-mail, email_address</li>
              <li>• <strong className="text-text-secondary">Phone:</strong> phone, phone_number, telephone, mobile, cell</li>
            </ul>
            <div className="rounded bg-cream p-3 text-xs font-mono text-text-secondary">
              name,email,phone<br />
              John Smith,john@email.com,555-123-4567<br />
              Jane Doe,jane@email.com,555-987-6543
            </div>
          </div>

          {error && (
            <div className="mb-6 max-w-xl rounded-md bg-red-900/50 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* Preview */}
          {parsedData.length > 0 && (
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-charcoal">Preview ({parsedData.length} rows)</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-400">{validCount} valid</span>
                  {invalidCount > 0 && (
                    <span className="text-red-400">{invalidCount} invalid</span>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-surface">
                <div className="max-h-80 overflow-y-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="sticky top-0 bg-cream text-xs uppercase text-text-muted">
                      <tr>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.slice(0, 100).map((customer, i) => (
                        <tr
                          key={i}
                          className={`border-t border-border ${
                            !customer.valid ? "bg-red-900/20" : ""
                          }`}
                        >
                          <td className="px-4 py-2">
                            {customer.valid ? (
                              <span className="text-green-400">✓</span>
                            ) : (
                              <span className="text-red-400" title={customer.error}>
                                ✗
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-text-secondary">
                            {customer.full_name || "—"}
                          </td>
                          <td className="px-4 py-2 text-text-secondary">
                            {customer.email || "—"}
                          </td>
                          <td className="px-4 py-2 text-text-secondary">
                            {customer.phone || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedData.length > 100 && (
                  <p className="border-t border-border px-4 py-2 text-sm text-text-muted">
                    Showing first 100 of {parsedData.length} rows
                  </p>
                )}
              </div>

              <div className="mt-4">
                <button
                  onClick={handleImport}
                  disabled={importing || validCount === 0}
                  className="rounded-md bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
                >
                  {importing
                    ? "Importing..."
                    : `Import ${validCount} customer${validCount !== 1 ? "s" : ""}`}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
