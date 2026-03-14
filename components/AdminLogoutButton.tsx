"use client";

import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="ml-auto md:ml-4 bg-red-950/20 text-red-500 border border-red-900/50 px-4 py-2 rounded font-bold uppercase hover:bg-red-900/40 hover:text-red-400 transition-colors"
    >
      Sair
    </button>
  );
}
