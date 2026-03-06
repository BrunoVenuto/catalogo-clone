"use client";

import { collections } from "@/config/collections";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Collections() {
  const router = useRouter();

  function handleClick(category: string) {
    const url = `/?category=${encodeURIComponent(category)}#products`;
    router.push(url);

    setTimeout(() => {
      const el = document.getElementById("products");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  }

  // Pre-definindo cores, percentuais fakes baseandos no nome
  const getStyleData = (name: string, index: number) => {
    const styles = [
      { color: "text-cyan-400", bg: "bg-cyan-400", border: "border-cyan-400", pct: "95%" },
      { color: "text-fuchsia-500", bg: "bg-fuchsia-500", border: "border-fuchsia-500", pct: "85%" },
      { color: "text-yellow-400", bg: "bg-yellow-400", border: "border-yellow-400", pct: "99%" },
      { color: "text-red-500", bg: "bg-red-500", border: "border-red-500", pct: "75%" },
    ];
    return styles[index % styles.length];
  };

  return (
    <section
      id="collections"
      className="py-20 md:py-24 bg-neutral-950 text-white overflow-hidden relative"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 mb-12 relative z-10">
        <h2 className="text-3xl md:text-5xl font-black font-mono tracking-tighter uppercase mb-2">
          <span className="text-cyan-500 block text-lg tracking-widest mb-1">{"<"} MÓDULO DE BUSCA {">"}</span>
          01. LINHAS_ATIVAS
        </h2>
        <p className="text-neutral-500 font-mono text-sm max-w-xl border-l-2 border-fuchsia-500/50 pl-4 mt-4">
          {">"} Analisando estoques operacionais e capacidades métricas... <br />
          {">"} Selecione um protocolo para filtrar o inventário.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {collections.map((c, index) => {
            const style = getStyleData(c.name, index);

            return (
              <motion.div
                key={c.id}
                onClick={() => handleClick(c.name)}
                className="cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-lg ${style.color} group-hover:scale-110 transition-transform`}>
                      {"</>"}
                    </span>
                    <h3 className="font-mono font-bold uppercase tracking-widest text-neutral-200 group-hover:text-white transition-colors">
                      {c.name}
                    </h3>
                  </div>
                  <span className={`font-mono font-bold ${style.color}`}>
                    {style.pct}
                  </span>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full h-[6px] bg-neutral-900 border border-white/5 relative overflow-hidden cyber-clip-reverse">
                  {/* Progress Line */}
                  <motion.div
                    className={`absolute top-0 left-0 h-full ${style.bg} shadow-[0_0_10px_currentcolor] group-hover:brightness-125 transition-all`}
                    initial={{ width: 0 }}
                    whileInView={{ width: style.pct }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                  />
                </div>

                {/* Decorative dots below bar */}
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1 h-3 bg-neutral-800 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
