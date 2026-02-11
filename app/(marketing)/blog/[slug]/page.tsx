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
  "new-homeowner-leads-guide": {
    slug: "new-homeowner-leads-guide",
    title: "The Complete Guide to New Homeowner Leads for Contractors",
    excerpt: "New homeowners need services within 90 days of moving in. Here's how to find them, reach them, and win their business before competitors.",
    date: "February 8, 2025",
    readTime: "7 min read",
    category: "Lead Generation",
    content: `
New homeowners are the holy grail of leads for service contractors. They've just invested in a property, they're motivated to protect that investment, and they don't have existing relationships with local contractors yet.

## Why New Homeowners Are Your Best Prospects

### They Need Services Immediately

Within the first 90 days of moving in, most homeowners need:

- HVAC inspection or service
- Plumbing checks
- Electrical panel review
- Pest inspection
- Landscaping setup
- Security system installation

### They Don't Have a "Guy" Yet

The previous owner's contractors don't automatically transfer. New homeowners are actively looking for reliable service providers.

### They're Spending Money Anyway

Moving is expensive, but people budget for it. They've already mentally committed to spending on their new home.

## How to Find New Homeowner Leads

### 1. Property Sales Data

Every home sale is recorded in county records. With the right tools, you can see:

- Sale date and price
- Property address
- Property details (age, size, features)

ForSure aggregates this data for your service area, giving you a daily feed of recent sales.

### 2. Timing Is Everything

The best time to reach new homeowners is:

- **Week 1-2:** They're settling in, making lists
- **Week 3-4:** They're ready to schedule services
- **Month 2-3:** Still motivated, less overwhelmed

### 3. Personalize Your Outreach

Generic mailers get thrown away. Personalized outreach works:

"Welcome to 123 Oak Street! As a local HVAC company, we'd love to offer you a free system inspection for your 1985-built home."

## Converting New Homeowner Leads

### Offer a Welcome Special

First-time customer discounts work. "New Homeowner Special: 20% off your first service"

### Provide Value First

Free inspections, educational content, or neighborhood tips build trust before asking for the sale.

### Make Booking Easy

New homeowners are busy. Online booking, quick response times, and flexible scheduling win.

## The Bottom Line

New homeowners are actively looking for contractors like you. With the right data and approach, you can be the first call they make — and earn a customer for life.
    `,
  },
  "network-search-check-customers": {
    slug: "network-search-check-customers",
    title: "How to Check Customers Before Booking: A Network Search Guide",
    excerpt: "Learn how verified contractor networks help you avoid no-shows, payment issues, and problem customers before you commit to a job.",
    date: "February 5, 2025",
    readTime: "5 min read",
    category: "Network",
    content: `
What if you could check a customer's reliability history before booking them — like a credit check, but for no-shows and payment issues?

That's exactly what contractor networks enable.

## What Is a Contractor Network?

A contractor network is a group of verified service businesses sharing anonymized customer reliability data. When a customer no-shows, pays late, or causes problems, the contractor logs it. That information becomes visible to other verified businesses in the network.

## How Network Search Works

### 1. Customer Calls to Book

You get a call from a potential customer wanting to schedule service.

### 2. You Search the Network

Before committing, you search by phone number or address. The network checks if any other contractors have reported issues with this customer.

### 3. You See Anonymized Reports

If reports exist, you see:
- Event type (no-show, payment issue, dispute, etc.)
- When it happened (3 months ago, 1 year ago, etc.)
- How many businesses reported

You don't see who reported it or specific details — just enough to make an informed decision.

### 4. You Decide How to Proceed

- **No reports:** Book with confidence
- **Minor issues:** Maybe require a deposit
- **Major red flags:** Decline or require payment upfront

## Why Anonymization Matters

Network data is powerful, but privacy matters. That's why reports are anonymized:

- Customers can't identify which business reported them
- Businesses can't see competitors' specific experiences
- Only verified businesses can access the network

## Building the Network

The network gets more valuable as more contractors join. Each business that reports events helps protect every other business in the network.

## The Bottom Line

You wouldn't hire an employee without checking references. Why would you book a customer without checking their history?

Network search gives you the information to make smarter booking decisions — before you waste time on problem customers.
    `,
  },
  "property-data-lead-generation": {
    slug: "property-data-lead-generation",
    title: "Using Property Data to Find High-Value Leads",
    excerpt: "Property records, permit history, and sales data can reveal your best prospects. Here's how contractors are using property intelligence.",
    date: "February 1, 2025",
    readTime: "6 min read",
    category: "Lead Generation",
    content: `
Property data isn't just for real estate agents. Smart contractors are using property intelligence to find better leads, prioritize their outreach, and close more jobs.

## What Property Data Can Tell You

### Age of the Home

Older homes need more work. A 1970s home likely has:
- Original HVAC approaching end of life
- Outdated electrical panels
- Aging plumbing
- Roofing that's been replaced (or needs to be)

### Recent Sales

When a home sells, the new owner often:
- Gets an inspection
- Discovers issues
- Needs contractors to fix them

### Permit History

Permits reveal what work has been done — and what hasn't:
- No HVAC permit in 20 years? System might need replacement
- Bathroom permit but no plumbing? They might have done it themselves
- Recent electrical permit? Maybe they're planning more renovations

### Property Value

Higher-value homes often mean:
- Bigger budgets
- More willingness to pay for quality
- Less price shopping

## Strategies by Industry

### HVAC

Look for homes built 15-25 years ago with no recent HVAC permits. The original system is likely approaching end of life.

### Plumbing

Target homes with original plumbing (pre-1980s). Look for remodeling permits without corresponding plumbing work.

### Electrical

Homes built before 1990 often have 100-amp panels. Homeowners adding EVs, hot tubs, or solar need upgrades.

### Roofing

Track home age and cross-reference with permit history. No roofing permit in 20+ years? Time for replacement.

## Putting It Into Practice

1. **Define your ideal property profile:** Age, value range, location
2. **Set up alerts:** Get notified when matching properties sell
3. **Review permit history:** Identify specific opportunities
4. **Personalize outreach:** Reference property-specific details

## The Bottom Line

Generic marketing reaches everyone. Property-targeted marketing reaches the right people with the right message at the right time. That's how you win more jobs.
    `,
  },
  "hvac-permit-prospecting": {
    slug: "hvac-permit-prospecting",
    title: "HVAC Permit Prospecting: Find Aging Systems Before They Fail",
    excerpt: "Building permits tell a story. Learn how to use permit data to find homes with aging HVAC systems ready for replacement.",
    date: "January 28, 2025",
    readTime: "5 min read",
    category: "HVAC",
    content: `
The average HVAC system lasts 15-20 years. Building permits can tell you exactly when a system was installed — and when it's approaching end of life.

## How Permit Prospecting Works

### 1. Find Original Install Dates

Building permits are public record. When a home was built or when major work was done, permits were pulled. HVAC permits show when systems were installed.

### 2. Calculate System Age

If a home was built in 2005 with the original HVAC, that system is now 20 years old. Prime replacement territory.

### 3. Identify Opportunities

Homes with 15-20 year old systems are your best prospects:
- Old enough that failure is imminent
- New enough that homeowners are still there
- Valuable enough that replacement makes sense

## What to Look For

### Original Construction Permits

The HVAC installed when the home was built is often still there. No subsequent HVAC permits? It's the original system.

### Replacement Permits

If there's an HVAC permit from 2005, add 15-20 years. That replacement is now approaching end of life.

### Addition Permits

Home additions often include HVAC work. Check if the addition's system matches the main home or is separate.

## Outreach Strategies

### Maintenance Offer

"Your HVAC system is approaching 18 years old. We'd love to offer a complimentary inspection to ensure it's running efficiently."

### Replacement Planning

"Systems typically last 15-20 years. Planning ahead can help you avoid emergency replacements during peak season."

### Energy Efficiency

"Modern systems are 30-50% more efficient than those installed 15+ years ago. Want to see what you could save?"

## The Bottom Line

Permit data takes the guesswork out of prospecting. Instead of hoping someone needs your services, you can find homeowners who definitely will — soon.
    `,
  },
  "how-to-handle-no-show-customers": {
    slug: "how-to-handle-no-show-customers",
    title: "How to Handle No-Show Customers (Without Losing Your Mind)",
    excerpt: "No-shows cost service businesses thousands every year. Here's a practical guide to reducing them and protecting your revenue.",
    date: "January 25, 2025",
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

This is where tracking reliability pays off. If a customer no-shows once, note it. If they do it again, their score drops. Before scheduling their next appointment, you can see their history and decide whether to require a deposit.

### 4. Implement a Cancellation Policy

Make it clear: cancellations with less than 24 hours notice may incur a fee. Put it on your website, in your booking confirmation, and in your reminder texts.

## The Bottom Line

No-shows will never be zero, but they can be dramatically reduced with the right systems. Track your customers, remind them of appointments, and require deposits from those who've burned you before.
    `,
  },
  "building-contractor-network": {
    slug: "building-contractor-network",
    title: "Why Contractors Are Joining Reliability Networks",
    excerpt: "A growing number of service businesses are sharing customer reliability data. Here's why it matters and how it works.",
    date: "January 20, 2025",
    readTime: "4 min read",
    category: "Network",
    content: `
You know that customer who no-showed on you last month? There's a good chance they did the same thing to another contractor. And another. And another.

Problem customers don't just target one business. They're serial offenders. That's why contractors are coming together to share reliability data.

## The Problem: Information Silos

Every contractor has their own customer list. Their own notes. Their own mental list of people to avoid. But that information stays locked in their head or their filing cabinet.

When a problem customer moves on to a new contractor, they start fresh. No history. No warnings. Just another unsuspecting business about to get burned.

## The Solution: Shared Networks

Contractor networks change this. When multiple businesses share (anonymized) customer reliability data, everyone benefits:

- See if a customer has problems before booking them
- Avoid repeat offenders who bounce between contractors
- Protect your time and revenue

## How It Works

### Verification First

Only verified businesses can join. This prevents fake reports and ensures data quality.

### Report Events

When something happens — no-show, late payment, dispute — you log it. Takes 30 seconds.

### Search Before Booking

When a new customer calls, search by phone or address. See if anyone else has reported issues.

### Anonymized Data

You don't see who reported what. You just see that 2 businesses reported payment issues in the past year. That's enough to make an informed decision.

## Why It's Growing

Contractors talk. Word spreads about problem customers. Networks just make that process more efficient and comprehensive.

The more contractors who join, the more valuable the network becomes. It's a classic network effect.

## The Bottom Line

You don't have to go it alone. By joining a contractor network, you benefit from the collective experience of hundreds of businesses — and protect yourself from customers who've burned others before you.
    `,
  },
  "when-to-require-deposits": {
    slug: "when-to-require-deposits",
    title: "When Should You Require a Deposit? A Data-Driven Guide",
    excerpt: "Deposits can protect your business, but asking at the wrong time can scare customers away. Here's what the data says.",
    date: "January 15, 2025",
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
  "plumber-lead-generation-property-data": {
    slug: "plumber-lead-generation-property-data",
    title: "Plumber's Guide to Property-Based Lead Generation",
    excerpt: "From water heater age to sewer line prospects, here's how plumbers are using property data to find qualified leads.",
    date: "January 10, 2025",
    readTime: "6 min read",
    category: "Plumbing",
    content: `
Plumbing problems don't happen randomly. They're predictable based on property age, construction type, and maintenance history. Smart plumbers use this data to find leads before the emergency happens.

## High-Value Plumbing Prospects

### Water Heater Replacement

Water heaters last 10-12 years. Properties with homes built or remodeled 10+ years ago are prime candidates for replacement. Proactive outreach beats emergency calls.

### Sewer Line Issues

Homes built before 1970 often have clay or cast iron sewer lines. These are prone to root intrusion and deterioration. Target older neighborhoods with mature trees.

### Repiping Candidates

Galvanized pipes were common until the 1960s. Homes with original plumbing are ticking time bombs. Low water pressure complaints are your signal.

### New Construction & Remodels

Building permits for additions, basement finishes, or bathroom remodels all need plumbing. Get to them before they choose a competitor.

## Using Property Data

### Age Analysis

Filter properties by year built. 1950s homes have different needs than 2000s homes. Tailor your outreach accordingly.

### Permit History

No plumbing permits in 30 years? Either nothing's broken (unlikely) or they're using handymen. Time for professional service.

### Recent Sales

New homeowners get inspections. Inspections reveal plumbing issues. New owners need plumbers.

## Outreach Examples

### Water Heater Proactive

"Hi! We noticed your home was built in 2012. Most water heaters need replacement around the 12-year mark. Want us to check yours before it fails?"

### Sewer Line Awareness

"Homes in your neighborhood were built with clay sewer lines. We're offering camera inspections at 50% off to help homeowners identify issues before they become emergencies."

### New Homeowner Welcome

"Congratulations on your new home! As a local plumber, we'd love to offer you a free plumbing inspection to help you understand your system."

## The Bottom Line

Plumbing problems are predictable. Property data helps you find customers who need you — before they're standing in a flooded basement calling every plumber in the phone book.
    `,
  },
  "5-red-flags-unreliable-customers": {
    slug: "5-red-flags-unreliable-customers",
    title: "5 Red Flags That Signal an Unreliable Customer",
    excerpt: "After analyzing thousands of customer interactions, we've identified the most common warning signs of problem customers.",
    date: "January 5, 2025",
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
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-charcoal"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-copper/20 px-3 py-1 text-sm font-medium text-copper">
              {post.category}
            </span>
            <span className="text-sm text-text-muted">{post.readTime}</span>
          </div>

          <h1 className="text-3xl font-bold text-charcoal md:text-4xl">{post.title}</h1>

          <p className="mt-4 text-lg text-text-secondary">{post.excerpt}</p>

          <div className="mt-6 flex items-center gap-4 border-b border-border pb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-copper/20">
              <span className="text-sm font-medium text-copper">FS</span>
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal">ForSure Team</p>
              <p className="text-sm text-text-muted">{post.date}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="prose max-w-none">
            {paragraphs.map((para, index) => {
              const trimmed = para.trim();

              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={index} className="mb-4 mt-8 text-xl font-bold text-charcoal">
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }

              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={index} className="mb-3 mt-6 text-lg font-semibold text-charcoal">
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }

              if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                return (
                  <p key={index} className="mb-4 font-semibold text-charcoal">
                    {trimmed.replace(/\*\*/g, "")}
                  </p>
                );
              }

              if (trimmed.startsWith("- ")) {
                const items = trimmed.split("\n");
                return (
                  <ul key={index} className="mb-4 list-disc pl-6 text-text-secondary">
                    {items.map((item, i) => (
                      <li key={i} className="mb-1">{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }

              if (trimmed.match(/^\d+\. /)) {
                const items = trimmed.split("\n");
                return (
                  <ol key={index} className="mb-4 list-decimal pl-6 text-text-secondary">
                    {items.map((item, i) => (
                      <li key={i} className="mb-1">{item.replace(/^\d+\. /, "")}</li>
                    ))}
                  </ol>
                );
              }

              if (trimmed === "") {
                return null;
              }

              return (
                <p key={index} className="mb-4 text-text-secondary">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-charcoal">Ready to find leads and protect your business?</h2>
          <p className="mt-4 text-text-secondary">
            Join contractors using ForSure to find new homeowner leads and check customer reliability.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-lg bg-copper px-8 py-3 font-semibold text-white hover:bg-copper-dark"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
