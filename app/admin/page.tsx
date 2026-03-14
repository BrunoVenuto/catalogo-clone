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
      <div className="flex flex-col items-center justify-center py-32 text-mega-orange font-bold">
        <span className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-mega-orange animate-spin mb-4"></span>
        CARREGANDO PAINEL...
      </div>
    );
  }

    if (!session) {
      return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-lg relative">
          <h2 className="text-2xl font-black text-gray-100 tracking-tight mb-6 text-center uppercase">
            Acesso Restrito
          </h2>

        {authError && (
          <div className="bg-red-50 border border-red-200 p-3 mb-6 text-sm text-red-700 rounded-md">
            Erro: {authError}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-400 text-sm font-bold uppercase tracking-wide mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121212] border border-gray-800 rounded-md p-3 text-gray-100 focus:outline-none focus:border-mega-orange focus:ring-1 focus:ring-mega-orange transition-all placeholder-gray-600"
              placeholder="admin@mgpharma.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold uppercase tracking-wide mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121212] border border-gray-800 rounded-md p-3 text-gray-100 focus:outline-none focus:border-mega-orange focus:ring-1 focus:ring-mega-orange transition-all placeholder-gray-600"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full bg-mega-orange text-white py-3 rounded-md font-black uppercase tracking-wide hover:bg-[#e65c00] transition-colors shadow-md"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    );
  }

  // --- DASHBOARD OVERVIEW ---
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-l-4 border-mega-orange pl-4 py-2 bg-gradient-to-r from-mega-orange/10 to-transparent rounded-r-lg">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-100 uppercase tracking-tight">Visão Geral</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium pb-1">Conectado como {session?.user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-mega-orange transition-all group">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4 group-hover:text-mega-orange transition-colors">
            Faturamento Hoje
          </h3>
          <p className="text-3xl lg:text-4xl font-black text-gray-100">{money(stats.todayRevenue)}</p>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-mega-orange transition-all group">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4 group-hover:text-mega-orange transition-colors">
            Faturamento Total
          </h3>
          <p className="text-3xl lg:text-4xl font-black text-gray-100">{money(stats.totalRevenue)}</p>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-mega-orange transition-all group">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4 group-hover:text-mega-orange transition-colors">
            Pedidos Gerados
          </h3>
          <p className="text-3xl lg:text-4xl font-black text-gray-100">{stats.totalOrders}</p>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-mega-orange transition-all group flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4 group-hover:text-mega-orange transition-colors">
              Produtos Ativos
            </h3>
            <p className="text-3xl lg:text-4xl font-black text-gray-100">{productsCount}</p>
          </div>
          <Link href="/admin/produtos" className="mt-4 inline-block text-mega-orange text-sm font-bold hover:underline uppercase tracking-wide">
            Gerenciar Catálogo &gt;
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* TOP PRODUCTS */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-black text-gray-100 uppercase tracking-tight mb-6 border-b border-gray-800 pb-4">
            Top 5 Mais Vendidos
          </h3>

          <div className="space-y-4 text-sm mt-4">
            {stats.topProducts.map((p, index) => (
              <div key={index} className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="text-gray-200 font-bold truncate pr-4">
                  {index + 1}. {p.name}
                </span>
                <div className="flex flex-col items-end text-right whitespace-nowrap">
                  <span className="text-mega-orange font-black text-base">{p.quantity} un.</span>
                  <span className="text-gray-400 uppercase text-xs font-bold">Fat: {money(p.revenue)}</span>
                </div>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <p className="text-gray-500 text-center py-8 font-medium">Nenhum dado encontrado para o período.</p>
            )}
          </div>
        </div>

        {/* LATEST ORDERS */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-black text-gray-100 uppercase tracking-tight mb-6 border-b border-gray-800 pb-4">
            Últimas Vendas
          </h3>

          <div className="space-y-4 text-sm mt-4">
            {stats.lastOrders.map((o) => (
              <div key={o.id} className="border border-gray-800 rounded-lg bg-[#121212] p-4 hover:border-mega-orange transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-mega-orange font-black">Pedido #{o.id.slice(-6).toUpperCase()}</span>
                  <span className="text-gray-100 font-black text-base">{money(o.total)}</span>
                </div>
                <p className="text-gray-400 text-xs font-bold mb-2">
                  {o.customer?.name} &bull; {o.createdAt.toLocaleDateString('pt-BR')} {o.createdAt.toLocaleTimeString('pt-BR')}
                </p>
                <div className="text-gray-400 text-xs font-medium bg-[#1a1a1a] p-2 rounded border border-gray-800">
                  {o.items.map((it: any) => `${it.quantity}x ${it.name}`).join(', ')}
                </div>
              </div>
            ))}
            {stats.lastOrders.length === 0 && (
              <p className="text-gray-500 text-center py-8 font-medium">Nenhuma transação recente encontrada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
