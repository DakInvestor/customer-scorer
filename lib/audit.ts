// lib/audit.ts
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type AuditAction =
  | "VIEWED_PROFILE"
  | "CREATED_CUSTOMER"
  | "UPDATED_CUSTOMER"
  | "DELETED_CUSTOMER"
  | "CREATED_EVENT"
  | "DELETED_EVENT"
  | "EXPORTED_DATA"
  | "SEARCHED_CUSTOMERS";

export async function logAuditEvent(
  businessId: string,
  action: AuditAction,
  customerId?: string,
  metadata?: Record<string, unknown>
) {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("audit_logs").insert({
      business_id: businessId,
      customer_id: customerId || null,
      user_id: user?.id || null,
      action,
      metadata: metadata || null,
    });
  } catch (error) {
    console.error("Failed to log audit event:", error);
    // Don't throw - audit logging should not break the app
  }
}