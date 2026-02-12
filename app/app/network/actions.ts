"use server";

import { createSupabaseServerClient, createSupabaseAdminClient, getCurrentUser } from "@/lib/supabase/server";
import { normalizeAddress as normalizeAddressUtil } from "@/lib/address-utils";
import type { PropertyRecord } from "@/lib/property-types";

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

function normalizeAddress(address: string): string {
  // Normalize address for consistent hashing:
  // lowercase, remove extra spaces, standardize common abbreviations
  return address
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\bstreet\b/g, "st")
    .replace(/\bavenue\b/g, "ave")
    .replace(/\bboulevard\b/g, "blvd")
    .replace(/\bdrive\b/g, "dr")
    .replace(/\broad\b/g, "rd")
    .replace(/\blane\b/g, "ln")
    .replace(/\bcourt\b/g, "ct")
    .replace(/\bplace\b/g, "pl")
    .replace(/\bapartment\b/g, "apt")
    .replace(/\bsuite\b/g, "ste")
    .replace(/[.,#]/g, "");
}

function extractPartialAddress(address: string): string {
  // Extract street name and city for display (hide house number for privacy)
  const parts = address.split(",").map(p => p.trim());
  if (parts.length >= 2) {
    // Try to extract street name without number
    const streetPart = parts[0];
    const streetWords = streetPart.split(" ");
    // Skip first word if it's a number
    const streetName = /^\d+$/.test(streetWords[0])
      ? streetWords.slice(1).join(" ")
      : streetPart;
    return streetName + ", " + parts.slice(1).join(", ");
  }
  // Fallback: just return as-is if we can't parse
  return address;
}

async function hashValue(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function searchNetwork(searchType: "phone" | "email" | "address" | "name", searchValue: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check verification status
  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("verification_status, business_id")
    .eq("id", user.id)
    .single();

  if (profile?.verification_status !== "verified") {
    return { error: "Verification required" };
  }

  // Use admin client to bypass RLS
  const adminClient = createSupabaseAdminClient();

  // For address searches, search property_records directly with flexible matching
  if (searchType === "address") {
    const searchTerm = searchValue.trim().toUpperCase();

    // Split search into parts for flexible matching
    const parts = searchTerm.split(/[\s,]+/).filter(p => p.length > 0);

    // Build search patterns - try multiple approaches
    let properties: PropertyRecord[] = [];

    // First try: exact-ish match with ILIKE
    const { data: exactMatch, error: exactError } = await adminClient
      .from("property_records")
      .select("*")
      .ilike("address_full", `%${searchTerm}%`)
      .limit(20);

    if (!exactError && exactMatch && exactMatch.length > 0) {
      properties = exactMatch as PropertyRecord[];
    } else if (parts.length >= 2) {
      // Second try: match by street number + street name
      const streetNum = parts[0];
      const streetName = parts.slice(1).join(" ");

      const { data: partialMatch } = await adminClient
        .from("property_records")
        .select("*")
        .ilike("address_full", `%${streetNum}%${streetName}%`)
        .limit(20);

      if (partialMatch && partialMatch.length > 0) {
        properties = partialMatch as PropertyRecord[];
      } else {
        // Third try: just street name
        const { data: streetMatch } = await adminClient
          .from("property_records")
          .select("*")
          .ilike("address_street", `%${streetName}%`)
          .limit(20);

        properties = (streetMatch || []) as PropertyRecord[];
      }
    }

    // Mark that user has searched the network (for checklist)
    if (profile?.business_id) {
      const { error: updateError } = await supabase
        .from("businesses")
        .update({ has_searched_network: true })
        .eq("id", profile.business_id);

      if (updateError) {
        console.error("Error updating has_searched_network:", updateError);
        // Non-critical, continue without failing
      }
    }

    return {
      profile: null,
      propertyRecords: properties,
    };
  }

  // For name searches, search property_records by owner name
  if (searchType === "name") {
    const searchTerm = searchValue.trim().toUpperCase();
    const parts = searchTerm.split(/\s+/).filter(p => p.length > 0);

    let properties: PropertyRecord[] = [];

    // Try exact match first
    const { data: exactMatch } = await adminClient
      .from("property_records")
      .select("*")
      .ilike("owner_name", `%${searchTerm}%`)
      .limit(30);

    if (exactMatch && exactMatch.length > 0) {
      properties = exactMatch as PropertyRecord[];
    } else if (parts.length >= 1) {
      // Try matching just the last name (common format is "LASTNAME, FIRSTNAME")
      const lastName = parts[parts.length > 1 ? parts.length - 1 : 0];

      const { data: lastNameMatch } = await adminClient
        .from("property_records")
        .select("*")
        .ilike("owner_name", `${lastName}%`)
        .limit(30);

      if (lastNameMatch && lastNameMatch.length > 0) {
        properties = lastNameMatch as PropertyRecord[];
      } else if (parts.length > 1) {
        // Try first name search
        const firstName = parts[0];
        const { data: firstNameMatch } = await adminClient
          .from("property_records")
          .select("*")
          .ilike("owner_name", `%${firstName}%`)
          .limit(30);

        properties = (firstNameMatch || []) as PropertyRecord[];
      }
    }

    // Mark that user has searched the network (for checklist)
    if (profile?.business_id) {
      const { error: updateError } = await supabase
        .from("businesses")
        .update({ has_searched_network: true })
        .eq("id", profile.business_id);

      if (updateError) {
        console.error("Error updating has_searched_network:", updateError);
        // Non-critical, continue without failing
      }
    }

    return {
      profile: null,
      propertyRecords: properties,
    };
  }

  // For phone/email, use the hash-based search
  let hash: string;
  if (searchType === "phone") {
    const normalized = normalizePhone(searchValue);
    if (normalized.length < 10) {
      return { error: "Invalid phone number" };
    }
    hash = await hashValue(normalized);
  } else {
    const normalized = normalizeEmail(searchValue);
    if (!normalized.includes("@")) {
      return { error: "Invalid email" };
    }
    hash = await hashValue(normalized);
  }

  // Search for matching customer identifier
  const column = searchType === "phone" ? "phone_hash" : "email_hash";
  const { data, error: searchError } = await adminClient
    .from("customer_identifiers")
    .select("*")
    .eq(column, hash)
    .single();

  if (searchError && searchError.code !== "PGRST116") {
    console.error("Search error:", searchError);
    return { error: "Search failed" };
  }

  if (!data) {
    return { profile: null };
  }

  // Get incident breakdown
  const { data: incidents } = await adminClient
    .from("network_incident_counts")
    .select("event_category_id, active_count")
    .eq("customer_identifier_id", data.id)
    .gt("active_count", 0);

  const breakdown: Record<string, number> = {};
  if (incidents) {
    incidents.forEach((inc) => {
      breakdown[inc.event_category_id] = inc.active_count;
    });
  }

  // Mark that user has searched the network (for checklist)
  if (profile?.business_id) {
    const { error: updateError } = await supabase
      .from("businesses")
      .update({ has_searched_network: true })
      .eq("id", profile.business_id);

    if (updateError) {
      console.error("Error updating has_searched_network:", updateError);
      // Non-critical, continue without failing
    }
  }

  return {
    profile: {
      ...data,
      incident_breakdown: breakdown,
    },
  };
}

export async function syncCustomerToNetworkAction(
  phone: string | null,
  email: string | null,
  address: string | null = null
): Promise<{ id: string | null; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { id: null, error: "Not authenticated" };
  }

  if (!phone && !email && !address) {
    return { id: null };
  }

  const adminClient = createSupabaseAdminClient();

  let phoneHash: string | null = null;
  let emailHash: string | null = null;
  let addressHash: string | null = null;
  let phoneLast4: string | null = null;
  let emailDomain: string | null = null;
  let addressPartial: string | null = null;

  if (phone) {
    const normalized = normalizePhone(phone);
    if (normalized.length >= 10) {
      phoneHash = await hashValue(normalized);
      phoneLast4 = normalized.slice(-4);
    }
  }

  if (email) {
    const normalized = normalizeEmail(email);
    if (normalized.includes("@")) {
      emailHash = await hashValue(normalized);
      emailDomain = normalized.split("@")[1];
    }
  }

  if (address) {
    const normalized = normalizeAddress(address);
    if (normalized.length >= 5) {
      addressHash = await hashValue(normalized);
      addressPartial = extractPartialAddress(address);
    }
  }

  if (!phoneHash && !emailHash && !addressHash) {
    return { id: null };
  }

  // Check if exists
  let existingId: string | null = null;

  if (phoneHash) {
    const { data } = await adminClient
      .from("customer_identifiers")
      .select("id")
      .eq("phone_hash", phoneHash)
      .single();
    if (data) existingId = data.id;
  }

  if (!existingId && emailHash) {
    const { data } = await adminClient
      .from("customer_identifiers")
      .select("id")
      .eq("email_hash", emailHash)
      .single();
    if (data) existingId = data.id;
  }

  if (!existingId && addressHash) {
    const { data } = await adminClient
      .from("customer_identifiers")
      .select("id")
      .eq("address_hash", addressHash)
      .single();
    if (data) existingId = data.id;
  }

  if (existingId) {
    const { error: updateError } = await adminClient
      .from("customer_identifiers")
      .update({
        last_seen_at: new Date().toISOString(),
        ...(phoneHash && { phone_hash: phoneHash, phone_last_four: phoneLast4 }),
        ...(emailHash && { email_hash: emailHash, email_domain: emailDomain }),
        ...(addressHash && { address_hash: addressHash, address_partial: addressPartial }),
      })
      .eq("id", existingId);

    if (updateError) {
      console.error("Error updating customer identifier:", updateError);
      // Don't fail - the identifier exists, just couldn't update it
    }
    return { id: existingId };
  }

  // Create new
  const { data: newRecord, error } = await adminClient
    .from("customer_identifiers")
    .insert({
      phone_hash: phoneHash,
      email_hash: emailHash,
      address_hash: addressHash,
      phone_last_four: phoneLast4,
      email_domain: emailDomain,
      address_partial: addressPartial,
      risk_tier: "unknown",
      weighted_score: 0,
      total_incidents: 0,
      total_positive_events: 0,
      clean_streak_months: 0,
      seen_by_business_count: 1,
      first_seen_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating customer identifier:", error);
    return { id: null, error: error.message };
  }

  return { id: newRecord?.id || null };
}

export async function addCustomerFromNetworkAction(
  phone: string | null,
  email: string | null,
  address: string | null = null,
  fullName: string | null = null,
  city: string | null = null,
  state: string | null = null
): Promise<{ success: boolean; customerId?: string; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = await createSupabaseServerClient();

  // Get user's business_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("business_id")
    .eq("id", user.id)
    .single();

  if (!profile?.business_id) {
    return { success: false, error: "No business found" };
  }

  // Create customer with all available info
  const { data: newCustomer, error } = await supabase
    .from("customers")
    .insert({
      full_name: fullName || "Unknown",
      phone: phone || null,
      email: email || null,
      address: address || null,
      city: city || null,
      state: state || null,
      business_id: profile.business_id,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating customer:", error);
    return { success: false, error: error.message };
  }

  // Also sync to network
  await syncCustomerToNetworkAction(phone, email, address);

  return { success: true, customerId: newCustomer?.id };
}

export async function updateNetworkFromNoteAction(
  phone: string | null,
  email: string | null,
  severity: number,
  address: string | null = null
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await syncCustomerToNetworkAction(phone, email, address);
    if (!result.id) {
      return { success: true }; // No identifier to update, but not an error
    }

    const adminClient = createSupabaseAdminClient();

    const { data: current, error: fetchError } = await adminClient
      .from("customer_identifiers")
      .select("total_incidents, total_positive_events, weighted_score")
      .eq("id", result.id)
      .single();

    if (fetchError) {
      console.error("Error fetching customer identifier:", fetchError);
      return { success: false, error: "Failed to fetch customer data" };
    }

    if (!current) {
      return { success: true }; // No data to update
    }

    const isNegative = severity >= 3;
    const weight = severity >= 4 ? severity * 6 : severity >= 3 ? severity * 4 : severity;

    const newTotalIncidents = isNegative ? current.total_incidents + 1 : current.total_incidents;
    const newPositiveEvents = !isNegative ? current.total_positive_events + 1 : current.total_positive_events;
    const newWeightedScore = isNegative
      ? current.weighted_score + weight
      : Math.max(0, current.weighted_score - 1);

    let riskTier = "low";
    if (newWeightedScore >= 50) riskTier = "critical";
    else if (newWeightedScore >= 30) riskTier = "high";
    else if (newWeightedScore >= 15) riskTier = "medium";
    else if (newWeightedScore > 0) riskTier = "low";
    else riskTier = "unknown";

    const { error: updateError } = await adminClient
      .from("customer_identifiers")
      .update({
        total_incidents: newTotalIncidents,
        total_positive_events: newPositiveEvents,
        weighted_score: newWeightedScore,
        risk_tier: riskTier,
        ...(isNegative && { last_incident_at: new Date().toISOString(), clean_streak_months: 0 }),
      })
      .eq("id", result.id);

    if (updateError) {
      console.error("Error updating customer identifier:", updateError);
      return { success: false, error: "Failed to update customer data" };
    }

    return { success: true };
  } catch (err) {
    console.error("updateNetworkFromNoteAction error:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}
