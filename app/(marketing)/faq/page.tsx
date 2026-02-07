"use client";

import { useState } from "react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Getting Started
  {
    category: "Getting Started",
    question: "How do I get started with ForSure?",
    answer: "Sign up for a free account, verify your business, and you can start adding customers immediately. You can import existing customers via CSV or add them one by one. There's no complex setup required.",
  },
  {
    category: "Getting Started",
    question: "Is there a free plan?",
    answer: "Yes! Our Starter plan is completely free and includes up to 50 customers, basic reliability scores, event logging, and CSV export. No credit card required to get started.",
  },
  {
    category: "Getting Started",
    question: "How long does business verification take?",
    answer: "We typically review and verify businesses within 1-2 business days. You'll need to provide basic business documentation like a business license or EIN letter.",
  },

  // Scoring
  {
    category: "Scoring",
    question: "How is the reliability score calculated?",
    answer: "The score (0-100) is calculated based on the customer's history with your business — payment history, no-shows, cancellations, disputes, and positive events like referrals. Recent events are weighted more heavily than older ones.",
  },
  {
    category: "Scoring",
    question: "What do the different score ranges mean?",
    answer: "70-100 (green) means a reliable customer you can trust. 40-69 (yellow) means proceed with caution — maybe require a deposit. 0-39 (red) means high risk — strongly consider requiring full payment upfront or declining the job.",
  },
  {
    category: "Scoring",
    question: "Can customers see their own scores?",
    answer: "No. Reliability scores are private to your business. Customers cannot see their score or know that you're using ForSure.",
  },
  {
    category: "Scoring",
    question: "Do scores transfer between businesses?",
    answer: "No. Each business maintains their own customer records and scores. Your data is completely private and not shared with other businesses.",
  },

  // Privacy & Legal
  {
    category: "Privacy & Legal",
    question: "Is this legal?",
    answer: "Yes. ForSure is a private business tool for tracking your own customer interactions. It's similar to keeping notes about customers, just more organized. We don't report to credit bureaus or share data between businesses.",
  },
  {
    category: "Privacy & Legal",
    question: "Is customer data secure?",
    answer: "Absolutely. We use bank-level encryption, secure data centers, and follow industry best practices. Your customer data is never shared with third parties or other businesses.",
  },
  {
    category: "Privacy & Legal",
    question: "Can I export my data?",
    answer: "Yes. You can export all your customer data and event history as a CSV file at any time. Your data belongs to you.",
  },

  // Features
  {
    category: "Features",
    question: "Can I import my existing customers?",
    answer: "Yes! You can bulk import customers via CSV file. Just format your spreadsheet with columns for name, phone, email, and address, and upload it to ForSure.",
  },
  {
    category: "Features",
    question: "What types of events can I log?",
    answer: "You can log any interaction — late payments, on-time payments, no-shows, cancellations, disputes, property damage, referrals, tips, and more. Each event type has a different impact on the score.",
  },
  {
    category: "Features",
    question: "Can I add team members?",
    answer: "Yes, on Professional and Business plans. Professional allows up to 5 team members, and Business allows unlimited team members. All team members share the same customer database.",
  },

  // Billing
  {
    category: "Billing",
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes. You can upgrade at any time and the new features will be available immediately. If you downgrade, the change takes effect at the end of your billing period.",
  },
  {
    category: "Billing",
    question: "What happens if I exceed 50 customers on the free plan?",
    answer: "You'll need to upgrade to Professional to add more customers. Your existing customers and data will remain intact.",
  },
  {
    category: "Billing",
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact us within 14 days of your purchase for a full refund.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Getting Started", "Scoring", "Privacy & Legal", "Features", "Billing"];

  const filteredFaqs = activeCategory === "All"
    ? faqs
    : faqs.filter(function(faq) { return faq.category === activeCategory; });

  function toggleQuestion(index: number) {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-charcoal md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Everything you need to know about ForSure.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 pb-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(function(category) {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={function() { setActiveCategory(category); setOpenIndex(null); }}
                  className={
                    isActive
                      ? "rounded-full bg-copper px-4 py-2 text-sm font-medium text-white"
                      : "rounded-full border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:border-text-muted hover:text-charcoal"
                  }
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-4">
            {filteredFaqs.map(function(faq, index) {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-white"
                >
                  <button
                    onClick={function() { toggleQuestion(index); }}
                    className="flex w-full items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="font-medium text-charcoal">{faq.question}</span>
                    <svg
                      className={
                        isOpen
                          ? "h-5 w-5 rotate-180 text-text-secondary transition-transform"
                          : "h-5 w-5 text-text-secondary transition-transform"
                      }
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen ? (
                    <div className="border-t border-border px-6 py-4">
                      <p className="text-text-secondary">{faq.answer}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-charcoal">Still have questions?</h2>
          <p className="mt-4 text-text-secondary">
            Can't find the answer you're looking for? Reach out to our support team.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:support@myforsure.com"
              className="rounded-lg bg-copper px-8 py-3 font-semibold text-white hover:bg-copper-dark"
            >
              Contact Support
            </a>
            <Link
              href="/signup"
              className="rounded-lg border border-border px-8 py-3 font-semibold text-charcoal hover:bg-surface"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
