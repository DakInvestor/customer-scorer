// app/customers/[id]/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient, getCurrentBusinessId } from "@/lib/supabase/server";
import AddNoteForm from "./AddNoteForm";
import EditCustomerForm from "./EditCustomerForm";
import DeleteCustomerButton from "./DeleteCustomerButton";
import { calculateFullAnalytics, calculatePercentile } from "@/lib/scoring";
import type { NoteForScoring } from "@/lib/scoring";

type PageProps = {
  params: Promise<{ id: string }>;
};

type Customer = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  county: string | null;
  created_at: string;
  business_id: string;
};

type CustomerNote = NoteForScoring & {
  id: string;
  customer_id: string;
  note_type: string | null;
  note_text: string | null;
  business_id: string;
};

function getScoreBadgeClasses(score: number) {
  if (score >= 80) return "bg-emerald-600 text-white";
  if (score >= 60) return "bg-amber-500 text-gray-900";
  if (score >= 40) return "bg-amber-500 text-gray-900";
  return "bg-red-600 text-white";
}

function getReliabilityIndicator(score: number) {
  if (score >= 80) return "Good standing";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Some concerns";
  return "Multiple concerns";
}

function getRiskBadgeClasses(risk: string) {
  if (risk === "Low") return "bg-green-900/50 text-green-200";
  if (risk === "Medium") return "bg-yellow-900/50 text-yellow-200";
  return "bg-red-900/50 text-red-200";
}

function getTrendIcon(trend: string) {
  if (trend === "Improving") return "↑";
  if (trend === "Declining") return "↓";
  return "→";
}

