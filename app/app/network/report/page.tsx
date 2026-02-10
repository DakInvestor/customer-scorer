import { redirect } from "next/navigation";
import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/server";
import VerificationRequired from "@/components/VerificationRequired";
import ReportEventClient from "./ReportEventClient";

export default async function ReportEventPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("verification_status, business_id")
    .eq("id", user.id)
    .single();

  const verificationStatus = profile?.verification_status || "unverified";
  const businessId = profile?.business_id || null;

  if (verificationStatus !== "verified") {
    return <VerificationRequired feature="Network Reporting" />;
  }

  if (!businessId) {
    redirect("/app");
  }

  return <ReportEventClient businessId={businessId} />;
}
