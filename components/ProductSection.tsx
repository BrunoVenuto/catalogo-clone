"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/config/products";
import { addToCart } from "@/lib/cart";
import { getProducts } from "@/services/products";
import { X } from "lucide-react";

import ProductCard from "./ProductCard";

// MOCKUPS (Keep export for the seed script)
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "MEGA RACK COM POLIA MÓVEL + BANCO DE SUPINO",
    price: 3500.00,
    description: "Equipamento completo para treino funcional e musculação.",
    image: "/images/hero.jpg",
    category: "Equipamentos",
  },
  {
    id: 2,
    name: "BANCO REGULÁVEL 10X1 COM CADEIRA EXTENSORA",
    price: 1791.00,
    description: "Banco reforçado para diversas posições de supino.",
    image: "https://placehold.co/400x400/ffffff/ff6600/png?text=BANCO+REGUL%C3%81VEL",
    category: "Equipamentos",
  },
  {
    id: 3,
    name: "BICICLETA ERGOMÉTRICA DA SPINNING 18KG",
    price: 2418.27,
    description: "Bicicleta de alto padrão para cardio intenso.",
    image: "https://placehold.co/400x400/ffffff/ff6600/png?text=BICICLETA+SPINNING",
    category: "Equipamentos",
  },
  {
    id: 4,
    name: "KIT DUMBBELL SEXTAVADO 10KG A 30KG",
    price: 1590.00,
    description: "Kit completo de halteres para peso livre.",
    image: "https://placehold.co/400x400/ffffff/ff6600/png?text=DUMBBELL+KIT",
    category: "Pesos Livres",
  },
  {
    id: 5,
    name: "BARRA MACIÇA SUPINO 2M PRETA",
    price: 299.90,
    description: "Barra reforçada com presilhas.",
    image: "https://placehold.co/400x400/ffffff/ff6600/png?text=BARRA+MACI%C3%87A",
    category: "Equipamentos",
  },
  {
    id: 6,
    name: "OFERTA RELÂMPAGO KETTLEBELL 16KG",
    price: 199.90,
    description: "Promoção especial em peso de 16kg",
    image: "https://placehold.co/400x400/ffffff/ff6600/png?text=KETTLEBELL+16KG",
    category: "Mega Ofertas",
  }
];

export default function ProductSection() {
  // Use MOCK_PRODUCTS to match the print for demonstration, since DB might be empty
  const [allProducts, setAllProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false); // Faked loading for now to show visual

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
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

  const categories: string[] = ["MAIS VENDIDOS", "MEGA SALDÃO", "LANÇAMENTOS"];
  const [activeCategory, setActiveCategory] = useState<string>("MAIS VENDIDOS");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter mocked or db products based on selected tab (simplistic mapping)
  const filtered = allProducts; // In a real scenario, map categories properly

  return (
    <section id="produtos" className="py-16 bg-mega-gray relative w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 border-b-2 border-gray-200 mb-10 overflow-x-auto whitespace-nowrap pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-lg sm:text-2xl font-black uppercase tracking-tighter pb-3 transition-colors px-2 border-b-4 ${activeCategory === cat
                  ? "text-black border-black"
                  : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-mega-orange font-bold">
            <span className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-mega-orange animate-spin mb-4"></span>
            Carregando produtos...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 font-bold">
            NENHUM PRODUTO ENCONTRADO
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
              className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-6 relative">
                <button
                  className="absolute top-4 left-4 md:hidden bg-white rounded-full p-2 shadow-sm text-gray-500 hover:text-black"
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
                <div className="flex justify-between items-start mb-4 hidden md:flex">
                  <span className="text-xs bg-gray-200 text-gray-600 uppercase px-2 py-1 rounded font-bold">
                    {selectedProduct.category || "Equipamento"}
                  </span>
                  <button
                    className="text-gray-400 hover:text-black transition-colors"
                    onClick={() => setSelectedProduct(null)}
                  >
                    <X size={24} />
                  </button>
                </div>

                <h3 className="text-2xl font-black uppercase text-gray-900 tracking-tight leading-none mb-4">
                  {selectedProduct.name}
                </h3>

                <p className="text-gray-600 text-sm mb-6 pb-6 border-b border-gray-100">
                  {selectedProduct.description}
                </p>

                <div className="mt-auto">
                  <span className="block text-sm text-gray-500 line-through mb-1">
                    De: R$ {(Number(selectedProduct.price) * 1.2).toFixed(2)}
                  </span>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-4xl font-black text-mega-orange leading-none">
                      R$ {Number(selectedProduct.price).toFixed(2)}
                    </span>
                    <span className="text-lg font-bold text-mega-orange pb-1">à vista</span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-6">
                    ou <span className="font-bold">12x</span> de <span className="font-bold">R$ {(Number(selectedProduct.price) / 12).toFixed(2)}</span> sem juros
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