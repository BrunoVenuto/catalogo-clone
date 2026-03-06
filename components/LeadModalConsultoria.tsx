"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function LeadModalConsultoria({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    phone: string;
    goal: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState("");

  function handleSubmit() {
    if (!name || !phone || !goal) return;
    onSubmit({ name, phone, goal });
    setName("");
    setPhone("");
    setGoal("");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm bg-neutral-950 text-white p-6 cyber-clip border border-fuchsia-500/50 shadow-[0_0_30px_rgba(217,70,239,0.15)] relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Window controls */}
            <div className="flex justify-between items-start mb-6 border-b border-fuchsia-500/30 pb-4">
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest text-fuchsia-400">
                  [ Consultoria ]
                </h2>
                <p className="font-mono text-xs text-cyan-500 mt-1 uppercase tracking-wide">Iniciando protocolo...</p>
              </div>
              <button onClick={onClose} className="text-cyan-400 font-mono text-lg px-2 border border-cyan-500/30 cyber-clip hover:bg-cyan-500/20 transition-colors">
                X
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <input
                  placeholder="IDENTIFICAÇÃO (NOME)"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""))
                  }
                  className="w-full bg-neutral-900 border border-white/10 cyber-clip font-mono text-sm uppercase px-4 py-3 focus:outline-none focus:border-fuchsia-400 transition-colors"
                />
              </div>

              <div className="relative group">
                <input
                  placeholder="CONEXÃO (TEL/WHATSAPP)"
                  value={phone}
                  inputMode="numeric"
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full bg-neutral-900 border border-white/10 cyber-clip font-mono text-sm uppercase px-4 py-3 focus:outline-none focus:border-fuchsia-400 transition-colors"
                />
              </div>

              <div className="relative group">
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 cyber-clip font-mono text-sm uppercase px-4 py-3 focus:outline-none focus:border-fuchsia-400 transition-colors appearance-none"
                >
                  <option value="">[ SELECIONE O OBJETIVO ]</option>
                  <option value="Hipertrofia">HIPERTROFIA MACIÇA</option>
                  <option value="Definição">DEFINIÇÃO EXTREMA</option>
                  <option value="Performance">PERFORMANCE OVERDRIVE</option>
                  <option value="Outro">OUTRO PROTOCOLO</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-fuchsia-500 font-mono">▼</div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-fuchsia-500/30">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 text-sm font-mono uppercase border border-neutral-600 text-neutral-400 hover:text-white hover:border-white/50 cyber-clip transition-colors"
                >
                  [ Abortar ]
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 text-sm font-black uppercase tracking-widest bg-fuchsia-600 text-black cyber-clip hover:bg-fuchsia-500 hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all cursor-pointer"
                >
                  Transmitir
                </button>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-fuchsia-500/50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 pointer-events-none"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
