import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
}

const posts: BlogPost[] = [
  {
    slug: "how-to-handle-no-show-customers",
    title: "How to Handle No-Show Customers (Without Losing Your Mind)",
    excerpt: "No-shows cost service businesses thousands every year. Here's a practical guide to reducing them and protecting your revenue.",
    date: "December 5, 2024",
    readTime: "5 min read",
    category: "Best Practices",
  },
  {
    slug: "when-to-require-deposits",
    title: "When Should You Require a Deposit? A Guide for Service Businesses",
    excerpt: "Deposits can protect your business, but asking at the wrong time can scare customers away. Learn when and how to require them.",
    date: "December 1, 2024",
    readTime: "4 min read",
    category: "Best Practices",
  },
  {
    slug: "tracking-customer-reliability-spreadsheet-vs-software",
    title: "Tracking Customer Reliability: Spreadsheet vs. Software",
    excerpt: "Many contractors start with spreadsheets. Here's when it makes sense to upgrade to dedicated software.",
    date: "November 28, 2024",
    readTime: "3 min read",
    category: "Guides",
  },
  {
    slug: "5-red-flags-unreliable-customers",
    title: "5 Red Flags That Signal an Unreliable Customer",
    excerpt: "After talking to hundreds of contractors, we've identified the most common warning signs of problem customers.",
    date: "November 22, 2024",
    readTime: "4 min read",
    category: "Tips",
  },
  {
    slug: "hvac-busy-season-customer-management",
    title: "HVAC Busy Season: How to Prioritize Your Best Customers",
    excerpt: "When summer hits and everyone's AC breaks, you can't serve everyone. Here's how to prioritize without burning bridges.",
    date: "November 15, 2024",
    readTime: "5 min read",
    category: "Industry",
  },
  {
    slug: "customer-scoring-101",
    title: "Customer Scoring 101: What It Is and Why It Matters",
    excerpt: "An introduction to customer reliability scoring and how it can transform your service business.",
    date: "November 10, 2024",
    readTime: "6 min read",
    category: "Guides",
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
            Tips, guides, and best practices for managing customer reliability.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="px-4 pb-12">
        <div className="mx-auto max-w-5xl">
          <Link
            href={"/blog/" + featuredPost.slug}
            className="group block overflow-hidden rounded-2xl border border-border bg-white transition-colors hover:border-border"
          >
            <div className="flex flex-col md:flex-row">
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-copper/20 to-emerald/20 md:h-auto md:w-1/2">
                <div className="text-center">
                  <div className="text-6xl">📊</div>
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

      {/* Post Grid */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {remainingPosts.map(function(post) {
              return (
                <Link
                  key={post.slug}
                  href={"/blog/" + post.slug}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-colors hover:border-border"
                >
                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-surface to-cream">
                    <div className="text-4xl">📝</div>
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold text-charcoal">Get tips delivered to your inbox</h2>
          <p className="mt-4 text-text-secondary">
            Join 500+ service business owners getting weekly tips on customer management.
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
