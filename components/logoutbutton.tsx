"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-gray hover:bg-slate-700 hover:text-white"
    >
      Sign out
    </button>
  );
}