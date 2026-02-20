"use client";

import type { Product } from "@/config/products";

type Props = {
  product: Product;
  onOpen: () => void;
  onAdd: () => void; // 🔥 ESSA LINHA RESOLVE O ERRO
};

export default function ProductCard({ product, onOpen, onAdd }: Props) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 text-white">
      <button onClick={onOpen} className="w-full text-left">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="h-52 w-full rounded-xl object-cover"
          />
        )}

        <div className="mt-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="mt-2 text-sm text-neutral-300">
            {product.description}
          </p>
        </div>
      </button>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-base font-semibold">
          R$ {Number(product.price).toFixed(2)}
        </span>

        <button
          onClick={onAdd}
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}