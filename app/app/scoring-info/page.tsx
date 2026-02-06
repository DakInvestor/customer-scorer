// app/scoring-info/page.tsx
export default function ScoringInfoPage() {
    return (
      <div className="p-4 sm:p-8">
        <h1 className="mb-2 text-3xl font-bold">How Scoring Works</h1>
        <p className="mb-8 text-gray-400">
          Understand how reliability scores are calculated.
        </p>
  
        <div className="max-w-3xl space-y-8">
          {/* Overview */}
          <section className="rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Score Overview</h2>
            <p className="mb-4 text-gray-300">
              Every customer starts with a reliability score of <strong className="text-white">100</strong>. 
              The score decreases based on logged events, with more severe events causing larger deductions.
            </p>
            <p className="text-gray-300">
              Scores range from 0 to 100, where higher scores indicate more reliable customers.
            </p>
          </section>
  
          {/* Severity Levels */}
          <section className="rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Event Severity Levels</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-md bg-green-900/20 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold">1</div>
                <div>
                  <h3 className="font-medium text-green-300">Positive</h3>
                  <p className="text-sm text-gray-400">Great experience, paid on time, easy to work with</p>
                  <p className="mt-1 text-xs text-gray-500">Impact: Minimal (+1 point deduction)</p>
                </div>
              </div>
  
              <div className="flex items-start gap-4 rounded-md bg-gray-700/50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-sm font-bold">2</div>
                <div>
                  <h3 className="font-medium text-gray-200">Neutral / Minor</h3>
                  <p className="text-sm text-gray-400">Late but paid, minor scheduling issue</p>
                  <p className="mt-1 text-xs text-gray-500">Impact: Low (2 point deduction)</p>
                </div>
              </div>
  
              <div className="flex items-start gap-4 rounded-md bg-orange-900/20 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold">3</div>
                <div>
                  <h3 className="font-medium text-orange-300">Negative</h3>
                  <p className="text-sm text-gray-400">Late cancellation, payment delayed significantly</p>
                  <p className="mt-1 text-xs text-gray-500">Impact: Moderate (12 point deduction)</p>
                </div>
              </div>
  
              <div className="flex items-start gap-4 rounded-md bg-red-900/20 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-bold">4</div>
                <div>
                  <h3 className="font-medium text-red-300">Severe</h3>
                  <p className="text-sm text-gray-400">No-show, refused payment, abusive behavior</p>
                  <p className="mt-1 text-xs text-gray-500">Impact: High (24 point deduction)</p>
                </div>
              </div>
  
              <div className="flex items-start gap-4 rounded-md bg-red-900/40 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-700 text-sm font-bold">5</div>
                <div>
                  <h3 className="font-medium text-red-200">Critical</h3>
                  <p className="text-sm text-gray-400">Fraud, theft, threats, dangerous behavior</p>
                  <p className="mt-1 text-xs text-gray-500">Impact: Very High (30 point deduction)</p>
                </div>
              </div>
            </div>
          </section>
  
          {/* Score Labels */}
          <section className="rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Score Labels</h2>
            
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-md bg-gray-700/50 p-3">
                <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold">90-100</span>
                <span>Excellent</span>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-gray-700/50 p-3">
                <span className="rounded-full bg-lime-600 px-3 py-1 text-sm font-semibold">75-89</span>
                <span>Good</span>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-gray-700/50 p-3">
                <span className="rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-gray-900">60-74</span>
                <span>Fair</span>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-gray-700/50 p-3">
                <span className="rounded-full bg-orange-500 px-3 py-1 text-sm font-semibold">40-59</span>
                <span>Poor</span>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-gray-700/50 p-3 sm:col-span-2">
                <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold">0-39</span>
                <span>High Risk</span>
              </div>
            </div>
          </section>
  
          {/* Risk Levels */}
          <section className="rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Risk Levels</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md bg-gray-700/50 p-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-green-900/50 px-3 py-1 text-sm font-medium text-green-200">Low Risk</span>
                </div>
                <span className="text-sm text-gray-400">Score 75+</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-gray-700/50 p-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-yellow-900/50 px-3 py-1 text-sm font-medium text-yellow-200">Medium Risk</span>
                </div>
                <span className="text-sm text-gray-400">Score 50-74</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-gray-700/50 p-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-red-900/50 px-3 py-1 text-sm font-medium text-red-200">High Risk</span>
                </div>
                <span className="text-sm text-gray-400">Score below 50</span>
              </div>
            </div>
          </section>
  
          {/* Trends */}
          <section className="rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Behavior Trends</h2>
            <p className="mb-4 text-gray-300">
              We analyze event patterns over time to determine if a customer's behavior is improving, 
              declining, or stable.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-md bg-gray-700/50 p-3">
                <span className="text-2xl text-green-400">↑</span>
                <div>
                  <span className="font-medium text-green-400">Improving</span>
                  <p className="text-sm text-gray-400">Recent events less severe than older events</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-gray-700/50 p-3">
                <span className="text-2xl text-gray-400">→</span>
                <div>
                  <span className="font-medium">Stable</span>
                  <p className="text-sm text-gray-400">Consistent behavior over time</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-gray-700/50 p-3">
                <span className="text-2xl text-red-400">↓</span>
                <div>
                  <span className="font-medium text-red-400">Declining</span>
                  <p className="text-sm text-gray-400">Recent events more severe than older events</p>
                </div>
              </div>
            </div>
          </section>
  
          {/* Disclaimer */}
          <section className="rounded-lg bg-yellow-900/20 p-6">
            <h2 className="mb-2 text-lg font-semibold text-yellow-200">Important Disclaimer</h2>
            <p className="text-sm text-yellow-100/80">
              Reliability scores are based solely on events submitted by businesses and may not represent 
              a complete picture of any individual. Scores should be used as one factor among many when 
              making business decisions. Customer Scorer is not a credit bureau and scores are not 
              credit scores.
            </p>
          </section>
        </div>
      </div>
    );
  }