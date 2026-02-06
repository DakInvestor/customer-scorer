import { createSupabaseServerClient, getCurrentBusinessId } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { calculateCustomerScore, getScoreLabel } from "@/lib/scoring";
import type { NoteForScoring } from "@/lib/scoring";

type Customer = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
};

type NoteRow = NoteForScoring & {
  id: string;
  customer_id: string;
  note_type: string | null;
  created_at: string;
};

type CustomerWithScore = Customer & {
  score: number;
};

function getScoreBadgeClasses(score: number) {
  if (score >= 90) return "bg-emerald text-white";
  if (score >= 75) return "bg-emerald/80 text-white";
  if (score >= 60) return "bg-amber text-deep-navy";
  if (score >= 40) return "bg-amber/80 text-deep-navy";
  return "bg-critical text-white";
}

export default async function Dashboard() {
  const businessId = await getCurrentBusinessId();

  if (!businessId) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("name")
    .eq("id", businessId)
    .single();

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  const typedCustomers = (customers ?? []) as Customer[];
  const totalCustomers = typedCustomers.length;

  const customerIds = typedCustomers.map((c) => c.id);
  let typedNotes: NoteRow[] = [];

  if (customerIds.length > 0) {
    const { data: notesData } = await supabase
      .from("customer_notes")
      .select("*")
      .eq("business_id", businessId)
      .in("customer_id", customerIds)
      .order("created_at", { ascending: false });

    typedNotes = (notesData ?? []) as NoteRow[];
  }

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

  const customersWithScore: CustomerWithScore[] = typedCustomers.map((customer) => {
    const notesForCustomer = notesByCustomer[customer.id] ?? [];
    const score = calculateCustomerScore(notesForCustomer);
    return { ...customer, score };
  });

  const avgScore = totalCustomers > 0
    ? Math.round(customersWithScore.reduce((sum, c) => sum + c.score, 0) / totalCustomers)
    : 100;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const eventsThisWeek = typedNotes.filter(
    (n) => new Date(n.created_at) >= oneWeekAgo
  ).length;

  const highRiskCustomers = customersWithScore
    .filter((c) => c.score < 60)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  const recentActivity = typedNotes.slice(0, 5).map((note) => {
    const customer = typedCustomers.find((c) => c.id === note.customer_id);
    return {
      ...note,
      customer_name: customer?.full_name || "Unknown",
    };
  });

  const customersThisWeek = typedCustomers.filter(
    (c) => new Date(c.created_at) >= oneWeekAgo
  ).length;

  const scoreDistribution = {
    excellent: customersWithScore.filter((c) => c.score >= 90).length,
    good: customersWithScore.filter((c) => c.score >= 75 && c.score < 90).length,
    monitor: customersWithScore.filter((c) => c.score >= 60 && c.score < 75).length,
    risk: customersWithScore.filter((c) => c.score < 60).length,
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          {business?.name || "Dashboard"}
        </h1>
        <p className="mt-1 text-slate-gray">
          Track customer reliability and protect your business.
        </p>
      </div>

      {/* Top Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-gray">Total customers</p>
          <p className="mt-2 text-3xl font-bold text-white">{totalCustomers}</p>
          <p className="mt-1 text-sm text-slate-gray">+{customersThisWeek} this week</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-gray">Avg reliability score</p>
          <div className="mt-2 flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xl font-bold ${getScoreBadgeClasses(avgScore)}`}>
              {avgScore}
            </span>
            <span className="text-sm text-slate-gray">{getScoreLabel(avgScore)}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-gray">Events this week</p>
          <p className="mt-2 text-3xl font-bold text-white">{eventsThisWeek}</p>
          <p className="mt-1 text-sm text-slate-gray">{typedNotes.length} total</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-gray">High-risk customers</p>
          <p className="mt-2 text-3xl font-bold text-white">{scoreDistribution.risk}</p>
          <p className="mt-1 text-sm text-slate-gray">Score below 60</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Score Distribution */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white">Score distribution</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald"></span>
                <span className="text-sm text-cool-gray">Excellent (90-100)</span>
              </div>
              <span className="font-semibold text-white">{scoreDistribution.excellent}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald/70"></span>
                <span className="text-sm text-cool-gray">Good (75-89)</span>
              </div>
              <span className="font-semibold text-white">{scoreDistribution.good}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber"></span>
                <span className="text-sm text-cool-gray">Monitor (60-74)</span>
              </div>
              <span className="font-semibold text-white">{scoreDistribution.monitor}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-critical"></span>
                <span className="text-sm text-cool-gray">At risk ({'<'}60)</span>
              </div>
              <span className="font-semibold text-white">{scoreDistribution.risk}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white">Recent activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-gray">No events logged yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((event) => (
                <div key={event.id} className="flex items-start justify-between border-b border-slate-800 pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{event.customer_name}</p>
                    <p className="text-xs text-slate-gray">{event.note_type || "Event logged"}</p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                      event.severity >= 4 ? "bg-critical/20 text-critical" :
                      event.severity >= 3 ? "bg-amber/20 text-amber" :
                      "bg-emerald/20 text-emerald"
                    }`}>
                      Severity {event.severity}
                    </span>
                    <p className="mt-1 text-xs text-slate-gray">
                      {new Date(event.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High Risk Customers */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">High-risk customers</h2>
            <Link href="/analytics" className="text-xs text-forsure-blue hover:text-forsure-blue/80">
              View all →
            </Link>
          </div>
          {highRiskCustomers.length === 0 ? (
            <p className="text-sm text-slate-gray">No high-risk customers. Great job!</p>
          ) : (
            <div className="space-y-2">
              {highRiskCustomers.map((customer) => (
                <Link
                  key={customer.id}
                  href={`/customers/${customer.id}`}
                  className="flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-2 hover:bg-slate-800"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{customer.full_name || "Unnamed"}</p>
                    <p className="text-xs text-slate-gray">{customer.phone || "No phone"}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getScoreBadgeClasses(customer.score)}`}>
                    {customer.score}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white">Quick actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/add-customer"
              className="flex items-center justify-center rounded-lg bg-forsure-blue px-4 py-3 text-sm font-medium text-white hover:bg-forsure-blue/90"
            >
              + Add customer
            </Link>
            <Link
              href="/search"
              className="flex items-center justify-center rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700"
            >
              Search customers
            </Link>
            <Link
              href="/customers"
              className="flex items-center justify-center rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700"
            >
              View all customers
            </Link>
            <Link
              href="/analytics"
              className="flex items-center justify-center rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700"
            >
              View analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {totalCustomers === 0 && (
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold text-white">Get started</h2>
          <p className="mb-6 text-slate-gray">
            Add your first customer to start tracking reliability scores.
          </p>
          <Link
            href="/add-customer"
            className="inline-block rounded-lg bg-forsure-blue px-6 py-3 font-semibold text-white hover:bg-forsure-blue/90"
          >
            Add your first customer
          </Link>
        </div>
      )}
    </div>
  );
}