import "./globals.css";
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "ForSure — Customer Reliability for Service Businesses",
  description: "Protect your service business from unreliable customers. Track customer history, identify patterns, and make informed decisions with ForSure.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(outfit.className, "bg-cream text-text-primary antialiased")}>
        {children}
      </body>
    </html>
  );
}
