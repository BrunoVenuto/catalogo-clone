"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getCart, clearCart, removeFromCart } from "@/lib/cart";
import LeadModalPedido, { PedidoLeadData } from "./LeadModalPedido";
import LeadModalConsultoria from "./LeadModalConsultoria";
import { Product } from "@/config/products";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/navigation";

type ConsultoriaData = {
  name: string;
  phone: string;
  goal: string;
};

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [pedidoOpen, setPedidoOpen] = useState(false);
  const [consultoriaOpen, setConsultoriaOpen] = useState(false);
  const [items, setItems] = useState<Product[]>([]);
  const router = useRouter();

  const whatsappPedido = useMemo(
    () => String(siteConfig.whatsappPedido || siteConfig.whatsapp || "").replace(/\D/g, ""),
    []
  );

  const whatsappConsultoria = useMemo(
    () => String(siteConfig.whatsappConsultoria || "").replace(/\D/g, ""),
    []
  );

  useEffect(() => {
    function update() {
      setItems(getCart());
    }

    update();
    window.addEventListener("cart:update", update);
    window.addEventListener("cart:add", update);

    return () => {
      window.removeEventListener("cart:update", update);
      window.removeEventListener("cart:add", update);
    };
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price), 0);
  }, [items]);

  function openWhatsApp(to: string, message: string) {
    if (!to || to.length < 10) {
      alert("Número do WhatsApp inválido no config/site.ts (use somente dígitos).");
      return;
    }

    window.open(
      `https://wa.me/${to}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  function handleRemove(index: number) {
    removeFromCart(index);
    setItems(getCart());
  }

  function handleClear() {
    clearCart();
    setItems([]);
  }

  async function handleConfirmPedido(data: PedidoLeadData) {
    const productsText = items
      .map((item) => `- ${item.name} — R$ ${Number(item.price).toFixed(2)}`)
      .join("\n");

    try {
      const agg = new Map<string, { productId: string; name: string; price: number; quantity: number }>();

      for (const it of items) {
        const key = String(it.id);
        const current = agg.get(key) ?? {
          productId: String(it.id),
          name: it.name,
          price: Number(it.price),
          quantity: 0,
        };
        current.quantity += 1;
        agg.set(key, current);
      }

      const orderItems = Array.from(agg.values());

      const { addOrder } = await import('@/services/orders');

      await addOrder({
        items: orderItems,
        total,
        source: "whatsapp",
        customer: {
          name: data.name,
          phone: data.phone,
          cep: data.cep,
          cpf: data.cpf,
          city: data.city,
        }
      });
    } catch (err) {
      console.error("Falha ao registrar pedido no painel:", err);
      alert("Não foi possível registrar o pedido no painel. Seu pedido no WhatsApp será enviado mesmo assim.");
    }

    const message =
      `[ NOVO PEDIDO ]\n\n` +
      `DADOS DO CLONE:\n` +
      `Nome: ${data.name}\n` +
      `CEP: ${data.cep}\n` +
      `Telefone (DDD): ${data.phone}\n` +
      `CPF: ${data.cpf}\n` +
      `Rua: ${data.street}\n` +
      `Número: ${data.number}\n` +
      `Bairro: ${data.neighborhood}\n` +
      `Cidade: ${data.city}\n` +
      `Pto. de Referência: ${data.reference || "—"}\n\n` +
      `CARGA DE PRODUTOS:\n${productsText}\n\n` +
      `TOTAL: R$ ${total.toFixed(2)}\n\n` +
      `Aguardando Chave PIX.`;

    openWhatsApp(whatsappPedido, message);

    handleClear();
    setPedidoOpen(false);
    setOpen(false);

    setTimeout(() => {
      router.push("/#products");
    }, 300);
  }

  function handleConsultoriaSubmit(data: ConsultoriaData) {
    const message =
      `LOG: Consultoria Requisitada.\n` +
      `Nome: ${data.name}\n` +
      `Telefone: ${data.phone}\n` +
      `Parâmetro/Objetivo: ${data.goal}\n\n` +
      `Aguardo análise de protocolo.`;

    openWhatsApp(whatsappConsultoria, message);
    setConsultoriaOpen(false);
  }

  if (items.length === 0) return null;

  return (
    <>
      {/* BOTÃO DO CARRINHO */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="bg-cyan-500/20 w-16 h-16 cyber-clip flex items-center justify-center border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:scale-110 transition-transform relative group backdrop-blur-sm"
        >
          <span className="text-2xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">🛒</span>
          <span className="absolute -top-2 -right-2 bg-fuchsia-600 text-black font-black font-mono text-xs px-2 py-1 cyber-clip border border-fuchsia-400">
            {items.length}
          </span>
        </button>
      </div>

      {/* DRAWER */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-full max-w-md bg-neutral-950 p-6 text-white flex flex-col border-l-2 border-cyan-500/50 shadow-[-10px_0_30px_rgba(34,211,238,0.15)] cyber-clip-reverse"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l from-fuchsia-500 to-transparent"></div>

              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black uppercase text-cyan-400 tracking-wider">
                  [ Inventário ]
                </h2>
                <button onClick={() => setOpen(false)} className="text-fuchsia-400 font-mono text-xl cyber-clip px-2 border border-fuchsia-500/30 hover:bg-fuchsia-500/20 transition-colors">
                  X
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-neutral-900 pr-2">
                {items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex justify-between items-center border border-white/5 bg-white/5 p-3 cyber-clip group hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-bold uppercase tracking-wide text-sm">{item.name}</p>
                      <p className="text-yellow-400 font-mono text-xs mt-1">
                        R$ {Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-fuchsia-500 font-mono text-lg hover:text-fuchsia-400 transition-colors px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t-[2px] border-cyan-500/30 pt-6 space-y-4 bg-neutral-950">
                <div className="flex justify-between items-center text-xl font-black mb-6 border border-white/10 p-4 cyber-clip bg-white/5">
                  <span className="uppercase tracking-widest text-neutral-400">Total:</span>
                  <span className="text-yellow-500 font-mono text-2xl cyber-glow-text">R$ {total.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => setPedidoOpen(true)}
                  className="w-full bg-cyan-400 py-4 font-black text-black uppercase tracking-widest hover:bg-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all cyber-clip relative group overflow-hidden"
                >
                  <div className="absolute inset-0 border-[3px] border-transparent group-hover:border-white/50 cyber-clip transition-colors"></div>
                  Transmitir Pedido
                </button>

                <button
                  onClick={() => setConsultoriaOpen(true)}
                  className="w-full border border-fuchsia-500 bg-fuchsia-600/10 py-3 font-black text-fuchsia-400 uppercase tracking-widest hover:bg-fuchsia-600 hover:text-black hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all cyber-clip"
                >
                  Solicitar Protocolo
                </button>

                <button
                  onClick={handleClear}
                  className="w-full border border-neutral-700 py-3 text-neutral-400 font-mono text-sm tracking-widest hover:bg-red-900/30 hover:text-red-400 hover:border-red-500/50 transition-all cyber-clip uppercase"
                >
                  [ Ejetar Itens ]
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAIS */}
      <LeadModalPedido
        open={pedidoOpen}
        onClose={() => setPedidoOpen(false)}
        onConfirm={handleConfirmPedido}
      />

      <LeadModalConsultoria
        open={consultoriaOpen}
        onClose={() => setConsultoriaOpen(false)}
        onSubmit={handleConsultoriaSubmit}
      />
    </>
  );
}
