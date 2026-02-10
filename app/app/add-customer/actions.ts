"use server";

import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/server";
import { syncCustomerToNetworkAction } from "@/app/app/network/actions";

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

function normalizeAddress(address: string): string {
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

interface DuplicateCheck {
  isDuplicate: boolean;
  existingCustomerId?: string;
  matchedOn?: "phone" | "email" | "address" | "name";
  existingCustomerName?: string;
}

export async function checkForDuplicateCustomer(
  phone: string | null,
  email: string | null,
  address: string | null,
  fullName: string | null
): Promise<DuplicateCheck> {
  const user = await getCurrentUser();
  if (!user) {
    return { isDuplicate: false };
  }

  const supabase = await createSupabaseServerClient();

  // Get user's business_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("business_id")
    .eq("id", user.id)
    .single();

  if (!profile?.business_id) {
    return { isDuplicate: false };
  }

  // Check by phone (most reliable)
  if (phone) {
    const normalizedPhone = normalizePhone(phone);
    if (normalizedPhone.length >= 10) {
      const { data: phoneMatch } = await supabase
        .from("customers")
        .select("id, full_name, phone")
        .eq("business_id", profile.business_id)
        .not("phone", "is", null)
        .limit(100);

      if (phoneMatch) {
        const match = phoneMatch.find(
          (c) => c.phone && normalizePhone(c.phone) === normalizedPhone
        );
        if (match) {
          return {
            isDuplicate: true,
            existingCustomerId: match.id,
            matchedOn: "phone",
            existingCustomerName: match.full_name,
          };
        }
      }
    }
  }

  // Check by email
  if (email) {
    const normalizedEmail = normalizeEmail(email);
    if (normalizedEmail.includes("@")) {
      const { data: emailMatch } = await supabase
        .from("customers")
        .select("id, full_name")
        .eq("business_id", profile.business_id)
        .ilike("email", normalizedEmail)
        .single();

      if (emailMatch) {
        return {
          isDuplicate: true,
          existingCustomerId: emailMatch.id,
          matchedOn: "email",
          existingCustomerName: emailMatch.full_name,
        };
      }
    }
  }

  // Check by address
  if (address && address.trim().length > 5) {
    const normalizedAddr = normalizeAddress(address);
    const { data: addressMatches } = await supabase
      .from("customers")
      .select("id, full_name, address")
      .eq("business_id", profile.business_id)
      .not("address", "is", null)
      .limit(200);

    if (addressMatches) {
      const match = addressMatches.find(
        (c) => c.address && normalizeAddress(c.address) === normalizedAddr
      );
      if (match) {
        return {
          isDuplicate: true,
          existingCustomerId: match.id,
          matchedOn: "address",
          existingCustomerName: match.full_name,
        };
      }
    }
  }

  // Check by exact name match (less reliable, warn but allow)
  if (fullName && fullName.trim().length > 2) {
    const { data: nameMatch } = await supabase
      .from("customers")
      .select("id, full_name")
      .eq("business_id", profile.business_id)
      .ilike("full_name", fullName.trim())
      .single();

    if (nameMatch) {
      return {
        isDuplicate: true,
        existingCustomerId: nameMatch.id,
        matchedOn: "name",
        existingCustomerName: nameMatch.full_name,
      };
    }
  }

  return { isDuplicate: false };
}

interface AddCustomerResult {
  success: boolean;
  customerId?: string;
  error?: string;
  isDuplicate?: boolean;
  existingCustomerId?: string;
  matchedOn?: string;
}

export async function addCustomerAction(
  fullName: string,
  phone: string | null,
  email: string | null,
  address: string | null,
  city: string | null,
  state: string | null,
  county: string | null,
  skipDuplicateCheck: boolean = false
): Promise<AddCustomerResult> {
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

  // Check for duplicates unless skipped
  if (!skipDuplicateCheck) {
    const duplicateCheck = await checkForDuplicateCustomer(
      phone,
      email,
      address,
      fullName
    );

    if (duplicateCheck.isDuplicate) {
      return {
        success: false,
        isDuplicate: true,
        existingCustomerId: duplicateCheck.existingCustomerId,
        matchedOn: duplicateCheck.matchedOn,
        error: `Customer already exists (matched by ${duplicateCheck.matchedOn}): ${duplicateCheck.existingCustomerName}`,
      };
    }
  }

  // Insert customer
  const { data: newCustomer, error } = await supabase
    .from("customers")
    .insert({
      full_name: fullName.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      city: city?.trim() || null,
      state: state || null,
      county: county?.trim() || null,
      business_id: profile.business_id,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error inserting customer:", error);
    return { success: false, error: error.message };
  }

  // Sync to network
  await syncCustomerToNetworkAction(phone, email, address);

  return { success: true, customerId: newCustomer?.id };
}
