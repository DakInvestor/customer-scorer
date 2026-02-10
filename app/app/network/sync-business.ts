"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

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

// Sync all customers for a specific business to the network
export async function syncBusinessCustomers(businessId: string): Promise<void> {
  const adminClient = createSupabaseAdminClient();

  // Check if business has already been synced
  const { data: business } = await adminClient
    .from("businesses")
    .select("network_synced")
    .eq("id", businessId)
    .single();

  if (business?.network_synced) {
    // Already synced
    return;
  }

  // Get all customers for this business
  const { data: customers } = await adminClient
    .from("customers")
    .select("id, phone, email")
    .eq("business_id", businessId);

  if (!customers || customers.length === 0) {
    // Mark as synced even if no customers
    await adminClient
      .from("businesses")
      .update({ network_synced: true })
      .eq("id", businessId);
    return;
  }

  // Sync each customer
  for (const customer of customers) {
    const phone = customer.phone;
    const email = customer.email;

    if (!phone && !email) continue;

    let phoneHash: string | null = null;
    let emailHash: string | null = null;
    let phoneLast4: string | null = null;
    let emailDomain: string | null = null;

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

    if (!phoneHash && !emailHash) continue;

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

    if (existingId) {
      // Update existing - increment seen count
      const { data: current } = await adminClient
        .from("customer_identifiers")
        .select("seen_by_business_count")
        .eq("id", existingId)
        .single();

      await adminClient
        .from("customer_identifiers")
        .update({
          last_seen_at: new Date().toISOString(),
          seen_by_business_count: (current?.seen_by_business_count || 1) + 1,
          ...(phoneHash && { phone_hash: phoneHash, phone_last_four: phoneLast4 }),
          ...(emailHash && { email_hash: emailHash, email_domain: emailDomain }),
        })
        .eq("id", existingId);
    } else {
      // Create new
      await adminClient
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
        });
    }
  }

  // Mark business as synced
  await adminClient
    .from("businesses")
    .update({ network_synced: true })
    .eq("id", businessId);
}
