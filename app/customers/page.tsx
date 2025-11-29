// app/customers/page.tsx
import { supabase } from "@/lib/supabaseClient";
import { calculateCustomerScore } from "@/lib/scoring";
import type { NoteForScoring } from "@/lib/scoring";
import CustomersTable from "@/components/ui/CustomersTable";

type Customer = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
};

type NoteRow = NoteForScoring & {
  customer_id: string;
};

type CustomerWithScore = Customer & {
  score: number;
};

export default async function CustomersPage() {
  // Load customers
  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading customers", error);
    return (
      <div className="p-8">
        <h1 className="mb-4 text-3xl font-bold">Customers</h1>
        <p className="text-sm text-red-400">
          Failed to load customers. Check the console/logs.
        </p>
      </div>
    );
  }

  const typedCustomers = (customers ?? []) as Customer[];
  let customersWithScore: CustomerWithScore[] = [];

  if (typedCustomers.length > 0) {
    const customerIds = typedCustomers.map((c) => c.id);

    const { data: notesData, error: notesError } = await supabase
      .from("customer_notes")
      .select("customer_id, severity, created_at")
      .in("customer_id", customerIds);

    if (notesError) {
      console.error("Error loading notes for customers", notesError);
    }

    const typedNotes = (notesData ?? []) as NoteRow[];

    const notesByCustomer: Record<string, NoteForScoring[]> = {};
    for (const note of typedNotes) {
      if (!notesByCustomer[note.customer_id]) {
        notesByCustomer[note.customer_id] = [];
      }
      notesByCustomer[note.customer_id].push({
        severity: note.severity,
        created_at: note.created_at,
      });
    }

    customersWithScore = typedCustomers.map((customer) => {
      const notesForCustomer = notesByCustomer[customer.id] ?? [];
      const score = calculateCustomerScore(notesForCustomer);
      return { ...customer, score };
    });
  }

  return (
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-bold">Customers</h1>
      <p className="mb-4 text-sm text-gray-300">
        Manage the customers you&apos;ve scored and added to the system.
      </p>

      <CustomersTable customers={customersWithScore} />
    </div>
  );
}
