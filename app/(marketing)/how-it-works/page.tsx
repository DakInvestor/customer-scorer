import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-charcoal md:text-5xl">
            How ForSure Works
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Get started in minutes. Find leads, check customers, and protect your business.
          </p>
        </div>
      </section>

      {/* Getting Started Steps */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-charcoal">
            Getting Started
          </h2>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <div className="flex h-48 w-full items-center justify-center rounded-2xl border border-border bg-white md:w-1/2">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-copper/20">
                    <span className="text-2xl font-bold text-copper">1</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl">❄️</span>
                    <span className="text-3xl">🔧</span>
                    <span className="text-3xl">⚡</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-charcoal">Select Your Industry</h3>
                <p className="mt-3 text-text-secondary">
                  Sign up and choose your industry — HVAC, plumbing, electrical, roofing, or
                  20+ other trades. This unlocks specialized tools designed for how you find
                  and manage customers.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Industry-specific lead tools
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Relevant property filters
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Tailored dashboard
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-8 md:flex-row-reverse">
              <div className="flex h-48 w-full items-center justify-center rounded-2xl border border-border bg-white md:w-1/2">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-copper/20">
                    <span className="text-2xl font-bold text-copper">2</span>
                  </div>
                  <div className="text-2xl">🗺️</div>
                  <p className="mt-2 text-sm text-text-muted">Maricopa, Pima, Pinal...</p>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-charcoal">Set Your Service Area</h3>
                <p className="mt-3 text-text-secondary">
                  Select the counties where you work. This configures your property intelligence
                  feed to show new homeowners, permits, and sales in your area only.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Local property data
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    New homeowner alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Permit activity feed
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <div className="flex h-48 w-full items-center justify-center rounded-2xl border border-border bg-white md:w-1/2">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-copper/20">
                    <span className="text-2xl font-bold text-copper">3</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="rounded-full bg-emerald/20 px-3 py-1 text-sm font-medium text-emerald">
                      ✓ Verified
                    </span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-charcoal">Get Verified</h3>
                <p className="mt-3 text-text-secondary">
                  Verify your business to unlock network search and reporting. We check that
                  you're a real contractor to keep the network trustworthy and spam-free.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Quick verification process
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Unlock network search
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Report events to help others
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Using ForSure */}
      <section className="border-t border-border bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-charcoal">
            Using ForSure Daily
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Find Leads */}
            <div className="rounded-2xl border border-border bg-cream p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald/20">
                <span className="text-xl">🏠</span>
              </div>
              <h3 className="text-xl font-bold text-charcoal">Find New Leads</h3>
              <p className="mt-3 text-text-secondary">
                Check your New Homeowners feed daily. See who just bought a home in your
                service area — they often need services within 90 days.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                <li>• View recent sales</li>
                <li>• See property details</li>
                <li>• Filter by property type</li>
                <li>• Check permit history</li>
              </ul>
            </div>

            {/* Check Customers */}
            <div className="rounded-2xl border border-border bg-cream p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-copper/20">
                <span className="text-xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-charcoal">Check Customers</h3>
              <p className="mt-3 text-text-secondary">
                Before booking a job, search the network. See if the customer has reliability
                issues reported by other verified contractors.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                <li>• Search by phone</li>
                <li>• Search by address</li>
                <li>• See report history</li>
                <li>• Make informed decisions</li>
              </ul>
            </div>

            {/* Track & Report */}
            <div className="rounded-2xl border border-border bg-cream p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber/20">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-charcoal">Track & Report</h3>
              <p className="mt-3 text-text-secondary">
                Log events as they happen. Track your own customers' reliability and report
                to the network to help other contractors.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                <li>• Log no-shows</li>
                <li>• Track payments</li>
                <li>• Report to network</li>
                <li>• See reliability trends</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reliability Scoring */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-charcoal">
            Understanding Reliability
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-text-secondary">
            Every customer gets a reliability indicator based on their history with your business.
          </p>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-xl border border-border bg-white p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald text-xl text-white">
                ✓
              </div>
              <h3 className="font-semibold text-charcoal">Excellent</h3>
              <p className="mt-1 text-sm text-text-secondary">90-100</p>
              <p className="mt-2 text-sm text-text-muted">
                No issues. Prioritize these customers.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald/70 text-xl text-white">
                ✓
              </div>
              <h3 className="font-semibold text-charcoal">Good</h3>
              <p className="mt-1 text-sm text-text-secondary">75-89</p>
              <p className="mt-2 text-sm text-text-muted">
                Minor issues only. Generally reliable.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber text-xl text-white">
                !
              </div>
              <h3 className="font-semibold text-charcoal">Fair</h3>
              <p className="mt-1 text-sm text-text-secondary">60-74</p>
              <p className="mt-2 text-sm text-text-muted">
                Some concerns. Consider requiring deposit.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-critical text-xl text-white">
                ✕
              </div>
              <h3 className="font-semibold text-charcoal">At Risk</h3>
              <p className="mt-1 text-sm text-text-secondary">Below 60</p>
              <p className="mt-2 text-sm text-text-muted">
                Multiple issues. Require deposit or decline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-charcoal">Ready to get started?</h2>
          <p className="mt-4 text-text-secondary">
            Sign up free and start finding leads and checking customers today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-lg bg-copper px-8 py-3 font-semibold text-white hover:bg-copper-dark"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-border px-8 py-3 font-semibold text-charcoal hover:bg-surface"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
