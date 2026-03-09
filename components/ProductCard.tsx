"use client";

import type { Product } from "@/config/products";

type Props = {
  product: Product;
  onOpen: () => void;
  onAdd: () => void;
};

export default function ProductCard({ product, onOpen, onAdd }: Props) {
  // Simple installment calculation mock (e.g., 12x)
  const installments = 12;
  const installmentValue = (Number(product.price) / installments).toFixed(2);

  // Fake original price for strikethrough effect
  const originalPrice = (Number(product.price) * 1.2).toFixed(2);

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:shadow-xl flex flex-col h-full">


      <button onClick={onOpen} className="w-full text-left relative z-10 flex flex-col flex-grow">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-white mb-4 rounded-md aspect-square flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain filter transition-all duration-500 transform group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm font-bold">[ NO IMAGE ]</span>
            </div>
          )}
        </div>

        <div className="flex-grow">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
            {product.category || "Equipamento"}
          </p>
          <h3 className="text-sm md:text-base font-bold uppercase text-gray-800 leading-tight mb-2 line-clamp-2 hover:text-mega-orange transition-colors">
            {product.name}
          </h3>
        </div>
      </button>

      <div className="mt-4 flex flex-col gap-1 relative z-10 border-t border-gray-100 pt-4">
        <div className="text-xs text-gray-400 line-through">
          R$ {originalPrice}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-mega-orange">
            R$ {Number(product.price).toFixed(2)}
          </span>
          <span className="text-sm font-bold text-mega-orange">à vista</span>
        </div>
        <div className="text-xs text-gray-600 font-medium">

        </div>

        <button
          onClick={onAdd}
          className="mt-4 w-full bg-mega-orange text-white py-2.5 rounded-md font-bold uppercase text-sm hover:bg-[#e65c00] transition-colors shadow-sm"
        >
          Comprar Agora
        </button>
      </div>
    </div>
  );
}