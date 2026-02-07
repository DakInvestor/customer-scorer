"use client";

import { useState, useEffect, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

interface VerificationDocument {
  id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  uploaded_at: string;
}

export default function VerifyBusinessPage() {
  const [status, setStatus] = useState("unverified");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [businessLicenseNumber, setBusinessLicenseNumber] = useState("");
  const [einLastFour, setEinLastFour] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("business_license");
  const [businessId, setBusinessId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function getDocLabel(type: string): string {
    if (type === "business_license") return "Business License";
    if (type === "ein_letter") return "EIN Letter";
    if (type === "utility_bill") return "Utility Bill";
    return "Other Document";
  }

  useEffect(function () {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createSupabaseBrowserClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("verification_status")
      .eq("id", user.id)
      .single();

    if (profile && profile.verification_status) {
      setStatus(profile.verification_status);
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("id, business_license_number, ein_last_four")
      .eq("owner_user_id", user.id)
      .single();

    if (business) {
      setBusinessId(business.id);
      setBusinessLicenseNumber(business.business_license_number || "");
      setEinLastFour(business.ein_last_four || "");

      const { data: docs } = await supabase
        .from("verification_documents")
        .select("*")
        .eq("business_id", business.id)
        .order("uploaded_at", { ascending: false });

      if (docs) {
        setDocuments(docs);
      }
    }

    setLoading(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user || !businessId) {
        throw new Error("Not authenticated or no business");
      }

      const fileName = user.id + "/" + Date.now() + "-" + file.name;

      const { error: uploadError } = await supabase.storage
        .from("verification-docs")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("verification-docs")
        .getPublicUrl(fileName);

      const { error: docError } = await supabase
        .from("verification_documents")
        .insert({
          business_id: businessId,
          document_type: selectedDocType,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
        });

      if (docError) throw docError;

      setSuccess("Document uploaded!");
      loadData();
    } catch (err) {
      console.error(err);
      setError("Failed to upload. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleSubmit() {
    if (documents.length === 0) {
      setError("Please upload at least one document.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) throw new Error("Not authenticated");

      await supabase
        .from("businesses")
        .update({
          business_license_number: businessLicenseNumber || null,
          ein_last_four: einLastFour || null,
        })
        .eq("owner_user_id", user.id);

      await supabase
        .from("profiles")
        .update({
          verification_status: "pending",
          verification_submitted_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      setStatus("pending");
      setSuccess("Submitted! We will review within 1-2 business days.");
    } catch (err) {
      console.error(err);
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  // Determine banner styles
  let bannerClass = "mb-8 rounded-xl border p-6 ";
  let iconBgClass = "flex h-10 w-10 items-center justify-center rounded-full ";
  let titleClass = "font-semibold ";
  let icon = "";
  let title = "";
  let subtitle = "";

  if (status === "verified") {
    bannerClass += "border-emerald/30 bg-emerald/10";
    iconBgClass += "bg-emerald/20";
    titleClass += "text-emerald";
    icon = "✓";
    title = "Verified Business";
    subtitle = "Your business has been verified.";
  } else if (status === "pending") {
    bannerClass += "border-amber/30 bg-amber/10";
    iconBgClass += "bg-amber/20";
    titleClass += "text-amber";
    icon = "⏳";
    title = "Verification Pending";
    subtitle = "We are reviewing your submission.";
  } else if (status === "rejected") {
    bannerClass += "border-critical/30 bg-critical/10";
    iconBgClass += "bg-critical/20";
    titleClass += "text-critical";
    icon = "✗";
    title = "Verification Rejected";
    subtitle = "Please review and resubmit.";
  } else {
    bannerClass += "border-border bg-cream";
    iconBgClass += "bg-surface";
    titleClass += "text-charcoal";
    icon = "🛡️";
    title = "Not Yet Verified";
    subtitle = "Complete verification below.";
  }

  const showForm = status === "unverified" || status === "rejected";

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal md:text-3xl">Business Verification</h1>
        <p className="mt-1 text-text-secondary">Verify your business to access all features.</p>
      </div>

      <div className={bannerClass}>
        <div className="flex items-center gap-3">
          <div className={iconBgClass}>
            <span className="text-lg">{icon}</span>
          </div>
          <div>
            <p className={titleClass}>{title}</p>
            <p className="text-sm text-text-secondary">{subtitle}</p>
          </div>
        </div>
      </div>

      {showForm ? (
        <div>
          <div className="mb-8 rounded-xl border border-border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-charcoal">Business Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">
                  Business License Number
                </label>
                <input
                  type="text"
                  value={businessLicenseNumber}
                  onChange={function (e) {
                    setBusinessLicenseNumber(e.target.value);
                  }}
                  placeholder="e.g., BL-12345678"
                  className="w-full rounded-lg border border-border bg-cream px-4 py-2.5 text-charcoal placeholder-text-muted outline-none focus:border-copper"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">
                  EIN (Last 4 digits)
                </label>
                <input
                  type="text"
                  value={einLastFour}
                  onChange={function (e) {
                    setEinLastFour(e.target.value.slice(0, 4));
                  }}
                  placeholder="1234"
                  maxLength={4}
                  className="w-full rounded-lg border border-border bg-cream px-4 py-2.5 text-charcoal placeholder-text-muted outline-none focus:border-copper"
                />
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-xl border border-border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-charcoal">Verification Documents</h2>
            <p className="mb-4 text-sm text-text-secondary">Upload at least one document.</p>

            <div className="mb-4 flex flex-wrap gap-3">
              <select
                value={selectedDocType}
                onChange={function (e) {
                  setSelectedDocType(e.target.value);
                }}
                className="rounded-lg border border-border bg-cream px-4 py-2 text-sm text-charcoal outline-none"
              >
                <option value="business_license">Business License</option>
                <option value="ein_letter">EIN Letter</option>
                <option value="utility_bill">Utility Bill</option>
                <option value="other">Other</option>
              </select>

              <label className="cursor-pointer rounded-lg bg-copper px-4 py-2 text-sm font-medium text-white hover:bg-copper-dark">
                {uploading ? "Uploading..." : "Upload Document"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map(function (doc) {
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-surface/30 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-charcoal">{doc.file_name}</p>
                        <p className="text-xs text-text-muted">{getDocLabel(doc.document_type)}</p>
                      </div>
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-copper hover:text-copper/80"
                      >
                        View
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No documents uploaded yet.</p>
            )}
          </div>

          {error ? (
            <div className="mb-4 rounded-lg border border-critical/20 bg-critical/10 px-4 py-3 text-sm text-critical">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mb-4 rounded-lg border border-emerald/20 bg-emerald/10 px-4 py-3 text-sm text-emerald">
              {success}
            </div>
          ) : null}

          <button
            onClick={handleSubmit}
            disabled={submitting || documents.length === 0}
            className="rounded-lg bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit for Verification"}
          </button>
        </div>
      ) : null}

      {status === "verified" ? (
        <div className="text-center">
          <p className="text-text-secondary">Your business is verified!</p>
          <Link
            href="/app"
            className="mt-4 inline-block rounded-lg bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : null}

      {status === "pending" ? (
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-charcoal">Submitted Documents</h2>
          {documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map(function (doc) {
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface/30 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-charcoal">{doc.file_name}</p>
                      <p className="text-xs text-text-muted">{getDocLabel(doc.document_type)}</p>
                    </div>
                    <span className="rounded bg-amber/20 px-2 py-1 text-xs text-amber">
                      Under Review
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-text-muted">No documents found.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
