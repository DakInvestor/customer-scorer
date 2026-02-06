"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

interface EventCategory {
  id: string;
  name: string;
  description: string;
  severity: string;
  base_weight: number;
  evidence_required: boolean;
  evidence_description: string | null;
  is_positive: boolean;
}

interface BusinessInfo {
  id: string;
  name: string;
  network_write_access: boolean;
  verification_level: string;
  reputation_score: number;
  total_network_contributions: number;
}

interface ProfileInfo {
  verification_status: string;
}

export default function ReportEventPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [searchType, setSearchType] = useState<"phone" | "email">("phone");
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);

  useEffect(function() {
    loadData();
  }, []);

  async function loadData() {
    try {
      const supabase = createSupabaseBrowserClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("verification_status")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Get business
      const { data: bizData } = await supabase
        .from("businesses")
        .select("id, name, network_write_access, verification_level, reputation_score, total_network_contributions")
        .eq("owner_user_id", user.id)
        .single();

      if (bizData) {
        setBusiness(bizData);
        setCanSubmit(bizData.network_write_access === true && profileData?.verification_status === "verified");
      }

      // Get event categories
      const { data: cats } = await supabase
        .from("network_event_categories")
        .select("*")
        .eq("active", true)
        .order("is_positive", { ascending: true })
        .order("base_weight", { ascending: false });

      if (cats) {
        setCategories(cats);
      }

      // Set default date to today
      const today = new Date().toISOString().split("T")[0];
      setOccurredAt(today);

    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
  }

  function normalizePhone(phone: string): string {
    return phone.replace(/\D/g, "");
  }

  function normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  async function hashValue(value: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(function(b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  function getSelectedCategory(): EventCategory | undefined {
    return categories.find(function(c) { return c.id === selectedCategory; });
  }

  function validateStep1(): boolean {
    if (!searchValue.trim()) {
      setError("Please enter a phone number or email.");
      return false;
    }
    if (searchType === "phone" && normalizePhone(searchValue).length < 10) {
      setError("Please enter a complete 10-digit phone number.");
      return false;
    }
    if (searchType === "email" && !searchValue.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  }

  function validateStep2(): boolean {
    if (!selectedCategory) {
      setError("Please select an event type.");
      return false;
    }
    if (!occurredAt) {
      setError("Please enter when this occurred.");
      return false;
    }
    const cat = getSelectedCategory();
    if (cat && cat.evidence_required && !evidenceFile) {
      setError("This event type requires evidence. Please upload a file.");
      return false;
    }
    return true;
  }

  function handleNext() {
    setError("");
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  }

  function handleBack() {
    setError("");
    setStep(1);
  }

  async function handleSubmit() {
    setError("");
    
    if (!validateStep2()) return;
    if (!business) {
      setError("Business not found.");
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create hash
      let hash: string;
      let phoneLast4: string | null = null;
      let emailDomain: string | null = null;

      if (searchType === "phone") {
        const normalized = normalizePhone(searchValue);
        hash = await hashValue(normalized);
        phoneLast4 = normalized.slice(-4);
      } else {
        const normalized = normalizeEmail(searchValue);
        hash = await hashValue(normalized);
        emailDomain = normalized.split("@")[1];
      }

      // Check if customer identifier exists
      const column = searchType === "phone" ? "phone_hash" : "email_hash";
      let { data: existing } = await supabase
        .from("customer_identifiers")
        .select("id")
        .eq(column, hash)
        .single();

      let customerIdentifierId: string;

      if (existing) {
        customerIdentifierId = existing.id;
        
        // Update seen count
        await supabase
          .from("customer_identifiers")
          .update({
            last_seen_at: new Date().toISOString(),
            seen_by_business_count: supabase.rpc("increment_seen_count", { row_id: existing.id })
          })
          .eq("id", existing.id);
      } else {
        // Create new customer identifier
        const insertData: Record<string, unknown> = {
          phone_hash: searchType === "phone" ? hash : null,
          email_hash: searchType === "email" ? hash : null,
          phone_last_four: phoneLast4,
          email_domain: emailDomain,
          seen_by_business_count: 1,
        };

        const { data: newCustomer, error: insertError } = await supabase
          .from("customer_identifiers")
          .insert(insertData)
          .select("id")
          .single();

        if (insertError) throw insertError;
        customerIdentifierId = newCustomer.id;
      }

      // Upload evidence if provided
      let evidenceUrl: string | null = null;
      let evidenceFileName: string | null = null;

      if (evidenceFile) {
        const fileExt = evidenceFile.name.split(".").pop();
        const fileName = business.id + "/" + Date.now() + "." + fileExt;

        const { error: uploadError } = await supabase.storage
          .from("network-evidence")
          .upload(fileName, evidenceFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("network-evidence")
          .getPublicUrl(fileName);

        evidenceUrl = urlData.publicUrl;
        evidenceFileName = evidenceFile.name;
      }

      // Get category details
      const category = getSelectedCategory();
      if (!category) throw new Error("Category not found");

      // Calculate business reputation multiplier
      let reputationMultiplier = 1.0;
      if (business.total_network_contributions < 5) {
        reputationMultiplier = 0.6;
      } else if (business.total_network_contributions < 20) {
        reputationMultiplier = 0.8;
      } else if (business.reputation_score >= 80) {
        reputationMultiplier = 1.2;
      } else if (business.reputation_score >= 60) {
        reputationMultiplier = 1.0;
      } else if (business.reputation_score >= 40) {
        reputationMultiplier = 0.75;
      } else {
        reputationMultiplier = 0.5;
      }

      // Create network event
      const { error: eventError } = await supabase
        .from("network_events")
        .insert({
          customer_identifier_id: customerIdentifierId,
          event_category_id: selectedCategory,
          business_id: business.id,
          user_id: user.id,
          user_role: "owner",
          occurred_at: occurredAt,
          private_notes: privateNotes || null,
          evidence_url: evidenceUrl,
          evidence_file_name: evidenceFileName,
          evidence_uploaded_at: evidenceFile ? new Date().toISOString() : null,
          base_weight: category.base_weight,
          business_reputation_multiplier: reputationMultiplier,
          decay_multiplier: 1.0,
          status: "active",
        });

      if (eventError) throw eventError;

      // Update incident counts
      const { data: existingCount } = await supabase
        .from("network_incident_counts")
        .select("id, total_count, active_count")
        .eq("customer_identifier_id", customerIdentifierId)
        .eq("event_category_id", selectedCategory)
        .single();

      if (existingCount) {
        await supabase
          .from("network_incident_counts")
          .update({
            total_count: existingCount.total_count + 1,
            active_count: existingCount.active_count + 1,
            last_occurred_at: occurredAt,
          })
          .eq("id", existingCount.id);
      } else {
        await supabase
          .from("network_incident_counts")
          .insert({
            customer_identifier_id: customerIdentifierId,
            event_category_id: selectedCategory,
            total_count: 1,
            active_count: 1,
            last_occurred_at: occurredAt,
          });
      }

      // Update customer identifier totals
      const isPositive = category.is_positive;
      const weightedImpact = category.base_weight * reputationMultiplier;

      if (isPositive) {
        await supabase.rpc("update_customer_positive", {
          cid: customerIdentifierId,
          weight: weightedImpact
        });
      } else {
        await supabase.rpc("update_customer_negative", {
          cid: customerIdentifierId,
          weight: weightedImpact,
          incident_date: occurredAt
        });
      }

      // Update business contribution count
      await supabase
        .from("businesses")
        .update({
          total_network_contributions: business.total_network_contributions + 1
        })
        .eq("id", business.id);

      // Log to audit
      await supabase.from("audit_logs").insert({
        business_id: business.id,
        user_id: user.id,
        user_role: "owner",
        action: "create",
        entity_type: "network_event",
        entity_id: customerIdentifierId,
        new_values: {
          event_category: selectedCategory,
          occurred_at: occurredAt,
          has_evidence: !!evidenceFile
        }
      });

      // Track monthly reports for soft limit
      const monthYear = new Date().toISOString().slice(0, 7);
      const { data: monthlyReport } = await supabase
        .from("business_monthly_reports")
        .select("id, total_reports, negative_reports, severe_reports")
        .eq("business_id", business.id)
        .eq("month_year", monthYear)
        .single();

      const isSevere = category.severity === "severe" || category.severity === "high";

      if (monthlyReport) {
        await supabase
          .from("business_monthly_reports")
          .update({
            total_reports: monthlyReport.total_reports + 1,
            negative_reports: !isPositive ? monthlyReport.negative_reports + 1 : monthlyReport.negative_reports,
            severe_reports: isSevere ? monthlyReport.severe_reports + 1 : monthlyReport.severe_reports,
            flagged_for_review: monthlyReport.negative_reports + 1 > 20
          })
          .eq("id", monthlyReport.id);
      } else {
        await supabase
          .from("business_monthly_reports")
          .insert({
            business_id: business.id,
            month_year: monthYear,
            total_reports: 1,
            negative_reports: !isPositive ? 1 : 0,
            severe_reports: isSevere ? 1 : 0,
          });
      }

      setSuccess(true);

    } catch (err) {
      console.error("Submit error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to submit event. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function getSeverityColor(severity: string): string {
    if (severity === "low") return "text-slate-400";
    if (severity === "medium") return "text-amber";
    if (severity === "high") return "text-orange-500";
    if (severity === "severe") return "text-critical";
    return "text-slate-400";
  }

  function getSeverityBg(severity: string): string {
    if (severity === "low") return "bg-slate-800 border-slate-700";
    if (severity === "medium") return "bg-amber/10 border-amber/20";
    if (severity === "high") return "bg-orange-500/10 border-orange-500/20";
    if (severity === "severe") return "bg-critical/10 border-critical/20";
    return "bg-slate-800 border-slate-700";
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-forsure-blue border-t-transparent"></div>
      </div>
    );
  }

  // Not authorized view
  if (!canSubmit) {
    return (
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white md:text-3xl">Report Event</h1>
          <p className="mt-1 text-slate-gray">
            Submit customer events to the network.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber/20">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Network Access Required</h3>
          <p className="mt-2 text-slate-gray">
            To report events to the network, you need:
          </p>
          <ul className="mt-4 space-y-2 text-left max-w-sm mx-auto">
            <li className="flex items-center gap-3">
              {profile?.verification_status === "verified" ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald/20 text-emerald text-sm">✓</span>
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-slate-400 text-sm">1</span>
              )}
              <span className={profile?.verification_status === "verified" ? "text-emerald" : "text-slate-300"}>
                Verified business status
              </span>
            </li>
            <li className="flex items-center gap-3">
              {business?.network_write_access ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald/20 text-emerald text-sm">✓</span>
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-slate-400 text-sm">2</span>
              )}
              <span className={business?.network_write_access ? "text-emerald" : "text-slate-300"}>
                Pro or Business subscription
              </span>
            </li>
          </ul>
          <div className="mt-6 flex justify-center gap-3">
            {profile?.verification_status !== "verified" && (
              <Link
                href="/app/verify"
                className="rounded-lg bg-forsure-blue px-4 py-2 font-medium text-white hover:bg-forsure-blue/90"
              >
                Get Verified
              </Link>
            )}
            {!business?.network_write_access && (
              <Link
                href="/app/settings"
                className="rounded-lg border border-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-800"
              >
                Upgrade Plan
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Success view
  if (success) {
    return (
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white md:text-3xl">Report Event</h1>
        </div>

        <div className="rounded-xl border border-emerald/20 bg-emerald/10 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald/20">
            <span className="text-2xl">✓</span>
          </div>
          <h3 className="text-lg font-semibold text-emerald">Event Submitted</h3>
          <p className="mt-2 text-slate-gray">
            Your report has been added to the network. Thank you for helping keep the community safe.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={function() {
                setSuccess(false);
                setStep(1);
                setSearchValue("");
                setSelectedCategory("");
                setPrivateNotes("");
                setEvidenceFile(null);
              }}
              className="rounded-lg bg-forsure-blue px-4 py-2 font-medium text-white hover:bg-forsure-blue/90"
            >
              Report Another
            </button>
            <Link
              href="/app/network"
              className="rounded-lg border border-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-800"
            >
              Search Network
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Report Event</h1>
        <p className="mt-1 text-slate-gray">
          Submit customer events to help other businesses make informed decisions.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={
              step >= 1
                ? "flex h-8 w-8 items-center justify-center rounded-full bg-forsure-blue text-sm font-medium text-white"
                : "flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-sm font-medium text-slate-400"
            }>
              1
            </div>
            <span className={step >= 1 ? "text-white" : "text-slate-500"}>Customer</span>
          </div>
          <div className={step >= 2 ? "h-px flex-1 bg-forsure-blue" : "h-px flex-1 bg-slate-700"} />
          <div className="flex items-center gap-2">
            <div className={
              step >= 2
                ? "flex h-8 w-8 items-center justify-center rounded-full bg-forsure-blue text-sm font-medium text-white"
                : "flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-sm font-medium text-slate-400"
            }>
              2
            </div>
            <span className={step >= 2 ? "text-white" : "text-slate-500"}>Event Details</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        {/* Step 1: Customer */}
        {step === 1 && (
          <div>
            <h2 className="mb-6 text-xl font-semibold text-white">Identify Customer</h2>

            <div className="mb-4 flex gap-2">
              <button
                onClick={function() { setSearchType("phone"); setSearchValue(""); }}
                className={
                  searchType === "phone"
                    ? "rounded-lg bg-forsure-blue px-4 py-2 text-sm font-medium text-white"
                    : "rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
                }
              >
                Phone Number
              </button>
              <button
                onClick={function() { setSearchType("email"); setSearchValue(""); }}
                className={
                  searchType === "email"
                    ? "rounded-lg bg-forsure-blue px-4 py-2 text-sm font-medium text-white"
                    : "rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
                }
              >
                Email Address
              </button>
            </div>

            <div>
              {searchType === "phone" ? (
                <input
                  type="tel"
                  value={searchValue}
                  onChange={function(e) { setSearchValue(formatPhone(e.target.value)); }}
                  placeholder="(555) 123-4567"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
                />
              ) : (
                <input
                  type="email"
                  value={searchValue}
                  onChange={function(e) { setSearchValue(e.target.value); }}
                  placeholder="customer@example.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
                />
              )}
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Enter the customer's {searchType === "phone" ? "phone number" : "email address"} to identify them in the network.
              This information is hashed for privacy — we never store the raw data.
            </p>
          </div>
        )}

        {/* Step 2: Event Details */}
        {step === 2 && (
          <div>
            <h2 className="mb-6 text-xl font-semibold text-white">Event Details</h2>

            {/* Customer identifier display */}
            <div className="mb-6 rounded-lg bg-slate-800/50 px-4 py-3">
              <p className="text-sm text-slate-400">
                Reporting for: <span className="text-white">{searchValue}</span>
              </p>
            </div>

            {/* Event Type */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Event Type
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {categories.map(function(cat) {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={function() { setSelectedCategory(cat.id); }}
                      className={
                        isSelected
                          ? "rounded-lg border-2 border-forsure-blue bg-forsure-blue/10 p-4 text-left"
                          : "rounded-lg border border-slate-700 bg-slate-800/30 p-4 text-left hover:border-slate-600"
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={
                            cat.is_positive
                              ? "font-medium text-emerald"
                              : "font-medium text-white"
                          }>
                            {cat.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{cat.description}</p>
                        </div>
                        <span className={"rounded px-2 py-0.5 text-xs " + getSeverityBg(cat.severity) + " " + getSeverityColor(cat.severity)}>
                          {cat.severity}
                        </span>
                      </div>
                      {cat.evidence_required && (
                        <p className="mt-2 text-xs text-amber">⚠️ Evidence required</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                When did this occur?
              </label>
              <input
                type="date"
                value={occurredAt}
                onChange={function(e) { setOccurredAt(e.target.value); }}
                max={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white outline-none focus:border-forsure-blue sm:w-auto"
              />
            </div>

            {/* Evidence Upload */}
            {getSelectedCategory()?.evidence_required && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Evidence <span className="text-critical">*</span>
                </label>
                <p className="mb-3 text-sm text-slate-500">
                  {getSelectedCategory()?.evidence_description}
                </p>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer rounded-lg border border-dashed border-slate-600 bg-slate-800/30 px-6 py-4 hover:border-slate-500">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={function(e) {
                        const file = e.target.files?.[0];
                        if (file) setEvidenceFile(file);
                      }}
                      className="hidden"
                    />
                    <span className="text-sm text-slate-400">
                      {evidenceFile ? evidenceFile.name : "Click to upload file"}
                    </span>
                  </label>
                  {evidenceFile && (
                    <button
                      type="button"
                      onClick={function() { setEvidenceFile(null); }}
                      className="text-sm text-critical hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Private Notes */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Private Notes <span className="text-slate-500">(optional)</span>
              </label>
              <textarea
                value={privateNotes}
                onChange={function(e) { setPrivateNotes(e.target.value); }}
                placeholder="Add any private notes for your records..."
                rows={3}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
              />
              <p className="mt-2 text-xs text-slate-500">
                🔒 Private notes are never shared with other businesses. Only the event type is visible on the network.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-critical/20 bg-critical/10 px-4 py-3 text-sm text-critical">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 font-medium text-white hover:bg-slate-800 sm:flex-none"
            >
              Back
            </button>
          )}

          {step < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 rounded-lg bg-forsure-blue px-4 py-2.5 font-medium text-white hover:bg-forsure-blue/90"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 rounded-lg bg-forsure-blue px-4 py-2.5 font-medium text-white hover:bg-forsure-blue/90 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/30 p-4 text-xs text-slate-500">
        <p className="font-medium text-slate-400">Reporting Guidelines</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Only report events you personally witnessed or have documentation for.</li>
          <li>False or malicious reports may result in account suspension.</li>
          <li>Severe events require evidence to be considered.</li>
          <li>Your business identity is never revealed to other businesses.</li>
        </ul>
      </div>
    </div>
  );
}