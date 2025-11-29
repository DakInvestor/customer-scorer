"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const BUSINESS_ID =
  process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_ID as string;

export default function AddCustomerPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg("Name and phone are required.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("customers").insert({
        full_name: fullName.trim(),
        email: email.trim() || null,
        phone: phone.trim(),
        business_id: BUSINESS_ID,
      });

      if (error) {
        console.error("Error inserting customer:", error);
        setErrorMsg(error.message || "Failed to add customer.");
        return;
      }

      setFullName("");
      setEmail("");
      setPhone("");
      router.push("/customers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Add customer</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        {/* fields... same as before */}
      </form>
    </div>
  );
}
