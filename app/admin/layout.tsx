import Link from "next/link";

export const metadata = {
  title: 'Protocolo de Administração | Nexus',
  description: 'Área restrita de gerenciamento de dados.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-950 text-white min-h-screen relative font-mono selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none z-0"></div>

      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <header className="mb-12 border-b border-white/10 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black uppercase text-fuchsia-500 tracking-wider flex items-center gap-3">
                <span className="animate-pulse">{"<"}</span> MAIN_FRAME_ADMIN
              </h1>
              <p className="text-sm text-cyan-400 mt-2 tracking-widest uppercase">
                [ Acesso Restrito ao Sistema ]
              </p>
            </div>

            <nav className="flex flex-wrap gap-4 text-sm mt-4 md:mt-0 font-bold">
              <Link
                href="/admin"
                className="border border-white/20 bg-black/50 px-6 py-2 hover:border-cyan-400 hover:text-cyan-400 cyber-clip transition-all"
              >
                VISÃO GERAL
              </Link>
              <Link
                href="/admin/produtos"
                className="border border-white/20 bg-black/50 px-6 py-2 hover:border-cyan-400 hover:text-cyan-400 cyber-clip transition-all"
              >
                PRODUTOS
              </Link>
              <button
                // We'll wire up logout later
                className="ml-auto md:ml-4 border border-fuchsia-500/50 bg-fuchsia-500/10 px-6 py-2 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-black cyber-clip transition-all"
              >
                DESCONECTAR
              </button>
            </nav>
          </div>
        </header>

        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
