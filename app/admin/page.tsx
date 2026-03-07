"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { getProducts } from "@/services/products";
import { getDashboardStats } from "@/services/orders";

function money(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [productsCount, setProductsCount] = useState(0);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    topProducts: [] as Array<{ name: string, quantity: number, revenue: number }>,
    lastOrders: [] as Array<any>
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession) {
        loadDashboardStats();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        if (currentSession) {
          loadDashboardStats();
        } else {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function loadDashboardStats() {
    setLoading(true);
    try {
      const prods = await getProducts();
      setProductsCount(prods.length);

      const orderStats = await getDashboardStats();
      setStats(orderStats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setAuthError("Credential rejection: " + error.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-cyan-400 font-mono">
        <span className="w-8 h-8 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin mb-4"></span>
        [ INICIANDO PROTOCOLO DE AUTENTICAÇÃO... ]
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-black/80 backdrop-blur-md border border-fuchsia-500/30 cyber-clip relative shadow-[0_0_30px_rgba(217,70,239,0.1)]">
        {/* Borders */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-fuchsia-500/50 m-2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 m-2 pointer-events-none"></div>

        <h2 className="text-2xl font-black font-mono text-fuchsia-500 tracking-wider mb-6 text-center uppercase">
          {"<"} IDENTITY_CHECK {">"}
        </h2>

        {authError && (
          <div className="bg-red-950/50 border border-red-500 p-3 mb-6 font-mono text-xs text-red-400 animate-pulse">
            [ERRO_SISTÊMICO] {authError}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6 font-mono">
          <div>
            <label className="block text-cyan-400 text-xs tracking-widest uppercase mb-2">
              Credencial_Origem_Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-900 border border-white/20 p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
              placeholder="admin@nexus.com"
              required
            />
          </div>
          <div>
            <label className="block text-cyan-400 text-xs tracking-widest uppercase mb-2">
              Chave_Padrão_Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-900 border border-white/20 p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-fuchsia-600/20 border border-fuchsia-500 text-fuchsia-400 py-3 font-bold uppercase tracking-wider hover:bg-fuchsia-500 hover:text-black transition-all cyber-clip"
          >
            [ FORNECER ACESSO ]
          </button>
        </form>
      </div>
    );
  }

  // --- DASHBOARD OVERVIEW ---
  return (
    <div className="space-y-8 font-mono animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-l-4 border-cyan-500 pl-4 py-2 bg-gradient-to-r from-cyan-900/20 to-transparent">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Status do Sistema</h2>
          <p className="text-sm text-cyan-400 mt-1">Bem-vindo(a), {session?.user?.email}</p>
        </div>
        <button onClick={handleLogout} className="text-xs text-neutral-400 hover:text-fuchsia-400 uppercase tracking-widest transition-colors border-b border-transparent hover:border-fuchsia-400">
          [X] Encerrar_Sessão
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-neutral-900 border border-white/10 cyber-clip p-6 hover:border-cyan-500/50 transition-colors group">
          <h3 className="text-sm text-neutral-400 uppercase tracking-widest mb-4 group-hover:text-cyan-400">
            Faturamento Hoje
          </h3>
          <p className="text-3xl lg:text-4xl font-black text-white">{money(stats.todayRevenue)}</p>
        </div>

        <div className="bg-neutral-900 border border-white/10 cyber-clip p-6 hover:border-cyan-500/50 transition-colors group">
          <h3 className="text-sm text-neutral-400 uppercase tracking-widest mb-4 group-hover:text-cyan-400">
            Faturamento Total
          </h3>
          <p className="text-3xl lg:text-4xl font-black text-white">{money(stats.totalRevenue)}</p>
        </div>

        <div className="bg-neutral-900 border border-white/10 cyber-clip p-6 hover:border-cyan-500/50 transition-colors group">
          <h3 className="text-sm text-neutral-400 uppercase tracking-widest mb-4 group-hover:text-cyan-400">
            Pedidos Gerados
          </h3>
          <p className="text-3xl lg:text-4xl font-black text-white">{stats.totalOrders}</p>
        </div>

        <div className="bg-neutral-900 border border-white/10 cyber-clip p-6 hover:border-cyan-500/50 transition-colors group flex flex-col justify-between">
          <div>
            <h3 className="text-sm text-neutral-400 uppercase tracking-widest mb-4 group-hover:text-cyan-400">
              Produtos Indexados
            </h3>
            <p className="text-3xl lg:text-4xl font-black text-white">{productsCount}</p>
          </div>
          <Link href="/admin/produtos" className="mt-4 inline-block text-cyan-500 text-sm hover:underline uppercase tracking-wide">
            Gerenciar {">"}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* TOP PRODUCTS */}
        <div className="bg-neutral-900 border border-white/10 p-6 cyber-clip">
          <h3 className="text-lg font-bold text-fuchsia-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
            [ TOP 5 PRODUTOS VENDIDOS ]
          </h3>

          <div className="space-y-4 text-sm mt-4">
            {stats.topProducts.map((p, index) => (
              <div key={index} className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-white truncate pr-4">
                  {index + 1}. {p.name}
                </span>
                <div className="flex flex-col items-end text-right whitespace-nowrap">
                  <span className="text-cyan-400 font-bold">{p.quantity} un.</span>
                  <span className="text-neutral-500 uppercase text-xs">Fat: {money(p.revenue)}</span>
                </div>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <p className="text-neutral-500 text-center py-8">{"< NENHUM_DADO_ENCONTRADO />"}</p>
            )}
          </div>
        </div>

        {/* LATEST ORDERS */}
        <div className="bg-neutral-900 border border-white/10 p-6 cyber-clip">
          <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
            [ ÚLTIMAS TRANSAÇÕES ]
          </h3>

          <div className="space-y-4 text-sm mt-4">
            {stats.lastOrders.map((o) => (
              <div key={o.id} className="border border-white/5 bg-black/50 p-3 hover:border-cyan-500/30 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-fuchsia-400 font-bold">#{o.id.slice(-6).toUpperCase()}</span>
                  <span className="text-white font-bold">{money(o.total)}</span>
                </div>
                <p className="text-neutral-400 uppercase text-xs mb-2">
                  {o.customer?.name} - {o.createdAt.toLocaleDateString('pt-BR')} {o.createdAt.toLocaleTimeString('pt-BR')}
                </p>
                <div className="text-neutral-500 text-xs">
                  {o.items.map((it: any) => `${it.quantity}x ${it.name}`).join(', ')}
                </div>
              </div>
            ))}
            {stats.lastOrders.length === 0 && (
              <p className="text-neutral-500 text-center py-8">{"< NENHUM_DADO_ENCONTRADO />"}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
