"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

export type PedidoLeadData = {
  name: string;
  cep: string;
  phone: string;
  cpf: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  reference: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: PedidoLeadData) => void;
};

export default function LeadModalPedido({ open, onClose, onConfirm }: Props) {
  const [name, setName] = useState("");
  const [cep, setCep] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [reference, setReference] = useState("");

  const cepDigits = useMemo(() => cep.replace(/\D/g, ""), [cep]);
  const phoneDigits = useMemo(() => phone.replace(/\D/g, ""), [phone]);
  const cpfDigits = useMemo(() => cpf.replace(/\D/g, ""), [cpf]);

  function onlyLettersSpaces(value: string) {
    return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
  }

  function onlyLettersSpacesHyphen(value: string) {
    return value.replace(/[^a-zA-ZÀ-ÿ\s-]/g, "");
  }

  function handleConfirm() {
    const data: PedidoLeadData = {
      name: name.trim(),
      cep: cepDigits.trim(),
      phone: phoneDigits.trim(),
      cpf: cpfDigits.trim(),
      street: street.trim(),
      number: number.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      reference: reference.trim(),
    };

    if (!data.name) return alert("Preencha o NOME.");
    if (data.cep.length !== 8) return alert("CEP inválido (8 dígitos).");
    if (data.phone.length < 10) return alert("Telefone inválido (com DDD).");
    if (data.cpf.length !== 11) return alert("CPF inválido (11 dígitos).");
    if (!data.street) return alert("Preencha a RUA.");
    if (!data.number) return alert("Preencha o NÚMERO.");
    if (!data.neighborhood) return alert("Preencha o BAIRRO.");
    if (!data.city) return alert("Preencha a CIDADE.");

    onConfirm(data);

    setName("");
    setCep("");
    setPhone("");
    setCpf("");
    setStreet("");
    setNumber("");
    setNeighborhood("");
    setCity("");
    setReference("");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="
              w-full sm:max-w-xl
              bg-neutral-950 text-white
              cyber-clip
              border border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.15)]
              flex flex-col
              max-h-[92vh] sm:max-h-[85vh]
              relative
            "
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-cyan-500/30 flex justify-between items-start bg-neutral-900/50">
              <div>
                <h2 className="text-xl font-black uppercase text-cyan-400 tracking-wider">
                  [ Transmissão de Pedido ]
                </h2>
                <p className="text-xs font-mono text-fuchsia-400 mt-2 uppercase tracking-wide">
                  {">"} Verifique as coordenadas de entrega
                </p>
              </div>
              <button onClick={onClose} className="text-fuchsia-500 font-mono text-xl cyber-clip px-2 py-1 border border-fuchsia-500/30 hover:bg-fuchsia-500/20 transition-colors">
                X
              </button>
            </div>

            {/* Conteúdo com scroll */}
            <div className="px-6 py-6 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-neutral-900">
              <div className="space-y-5">

                {/* Inputs padronizados */}
                {[
                  { label: "NOME IMPRESSO:", value: name, setter: setName, placeholder: "Identificação do usuário", formatter: onlyLettersSpaces },
                  { label: "CÓDIGO POSTAL (CEP):", value: cep, setter: setCep, placeholder: "Somente dígitos numéricos", mode: "numeric" },
                  { label: "CONEXÃO (TEL/DDD):", value: phone, setter: setPhone, placeholder: "Dígitos de contato", mode: "tel" },
                  { label: "REGISTRO (CPF):", value: cpf, setter: setCpf, placeholder: "11 dígitos de registro", mode: "numeric" },
                  { label: "ROTA (RUA):", value: street, setter: setStreet, placeholder: "Vetor de entrega" },
                  { label: "NÓ (NÚMERO):", value: number, setter: setNumber, placeholder: "Ponto de ancoragem" },
                  { label: "SETOR (BAIRRO):", value: neighborhood, setter: setNeighborhood, placeholder: "Zona de acesso" },
                  { label: "PÓLO (CIDADE):", value: city, setter: setCity, placeholder: "Metrópole", formatter: onlyLettersSpacesHyphen },
                  { label: "MARCADOR (REFERÊNCIA):", value: reference, setter: setReference, placeholder: "Pontos de reconhecimento local" },
                ].map((field, idx) => (
                  <div key={idx} className="relative group">
                    <label className="text-xs font-mono text-cyan-500 block mb-1 tracking-wider uppercase">
                      {field.label}
                    </label>
                    <input
                      value={field.value}
                      onChange={(e) => field.setter(field.formatter ? field.formatter(e.target.value) : e.target.value)}
                      inputMode={(field.mode as any) || "text"}
                      placeholder={field.placeholder}
                      className="w-full bg-neutral-900 border border-white/10 cyber-clip-reverse px-4 py-3 text-white font-mono text-sm placeholder-neutral-600 focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-colors"
                    />
                    {/* Hover indicator */}
                    <div className="absolute left-0 bottom-0 w-1 h-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className="
                px-6 pt-4 border-t border-cyan-500/30
                bg-neutral-900/80 backdrop-blur-md
                sticky bottom-0
              "
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
            >
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 font-mono uppercase text-sm border border-neutral-600 text-neutral-400 hover:text-white hover:border-white/50 cyber-clip transition-colors"
                >
                  [ Abortar ]
                </button>

                <button
                  onClick={handleConfirm}
                  className="flex-1 py-4 font-black uppercase tracking-widest bg-cyan-400 text-black cyber-clip hover:bg-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all relative overflow-hidden group"
                >
                  <div className="absolute inset-0 border-[3px] border-transparent group-hover:border-white/50 cyber-clip transition-colors"></div>
                  Transmitir
                </button>
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs font-mono text-fuchsia-500/80 uppercase">
                <span className="animate-pulse">⚠️</span>
                <span>Anomalias nos dados atrasam a entrega corp.</span>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
