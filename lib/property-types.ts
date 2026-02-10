/**
 * TypeScript types for property data tables
 * These tables are read-only - managed by external scraper
 */

export interface PropertyRecord {
  id: string;
  county: "bucks" | "montgomery";
  municipality: string | null;
  parcel_id: string | null;
  address_full: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  owner_name: string | null;
  owner_name_secondary: string | null;
  property_class: string | null;
  assessed_value_land: number | null;
  assessed_value_building: number | null;
  assessed_value_total: number | null;
  market_value_estimate: number | null;
  year_built: number | null;
  square_footage: number | null;
  lot_size_acres: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  last_sale_date: string | null;
  last_sale_price: number | null;
  scraped_at: string | null;
  source_url: string | null;
  raw_data: Record<string, unknown> | null;
}

export interface PermitRecord {
  id: string;
  county: "bucks" | "montgomery";
  municipality: string | null;
  permit_number: string | null;
  address_full: string | null;
  permit_type: "hvac" | "plumbing" | "electrical" | "mechanical" | "roofing" | "general" | "demolition" | "other" | null;
  permit_description: string | null;
  date_issued: string | null;
  date_completed: string | null;
  status: "issued" | "active" | "completed" | "expired" | null;
  contractor_name: string | null;
  estimated_cost: number | null;
}

export interface PropertySale {
  id: string;
  county: "bucks" | "montgomery";
  municipality: string | null;
  address_full: string | null;
  parcel_id: string | null;
  buyer_name: string | null;
  seller_name: string | null;
  sale_date: string | null;
  sale_price: number | null;
  deed_type: string | null;
}

export interface CourtRecord {
  id: string;
  county: "bucks" | "montgomery";
  case_number: string | null;
  case_type: "civil" | "lien" | "judgment" | "small_claims" | null;
  filing_date: string | null;
  party_plaintiff: string | null;
  party_defendant: string | null;
  amount: number | null;
  status: "open" | "closed" | "settled" | "dismissed" | null;
  description: string | null;
}

// Enriched property profile combining all data sources
export interface PropertyProfile {
  property: PropertyRecord;
  permits: PermitRecord[];
  sales: PropertySale[];
  courtRecords: CourtRecord[];
  networkData: {
    hasNetworkProfile: boolean;
    customerIdentifierId?: string;
    riskTier?: string;
    totalIncidents?: number;
    lastIncidentAt?: string | null;
    source?: string;
  } | null;
}

// Search result type
export interface PropertySearchResult {
  property: PropertyRecord;
  matchType: "address" | "name";
  matchScore: number;
}

// New homeowner lead
export interface NewHomeownerLead {
  sale: PropertySale;
  property: PropertyRecord | null;
  recentPermits: PermitRecord[];
  suggestedServices: string[];
  propertyAge: number | null;
}
