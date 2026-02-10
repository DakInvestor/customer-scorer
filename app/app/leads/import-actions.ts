"use server";

import { createSupabaseServerClient, getCurrentBusinessId } from "@/lib/supabase/server";

interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
}

/**
 * Import all property owners from Supabase tables as customers
 */
export async function importPropertyOwnersAsCustomers(): Promise<ImportResult> {
  const businessId = await getCurrentBusinessId();
  if (!businessId) {
    return { success: false, imported: 0, skipped: 0, errors: ["Not authenticated"] };
  }

  const supabase = await createSupabaseServerClient();
  const errors: string[] = [];
  let imported = 0;
  let skipped = 0;

  // Get existing customers to avoid duplicates (by address)
  const { data: existingCustomers } = await supabase
    .from("customers")
    .select("address, full_name")
    .eq("business_id", businessId);

  const existingAddresses = new Set(
    (existingCustomers || [])
      .map(c => c.address?.toLowerCase().trim())
      .filter(Boolean)
  );

  const existingNames = new Set(
    (existingCustomers || [])
      .map(c => c.full_name?.toLowerCase().trim())
      .filter(Boolean)
  );

  // Collect all unique property owners
  const ownersToImport: Array<{
    full_name: string;
    address: string;
    city: string | null;
    county: string | null;
    source: string;
  }> = [];

  // 1. Import from property_sales (new homeowners/buyers)
  const { data: sales, error: salesError } = await supabase
    .from("property_sales")
    .select("buyer_name, address_full, municipality, county")
    .not("buyer_name", "is", null)
    .not("address_full", "is", null)
    .limit(5000);

  if (salesError) {
    errors.push(`Error fetching sales: ${salesError.message}`);
  } else if (sales) {
    for (const sale of sales) {
      if (sale.buyer_name && sale.address_full) {
        ownersToImport.push({
          full_name: sale.buyer_name,
          address: sale.address_full,
          city: sale.municipality,
          county: sale.county,
          source: "property_sales",
        });
      }
    }
  }

  // 2. Import from property_records (current owners)
  const { data: properties, error: propsError } = await supabase
    .from("property_records")
    .select("owner_name, address_full, address_city, municipality, county")
    .not("owner_name", "is", null)
    .not("address_full", "is", null)
    .limit(5000);

  if (propsError) {
    errors.push(`Error fetching properties: ${propsError.message}`);
  } else if (properties) {
    for (const prop of properties) {
      if (prop.owner_name && prop.address_full) {
        ownersToImport.push({
          full_name: prop.owner_name,
          address: prop.address_full,
          city: prop.address_city || prop.municipality,
          county: prop.county,
          source: "property_records",
        });
      }
    }
  }

  // Deduplicate by address (keep first occurrence)
  const seenAddresses = new Set<string>();
  const uniqueOwners = ownersToImport.filter(owner => {
    const addrKey = owner.address.toLowerCase().trim();
    if (seenAddresses.has(addrKey)) {
      return false;
    }
    seenAddresses.add(addrKey);
    return true;
  });

  // Import each unique owner
  for (const owner of uniqueOwners) {
    const addrLower = owner.address.toLowerCase().trim();
    const nameLower = owner.full_name.toLowerCase().trim();

    // Skip if address or name already exists
    if (existingAddresses.has(addrLower) || existingNames.has(nameLower)) {
      skipped++;
      continue;
    }

    // Insert customer
    const { error: insertError } = await supabase.from("customers").insert({
      full_name: owner.full_name,
      address: owner.address,
      city: owner.city,
      county: owner.county,
      business_id: businessId,
    });

    if (insertError) {
      errors.push(`Failed to import ${owner.full_name}: ${insertError.message}`);
      skipped++;
    } else {
      imported++;
      // Add to existing sets to avoid re-importing in same batch
      existingAddresses.add(addrLower);
      existingNames.add(nameLower);
    }
  }

  return {
    success: errors.length === 0,
    imported,
    skipped,
    errors: errors.slice(0, 10), // Limit error messages
  };
}

/**
 * Get counts of available records to import
 */
export async function getImportableRecordCounts(): Promise<{
  salesCount: number;
  propertyCount: number;
  existingCustomerCount: number;
}> {
  const businessId = await getCurrentBusinessId();
  if (!businessId) {
    return { salesCount: 0, propertyCount: 0, existingCustomerCount: 0 };
  }

  const supabase = await createSupabaseServerClient();

  const [salesResult, propsResult, customersResult] = await Promise.all([
    supabase
      .from("property_sales")
      .select("id", { count: "exact", head: true })
      .not("buyer_name", "is", null),
    supabase
      .from("property_records")
      .select("id", { count: "exact", head: true })
      .not("owner_name", "is", null),
    supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("business_id", businessId),
  ]);

  return {
    salesCount: salesResult.count || 0,
    propertyCount: propsResult.count || 0,
    existingCustomerCount: customersResult.count || 0,
  };
}
