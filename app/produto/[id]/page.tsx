"use client";

import { useParams, useRouter } from "next/navigation";
import { Product } from "@/config/products";
import { addToCart } from "@/lib/cart";
import { useEffect, useState } from "react";
import { getProductById } from "@/services/products";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      const data = await getProductById(id as string);
      setProduct(data);
      setLoading(false);
    }
    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-cyan-400 font-mono">
        <span className="w-8 h-8 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin mb-4"></span>
        [ ACESSANDO SERVIDOR SECUNDÁRIO... ]
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white font-mono">
        <div className="text-fuchsia-500 text-6xl mb-4 animate-pulse">404</div>
        <div className="text-cyan-400 uppercase tracking-widest text-xl">[ Produto não listado na mainframe ]</div>
        <button
          onClick={() => router.push("/")}
          className="mt-8 px-6 py-2 border border-white/20 hover:border-cyan-400 hover:text-cyan-400 cyber-clip transition-all"
        >
          Retornar ao Hub
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-neutral-950 py-24 pb-40 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 relative z-10">

        {/* IMAGEM */}
        <div className="relative group perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-fuchsia-500/20 blur-2xl group-hover:blur-3xl transition-all duration-500 pointer-events-none"></div>
          <div className="border border-white/10 cyber-clip bg-neutral-900/50 backdrop-blur-sm p-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500/50 m-4 pointer-events-none z-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-fuchsia-500/50 m-4 pointer-events-none z-10"></div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full object-cover aspect-square md:aspect-auto md:h-[600px] filter grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
            />
            {/* Overlay scanline */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20 group-hover:opacity-10 transition-opacity"></div>
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="flex flex-col justify-center">
          {/* VOLTAR */}
          <button
            onClick={() => router.back()}
            className="text-neutral-500 hover:text-cyan-400 mb-8 transition-colors self-start font-mono text-sm uppercase flex items-center gap-2 group"
          >
            <span className="text-cyan-500 group-hover:-translate-x-1 transition-transform">{"<"}</span> Retornar ao Hub
          </button>

          <div className="border-l-2 border-fuchsia-500 pl-6 mb-8 relative">
            <div className="absolute -left-[2px] top-0 w-[2px] h-10 bg-white/50 animate-pulse"></div>
            {/* NOME DO PRODUTO */}
            <h1
              className="
                  text-3xl md:text-5xl
                  font-black
                  text-white
                  uppercase tracking-wider
                  mb-2 leading-none
                "
            >
              {product.name}
            </h1>
            <p className="font-mono text-cyan-400 text-sm tracking-widest uppercase">
              ID: {product.id} // {(product as any).category || 'CLASSIFICADO'} // SYS_OK
            </p>
          </div>

          {/* PREÇO */}
          <div className="bg-neutral-900/50 border border-white/10 cyber-clip-reverse p-6 mb-8 backdrop-blur-sm inline-block self-start">
            <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1">Valor de Troca</p>
            <p
              className="
                text-yellow-400
                text-4xl md:text-5xl
                font-mono font-bold
                cyber-glow-text
              "
            >
              R$ {Number(product.price).toFixed(2)}
            </p>
          </div>

          {/* DESCRIÇÃO */}
          <div className="mb-10 font-mono text-neutral-300 leading-relaxed text-sm bg-black/40 p-6 border-l border-white/10 relative">
            <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-500"></div>
            {product.description || "Este item não possui um log de descrição detalhado no momento. Verifique com um operador para mais informações de sistema."}
          </div>

          {/* BOTÃO */}
          <button
            onClick={() => addToCart(product)}
            className="
              w-full
              bg-cyan-400/10 text-cyan-400 border border-cyan-400
              px-10 py-5
              font-black uppercase tracking-widest
              hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]
              transition-all duration-300
              cyber-clip
              relative group overflow-hidden
            "
          >
            {/* Scanline hover effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
            [ Extrair para Inventário ]
          </button>
        </div>
      </div>
    </section>
  );
}
