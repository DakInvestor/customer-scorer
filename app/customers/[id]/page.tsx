// app/customers/[id]/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient, getCurrentBusinessId } from "@/lib/supabase/server";
import AddNoteForm from "./AddNoteForm";
import { calculateCustomerScore, getScoreLabel } from "@/lib/scoring";
import type { NoteForScoring } from "@/lib/scoring";

type PageProps = {
  params: Promise<{ id: string }>;
};

type Customer = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
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
  if (score >= 90) return "bg-green-600 text-white";
  if (score >= 75) return "bg-lime-600 text-white";
  if (score >= 60) return "bg-yellow-500 text-gray-900";
  if (score >= 40) return "bg-orange-500 text-white";
  return "bg-red-600 text-white";
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const businessId = await getCurrentBusinessId();

  if (!businessId) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  // Load the customer (scoped to this business)
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .eq("business_id", businessId)
    .single<Customer>();

  if (customerError || !customer) {
    console.error("Error loading customer", customerError);
    return notFound();
  }

  // Load notes for this customer (only this business)
  const { data: notes, error: notesError } = await supabase
    .from("customer_notes")
    .select("*")
    .eq("customer_id", id)
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (notesError) {
    console.error("Error loading customer notes", notesError);
  }

  const typedNotes = (notes ?? []) as CustomerNote[];

  const createdAt = customer.created_at
    ? new Date(customer.created_at).toLocaleString()
    : "";

  // Global reliability score
  const score = calculateCustomerScore(typedNotes);
  const scoreLabel = getScoreLabel(score);
  const scoreClasses = getScoreBadgeClasses(score);

  const totalEvents = typedNotes.length;

  const negativeEvents = typedNotes.filter(
    (n) => typeof n.severity === "number" && n.severity >= 3
  ).length;

  const severeEvents = typedNotes.filter(
    (n) => typeof n.severity === "number" && n.severity >= 4
  ).length;

  const positiveEvents = typedNotes.filter(
    (n) => typeof n.severity === "number" && n.severity <= 2
  ).length;

  const mostRecentNegative = typedNotes.find(
    (n) => typeof n.severity === "number" && n.severity >= 3
  );
  const mostRecentNegativeDate =
    mostRecentNegative && mostRecentNegative.created_at
      ? new Date(mostRecentNegative.created_at).toLocaleString()
      : null;

  return (
    <div className="p-8">
      {/* Back link */}
      <div className="mb-4">
        <Link
          href="/customers"
          className="text-sm text-gray-300 underline-offset-2 hover:underline"
        >
          ← Back to customers
        </Link>
      </div>

      <h1 className="mb-4 text-3xl font-bold">
        {customer.full_name || "Customer profile"}
      </h1>

      {/* Identity + Global score card */}
      <div className="mb-6 rounded-lg bg-gray-700 p-6 text-sm text-gray-100">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-1">
              <span className="font-semibold">Email:</span>{" "}
              {customer.email || "—"}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Phone:</span>{" "}
              {customer.phone || "—"}
            </p>
            <p className="mt-2 text-xs text-gray-300">
              Profile created: {createdAt || "—"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-gray-300">
              Reliability Score
            </p>
            <div className="mt-1 inline-flex items-center justify-end gap-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${scoreClasses}`}
              >
                {score}
              </span>
              <span className="text-xs text-gray-300">{scoreLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Behavior summary */}
      <div className="mb-8 rounded-lg bg-gray-700 p-6 text-sm text-gray-100">
        <h2 className="mb-3 text-lg font-semibold">Behavior summary</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-300">
              Total events
            </p>
            <p className="mt-1 text-2xl font-semibold text-gray-100">
              {totalEvents}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-300">
              Negative events (severity ≥ 3)
            </p>
            <p className="mt-1 text-2xl font-semibold text-gray-100">
              {negativeEvents}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-300">
              Severe events (severity ≥ 4)
            </p>
            <p className="mt-1 text-2xl font-semibold text-gray-100">
              {severeEvents}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-300">
              Positive events
            </p>
            <p className="mt-1 text-2xl font-semibold text-gray-100">
              {positiveEvents}
            </p>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-300">
          <p>
            Most recent negative event:{" "}
            {mostRecentNegativeDate ?? "No negative events recorded"}
          </p>
        </div>
      </div>

      {/* Event history */}
      <div className="mb-8">
        <h2 className="mb-1 text-2xl font-semibold">Event history</h2>
        <p className="mb-4 text-sm text-gray-300">
          Events and notes logged for this customer.
        </p>

        {typedNotes.length === 0 ? (
          <p className="mb-4 text-sm text-gray-300">
            No events logged for this customer yet.
          </p>
        ) : (
          <div className="mb-4 space-y-3">
            {typedNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-md bg-gray-800 p-4 text-sm text-gray-100"
              >
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {note.note_type && (
                      <span className="rounded bg-gray-600 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
                        {note.note_type}
                      </span>
                    )}
                    {typeof note.severity === "number" && (
                      <span className="rounded bg-gray-500 px-2 py-0.5 text-xs font-semibold">
                        Severity {note.severity}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-300">
                    {note.created_at
                      ? new Date(note.created_at).toLocaleString()
                      : ""}
                  </span>
                </div>
                {note.note_text && (
                  <p className="mt-1 text-sm text-gray-100">{note.note_text}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add event form */}
        <div className="mt-6 rounded-lg bg-gray-700 p-6">
          <h3 className="mb-3 text-lg font-semibold">Log a new event</h3>
          <AddNoteForm customerId={customer.id} businessId={businessId} />
        </div>
      </div>
    </div>
  );
}