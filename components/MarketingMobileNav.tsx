"use client";

import { useState } from "react";
import Link from "next/link";

export default function MarketingMobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-gray hover:text-white"
        aria-label="Toggle menu"
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

      {/* Mobile Menu Overlay */}
      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-deep-blue/95 backdrop-blur-sm">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
              <Link href="/" onClick={closeMenu} className="text-xl font-bold text-white">
                Customer Scorer
              </Link>
              <button
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-gray hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-6">
              <div className="space-y-2">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="block rounded-lg px-4 py-3 text-lg text-white hover:bg-slate-800"
                >
                  Home
                </Link>
                <Link
                  href="/how-it-works"
                  onClick={closeMenu}
                  className="block rounded-lg px-4 py-3 text-lg text-white hover:bg-slate-800"
                >
                  How It Works
                </Link>
                <Link
                  href="/features"
                  onClick={closeMenu}
                  className="block rounded-lg px-4 py-3 text-lg text-white hover:bg-slate-800"
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  onClick={closeMenu}
                  className="block rounded-lg px-4 py-3 text-lg text-white hover:bg-slate-800"
                >
                  Pricing
                </Link>
                <Link
                  href="/faq"
                  onClick={closeMenu}
                  className="block rounded-lg px-4 py-3 text-lg text-white hover:bg-slate-800"
                >
                  FAQ
                </Link>
                <Link
                  href="/blog"
                  onClick={closeMenu}
                  className="block rounded-lg px-4 py-3 text-lg text-white hover:bg-slate-800"
                >
                  Blog
                </Link>
              </div>
            </nav>

            {/* Auth Buttons */}
            <div className="border-t border-slate-800 px-4 py-6">
              <div className="space-y-3">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block rounded-lg border border-slate-700 px-4 py-3 text-center text-white hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="block rounded-lg bg-forsure-blue px-4 py-3 text-center font-semibold text-white hover:bg-forsure-blue/90"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}