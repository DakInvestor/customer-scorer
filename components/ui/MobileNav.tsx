"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  email: string;
  verificationStatus?: "unverified" | "pending" | "verified" | "rejected";
  isAdmin?: boolean;
};

export default function MobileNav({ email, verificationStatus = "unverified", isAdmin = false }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-charcoal-light bg-charcoal px-4 md:hidden">
        <Link href="/app" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="4" width="40" height="9" rx="3" fill="#ffffff"/>
            <rect x="4" y="19.5" width="28" height="9" rx="3" fill="#c47d4e"/>
            <rect x="4" y="35" width="16" height="9" rx="3" fill="#ffffff"/>
          </svg>
          <span className="text-lg font-bold text-white tracking-tight">For<span className="text-copper">Sure</span></span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-charcoal-light"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={closeMenu} />

          <div className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-charcoal">
            {/* Menu Header */}
            <div className="flex h-16 items-center justify-between border-b border-charcoal-light px-4">
              <span className="text-sm font-semibold text-white">Menu</span>
              <button
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-charcoal-light"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Network</p>
              <MobileNavItem href="/app/network" onClick={closeMenu}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Network Search
              </MobileNavItem>
              <MobileNavItem href="/app/network/report" onClick={closeMenu}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Report Event
              </MobileNavItem>

              <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Overview</p>
              <MobileNavItem href="/app" onClick={closeMenu}>Dashboard</MobileNavItem>
              <MobileNavItem href="/app/analytics" onClick={closeMenu}>Analytics</MobileNavItem>

              <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Property Intel</p>
              <MobileNavItem href="/app/leads" onClick={closeMenu}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                New Homeowners
              </MobileNavItem>

              <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Customers</p>
              <MobileNavItem href="/app/customers" onClick={closeMenu}>Customer List</MobileNavItem>
              <MobileNavItem href="/app/add-customer" onClick={closeMenu}>Add Customer</MobileNavItem>
              <MobileNavItem href="/app/search" onClick={closeMenu}>Search</MobileNavItem>
              <MobileNavItem href="/app/import" onClick={closeMenu}>Import CSV</MobileNavItem>

              <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Resources</p>
              <MobileNavItem href="/app/reliability-info" onClick={closeMenu}>How It Works</MobileNavItem>

              {isAdmin && (
                <>
                  <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Admin</p>
                  <MobileNavItem href="/app/admin" onClick={closeMenu}>Review Verifications</MobileNavItem>
                  <MobileNavItem href="/app/admin/property-sync" onClick={closeMenu}>Property Sync</MobileNavItem>
                </>
              )}

              <div className="my-4 border-t border-charcoal-light" />

              <MobileNavItem href="/app/verify" onClick={closeMenu}>
                <span className="flex items-center gap-2">
                  Verification
                  {verificationStatus === "verified" ? (
                    <span className="rounded-full bg-emerald/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald">✓</span>
                  ) : verificationStatus === "pending" ? (
                    <span className="rounded-full bg-amber/20 px-1.5 py-0.5 text-[10px] font-medium text-amber">Pending</span>
                  ) : (
                    <span className="rounded-full bg-critical/20 px-1.5 py-0.5 text-[10px] font-medium text-critical">Required</span>
                  )}
                </span>
              </MobileNavItem>
              <MobileNavItem href="/app/settings" onClick={closeMenu}>Settings</MobileNavItem>
            </nav>

            {/* User Footer */}
            <div className="border-t border-charcoal-light p-4">
              <p className="mb-3 truncate text-xs text-text-muted">{email}</p>
              <button
                onClick={handleLogout}
                className="w-full rounded-lg bg-charcoal-light px-4 py-3 text-sm font-medium text-white hover:bg-copper/20"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MobileNavItem({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-gray-300 hover:bg-copper/10 hover:text-white"
    >
      {children}
    </Link>
  );
}