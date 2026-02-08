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
            We're free during our launch period. Get full access to every feature
            while we build the largest customer reliability network in the country.
          </p>
        </div>

        {/* Launch Banner */}
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-copper/30 bg-copper/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-charcoal">Why free?</h2>
          <p className="mt-3 text-text-secondary">
            ForSure gets more valuable with every business that joins. The more contractors
            reporting customer behavior, the better the network works for everyone. We want to build
            the largest reliability network possible — and that starts with getting you on board.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-lg bg-copper px-8 py-4 font-semibold text-white hover:bg-copper-dark"
          >
            Get Started Free
          </Link>
          <p className="mt-3 text-sm text-text-muted">No credit card required. Ever.</p>
        </div>

        {/* What You Get */}
        <div className="mx-auto mt-16 max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-charcoal">
            Everything included. No limits.
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <FeatureCard
              icon="👥"
              title="Unlimited Customers"
              description="Add as many customers as you want. No caps, no upsells."
            />
            <FeatureCard
              icon="📊"
              title="Full Analytics Dashboard"
              description="Reliability overview, risk assessments, trend tracking — the works."
            />
            <FeatureCard
              icon="🛡️"
              title="Network Search & Reporting"
              description="Look up customers across the network. Report events to help other businesses."
            />
            <FeatureCard
              icon="📥"
              title="CSV Import & Export"
              description="Bring your existing customer list. Export anytime — your data is yours."
            />
            <FeatureCard
              icon="🔍"
              title="Instant Customer Lookup"
              description="Search by name, phone, or email. Check reliability in seconds."
            />
            <FeatureCard
              icon="📝"
              title="Complete Event Logging"
              description="Track no-shows, late payments, disputes, and positive experiences."
            />
          </div>
        </div>

        {/* Future Pricing Preview */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-charcoal">
            Future pricing
          </h2>
          <p className="mb-8 text-center text-text-secondary">
            When the free period ends, here's what plans will look like.
            We'll notify you well in advance — no surprises.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Plan */}
            <div className="rounded-2xl border border-border bg-white p-8">
              <h3 className="text-lg font-semibold text-charcoal">Starter</h3>
              <p className="mt-2 text-sm text-text-secondary">For solo contractors getting started</p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-charcoal">$0</span>
                <span className="text-text-secondary">/month</span>
              </div>

              <ul className="mt-8 space-y-3">
                <PricingFeature included>Up to 50 customers</PricingFeature>
                <PricingFeature included>Reliability tracking</PricingFeature>
                <PricingFeature included>Event logging</PricingFeature>
                <PricingFeature included>CSV export</PricingFeature>
                <PricingFeature included={false}>Analytics dashboard</PricingFeature>
                <PricingFeature included={false}>Network search</PricingFeature>
                <PricingFeature included={false}>Team members</PricingFeature>
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
              <p className="mt-2 text-sm text-text-secondary">For growing service businesses</p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-charcoal">$29</span>
                <span className="text-text-secondary">/month</span>
              </div>

              <ul className="mt-8 space-y-3">
                <PricingFeature included>Unlimited customers</PricingFeature>
                <PricingFeature included>Full reliability tracking</PricingFeature>
                <PricingFeature included>Analytics dashboard</PricingFeature>
                <PricingFeature included>Network search & reporting</PricingFeature>
                <PricingFeature included>CSV import/export</PricingFeature>
                <PricingFeature included>Up to 5 team members</PricingFeature>
                <PricingFeature included>Priority email support</PricingFeature>
              </ul>

              <div className="mt-8 rounded-lg bg-emerald/20 py-3 text-center text-sm font-medium text-emerald">
                Free during launch
              </div>
            </div>

            {/* Business Plan */}
            <div className="rounded-2xl border border-border bg-white p-8">
              <h3 className="text-lg font-semibold text-charcoal">Business</h3>
              <p className="mt-2 text-sm text-text-secondary">For larger teams and enterprises</p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-charcoal">$79</span>
                <span className="text-text-secondary">/month</span>
              </div>

              <ul className="mt-8 space-y-3">
                <PricingFeature included>Everything in Pro</PricingFeature>
                <PricingFeature included>Unlimited team members</PricingFeature>
                <PricingFeature included>API access</PricingFeature>
                <PricingFeature included>Custom integrations</PricingFeature>
                <PricingFeature included>Dedicated account manager</PricingFeature>
                <PricingFeature included>Phone support</PricingFeature>
                <PricingFeature included>SLA guarantee</PricingFeature>
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
              <h3 className="font-semibold text-charcoal">When will you start charging?</h3>
              <p className="mt-2 text-text-secondary">
                We'll give you at least 30 days notice before any pricing changes. Early adopters
                may receive special pricing as a thank you for helping build the network.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-semibold text-charcoal">Will I lose my data if I don't upgrade later?</h3>
              <p className="mt-2 text-text-secondary">
                No. Your customer data and history are always yours. If you choose not to upgrade when
                paid plans launch, you'll keep your data and can still use the free Starter plan.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-semibold text-charcoal">Is this a credit bureau or consumer reporting agency?</h3>
              <p className="mt-2 text-text-secondary">
                No. ForSure is NOT a consumer reporting agency under the FCRA. It is an internal business
                tool for tracking your own customer interactions. Information should never be used for
                credit, employment, insurance, or housing decisions.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-semibold text-charcoal">Do you share my customer data?</h3>
              <p className="mt-2 text-text-secondary">
                Your detailed customer data is private to your account. The network only shares anonymized
                reliability indicators — never names, contact info, or specific business details.
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
            Join hundreds of service businesses building the network.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-white p-5">
      <div className="text-2xl">{icon}</div>
      <div>
        <h3 className="font-semibold text-charcoal">{title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  );
}

function PricingFeature({ children, included = true }: { children: React.ReactNode; included?: boolean }) {
  return (
    <li className={`flex items-center gap-2 text-sm ${included ? "text-text-secondary" : "text-text-muted"}`}>
      {included ? (
        <svg className="h-5 w-5 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-5 w-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {children}
    </li>
  );
}
