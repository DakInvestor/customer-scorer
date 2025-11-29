// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Customer Scorer",
  description: "Rate your customers and analyze reliability trends.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "bg-slate-900 text-slate-50 antialiased"
        )}
      >
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r border-slate-800 bg-slate-950 px-6 py-8">
            {/* Brand */}
            <div className="mb-8">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Customer Scorer
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Look up customers and track reliability.
              </p>
            </div>

            {/* Nav */}
            <nav className="space-y-1 text-sm">
              <NavItem href="/">Dashboard</NavItem>
              <NavItem href="/add-customer">Add customer</NavItem>
              <NavItem href="/customers">Customer list</NavItem>
              <NavItem href="/search">Search customers</NavItem>
              <NavItem href="/analytics">Analytics</NavItem>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 bg-slate-900 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}

// Simple nav item component
type NavItemProps = {
  href: string;
  children: React.ReactNode;
};

function NavItem({ href, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className="block rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
}
