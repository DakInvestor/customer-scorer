"use server";

import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/server";
import { normalizeAddress, looksLikeAddress } from "@/lib/address-utils";
import { parseName, looksLikeName, formatNameForDisplay } from "@/lib/name-utils";
import type {
  PropertyRecord,
  PermitRecord,
  PropertySale,
  CourtRecord,
  PropertyProfile,
  PropertySearchResult,
} from "@/lib/property-types";

const MAX_RESULTS = 20;

export interface PropertySearchResponse {
  results: PropertySearchResult[];
  error?: string;
}

export interface PropertyProfileResponse {
  profile: PropertyProfile | null;
  error?: string;
}

/**
 * Search properties by address or owner name
 */
export async function searchProperties(
  query: string
): Promise<PropertySearchResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { results: [], error: "Not authenticated" };
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery || trimmedQuery.length < 3) {
    return { results: [], error: "Search query must be at least 3 characters" };
  }

  const supabase = await createSupabaseServerClient();

  // Determine search type
  const isAddress = looksLikeAddress(trimmedQuery);
  const isName = looksLikeName(trimmedQuery);

  const results: PropertySearchResult[] = [];

  try {
    if (isAddress) {
      // Address search
      const normalized = normalizeAddress(trimmedQuery);
      const searchPattern = `%${normalized.street || trimmedQuery.toUpperCase()}%`;

      const { data: properties, error } = await supabase
        .from("property_records")
        .select("*")
        .ilike("address_full", searchPattern)
        .limit(MAX_RESULTS);

      if (error) {
        console.error("Property search error:", error);
        return { results: [], error: "Search failed" };
      }

      if (properties) {
        for (const prop of properties as PropertyRecord[]) {
          results.push({
            property: prop,
            matchType: "address",
            matchScore: 0.9,
          });
        }
      }
    } else if (isName) {
      // Name search
      const parsed = parseName(trimmedQuery);

      // Skip business entity searches
      if (parsed.isBusinessEntity) {
        return { results: [], error: "Business entities are not searchable as customers" };
      }

      // Build search patterns
      const searchPatterns: string[] = [];
      if (parsed.lastName && parsed.firstName) {
        searchPatterns.push(`%${parsed.lastName}%${parsed.firstName}%`);
        searchPatterns.push(`%${parsed.firstName}%${parsed.lastName}%`);
      } else if (parsed.lastName) {
        searchPatterns.push(`%${parsed.lastName}%`);
      } else {
        searchPatterns.push(`%${trimmedQuery.toUpperCase()}%`);
      }

      // Search by primary owner name
      let query = supabase
        .from("property_records")
        .select("*")
        .eq("property_class", "residential")
        .limit(MAX_RESULTS);

      // Apply first pattern to primary owner
      const { data: properties, error } = await query.or(
        `owner_name.ilike.${searchPatterns[0]},owner_name_secondary.ilike.${searchPatterns[0]}`
      );

      if (error) {
        console.error("Property name search error:", error);
        return { results: [], error: "Search failed" };
      }

      if (properties) {
        for (const prop of properties as PropertyRecord[]) {
          results.push({
            property: prop,
            matchType: "name",
            matchScore: 0.8,
          });
        }
      }
    } else {
      // Generic search - try both
      const upperQuery = trimmedQuery.toUpperCase();
      const searchPattern = `%${upperQuery}%`;

      // Search addresses first
      const { data: addressMatches } = await supabase
        .from("property_records")
        .select("*")
        .ilike("address_full", searchPattern)
        .limit(MAX_RESULTS / 2);

      if (addressMatches) {
        for (const prop of addressMatches as PropertyRecord[]) {
          results.push({
            property: prop,
            matchType: "address",
            matchScore: 0.7,
          });
        }
      }

      // Search names
      const { data: nameMatches } = await supabase
        .from("property_records")
        .select("*")
        .or(`owner_name.ilike.${searchPattern},owner_name_secondary.ilike.${searchPattern}`)
        .eq("property_class", "residential")
        .limit(MAX_RESULTS / 2);

      if (nameMatches) {
        for (const prop of nameMatches as PropertyRecord[]) {
          // Avoid duplicates
          if (!results.some((r) => r.property.id === prop.id)) {
            results.push({
              property: prop,
              matchType: "name",
              matchScore: 0.6,
            });
          }
        }
      }
    }

    // Sort by match score
    results.sort((a, b) => b.matchScore - a.matchScore);

    return { results: results.slice(0, MAX_RESULTS) };
  } catch (err) {
    console.error("Property search error:", err);
    return { results: [], error: "Search failed" };
  }
}

/**
 * Get full property profile with permits, sales, and court records
 */
