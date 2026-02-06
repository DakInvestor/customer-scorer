import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Customer Scorer - Track Customer Reliability",
  description: "Protect your service business from unreliable customers. Track reliability scores, identify patterns, and make informed decisions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-deep-navy text-cool-gray antialiased")}>
        {children}
      </body>
    </html>
  );
}