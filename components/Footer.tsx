export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t-2 border-fuchsia-500/30 relative overflow-hidden">
      {/* Glow do topo */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div
        className="
          max-w-7xl mx-auto px-6
          py-12
          flex flex-col gap-6
          md:flex-row md:items-center md:justify-between
          text-sm text-neutral-400
          relative z-10
        "
      >
        {/* ESQUERDA */}
        <div className="text-center md:text-left font-mono">
          <p className="text-cyan-500 text-xs mb-1 uppercase tracking-widest">
            [ STATUS DO SISTEMA: ONLINE ]
          </p>
          <p>
            © {new Date().getFullYear()} <span className="text-fuchsia-400 font-bold">NEXUS</span> GYM EXPORTS. <span className="text-neutral-500">All rights reserved.</span>
          </p>
        </div>

        {/* DIREITA */}
        <div className="flex justify-center md:justify-end gap-6 font-mono text-xs uppercase tracking-widest">
          <a href="#" className="hover:text-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all px-2 py-1 cyber-clip border border-transparent hover:border-cyan-500/30">
            [ Termos_de_Uso ]
          </a>
          <a href="#" className="hover:text-fuchsia-400 hover:shadow-[0_0_10px_rgba(217,70,239,0.5)] transition-all px-2 py-1 cyber-clip border border-transparent hover:border-fuchsia-500/30">
            [ Data_Privacy ]
          </a>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
        <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100L200 0V100H0Z" fill="url(#paint0_linear)" />
          <defs>
            <linearGradient id="paint0_linear" x1="100" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D946EF" />
              <stop offset="1" stopColor="#0A0A0A" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </footer>
  );
}