function getTrendClasses(trend: string) {
  if (trend === "Improving") return "text-green-400";
  if (trend === "Declining") return "text-red-400";
  return "text-gray-400";
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const businessId = await getCurrentBusinessId();

  if (!businessId) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  // Load the customer
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .eq("business_id", businessId)
    .single<Customer>();

  if (customerError || !customer) {
    return notFound();
  }

  // Load notes for this customer
  const { data: notes } = await supabase
    .from("customer_notes")
    .select("*")
    .eq("customer_id", id)
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  const typedNotes = (notes ?? []) as CustomerNote[];

  // Get all customer scores for percentile calculation
  const { data: allCustomers } = await supabase
    .from("customers")
    .select("id")
    .eq("business_id", businessId);

  let allScores: number[] = [];
  if (allCustomers && allCustomers.length > 0) {
    const { data: allNotesData } = await supabase
      .from("customer_notes")
      .select("customer_id, severity, created_at")
      .eq("business_id", businessId);

    const notesByCustomerId: Record<string, NoteForScoring[]> = {};
    (allNotesData ?? []).forEach((n: { customer_id: string; severity: number; created_at: string }) => {
      if (!notesByCustomerId[n.customer_id]) notesByCustomerId[n.customer_id] = [];
      notesByCustomerId[n.customer_id].push({ severity: n.severity, created_at: n.created_at });
    });

    allScores = allCustomers.map((c) => {
      const custNotes = notesByCustomerId[c.id] || [];
      return calculateFullAnalytics(custNotes, [], "").score;
    });
  }

  // Calculate analytics
  const noteTypes = typedNotes.map((n) => n.note_type || "");
  const analytics = calculateFullAnalytics(typedNotes, noteTypes, customer.created_at);
  const percentile = calculatePercentile(analytics.score, allScores);

  // Format location
  const locationParts = [customer.city, customer.state].filter(Boolean);
  const location = locationParts.length > 0 ? locationParts.join(", ") : null;

  return (
    <div className="p-4 sm:p-8">
      {/* Back link */}
      <div className="mb-4">
        <Link href="/customers" className="text-sm text-text-muted hover:text-charcoal">
          ← Back to customers
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal sm:text-3xl">
            {customer.full_name || "Customer profile"}
          </h1>
          {location && (
            <p className="mt-1 text-text-muted">{location}{customer.county ? ` (${customer.county} County)` : ""}</p>
          )}
        </div>
        <div className="flex gap-2">
          <EditCustomerForm customer={customer} />
          <DeleteCustomerButton customerId={customer.id} customerName={customer.full_name} />
        </div>
      </div>

      {/* Score Card */}
      <div className="mb-6 rounded-lg bg-surface p-4 sm:p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Reliability */}
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Reliability History</p>
            <div className="mt-2 flex items-center gap-3">
              <span className={`rounded-full px-4 py-2 text-lg font-bold ${getScoreBadgeClasses(analytics.score)}`}>
                {getReliabilityIndicator(analytics.score)}
              </span>
              <div>
                <p className="text-xs text-text-muted">Top {100 - percentile}% of customers</p>
              </div>
            </div>
          </div>

          {/* Risk Level */}
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Risk Level</p>
            <div className="mt-2">
              <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getRiskBadgeClasses(analytics.riskLevel)}`}>
                {analytics.riskLevel} Risk
              </span>
            </div>
          </div>

          {/* Trend */}
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Trend</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-2xl ${getTrendClasses(analytics.trend)}`}>
                {getTrendIcon(analytics.trend)}
              </span>
              <span className={`font-medium ${getTrendClasses(analytics.trend)}`}>
                {analytics.trend}
              </span>
            </div>
          </div>

          {/* First Seen */}
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">First Seen</p>
            <p className="mt-2 font-medium">{analytics.firstSeenLabel}</p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mb-6 rounded-lg bg-surface p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-charcoal">Contact Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Phone</p>
            <p className="mt-1">{customer.phone || "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Email</p>
            <p className="mt-1">{customer.email || "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Location</p>
            <p className="mt-1">{location || "—"}</p>
          </div>
          {customer.county && (
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">County</p>
              <p className="mt-1">{customer.county}</p>
            </div>
          )}
        </div>
      </div>

      {/* Behavior Summary */}
      <div className="mb-6 rounded-lg bg-surface p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-charcoal">Behavior Summary</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-md bg-cream p-3">
            <p className="text-xs uppercase tracking-wide text-text-muted">Total Events</p>
            <p className="mt-1 text-2xl font-semibold">{analytics.totalEvents}</p>
          </div>
          <div className="rounded-md bg-green-900/30 p-3">
            <p className="text-xs uppercase tracking-wide text-green-400">Positive</p>
            <p className="mt-1 text-2xl font-semibold text-green-300">{analytics.positiveEvents}</p>
          </div>
          <div className="rounded-md bg-cream p-3">
            <p className="text-xs uppercase tracking-wide text-text-muted">Neutral</p>
            <p className="mt-1 text-2xl font-semibold">{analytics.neutralEvents}</p>
          </div>
          <div className="rounded-md bg-orange-900/30 p-3">
            <p className="text-xs uppercase tracking-wide text-orange-400">Negative</p>
            <p className="mt-1 text-2xl font-semibold text-orange-300">{analytics.negativeEvents}</p>
          </div>
          <div className="rounded-md bg-red-900/30 p-3">
            <p className="text-xs uppercase tracking-wide text-red-400">Severe</p>
            <p className="mt-1 text-2xl font-semibold text-red-300">{analytics.severeEvents}</p>
          </div>
        </div>

        {/* Recent negative activity */}
        {analytics.mostRecentNegativeTimeframe && (
          <div className="mt-4 rounded-md bg-yellow-900/20 p-3">
            <p className="text-sm text-yellow-200">
              Most recent negative event: <strong>{analytics.mostRecentNegativeTimeframe}</strong>
            </p>
          </div>
        )}

        {/* Behavior categories */}
        {analytics.behaviorCategories.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-text-muted">Behavior Patterns</p>
            <div className="flex flex-wrap gap-2">
              {analytics.behaviorCategories.map((cat) => (
                <span
                  key={cat}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    cat === "Positive history"
                      ? "bg-green-900/50 text-green-200"
                      : cat === "Payment issues" || cat === "No-shows"
                      ? "bg-red-900/50 text-red-200"
                      : "bg-surface text-text-secondary"
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Event History */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-charcoal">Event History</h2>

        {typedNotes.length === 0 ? (
          <p className="text-text-muted">No events logged yet.</p>
        ) : (
          <div className="space-y-3">
            {typedNotes.map((note) => (
              <div key={note.id} className="rounded-md bg-surface p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {note.note_type && (
                      <span className="rounded bg-cream px-2 py-1 text-xs font-medium">
                        {note.note_type}
                      </span>
                    )}
                    <span className={`rounded px-2 py-1 text-xs font-medium ${
                      note.severity >= 4
                        ? "bg-red-900/50 text-red-200"
                        : note.severity >= 3
                        ? "bg-orange-900/50 text-orange-200"
                        : "bg-green-900/50 text-green-200"
                    }`}>
                      Severity {note.severity}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
                {note.note_text && (
                  <p className="mt-2 text-sm text-text-secondary">{note.note_text}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Event Form */}
      <div className="rounded-lg bg-surface p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-charcoal">Log New Event</h2>
        <AddNoteForm
          customerId={customer.id}
          businessId={businessId}
          customerPhone={customer.phone}
          customerEmail={customer.email}
        />
      </div>
    </div>
  );
}
