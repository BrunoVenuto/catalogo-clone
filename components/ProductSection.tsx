"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/config/products";
import { addToCart } from "@/lib/cart";
import { getProducts } from "@/services/products";

import ProductCard from "./ProductCard";
import CategoryCarousel from "./CategoryCarousel";

// MOCKUPS (Keep export for the seed script)
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "NEXUS WHEY PROTEIN ISOLATE",
    price: 249.90,
    description: "[+] Synth-enhanced pure whey isolate.\n[+] Maximum absorption rate.\n[+] Nanobot delivery system for rapid recovery.",
    image: "https://placehold.co/400x400/0a0a0a/22d3ee/png?text=WHEY+ISOLATE",
    category: "Suplementos",
  },
  {
    id: 2,
    name: "CYBER-CREATINE MONOHYDRATE",
    price: 129.50,
    description: "[+] ATP synthesis overdrive.\n[+] Enhanced cellular hydration.\n[+] Strength modifier +15%.",
    image: "https://placehold.co/400x400/0a0a0a/d946ef/png?text=CREATINE+OVERDRIVE",
    category: "Suplementos",
  },
  {
    id: 3,
    name: "PRE-WORKOUT NEURAL STIMULANT",
    price: 189.90,
    description: "[+] Focus lock-on protocol.\n[+] Vascular expansion algorithms.\n[+] Energy burst duration: 4 hours.",
    image: "https://placehold.co/400x400/0a0a0a/eab308/png?text=PRE-WORKOUT",
    category: "Suplementos",
  },
  {
    id: 4,
    name: "BCAA RECOVERY MATRIX",
    price: 159.00,
    description: "[+] Muscle tissue repair sequence.\n[+] Anti-catabolic shield.\n[+] Cybernetic synthesis support.",
    image: "https://placehold.co/400x400/0a0a0a/22d3ee/png?text=BCAA+MATRIX",
    category: "Suplementos",
  },
  {
    id: 5,
    name: "THERMO-CHIP FAT BURNER",
    price: 199.90,
    description: "[+] Core temperature elevation.\n[+] Metabolic overdrive active.\n[+] Lipid destruction protocol.",
    image: "https://placehold.co/400x400/0a0a0a/d946ef/png?text=THERMO-CHIP",
    category: "Emagrecedores",
  },
  {
    id: 6,
    name: "MULTI-VIT SYNTHETIC PACK",
    price: 99.90,
    description: "[+] Essential micronutrient load.\n[+] Immune system firmware update.\n[+] Daily operational requirement.",
    image: "https://placehold.co/400x400/0a0a0a/eab308/png?text=MULTI-VIT",
    category: "Vitaminas",
  }
];

export default function ProductSection() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getProducts();
      setAllProducts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const categories: string[] = useMemo(
    () => ["Todos", ...Array.from(new Set(allProducts.map((p) => p.category)))],
    [allProducts]
  );

  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = allProducts
    .filter((p) => activeCategory === "Todos" ? true : p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <section id="products" className="py-24 bg-neutral-950 relative border-t border-white/5">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-cyan-900/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-[400px] bg-fuchsia-900/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-white/10 pb-6">
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white uppercase tracking-wider">
            Catálogo
          </h2>
          <div className="hidden md:block w-32 h-1 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full"></div>
        </div>

        <input
          type="text"
          placeholder="[ BUSCAR PRODUTO... ]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-8 w-full md:w-96 px-4 py-3 bg-neutral-900/50 backdrop-blur-md text-white border border-white/10 focus:outline-none focus:border-cyan-400 cyber-clip-reverse font-mono transition-colors"
        />

        <CategoryCarousel
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-cyan-400 font-mono">
            <span className="w-8 h-8 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin mb-4"></span>
            Acessando Servidor de Dados...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500 font-mono">
            <span className="text-4xl mb-4">{"< Ø >"}</span>
            NENHUM REGISTRO ENCONTRADO
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
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

        {selectedProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="w-full max-w-2xl cyber-clip p-1 bg-gradient-to-br from-cyan-500 via-purple-500 to-fuchsia-500"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full bg-neutral-950 p-6 cyber-clip text-white relative">

                {/* Decorative border top left */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/50"></div>

                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="text-2xl font-black uppercase text-cyan-400 tracking-wider">
                    {selectedProduct.name}
                  </h3>
                  <button
                    className="border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-1 text-sm font-mono transition-colors cyber-clip-reverse"
                    onClick={() => setSelectedProduct(null)}
                  >
                    [ X ]
                  </button>
                </div>

                {selectedProduct.image && (
                  <div className="relative border border-white/10 p-2 cyber-clip">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="h-64 w-full object-cover cyber-clip filter brightness-90 hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                )}

                <p className="mt-6 text-neutral-300 font-mono text-sm leading-relaxed border-l-2 border-fuchsia-500 pl-3">
                  {selectedProduct.description}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-3xl font-black font-mono text-yellow-400">
                    R$ {Number(selectedProduct.price).toFixed(2)}
                  </span>
                  <button
                    className="cyber-clip bg-fuchsia-600 px-8 py-3 text-sm font-black text-black uppercase tracking-wider hover:bg-fuchsia-500 transition-colors cyber-border-glow"
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    Adicionar
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