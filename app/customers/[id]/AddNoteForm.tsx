// app/customers/[id]/AddNoteForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AddNoteFormProps = {
  customerId: string;
  businessId: string;
};

// Predefined event types
const EVENT_OPTIONS = [
  { value: "GOOD_PAYER", label: "Great customer — pays on time", severity: 1 },
  { value: "MINOR_ISSUE", label: "Minor issue — late but paid", severity: 2 },
  { value: "LATE_CANCEL", label: "Late cancellation (<2 hours)", severity: 3 },
  { value: "NO_SHOW", label: "No-show", severity: 4 },
  { value: "REFUSED_TO_PAY", label: "Refused to pay / chargeback", severity: 5 },
];

export default function AddNoteForm({ customerId, businessId }: AddNoteFormProps) {
  const router = useRouter();

  const [eventCode, setEventCode] = useState("");
  const [severity, setSeverity] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const selectedEvent = EVENT_OPTIONS.find((opt) => opt.value === eventCode);

  const handleEventChange = (value: string) => {
    setEventCode(value);
    const matched = EVENT_OPTIONS.find((opt) => opt.value === value) || null;
    setSeverity(matched ? matched.severity : null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!eventCode) return setFormError("Please select an event type.");
    if (severity == null) return setFormError("Severity could not be determined.");

    try {
      setLoading(true);

      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase.from("customer_notes").insert({
        customer_id: customerId,
        business_id: businessId,
        note_type: selectedEvent?.label ?? eventCode,
        note_text: noteText.trim() || null,
        severity,
      });

      if (error) {
        console.error("Error inserting note:", error);
        setFormError(error.message || "Failed to save note.");
        return;
      }

      // Reset form
      setEventCode("");
      setSeverity(null);
      setNoteText("");

      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg bg-gray-800 p-4">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-100">
            Event type
          </label>

          <div className="text-right">
            <span className="block text-xs text-gray-300">Severity</span>
            <input
              type="text"
              className="mt-1 w-16 rounded bg-gray-900 px-2 py-1 text-center text-xs text-gray-100"
              value={severity ?? ""}
              disabled
            />
          </div>
        </div>

        <select
          value={eventCode}
          onChange={(e) => handleEventChange(e.target.value)}
          className="mb-4 w-full rounded bg-gray-900 px-3 py-2 text-sm text-gray-100"
        >
          <option value="">Select an event type…</option>
          {EVENT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label className="mb-1 block text-sm font-semibold text-gray-100">
          Note (optional)
        </label>
        <textarea
          rows={3}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Additional details..."
          className="w-full rounded bg-gray-900 px-3 py-2 text-sm text-gray-100"
        />
      </div>

      {formError && <p className="text-sm text-red-400">{formError}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Log event"}
      </button>
    </form>
  );
}