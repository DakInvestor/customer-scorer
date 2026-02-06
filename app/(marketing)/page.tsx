import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-forsure-blue/10 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Stop losing money on{" "}
              <span className="text-forsure-blue">unreliable customers</span>
            </h1>
            <p className="mt-6 text-lg text-slate-gray">
              Customer Scorer tracks reliability so you can avoid no-shows, 
              late payers, and time-wasters. Know who you're working with before you show up.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="w-full rounded-lg bg-forsure-blue px-8 py-4 text-center font-semibold text-white hover:bg-forsure-blue/90 sm:w-auto"
              >
                Start Free Trial
              </Link>
              <Link
                href="#demo"
                className="w-full rounded-lg border border-slate-700 bg-transparent px-8 py-4 text-center font-semibold text-white hover:bg-slate-800 sm:w-auto"
              >
                Watch 2-Minute Demo
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-gray">
              Free 14-day trial • No credit card required
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Customer Scorer is an internal reliability tool — not a credit bureau or consumer credit score.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="border-t border-slate-800 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white">
              The hidden cost of bad customers
            </h2>
            <p className="mt-4 text-slate-gray">
              Every service business has dealt with them — customers who no-show, 
              refuse to pay, or waste your time. These problems add up fast.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-critical/20">
                <span className="text-2xl">💸</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Lost Revenue</h3>
              <p className="mt-2 text-slate-gray">
                No-shows and last-minute cancellations cost service businesses an average of $15,000/year.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber/20">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Wasted Time</h3>
              <p className="mt-2 text-slate-gray">
                Chasing down payments and dealing with difficult customers eats into productive hours.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-critical/20">
                <span className="text-2xl">😤</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Stress & Burnout</h3>
              <p className="mt-2 text-slate-gray">
                Bad customer experiences drain your energy and make you dread picking up the phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Screenshot Section */}
      <section id="demo" className="border-t border-slate-800 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white">
              See exactly what you get
            </h2>
            <p className="mt-4 text-slate-gray">
              A clean dashboard that shows you everything at a glance. No clutter, no learning curve.
            </p>
          </div>

          {/* Main Dashboard Screenshot */}
          <div className="relative mt-12">
            {/* Screenshot container */}
            <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 flex-1 rounded bg-slate-700 px-3 py-1 text-xs text-slate-400">
                  app.customerscorer.com/dashboard
                </div>
              </div>
              
              {/* Dashboard mockup */}
              <div className="p-4 sm:p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white sm:text-xl">Your Business</h3>
                  <p className="text-xs text-slate-gray sm:text-sm">Track customer reliability and protect your business.</p>
                </div>
                
                {/* Stats row */}
                <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                  <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 sm:p-4">
                    <p className="text-[10px] text-slate-gray sm:text-xs">TOTAL CUSTOMERS</p>
                    <p className="mt-1 text-xl font-bold text-white sm:text-2xl">127</p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 sm:p-4">
                    <p className="text-[10px] text-slate-gray sm:text-xs">AVG SCORE</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-emerald px-2 py-0.5 text-base font-bold text-white sm:text-lg">84</span>
                      <span className="hidden text-sm text-slate-gray sm:inline">Good</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 sm:p-4">
                    <p className="text-[10px] text-slate-gray sm:text-xs">EVENTS THIS WEEK</p>
                    <p className="mt-1 text-xl font-bold text-white sm:text-2xl">12</p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 sm:p-4">
                    <p className="text-[10px] text-slate-gray sm:text-xs">HIGH-RISK</p>
                    <p className="mt-1 text-xl font-bold text-white sm:text-2xl">3</p>
                  </div>
                </div>

                {/* Two columns */}
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 sm:p-4">
                    <h4 className="text-sm font-semibold text-white sm:text-base">Score Distribution</h4>
                    <div className="mt-3 space-y-2 sm:mt-4">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="flex items-center gap-2 text-slate-300"><span className="h-2 w-2 rounded-full bg-emerald"></span> Excellent</span>
                        <span className="text-white">89</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="flex items-center gap-2 text-slate-300"><span className="h-2 w-2 rounded-full bg-emerald/70"></span> Good</span>
                        <span className="text-white">24</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="flex items-center gap-2 text-slate-300"><span className="h-2 w-2 rounded-full bg-amber"></span> Monitor</span>
                        <span className="text-white">11</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="flex items-center gap-2 text-slate-300"><span className="h-2 w-2 rounded-full bg-critical"></span> At Risk</span>
                        <span className="text-white">3</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 sm:p-4">
                    <h4 className="text-sm font-semibold text-white sm:text-base">Recent Activity</h4>
                    <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-slate-300">John Smith</span>
                        <span className="rounded bg-critical/20 px-1.5 py-0.5 text-[10px] text-critical sm:px-2 sm:text-xs">No-show</span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-slate-300">Sarah Johnson</span>
                        <span className="rounded bg-emerald/20 px-1.5 py-0.5 text-[10px] text-emerald sm:px-2 sm:text-xs">Paid on time</span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-slate-300">Mike Davis</span>
                        <span className="rounded bg-amber/20 px-1.5 py-0.5 text-[10px] text-amber sm:px-2 sm:text-xs">Late payment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Callout labels - hidden on mobile, shown on large screens */}
            <div className="absolute -right-4 top-32 hidden rounded-lg border border-forsure-blue bg-forsure-blue/90 px-4 py-2 text-sm font-medium text-white shadow-lg xl:block">
              See high-risk customers at a glance →
            </div>
            <div className="absolute -left-4 top-56 hidden rounded-lg border border-forsure-blue bg-forsure-blue/90 px-4 py-2 text-sm font-medium text-white shadow-lg xl:block">
              ← Score distribution of your whole base
            </div>
            <div className="absolute -right-4 bottom-24 hidden rounded-lg border border-forsure-blue bg-forsure-blue/90 px-4 py-2 text-sm font-medium text-white shadow-lg xl:block">
              Recent problem events in one place →
            </div>
          </div>

          {/* Mobile callouts - shown below image on smaller screens */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:hidden">
            <div className="rounded-lg border border-forsure-blue/50 bg-forsure-blue/10 px-4 py-3 text-center text-sm text-forsure-blue">
              See high-risk customers at a glance
            </div>
            <div className="rounded-lg border border-forsure-blue/50 bg-forsure-blue/10 px-4 py-3 text-center text-sm text-forsure-blue">
              Score distribution of your whole base
            </div>
            <div className="rounded-lg border border-forsure-blue/50 bg-forsure-blue/10 px-4 py-3 text-center text-sm text-forsure-blue">
              Recent events in one place
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="border-t border-slate-800 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white">
              Use Customer Scorer when…
            </h2>
            <p className="mt-4 text-slate-gray">
              Integrate it into the moments that matter most.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forsure-blue/20 text-2xl">
                📞
              </div>
              <h3 className="text-lg font-semibold text-white">Before booking a job</h3>
              <p className="mt-2 text-slate-gray">
                Look up new callers before you promise a slot. Know if they've caused problems before.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forsure-blue/20 text-2xl">
                📋
              </div>
              <h3 className="text-lg font-semibold text-white">Before scheduling big jobs</h3>
              <p className="mt-2 text-slate-gray">
                Check if past behavior was clean or messy. Don't commit resources to risky customers.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forsure-blue/20 text-2xl">
                📊
              </div>
              <h3 className="text-lg font-semibold text-white">Reviewing your customer base</h3>
              <p className="mt-2 text-slate-gray">
                Find who's draining profit and who deserves priority. Clean up your book of business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-800 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white">
              Know your customers before they cost you
            </h2>
            <p className="mt-4 text-slate-gray">
              Customer Scorer gives you the insights you need to make smart decisions 
              about who you work with.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forsure-blue">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Reliability Scores</h3>
                <p className="mt-1 text-slate-gray">
                  Every customer gets a 0-100 reliability score based on their history. 
                  See at a glance who's trustworthy and who's a risk.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forsure-blue">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Event History</h3>
                <p className="mt-1 text-slate-gray">
                  Log no-shows, late payments, disputes, and positive experiences. 
                  Build a complete picture over time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forsure-blue">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Quick Lookup</h3>
                <p className="mt-1 text-slate-gray">
                  Search by name, phone, or email before accepting a job. 
                  Get instant insights when they call.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forsure-blue">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Private & Secure</h3>
                <p className="mt-1 text-slate-gray">
                  Your data is yours. We never share customer information between 
                  businesses without consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-t border-slate-800 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-forsure-blue">
              Built for HVAC and Home-Service Owners
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              What contractors are saying
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-4 flex text-amber">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <p className="text-slate-300">
                "We stopped working with 3 chronic non-payers and freed up a ton of time. 
                Should have had this years ago."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">
                  MR
                </div>
                <div>
                  <p className="font-medium text-white">Mike Rodriguez</p>
                  <p className="text-sm text-slate-gray">Rodriguez HVAC, Phoenix</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-4 flex text-amber">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <p className="text-slate-300">
                "Now I check every new caller before booking. Takes 5 seconds and has 
                saved me from at least 4 no-shows this month."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">
                  ST
                </div>
                <div>
                  <p className="font-medium text-white">Sarah Thompson</p>
                  <p className="text-sm text-slate-gray">Thompson Plumbing, Austin</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-4 flex text-amber">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <p className="text-slate-300">
                "Simple and does exactly what it says. My dispatcher uses it for every 
                call now. Worth every penny."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">
                  JB
                </div>
                <div>
                  <p className="font-medium text-white">James Baker</p>
                  <p className="text-sm text-slate-gray">Baker Electric, Denver</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-slate-800 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white">How it works</h2>
            <p className="mt-4 text-slate-gray">
              Get started in minutes. No complicated setup required.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forsure-blue text-xl font-bold text-white">
                1
              </div>
              <h3 className="text-lg font-semibold text-white">Add your customers</h3>
              <p className="mt-2 text-slate-gray">
                Import your existing customer list or add them one by one as they come in.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forsure-blue text-xl font-bold text-white">
                2
              </div>
              <h3 className="text-lg font-semibold text-white">Log events</h3>
              <p className="mt-2 text-slate-gray">
                Record interactions — good or bad. Each event affects the customer's reliability score.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forsure-blue text-xl font-bold text-white">
                3
              </div>
              <h3 className="text-lg font-semibold text-white">Make informed decisions</h3>
              <p className="mt-2 text-slate-gray">
                Check scores before accepting jobs. Protect your time and your bottom line.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data & Privacy Section */}
      <section className="border-t border-slate-800 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">
                Your data stays yours
              </h2>
              <p className="mt-4 text-slate-gray">
                We take privacy seriously. Here's what you should know.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="font-semibold text-white">Is this a credit score?</h3>
                <p className="mt-2 text-slate-gray">
                  No. Customer Scorer is an internal reliability tool for your business only. 
                  It does not pull credit reports or report to any bureaus.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="font-semibold text-white">Do you share my customer data?</h3>
                <p className="mt-2 text-slate-gray">
                  No. Your data is private to your account. We do not share customers 
                  between businesses. Ever.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="font-semibold text-white">Can I export my data?</h3>
                <p className="mt-2 text-slate-gray">
                  Yes. You can export all your customer data as a CSV anytime. 
                  Your data is never locked in.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="font-semibold text-white">Is my data secure?</h3>
                <p className="mt-2 text-slate-gray">
                  Yes. We use industry-standard encryption and security practices. 
                  Your data is protected at rest and in transit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="border-t border-slate-800 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white">Built for service businesses</h2>
            <p className="mt-4 text-slate-gray">
              Whether you're a solo contractor or managing a team, Customer Scorer helps you work smarter.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {[
              "HVAC", "Plumbing", "Electrical", "Roofing", "Landscaping",
              "Cleaning", "Auto Repair", "Handyman", "Pest Control", "Moving"
            ].map((industry) => (
              <span
                key={industry}
                className="rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-sm text-slate-gray sm:px-4 sm:py-2"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="border-t border-slate-800 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-forsure-blue text-2xl font-bold text-white">
              CS
            </div>
            <p className="text-lg text-slate-300">
              "Built for service businesses, not software companies. I've seen how much money 
              bad customers waste. Customer Scorer exists so contractors can quickly see who's 
              worth it and who isn't."
            </p>
            <p className="mt-4 font-semibold text-white">— Chase, Founder of Customer Scorer</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-800 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-forsure-blue to-blue-700 p-8 text-center sm:p-12">
            <h2 className="text-3xl font-bold text-white">
              Ready to protect your business?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-blue-100">
              Join hundreds of service businesses who use Customer Scorer to avoid 
              problem customers and grow with confidence.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="w-full rounded-lg bg-white px-8 py-4 font-semibold text-forsure-blue hover:bg-blue-50 sm:w-auto"
              >
                Start Free Trial
              </Link>
              <Link
                href="/pricing"
                className="w-full rounded-lg border border-white/30 bg-transparent px-8 py-4 font-semibold text-white hover:bg-white/10 sm:w-auto"
              >
                View Pricing
              </Link>
            </div>
            <p className="mt-4 text-sm text-blue-200">
              Free 14-day trial • No credit card required
            </p>
          </div>
        </div>
      </section>
    </>
  );
}