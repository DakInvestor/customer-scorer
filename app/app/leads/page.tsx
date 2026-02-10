import { createSupabaseServerClient, getCurrentBusinessId } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NewHomeownerFeed from "./NewHomeownerFeed";

export default async function LeadsPage() {
  const businessId = await getCurrentBusinessId();

  if (!businessId) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  // Get business service area settings (if exists)
  const { data: business } = await supabase
    .from("businesses")
    .select("service_municipalities, service_zip_codes")
    .eq("id", businessId)
    .single();

  // Get list of available municipalities from property_sales
  const { data: municipalities } = await supabase
    .from("property_sales")
    .select("municipality")
    .not("municipality", "is", null)
    .limit(1000);

  const uniqueMunicipalities = [...new Set(
    (municipalities || [])
      .map((m) => m.municipality)
      .filter(Boolean)
  )].sort();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal md:text-3xl">New Homeowner Leads</h1>
        <p className="mt-1 text-text-secondary">
          Recent home sales in your service area — prime opportunities for inspections and maintenance contracts.
        </p>
      </div>

      <NewHomeownerFeed
        businessId={businessId}
        savedMunicipalities={(business?.service_municipalities as string[]) || []}
        savedZipCodes={(business?.service_zip_codes as string[]) || []}
        availableMunicipalities={uniqueMunicipalities as string[]}
      />
    </div>
  );
}
