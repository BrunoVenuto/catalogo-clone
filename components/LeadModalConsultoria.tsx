"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

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
    if (!name || !phone || !goal) return alert("Por favor, preencha todos os campos.");
    onSubmit({ name, phone, goal });
    setName("");
    setPhone("");
    setGoal("");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm bg-[#121212] text-gray-100 rounded-xl shadow-2xl overflow-hidden relative border border-gray-800"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-[#1a1a1a] border-b border-gray-800">
              <div>
                <h2 className="text-lg font-black uppercase text-gray-100 tracking-tight">
                  Atendimento Especializado
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Fale com um consultor MegaGym
                </p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-200">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="relative group">
                <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wide">
                  Nome Completo
                </label>
                <input
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""))
                  }
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-md px-4 py-3 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:border-mega-orange focus:ring-1 focus:ring-mega-orange transition-shadow"
                />
              </div>

              <div className="relative group">
                <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wide">
                  Celular / WhatsApp
                </label>
                <input
                  placeholder="DDD + Número"
                  value={phone}
                  inputMode="numeric"
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-md px-4 py-3 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:border-mega-orange focus:ring-1 focus:ring-mega-orange transition-shadow"
                />
              </div>

              <div className="relative group">
                <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wide">
                  Qual o seu objetivo?
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-md px-4 py-3 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:border-mega-orange focus:ring-1 focus:ring-mega-orange transition-shadow appearance-none"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="Montar Academia">BULKING</option>
                  <option value="Equipamentos Profissionais">CUTTING</option>
                  <option value="Acessórios e Pesos">MANUTENÇÃO</option>
                  <option value="Dúvida Geral">DÚVIDA GERAL / OUTRO</option>
                </select>
                <div className="absolute right-4 top-1/2 mt-3 -translate-y-1/2 pointer-events-none text-gray-500 font-mono text-xs">▼</div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-800">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 font-bold uppercase text-xs border border-gray-700 text-gray-300 hover:bg-[#1a1a1a] hover:text-white rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 font-black text-xs uppercase tracking-wide bg-mega-orange text-white rounded-md hover:bg-[#e65c00] transition-colors shadow-md"
                >
                  Enviar Solicitação
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
