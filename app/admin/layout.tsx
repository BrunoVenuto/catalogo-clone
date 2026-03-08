import Link from "next/link";

export const metadata = {
  title: 'Painel MegaGym | Administração',
  description: 'Gerenciamento da loja e produtos MegaGym.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen relative font-sans selection:bg-mega-orange/30 selection:text-mega-orange">

      {/* HEADER */}
      <div className="bg-mega-dark shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b-4 border-mega-orange">
            <div>
              <h1 className="text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                <span className="text-mega-orange">MEGA</span>GYM ADMIN
              </h1>
              <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">
                Painel de Controle
              </p>
            </div>

            <nav className="flex flex-wrap gap-2 text-sm font-bold uppercase">
              <Link
                href="/admin"
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-mega-orange hover:text-white transition-colors"
              >
                Visão Geral
              </Link>
              <Link
                href="/admin/produtos"
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-mega-orange hover:text-white transition-colors"
              >
                Produtos
              </Link>
              <button
                // We'll wire up logout later
                className="ml-auto md:ml-4 bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition-colors"
              >
                Sair
              </button>
            </nav>
          </header>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
