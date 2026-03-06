"use client";

import type { Product } from "@/config/products";

type Props = {
  product: Product;
  onOpen: () => void;
  onAdd: () => void;
};

export default function ProductCard({ product, onOpen, onAdd }: Props) {
  return (
    <div className="group relative bg-neutral-900/40 backdrop-blur-md p-5 text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] cyber-clip border border-white/5 hover:border-fuchsia-500/50">

      {/* Decorative Cyberpunk Accents */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-500/0 group-hover:border-cyan-500/100 transition-colors duration-500"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-fuchsia-500/0 group-hover:border-fuchsia-500/100 transition-colors duration-500"></div>

      <button onClick={onOpen} className="w-full text-left relative z-10 block">
        {/* Image Container */}
        <div className="relative overflow-hidden cyber-clip bg-neutral-950 p-1 border border-white/5 group-hover:border-white/20 transition-colors">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-52 w-full object-cover cyber-clip filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
            />
          ) : (
            <div className="h-52 w-full bg-neutral-800 cyber-clip flex items-center justify-center">
              <span className="font-mono text-neutral-500">[ NO IMAGE ]</span>
            </div>
          )}
        </div>

        <div className="mt-5 border-l-2 border-transparent group-hover:border-cyan-400 pl-3 transition-colors duration-300">
          <h3 className="text-xl font-black uppercase tracking-wide text-white group-hover:text-cyan-400 transition-colors">
            {product.name}
          </h3>
          <p className="mt-2 text-xs text-neutral-400 font-mono line-clamp-2">
            {product.description}
          </p>
        </div>
      </button>

      <div className="mt-6 flex flex-col gap-4 relative z-10">
        <span className="text-2xl font-black font-mono text-yellow-500 tracking-tighter">
          R$ {Number(product.price).toFixed(2)}
        </span>

        <button
          onClick={onAdd}
          className="w-full relative bg-white/5 border border-white/10 px-4 py-3 text-sm font-black text-white uppercase tracking-widest cyber-clip-reverse transition-all duration-300 hover:bg-fuchsia-600 hover:text-black hover:border-fuchsia-400 hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] overflow-hidden"
        >
          {/* Button Scanline Effect */}
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
          Adicionar
        </button>
      </div>
    </div>
  );
}