import { redirect } from "next/navigation";
import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/server";
import AdminVerificationList from "@/components/AdminVerificationList";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_admin) {
    redirect("/app");
  }

  // Get pending verifications
  const { data: pendingProfiles } = await supabase
    .from("profiles")
    .select("id, verification_status, verification_submitted_at")
    .eq("verification_status", "pending")
    .order("verification_submitted_at", { ascending: true });

  // Get business details for each pending profile
  const pendingBusinesses = [];

  if (pendingProfiles && pendingProfiles.length > 0) {
    for (let i = 0; i < pendingProfiles.length; i++) {
      const prof = pendingProfiles[i];

      const { data: business } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_user_id", prof.id)
        .single();

      if (business) {
        const { data: docs } = await supabase
          .from("verification_documents")
          .select("*")
          .eq("business_id", business.id);

        pendingBusinesses.push({
          id: prof.id,
          verification_status: prof.verification_status,
          verification_submitted_at: prof.verification_submitted_at,
          business: business,
          documents: docs || [],
        });
      }
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal md:text-3xl">Admin Panel</h1>
        <p className="mt-1 text-text-secondary">Review business verification requests.</p>
      </div>

      <div className="rounded-xl border border-border bg-white">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-charcoal">
            Pending Verifications ({pendingBusinesses.length})
          </h2>
        </div>

        {pendingBusinesses.length === 0 ? (
          <div className="p-6 text-center text-text-secondary">
            No pending verification requests.
          </div>
        ) : (
          <AdminVerificationList businesses={pendingBusinesses} />
        )}
      </div>
    </div>
  );
}
