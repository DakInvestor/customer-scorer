// app/page.tsx
import { createSupabaseServerClient, getCurrentBusinessId } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Dashboard() {
  const businessId = await getCurrentBusinessId();

  if (!businessId) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  // Get business name
  const { data: business } = await supabase
    .from("businesses")
    .select("name")
    .eq("id", businessId)
    .single();

  // Get customer count
  const { count: customerCount } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId);

  // Get events this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { count: eventsThisWeek } = await supabase
    .from("customer_notes")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .gte("created_at", oneWeekAgo.toISOString());

  return (
    <div className="p-8">
      <h1 className="mb-2 text-3xl font-bold">
        Welcome{business?.name ? `, ${business.name}` : ""}
      </h1>
      <p className="mb-8 text-gray-400">
        Track customer reliability and protect your business.
      </p>

      {/* Quick stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-gray-800 p-5">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Total customers
          </p>
          <p className="mt-2 text-3xl font-semibold">{customerCount ?? 0}</p>
        </div>
        <div className="rounded-lg bg-gray-800 p-5">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Events logged this week
          </p>
          <p className="mt-2 text-3xl font-semibold">{eventsThisWeek ?? 0}</p>
        </div>
        <div className="rounded-lg bg-gray-800 p-5">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Quick actions
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/add-customer"
              className="rounded bg-gray-700 px-3 py-1.5 text-sm hover:bg-gray-600"
            >
              + Add customer
            </Link>
            <Link
              href="/search"
              className="rounded bg-gray-700 px-3 py-1.5 text-sm hover:bg-gray-600"
            >
              Search
            </Link>
          </div>
        </div>
      </div>

      {/* Getting started */}
      {(customerCount ?? 0) === 0 && (
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
          <h2 className="mb-2 text-lg font-semibold">Getting started</h2>
          <p className="mb-4 text-sm text-gray-400">
            Start by adding your first customer, then log events to track their reliability.
          </p>
          <Link
            href="/add-customer"
            className="inline-block rounded bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
          >
            Add your first customer
          </Link>
        </div>
      )}
    </div>
  );
}