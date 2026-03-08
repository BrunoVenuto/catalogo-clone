"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const nextUrl = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push(nextUrl);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-black text-center text-gray-900 mb-2 uppercase tracking-tight">Login Admin</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Acesse o painel MegaGym</p>

        {errorMsg ? (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMsg}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">E-mail</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-mega-orange focus:ring-1 focus:ring-mega-orange transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">Senha</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-mega-orange focus:ring-1 focus:ring-mega-orange transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-mega-orange px-4 py-3 text-base font-black uppercase tracking-wide text-white hover:bg-[#e65c00] transition-colors disabled:opacity-60 shadow-md mt-4"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}