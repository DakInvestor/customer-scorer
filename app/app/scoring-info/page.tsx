// app/scoring-info/page.tsx
export default function ScoringInfoPage() {
    return (
      <div className="p-4 sm:p-8">
        <h1 className="mb-2 text-3xl font-bold text-charcoal">How Scoring Works</h1>
        <p className="mb-8 text-text-muted">
          Understand how reliability scores are calculated.
        </p>

        <div className="max-w-3xl space-y-8">
          {/* Overview */}
          <section className="rounded-lg bg-surface p-6">
            <h2 className="mb-4 text-xl font-semibold text-charcoal">Score Overview</h2>
            <p className="mb-4 text-text-secondary">
              Every customer starts with a reliability score of <strong className="text-charcoal">100</strong>.
              The score decreases based on logged events, with more severe events causing larger deductions.
            </p>
            <p className="text-text-secondary">
              Scores range from 0 to 100, where higher scores indicate more reliable customers.
            </p>
          </section>

          {/* Severity Levels */}
          <section className="rounded-lg bg-surface p-6">
            <h2 className="mb-4 text-xl font-semibold text-charcoal">Event Severity Levels</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-md bg-green-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">1</div>
                <div>
                  <h3 className="font-medium text-green-700">Positive</h3>
                  <p className="text-sm text-text-muted">Great experience, paid on time, easy to work with</p>
                  <p className="mt-1 text-xs text-text-muted">Impact: Minimal (+1 point deduction)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-md bg-cream p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-sm font-bold text-white">2</div>
                <div>
                  <h3 className="font-medium text-charcoal">Neutral / Minor</h3>
                  <p className="text-sm text-text-muted">Late but paid, minor scheduling issue</p>
                  <p className="mt-1 text-xs text-text-muted">Impact: Low (2 point deduction)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-md bg-orange-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">3</div>
                <div>
                  <h3 className="font-medium text-orange-700">Negative</h3>
                  <p className="text-sm text-text-muted">Late cancellation, payment delayed significantly</p>
                  <p className="mt-1 text-xs text-text-muted">Impact: Moderate (12 point deduction)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-md bg-red-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">4</div>
                <div>
                  <h3 className="font-medium text-red-700">Severe</h3>
                  <p className="text-sm text-text-muted">No-show, refused payment, abusive behavior</p>
                  <p className="mt-1 text-xs text-text-muted">Impact: High (24 point deduction)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-md bg-red-100 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-700 text-sm font-bold text-white">5</div>
                <div>
                  <h3 className="font-medium text-red-800">Critical</h3>
                  <p className="text-sm text-text-muted">Fraud, theft, threats, dangerous behavior</p>
                  <p className="mt-1 text-xs text-text-muted">Impact: Very High (30 point deduction)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Score Labels */}
          <section className="rounded-lg bg-surface p-6">
            <h2 className="mb-4 text-xl font-semibold text-charcoal">Score Labels</h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-md bg-cream p-3">
                <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">90-100</span>
                <span className="text-charcoal">Excellent</span>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-cream p-3">
                <span className="rounded-full bg-lime-600 px-3 py-1 text-sm font-semibold text-white">75-89</span>
                <span className="text-charcoal">Good</span>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-cream p-3">
                <span className="rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-gray-900">60-74</span>
                <span className="text-charcoal">Fair</span>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-cream p-3">
                <span className="rounded-full bg-orange-500 px-3 py-1 text-sm font-semibold text-white">40-59</span>
                <span className="text-charcoal">Poor</span>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-cream p-3 sm:col-span-2">
                <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">0-39</span>
                <span className="text-charcoal">High Risk</span>
              </div>
            </div>
          </section>

          {/* Risk Levels */}
          <section className="rounded-lg bg-surface p-6">
            <h2 className="mb-4 text-xl font-semibold text-charcoal">Risk Levels</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md bg-cream p-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">Low Risk</span>
                </div>
                <span className="text-sm text-text-muted">Score 75+</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-cream p-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">Medium Risk</span>
                </div>
                <span className="text-sm text-text-muted">Score 50-74</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-cream p-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">High Risk</span>
                </div>
                <span className="text-sm text-text-muted">Score below 50</span>
              </div>
            </div>
          </section>

          {/* Trends */}
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
                  <p className="text-sm text-text-muted">Recent events less severe than older events</p>
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
                  <p className="text-sm text-text-muted">Recent events more severe than older events</p>
                </div>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="rounded-lg bg-yellow-50 p-6">
            <h2 className="mb-2 text-lg font-semibold text-yellow-800">Important Disclaimer</h2>
            <p className="text-sm text-yellow-700">
              Reliability scores are based solely on events submitted by businesses and may not represent
              a complete picture of any individual. Scores should be used as one factor among many when
              making business decisions. ForSure is not a credit bureau and scores are not
              credit scores.
            </p>
          </section>
        </div>
      </div>
    );
  }
