/**
 * Address normalization and matching utilities for property data integration
 */

// Street type abbreviations mapping
const STREET_ABBREVIATIONS: Record<string, string> = {
  STREET: "ST",
  AVENUE: "AVE",
  BOULEVARD: "BLVD",
  DRIVE: "DR",
  LANE: "LN",
  ROAD: "RD",
  COURT: "CT",
  CIRCLE: "CIR",
  PLACE: "PL",
  TERRACE: "TER",
  HIGHWAY: "HWY",
  PARKWAY: "PKWY",
  EXPRESSWAY: "EXPY",
  FREEWAY: "FWY",
  TRAIL: "TRL",
  WAY: "WAY",
  ALLEY: "ALY",
  CROSSING: "XING",
  POINT: "PT",
  SQUARE: "SQ",
  LOOP: "LOOP",
  RUN: "RUN",
  PATH: "PATH",
  PIKE: "PIKE",
  RIDGE: "RDG",
  HOLLOW: "HOLW",
  HEIGHTS: "HTS",
  HILL: "HL",
  HILLS: "HLS",
  VALLEY: "VLY",
  VIEW: "VW",
  VILLAGE: "VLG",
  ESTATES: "EST",
  EXTENSION: "EXT",
  GARDENS: "GDNS",
  GROVE: "GRV",
  MANOR: "MNR",
  MEADOWS: "MDWS",
  PARK: "PARK",
  SPRINGS: "SPGS",
  STATION: "STA",
};

// Direction abbreviations
const DIRECTION_ABBREVIATIONS: Record<string, string> = {
  NORTH: "N",
  SOUTH: "S",
  EAST: "E",
  WEST: "W",
  NORTHEAST: "NE",
  NORTHWEST: "NW",
  SOUTHEAST: "SE",
  SOUTHWEST: "SW",
};