export async function getPropertyProfile(
  propertyId: string
): Promise<PropertyProfileResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { profile: null, error: "Not authenticated" };
  }

  const supabase = await createSupabaseServerClient();

  try {
    // Get the property record
    const { data: property, error: propError } = await supabase
      .from("property_records")
      .select("*")
      .eq("id", propertyId)
      .single();

    if (propError || !property) {
      return { profile: null, error: "Property not found" };
    }

    const typedProperty = property as PropertyRecord;

    // Get permits for this address
    let permits: PermitRecord[] = [];
    if (typedProperty.address_full) {
      const { data: permitData } = await supabase
        .from("permit_records")
        .select("*")
        .ilike("address_full", typedProperty.address_full)
        .order("date_issued", { ascending: false })
        .limit(50);

      if (permitData) {
        permits = permitData as PermitRecord[];
      }
    }

    // Get sales history
    let sales: PropertySale[] = [];
    if (typedProperty.address_full || typedProperty.parcel_id) {
      let salesQuery = supabase
        .from("property_sales")
        .select("*")
        .order("sale_date", { ascending: false })
        .limit(20);

      if (typedProperty.parcel_id) {
        salesQuery = salesQuery.eq("parcel_id", typedProperty.parcel_id);
      } else if (typedProperty.address_full) {
        salesQuery = salesQuery.ilike("address_full", typedProperty.address_full);
      }

      const { data: salesData } = await salesQuery;
      if (salesData) {
        sales = salesData as PropertySale[];
      }
    }

    // Get court records matching owner name
    let courtRecords: CourtRecord[] = [];
    if (typedProperty.owner_name) {
      const ownerPattern = `%${typedProperty.owner_name.split(" ")[0]}%`;

      const { data: courtData } = await supabase
        .from("court_records")
        .select("*")
        .or(`party_plaintiff.ilike.${ownerPattern},party_defendant.ilike.${ownerPattern}`)
        .order("filing_date", { ascending: false })
        .limit(20);

      if (courtData) {
        courtRecords = courtData as CourtRecord[];
      }
    }

    // Check for network data match via property_customer_links
    let networkData: {
      hasNetworkProfile: boolean;
      customerIdentifierId?: string;
      riskTier?: string;
      totalIncidents?: number;
      lastIncidentAt?: string | null;
      source?: string;
    } | null = null;

    // Look for linked customer identifier
    const { data: link } = await supabase
      .from("property_customer_links")
      .select("customer_identifier_id")
      .eq("property_record_id", propertyId)
      .order("match_confidence", { ascending: false })
      .limit(1)
      .single();

    if (link?.customer_identifier_id) {
      const { data: customerData } = await supabase
        .from("customer_identifiers")
        .select("id, risk_tier, total_incidents, last_incident_at, source")
        .eq("id", link.customer_identifier_id)
        .single();

      if (customerData) {
        networkData = {
          hasNetworkProfile: customerData.source !== "property_enrichment",
          customerIdentifierId: customerData.id,
          riskTier: customerData.risk_tier,
          totalIncidents: customerData.total_incidents,
          lastIncidentAt: customerData.last_incident_at,
          source: customerData.source,
        };
      }
    }

    return {
      profile: {
        property: typedProperty,
        permits,
        sales,
        courtRecords,
        networkData,
      },
    };
  } catch (err) {
    console.error("Property profile error:", err);
    return { profile: null, error: "Failed to load property profile" };
  }
}

/**
 * Get property by address (exact or fuzzy match)
 */
export async function getPropertyByAddress(
  address: string
): Promise<PropertyProfileResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { profile: null, error: "Not authenticated" };
  }

  const supabase = await createSupabaseServerClient();
  const normalized = normalizeAddress(address);

  try {
    // Try exact match first
    let { data: property } = await supabase
      .from("property_records")
      .select("*")
      .ilike("address_full", normalized.normalized)
      .single();

    // Try fuzzy match if no exact match
    if (!property && normalized.street) {
      const { data: fuzzyMatch } = await supabase
        .from("property_records")
        .select("*")
        .ilike("address_full", `%${normalized.street}%`)
        .limit(1)
        .single();

      property = fuzzyMatch;
    }

    if (!property) {
      return { profile: null };
    }

    // Get full profile
    return getPropertyProfile(property.id);
  } catch (err) {
    console.error("Property by address error:", err);
    return { profile: null, error: "Failed to find property" };
  }
}

/**
 * Get recent home sales (for new homeowner feed)
 */
export async function getRecentHomeSales(options: {
  municipalities?: string[];
  zipCodes?: string[];
  daysBack?: number;
  limit?: number;
}): Promise<{ sales: PropertySale[]; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { sales: [], error: "Not authenticated" };
  }

  const supabase = await createSupabaseServerClient();

  const daysBack = options.daysBack || 30;
  const limit = options.limit || 50;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  try {
    let query = supabase
      .from("property_sales")
      .select("*")
      .gte("sale_date", cutoffDate.toISOString().split("T")[0])
      .order("sale_date", { ascending: false })
      .limit(limit);

    if (options.municipalities && options.municipalities.length > 0) {
      query = query.in("municipality", options.municipalities);
    }

    const { data: sales, error } = await query;

    if (error) {
      console.error("Recent sales error:", error);
      return { sales: [], error: "Failed to load recent sales" };
    }

    return { sales: (sales || []) as PropertySale[] };
  } catch (err) {
    console.error("Recent sales error:", err);
    return { sales: [], error: "Failed to load recent sales" };
  }
}

