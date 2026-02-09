import Link from "next/link";
import MarketingMobileNav from "./MarketingMobileNav";

export default function MarketingHeader() {
  return (
    <header className="relative z-50 border-b border-border bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="4" width="40" height="9" rx="3" fill="#1c1c1c"/>
            <rect x="4" y="19.5" width="28" height="9" rx="3" fill="#c47d4e"/>
            <rect x="4" y="35" width="16" height="9" rx="3" fill="#1c1c1c"/>
          </svg>
          <span className="text-xl font-bold text-charcoal tracking-tight">For<span className="text-copper">Sure</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/how-it-works" className="text-sm text-text-secondary hover:text-charcoal">
            How It Works
          </Link>
          <Link href="/features" className="text-sm text-text-secondary hover:text-charcoal">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-text-secondary hover:text-charcoal">
            Pricing
          </Link>
          <Link href="/faq" className="text-sm text-text-secondary hover:text-charcoal">
            FAQ
          </Link>
          <Link href="/blog" className="text-sm text-text-secondary hover:text-charcoal">
            Blog
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login" className="text-sm text-text-secondary hover:text-charcoal">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-copper px-4 py-2 text-sm font-semibold text-white hover:bg-copper-dark"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile Nav */}
        <MarketingMobileNav />
      </div>
    </header>
  );
}
