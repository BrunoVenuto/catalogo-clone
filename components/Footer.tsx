export default function Footer() {
  return (
    <footer className="bg-mega-dark border-t border-gray-800 relative w-full pt-16 pb-8 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Top area */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 border-b border-gray-800 pb-12">
          {/* Logo Column */}
          <div className="col-span-1 md:col-span-1">
            <span className="text-3xl font-black text-mega-orange italic tracking-tighter mb-4 block">
              MG PHARMA
            </span>
            <p className="text-sm text-gray-400 mt-4 leading-relaxed max-w-xs">
              O maior estoque de fármacos voltados para musculação. Estrutura profissional para o seu desenvolvimento no treino.
            </p>
          </div>

          {/* Links 1 */}
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-mega-orange transition-colors">Sobre a Empresa</a></li>
              <li><a href="#" className="hover:text-mega-orange transition-colors">Nossas Lojas</a></li>
              <li><a href="#" className="hover:text-mega-orange transition-colors">Trabalhe Conosco</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">Dúvidas</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-mega-orange transition-colors">Política de Entregas</a></li>
              <li><a href="#" className="hover:text-mega-orange transition-colors">Trocas e Devoluções</a></li>
              <li><a href="#" className="hover:text-mega-orange transition-colors">Pagamentos</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">Atendimento</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-mega-orange font-bold">W</span>
                <span>(31) 99545-3632</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-mega-orange font-bold">@</span>
                <span>contato@mgpharma.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} MG PARMA Anabols. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <img src="https://placehold.co/100x30/1A1A1A/333333/png?text=Pagamentos" alt="Pagamentos" className="h-6" />
            <img src="https://placehold.co/100x30/1A1A1A/333333/png?text=Seguranca" alt="Segurança" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}
