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
            Start protecting your business in under 5 minutes. No complicated setup, no learning curve.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <div className="flex h-48 w-full items-center justify-center rounded-2xl border border-border bg-white md:w-1/2">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-copper/20">
                    <span className="text-2xl font-bold text-copper">1</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald"></div>
                    <div className="h-3 w-3 rounded-full bg-amber"></div>
                    <div className="h-3 w-3 rounded-full bg-critical"></div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-charcoal">Add Your Customers</h3>
                <p className="mt-3 text-text-secondary">
                  Import your existing customer list via CSV or add them one by one.
                  We automatically create a profile for each customer and start tracking their history.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Bulk import from CSV
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Add customers manually
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Search existing customers before adding
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
                  <div className="space-y-1">
                    <div className="mx-auto h-2 w-32 rounded bg-border"></div>
                    <div className="mx-auto h-2 w-24 rounded bg-emerald/50"></div>
                    <div className="mx-auto h-2 w-28 rounded bg-amber/50"></div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-charcoal">Log Events &amp; Interactions</h3>
                <p className="mt-3 text-text-secondary">
                  Record what happens with each customer — late payments, no-shows, disputes,
                  or positive events like referrals and on-time payments. Each event affects their score.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Track payment history
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Log no-shows and cancellations
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Record positive behaviors too
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
                  <div className="flex items-center justify-center gap-4">
                    <div className="rounded-lg bg-emerald/20 px-3 py-1 text-sm font-medium text-emerald">85</div>
                    <div className="rounded-lg bg-amber/20 px-3 py-1 text-sm font-medium text-amber">62</div>
                    <div className="rounded-lg bg-critical/20 px-3 py-1 text-sm font-medium text-critical">34</div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-charcoal">See Reliability Scores</h3>
                <p className="mt-3 text-text-secondary">
                  Our algorithm calculates a reliability score from 0-100 based on their history.
                  Green means reliable, yellow means caution, red means high risk.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    70-100: Reliable customer
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    40-69: Proceed with caution
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-critical" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    0-39: High risk — require deposit
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center gap-8 md:flex-row-reverse">
              <div className="flex h-48 w-full items-center justify-center rounded-2xl border border-border bg-white md:w-1/2">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-copper/20">
                    <span className="text-2xl font-bold text-copper">4</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald">$$$</div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-charcoal">Make Smarter Decisions</h3>
                <p className="mt-3 text-text-secondary">
                  Before accepting a job, check their score. Require deposits from risky customers,
                  prioritize your best clients, and stop losing money on no-shows.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Require deposits from high-risk customers
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Prioritize reliable customers
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Reduce no-shows and late payments
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-charcoal">Ready to protect your business?</h2>
          <p className="mt-4 text-text-secondary">
            Start for free. No credit card required.
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