// Unit type patterns to extract/strip
const UNIT_PATTERNS = [
  /\s+(APT|APARTMENT|UNIT|STE|SUITE|FL|FLOOR|RM|ROOM|#)\s*\.?\s*[\w-]+$/i,
  /\s+#\s*[\w-]+$/i,
];

export interface NormalizedAddress {
  original: string;
  normalized: string;
  street: string;
  unit: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  streetNumber: string | null;
  streetName: string | null;
}

/**
 * Normalize an address string for consistent matching
 */
export function normalizeAddress(address: string): NormalizedAddress {
  const original = address;
  let normalized = address.toUpperCase().trim();

  // Extract unit/apartment if present
  let unit: string | null = null;
  for (const pattern of UNIT_PATTERNS) {
    const match = normalized.match(pattern);
    if (match) {
      unit = match[0].trim();
      normalized = normalized.replace(pattern, "");
    }
  }

  // Split into components (street, city, state zip)
  const parts = normalized.split(",").map((p) => p.trim());

  let street = parts[0] || "";
  let city: string | null = null;
  let state: string | null = null;
  let zip: string | null = null;

  if (parts.length >= 2) {
    city = parts[1];
  }

  if (parts.length >= 3) {
    // Parse "PA 18901" or "PA" from last part
    const stateZipMatch = parts[2].match(/^([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?$/);
    if (stateZipMatch) {
      state = stateZipMatch[1];
      zip = stateZipMatch[2] || null;
    } else {
      state = parts[2];
    }
  }

  // Extract ZIP from city if combined
  if (city) {
    const cityZipMatch = city.match(/^(.+?)\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);
    if (cityZipMatch) {
      city = cityZipMatch[1];
      state = cityZipMatch[2];
      zip = cityZipMatch[3];
    }
  }

  // Normalize street abbreviations
  let normalizedStreet = street;
  for (const [full, abbr] of Object.entries(STREET_ABBREVIATIONS)) {
    // Match whole words only
    const pattern = new RegExp(`\\b${full}\\b`, "gi");
    normalizedStreet = normalizedStreet.replace(pattern, abbr);
  }

  // Normalize direction abbreviations
  for (const [full, abbr] of Object.entries(DIRECTION_ABBREVIATIONS)) {
    const pattern = new RegExp(`\\b${full}\\b`, "gi");
    normalizedStreet = normalizedStreet.replace(pattern, abbr);
  }

  // Remove extra spaces and periods
  normalizedStreet = normalizedStreet.replace(/\./g, "").replace(/\s+/g, " ").trim();

  // Extract street number and name
  const streetMatch = normalizedStreet.match(/^(\d+(?:-\d+)?(?:\s*[A-Z])?)\s+(.+)$/);
  const streetNumber = streetMatch ? streetMatch[1] : null;
  const streetName = streetMatch ? streetMatch[2] : normalizedStreet;

  // Rebuild normalized address
  const normalizedParts = [normalizedStreet];
  if (city) normalizedParts.push(city);
  if (state) {
    if (zip) {
      normalizedParts.push(`${state} ${zip}`);
    } else {
      normalizedParts.push(state);
    }
  }

  return {
    original,
    normalized: normalizedParts.join(", "),
    street: normalizedStreet,
    unit,
    city,
    state,
    zip,
    streetNumber,
    streetName,
  };
}

/**
 * Create a search-friendly version of an address for partial matching
 */
export function createSearchableAddress(address: string): string {
  const normalized = normalizeAddress(address);
  // Return just the street portion for partial matching
  return normalized.street;
}

/**
 * Calculate similarity score between two addresses (0-1)
 */
export function calculateAddressSimilarity(addr1: string, addr2: string): number {
  const n1 = normalizeAddress(addr1);
  const n2 = normalizeAddress(addr2);

  // Exact match on normalized street
  if (n1.street === n2.street) {
    // Bonus for matching city/state/zip
    let score = 0.8;
    if (n1.city && n2.city && n1.city === n2.city) score += 0.1;
    if (n1.zip && n2.zip && n1.zip === n2.zip) score += 0.1;
    return Math.min(score, 1);
  }

  // Check if street numbers match and street names are similar
  if (n1.streetNumber && n2.streetNumber && n1.streetNumber === n2.streetNumber) {
    if (n1.streetName && n2.streetName) {
      // Simple word overlap for street name
      const words1 = new Set(n1.streetName.split(" "));
      const words2 = new Set(n2.streetName.split(" "));
      const intersection = [...words1].filter((w) => words2.has(w));
      const union = new Set([...words1, ...words2]);
      const jaccardSimilarity = intersection.length / union.size;

      if (jaccardSimilarity >= 0.5) {
        return 0.5 + jaccardSimilarity * 0.3;
      }
    }
  }

  // Fallback: simple character overlap
  const set1 = new Set(n1.normalized.replace(/[^A-Z0-9]/g, ""));
  const set2 = new Set(n2.normalized.replace(/[^A-Z0-9]/g, ""));
  const intersection = [...set1].filter((c) => set2.has(c));
  return intersection.length / Math.max(set1.size, set2.size) * 0.5;
}

/**
 * Check if a query string looks like an address (vs a name or phone)
 */
export function looksLikeAddress(query: string): boolean {
  const trimmed = query.trim();

  // Starts with a number - likely an address
  if (/^\d/.test(trimmed)) {
    return true;
  }

  // Contains street type keywords
  const streetTypes = Object.keys(STREET_ABBREVIATIONS).concat(
    Object.values(STREET_ABBREVIATIONS)
  );
  const pattern = new RegExp(`\\b(${streetTypes.join("|")})\\b`, "i");
  if (pattern.test(trimmed)) {
    return true;
  }

  // Contains ZIP code pattern
  if (/\b\d{5}(-\d{4})?\b/.test(trimmed)) {
    return true;
  }

  // Contains state abbreviation at end
  if (/,?\s*(PA|NJ|NY|DE|MD)\s*(\d{5})?$/i.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Build a PostgreSQL search query for addresses using trigram similarity
 * Returns the WHERE clause and parameters
 */
export function buildAddressSearchQuery(
  searchTerm: string,
  tableName: string = "property_records",
  addressColumn: string = "address_full"
): { whereClause: string; params: string[] } {
  const normalized = normalizeAddress(searchTerm);

  // For partial searches, use ILIKE with wildcards
  // For more complete addresses, use trigram similarity
  if (normalized.streetNumber && normalized.streetName) {
    // Have a full street address - use trigram similarity
    return {
      whereClause: `(
        ${addressColumn} ILIKE $1
        OR similarity(${addressColumn}, $2) > 0.3
      )`,
      params: [`%${normalized.street}%`, normalized.normalized],
    };
  } else {
    // Partial search - just use ILIKE
    return {
      whereClause: `${addressColumn} ILIKE $1`,
      params: [`%${searchTerm.toUpperCase()}%`],
    };
  }
}

/**
 * Format an address for display
 */
export function formatAddressForDisplay(address: {
  address_street?: string | null;
  address_city?: string | null;
  address_state?: string | null;
  address_zip?: string | null;
  address_full?: string | null;
}): string {
  if (address.address_full) {
    // Title case the address
    return address.address_full
      .split(" ")
      .map((word) => {
        if (word.length <= 2) return word; // Keep abbreviations uppercase
        return word.charAt(0) + word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  const parts = [];
  if (address.address_street) parts.push(address.address_street);
  if (address.address_city) parts.push(address.address_city);
  if (address.address_state) {
    if (address.address_zip) {
      parts.push(`${address.address_state} ${address.address_zip}`);
    } else {
      parts.push(address.address_state);
    }
  }

  return parts.join(", ");
}
