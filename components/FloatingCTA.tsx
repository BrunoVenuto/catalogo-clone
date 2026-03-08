"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeadModalConsultoria from "./LeadModalConsultoria";
import { siteConfig } from "@/config/site";
import { MessageCircle } from "lucide-react";

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
      `*Atendimento Mega Gym Solicitado*\n\n` +
      `Nome: ${data.name}\n` +
      `WhatsApp: ${data.phone}\n` +
      `Objetivo: ${data.goal}\n\n` +
      `Gostaria de falar com um de seus consultores sobre as opções de equipamentos.`;

    openWhatsApp(message);
    setOpen(false);
  }

  return (
    <>
      {/* BOTÃO FLUTUANTE */}
      <div className="fixed bottom-[110px] right-6 md:bottom-24 md:right-[104px] z-50">
        <button
          onClick={() => setOpen(true)}
          className="
            flex items-center justify-center
            bg-[#25D366] hover:bg-[#1ebe5b]
            text-white p-4
            rounded-full shadow-xl
            transition-transform duration-300 hover:scale-110
          "
          title="Fale Conosco"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 md:w-10 md:h-10"
          >
            <path d="M12.0003 2.00098C6.47705 2.00098 1.99988 6.47815 1.99988 12.0019C1.99988 13.9678 2.5647 15.803 3.53589 17.348L2.24756 21.6881L6.70251 20.4703C8.24353 21.4391 10.0768 22.0028 12.0003 22.0028C17.5234 22.0028 22.0006 17.5256 22.0006 12.0019C22.0006 6.47815 17.5234 2.00098 12.0003 2.00098ZM17.1528 16.489C16.9271 17.1328 15.8275 17.6534 15.1105 17.7289C14.5951 17.7816 13.9142 17.8427 11.2372 16.738C7.81409 15.3262 5.61792 11.8385 5.46289 11.6318C5.30786 11.4251 4.21851 9.97229 4.21851 8.46887C4.21851 6.96545 4.97607 6.23071 5.28186 5.91895C5.53406 5.66174 5.93921 5.53455 6.32629 5.53455C6.4491 5.53455 6.56067 5.54114 6.66016 5.54675C6.96582 5.56152 7.11865 5.58044 7.32043 6.06995C7.57568 6.68726 8.203 8.22595 8.27966 8.38489C8.35632 8.54382 8.45862 8.76135 8.35681 8.96692C8.25488 9.17249 8.12781 9.25505 7.97449 9.43164C7.82117 9.60823 7.67405 9.73462 7.51477 9.93042C7.37122 10.1032 7.21069 10.2938 7.38208 10.5898C7.55347 10.8859 8.19653 11.9363 9.14307 12.7797C10.3667 13.8694 11.3534 14.2173 11.6841 14.356C11.939 14.4633 12.2452 14.4398 12.4337 14.2371C12.6718 13.9806 12.9641 13.5287 13.2692 13.0802C13.4862 12.7601 13.7543 12.7214 14.0203 12.8226C14.2861 12.9238 15.6984 13.6219 15.979 13.7632C16.2596 13.9044 16.4468 13.9742 16.5148 14.092C16.5828 14.2098 16.5828 14.7733 16.3571 15.4172H16.3568L17.1528 16.489Z" />
          </svg>
        </button>
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
