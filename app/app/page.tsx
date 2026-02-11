import { createSupabaseServerClient, getCurrentBusinessId } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { calculateCustomerScore } from "@/lib/scoring";
import type { NoteForScoring } from "@/lib/scoring";
import Onboarding from "@/components/Onboarding";
import DashboardChecklist from "@/components/DashboardChecklist";
import { syncBusinessCustomers } from "./network/sync-business";
import {
  INDUSTRY_TOOLS,
  UNIVERSAL_TOOLS,
  TOOL_METADATA,
  getIndustryLabel,
  getIndustryIcon,
  type BusinessIndustry
} from "@/lib/industry-types";

type Business = {
  id: string;
  name: string | null;
  onboarding_completed: boolean | null;
  onboarding_step: number | null;
  has_searched_network: boolean | null;
  has_imported: boolean | null;
  checklist_dismissed: boolean | null;
  network_synced: boolean | null;
  industry: string | null;
  secondary_industries: string[] | null;
};

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
    .select("id, name, onboarding_completed, onboarding_step, has_searched_network, has_imported, checklist_dismissed, network_synced, industry, secondary_industries")
    .eq("id", businessId)
    .single();

  const typedBusiness = business as Business | null;

  // Auto-sync customers to network if not done yet (runs in background)
  if (typedBusiness && !typedBusiness.network_synced) {
    syncBusinessCustomers(businessId).catch(console.error);
  }

  // Check if onboarding is needed
  const needsOnboarding = !typedBusiness?.onboarding_completed;
  const showChecklist = typedBusiness?.onboarding_completed && !typedBusiness?.checklist_dismissed;

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

  // Show onboarding overlay if not completed
  if (needsOnboarding) {
    return (
      <>
        <Onboarding
          businessId={businessId}
          initialStep={typedBusiness?.onboarding_step || 1}
        />
        <div className="p-6 md:p-8 opacity-50 pointer-events-none">
          <DashboardContent
            businessName={typedBusiness?.name}
            industry={typedBusiness?.industry || "other"}
            secondaryIndustries={typedBusiness?.secondary_industries || []}
            totalCustomers={totalCustomers}
            customersThisWeek={customersThisWeek}
            avgScore={avgScore}
            eventsThisWeek={eventsThisWeek}
            totalEvents={typedNotes.length}
            scoreDistribution={scoreDistribution}
            recentActivity={recentActivity}
            highRiskCustomers={highRiskCustomers}
          />
        </div>
      </>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Checklist */}
      {showChecklist && (
        <DashboardChecklist
          businessId={businessId}
          customerCount={totalCustomers}
          eventCount={typedNotes.length}
          hasSearchedNetwork={typedBusiness?.has_searched_network || false}
        />
      )}

      <DashboardContent
        businessName={typedBusiness?.name}
        industry={typedBusiness?.industry || "other"}
        secondaryIndustries={typedBusiness?.secondary_industries || []}
        totalCustomers={totalCustomers}
        customersThisWeek={customersThisWeek}
        avgScore={avgScore}
        eventsThisWeek={eventsThisWeek}
        totalEvents={typedNotes.length}
        scoreDistribution={scoreDistribution}
        recentActivity={recentActivity}
        highRiskCustomers={highRiskCustomers}
      />
    </div>
  );
}

