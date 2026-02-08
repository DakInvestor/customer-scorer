// app/reliability-info/page.tsx
export default function ReliabilityInfoPage() {
  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-2 text-3xl font-bold text-charcoal">How Reliability Tracking Works</h1>
      <p className="mb-8 text-text-muted">
        Understand how ForSure helps you track customer reliability.
      </p>

      <div className="max-w-3xl space-y-8">
        {/* Overview */}
        <section className="rounded-lg bg-surface p-6">
          <h2 className="mb-4 text-xl font-semibold text-charcoal">Overview</h2>
          <p className="mb-4 text-text-secondary">
            ForSure tracks customer interactions to help you understand their reliability.
            Based on logged events, each customer receives a qualitative reliability indicator
            that helps you make informed scheduling decisions.
          </p>
          <p className="text-text-secondary">
            Reliability is determined by the pattern of events you log — both positive
            and negative experiences contribute to the overall picture.
          </p>
        </section>

        {/* Event Types */}
        <section className="rounded-lg bg-surface p-6">
          <h2 className="mb-4 text-xl font-semibold text-charcoal">Event Types</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-md bg-green-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">+</div>
              <div>
                <h3 className="font-medium text-green-700">Positive</h3>
                <p className="text-sm text-text-muted">Great experience, paid on time, easy to work with</p>
                <p className="mt-1 text-xs text-text-muted">Impact: Improves reliability indicator</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-md bg-cream p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-sm font-bold text-white">○</div>
              <div>
                <h3 className="font-medium text-charcoal">Minor Concern</h3>
                <p className="text-sm text-text-muted">Late but paid, minor scheduling issue</p>
                <p className="mt-1 text-xs text-text-muted">Impact: Slight decrease in reliability</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-md bg-orange-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">!</div>
              <div>
                <h3 className="font-medium text-orange-700">Moderate Concern</h3>
                <p className="text-sm text-text-muted">Late cancellation, payment delayed significantly</p>
                <p className="mt-1 text-xs text-text-muted">Impact: Moderate decrease in reliability</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-md bg-red-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">!!</div>
              <div>
                <h3 className="font-medium text-red-700">Serious Concern</h3>
                <p className="text-sm text-text-muted">No-show, refused payment, abusive behavior</p>
                <p className="mt-1 text-xs text-text-muted">Impact: Significant decrease in reliability</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-md bg-red-100 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-700 text-sm font-bold text-white">!!!</div>
              <div>
                <h3 className="font-medium text-red-800">Critical</h3>
                <p className="text-sm text-text-muted">Fraud, theft, threats, dangerous behavior</p>
                <p className="mt-1 text-xs text-text-muted">Impact: Major decrease in reliability</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reliability Indicators */}
        <section className="rounded-lg bg-surface p-6">
          <h2 className="mb-4 text-xl font-semibold text-charcoal">Reliability Indicators</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-md bg-cream p-3">
              <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">Excellent</span>
              <span className="text-text-secondary">Highly reliable customer</span>
            </div>
            <div className="flex items-center gap-3 rounded-md bg-cream p-3">
              <span className="rounded-full bg-lime-600 px-3 py-1 text-sm font-semibold text-white">Good</span>
              <span className="text-text-secondary">Generally reliable</span>
            </div>
            <div className="flex items-center gap-3 rounded-md bg-cream p-3">
              <span className="rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-gray-900">Fair</span>
              <span className="text-text-secondary">Some concerns noted</span>
            </div>
            <div className="flex items-center gap-3 rounded-md bg-cream p-3 sm:col-span-2">
              <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">At Risk</span>
              <span className="text-text-secondary">Multiple concerns — proceed with caution</span>
            </div>
          </div>
        </section>

        {/* Behavior Trends */}
        <section className="rounded-lg bg-surface p-6">
          <h2 className="mb-4 text-xl font-semibold text-charcoal">Behavior Trends</h2>
          <p className="mb-4 text-text-secondary">
            We analyze event patterns over time to determine if a customer's behavior is improving,
            declining, or stable.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-md bg-cream p-3">
              <span className="text-2xl text-green-600">↑</span>
              <div>
                <span className="font-medium text-green-700">Improving</span>
                <p className="text-sm text-text-muted">Recent interactions better than older ones</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md bg-cream p-3">
              <span className="text-2xl text-text-muted">→</span>
              <div>
                <span className="font-medium text-charcoal">Stable</span>
                <p className="text-sm text-text-muted">Consistent behavior over time</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md bg-cream p-3">
              <span className="text-2xl text-red-600">↓</span>
              <div>
                <span className="font-medium text-red-700">Declining</span>
                <p className="text-sm text-text-muted">Recent issues after previously good behavior</p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="rounded-lg bg-yellow-50 p-6">
          <h2 className="mb-2 text-lg font-semibold text-yellow-800">Important Disclaimer</h2>
          <p className="text-sm text-yellow-700 mb-3">
            ForSure is NOT a consumer reporting agency under the Fair Credit Reporting Act (FCRA).
            Reliability indicators are based solely on events you submit about your own customer
            interactions and may not represent a complete picture of any individual.
          </p>
          <p className="text-sm text-yellow-700">
            Information from ForSure should NEVER be used for credit, employment, insurance, or
            housing decisions. ForSure is an internal business tool for managing your own customer
            relationships.
          </p>
        </section>
      </div>
    </div>
  );
}
