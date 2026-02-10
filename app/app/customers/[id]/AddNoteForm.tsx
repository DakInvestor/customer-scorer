// app/customers/[id]/AddNoteForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { updateNetworkFromNoteAction } from "@/app/app/network/actions";

type AddNoteFormProps = {
  customerId: string;
  businessId: string;
  customerPhone: string | null;
  customerEmail: string | null;
};

// Predefined event types grouped by category
const EVENT_OPTIONS = [
  // Positive events (severity 1)
  { value: "GREAT_CUSTOMER", label: "Great customer — pays on time", severity: 1, category: "positive" },
  { value: "REPEAT_CUSTOMER", label: "Repeat customer", severity: 1, category: "positive" },
  { value: "REFERRAL_GIVEN", label: "Gave a referral", severity: 1, category: "positive" },
  { value: "EASY_TO_WORK_WITH", label: "Easy to work with", severity: 1, category: "positive" },
  { value: "LEFT_REVIEW", label: "Left a positive review", severity: 1, category: "positive" },

  // Minor issues (severity 2)
  { value: "MINOR_LATE", label: "Paid late but paid in full", severity: 2, category: "minor" },
  { value: "RESCHEDULE", label: "Rescheduled appointment", severity: 2, category: "minor" },
  { value: "MINOR_COMPLAINT", label: "Minor complaint — resolved", severity: 2, category: "minor" },
  { value: "PARTIAL_PAYMENT", label: "Partial payment — balance pending", severity: 2, category: "minor" },

  // Moderate issues (severity 3)
  { value: "LATE_CANCEL", label: "Late cancellation (<24 hours)", severity: 3, category: "moderate" },
  { value: "DIFFICULT_BEHAVIOR", label: "Difficult or demanding behavior", severity: 3, category: "moderate" },
  { value: "DISPUTED_CHARGES", label: "Disputed charges", severity: 3, category: "moderate" },
  { value: "UNREASONABLE_EXPECTATIONS", label: "Unreasonable expectations", severity: 3, category: "moderate" },

  // Serious issues (severity 4)
  { value: "NO_SHOW", label: "No-show — missed appointment", severity: 4, category: "serious" },
  { value: "VERBAL_ABUSE", label: "Verbal abuse or harassment", severity: 4, category: "serious" },
  { value: "BOUNCED_CHECK", label: "Bounced check / failed payment", severity: 4, category: "serious" },
  { value: "FALSE_COMPLAINT", label: "Filed false complaint", severity: 4, category: "serious" },
  { value: "PROPERTY_ACCESS_DENIED", label: "Denied property access", severity: 4, category: "serious" },

  // Severe issues (severity 5)
  { value: "REFUSED_TO_PAY", label: "Refused to pay", severity: 5, category: "severe" },
  { value: "CHARGEBACK", label: "Chargeback / payment reversal", severity: 5, category: "severe" },
  { value: "THREATS", label: "Threats or intimidation", severity: 5, category: "severe" },
  { value: "PROPERTY_DAMAGE", label: "Caused property damage", severity: 5, category: "severe" },
  { value: "LEGAL_ACTION", label: "Legal action required", severity: 5, category: "severe" },
];

export default function AddNoteForm({ customerId, businessId, customerPhone, customerEmail }: AddNoteFormProps) {
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
    if (!noteText.trim()) return setFormError("Please add a note describing the event.");

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

      // Update network with this event (anonymized)
      await updateNetworkFromNoteAction(customerPhone, customerEmail, severity);

      // Reset form
      setEventCode("");
      setSeverity(null);
      setNoteText("");

      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  // Get severity color
  const getSeverityColor = (sev: number | null) => {
    if (sev === null) return "bg-gray-100 text-text-muted";
    if (sev === 1) return "bg-emerald/20 text-emerald";
    if (sev === 2) return "bg-blue-100 text-blue-700";
    if (sev === 3) return "bg-amber/20 text-amber";
    if (sev === 4) return "bg-orange-100 text-orange-700";
    return "bg-critical/20 text-critical";
  };

  const getSeverityLabel = (sev: number | null) => {
    if (sev === null) return "—";
    if (sev === 1) return "Positive";
    if (sev === 2) return "Minor";
    if (sev === 3) return "Moderate";
    if (sev === 4) return "Serious";
    return "Severe";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-semibold text-charcoal">
            Event type
          </label>

          <div className="text-right">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getSeverityColor(severity)}`}>
              {getSeverityLabel(severity)}
            </span>
          </div>
        </div>

        <select
          value={eventCode}
          onChange={(e) => handleEventChange(e.target.value)}
          className="mb-4 w-full rounded-md border border-border bg-cream px-3 py-2.5 text-sm text-charcoal outline-none focus:ring-2 focus:ring-copper"
        >
          <option value="">Select an event type...</option>
          <optgroup label="Positive">
            {EVENT_OPTIONS.filter(o => o.category === "positive").map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </optgroup>
          <optgroup label="Minor Issues">
            {EVENT_OPTIONS.filter(o => o.category === "minor").map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </optgroup>
          <optgroup label="Moderate Issues">
            {EVENT_OPTIONS.filter(o => o.category === "moderate").map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </optgroup>
          <optgroup label="Serious Issues">
            {EVENT_OPTIONS.filter(o => o.category === "serious").map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </optgroup>
          <optgroup label="Severe Issues">
            {EVENT_OPTIONS.filter(o => o.category === "severe").map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </optgroup>
        </select>

        <label className="mb-1 block text-sm font-semibold text-charcoal">
          Note <span className="text-critical">*</span>
        </label>
        <textarea
          rows={3}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Describe what happened (required for documentation)..."
          className="w-full rounded-md border border-border bg-cream px-3 py-2.5 text-sm text-charcoal outline-none focus:ring-2 focus:ring-copper"
          required
        />
        <p className="mt-1 text-xs text-text-muted">
          Detailed notes help protect your business and improve network accuracy.
        </p>
      </div>

      {formError && (
        <div className="rounded-md border border-critical/30 bg-critical/10 px-4 py-2">
          <p className="text-sm text-critical">{formError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-copper px-6 py-2.5 text-sm font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
      >
        {loading ? "Saving..." : "Log Event"}
      </button>
    </form>
  );
}