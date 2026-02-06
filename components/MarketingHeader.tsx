import Link from "next/link";
import MarketingMobileNav from "./MarketingMobileNav";

export default function MarketingHeader() {
  return (
    <header className="border-b border-slate-800 bg-deep-blue/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white">
          Customer Scorer
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/how-it-works" className="text-sm text-slate-gray hover:text-white">
            How It Works
          </Link>
          <Link href="/features" className="text-sm text-slate-gray hover:text-white">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-slate-gray hover:text-white">
            Pricing
          </Link>
          <Link href="/faq" className="text-sm text-slate-gray hover:text-white">
            FAQ
          </Link>
          <Link href="/blog" className="text-sm text-slate-gray hover:text-white">
            Blog
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login" className="text-sm text-slate-gray hover:text-white">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-forsure-blue px-4 py-2 text-sm font-semibold text-white hover:bg-forsure-blue/90"
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