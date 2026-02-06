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
        className="rounded-md bg-red-900/50 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-900"
      >
        Delete
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-lg bg-gray-800 p-6">
            <h2 className="mb-2 text-xl font-semibold">Delete customer</h2>
            <p className="mb-4 text-gray-400">
              Are you sure you want to delete{" "}
              <strong className="text-white">{customerName || "this customer"}</strong>?
              This will also delete all their event history. This action cannot be undone.
            </p>

            {error && (
              <div className="mb-4 rounded-md bg-red-900/50 px-4 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-md bg-red-600 py-2.5 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                disabled={deleting}
                className="flex-1 rounded-md bg-gray-700 py-2.5 font-semibold hover:bg-gray-600"
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