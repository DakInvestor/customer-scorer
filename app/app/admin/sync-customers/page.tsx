import { redirect } from "next/navigation";
import { createSupabaseServerClient, createSupabaseAdminClient, getCurrentUser } from "@/lib/supabase/server";
import SyncButton from "./SyncButton";

export default async function SyncCustomersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_admin) {
    redirect("/app");
  }

  // Get counts
  const adminClient = createSupabaseAdminClient();

  const { count: customerCount } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true });

  const { count: networkCount } = await adminClient
    .from("customer_identifiers")
    .select("*", { count: "exact", head: true });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal md:text-3xl">Sync Customers to Network</h1>
        <p className="mt-1 text-text-secondary">
          One-time sync of all existing customers to the network database.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Total Customers</p>
          <p className="mt-2 text-3xl font-bold text-charcoal">{customerCount || 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Network Identifiers</p>
          <p className="mt-2 text-3xl font-bold text-charcoal">{networkCount || 0}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-charcoal">Sync All Customers</h2>
        <p className="mb-4 text-text-secondary">
          This will sync all customers with phone numbers or emails to the network database.
          Only anonymized data (phone hash, last 4 digits, email domain) will be stored.
        </p>
        <SyncButton />
      </div>
    </div>
  );
}
