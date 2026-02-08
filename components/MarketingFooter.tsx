import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="4" width="40" height="9" rx="3" fill="#1c1c1c"/>
                <rect x="4" y="19.5" width="28" height="9" rx="3" fill="#c47d4e"/>
                <rect x="4" y="35" width="16" height="9" rx="3" fill="#1c1c1c"/>
              </svg>
              <span className="text-xl font-bold text-charcoal tracking-tight">For<span className="text-copper">Sure</span></span>
            </Link>
            <p className="mt-4 text-sm text-text-secondary">
              Stop losing money on unreliable customers. Track customer history and make smarter business decisions.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/how-it-works" className="text-sm text-text-secondary hover:text-charcoal">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-sm text-text-secondary hover:text-charcoal">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-text-secondary hover:text-charcoal">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-text-secondary hover:text-charcoal">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-sm text-text-secondary hover:text-charcoal">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/blog/reliability-tracking-101" className="text-sm text-text-secondary hover:text-charcoal">
                  Reliability Guide
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-handle-no-show-customers" className="text-sm text-text-secondary hover:text-charcoal">
                  Handling No-Shows
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-text-secondary hover:text-charcoal">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-text-secondary hover:text-charcoal">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:support@myforsure.com" className="text-sm text-text-secondary hover:text-charcoal">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* FCRA Disclaimer */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-xs text-text-muted max-w-2xl text-center mx-auto">
            ForSure is a business management tool for tracking your own customer interactions.
            ForSure is not a consumer reporting agency and does not provide consumer reports
            as defined by the Fair Credit Reporting Act (FCRA). Information provided through
            ForSure should not be used for credit, employment, insurance, or housing decisions.
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-6 flex flex-col items-center justify-between border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-text-muted">
            © 2024 ForSure. All rights reserved.
          </p>
          <div className="mt-4 flex gap-6 md:mt-0">
            <a href="#" className="text-text-muted hover:text-charcoal" aria-label="Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-text-muted hover:text-charcoal" aria-label="LinkedIn">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
