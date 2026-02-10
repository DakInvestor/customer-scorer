"use server";

import { createSupabaseAdminClient, getCurrentUser } from "@/lib/supabase/server";
import { normalizeAddress } from "@/lib/address-utils";
import { parseName, isBusinessEntity } from "@/lib/name-utils";
import type { PropertyRecord } from "@/lib/property-types";

/**
 * Hash an address for matching purposes
 */
async function hashAddress(address: string): Promise<string> {
  const normalized = normalizeAddress(address);
  const toHash = normalized.street.toUpperCase().replace(/[^A-Z0-9]/g, "");

  const encoder = new TextEncoder();
  const data = encoder.encode(toHash);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Create a customer identifier from a property record
 * This creates a "passive" profile from public records
 */
export async function createCustomerFromProperty(
  propertyId: string
): Promise<{ success: boolean; customerId?: string; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const adminClient = createSupabaseAdminClient();

  // Get the property record
  const { data: property, error: propError } = await adminClient
    .from("property_records")
    .select("*")
    .eq("id", propertyId)
    .single();

  if (propError || !property) {
    return { success: false, error: "Property not found" };
  }

  const typedProperty = property as PropertyRecord;

  // Skip non-residential or business-owned properties
  if (typedProperty.property_class && !typedProperty.property_class.toLowerCase().includes("resid")) {
    return { success: false, error: "Only residential properties can be converted to customer profiles" };
  }

  if (typedProperty.owner_name && isBusinessEntity(typedProperty.owner_name)) {
    return { success: false, error: "Business-owned properties cannot be converted to customer profiles" };
  }

  // Check if already linked
  const { data: existingLink } = await adminClient
    .from("property_customer_links")
    .select("customer_identifier_id")
    .eq("property_record_id", propertyId)
    .single();

  if (existingLink?.customer_identifier_id) {
    return { success: true, customerId: existingLink.customer_identifier_id };
  }

  // Create address hash for matching
  let addressHash: string | null = null;
  if (typedProperty.address_full) {
    addressHash = await hashAddress(typedProperty.address_full);
  }

  // Check if a customer_identifier already exists with this address hash
  if (addressHash) {
    const { data: existingByAddress } = await adminClient
      .from("customer_identifiers")
      .select("id")
      .eq("address_hash", addressHash)
      .single();

    if (existingByAddress) {
      // Link existing identifier to this property
      await adminClient.from("property_customer_links").insert({
        property_record_id: propertyId,
        customer_identifier_id: existingByAddress.id,
        match_type: "address",
        match_confidence: 0.95,
      });

      return { success: true, customerId: existingByAddress.id };
    }
  }

  // Create new customer_identifier from property data
  const { data: newIdentifier, error: insertError } = await adminClient
    .from("customer_identifiers")
    .insert({
      source: "property_enrichment",
      address_hash: addressHash,
      risk_tier: "unknown",
      weighted_score: 0,
      total_incidents: 0,
      total_positive_events: 0,
      clean_streak_months: 0,
      seen_by_business_count: 0,
      first_seen_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertError || !newIdentifier) {
    console.error("Error creating customer identifier:", insertError);
    return { success: false, error: "Failed to create customer profile" };
  }

  // Create the link
  await adminClient.from("property_customer_links").insert({
    property_record_id: propertyId,
    customer_identifier_id: newIdentifier.id,
    match_type: "auto_generated",
    match_confidence: 1.0,
  });

  return { success: true, customerId: newIdentifier.id };
}

/**
 * Link an existing customer to a property record
 */
export async function linkCustomerToProperty(
  customerId: string,
  propertyId: string,
  matchType: "address" | "name" = "address"
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const adminClient = createSupabaseAdminClient();

  // Verify both exist
  const { data: property } = await adminClient
    .from("property_records")
    .select("id")
    .eq("id", propertyId)
    .single();

  if (!property) {
    return { success: false, error: "Property not found" };
  }

  const { data: customer } = await adminClient
    .from("customer_identifiers")
    .select("id, source")
    .eq("id", customerId)
    .single();

  if (!customer) {
    return { success: false, error: "Customer not found" };
  }

  // Create or update link
  const { error: linkError } = await adminClient
    .from("property_customer_links")
    .upsert({
      property_record_id: propertyId,
      customer_identifier_id: customerId,
      match_type: matchType,
      match_confidence: matchType === "address" ? 0.9 : 0.7,
      updated_at: new Date().toISOString(),
    });

  if (linkError) {
    console.error("Error linking customer to property:", linkError);
    return { success: false, error: "Failed to link customer to property" };
  }

  // If customer was property_enrichment and now has network data, mark as merged
  if (customer.source === "property_enrichment") {
    await adminClient
      .from("customer_identifiers")
      .update({ source: "merged" })
      .eq("id", customerId);
  }

  return { success: true };
}

/**
 * Find property matches for a customer based on their address
 */
export async function findPropertyMatchesForCustomer(
  customerAddress: string
): Promise<{ properties: PropertyRecord[]; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { properties: [], error: "Not authenticated" };
  }

  const adminClient = createSupabaseAdminClient();
  const normalized = normalizeAddress(customerAddress);

  // Search for matching properties
  const { data: properties, error } = await adminClient
    .from("property_records")
    .select("*")
    .ilike("address_full", `%${normalized.street}%`)
    .limit(10);

  if (error) {
    console.error("Property search error:", error);
    return { properties: [], error: "Search failed" };
  }

  return { properties: (properties || []) as PropertyRecord[] };
}

/**
 * Get property data for a customer identifier (if linked)
 */
export async function getPropertyDataForCustomer(
  customerIdentifierId: string
): Promise<{ property: PropertyRecord | null; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { property: null, error: "Not authenticated" };
  }

  const adminClient = createSupabaseAdminClient();

  // Find linked property
  const { data: link } = await adminClient
    .from("property_customer_links")
    .select("property_record_id")
    .eq("customer_identifier_id", customerIdentifierId)
    .order("match_confidence", { ascending: false })
    .limit(1)
    .single();

  if (!link) {
    return { property: null };
  }

  // Get property data
  const { data: property, error } = await adminClient
    .from("property_records")
    .select("*")
    .eq("id", link.property_record_id)
    .single();

  if (error) {
    return { property: null, error: "Failed to load property" };
  }

  return { property: property as PropertyRecord };
}

