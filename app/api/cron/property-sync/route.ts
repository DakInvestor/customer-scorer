import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { isBusinessEntity } from "@/lib/name-utils";

// Verify cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "1000", 10);
  const county = searchParams.get("county") || undefined;

  try {
    const adminClient = createSupabaseAdminClient();

    // Get residential properties not yet linked
    let query = adminClient
      .from("property_records")
      .select("id, address_full, owner_name, property_class")
      .ilike("property_class", "%resid%")
      .limit(limit);

    if (county) {
      query = query.eq("county", county);
    }

    const { data: properties, error: fetchError } = await query;

    if (fetchError) {
      console.error("Batch fetch error:", fetchError);
      return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
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

      // Create address hash
      let addressHash: string | null = null;
      if (prop.address_full) {
        const toHash = prop.address_full.toUpperCase().replace(/[^A-Z0-9]/g, "");
        const encoder = new TextEncoder();
        const data = encoder.encode(toHash);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        addressHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      }

      // Check if customer_identifier exists with this address hash
      if (addressHash) {
        const { data: existingByAddress } = await adminClient
          .from("customer_identifiers")
          .select("id")
          .eq("address_hash", addressHash)
          .single();

        if (existingByAddress) {
          // Link existing identifier to this property
          await adminClient.from("property_customer_links").insert({
            property_record_id: prop.id,
            customer_identifier_id: existingByAddress.id,
            match_type: "address",
            match_confidence: 0.95,
          });
          skipped++;
          continue;
        }
      }

      // Create new customer_identifier
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
        skipped++;
        continue;
      }

      // Create the link
      await adminClient.from("property_customer_links").insert({
        property_record_id: prop.id,
        customer_identifier_id: newIdentifier.id,
        match_type: "auto_generated",
        match_confidence: 1.0,
      });

      created++;
    }

    return NextResponse.json({
      success: true,
      created,
      skipped,
      total: (properties || []).length,
    });
  } catch (err) {
    console.error("Property sync error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
