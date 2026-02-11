import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-charcoal">
            Everything you need to grow smarter
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Property intelligence, customer reliability tracking, and a verified
            contractor network — all in one platform.
          </p>
        </div>

        {/* Property Intelligence Section */}
        <div className="mt-20">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald/10 text-xl">🏠</span>
            <h2 className="text-2xl font-bold text-charcoal">Property Intelligence</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon="🏡"
              title="New Homeowner Alerts"
              description="Get notified when homes sell in your service area. New homeowners need services within their first 90 days."
            />
            <Feature
              icon="📋"
              title="Permit Activity Feed"
              description="See building permits filed in your counties. Know who's doing renovations and what work is happening."
            />
            <Feature
              icon="💰"
              title="Property Sales Data"
              description="Access recent sales with prices, dates, and property details. Identify high-value opportunities."
            />
            <Feature
              icon="📊"
              title="Property Profiles"
              description="View complete property details including age, size, features, ownership history, and permit records."
            />
            <Feature
              icon="🗺️"
              title="Service Area Configuration"
              description="Select your counties and get property data tailored to where you work. Expand as you grow."
            />
            <Feature
              icon="🎯"
              title="Lead Filtering"
              description="Filter leads by property type, price range, age, and more. Focus on your ideal customers."
            />
          </div>
        </div>

        {/* Network Search Section */}
        <div className="mt-20">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-copper/10 text-xl">🔍</span>
            <h2 className="text-2xl font-bold text-charcoal">Network Search</h2>
            <span className="rounded-full bg-copper/10 px-2 py-0.5 text-xs font-medium text-copper">
              Most Popular
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon="📞"
              title="Search by Phone"
              description="Look up any phone number to see if it has reliability reports from other verified contractors."
            />
            <Feature
              icon="🏠"
              title="Search by Address"
              description="Check a property address against the network. See if previous owners or tenants had issues."
            />
            <Feature
              icon="🔒"
              title="Anonymized Reports"
              description="See event types and dates without identifying details. Privacy is protected for everyone."
            />
            <Feature
              icon="✓"
              title="Verified Businesses Only"
              description="Only verified contractors can report to the network. No fake or malicious reports."
            />
            <Feature
              icon="⚠️"
              title="Report Events"
              description="Share your experiences to help other contractors. Report no-shows, payment issues, and more."
            />
            <Feature
              icon="📈"
              title="Pattern Detection"
              description="See if issues are one-time or recurring. Multiple reports from different businesses show patterns."
            />
          </div>
        </div>

        {/* Reliability Tracking Section */}
        <div className="mt-20">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-xl">📊</span>
            <h2 className="text-2xl font-bold text-charcoal">Reliability Tracking</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon="🎯"
              title="Reliability Indicators"
              description="Every customer shows a clear status — Excellent, Good, Fair, or At Risk. Know who's trustworthy at a glance."
            />
            <Feature
              icon="📝"
              title="Event Logging"
              description="Record no-shows, late payments, disputes, and positive experiences. Build a complete history."
            />
            <Feature
              icon="📈"
              title="Trend Analysis"
              description="See if customers are improving or declining. Identify patterns before they become problems."
            />
            <Feature
              icon="🔍"
              title="Customer Search"
              description="Look up any customer by name, phone, email, or address. Get instant insights when they call."
            />
            <Feature
              icon="📊"
              title="Analytics Dashboard"
              description="Track your customer base health. See score distribution, recent events, and high-risk accounts."
            />
            <Feature
              icon="⚡"
              title="Quick Actions"
              description="Add customers and log events in seconds. Designed for busy contractors in the field."
            />
          </div>
        </div>

        {/* Industry Tools Section */}
        <div className="mt-20">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-xl">🛠️</span>
            <h2 className="text-2xl font-bold text-charcoal">Industry-Specific Tools</h2>
          </div>
          <p className="mb-8 max-w-2xl text-text-secondary">
            Select your industry during signup and unlock specialized tools designed for how you find and manage customers.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "❄️", name: "HVAC", tools: "Aging system finder, warranty expiration leads, seasonal prep lists" },
              { icon: "🔧", name: "Plumbing", tools: "Water heater alerts, sewer line prospects, new construction leads" },
              { icon: "⚡", name: "Electrical", tools: "Panel upgrade prospects, solar pre-wire leads, permit activity" },
              { icon: "🏠", name: "Roofing", tools: "Roof age calculator, storm damage prospecting, insurance helper" },
              { icon: "🏗️", name: "General Contractor", tools: "Renovation candidates, flip tracker, permit benchmarking" },
              { icon: "🔑", name: "Realtor", tools: "Comparable sales, off-market finder, neighborhood reports" },
              { icon: "🔍", name: "Home Inspector", tools: "Pre-inspection briefs, investor tracker, red flag alerts" },
              { icon: "🌿", name: "Landscaping", tools: "Lot size leads, high-value properties, seasonal push lists" },
            ].map((industry) => (
              <div key={industry.name} className="rounded-xl border border-border bg-white p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">{industry.icon}</span>
                  <h3 className="font-semibold text-charcoal">{industry.name}</h3>
                </div>
                <p className="text-sm text-text-secondary">{industry.tools}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-text-muted">
            + 15 more industries including pest control, solar, cleaning, pool service, and more
          </p>
        </div>

        {/* Security Section */}
        <div className="mt-20">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xl">🔒</span>
            <h2 className="text-2xl font-bold text-charcoal">Security & Privacy</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon="🔐"
              title="Data Encryption"
              description="All data is encrypted at rest and in transit. Your customer information is protected."
            />
            <Feature
              icon="✓"
              title="Verified Businesses"
              description="We verify every business before they can access network features. No anonymous reports."
            />
            <Feature
              icon="👤"
              title="Anonymized Sharing"
              description="Network reports show event types only. No names or business details are shared."
            />
            <Feature
              icon="📋"
              title="Public Records Only"
              description="Property data comes from public county records. No private information is accessed."
            />
            <Feature
              icon="📤"
              title="Data Export"
              description="Export your customer data anytime. Your data is never locked in."
            />
            <Feature
              icon="🚫"
              title="Not a Credit Bureau"
              description="ForSure is a business tool, not a consumer credit reporting agency."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-2xl bg-charcoal p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-300">
            Join contractors who use ForSure to find better leads and avoid problem customers.
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
          <p className="mt-4 text-sm text-gray-400">No credit card required</p>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
      <p className="mt-2 text-text-secondary">{description}</p>
    </div>
  );
}