// Map tool IDs to their routes
function getToolRoute(toolId: string): string {
  const routes: Record<string, string> = {
    // Universal
    enhanced_search: '/app/search',
    property_profile: '/app/search?tab=properties',
    new_homeowner_feed: '/app/leads',
    competitor_intelligence: '/app/leads?filter=permits',

    // Sales/Leads feeds
    live_sales_feed: '/app/leads',
    sales_feed_pipeline: '/app/leads',

    // HVAC/Plumbing/Electrical
    aging_systems_finder: '/app/leads?filter=aging',
    warranty_expiration_leads: '/app/leads?filter=aging',
    water_heater_leads: '/app/leads?filter=aging',
    panel_upgrade_prospects: '/app/leads?filter=aging',
    multi_zone_home_finder: '/app/leads?filter=large-homes',
    seasonal_prep_lists: '/app/leads',
    neighborhood_blitz_planner: '/app/leads?filter=permits',
    flip_alert: '/app/leads?filter=flips',
    sewer_line_prospects: '/app/leads?filter=aging',
    solar_prewire_leads: '/app/leads?filter=permits',

    // Roofing
    reroof_calculator: '/app/leads?filter=aging',
    storm_damage_prospecting: '/app/leads',
    insurance_claim_helper: '/app/search?tab=properties',
    post_storm_priority: '/app/leads',

    // Contractor/Remodeler
    renovation_candidates: '/app/leads?filter=renovation',
    permit_cost_benchmarking: '/app/leads?filter=permits',
    flip_tracker: '/app/leads?filter=flips',
    pre_bid_property_brief: '/app/search?tab=properties',

    // Realtor
    comparable_sales: '/app/leads?filter=sales',
    pre_listing_report: '/app/search?tab=properties',
    off_market_finder: '/app/leads?filter=off-market',
    rental_property_identifier: '/app/leads?filter=rentals',
    new_construction_tracker: '/app/leads?filter=permits',
    neighborhood_report_card: '/app/leads',
    divorce_estate_detector: '/app/leads?filter=distressed',

    // Home Inspector
    pre_inspection_brief: '/app/search?tab=properties',
    reinspection_opportunities: '/app/leads',
    repeat_investor_tracker: '/app/leads?filter=flips',
    inspection_red_flag_brief: '/app/search?tab=properties',

    // Insurance
    risk_profiling: '/app/search?tab=properties',
    policy_review_triggers: '/app/leads',
    property_value_monitor: '/app/leads',

    // Property Manager
    portfolio_dashboard: '/app/leads',
    maintenance_scheduling: '/app/leads?filter=aging',
    tenant_screening_supplement: '/app/search?tab=properties',
    tax_appeal_alerts: '/app/leads',
    contractor_performance_tracker: '/app/leads?filter=permits',

    // Landscaper
    lot_size_leads: '/app/leads?filter=large-lots',
    new_homeowner_targeting: '/app/leads',
    high_value_property_finder: '/app/leads?filter=high-value',
    seasonal_push_lists: '/app/leads',

    // Pest Control
    property_age_targeting: '/app/leads?filter=aging',
    new_homeowner_alerts: '/app/leads',
    multi_unit_property_finder: '/app/leads?filter=multi-unit',

    // Solar
    ideal_candidate_scoring: '/app/leads?filter=solar',
    panel_upgrade_crosssell: '/app/leads?filter=permits',
    new_construction_solar: '/app/leads?filter=permits',

    // Painter
    exterior_paint_leads: '/app/leads?filter=aging',
    new_homeowner_make_it_mine: '/app/leads',
    renovation_companion_leads: '/app/leads?filter=permits',

    // Cleaning
    sq_footage_leads: '/app/leads?filter=large-homes',
    new_homeowner_move_in: '/app/leads',
    high_value_home_finder: '/app/leads?filter=high-value',

    // Pool
    pool_property_identifier: '/app/leads?filter=pools',
    pool_age_estimator: '/app/leads?filter=aging',
    seasonal_opening_closing: '/app/leads',

    // Garage/Fencing
    age_based_targeting: '/app/leads?filter=aging',
    new_construction_missing: '/app/leads?filter=permits',
    neighborhood_matching: '/app/leads',

    // Window/Door
    energy_efficiency_prospects: '/app/leads?filter=aging',
    renovation_companion: '/app/leads?filter=permits',

    // Moving
    move_size_estimator: '/app/leads',

    // Attorney
    lien_judgment_monitor: '/app/leads?filter=court',
    property_ownership_history: '/app/search?tab=properties',
    permit_violation_finder: '/app/leads?filter=permits',
    contractor_dispute_tracker: '/app/leads?filter=court',

    // Financial
    equity_estimator: '/app/search?tab=properties',
    refinance_candidates: '/app/leads',
    new_homeowner_followup: '/app/leads',
    investment_property_identifier: '/app/leads?filter=rentals',
  };
  return routes[toolId] || '/app/leads';
}

function DashboardContent({
  businessName,
  industry,
  secondaryIndustries,
  totalCustomers,
  customersThisWeek,
  avgScore,
  eventsThisWeek,
  totalEvents,
  scoreDistribution,
  recentActivity,
  highRiskCustomers,
}: {
  businessName: string | null | undefined;
  industry: string;
  secondaryIndustries: string[];
  totalCustomers: number;
  customersThisWeek: number;
  avgScore: number;
  eventsThisWeek: number;
  totalEvents: number;
  scoreDistribution: { excellent: number; good: number; monitor: number; risk: number };
  recentActivity: Array<{ id: string; customer_name: string; note_type: string | null; severity: number; created_at: string }>;
  highRiskCustomers: CustomerWithScore[];
}) {
  // Get tools for this industry
  const industryTools = INDUSTRY_TOOLS[industry as BusinessIndustry] || [];

  // Combine with universal tools and dedupe
  const allToolIds = [...new Set([...UNIVERSAL_TOOLS, ...industryTools])];

  // Get tool metadata
  const tools = allToolIds
    .map(id => ({ id, ...TOOL_METADATA[id] }))
    .filter(t => t.label); // Only include tools with metadata
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal md:text-3xl">
          {businessName || "Dashboard"}
        </h1>
        <p className="mt-1 text-text-secondary">
          Track customer reliability and protect your business.
        </p>
      </div>

      {/* Industry Tools Section */}
      {industry !== "other" && (
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">{getIndustryIcon(industry)}</span>
            <h2 className="text-lg font-semibold text-charcoal">
              {getIndustryLabel(industry)} Tools
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.slice(0, 8).map((tool) => (
              <Link
                key={tool.id}
                href={getToolRoute(tool.id)}
                className="group rounded-xl border border-border bg-white p-4 transition-all hover:border-copper hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tool.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-charcoal group-hover:text-copper truncate">
                      {tool.label}
                    </h3>
                    <p className="mt-1 text-xs text-text-muted line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {tools.length > 8 && (
            <div className="mt-3 text-center">
              <button className="text-sm text-copper hover:text-copper-dark">
                Show {tools.length - 8} more tools
              </button>
            </div>
          )}
        </div>
      )}

      {/* No Industry Selected Banner */}
      {industry === "other" && (
        <div className="mb-8 rounded-xl border-2 border-dashed border-copper/30 bg-copper/5 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-copper/20 p-3">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-charcoal">
                Industry not configured
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Your industry wasn&apos;t set during signup. Contact support to configure your industry and unlock specialized tools.
              </p>
            </div>
          </div>
        </div>
      )}

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
          <p className="mt-1 text-sm text-text-secondary">{totalEvents} total</p>
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
    </>
  );
}
