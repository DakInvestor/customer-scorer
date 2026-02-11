"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  businessId: string;
  customerCount: number;
  eventCount: number;
  hasSearchedNetwork: boolean;
};

type ChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
  href?: string;
  progress?: string;
};

export default function DashboardChecklist({
  businessId,
  customerCount,
  eventCount,
  hasSearchedNetwork,
}: Props) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  const items: ChecklistItem[] = [
    {
      id: "account",
      label: "Create your account",
      completed: true,
    },
    {
      id: "first-customer",
      label: "Add your first customer",
      completed: customerCount >= 1,
      href: "/app/add-customer",
    },
    {
      id: "five-customers",
      label: "Add 5 customers",
      completed: customerCount >= 5,
      href: "/app/add-customer",
      progress: customerCount < 5 ? `${customerCount}/5` : undefined,
    },
    {
      id: "first-event",
      label: "Log your first event",
      completed: eventCount >= 1,
      href: "/app/customers",
    },
    {
      id: "network-search",
      label: "Try a network search",
      completed: hasSearchedNetwork,
      href: "/app/network",
    },
  ];

  const completedCount = items.filter((item) => item.completed).length;
  const allComplete = completedCount === items.length;

  async function handleDismiss() {
    const supabase = createSupabaseBrowserClient();
    await supabase
      .from("businesses")
      .update({ checklist_dismissed: true })
      .eq("id", businessId);
    setDismissed(true);
    router.refresh();
  }

  if (dismissed || allComplete) {
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border border-border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-charcoal">Getting Started with ForSure</h2>
        <span className="text-sm text-text-muted">
          {completedCount}/{items.length} complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full bg-copper transition-all duration-300"
          style={{ width: `${(completedCount / items.length) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg px-2 py-1.5"
          >
            <div className="flex items-center gap-3">
              {item.completed ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald text-xs text-white">
                  ✓
                </span>
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-border" />
              )}
              <span
                className={`text-sm ${
                  item.completed ? "text-text-muted line-through" : "text-charcoal"
                }`}
              >
                {item.label}
              </span>
              {item.progress && (
                <span className="text-xs text-text-muted">({item.progress})</span>
              )}
            </div>
            {!item.completed && item.href && (
              <Link
                href={item.href}
                className="text-xs text-copper hover:text-copper-dark"
              >
                Start →
              </Link>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleDismiss}
        className="mt-4 text-xs text-text-muted hover:text-text-secondary"
      >
        Dismiss
      </button>
    </div>
  );
}
