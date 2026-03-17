import Link from "next/link";
import AdminLogoutButton from "@/components/AdminLogoutButton";

export const metadata = {
  title: 'Painel MG PHARMA | Administração',
  description: 'Gerenciamento da loja e produtos MG PHARMA.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#121212] text-gray-100 min-h-screen relative font-sans selection:bg-mega-orange/30 selection:text-mega-orange">

      {/* HEADER */}
      <div className="bg-mega-dark shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b-4 border-mega-orange">
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-black uppercase text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
                <span className="text-mega-orange">MG</span>PHARMA ADMIN
              </h1>
              <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">
                Painel de Controle
              </p>
            </div>

            <nav className="flex flex-wrap w-full md:w-auto gap-2 text-sm font-bold uppercase justify-center mt-2 md:mt-0">
              <Link
                href="/admin"
                className="flex-1 md:flex-none text-center bg-gray-800 text-white px-3 py-2 rounded hover:bg-mega-orange hover:text-white transition-colors"
              >
                Visão Geral
              </Link>
              <Link
                href="/admin/produtos"
                className="flex-1 md:flex-none text-center bg-gray-800 text-white px-3 py-2 rounded hover:bg-mega-orange hover:text-white transition-colors"
              >
                Produtos
              </Link>
              <div className="flex-1 md:flex-none flex justify-center">
                <AdminLogoutButton />
              </div>
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
