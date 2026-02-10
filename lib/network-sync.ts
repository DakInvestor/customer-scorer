// lib/network-sync.ts
// Utility to sync customers to the network database (anonymized)

import { SupabaseClient } from "@supabase/supabase-js";

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

async function hashValue(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function syncCustomerToNetwork(
  supabase: SupabaseClient,
  phone: string | null,
  email: string | null
): Promise<string | null> {
  // Need at least phone or email
  if (!phone && !email) {
    return null;
  }

  let phoneHash: string | null = null;
  let emailHash: string | null = null;
  let phoneLast4: string | null = null;
  let emailDomain: string | null = null;

  // Hash phone if provided
  if (phone) {
    const normalized = normalizePhone(phone);
    if (normalized.length >= 10) {
      phoneHash = await hashValue(normalized);
      phoneLast4 = normalized.slice(-4);
    }
  }

  // Hash email if provided
  if (email) {
    const normalized = normalizeEmail(email);
    if (normalized.includes("@")) {
      emailHash = await hashValue(normalized);
      emailDomain = normalized.split("@")[1];
    }
  }

  // Need at least one valid identifier
  if (!phoneHash && !emailHash) {
    return null;
  }

  // Check if customer identifier already exists (by phone or email)
  let existingId: string | null = null;

  if (phoneHash) {
    const { data } = await supabase
      .from("customer_identifiers")
      .select("id")
      .eq("phone_hash", phoneHash)
      .single();
    if (data) {
      existingId = data.id;
    }
  }

  if (!existingId && emailHash) {
    const { data } = await supabase
      .from("customer_identifiers")
      .select("id")
      .eq("email_hash", emailHash)
      .single();
    if (data) {
      existingId = data.id;
    }
  }

  if (existingId) {
    // Update existing - increment seen count
    await supabase
      .from("customer_identifiers")
      .update({
        last_seen_at: new Date().toISOString(),
        // Also update phone/email if we have more info now
        ...(phoneHash && { phone_hash: phoneHash, phone_last_four: phoneLast4 }),
        ...(emailHash && { email_hash: emailHash, email_domain: emailDomain }),
      })
      .eq("id", existingId);

    return existingId;
  } else {
    // Create new customer identifier
    const { data: newRecord, error } = await supabase
      .from("customer_identifiers")
      .insert({
        phone_hash: phoneHash,
        email_hash: emailHash,
        phone_last_four: phoneLast4,
        email_domain: emailDomain,
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
      return null;
    }

    return newRecord?.id || null;
  }
}

// Update network profile when a note/event is logged
export async function updateNetworkFromNote(
  supabase: SupabaseClient,
  phone: string | null,
  email: string | null,
  severity: number
): Promise<void> {
  // First ensure customer exists in network
  const identifierId = await syncCustomerToNetwork(supabase, phone, email);
  if (!identifierId) return;

  // Get current stats
  const { data: current } = await supabase
    .from("customer_identifiers")
    .select("total_incidents, total_positive_events, weighted_score")
    .eq("id", identifierId)
    .single();

  if (!current) return;

  // Calculate impact based on severity (1-5 scale)
  // Severity 1-2 = positive/neutral, 3+ = negative
  const isNegative = severity >= 3;
  const weight = severity >= 4 ? severity * 6 : severity >= 3 ? severity * 4 : severity;

  // Update stats
  const newTotalIncidents = isNegative ? current.total_incidents + 1 : current.total_incidents;
  const newPositiveEvents = !isNegative ? current.total_positive_events + 1 : current.total_positive_events;
  const newWeightedScore = isNegative
    ? current.weighted_score + weight
    : Math.max(0, current.weighted_score - 1);

  // Calculate risk tier based on weighted score
  let riskTier = "low";
  if (newWeightedScore >= 50) {
    riskTier = "critical";
  } else if (newWeightedScore >= 30) {
    riskTier = "high";
  } else if (newWeightedScore >= 15) {
    riskTier = "medium";
  } else if (newWeightedScore > 0) {
    riskTier = "low";
  } else {
    riskTier = "unknown";
  }

  await supabase
    .from("customer_identifiers")
    .update({
      total_incidents: newTotalIncidents,
      total_positive_events: newPositiveEvents,
      weighted_score: newWeightedScore,
      risk_tier: riskTier,
      last_incident_at: isNegative ? new Date().toISOString() : undefined,
      clean_streak_months: isNegative ? 0 : undefined,
    })
    .eq("id", identifierId);
}
