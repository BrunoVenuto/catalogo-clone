"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/config/products";
import { addToCart } from "@/lib/cart";
import { getProducts } from "@/services/products";
import { X } from "lucide-react";
import ProductCard from "./ProductCard";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "ACETATO DE TREMBOLONA",
    price: 3500.0,
    description: "Equipamento completo para treino funcional e musculação.",
    image: "/images/acetato-trembo.jpg",
    category: "",
  },
  {
    id: 2,
    name: "BOLDENONA",
    price: 1791.0,
    description: "Banco reforçado para diversas posições de supino.",
    image: "/images/boldenona.jpg",
    category: "",
  },
  {
    id: 3,
    name: "CIPIONATO DE TESTOSTERONA",
    price: 2418.27,
    description: "Bicicleta de alto padrão para cardio intenso.",
    image: "/images/cipionato.png",
    category: "",
  },
  {
    id: 4,
    name: "CLEMBUTEROL",
    price: 1590.0,
    description: "Kit completo de halteres para peso livre.",
    image: "/images/clembuterol.png",
    category: "",
  },
  {
    id: 5,
    name: "DECALAND",
    price: 299.9,
    description: "Barra reforçada com presilhas.",
    image: "/images/decaland.jpg",
    category: "",
  },
  {
    id: 6,
    name: "DURATESTON",
    price: 199.9,
    description: "Promoção especial em peso de 16kg",
    image: "/images/durateston.jpg",
    category: "",
  },
];

type ProductSectionProps = {
  // termo vindo do Header (ou outro pai)
  searchTerm?: string;
};

export default function ProductSection({ searchTerm = "" }: ProductSectionProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getProducts();
        if (data) {
          setAllProducts(data);
        }
      } catch (err) {
        console.error("Error loading products", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // aplica filtro pelo nome (pode adicionar category/description se quiser)
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return allProducts;
    const term = searchTerm.toLowerCase();
    return allProducts.filter((p) =>
      String(p.name).toLowerCase().includes(term)
    );
  }, [allProducts, searchTerm]);

  return (
    <section id="produtos" className="py-16 bg-transparent relative w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* título + info de filtro */}
        <div className="mb-8 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <h2 className="text-2xl font-black text-white uppercase">
            Produtos
          </h2>
          {searchTerm.trim() && (
            <span className="text-sm text-gray-300">
              Filtrando por:{" "}
              <span className="font-semibold">{searchTerm}</span>
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-mega-orange font-bold">
            <span className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-mega-orange animate-spin mb-4"></span>
            Carregando produtos...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 font-bold text-center">
            NENHUM PRODUTO ENCONTRADO
            {searchTerm.trim() && (
              <p className="mt-2 text-sm text-gray-400">
                Não encontramos resultados para &quot;{searchTerm}&quot;.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={String(product.id)}
                product={product}
                onOpen={() => setSelectedProduct(product)}
                onAdd={() => addToCart(product)}
              />
            ))}
          </div>
        )}

        {/* MODAL DE PRODUTO */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="w-full max-w-3xl bg-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:w-1/2 bg-black/20 flex items-center justify-center p-6 relative">
                <button
                  className="absolute top-4 left-4 md:hidden bg-[#1a1a1a] rounded-full p-2 shadow-sm text-gray-400 hover:text-white"
                  onClick={() => setSelectedProduct(null)}
                >
                  <X size={20} />
                </button>
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-auto max-h-80 object-contain mix-blend-multiply"
                  />
                ) : (
                  <span className="text-gray-400 font-bold">[ NO IMAGE ]</span>
                )}
              </div>

              <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                <div className="flex justify-end mb-4 hidden md:flex">
                  <button
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={() => setSelectedProduct(null)}
                  >
                    <X size={24} />
                  </button>
                </div>

                <h3 className="text-2xl font-black uppercase text-gray-100 tracking-tight leading-none mb-4">
                  {selectedProduct.name}
                </h3>

                <p className="text-gray-300 text-sm mb-6 pb-6 border-b border-gray-800">
                  {selectedProduct.description || "Produto sem descrição detalhada."}
                </p>

                <div className="mt-auto">
                  <span className="block text-sm text-gray-500 line-through mb-1">
                    De: R$ {(Number(selectedProduct.price) * 1.2).toFixed(2)}
                  </span>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-4xl font-black text-mega-orange leading-none">
                      R$ {Number(selectedProduct.price).toFixed(2)}
                    </span>
                    <span className="text-lg font-bold text-mega-orange pb-1">
                      à vista
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-6">
                    ou <span className="font-bold">12x</span> de{" "}
                    <span className="font-bold">
                      R$ {(Number(selectedProduct.price) / 12).toFixed(2)}
                    </span>{" "}
                    sem juros
                  </p>

                  <button
                    className="w-full bg-mega-orange text-white py-4 rounded-md text-lg font-black uppercase tracking-wide hover:bg-[#e65c00] transition-colors shadow-lg shadow-orange-500/30"
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    Comprar Agora
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}