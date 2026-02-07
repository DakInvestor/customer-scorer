"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface VerificationDocument {
  id: string;
  document_type: string;
  file_name: string;
  file_url: string;
}

interface Business {
  id: string;
  name: string;
  business_type: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  business_city: string;
  business_state: string;
  business_zip: string;
  business_website: string | null;
  business_license_number: string | null;
  ein_last_four: string | null;
}

interface PendingBusiness {
  id: string;
  verification_status: string;
  verification_submitted_at: string;
  business: Business;
  documents: VerificationDocument[];
}

interface AdminVerificationListProps {
  businesses: PendingBusiness[];
}

export default function AdminVerificationList({ businesses }: AdminVerificationListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  function getDocLabel(type: string): string {
    if (type === "business_license") return "Business License";
    if (type === "ein_letter") return "EIN Letter";
    if (type === "utility_bill") return "Utility Bill";
    return "Other";
  }

  async function handleApprove(profileId: string) {
    setLoading(profileId);
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase
      .from("profiles")
      .update({
        verification_status: "verified",
        verification_reviewed_at: new Date().toISOString(),
        verification_notes: notes[profileId] || null,
      })
      .eq("id", profileId);

    if (error) {
      alert("Failed to approve");
    } else {
      router.refresh();
    }
    setLoading(null);
  }

  async function handleReject(profileId: string) {
    setLoading(profileId);
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase
      .from("profiles")
      .update({
        verification_status: "rejected",
        verification_reviewed_at: new Date().toISOString(),
        verification_notes: notes[profileId] || null,
      })
      .eq("id", profileId);

    if (error) {
      alert("Failed to reject");
    } else {
      router.refresh();
    }
    setLoading(null);
  }

  return (
    <div className="divide-y divide-border">
      {businesses.map(function (item) {
        const biz = item.business;
        const isLoading = loading === item.id;
        const address = biz.business_address + ", " + biz.business_city + ", " + biz.business_state + " " + biz.business_zip;

        return (
          <div key={item.id} className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-charcoal">{biz.name}</h3>
                <p className="text-sm text-text-secondary">
                  Submitted {new Date(item.verification_submitted_at).toLocaleDateString()}
                </p>
              </div>
              <span className="rounded bg-amber/20 px-2 py-1 text-xs font-medium text-amber">
                Pending Review
              </span>
            </div>

            <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs text-text-muted">Business Type</p>
                <p className="text-sm text-charcoal">{biz.business_type}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Email</p>
                <p className="text-sm text-charcoal">{biz.business_email}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Phone</p>
                <p className="text-sm text-charcoal">{biz.business_phone}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Address</p>
                <p className="text-sm text-charcoal">{address}</p>
              </div>
              {biz.business_website ? (
                <div>
                  <p className="text-xs text-text-muted">Website</p>
                  <a
                    href={biz.business_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-copper hover:underline"
                  >
                    {biz.business_website}
                  </a>
                </div>
              ) : null}
              {biz.business_license_number ? (
                <div>
                  <p className="text-xs text-text-muted">License #</p>
                  <p className="text-sm text-charcoal">{biz.business_license_number}</p>
                </div>
              ) : null}
              {biz.ein_last_four ? (
                <div>
                  <p className="text-xs text-text-muted">EIN (last 4)</p>
                  <p className="text-sm text-charcoal">***-**-{biz.ein_last_four}</p>
                </div>
              ) : null}
            </div>

            <div className="mb-4">
              <p className="mb-2 text-xs font-medium text-text-muted">UPLOADED DOCUMENTS</p>
              {item.documents.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {item.documents.map(function (doc) {
                    return (
                      <a
                        key={doc.id}
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-charcoal hover:bg-surface"
                      >
                        {getDocLabel(doc.document_type)}
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-text-muted">No documents uploaded</p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-xs font-medium text-text-muted">
                ADMIN NOTES
              </label>
              <textarea
                value={notes[item.id] || ""}
                onChange={function (e) {
                  setNotes({ ...notes, [item.id]: e.target.value });
                }}
                placeholder="Add notes..."
                rows={2}
                className="w-full rounded-lg border border-border bg-white px-4 py-2 text-sm text-charcoal placeholder-text-muted outline-none focus:border-copper"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={function () {
                  handleApprove(item.id);
                }}
                disabled={isLoading}
                className="rounded-lg bg-emerald px-4 py-2 text-sm font-medium text-white hover:bg-emerald/90 disabled:opacity-50"
              >
                {isLoading ? "..." : "Approve"}
              </button>
              <button
                onClick={function () {
                  handleReject(item.id);
                }}
                disabled={isLoading}
                className="rounded-lg bg-critical px-4 py-2 text-sm font-medium text-white hover:bg-critical/90 disabled:opacity-50"
              >
                {isLoading ? "..." : "Reject"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}