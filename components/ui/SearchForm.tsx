"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SearchFormProps = {
  initialQuery: string;
};

export default function SearchForm({ initialQuery }: SearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();

    if (!q) {
      router.push("/search");
    } else {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="text"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name, phone, or email..."
        className="flex-1 rounded bg-surface px-3 py-2 text-sm text-charcoal outline-none"
      />
      <button
        type="submit"
        className="rounded bg-copper px-4 py-2 text-sm font-semibold text-white hover:bg-copper-dark"
      >
        Search
      </button>
    </form>
  );
}