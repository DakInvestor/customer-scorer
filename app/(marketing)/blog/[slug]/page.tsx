import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

const posts: Record<string, BlogPost> = {
  "how-to-handle-no-show-customers": {
    slug: "how-to-handle-no-show-customers",
    title: "How to Handle No-Show Customers (Without Losing Your Mind)",
    excerpt: "No-shows cost service businesses thousands every year. Here's a practical guide to reducing them and protecting your revenue.",
    date: "December 5, 2024",
    readTime: "5 min read",
    category: "Best Practices",
    content: `
No-shows are the bane of every service business owner's existence. You block out time, turn away other jobs, drive to the location — and nobody's home. It's frustrating, expensive, and unfortunately common.

## The Real Cost of No-Shows

Let's do some quick math. If you charge $150 per service call and experience just 2 no-shows per week, that's $15,600 in lost revenue per year. Add in the gas, wear on your vehicle, and the opportunity cost of jobs you turned down, and the real number is even higher.

## Why Customers No-Show

Before we fix the problem, let's understand it:

- **They forgot.** Life gets busy. That appointment you scheduled two weeks ago slipped their mind.
- **Something came up.** Emergencies happen. Not everyone thinks to call and cancel.
- **They found someone cheaper.** They scheduled with you as a backup and went with another provider.
- **They fixed it themselves.** That leaky faucet stopped leaking, so they figured they don't need you anymore.

## Strategies That Actually Work

### 1. Send Appointment Reminders

This is the easiest win. Send a reminder 24 hours before and again 2 hours before the appointment. Text messages have a 98% open rate — use them.

### 2. Require Deposits for New Customers

New customers are statistically more likely to no-show. A small deposit (even $25-50) creates commitment. If they don't show, you keep the deposit.

### 3. Track Repeat Offenders

This is where Customer Scorer shines. If a customer no-shows once, note it. If they do it again, their reliability score drops. Before scheduling their next appointment, you can see their history and decide whether to require a deposit.

### 4. Implement a Cancellation Policy

Make it clear: cancellations with less than 24 hours notice may incur a fee. Put it on your website, in your booking confirmation, and in your reminder texts.

### 5. Overbook Strategically

Airlines do this. If you know 10% of appointments no-show, consider booking 10% more than you can handle. Risky, but effective if you have the data to back it up.

## What to Do When It Happens

When a customer no-shows:

1. **Call them immediately.** Sometimes they're running late or forgot. Give them 15 minutes.
2. **Document it.** Log the no-show in their customer record.
3. **Send a follow-up.** "We missed you today. Would you like to reschedule?"
4. **Adjust their status.** In Customer Scorer, log a no-show event. Their reliability score will adjust accordingly.

## The Bottom Line

No-shows will never be zero, but they can be dramatically reduced with the right systems. Track your customers, remind them of appointments, and require deposits from those who've burned you before.

Your time is valuable. Protect it.
    `,
  },
  "when-to-require-deposits": {
    slug: "when-to-require-deposits",
    title: "When Should You Require a Deposit? A Guide for Service Businesses",
    excerpt: "Deposits can protect your business, but asking at the wrong time can scare customers away. Learn when and how to require them.",
    date: "December 1, 2024",
    readTime: "4 min read",
    category: "Best Practices",
    content: `
Deposits are a double-edged sword. They protect you from no-shows and cancellations, but they can also scare away legitimate customers if you're not careful about when and how you ask.

## When to Require a Deposit

### 1. New Customers

You have no history with them. They have no history with you. A small deposit creates mutual commitment and weeds out the tire-kickers.

### 2. Large Jobs

Any job over a certain threshold (you decide what that is) should require a deposit. It's standard practice and customers expect it.

### 3. Custom Orders or Special Parts

If you're ordering materials specifically for their job, get money upfront. You don't want to be stuck with a custom part you can't use elsewhere.

### 4. Customers with a Poor Track Record

This is where tracking customer reliability pays off. If they've no-showed before, require a deposit. Their past behavior is the best predictor of future behavior.

## When NOT to Require a Deposit

### 1. Loyal, Long-Term Customers

Your best customers have earned trust. Requiring a deposit from someone who's paid on time for years can feel insulting.

### 2. Emergency Services

If their pipe is flooding their basement, they're not going anywhere. Asking for a deposit in an emergency can seem opportunistic.

### 3. Small, Quick Jobs

A $50 service call? The hassle of collecting a deposit might not be worth it.

## How to Ask for a Deposit

The key is framing. Don't say: "We require a deposit because people don't show up."

Instead, say: "To reserve your time slot, we collect a $50 deposit which is applied to your final bill."

This frames the deposit as a normal part of the booking process, not a sign of distrust.

## The Bottom Line

Deposits are a tool. Use them strategically based on the customer's history, the size of the job, and your risk tolerance.
    `,
  },
  "tracking-customer-reliability-spreadsheet-vs-software": {
    slug: "tracking-customer-reliability-spreadsheet-vs-software",
    title: "Tracking Customer Reliability: Spreadsheet vs. Software",
    excerpt: "Many contractors start with spreadsheets. Here's when it makes sense to upgrade to dedicated software.",
    date: "November 28, 2024",
    readTime: "3 min read",
    category: "Guides",
    content: `
When you're just starting out, a spreadsheet works fine. You've got 20 customers, you remember most of them, and a simple notes column does the job.

But as you grow, cracks start to show.

## The Spreadsheet Approach

**Pros:**
- Free
- Familiar
- Flexible

**Cons:**
- No automatic scoring
- Hard to search quickly
- Easy to forget to update
- Difficult to share with team members
- No mobile access (unless you're wrestling with Google Sheets on your phone)

## When to Upgrade

Consider dedicated software when:

1. **You have more than 50 customers.** Scrolling through a spreadsheet becomes impractical.

2. **You have employees.** They need access too, and sharing spreadsheets gets messy.

3. **You're losing money to no-shows.** If you can't quickly check a customer's history before booking, you're flying blind.

4. **You want data-driven decisions.** A spreadsheet can store data, but it can't automatically calculate reliability scores or surface patterns.

## What Good Software Does

- Automatically calculates reliability scores based on customer history
- Lets you search customers instantly by name, phone, or address
- Works on your phone when you're in the field
- Logs events with timestamps for a complete history
- Alerts you to high-risk customers before you book them

## The Bottom Line

Spreadsheets are great for getting started. But if you're serious about protecting your business from unreliable customers, purpose-built software pays for itself quickly.
    `,
  },
  "5-red-flags-unreliable-customers": {
    slug: "5-red-flags-unreliable-customers",
    title: "5 Red Flags That Signal an Unreliable Customer",
    excerpt: "After talking to hundreds of contractors, we've identified the most common warning signs of problem customers.",
    date: "November 22, 2024",
    readTime: "4 min read",
    category: "Tips",
    content: `
Experience teaches you to spot problem customers before they become problems. Here are the warning signs that seasoned contractors watch for.

## 1. They're Shopping on Price Alone

"What's your cheapest option?" as an opening question is a red flag. Price-only shoppers are more likely to dispute charges, leave bad reviews, and haggle after the work is done.

## 2. They Bad-Mouth Previous Contractors

"The last guy was terrible." "Nobody does good work anymore." If everyone they've worked with was awful, the common denominator might be them.

## 3. They Want Everything in Cash

While some people just prefer cash, an insistence on cash-only (especially for large jobs) can signal someone who disputes credit card charges or has been flagged by payment processors.

## 4. They're Extremely Difficult to Reach

If it takes 5 calls to schedule an appointment, imagine what it'll be like trying to collect payment.

## 5. They Have Unrealistic Expectations

"Can you redo my entire bathroom for $500?" "It should only take 30 minutes, right?" Customers who don't understand the value of your work are more likely to be dissatisfied with the result.

## What to Do

You don't have to turn away every customer who shows one red flag. But when you see multiple warning signs:

- Require a larger deposit
- Get everything in writing
- Set clear expectations upfront
- Log the interaction in their customer record

Trust your gut. You've earned that instinct.
    `,
  },
  "hvac-busy-season-customer-management": {
    slug: "hvac-busy-season-customer-management",
    title: "HVAC Busy Season: How to Prioritize Your Best Customers",
    excerpt: "When summer hits and everyone's AC breaks, you can't serve everyone. Here's how to prioritize without burning bridges.",
    date: "November 15, 2024",
    readTime: "5 min read",
    category: "Industry",
    content: `
It's July. It's 95 degrees. Your phone won't stop ringing. You're booked solid for two weeks and people are begging for same-day service.

Who do you help first?

## The Wrong Approach

Treating everyone equally sounds fair, but it's not good business. First-come, first-served means your best customers — the ones who've been with you for years, who always pay on time, who refer their neighbors — wait in line behind someone you've never met.

## The Right Approach

### 1. Tier Your Customers

Not all customers are equal. Create tiers:

- **VIP:** Long-term customers, always pay on time, maintenance contract holders
- **Standard:** Good history, no problems
- **New:** Unknown quantity
- **Caution:** History of late payment, no-shows, or disputes

### 2. Prioritize Accordingly

When you're overbooked:

- VIPs get priority scheduling
- Maintenance contract holders get same-day or next-day service
- New customers wait or pay a premium for rush service
- Caution customers... consider whether you want them at all

### 3. Communicate Clearly

Tell customers upfront: "We're experiencing high demand. As a maintenance contract member, you're priority and we can get there tomorrow. For new customers, the earliest availability is next week."

This creates urgency to become a VIP customer.

## Using Customer Scorer

This is exactly what reliability scoring is for. Before scheduling, check their score:

- High score (70+)? Get them in quickly.
- Low score (below 40)? They can wait, or require a deposit for rush service.

## The Bottom Line

Busy season is when customer management matters most. Reward your best customers with priority service. They'll remember it when things slow down.
    `,
  },
  "customer-scoring-101": {
    slug: "customer-scoring-101",
    title: "Customer Scoring 101: What It Is and Why It Matters",
    excerpt: "An introduction to customer reliability scoring and how it can transform your service business.",
    date: "November 10, 2024",
    readTime: "6 min read",
    category: "Guides",
    content: `
Every service business has great customers and terrible customers. Great customers pay on time, show up for appointments, and refer their friends. Terrible customers no-show, dispute charges, and leave angry reviews.

Customer scoring helps you tell the difference before it costs you money.

## What Is Customer Scoring?

Customer scoring is a system for rating customers based on their history with your business. Each customer gets a score (typically 0-100) that reflects their reliability.

## How It Works

Every interaction affects the score:

**Positive events (increase score):**
- On-time payments
- Keeping appointments
- Referrals
- Tips

**Negative events (decrease score):**
- Late payments
- No-shows
- Cancellations
- Disputes

The score updates automatically as you log events.

## Why It Matters

### Make Better Decisions

Before booking a customer, you can check their score. High score? Schedule them with confidence. Low score? Require a deposit or decline the job.

### Prioritize Your Best Customers

When you're busy, serve your high-scoring customers first. They've earned it.

### Identify Problem Patterns

A customer might seem fine until you see they've no-showed 3 times in the past year. The score surfaces patterns you might miss.

### Protect Your Revenue

Every no-show, late payment, and dispute costs you money. Scoring helps you avoid repeat offenders.

## Getting Started

1. **Add your existing customers.** Import them from your current system or add them manually.

2. **Log events as they happen.** Got paid on time? Log it. Customer no-showed? Log it.

3. **Check scores before booking.** Make it part of your workflow.

4. **Adjust your policies accordingly.** Require deposits from low-scoring customers.

## The Bottom Line

You wouldn't extend credit to someone without checking their credit score. Why would you extend your time and services without checking their reliability score?

Customer scoring gives you the information you need to make smarter decisions. Start tracking today.
    `,
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  // Convert markdown-style content to HTML-like sections
  const paragraphs = post.content.trim().split("\n\n");

  return (
    <div className="min-h-screen bg-deep-blue">
      {/* Header */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-gray hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-forsure-blue/20 px-3 py-1 text-sm font-medium text-forsure-blue">
              {post.category}
            </span>
            <span className="text-sm text-slate-500">{post.readTime}</span>
          </div>

          <h1 className="text-3xl font-bold text-white md:text-4xl">{post.title}</h1>

          <p className="mt-4 text-lg text-slate-gray">{post.excerpt}</p>

          <div className="mt-6 flex items-center gap-4 border-b border-slate-800 pb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forsure-blue/20">
              <span className="text-sm font-medium text-forsure-blue">CS</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Customer Scorer Team</p>
              <p className="text-sm text-slate-500">{post.date}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-invert max-w-none">
            {paragraphs.map(function(para, index) {
              const trimmed = para.trim();
              
              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={index} className="mb-4 mt-8 text-xl font-bold text-white">
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }
              
              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={index} className="mb-3 mt-6 text-lg font-semibold text-white">
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }
              
              if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                return (
                  <p key={index} className="mb-4 font-semibold text-white">
                    {trimmed.replace(/\*\*/g, "")}
                  </p>
                );
              }
              
              if (trimmed.startsWith("- ")) {
                const items = trimmed.split("\n");
                return (
                  <ul key={index} className="mb-4 list-disc pl-6 text-slate-gray">
                    {items.map(function(item, i) {
                      return <li key={i} className="mb-1">{item.replace("- ", "")}</li>;
                    })}
                  </ul>
                );
              }
              
              if (trimmed.match(/^\d+\. /)) {
                const items = trimmed.split("\n");
                return (
                  <ol key={index} className="mb-4 list-decimal pl-6 text-slate-gray">
                    {items.map(function(item, i) {
                      return <li key={i} className="mb-1">{item.replace(/^\d+\. /, "")}</li>;
                    })}
                  </ol>
                );
              }
              
              if (trimmed === "") {
                return null;
              }
              
              return (
                <p key={index} className="mb-4 text-slate-gray">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white">Ready to start tracking customer reliability?</h2>
          <p className="mt-4 text-slate-gray">
            Join hundreds of service businesses protecting their revenue with Customer Scorer.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-lg bg-forsure-blue px-8 py-3 font-semibold text-white hover:bg-forsure-blue/90"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}