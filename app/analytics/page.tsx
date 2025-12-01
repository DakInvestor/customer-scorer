// app/analytics/page.tsx
import { createSupabaseServerClient, getCurrentBusinessId } from "@/lib/supabase/server";
import { calculateCustomerScore, getScoreLabel } from "@/lib/scoring";
import type { NoteForScoring } from "@/lib/scoring";
import { redirect } from "next/navigation";

type Customer = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
};

type NoteRow = NoteForScoring & {
  customer_id: string;
};

type CustomerWithScore = Customer & {
  score: number;
};

function getScoreBadgeClasses(score: number) {
  if (score >= 90) return "bg-green-600 text-white";
  if (score >= 75) return "bg-lime-600 text-white";
  if (score >= 60) return "bg-yellow-500 text-gray-900";
  if (score >= 40) return "bg-orange-500 text-white";
  return "bg-red-600 text-white";
}

export default async function AnalyticsPage() {
  const businessId = await getCurrentBusinessId();

  if (!businessId) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  // Load all customers (filtered by business_id)
  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading customers for analytics", error);
    return (
      <div className="p-8">
        <h1 className="mb-4 text-3xl font-bold">Analytics</h1>
        <p className="text-sm text-red-400">
          Failed to load analytics. Check the server logs.
        </p>
      </div>
    );
  }

  const typedCustomers = (customers ?? []) as Customer[];
  const totalCustomers = typedCustomers.length;

  if (totalCustomers === 0) {
    return (
      <div className="p-8">
        <h1 className="mb-4 text-3xl font-bold">Analytics</h1>
        <p className="text-sm text-gray-300">
          No customers yet. Add some customers to see analytics.
        </p>
      </div>
    );
  }

  const customerIds = typedCustomers.map((c) => c.id);

  const { data: notesData, error: notesError } = await supabase
    .from("customer_notes")
    .select("customer_id, severity, created_at")
    .eq("business_id", businessId)
    .in("customer_id", customerIds);

  if (notesError) {
    console.error("Error loading notes for analytics", notesError);
  }

  const typedNotes = (notesData ?? []) as NoteRow[];

  // Group notes by customer
  const notesByCustomer: Record<string, NoteForScoring[]> = {};
  for (const note of typedNotes) {
    if (!notesByCustomer[note.customer_id]) {
      notesByCustomer[note.customer_id] = [];
    }
    notesByCustomer[note.customer_id].push({
      severity: note.severity,
      created_at: note.created_at,
    });
  }

  // Attach scores
  const customersWithScore: CustomerWithScore[] = typedCustomers.map((customer) => {
    const notesForCustomer = notesByCustomer[customer.id] ?? [];
    const score = calculateCustomerScore(notesForCustomer);
    return { ...customer, score };
  });

  // Metrics
  const avgScoreRaw =
    customersWithScore.reduce((sum, c) => sum + c.score, 0) / customersWithScore.length;
  const avgScore = Math.round(avgScoreRaw);

  const now = new Date();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const newInLast30 = customersWithScore.filter((c) => {
    const created = new Date(c.created_at);
    return now.getTime() - created.getTime() <= THIRTY_DAYS;
  }).length;

  let excellent = 0;
  let good = 0;
  let monitor = 0;
  let risky = 0;
  let severe = 0;

  for (const c of customersWithScore) {
    if (c.score >= 90) excellent++;
    else if (c.score >= 75) good++;
    else if (c.score >= 60) monitor++;
    else if (c.score >= 40) risky++;
    else severe++;
  }

  const lowestScored = [...customersWithScore]
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-bold">Analytics</h1>

      {/* Top metrics */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-gray-700 p-5">
          <p className="text-xs uppercase tracking-wide text-gray-300">
            Total customers
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-100">
            {totalCustomers}
          </p>
        </div>

        <div className="rounded-lg bg-gray-700 p-5">
          <p className="text-xs uppercase tracking-wide text-gray-300">
            Avg reliability score
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-lg font-semibold ${getScoreBadgeClasses(avgScore)}`}
            >
              {avgScore}
            </span>
            <span className="text-sm text-gray-300">{getScoreLabel(avgScore)}</span>
          </div>
        </div>

        <div className="rounded-lg bg-gray-700 p-5">
          <p className="text-xs uppercase tracking-wide text-gray-300">
            New in last 30 days
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-100">{newInLast30}</p>
        </div>

        <div className="rounded-lg bg-gray-700 p-5">
          <p className="text-xs uppercase tracking-wide text-gray-300">
            High-risk (score &lt; 60)
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-100">{risky + severe}</p>
        </div>
      </div>

      {/* Score distribution */}
      <div className="mb-8 rounded-lg bg-gray-700 p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-100">Score distribution</h2>
        <div className="grid gap-4 text-sm sm:grid-cols-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-300">Excellent (90–100)</p>
            <p className="mt-1 text-2xl font-semibold text-gray-100">{excellent}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-300">Good (75–89)</p>
            <p className="mt-1 text-2xl font-semibold text-gray-100">{good}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-300">Monitor (60–74)</p>
            <p className="mt-1 text-2xl font-semibold text-gray-100">{monitor}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-300">Risky (40–59)</p>
            <p className="mt-1 text-2xl font-semibold text-gray-100">{risky}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-300">Severe (&lt; 40)</p>
            <p className="mt-1 text-2xl font-semibold text-gray-100">{severe}</p>
          </div>
        </div>
      </div>

      {/* Highest risk customers */}
      <div className="rounded-lg bg-gray-700 p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-100">Highest risk customers</h2>
        <div className="overflow-hidden rounded-md bg-gray-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-900 text-xs uppercase text-gray-300">
              <tr>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
              </tr>
            </thead>
            <tbody>
              {lowestScored.map((customer) => (
                <tr key={customer.id} className="border-t border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getScoreBadgeClasses(customer.score)}`}
                    >
                      {customer.score}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">
                      {getScoreLabel(customer.score)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-100">{customer.full_name || "—"}</td>
                  <td className="px-4 py-3 text-gray-100">{customer.phone || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}