import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-copper/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-copper">
              Property Intelligence + Customer Reliability
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-charcoal sm:text-6xl">
              Find better leads.{" "}
              <span className="text-copper">Avoid bad customers.</span>
            </h1>
            <p className="mt-6 text-lg text-text-secondary">
              ForSure combines property data, permit records, and a verified contractor network
              to help you find new homeowners, identify high-value leads, and check customer
              reliability before you book.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="w-full rounded-lg bg-copper px-8 py-4 text-center font-semibold text-white hover:bg-copper-dark sm:w-auto"
              >
                Get Started Free
              </Link>
              <Link
                href="/features"
                className="w-full rounded-lg border border-border bg-white px-8 py-4 text-center font-semibold text-charcoal hover:bg-surface sm:w-auto"
              >
                See All Features
              </Link>
            </div>
            <p className="mt-4 text-sm text-text-secondary">
              No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-charcoal">
              Everything you need to grow smarter
            </h2>
            <p className="mt-4 text-text-secondary">
              Three powerful tools working together to help you find, vet, and win better customers.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Property Intel */}
            <div className="rounded-xl border border-border bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald/10">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal">Property Intelligence</h3>
              <p className="mt-2 text-text-secondary">
                Access property records, recent sales, permit history, and ownership data
                for your entire service area.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> New homeowner alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Permit activity feed
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Property age & value data
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Sale history & trends
                </li>
              </ul>
            </div>

            {/* Network Search */}
            <div className="rounded-xl border-2 border-copper bg-white p-6">
              <div className="mb-2 inline-block rounded-full bg-copper/10 px-2 py-0.5 text-xs font-medium text-copper">
                Most Popular
              </div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-copper/10">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal">Network Search</h3>
              <p className="mt-2 text-text-secondary">
                Search our verified contractor network to see if a customer has reliability
                issues reported by other businesses.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Search by phone or address
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Anonymized reports
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> See event patterns
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Verified businesses only
                </li>
              </ul>
            </div>

            {/* Reliability Tracking */}
            <div className="rounded-xl border border-border bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber/10">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal">Reliability Tracking</h3>
              <p className="mt-2 text-text-secondary">
                Track your own customers' reliability over time. Log events, see trends,
                and identify who's worth prioritizing.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Reliability indicators
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Event history logging
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Trend analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Risk alerts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* New Homeowner Leads */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-copper">
                Property Intelligence
              </p>
              <h2 className="mt-2 text-3xl font-bold text-charcoal">
                New homeowners need your services
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                Get notified when homes sell in your service area. New homeowners often need
                HVAC inspections, plumbing checks, electrical updates, and more within their
                first 90 days.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald text-xs text-white">✓</span>
                  <span className="text-text-secondary">Daily feed of recent home sales in your counties</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald text-xs text-white">✓</span>
                  <span className="text-text-secondary">Property details: age, size, features, sale price</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald text-xs text-white">✓</span>
                  <span className="text-text-secondary">Filter by property type, price range, and more</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald text-xs text-white">✓</span>
                  <span className="text-text-secondary">Permit history shows what work has been done</span>
                </li>
              </ul>
            </div>

            {/* Mockup */}
            <div className="rounded-xl border border-border bg-white p-4 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-charcoal">New Homeowners This Week</h3>
                <span className="rounded-full bg-emerald/10 px-2 py-0.5 text-xs font-medium text-emerald">
                  12 new leads
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { address: "1234 Oak Street", city: "Phoenix", price: "$425,000", age: "1985", days: "2 days ago" },
                  { address: "567 Maple Ave", city: "Scottsdale", price: "$680,000", age: "2001", days: "3 days ago" },
                  { address: "890 Pine Road", city: "Mesa", price: "$340,000", age: "1978", days: "5 days ago" },
                ].map((lead, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-cream p-3">
                    <div>
                      <p className="font-medium text-charcoal">{lead.address}</p>
                      <p className="text-xs text-text-muted">{lead.city} • Built {lead.age}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-charcoal">{lead.price}</p>
                      <p className="text-xs text-text-muted">{lead.days}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Search */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Mockup */}
            <div className="order-2 lg:order-1">
              <div className="rounded-xl border border-border bg-white p-4 shadow-lg">
                <div className="mb-4">
                  <p className="text-sm text-text-muted">Network Search</p>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="(555) 123-4567"
                      className="flex-1 rounded-lg border border-border bg-cream px-3 py-2 text-sm"
                      disabled
                    />
                    <button className="rounded-lg bg-copper px-4 py-2 text-sm font-medium text-white">
                      Search
                    </button>
                  </div>
                </div>
                <div className="rounded-lg border border-amber/30 bg-amber/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="font-medium text-charcoal">2 reports found</p>
                      <p className="mt-1 text-sm text-text-secondary">
                        This phone number has been reported by 2 verified businesses
                        in the network.
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="rounded bg-critical/10 px-1.5 py-0.5 text-xs text-critical">Payment Issue</span>
                          <span className="text-text-muted">• 3 months ago</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="rounded bg-amber/10 px-1.5 py-0.5 text-xs text-amber">No-show</span>
                          <span className="text-text-muted">• 8 months ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-copper">
                Network Search
              </p>
              <h2 className="mt-2 text-3xl font-bold text-charcoal">
                Check before you book
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                Search our network of verified contractors to see if a customer has
                reliability issues. Anonymized reports from real businesses help you
                avoid no-shows, payment problems, and headaches.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald text-xs text-white">✓</span>
                  <span className="text-text-secondary">Search by phone number or property address</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald text-xs text-white">✓</span>
                  <span className="text-text-secondary">See report types and timeframes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald text-xs text-white">✓</span>
                  <span className="text-text-secondary">All data is anonymized — privacy protected</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald text-xs text-white">✓</span>
                  <span className="text-text-secondary">Only verified businesses can report</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Tools */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-charcoal">
              Tools built for your industry
            </h2>
            <p className="mt-4 text-text-secondary">
              Select your industry during signup and get specialized tools designed
              for how you find and manage customers.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "❄️", name: "HVAC", tools: ["Aging system finder", "Warranty expiration leads", "Seasonal prep lists"] },
              { icon: "🔧", name: "Plumbing", tools: ["Water heater age alerts", "Sewer line prospects", "New construction leads"] },
              { icon: "⚡", name: "Electrical", tools: ["Panel upgrade prospects", "Solar pre-wire leads", "Permit activity feed"] },
              { icon: "🏠", name: "Roofing", tools: ["Roof age calculator", "Storm damage prospecting", "Insurance claim helper"] },
              { icon: "🏗️", name: "General Contractor", tools: ["Renovation candidates", "Flip tracker", "Permit benchmarking"] },
              { icon: "🔑", name: "Realtor", tools: ["Comparable sales", "Off-market finder", "Neighborhood reports"] },
              { icon: "🔍", name: "Home Inspector", tools: ["Pre-inspection briefs", "Repeat investor tracker", "Red flag alerts"] },
              { icon: "🌿", name: "Landscaping", tools: ["Lot size leads", "High-value properties", "Seasonal push lists"] },
            ].map((industry) => (
              <div key={industry.name} className="rounded-xl border border-border bg-white p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">{industry.icon}</span>
                  <h3 className="font-semibold text-charcoal">{industry.name}</h3>
                </div>
                <ul className="space-y-1 text-sm text-text-secondary">
                  {industry.tools.map((tool, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <span className="text-copper">•</span> {tool}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-text-muted">
            + 15 more industries supported including pest control, cleaning, solar, pool service, and more
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-charcoal">Get started in minutes</h2>
            <p className="mt-4 text-text-secondary">
              No complicated setup. Just sign up and start using ForSure right away.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-copper text-xl font-bold text-white">
                1
              </div>
              <h3 className="text-lg font-semibold text-charcoal">Create account</h3>
              <p className="mt-2 text-sm text-text-secondary">
                Sign up and select your industry to unlock specialized tools.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-copper text-xl font-bold text-white">
                2
              </div>
              <h3 className="text-lg font-semibold text-charcoal">Set service area</h3>
              <p className="mt-2 text-sm text-text-secondary">
                Choose your counties to see property data and leads for your area.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-copper text-xl font-bold text-white">
                3
              </div>
              <h3 className="text-lg font-semibold text-charcoal">Get verified</h3>
              <p className="mt-2 text-sm text-text-secondary">
                Verify your business to unlock network search and reporting.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-copper text-xl font-bold text-white">
                4
              </div>
              <h3 className="text-lg font-semibold text-charcoal">Start growing</h3>
              <p className="mt-2 text-sm text-text-secondary">
                Find new leads, check customers, and protect your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-charcoal">
              Trusted by contractors
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-6">
              <div className="mb-4 flex text-amber">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <p className="text-text-secondary">
                "The new homeowner feed alone pays for itself. Got 3 HVAC inspections
                last month from people who just moved in."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-sm font-bold text-charcoal">
                  MR
                </div>
                <div>
                  <p className="font-medium text-charcoal">Mike Rodriguez</p>
                  <p className="text-sm text-text-secondary">Rodriguez HVAC, Phoenix</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white p-6">
              <div className="mb-4 flex text-amber">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <p className="text-text-secondary">
                "Checked a customer on the network search — found 2 payment issues from
                other contractors. Saved me from a $4,000 headache."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-sm font-bold text-charcoal">
                  ST
                </div>
                <div>
                  <p className="font-medium text-charcoal">Sarah Thompson</p>
                  <p className="text-sm text-text-secondary">Thompson Plumbing, Austin</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white p-6">
              <div className="mb-4 flex text-amber">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <p className="text-text-secondary">
                "Love having property data right there. I can see permit history before
                I even show up. Makes me look prepared."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-sm font-bold text-charcoal">
                  JB
                </div>
                <div>
                  <p className="font-medium text-charcoal">James Baker</p>
                  <p className="text-sm text-text-secondary">Baker Electric, Denver</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data & Privacy */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-charcoal">
                Privacy & data you can trust
              </h2>
              <p className="mt-4 text-text-secondary">
                ForSure is designed with privacy at its core.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-white p-6">
                <h3 className="font-semibold text-charcoal">Is this a credit score?</h3>
                <p className="mt-2 text-text-secondary">
                  No. ForSure tracks business reliability, not consumer credit.
                  We don't pull credit reports or report to credit bureaus.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-white p-6">
                <h3 className="font-semibold text-charcoal">How is network data anonymized?</h3>
                <p className="mt-2 text-text-secondary">
                  Reports show event types and dates only. No names, business details,
                  or identifying information is shared between businesses.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-white p-6">
                <h3 className="font-semibold text-charcoal">Where does property data come from?</h3>
                <p className="mt-2 text-text-secondary">
                  We aggregate public records including county assessor data,
                  recorded sales, and building permits — all publicly available.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-white p-6">
                <h3 className="font-semibold text-charcoal">Who can report to the network?</h3>
                <p className="mt-2 text-text-secondary">
                  Only verified businesses. We check each business to ensure
                  reports come from legitimate service companies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-charcoal">Built for service businesses</h2>
            <p className="mt-4 text-text-secondary">
              Whether you're a solo contractor or managing a team, ForSure helps you work smarter.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {[
              "HVAC", "Plumbing", "Electrical", "Roofing", "General Contractor",
              "Realtor", "Home Inspector", "Landscaping", "Pest Control", "Solar",
              "Painting", "Cleaning", "Pool Service", "Garage Door", "Fencing",
              "Window & Door", "Moving", "Property Manager", "Insurance Agent"
            ].map((industry) => (
              <span
                key={industry}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-sm text-text-secondary sm:px-4 sm:py-2"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-charcoal p-8 text-center sm:p-12">
            <h2 className="text-3xl font-bold text-white">
              Ready to find better customers?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-300">
              Join contractors who use ForSure to find new homeowner leads,
              check customer reliability, and grow their business smarter.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="w-full rounded-lg bg-copper px-8 py-4 font-semibold text-white hover:bg-copper-dark sm:w-auto"
              >
                Get Started Free
              </Link>
              <Link
                href="/pricing"
                className="w-full rounded-lg border border-white/30 bg-transparent px-8 py-4 font-semibold text-white hover:bg-white/10 sm:w-auto"
              >
                View Pricing
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-border py-8">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs text-text-muted">
            ForSure is a business intelligence tool for service companies. It is not a consumer
            credit reporting agency and does not provide consumer credit scores. Reliability
            tracking is based on business-reported events only.
          </p>
        </div>
      </section>
    </>
  );
}
