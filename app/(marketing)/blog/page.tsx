import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  icon: string;
}

const posts: BlogPost[] = [
  {
    slug: "new-homeowner-leads-guide",
    title: "The Complete Guide to New Homeowner Leads for Contractors",
    excerpt: "New homeowners need services within 90 days of moving in. Here's how to find them, reach them, and win their business before competitors.",
    date: "February 8, 2025",
    readTime: "7 min read",
    category: "Lead Generation",
    icon: "🏠",
  },
  {
    slug: "network-search-check-customers",
    title: "How to Check Customers Before Booking: A Network Search Guide",
    excerpt: "Learn how verified contractor networks help you avoid no-shows, payment issues, and problem customers before you commit to a job.",
    date: "February 5, 2025",
    readTime: "5 min read",
    category: "Network",
    icon: "🔍",
  },
  {
    slug: "property-data-lead-generation",
    title: "Using Property Data to Find High-Value Leads",
    excerpt: "Property records, permit history, and sales data can reveal your best prospects. Here's how contractors are using property intelligence.",
    date: "February 1, 2025",
    readTime: "6 min read",
    category: "Lead Generation",
    icon: "📊",
  },
  {
    slug: "hvac-permit-prospecting",
    title: "HVAC Permit Prospecting: Find Aging Systems Before They Fail",
    excerpt: "Building permits tell a story. Learn how to use permit data to find homes with aging HVAC systems ready for replacement.",
    date: "January 28, 2025",
    readTime: "5 min read",
    category: "HVAC",
    icon: "❄️",
  },
  {
    slug: "how-to-handle-no-show-customers",
    title: "How to Handle No-Show Customers (Without Losing Your Mind)",
    excerpt: "No-shows cost service businesses thousands every year. Here's a practical guide to reducing them and protecting your revenue.",
    date: "January 25, 2025",
    readTime: "5 min read",
    category: "Best Practices",
    icon: "📝",
  },
  {
    slug: "building-contractor-network",
    title: "Why Contractors Are Joining Reliability Networks",
    excerpt: "A growing number of service businesses are sharing customer reliability data. Here's why it matters and how it works.",
    date: "January 20, 2025",
    readTime: "4 min read",
    category: "Network",
    icon: "🤝",
  },
  {
    slug: "when-to-require-deposits",
    title: "When Should You Require a Deposit? A Data-Driven Guide",
    excerpt: "Deposits can protect your business, but asking at the wrong time can scare customers away. Here's what the data says.",
    date: "January 15, 2025",
    readTime: "4 min read",
    category: "Best Practices",
    icon: "💰",
  },
  {
    slug: "plumber-lead-generation-property-data",
    title: "Plumber's Guide to Property-Based Lead Generation",
    excerpt: "From water heater age to sewer line prospects, here's how plumbers are using property data to find qualified leads.",
    date: "January 10, 2025",
    readTime: "6 min read",
    category: "Plumbing",
    icon: "🔧",
  },
  {
    slug: "5-red-flags-unreliable-customers",
    title: "5 Red Flags That Signal an Unreliable Customer",
    excerpt: "After analyzing thousands of customer interactions, we've identified the most common warning signs of problem customers.",
    date: "January 5, 2025",
    readTime: "4 min read",
    category: "Tips",
    icon: "🚩",
  },
];

export default function BlogPage() {
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-charcoal md:text-5xl">
            ForSure Blog
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Lead generation strategies, customer management tips, and industry insights for contractors.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="px-4 pb-12">
        <div className="mx-auto max-w-5xl">
          <Link
            href={"/blog/" + featuredPost.slug}
            className="group block overflow-hidden rounded-2xl border border-border bg-white transition-all hover:shadow-lg"
          >
            <div className="flex flex-col md:flex-row">
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-copper/20 to-emerald/20 md:h-auto md:w-1/2">
                <div className="text-center">
                  <div className="text-6xl">{featuredPost.icon}</div>
                </div>
              </div>
              <div className="p-6 md:w-1/2 md:p-8">
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-full bg-copper/20 px-3 py-1 text-xs font-medium text-copper">
                    {featuredPost.category}
                  </span>
                  <span className="text-sm text-text-muted">{featuredPost.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-charcoal group-hover:text-copper">
                  {featuredPost.title}
                </h2>
                <p className="mt-3 text-text-secondary">{featuredPost.excerpt}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-copper">
                  Read article
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 pb-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-2">
            {["All", "Lead Generation", "Network", "Best Practices", "HVAC", "Plumbing", "Tips"].map(
              (category) => (
                <button
                  key={category}
                  className={`rounded-full px-4 py-1.5 text-sm ${
                    category === "All"
                      ? "bg-charcoal text-white"
                      : "bg-white text-text-secondary hover:bg-surface"
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* Post Grid */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {remainingPosts.map((post) => (
              <Link
                key={post.slug}
                href={"/blog/" + post.slug}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-all hover:shadow-md"
              >
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-surface to-cream">
                  <div className="text-4xl">{post.icon}</div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-text-muted">
                      {post.category}
                    </span>
                    <span className="text-xs text-text-muted">{post.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-charcoal group-hover:text-copper">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-text-secondary">{post.excerpt}</p>
                  <p className="mt-3 text-xs text-text-muted">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold text-charcoal">Get tips delivered to your inbox</h2>
          <p className="mt-4 text-text-secondary">
            Join contractors getting weekly tips on lead generation and customer management.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-border bg-cream px-4 py-3 text-charcoal placeholder-text-muted outline-none focus:border-copper"
            />
            <button
              type="submit"
              className="rounded-lg bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-xs text-text-muted">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
