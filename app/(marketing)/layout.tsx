import MarketingHeader from "@/components/MarketingHeader";
import MarketingFooter from "@/components/MarketingFooter";

export const metadata = {
  title: "ForSure — Stop Losing Money on Unreliable Customers",
  description: "Track customer reliability scores, reduce no-shows, and protect your service business revenue. Built for HVAC, plumbing, electrical, and home service contractors.",
  openGraph: {
    title: "ForSure — Stop Losing Money on Unreliable Customers",
    description: "Track customer reliability scores, reduce no-shows, and protect your service business revenue.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ForSure — Stop Losing Money on Unreliable Customers",
    description: "Track customer reliability scores, reduce no-shows, and protect your service business revenue.",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
