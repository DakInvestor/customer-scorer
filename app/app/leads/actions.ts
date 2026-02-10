"use server";

import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/server";

interface Lead {
  id: string;
  type: "sale" | "property" | "permit" | "court";
  address: string;
  city?: string;
  county?: string;
  municipality?: string;
  ownerName?: string;
  price?: number;
  date?: string;
  yearBuilt?: number;
  squareFootage?: number;
  assessedValue?: number;
  permitType?: string;
  permitDescription?: string;
  caseType?: string;
  amount?: number;
  tags: string[];
  score?: number;
}

interface LeadQueryOptions {
  municipalities?: string[];
  zipCodes?: string[];
  daysBack?: number;
  limit?: number;
  minAge?: number;
  minValue?: number;
  minSqFt?: number;
  minLotAcres?: number;
}

/**
 * Get new homeowner leads (recent sales)
 */
export async function getNewHomeownerLeads(options: LeadQueryOptions): Promise<Lead[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createSupabaseServerClient();
  const daysBack = options.daysBack || 30;
  const limit = options.limit || 100;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

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
    console.error("Error fetching new homeowner leads:", error);
    return [];
  }

  return (sales || []).map((sale) => {
    const daysSinceSale = Math.floor(
      (new Date().getTime() - new Date(sale.sale_date).getTime()) / (1000 * 60 * 60 * 24)
    );

    const tags: string[] = [];
    if (daysSinceSale <= 7) tags.push("New This Week");
    if (daysSinceSale <= 14) tags.push("Recent Sale");
    if (sale.sale_price && sale.sale_price > 500000) tags.push("High Value");

    return {
      id: sale.id,
      type: "sale" as const,
      address: sale.address_full || "Unknown Address",
      city: sale.municipality,
      county: sale.county,
      municipality: sale.municipality,
      ownerName: sale.buyer_name,
      price: sale.sale_price,
      date: sale.sale_date,
      tags,
      score: Math.max(100 - daysSinceSale * 2, 50), // Newer = higher score
    };
  });
}

/**
 * Get aging systems leads (old properties that may need service)
 */
export async function getAgingSystemsLeads(options: LeadQueryOptions): Promise<Lead[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createSupabaseServerClient();
  const minAge = options.minAge || 15;
  const limit = options.limit || 100;
  const currentYear = new Date().getFullYear();
  const maxYearBuilt = currentYear - minAge;

  let query = supabase
    .from("property_records")
    .select("*")
    .lt("year_built", maxYearBuilt)
    .not("year_built", "is", null)
    .eq("property_class", "residential")
    .order("year_built", { ascending: true })
    .limit(limit);

  if (options.municipalities && options.municipalities.length > 0) {
    query = query.in("municipality", options.municipalities);
  }

  const { data: properties, error } = await query;

  if (error) {
    console.error("Error fetching aging systems leads:", error);
    return [];
  }

  return (properties || []).map((prop) => {
    const age = currentYear - (prop.year_built || currentYear);
    const tags: string[] = [];

    if (age >= 30) tags.push("30+ Years Old");
    else if (age >= 25) tags.push("25+ Years Old");
    else if (age >= 20) tags.push("20+ Years Old");
    else tags.push("15+ Years Old");

    if (age >= 20) tags.push("HVAC Likely Due");
    if (age >= 25) tags.push("Electrical Check");
    if (age >= 30) tags.push("Plumbing Inspection");

    // Score based on age - older = higher priority
    const score = Math.min(50 + age, 100);

    return {
      id: prop.id,
      type: "property" as const,
      address: prop.address_full || "Unknown Address",
      city: prop.address_city,
      county: prop.county,
      municipality: prop.municipality,
      ownerName: prop.owner_name,
      yearBuilt: prop.year_built,
      squareFootage: prop.square_footage,
      assessedValue: prop.assessed_value_total,
      tags,
      score,
    };
  });
}

/**
 * Get recent permits (competitor intelligence, renovation opportunities)
 */
export async function getRecentPermits(options: LeadQueryOptions): Promise<Lead[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createSupabaseServerClient();
  const daysBack = options.daysBack || 30;
  const limit = options.limit || 100;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  let query = supabase
    .from("permit_records")
    .select("*")
    .gte("date_issued", cutoffDate.toISOString().split("T")[0])
    .order("date_issued", { ascending: false })
    .limit(limit);

  if (options.municipalities && options.municipalities.length > 0) {
    query = query.in("municipality", options.municipalities);
  }

  const { data: permits, error } = await query;

  if (error) {
    console.error("Error fetching permit leads:", error);
    return [];
  }

  return (permits || []).map((permit) => {
    const tags: string[] = [];

    if (permit.permit_type) {
      tags.push(permit.permit_type.charAt(0).toUpperCase() + permit.permit_type.slice(1));
    }
    if (permit.status === "active" || permit.status === "issued") {
      tags.push("Active");
    }
    if (permit.estimated_cost && permit.estimated_cost > 10000) {
      tags.push("Major Project");
    }

    return {
      id: permit.id,
      type: "permit" as const,
      address: permit.address_full || "Unknown Address",
      county: permit.county,
      municipality: permit.municipality,
      permitType: permit.permit_type,
      permitDescription: permit.permit_description,
      date: permit.date_issued,
      price: permit.estimated_cost,
      tags,
      score: 75,
    };
  });
}

/**
 * Get flip properties (sold multiple times recently)
 */
