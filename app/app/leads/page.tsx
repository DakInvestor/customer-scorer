import { createSupabaseServerClient, getCurrentBusinessId } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LeadsClient from "./LeadsClient";
import { INDUSTRY_TOOLS, UNIVERSAL_TOOLS, TOOL_METADATA, type BusinessIndustry } from "@/lib/industry-types";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const businessId = await getCurrentBusinessId();
  const params = await searchParams;

  if (!businessId) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  // Get business settings including industry
  const { data: business } = await supabase
    .from("businesses")
    .select("service_area_municipalities, service_area_zips, industry, secondary_industries")
    .eq("id", businessId)
    .single();

  const industry = (business?.industry as BusinessIndustry) || "other";
  const serviceMunicipalities = (business?.service_area_municipalities as string[]) || [];
  const serviceZips = (business?.service_area_zips as string[]) || [];

  // Get available tools for this industry
  const industryTools = INDUSTRY_TOOLS[industry] || [];
  const allToolIds = [...new Set([...UNIVERSAL_TOOLS, ...industryTools])];

  // Filter to only lead-generation tools (ones that make sense on this page)
  const leadTools = allToolIds
    .filter(id => {
      const tool = TOOL_METADATA[id];
      // Exclude search/profile tools - they belong on search page
      return tool && !['enhanced_search', 'property_profile'].includes(id);
    })
    .map(id => ({ id, ...TOOL_METADATA[id] }));

  // Get list of available municipalities
  const { data: municipalities } = await supabase
    .from("property_sales")
    .select("municipality")
    .not("municipality", "is", null)
    .limit(1000);

  const uniqueMunicipalities = [...new Set(
    (municipalities || [])
      .map((m) => m.municipality)
      .filter(Boolean)
  )].sort() as string[];

  const hasServiceArea = serviceMunicipalities.length > 0 || serviceZips.length > 0;

  return (
    <LeadsClient
      businessId={businessId}
      industry={industry}
      serviceMunicipalities={serviceMunicipalities}
      serviceZips={serviceZips}
      availableMunicipalities={uniqueMunicipalities}
      hasServiceArea={hasServiceArea}
      availableTools={leadTools}
      initialFilter={params.filter || "new_homeowner_feed"}
    />
  );
}
