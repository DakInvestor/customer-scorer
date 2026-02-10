import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PropertySyncClient from "./PropertySyncClient";

export default async function PropertySyncPage() {
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

  if (!profile?.is_admin) {
    redirect("/app");
  }

  // Get stats
  const { count: totalProperties } = await supabase
    .from("property_records")
    .select("*", { count: "exact", head: true });

  const { count: residentialProperties } = await supabase
    .from("property_records")
    .select("*", { count: "exact", head: true })
    .ilike("property_class", "%resid%");

  const { count: linkedProperties } = await supabase
    .from("property_customer_links")
    .select("*", { count: "exact", head: true });

  const { count: propertyEnrichedProfiles } = await supabase
    .from("customer_identifiers")
    .select("*", { count: "exact", head: true })
    .eq("source", "property_enrichment");

  // Get list of counties and municipalities
  const { data: counties } = await supabase
    .from("property_records")
    .select("county")
    .limit(100);

  const uniqueCounties = [...new Set((counties || []).map((c) => c.county).filter(Boolean))];

  const { data: municipalities } = await supabase
    .from("property_records")
    .select("municipality")
    .not("municipality", "is", null)
    .limit(500);

  const uniqueMunicipalities = [...new Set(
    (municipalities || []).map((m) => m.municipality).filter(Boolean)
  )].sort();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal md:text-3xl">Property Data Sync</h1>
        <p className="mt-1 text-text-secondary">
          Generate customer profiles from property records for address-based lookups.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Total Properties</p>
          <p className="mt-2 text-3xl font-bold text-charcoal">{totalProperties?.toLocaleString() || 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Residential</p>
          <p className="mt-2 text-3xl font-bold text-charcoal">{residentialProperties?.toLocaleString() || 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Linked to Profiles</p>
          <p className="mt-2 text-3xl font-bold text-charcoal">{linkedProperties?.toLocaleString() || 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Property Profiles</p>
          <p className="mt-2 text-3xl font-bold text-emerald">{propertyEnrichedProfiles?.toLocaleString() || 0}</p>
        </div>
      </div>

      <PropertySyncClient
        counties={uniqueCounties as string[]}
        municipalities={uniqueMunicipalities as string[]}
      />
    </div>
  );
}
