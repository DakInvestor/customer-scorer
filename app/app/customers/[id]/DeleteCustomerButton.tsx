// app/customers/[id]/DeleteCustomerButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  customerId: string;
  customerName: string | null;
};

export default function DeleteCustomerButton({ customerId, customerName }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();

      // Delete notes first (foreign key constraint)
      await supabase
        .from("customer_notes")
        .delete()
        .eq("customer_id", customerId);

      // Delete customer
      const { error: deleteError } = await supabase
        .from("customers")
        .delete()
        .eq("id", customerId);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      router.push("/customers");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Failed to delete customer.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-critical/30 bg-critical/10 px-4 py-2 text-sm font-medium text-critical hover:bg-critical/20"
      >
        Delete
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-xl font-semibold text-charcoal">Delete Customer</h2>
            <p className="mb-4 text-text-secondary">
              Are you sure you want to delete{" "}
              <strong className="text-charcoal">{customerName || "this customer"}</strong>?
              This will also delete all their event history. This action cannot be undone.
            </p>

            {error && (
              <div className="mb-4 rounded-md border border-critical/30 bg-critical/10 px-4 py-2 text-sm text-critical">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-lg bg-critical py-2.5 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-border bg-white py-2.5 font-semibold text-charcoal hover:bg-cream"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}