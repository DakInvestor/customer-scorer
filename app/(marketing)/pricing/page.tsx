import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-white">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-slate-gray">
            Start free, upgrade when you're ready. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {/* Free Plan */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <h3 className="text-lg font-semibold text-white">Starter</h3>
            <p className="mt-2 text-sm text-slate-gray">For solo contractors getting started</p>
            
            <div className="mt-6">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-slate-gray">/month</span>
            </div>

            <ul className="mt-8 space-y-3">
              <PricingFeature included>Up to 50 customers</PricingFeature>
              <PricingFeature included>Basic reliability scores</PricingFeature>
              <PricingFeature included>Event logging</PricingFeature>
              <PricingFeature included>CSV export</PricingFeature>
              <PricingFeature included={false}>Analytics dashboard</PricingFeature>
              <PricingFeature included={false}>Team members</PricingFeature>
              <PricingFeature included={false}>Priority support</PricingFeature>
            </ul>

            <Link
              href="/signup"
              className="mt-8 block w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 text-center font-semibold text-white hover:bg-slate-800"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border-2 border-forsure-blue bg-slate-900/50 p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-forsure-blue px-3 py-1 text-xs font-semibold text-white">
              Most Popular
            </div>
            
            <h3 className="text-lg font-semibold text-white">Professional</h3>
            <p className="mt-2 text-sm text-slate-gray">For growing service businesses</p>
            
            <div className="mt-6">
              <span className="text-4xl font-bold text-white">$29</span>
              <span className="text-slate-gray">/month</span>
            </div>

            <ul className="mt-8 space-y-3">
              <PricingFeature included>Unlimited customers</PricingFeature>
              <PricingFeature included>Advanced reliability scores</PricingFeature>
              <PricingFeature included>Event logging</PricingFeature>
              <PricingFeature included>CSV import/export</PricingFeature>
              <PricingFeature included>Analytics dashboard</PricingFeature>
              <PricingFeature included>Up to 5 team members</PricingFeature>
              <PricingFeature included>Priority email support</PricingFeature>
            </ul>

            <Link
              href="/signup"
              className="mt-8 block w-full rounded-lg bg-forsure-blue py-3 text-center font-semibold text-white hover:bg-forsure-blue/90"
            >
              Start Free Trial
            </Link>
            <p className="mt-2 text-center text-xs text-slate-gray">14-day free trial</p>
          </div>

          {/* Business Plan */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <h3 className="text-lg font-semibold text-white">Business</h3>
            <p className="mt-2 text-sm text-slate-gray">For larger teams and enterprises</p>
            
            <div className="mt-6">
              <span className="text-4xl font-bold text-white">$79</span>
              <span className="text-slate-gray">/month</span>
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

            <Link
              href="/signup"
              className="mt-8 block w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 text-center font-semibold text-white hover:bg-slate-800"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Comparison note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-gray">
            All plans include: Secure data storage, 256-bit encryption, 99.9% uptime guarantee
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-white">
            Frequently asked questions
          </h2>
          
          <div className="mt-8 space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="font-semibold text-white">Can I cancel anytime?</h3>
              <p className="mt-2 text-slate-gray">
                Yes, you can cancel your subscription at any time. No questions asked, no cancellation fees.
              </p>
            </div>
            
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="font-semibold text-white">Is there a free trial?</h3>
              <p className="mt-2 text-slate-gray">
                Yes! All paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="font-semibold text-white">What happens when I hit 50 customers on Starter?</h3>
              <p className="mt-2 text-slate-gray">
                You'll get a notification to upgrade. Your existing data stays safe, you just won't be able 
                to add new customers until you upgrade to Professional.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="font-semibold text-white">Is this a credit score?</h3>
              <p className="mt-2 text-slate-gray">
                No. Customer Scorer is an internal reliability tool for your business only. It does not 
                pull credit reports or report to any bureaus.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="font-semibold text-white">Do you share my customer data?</h3>
              <p className="mt-2 text-slate-gray">
                No. Your data is private to your account. We do not share customers between businesses.
              </p>
            </div>
            
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="font-semibold text-white">What payment methods do you accept?</h3>
              <p className="mt-2 text-slate-gray">
                We accept all major credit cards, including Visa, Mastercard, and American Express.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-lg text-white">Still have questions?</p>
          <p className="mt-2 text-slate-gray">
            <Link href="mailto:support@customerscorer.com" className="text-forsure-blue hover:underline">
              support@customerscorer.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function PricingFeature({ children, included = true }: { children: React.ReactNode; included?: boolean }) {
  return (
    <li className={`flex items-center gap-2 text-sm ${included ? "text-slate-300" : "text-slate-500"}`}>
      {included ? (
        <svg className="h-5 w-5 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {children}
    </li>
  );
}