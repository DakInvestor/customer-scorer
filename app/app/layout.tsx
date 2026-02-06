import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, createSupabaseServerClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/logoutbutton";
import MobileNav from "@/components/ui/MobileNav";
import VerificationBanner from "@/components/VerificationBanner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("verification_status, is_admin")
    .eq("id", user.id)
    .single();

  const verificationStatus = (profile?.verification_status || "unverified") as
    | "unverified"
    | "pending"
    | "verified"
    | "rejected";

  const isAdmin = profile?.is_admin || false;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-[#080d19] md:flex">
        <div className="border-b border-slate-800 px-5 py-5">
          <Link href="/app" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forsure-blue">
              <span className="text-sm font-bold text-white">CS</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">Customer Scorer</h1>
              <p className="text-xs text-slate-gray">Reliability tracking</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-gray">
            Network
          </div>
          <div className="space-y-1">
            <NavItem href="/app/network">
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Network Search
              </span>
            </NavItem>
            <NavItem href="/app/network/report">
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Report Event
              </span>
            </NavItem>
          </div>

          <div className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-gray">
            Overview
          </div>
          <div className="space-y-1">
            <NavItem href="/app">Dashboard</NavItem>
            <NavItem href="/app/analytics">Analytics</NavItem>
          </div>

          <div className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-gray">
            Customers
          </div>
          <div className="space-y-1">
            <NavItem href="/app/customers">Customer List</NavItem>
            <NavItem href="/app/add-customer">Add Customer</NavItem>
            <NavItem href="/app/search">Search</NavItem>
            <NavItem href="/app/import">Import CSV</NavItem>
          </div>

          <div className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-gray">
            Resources
          </div>
          <div className="space-y-1">
            <NavItem href="/app/scoring-info">How Scoring Works</NavItem>
          </div>

          {isAdmin && (
            <>
              <div className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-gray">
                Admin
              </div>
              <div className="space-y-1">
                <NavItem href="/app/admin">Review Verifications</NavItem>
              </div>
            </>
          )}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <NavItem href="/app/verify">
            <span className="flex items-center gap-2">
              Verification
              {verificationStatus === "verified" ? (
                <span className="rounded-full bg-emerald/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald">
                  ✓
                </span>
              ) : verificationStatus === "pending" ? (
                <span className="rounded-full bg-amber/20 px-1.5 py-0.5 text-[10px] font-medium text-amber">
                  Pending
                </span>
              ) : (
                <span className="rounded-full bg-critical/20 px-1.5 py-0.5 text-[10px] font-medium text-critical">
                  Required
                </span>
              )}
            </span>
          </NavItem>
          <NavItem href="/app/settings">Settings</NavItem>
          <div className="mt-3 rounded-lg bg-deep-navy p-3">
            <p className="truncate text-xs text-slate-gray">{user.email}</p>
            <div className="mt-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      <MobileNav email={user.email || ""} />

      <div className="flex flex-1 flex-col">
        <VerificationBanner status={verificationStatus} />
        <main className="flex-1 overflow-auto bg-deep-navy pt-16 md:pt-0">{children}</main>
      </div>
    </div>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-lg px-3 py-2 text-sm text-slate-gray transition-colors hover:bg-forsure-blue/10 hover:text-white"
    >
      {children}
    </Link>
  );
}