"use client";

import { motion } from "framer-motion";

const testimonials = [
  { name: "Carlos_M [✓]", text: "Protocolo de suplementação ativado com sucesso. Ganhos de força em +25%. Recomendo a síntese." },
  { name: "Mariana_S [✓]", text: "Taxa de entrega: T-Minus 24 horas. Material nível corporal superior. Sistema validado!" },
  { name: "Ricardo_P [✓]", text: "Integração do pre-workout no meu hardware foi imediata. Sem lag, foco absoluto." },
  { name: "Fernanda_L [✓]", text: "Matriz de recuperação excelente. Tempo de downtime muscular reduzido pela metade." },
  { name: "André_T [✓]", text: "Suporte técnico rápido. Os produtos Nexus são de fato outro nível de modificação." },
  { name: "Juliana_R [✓]", text: "Upgrade confirmado no meu sistema orgânico. Valeu cada crédito gasto." },
];

function getInitials(name: string) {
  // Remove possible tags like [✓]
  const cleanName = name.replace(/\[.*?\]/g, '').trim();
  const parts = cleanName.split("_");
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[1][0];
}

export default function SocialProof() {
  return (
    <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black font-mono tracking-tighter uppercase mb-2">
            <span className="text-fuchsia-500 block text-lg tracking-widest mb-1 text-center">{"<"} LOGS_DE_USUÁRIO {">"}</span>
            O QUE NOSSOS CLIENTES DIZEM
          </h2>
          <div className="w-24 h-1 bg-fuchsia-500 mx-auto mt-6 shadow-[0_0_10px_rgba(217,70,239,0.8)]"></div>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="
                bg-neutral-900 border border-fuchsia-500/20 
                cyber-clip p-6 
                hover:border-fuchsia-500/80 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] 
                transition-all duration-300
                group
                flex flex-col h-full
              "
            >
              {/* Topo */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  {/* Avatar tech */}
                  <div className="
                    w-12 h-12 flex-shrink-0
                    bg-neutral-950 border border-cyan-500/50 text-cyan-400 font-mono font-bold 
                    flex items-center justify-center
                    group-hover:bg-cyan-500 group-hover:text-black transition-colors
                  ">
                    {getInitials(t.name)}
                  </div>

                  <div>
                    <p className="font-mono text-sm text-neutral-300 group-hover:text-fuchsia-400 transition-colors">
                      {t.name}
                    </p>

                    {/* Status Fictício */}
                    <div className="text-[10px] font-mono text-cyan-500 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                      STATUS: VERIFIED
                    </div>
                  </div>
                </div>

                {/* Aspas Tech */}
                <div className="text-fuchsia-500/30 font-serif text-4xl leading-none font-bold">
                  "
                </div>
              </div>

              {/* Texto */}
              <p className="text-neutral-400 font-mono text-sm leading-relaxed mt-2 flex-grow">
                {">"} {t.text}
              </p>

              {/* Bottom Decor */}
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent mt-6"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