/**
 * Batch sync: Create customer identifiers from all residential properties
 * This is an admin function to bulk-create profiles
 */
export async function batchSyncPropertiesToCustomers(options: {
  county?: string;
  municipality?: string;
  limit?: number;
}): Promise<{ created: number; skipped: number; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { created: 0, skipped: 0, error: "Not authenticated" };
  }

  const adminClient = createSupabaseAdminClient();

  // Check if user is admin
  const { data: profile } = await adminClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return { created: 0, skipped: 0, error: "Admin access required" };
  }

  // Build query for residential properties not yet linked
  let query = adminClient
    .from("property_records")
    .select("id, address_full, owner_name, property_class")
    .ilike("property_class", "%resid%")
    .limit(options.limit || 1000);

  if (options.county) {
    query = query.eq("county", options.county);
  }

  if (options.municipality) {
    query = query.eq("municipality", options.municipality);
  }

  const { data: properties, error: fetchError } = await query;

  if (fetchError) {
    console.error("Batch fetch error:", fetchError);
    return { created: 0, skipped: 0, error: "Failed to fetch properties" };
  }

  let created = 0;
  let skipped = 0;

  for (const prop of properties || []) {
    // Skip business-owned
    if (prop.owner_name && isBusinessEntity(prop.owner_name)) {
      skipped++;
      continue;
    }

    // Check if already linked
    const { data: existingLink } = await adminClient
      .from("property_customer_links")
      .select("id")
      .eq("property_record_id", prop.id)
      .single();

    if (existingLink) {
      skipped++;
      continue;
    }

    // Create customer from property
    const result = await createCustomerFromProperty(prop.id);
    if (result.success) {
      created++;
    } else {
      skipped++;
    }
  }

  return { created, skipped };
}
