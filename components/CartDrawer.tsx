"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getCart, clearCart, removeFromCart } from "@/lib/cart";
import LeadModalPedido, { PedidoLeadData } from "./LeadModalPedido";
import LeadModalConsultoria from "./LeadModalConsultoria";
import { Product } from "@/config/products";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/navigation";
import { ShoppingCart, X, Trash2, Send, MessageCircle } from "lucide-react";

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
      alert("Número do WhatsApp inválido. Verifique suas configurações.");
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
    }

    const message =
      `*NOVO PEDIDO MEGA GYM*\n\n` +
      `*Dados do Cliente:*\n` +
      `Nome: ${data.name}\n` +
      `CEP: ${data.cep}\n` +
      `Telefone (DDD): ${data.phone}\n` +
      `CPF: ${data.cpf}\n` +
      `Rua: ${data.street}\n` +
      `Número: ${data.number}\n` +
      `Bairro: ${data.neighborhood}\n` +
      `Cidade: ${data.city}\n` +
      `Pto. de Referência: ${data.reference || "Nenhuma"}\n\n` +
      `*Produtos Solicitados:*\n${productsText}\n\n` +
      `*TOTAL:* R$ ${total.toFixed(2)}\n\n` +
      `Aguardando confirmação e chave PIX.`;

    openWhatsApp(whatsappPedido, message);

    handleClear();
    setPedidoOpen(false);
    setOpen(false);

    setTimeout(() => {
      router.push("/#produtos");
    }, 300);
  }

  function handleConsultoriaSubmit(data: ConsultoriaData) {
    const message =
      `*Atendimento Mega Gym Solicitado*\n\n` +
      `Nome: ${data.name}\n` +
      `WhatsApp: ${data.phone}\n` +
      `Objetivo: ${data.goal}\n\n` +
      `Gostaria de falar com um de seus consultores sobre as opções de equipamentos.`;

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
          className="bg-mega-orange w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform relative group"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-mega-dark text-white font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {items.length}
          </span>
        </button>
      </div>

      {/* DRAWER */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-full w-full max-w-md bg-white p-0 text-gray-900 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.1)] relative"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Drawer */}
              <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-black uppercase text-gray-900 flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-mega-orange" />
                  Seu Carrinho
                </h2>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Itens Drawer */}
              <div className="flex-1 p-6 space-y-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-lg group hover:border-mega-orange transition-colors shadow-sm"
                  >
                    <div className="flex-1 pr-4">
                      <p className="font-bold text-gray-800 text-sm mb-1 leading-tight">{item.name}</p>
                      <p className="text-mega-orange font-bold text-sm">
                        R$ {Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      title="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer Drawer */}
              <div className="border-t border-gray-100 p-6 space-y-4 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Subtotal:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-900 block leading-none">R$ {total.toFixed(2)}</span>
                    <span className="text-xs text-gray-400 font-medium">No PIX / Boleto</span>
                  </div>
                </div>

                <button
                  onClick={() => setPedidoOpen(true)}
                  className="w-full bg-mega-orange py-4 rounded-md font-black text-white uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-[#e65c00] transition-colors shadow-md"
                >
                  <Send className="w-5 h-5" />
                  Finalizar Pedido
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConsultoriaOpen(true)}
                    className="w-full border border-gray-300 bg-white py-3 rounded-md font-bold text-gray-700 text-xs uppercase flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Suporte
                  </button>

                  <button
                    onClick={handleClear}
                    className="w-full border border-red-200 bg-red-50 py-3 rounded-md text-red-600 font-bold text-xs uppercase hover:bg-red-100 hover:text-red-700 hover:border-red-300 transition-colors"
                  >
                    Limpar
                  </button>
                </div>
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
