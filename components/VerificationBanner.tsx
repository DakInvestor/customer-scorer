"use client";

import Link from "next/link";

interface VerificationBannerProps {
  status: "unverified" | "pending" | "verified" | "rejected";
}

export default function VerificationBanner({ status }: VerificationBannerProps) {
  if (status === "verified") {
    return null;
  }

  let bannerClass = "border-b px-4 py-3 ";
  let iconClass = "h-4 w-4 ";
  let textClass = "text-sm ";
  let buttonClass = "rounded px-3 py-1 text-sm font-medium ";
  let message = "";
  let buttonText = "";
  let iconPath = "";

  if (status === "pending") {
    bannerClass += "border-amber/30 bg-amber/10";
    iconClass += "text-amber";
    textClass += "text-amber";
    buttonClass += "bg-amber/20 text-amber hover:bg-amber/30";
    message = "Verification pending — We're reviewing your submission.";
    buttonText = "View Status";
    iconPath = "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z";
  } else if (status === "rejected") {
    bannerClass += "border-critical/30 bg-critical/10";
    iconClass += "text-critical";
    textClass += "text-critical";
    buttonClass += "bg-critical/20 text-critical hover:bg-critical/30";
    message = "Verification rejected — Please review and resubmit.";
    buttonText = "Resubmit";
    iconPath = "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
  } else {
    bannerClass += "border-copper/30 bg-copper/10";
    iconClass += "text-copper";
    textClass += "text-copper";
    buttonClass += "bg-copper/20 text-copper hover:bg-copper/30";
    message = "Verify your business to access all features.";
    buttonText = "Verify Now";
    iconPath = "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z";
  }

  return (
    <div className={bannerClass}>
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
          </svg>
          <span className={textClass}>{message}</span>
        </div>
        <Link href="/app/verify" className={buttonClass}>
          {buttonText}
        </Link>
      </div>
    </div>
  );
}