"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeadModalConsultoria from "./LeadModalConsultoria";
import { siteConfig } from "@/config/site";

type ConsultoriaData = {
  name: string;
  phone: string;
  goal: string;
};

export default function FloatingCTA() {
  const [open, setOpen] = useState(false);

  // 💬 NÚMERO CORRETO DA CONSULTORIA (somente dígitos)
  const whatsappConsultoria = useMemo(
    () => String(siteConfig.whatsappConsultoria || "").replace(/\D/g, ""),
    []
  );

  useEffect(() => {
    function handleOpen() {
      setOpen(true);
    }

    document.addEventListener("open-consultoria", handleOpen as EventListener);

    return () => {
      document.removeEventListener("open-consultoria", handleOpen as EventListener);
    };
  }, []);

  function openWhatsApp(message: string) {
    if (!whatsappConsultoria || whatsappConsultoria.length < 10) {
      alert("Número de consultoria inválido no config/site.ts");
      return;
    }

    window.open(
      `https://wa.me/${whatsappConsultoria}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  function handleSubmit(data: ConsultoriaData) {
    const message =
      `LOG: Consultoria Requisitada.\n` +
      `Nome: ${data.name}\n` +
      `Telefone: ${data.phone}\n` +
      `Parâmetro/Objetivo: ${data.goal}\n\n` +
      `Aguardo análise de protocolo.`;

    openWhatsApp(message);
    setOpen(false);
  }

  return (
    <>
      {/* BOTÃO FLUTUANTE */}
      <div className="hidden md:block fixed bottom-24 right-[104px] z-50">
        <motion.button
          onClick={() => setOpen(true)}
          className="
            relative
            bg-neutral-900 border-2 border-fuchsia-500
            text-fuchsia-400
            px-6 py-3 cyber-clip
            font-mono font-bold uppercase tracking-widest text-sm
            flex items-center gap-3
            hover:bg-fuchsia-500 hover:text-black transition-colors duration-300
            group
          "
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 10px rgba(217,70,239,0.3)",
              "0 0 35px rgba(217,70,239,1)",
              "0 0 10px rgba(217,70,239,0.3)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Efeito Visual de Ping / Radar nas bordas para chamar muita atenção */}
          <span className="absolute inset-0 border-2 border-fuchsia-500 cyber-clip animate-ping opacity-75"></span>

          <span className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse group-hover:bg-black"></span>
          [ Iniciar Protocolo ]
        </motion.button>
      </div>

      {/* MODAL */}
      <LeadModalConsultoria
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
