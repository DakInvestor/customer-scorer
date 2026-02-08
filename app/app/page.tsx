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
  if (score >= 60) return "bg-amber text-white";
  if (score >= 40) return "bg-amber/80 text-white";
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
        <h1 className="text-2xl font-bold text-charcoal md:text-3xl">
          {business?.name || "Dashboard"}
        </h1>
        <p className="mt-1 text-text-secondary">
          Track customer reliability and protect your business.
        </p>
      </div>

      {/* Top Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Total customers</p>
          <p className="mt-2 text-3xl font-bold text-charcoal">{totalCustomers}</p>
          <p className="mt-1 text-sm text-text-secondary">+{customersThisWeek} this week</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Avg. Reliability</p>
          <div className="mt-2 flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xl font-bold ${getScoreBadgeClasses(avgScore)}`}>
              {avgScore >= 80 ? "Good" : avgScore >= 60 ? "Fair" : avgScore >= 40 ? "Some concerns" : "Multiple concerns"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Events this week</p>
          <p className="mt-2 text-3xl font-bold text-charcoal">{eventsThisWeek}</p>
          <p className="mt-1 text-sm text-text-secondary">{typedNotes.length} total</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">High-risk customers</p>
          <p className="mt-2 text-3xl font-bold text-charcoal">{scoreDistribution.risk}</p>
          <p className="mt-1 text-sm text-text-secondary">Need attention</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Score Distribution */}
        <div className="rounded-xl border border-border bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-charcoal">Reliability overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald"></span>
                <span className="text-sm text-text-secondary">Excellent (90-100)</span>
              </div>
              <span className="font-semibold text-charcoal">{scoreDistribution.excellent}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald/70"></span>
                <span className="text-sm text-text-secondary">Good (75-89)</span>
              </div>
              <span className="font-semibold text-charcoal">{scoreDistribution.good}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber"></span>
                <span className="text-sm text-text-secondary">Monitor (60-74)</span>
              </div>
              <span className="font-semibold text-charcoal">{scoreDistribution.monitor}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-critical"></span>
                <span className="text-sm text-text-secondary">At risk ({'<'}60)</span>
              </div>
              <span className="font-semibold text-charcoal">{scoreDistribution.risk}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-charcoal">Recent activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-text-secondary">No events logged yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((event) => (
                <div key={event.id} className="flex items-start justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{event.customer_name}</p>
                    <p className="text-xs text-text-secondary">{event.note_type || "Event logged"}</p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                      event.severity >= 4 ? "bg-critical-light text-critical" :
                      event.severity >= 3 ? "bg-amber-light text-amber" :
                      "bg-emerald-light text-emerald"
                    }`}>
                      Severity {event.severity}
                    </span>
                    <p className="mt-1 text-xs text-text-secondary">
                      {new Date(event.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High Risk Customers */}
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-charcoal">High-risk customers</h2>
            <Link href="/app/analytics" className="text-xs text-copper hover:text-copper-dark">
              View all →
            </Link>
          </div>
          {highRiskCustomers.length === 0 ? (
            <p className="text-sm text-text-secondary">No high-risk customers. Great job!</p>
          ) : (
            <div className="space-y-2">
              {highRiskCustomers.map((customer) => (
                <Link
                  key={customer.id}
                  href={`/app/customers/${customer.id}`}
                  className="flex items-center justify-between rounded-lg bg-cream px-3 py-2 hover:bg-surface"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal">{customer.full_name || "Unnamed"}</p>
                    <p className="text-xs text-text-secondary">{customer.phone || "No phone"}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getScoreBadgeClasses(customer.score)}`}>
                    {customer.score >= 80 ? "Good" : customer.score >= 60 ? "Fair" : customer.score >= 40 ? "Some concerns" : "Multiple concerns"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-charcoal">Quick actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/app/add-customer"
              className="flex items-center justify-center rounded-lg bg-copper px-4 py-3 text-sm font-medium text-white hover:bg-copper-dark"
            >
              + Add customer
            </Link>
            <Link
              href="/app/search"
              className="flex items-center justify-center rounded-lg bg-surface px-4 py-3 text-sm font-medium text-charcoal hover:bg-border"
            >
              Search customers
            </Link>
            <Link
              href="/app/customers"
              className="flex items-center justify-center rounded-lg bg-surface px-4 py-3 text-sm font-medium text-charcoal hover:bg-border"
            >
              View all customers
            </Link>
            <Link
              href="/app/analytics"
              className="flex items-center justify-center rounded-lg bg-surface px-4 py-3 text-sm font-medium text-charcoal hover:bg-border"
            >
              View analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {totalCustomers === 0 && (
        <div className="mt-8 rounded-xl border border-border bg-white p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold text-charcoal">Get started</h2>
          <p className="mb-6 text-text-secondary">
            Add your first customer to start tracking reliability history.
          </p>
          <Link
            href="/app/add-customer"
            className="inline-block rounded-lg bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark"
          >
            Add your first customer
          </Link>
        </div>
      )}
    </div>
  );
}
