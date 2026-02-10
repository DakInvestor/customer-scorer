import { createSupabaseServerClient, getCurrentBusinessId } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
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

  const hasServiceArea = (business?.service_municipalities as string[] || []).length > 0 ||
    (business?.service_zip_codes as string[] || []).length > 0;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal md:text-3xl">New Homeowner Leads</h1>
        <p className="mt-1 text-text-secondary">
          Recent home sales in your service area — prime opportunities for inspections and maintenance contracts.
        </p>
      </div>

      {!hasServiceArea && (
        <div className="mb-6 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-sm font-medium text-charcoal">Set up your service area</p>
              <p className="text-sm text-text-secondary">
                Define your service municipalities and ZIP codes to automatically filter leads to your area.
              </p>
              <Link
                href="/app/settings"
                className="mt-2 inline-block text-sm font-medium text-copper hover:text-copper-dark"
              >
                Go to Settings →
              </Link>
            </div>
          </div>
        </div>
      )}

      <NewHomeownerFeed
        businessId={businessId}
        savedMunicipalities={(business?.service_municipalities as string[]) || []}
        savedZipCodes={(business?.service_zip_codes as string[]) || []}
        availableMunicipalities={uniqueMunicipalities as string[]}
      />
    </div>
  );
}
