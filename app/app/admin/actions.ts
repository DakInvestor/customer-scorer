"use server";

import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveVerification(profileId: string, notes?: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const supabase = await createSupabaseServerClient();

  // Check if current user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_admin) {
    return { error: "Not authorized" };
  }

  // Update the target profile
  const { error } = await supabase
    .from("profiles")
    .update({
      verification_status: "verified",
      verification_reviewed_at: new Date().toISOString(),
      verification_notes: notes || null,
    })
    .eq("id", profileId);

  if (error) {
    console.error("Error approving verification:", error);
    return { error: "Failed to approve verification" };
  }

  revalidatePath("/app/admin");
  return { success: true };
}

export async function rejectVerification(profileId: string, notes?: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const supabase = await createSupabaseServerClient();

  // Check if current user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_admin) {
    return { error: "Not authorized" };
  }

  // Update the target profile
  const { error } = await supabase
    .from("profiles")
    .update({
      verification_status: "rejected",
      verification_reviewed_at: new Date().toISOString(),
      verification_notes: notes || null,
    })
    .eq("id", profileId);

  if (error) {
    console.error("Error rejecting verification:", error);
    return { error: "Failed to reject verification" };
  }

  revalidatePath("/app/admin");
  return { success: true };
}