export async function getFlipProperties(options: LeadQueryOptions): Promise<Lead[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createSupabaseServerClient();
  const limit = options.limit || 50;

  // Get properties that have sold within the last 2 years
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  let query = supabase
    .from("property_sales")
    .select("*")
    .gte("sale_date", twoYearsAgo.toISOString().split("T")[0])
    .order("sale_date", { ascending: false })
    .limit(500);

  if (options.municipalities && options.municipalities.length > 0) {
    query = query.in("municipality", options.municipalities);
  }

  const { data: sales, error } = await query;

  if (error) {
    console.error("Error fetching flip properties:", error);
    return [];
  }

  // Group by address to find multiple sales
  const salesByAddress: Record<string, typeof sales> = {};
  for (const sale of sales || []) {
    const addr = sale.address_full?.toLowerCase();
    if (addr) {
      if (!salesByAddress[addr]) salesByAddress[addr] = [];
      salesByAddress[addr].push(sale);
    }
  }

  // Find addresses with multiple sales (potential flips)
  const flips = Object.entries(salesByAddress)
    .filter(([, addrSales]) => addrSales.length >= 2)
    .map(([, addrSales]) => addrSales[0]) // Most recent sale
    .slice(0, limit);

  return flips.map((sale) => ({
    id: sale.id,
    type: "sale" as const,
    address: sale.address_full || "Unknown Address",
    city: sale.municipality,
    county: sale.county,
    municipality: sale.municipality,
    ownerName: sale.buyer_name,
    price: sale.sale_price,
    date: sale.sale_date,
    tags: ["Potential Flip", "Investor Property"],
    score: 85,
  }));
}

/**
 * Get high value properties
 */
export async function getHighValueProperties(options: LeadQueryOptions): Promise<Lead[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createSupabaseServerClient();
  const minValue = options.minValue || 500000;
  const limit = options.limit || 100;

  let query = supabase
    .from("property_records")
    .select("*")
    .gte("assessed_value_total", minValue)
    .eq("property_class", "residential")
    .order("assessed_value_total", { ascending: false })
    .limit(limit);

  if (options.municipalities && options.municipalities.length > 0) {
    query = query.in("municipality", options.municipalities);
  }

  const { data: properties, error } = await query;

  if (error) {
    console.error("Error fetching high value properties:", error);
    return [];
  }

  return (properties || []).map((prop) => {
    const tags: string[] = ["High Value"];
    if (prop.assessed_value_total && prop.assessed_value_total > 1000000) {
      tags.push("$1M+");
    }
    if (prop.square_footage && prop.square_footage > 4000) {
      tags.push("Large Home");
    }

    return {
      id: prop.id,
      type: "property" as const,
      address: prop.address_full || "Unknown Address",
      city: prop.address_city,
      county: prop.county,
      municipality: prop.municipality,
      ownerName: prop.owner_name,
      yearBuilt: prop.year_built,
      squareFootage: prop.square_footage,
      assessedValue: prop.assessed_value_total,
      tags,
      score: 80,
    };
  });
}

/**
 * Get large properties (by sq ft or lot size)
 */
export async function getLargeProperties(options: LeadQueryOptions): Promise<Lead[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createSupabaseServerClient();
  const limit = options.limit || 100;

  let query = supabase
    .from("property_records")
    .select("*")
    .eq("property_class", "residential")
    .limit(limit);

  if (options.minSqFt) {
    query = query.gte("square_footage", options.minSqFt).order("square_footage", { ascending: false });
  } else if (options.minLotAcres) {
    query = query.gte("lot_size_acres", options.minLotAcres).order("lot_size_acres", { ascending: false });
  }

  if (options.municipalities && options.municipalities.length > 0) {
    query = query.in("municipality", options.municipalities);
  }

  const { data: properties, error } = await query;

  if (error) {
    console.error("Error fetching large properties:", error);
    return [];
  }

  return (properties || []).map((prop) => {
    const tags: string[] = [];
    if (prop.square_footage && prop.square_footage > 4000) tags.push("4000+ sq ft");
    else if (prop.square_footage && prop.square_footage > 3000) tags.push("3000+ sq ft");
    if (prop.lot_size_acres && prop.lot_size_acres > 2) tags.push("2+ Acres");
    else if (prop.lot_size_acres && prop.lot_size_acres > 1) tags.push("1+ Acre");

    return {
      id: prop.id,
      type: "property" as const,
      address: prop.address_full || "Unknown Address",
      city: prop.address_city,
      county: prop.county,
      municipality: prop.municipality,
      ownerName: prop.owner_name,
      yearBuilt: prop.year_built,
      squareFootage: prop.square_footage,
      assessedValue: prop.assessed_value_total,
      tags,
      score: 70,
    };
  });
}

/**
 * Get court record leads (liens, judgments)
 */
export async function getCourtRecordLeads(options: LeadQueryOptions): Promise<Lead[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createSupabaseServerClient();
  const daysBack = options.daysBack || 90;
  const limit = options.limit || 100;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  let query = supabase
    .from("court_records")
    .select("*")
    .gte("filing_date", cutoffDate.toISOString().split("T")[0])
    .order("filing_date", { ascending: false })
    .limit(limit);

  const { data: records, error } = await query;

  if (error) {
    console.error("Error fetching court record leads:", error);
    return [];
  }

  return (records || []).map((record) => {
    const tags: string[] = [];
    if (record.case_type) {
      tags.push(record.case_type.charAt(0).toUpperCase() + record.case_type.slice(1));
    }
    if (record.status === "open") tags.push("Open Case");

    return {
      id: record.id,
      type: "court" as const,
      address: `Case: ${record.case_number || "Unknown"}`,
      county: record.county,
      ownerName: record.party_defendant,
      caseType: record.case_type,
      amount: record.amount,
      date: record.filing_date,
      tags,
      score: 60,
    };
  });
}
