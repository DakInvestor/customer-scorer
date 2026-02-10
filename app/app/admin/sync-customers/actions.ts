"use server";

import { createSupabaseServerClient, createSupabaseAdminClient, getCurrentUser } from "@/lib/supabase/server";

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

export async function syncAllCustomers(): Promise<{ synced: number; skipped: number; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { synced: 0, skipped: 0, error: "Not authenticated" };
  }

  const supabase = await createSupabaseServerClient();

  // Check if admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return { synced: 0, skipped: 0, error: "Not authorized" };
  }

  const adminClient = createSupabaseAdminClient();

  // Get all customers
  const { data: customers, error: fetchError } = await adminClient
    .from("customers")
    .select("id, phone, email");

  if (fetchError) {
    return { synced: 0, skipped: 0, error: fetchError.message };
  }

  let synced = 0;
  let skipped = 0;

  for (const customer of customers || []) {
    const phone = customer.phone;
    const email = customer.email;

    if (!phone && !email) {
      skipped++;
      continue;
    }

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

    if (!phoneHash && !emailHash) {
      skipped++;
      continue;
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

    if (existingId) {
      // Update existing
      await adminClient
        .from("customer_identifiers")
        .update({
          last_seen_at: new Date().toISOString(),
          ...(phoneHash && { phone_hash: phoneHash, phone_last_four: phoneLast4 }),
          ...(emailHash && { email_hash: emailHash, email_domain: emailDomain }),
        })
        .eq("id", existingId);
    } else {
      // Create new
      const { error: insertError } = await adminClient
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

      if (insertError) {
        console.error("Error inserting customer identifier:", insertError);
        skipped++;
        continue;
      }
    }

    synced++;
  }

  return { synced, skipped };
}
