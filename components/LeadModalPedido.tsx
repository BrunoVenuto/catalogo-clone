"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { X, AlertCircle } from "lucide-react";

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

    if (!data.name) return alert("Preencha o Nome Completo.");
    if (data.cep.length !== 8) return alert("CEP inválido (8 dígitos).");
    if (data.phone.length < 10) return alert("Telefone inválido (com DDD).");
    if (data.cpf.length !== 11) return alert("CPF inválido (11 dígitos).");
    if (!data.street) return alert("Preencha a Rua.");
    if (!data.number) return alert("Preencha o Número.");
    if (!data.neighborhood) return alert("Preencha o Bairro.");
    if (!data.city) return alert("Preencha a Cidade.");

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
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full sm:max-w-xl bg-[#121212] text-gray-100 rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] relative overflow-hidden border border-gray-800"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#1a1a1a]">
              <div>
                <h2 className="text-xl font-black uppercase text-gray-100 tracking-tight">
                  Finalizar Pedido
                </h2>
                <p className="text-sm text-gray-400 mt-1 font-medium">
                  Preencha seus dados de entrega
                </p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-200">
                <X size={20} />
              </button>
            </div>

            {/* Conteúdo com scroll */}
            <div className="px-6 py-6 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="space-y-4">
                {/* Inputs padronizados */}
                {[
                  { label: "Nome Completo", value: name, setter: setName, placeholder: "Ex: João da Silva", formatter: onlyLettersSpaces },
                  { label: "CEP", value: cep, setter: setCep, placeholder: "Apenas números", mode: "numeric" },
                  { label: "Celular / WhatsApp (DDD + Número)", value: phone, setter: setPhone, placeholder: "Ex: 11999999999", mode: "tel" },
                  { label: "CPF", value: cpf, setter: setCpf, placeholder: "Para emissão de NF", mode: "numeric" },
                  { label: "Endereço (Rua/Avenida)", value: street, setter: setStreet, placeholder: "Sua rua de entrega" },
                  { label: "Número", value: number, setter: setNumber, placeholder: "Ex: 123" },
                  { label: "Bairro", value: neighborhood, setter: setNeighborhood, placeholder: "Seu bairro" },
                  { label: "Cidade", value: city, setter: setCity, placeholder: "Sua cidade", formatter: onlyLettersSpacesHyphen },
                  { label: "Complemento / Referência", value: reference, setter: setReference, placeholder: "Ex: Apto 42, Próximo ao mercado" },
                ].map((field, idx) => (
                  <div key={idx} className="relative group">
                    <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wide">
                      {field.label}
                    </label>
                    <input
                      value={field.value}
                      onChange={(e) => field.setter(field.formatter ? field.formatter(e.target.value) : e.target.value)}
                      inputMode={(field.mode as any) || "text"}
                      placeholder={field.placeholder}
                      className="w-full bg-[#1a1a1a] border border-gray-800 rounded-md px-4 py-3 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:border-mega-orange focus:ring-1 focus:ring-mega-orange transition-shadow"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 border-t border-gray-800 bg-[#121212] sticky bottom-0"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
            >
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 font-bold uppercase text-sm border border-gray-700 text-gray-300 hover:bg-[#1a1a1a] hover:text-white rounded-md transition-colors"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 font-black uppercase tracking-wide bg-mega-orange text-white rounded-md hover:bg-[#e65c00] transition-colors shadow-md"
                >
                  Confirmar e Enviar
                </button>
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs font-medium text-gray-500 justify-center">
                <AlertCircle size={14} className="text-mega-orange" />
                <span>Os dados serão enviados de forma segura para finalização no WhatsApp.</span>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
