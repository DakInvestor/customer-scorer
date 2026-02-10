/**
 * Name normalization and matching utilities for property data integration
 */

// Suffixes to normalize
const NAME_SUFFIXES = ["JR", "SR", "II", "III", "IV", "V", "ESQ", "MD", "PHD", "DDS"];

// Business entity indicators - skip these as individual customers
const BUSINESS_INDICATORS = [
  "LLC",
  "L.L.C.",
  "INC",
  "INCORPORATED",
  "CORP",
  "CORPORATION",
  "LP",
  "L.P.",
  "LLP",
  "L.L.P.",
  "TRUST",
  "ESTATE",
  "PARTNERSHIP",
  "ASSOCIATES",
  "HOLDINGS",
  "PROPERTIES",
  "INVESTMENTS",
  "VENTURES",
  "ENTERPRISES",
  "COMPANY",
  "CO",
  "GROUP",
  "FUND",
  "FOUNDATION",
  "ASSOCIATION",
  "BANK",
  "SAVINGS",
  "CREDIT UNION",
  "MORTGAGE",
  "REALTY",
  "REAL ESTATE",
  "DEVELOPMENT",
  "BUILDERS",
  "CONSTRUCTION",
  "MANAGEMENT",
  "SERVICES",
];

export interface ParsedName {
  original: string;
  normalized: string;
  firstName: string | null;
  lastName: string | null;
  middleInitial: string | null;
  suffix: string | null;
  isBusinessEntity: boolean;
  secondaryName: string | null; // For "SMITH JOHN & JANE" patterns
}

/**
 * Check if a name appears to be a business entity rather than an individual
 */
export function isBusinessEntity(name: string): boolean {
  const upper = name.toUpperCase();
  return BUSINESS_INDICATORS.some((indicator) => {
    const pattern = new RegExp(`\\b${indicator.replace(/\./g, "\\.")}\\b`, "i");
    return pattern.test(upper);
  });
}

/**
 * Parse and normalize a name from property records format
 * Handles formats like:
 * - "SMITH, JOHN"
 * - "SMITH JOHN"
 * - "SMITH, JOHN E"
 * - "SMITH JR, JOHN"
 * - "SMITH JOHN & JANE"
 */
export function parseName(name: string): ParsedName {
  const original = name;
  let normalized = name.toUpperCase().trim();

  // Check if it's a business entity
  if (isBusinessEntity(normalized)) {
    return {
      original,
      normalized,
      firstName: null,
      lastName: null,
      middleInitial: null,
      suffix: null,
      isBusinessEntity: true,
      secondaryName: null,
    };
  }

  // Extract secondary name (spouse/co-owner) if present
  let secondaryName: string | null = null;
  const andMatch = normalized.match(/^(.+?)\s*[&]\s*(.+)$/);
  if (andMatch) {
    normalized = andMatch[1].trim();
    const secondPart = andMatch[2].trim();
    // If second part is just a first name, assume same last name
    if (!secondPart.includes(",") && !secondPart.includes(" ")) {
      // Just a first name like "JANE"
      const mainParsed = parseSimpleName(normalized);
      if (mainParsed.lastName) {
        secondaryName = `${secondPart} ${mainParsed.lastName}`;
      } else {
        secondaryName = secondPart;
      }
    } else {
      secondaryName = secondPart;
    }
  }

  const parsed = parseSimpleName(normalized);

  return {
    original,
    normalized: parsed.normalized,
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    middleInitial: parsed.middleInitial,
    suffix: parsed.suffix,
    isBusinessEntity: false,
    secondaryName,
  };
}

/**
 * Parse a simple name (no & secondary names)
 */
function parseSimpleName(name: string): {
  normalized: string;
  firstName: string | null;
  lastName: string | null;
  middleInitial: string | null;
  suffix: string | null;
} {
  let working = name.toUpperCase().trim();

  // Extract suffix
  let suffix: string | null = null;
  for (const s of NAME_SUFFIXES) {
    const pattern = new RegExp(`\\b${s}\\b\\.?`, "i");
    if (pattern.test(working)) {
      suffix = s;
      working = working.replace(pattern, "").trim();
    }
  }

  // Remove extra punctuation and spaces
  working = working.replace(/[.,]/g, " ").replace(/\s+/g, " ").trim();

  let firstName: string | null = null;
  let lastName: string | null = null;
  let middleInitial: string | null = null;

  // Check for "LAST, FIRST" format (comma-separated)
  if (working.includes(",")) {
    // Handle potential suffix before comma: "SMITH JR, JOHN"
    const commaMatch = working.match(/^([^,]+),\s*(.+)$/);
    if (commaMatch) {
      const lastPart = commaMatch[1].trim();
      const firstPart = commaMatch[2].trim();

      // Check if suffix is attached to last name
      const lastWords = lastPart.split(" ");
      if (lastWords.length > 1 && NAME_SUFFIXES.includes(lastWords[lastWords.length - 1])) {
        suffix = lastWords.pop()!;
        lastName = lastWords.join(" ");
      } else {
        lastName = lastPart;
      }

      // Parse first part for first name and middle initial
      const firstWords = firstPart.split(" ");
      firstName = firstWords[0];
      if (firstWords.length > 1) {
        const potential = firstWords[1];
        if (potential.length === 1 || (potential.length === 2 && potential.endsWith("."))) {
          middleInitial = potential.replace(".", "");
        }
      }
    }
  } else {
    // "FIRST LAST" or "LAST FIRST" format (no comma)
    const words = working.split(" ");

    if (words.length === 1) {
      // Just one name - assume it's the last name
      lastName = words[0];
    } else if (words.length === 2) {
      // Could be "FIRST LAST" or "LAST FIRST"
      // Property records usually use "LAST FIRST" format without comma
      // We'll assume "LAST FIRST" for property records
      lastName = words[0];
      firstName = words[1];
    } else if (words.length >= 3) {
      // "LAST FIRST MIDDLE" or "FIRST MIDDLE LAST"
      // Assume property record format: "LAST FIRST MIDDLE"
      lastName = words[0];
      firstName = words[1];
      const potential = words[2];
      if (potential.length === 1 || (potential.length === 2 && potential.endsWith("."))) {
        middleInitial = potential.replace(".", "");
      }
    }
  }

  // Build normalized name as "FIRST LAST"
  const normalizedParts = [];
  if (firstName) normalizedParts.push(firstName);
  if (lastName) normalizedParts.push(lastName);
  if (suffix) normalizedParts.push(suffix);

  return {
    normalized: normalizedParts.join(" "),
    firstName,
    lastName,
    middleInitial,
    suffix,
  };
}

