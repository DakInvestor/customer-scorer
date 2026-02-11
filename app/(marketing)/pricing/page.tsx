import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-emerald/20 px-4 py-2 text-sm font-medium text-emerald">
            Free During Launch — All Features Included
          </div>
          <h1 className="text-4xl font-bold text-charcoal">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Get full access to property intelligence, network search, and reliability tracking
            while we build the largest contractor network in the country.
          </p>
        </div>

        {/* Launch Banner */}
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-copper/30 bg-copper/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-charcoal">Why free?</h2>
          <p className="mt-3 text-text-secondary">
            ForSure gets more valuable with every business that joins. The more contractors
            reporting customer behavior and contributing to the network, the better it works for everyone.
            We want to build the largest reliability network possible — and that starts with getting you on board.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-lg bg-copper px-8 py-4 font-semibold text-white hover:bg-copper-dark"
          >
            Get Started Free
          </Link>
          <p className="mt-3 text-sm text-text-muted">No credit card required</p>
        </div>

        {/* What You Get */}
        <div className="mx-auto mt-16 max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-charcoal">
            Everything included. No limits.
          </h2>

          {/* Property Intelligence */}
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-charcoal">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/10">🏠</span>
              Property Intelligence
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <FeatureCard
                icon="🏡"
                title="New Homeowner Alerts"
                description="Daily feed of recent home sales in your service area."
              />
              <FeatureCard
                icon="📋"
                title="Permit Activity"
                description="See building permits filed in your counties."
              />
              <FeatureCard
                icon="💰"
                title="Property Data"
                description="Access property details, values, and history."
              />
            </div>
          </div>

          {/* Network Search */}
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-charcoal">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-copper/10">🔍</span>
              Network Search
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <FeatureCard
                icon="📞"
                title="Phone & Address Search"
                description="Look up customers across the verified network."
              />
              <FeatureCard
                icon="⚠️"
                title="Report Events"
                description="Share reliability issues to help other contractors."
              />
              <FeatureCard
                icon="🔒"
                title="Anonymized Data"
                description="Privacy-protected reports with no identifying info."
              />
            </div>
          </div>

          {/* Reliability Tracking */}
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-charcoal">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber/10">📊</span>
              Reliability Tracking
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <FeatureCard
                icon="👥"
                title="Unlimited Customers"
                description="Add as many customers as you want. No caps."
              />
              <FeatureCard
                icon="📈"
                title="Analytics Dashboard"
                description="Track reliability trends and risk assessments."
              />
              <FeatureCard
                icon="🛠️"
                title="Industry Tools"
                description="Specialized features for your specific trade."
              />
            </div>
          </div>
        </div>

        {/* Future Pricing Preview */}
        <div className="mx-auto mt-20 max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-charcoal">
            Future pricing
          </h2>
          <p className="mb-8 text-center text-text-secondary">
            When the free period ends, here's what plans will look like.
            We'll notify you well in advance — no surprises.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Starter Plan */}
            <div className="rounded-2xl border border-border bg-white p-8">
              <h3 className="text-lg font-semibold text-charcoal">Starter</h3>
              <p className="mt-2 text-sm text-text-secondary">For solo contractors</p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-charcoal">$0</span>
                <span className="text-text-secondary">/month</span>
              </div>

              <ul className="mt-8 space-y-3">
                <PricingFeature included>Up to 50 customers</PricingFeature>
                <PricingFeature included>Reliability tracking</PricingFeature>
                <PricingFeature included>Event logging</PricingFeature>
                <PricingFeature included>Data export</PricingFeature>
                <PricingFeature included={false}>Property intelligence</PricingFeature>
                <PricingFeature included={false}>Network search</PricingFeature>
                <PricingFeature included={false}>Industry tools</PricingFeature>
              </ul>

              <div className="mt-8 rounded-lg border border-border bg-cream py-3 text-center text-sm text-text-muted">
                Always free
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-2xl border-2 border-copper bg-white p-8">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-copper px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </div>

              <h3 className="text-lg font-semibold text-charcoal">Professional</h3>
              <p className="mt-2 text-sm text-text-secondary">For growing businesses</p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-charcoal">$49</span>
                <span className="text-text-secondary">/month</span>
              </div>

              <ul className="mt-8 space-y-3">
                <PricingFeature included>Unlimited customers</PricingFeature>
                <PricingFeature included>Property intelligence</PricingFeature>
                <PricingFeature included>Network search & reporting</PricingFeature>
                <PricingFeature included>Industry-specific tools</PricingFeature>
                <PricingFeature included>Analytics dashboard</PricingFeature>
                <PricingFeature included>Up to 5 team members</PricingFeature>
                <PricingFeature included>Priority support</PricingFeature>
              </ul>

              <div className="mt-8 rounded-lg bg-emerald/20 py-3 text-center text-sm font-medium text-emerald">
                Free during launch
              </div>
            </div>

            {/* Business Plan */}
            <div className="rounded-2xl border border-border bg-white p-8">
              <h3 className="text-lg font-semibold text-charcoal">Business</h3>
              <p className="mt-2 text-sm text-text-secondary">For larger teams</p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-charcoal">$99</span>
                <span className="text-text-secondary">/month</span>
              </div>

              <ul className="mt-8 space-y-3">
                <PricingFeature included>Everything in Pro</PricingFeature>
                <PricingFeature included>Unlimited team members</PricingFeature>
                <PricingFeature included>Multiple service areas</PricingFeature>
                <PricingFeature included>API access</PricingFeature>
                <PricingFeature included>Custom integrations</PricingFeature>
                <PricingFeature included>Dedicated account manager</PricingFeature>
                <PricingFeature included>Phone support</PricingFeature>
              </ul>

              <div className="mt-8 rounded-lg bg-emerald/20 py-3 text-center text-sm font-medium text-emerald">
                Free during launch
              </div>
            </div>
          </div>
        </div>

        {/* Comparison note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-text-secondary">
            All plans include: Secure data storage, 256-bit encryption, 99.9% uptime guarantee
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-charcoal">
            Frequently asked questions
          </h2>

          <div className="mt-8 space-y-6">
            <div className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-semibold text-charcoal">Why is it free?</h3>
              <p className="mt-2 text-text-secondary">
                ForSure is powered by a network of businesses sharing customer reliability data.
                The more businesses that join, the more valuable the network becomes. We're offering free
                access during launch to build that network as fast as possible.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-semibold text-charcoal">Where does property data come from?</h3>
              <p className="mt-2 text-text-secondary">
                We aggregate public records including county assessor data, recorded sales,
                and building permits. All property information comes from publicly available sources.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-semibold text-charcoal">When will you start charging?</h3>
              <p className="mt-2 text-text-secondary">
                We'll give you at least 30 days notice before any pricing changes. Early adopters
                may receive special pricing as a thank you for helping build the network.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-semibold text-charcoal">Is this a credit bureau?</h3>
              <p className="mt-2 text-text-secondary">
                No. ForSure is NOT a consumer reporting agency under the FCRA. It is a business
                intelligence tool for tracking customer reliability. Information should never be used for
                credit, employment, insurance, or housing decisions.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-semibold text-charcoal">How is network data protected?</h3>
              <p className="mt-2 text-text-secondary">
                Network reports are fully anonymized. Other businesses only see event types and dates —
                never names, business details, or identifying information about who reported.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-copper px-8 py-4 font-semibold text-white hover:bg-copper-dark"
          >
            Get Started Free
          </Link>
          <p className="mt-4 text-sm text-text-secondary">
            Join contractors building the network.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-white p-4">
      <div className="text-xl">{icon}</div>
      <div>
        <h4 className="font-semibold text-charcoal">{title}</h4>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  );
}

function PricingFeature({
  children,
  included = true,
}: {
  children: React.ReactNode;
  included?: boolean;
}) {
  return (
    <li
      className={`flex items-center gap-2 text-sm ${included ? "text-text-secondary" : "text-text-muted"}`}
    >
      {included ? (
        <svg
          className="h-5 w-5 text-emerald"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
      {children}
    </li>
  );
}
