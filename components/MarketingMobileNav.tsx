"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

export default function MarketingMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function closeMenu() {
    setIsOpen(false);
  }

  const overlay = (
    <div className="fixed inset-0 z-[9999] bg-white">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="9" rx="3" fill="#1c1c1c"/>
              <rect x="4" y="19.5" width="28" height="9" rx="3" fill="#c47d4e"/>
              <rect x="4" y="35" width="16" height="9" rx="3" fill="#1c1c1c"/>
            </svg>
            <span className="text-xl font-bold text-charcoal tracking-tight">For<span className="text-copper">Sure</span></span>
          </Link>
          <button
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary hover:text-charcoal"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 text-lg text-charcoal hover:bg-surface"
            >
              Home
            </Link>
            <Link
              href="/how-it-works"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 text-lg text-charcoal hover:bg-surface"
            >
              How It Works
            </Link>
            <Link
              href="/features"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 text-lg text-charcoal hover:bg-surface"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 text-lg text-charcoal hover:bg-surface"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 text-lg text-charcoal hover:bg-surface"
            >
              FAQ
            </Link>
            <Link
              href="/blog"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 text-lg text-charcoal hover:bg-surface"
            >
              Blog
            </Link>
          </div>
        </nav>

        {/* Auth Buttons */}
        <div className="border-t border-border px-4 py-6">
          <div className="space-y-3">
            <Link
              href="/login"
              onClick={closeMenu}
              className="block rounded-lg border border-border px-4 py-3 text-center text-charcoal hover:bg-surface"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={closeMenu}
              className="block rounded-lg bg-copper px-4 py-3 text-center font-semibold text-white hover:bg-copper-dark"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary hover:text-charcoal"
        aria-label="Open menu"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Render overlay via portal to escape stacking context */}
      {mounted && isOpen && createPortal(overlay, document.body)}
    </div>
  );
}
