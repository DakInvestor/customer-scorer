import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-charcoal">
            Everything you need to protect your business
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            ForSure gives you the tools to track reliability, identify patterns,
            and make smarter decisions about who you work with.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <Feature
            icon="📊"
            title="Reliability Scores"
            description="Every customer gets a 0-100 score based on their history. See at a glance who's trustworthy."
          />
          <Feature
            icon="📝"
            title="Event Logging"
            description="Record no-shows, late payments, disputes, and positive experiences. Build a complete picture."
          />
          <Feature
            icon="🔍"
            title="Quick Search"
            description="Look up any customer by name, phone, or email before accepting a job."
          />
          <Feature
            icon="📈"
            title="Analytics Dashboard"
            description="Track trends, identify patterns, and see how your customer base is performing."
          />
          <Feature
            icon="📤"
            title="CSV Import/Export"
            description="Easily import existing customers or export your data anytime."
          />
          <Feature
            icon="🔒"
            title="Private & Secure"
            description="Your data is encrypted and never shared. You own your customer information."
          />
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-copper px-8 py-4 font-semibold text-white hover:bg-copper-dark"
          >
            Start Free Trial
          </Link>
          <p className="mt-4 text-sm text-text-secondary">
            Free 14-day trial - No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
      <p className="mt-2 text-text-secondary">{description}</p>
    </div>
  );
}