/**
 * Calculate similarity score between two names (0-1)
 */
export function calculateNameSimilarity(name1: string, name2: string): number {
  const p1 = parseName(name1);
  const p2 = parseName(name2);

  // Business entities don't match individuals
  if (p1.isBusinessEntity !== p2.isBusinessEntity) {
    return 0;
  }

  // Both business entities - simple string match
  if (p1.isBusinessEntity && p2.isBusinessEntity) {
    return p1.normalized === p2.normalized ? 1 : 0;
  }

  // Compare individuals
  let score = 0;

  // Last name match is most important
  if (p1.lastName && p2.lastName) {
    if (p1.lastName === p2.lastName) {
      score += 0.5;
    } else if (
      p1.lastName.startsWith(p2.lastName) ||
      p2.lastName.startsWith(p1.lastName)
    ) {
      score += 0.3;
    }
  }

  // First name match
  if (p1.firstName && p2.firstName) {
    if (p1.firstName === p2.firstName) {
      score += 0.4;
    } else if (
      p1.firstName.startsWith(p2.firstName) ||
      p2.firstName.startsWith(p1.firstName)
    ) {
      score += 0.2;
    } else if (p1.firstName[0] === p2.firstName[0]) {
      // Same first initial
      score += 0.1;
    }
  }

  // Suffix match (bonus)
  if (p1.suffix && p2.suffix && p1.suffix === p2.suffix) {
    score += 0.1;
  }

  return Math.min(score, 1);
}

/**
 * Check if a query string looks like a name (vs address or phone)
 */
export function looksLikeName(query: string): boolean {
  const trimmed = query.trim();

  // Starts with a number - probably not a name
  if (/^\d/.test(trimmed)) {
    return false;
  }

  // Contains @ - probably email
  if (trimmed.includes("@")) {
    return false;
  }

  // All digits or formatted phone - not a name
  if (/^[\d\s\-().+]+$/.test(trimmed)) {
    return false;
  }

  // Contains street type keywords - probably address
  const streetTypes = ["ST", "AVE", "BLVD", "DR", "LN", "RD", "CT", "STREET", "AVENUE"];
  if (streetTypes.some((st) => new RegExp(`\\b${st}\\b`, "i").test(trimmed))) {
    return false;
  }

  // Contains ZIP code pattern - probably address
  if (/\b\d{5}(-\d{4})?\b/.test(trimmed)) {
    return false;
  }

  // Looks like a name if it's 1-4 words of letters
  const words = trimmed.split(/\s+/);
  if (words.length >= 1 && words.length <= 4) {
    return words.every((w) => /^[A-Za-z.,'-]+$/.test(w));
  }

  return false;
}

/**
 * Format a name for display (title case)
 */
export function formatNameForDisplay(name: string | null): string {
  if (!name) return "Unknown";

  return name
    .split(" ")
    .map((word) => {
      // Keep suffixes uppercase
      if (NAME_SUFFIXES.includes(word.toUpperCase())) {
        return word.toUpperCase();
      }
      // Title case
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Build a PostgreSQL search query for names
 */
export function buildNameSearchQuery(
  searchTerm: string,
  ownerColumn: string = "owner_name",
  secondaryColumn: string = "owner_name_secondary"
): { whereClause: string; params: string[] } {
  const parsed = parseName(searchTerm);

  // Skip business entity searches for individual matching
  if (parsed.isBusinessEntity) {
    return {
      whereClause: `${ownerColumn} ILIKE $1`,
      params: [`%${searchTerm.toUpperCase()}%`],
    };
  }

  // Search by normalized name or parts
  const searchPatterns: string[] = [];

  // Full normalized name
  if (parsed.normalized) {
    searchPatterns.push(parsed.normalized);
  }

  // "LAST, FIRST" format
  if (parsed.lastName && parsed.firstName) {
    searchPatterns.push(`${parsed.lastName}, ${parsed.firstName}`);
    searchPatterns.push(`${parsed.lastName} ${parsed.firstName}`);
    searchPatterns.push(`${parsed.firstName} ${parsed.lastName}`);
  }

  // Just last name
  if (parsed.lastName) {
    searchPatterns.push(parsed.lastName);
  }

  const conditions = searchPatterns.map((_, i) => {
    const paramNum = i + 1;
    return `(${ownerColumn} ILIKE $${paramNum} OR ${secondaryColumn} ILIKE $${paramNum})`;
  });

  return {
    whereClause: `(${conditions.join(" OR ")})`,
    params: searchPatterns.map((p) => `%${p}%`),
  };
}
