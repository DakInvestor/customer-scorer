"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  email: string;
};

export default function MobileNav({ email }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-charcoal-light bg-charcoal px-4 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="4" width="40" height="9" rx="3" fill="#ffffff"/>
            <rect x="4" y="19.5" width="28" height="9" rx="3" fill="#c47d4e"/>
            <rect x="4" y="35" width="16" height="9" rx="3" fill="#ffffff"/>
          </svg>
          <span className="text-xl font-bold text-white tracking-tight">For<span className="text-copper">Sure</span></span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-md p-2 hover:bg-charcoal-light"
        >
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 top-0 h-full w-72 bg-charcoal p-4">
            <div className="mb-6 flex justify-between">
              <span className="text-sm font-semibold text-white">Menu</span>
              <button onClick={() => setIsOpen(false)} className="rounded-md p-1 hover:bg-charcoal-light">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="space-y-1">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-300">Overview</p>
              <MobileNavItem href="/" onClick={() => setIsOpen(false)}>Dashboard</MobileNavItem>
              <MobileNavItem href="/analytics" onClick={() => setIsOpen(false)}>Analytics</MobileNavItem>

              <p className="mb-2 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-300">Customers</p>
              <MobileNavItem href="/customers" onClick={() => setIsOpen(false)}>Customer List</MobileNavItem>
              <MobileNavItem href="/add-customer" onClick={() => setIsOpen(false)}>Add Customer</MobileNavItem>
              <MobileNavItem href="/search" onClick={() => setIsOpen(false)}>Search</MobileNavItem>
              <MobileNavItem href="/import" onClick={() => setIsOpen(false)}>Import CSV</MobileNavItem>

              <p className="mb-2 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-300">Resources</p>
              <MobileNavItem href="/reliability-info" onClick={() => setIsOpen(false)}>How It Works</MobileNavItem>
              
              <div className="my-4 border-t border-charcoal-light" />
              <MobileNavItem href="/settings" onClick={() => setIsOpen(false)}>Settings</MobileNavItem>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 border-t border-charcoal-light p-4">
              <p className="mb-2 truncate text-xs text-gray-300">{email}</p>
              <button
                onClick={handleLogout}
                className="w-full rounded-md bg-charcoal-light px-4 py-2 text-sm font-medium hover:bg-copper/10 hover:text-white"
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
      className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-copper/10 hover:text-white"
    >
      {children}
    </Link>
  );
}