/**
 * Get permits for a specific address
 */
export async function getPermitsForAddress(
  address: string
): Promise<{ permits: PermitRecord[]; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { permits: [], error: "Not authenticated" };
  }

  const supabase = await createSupabaseServerClient();
  const normalized = normalizeAddress(address);

  try {
    const { data: permits, error } = await supabase
      .from("permit_records")
      .select("*")
      .ilike("address_full", `%${normalized.street}%`)
      .order("date_issued", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Permits error:", error);
      return { permits: [], error: "Failed to load permits" };
    }

    return { permits: (permits || []) as PermitRecord[] };
  } catch (err) {
    console.error("Permits error:", err);
    return { permits: [], error: "Failed to load permits" };
  }
}

/**
 * Find property matches for an existing customer
 * Matches by address (if provided) or by name + location
 */
export async function findPropertyMatchesForCustomer(customer: {
  full_name?: string | null;
  address?: string | null;
  city?: string | null;
  county?: string | null;
}): Promise<{ matches: PropertySearchResult[]; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { matches: [], error: "Not authenticated" };
  }

  const supabase = await createSupabaseServerClient();
  const matches: PropertySearchResult[] = [];

  try {
    // Priority 1: Match by address if provided
    if (customer.address) {
      const normalized = normalizeAddress(customer.address);
      const searchStreet = normalized.street || customer.address.toUpperCase();

      const { data: addressMatches } = await supabase
        .from("property_records")
        .select("*")
        .ilike("address_full", `%${searchStreet}%`)
        .limit(5);

      if (addressMatches) {
        for (const prop of addressMatches as PropertyRecord[]) {
          // Check if city/county match for higher confidence
          let confidence = 0.8;
          if (customer.city && prop.municipality?.toLowerCase().includes(customer.city.toLowerCase())) {
            confidence = 0.95;
          }
          if (customer.county && prop.county?.toLowerCase() === customer.county.toLowerCase()) {
            confidence = Math.max(confidence, 0.9);
          }

          matches.push({
            property: prop,
            matchType: "address",
            matchScore: confidence,
          });
        }
      }
    }

    // Priority 2: Match by name + location if no address matches or address not provided
    if (matches.length === 0 && customer.full_name) {
      const parsed = parseName(customer.full_name);

      // Skip if it looks like a business
      if (!parsed.isBusinessEntity && parsed.lastName) {
        const namePattern = parsed.firstName
          ? `%${parsed.lastName}%${parsed.firstName}%`
          : `%${parsed.lastName}%`;

        let nameQuery = supabase
          .from("property_records")
          .select("*")
          .or(`owner_name.ilike.${namePattern},owner_name_secondary.ilike.${namePattern}`)
          .limit(10);

        // Filter by county if available
        if (customer.county) {
          nameQuery = nameQuery.ilike("county", `%${customer.county}%`);
        }

        const { data: nameMatches } = await nameQuery;

        if (nameMatches) {
          for (const prop of nameMatches as PropertyRecord[]) {
            // Calculate confidence based on name match quality and location
            let confidence = 0.6;

            // Boost if city matches
            if (customer.city && prop.municipality?.toLowerCase().includes(customer.city.toLowerCase())) {
              confidence += 0.2;
            }

            // Boost if county matches
            if (customer.county && prop.county?.toLowerCase() === customer.county.toLowerCase()) {
              confidence += 0.1;
            }

            matches.push({
              property: prop,
              matchType: "name",
              matchScore: confidence,
            });
          }
        }
      }
    }

    // Sort by match score descending
    matches.sort((a, b) => b.matchScore - a.matchScore);

    return { matches: matches.slice(0, 5) };
  } catch (err) {
    console.error("Property match error:", err);
    return { matches: [], error: "Failed to find property matches" };
  }
}

/**
 * Get property profile for a customer (using best match)
 */
export async function getPropertyProfileForCustomer(customer: {
  full_name?: string | null;
  address?: string | null;
  city?: string | null;
  county?: string | null;
}): Promise<PropertyProfileResponse> {
  const { matches, error } = await findPropertyMatchesForCustomer(customer);

  if (error) {
    return { profile: null, error };
  }

  if (matches.length === 0) {
    return { profile: null };
  }

  // Get full profile for the best match (highest confidence)
  const bestMatch = matches[0];

  // Only return profile if confidence is >= 0.7
  if (bestMatch.matchScore < 0.7) {
    return { profile: null };
  }

  return getPropertyProfile(bestMatch.property.id);
}
