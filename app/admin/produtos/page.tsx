"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";
import { getProducts, addProduct, updateProduct, deleteProduct, uploadImage } from "@/services/products";
import type { Product } from "@/config/products";

type Draft = {
  id?: string | number;
  name: string;
  price: string;
  category: string;
  description: string;
  image: string;
};

function emptyDraft(): Draft {
  return {
    name: "",
    price: "",
    category: "Suplementos",
    description: "",
    image: "",
  };
}

export default function AdminProdutosPage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // AUTH CHECK
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/admin");
      } else {
        setLoadingAuth(false);
        refresh();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/admin");
      } else {
        setLoadingAuth(false);
        refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  async function refresh() {
    const data = await getProducts();
    setProducts(data);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, search]);

  function startCreate() {
    setEditingId(null);
    setDraft(emptyDraft());
    setImageFile(null);
    setError(null);
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setDraft({
      id: p.id,
      name: p.name,
      price: String(p.price ?? ""),
      category: p.category,
      description: p.description,
      image: p.image,
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setError(null);
  }

  async function handleRemove(id: string | number) {
    if (!confirm("[ ALERTA_SISTEMA ] Deseja expurgar este item do banco de dados permanentemente?")) return;
    setBusy(true);
    try {
      await deleteProduct(String(id));
      await refresh();
    } catch (err: any) {
      setError(err.message || "Falha ao excluir.");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setError(null);

    try {
      const parsedPrice = parseFloat(draft.price.replace(",", "."));
      if (!draft.name || isNaN(parsedPrice)) {
        throw new Error("Nome e Preço numérico são obrigatórios para a inserção.");
      }

      let imageUrl = draft.image;

      // Se houver um novo arquivo de imagem para upload
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (uploadErr: any) {
          throw new Error("Bloqueio no Storage (Upload da Foto): " + uploadErr.message);
        }
      } else if (!imageUrl) {
        // Fallback icon placeholder if no image provided
        imageUrl = `https://placehold.co/400x400/0a0a0a/22d3ee/png?text=${draft.name.substring(0, 10).replace(/ /g, "+")}`;
      }

      const payload = {
        name: draft.name.trim(),
        price: parsedPrice,
        category: draft.category.trim(),
        description: draft.description.trim(),
        image: imageUrl,
      };

      try {
        if (editingId != null) {
          await updateProduct(String(editingId), payload);
        } else {
          await addProduct(payload);
        }
      } catch (dbErr: any) {
        throw new Error("Bloqueio no Firestore (Banco de Dados): " + dbErr.message);
      }

      await refresh();
      startCreate();
    } catch (err: any) {
      setError(err?.message || "Falha ao salvar no banco de dados.");
    } finally {
      setBusy(false);
    }
  }

  if (loadingAuth) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-mega-orange font-bold">
        <span className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-mega-orange animate-spin mb-4"></span>
        VERIFICANDO CREDENCIAIS...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 mt-8">
      {/* HEADER PAGE */}
      <div className="flex items-center justify-between border-l-4 border-mega-orange pl-4 py-2 bg-gradient-to-r from-mega-orange/10 to-transparent rounded-r-lg">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-100 uppercase tracking-tight">Catálogo de Produtos</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Gerencie os itens da loja</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mt-6">

        {/* FORMULÁRIO */}
        <div className="lg:col-span-1 border border-gray-800 bg-[#1a1a1a] rounded-xl shadow-sm p-6 lg:self-start lg:sticky lg:top-24">
          <h3 className="text-lg font-black text-gray-100 mb-6 uppercase tracking-tight border-b border-gray-800 pb-4 flex justify-between items-center">
            {editingId ? "Editar Produto" : "Novo Produto"}
            {editingId && (
              <button onClick={startCreate} className="text-xs text-red-500 bg-red-950/20 border border-red-900/50 px-3 py-1.5 rounded hover:bg-red-900/40 hover:text-red-400 transition-colors font-bold uppercase">
                Cancelar Edição
              </button>
            )}
          </h3>

          <div className="space-y-5 text-sm mt-4">
            <div>
              <label className="block text-gray-400 font-bold uppercase tracking-wide mb-1.5 text-xs">Nome do Produto</label>
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="w-full bg-[#121212] border border-gray-800 rounded-md p-3 text-gray-100 focus:outline-none focus:border-mega-orange focus:ring-1 focus:ring-mega-orange transition-all placeholder-gray-600"
                placeholder="Ex: Banco Regulável"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wide mb-1.5 text-xs">Preço (R$)</label>
                <input
                  value={draft.price}
                  onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                  inputMode="decimal"
                  className="w-full bg-[#121212] border border-gray-800 rounded-md p-3 text-gray-100 font-bold focus:outline-none focus:border-mega-orange focus:ring-1 focus:ring-mega-orange transition-all placeholder-gray-600"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wide mb-1.5 text-xs">Categoria</label>
                <input
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                  className="w-full bg-[#121212] border border-gray-800 rounded-md p-3 text-gray-100 focus:outline-none focus:border-mega-orange focus:ring-1 focus:ring-mega-orange transition-all placeholder-gray-600"
                  placeholder="Equipamentos"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-bold uppercase tracking-wide mb-1.5 text-xs">Descrição</label>
              <textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                rows={4}
                className="w-full bg-[#121212] border border-gray-800 rounded-md p-3 text-gray-100 focus:outline-none focus:border-mega-orange focus:ring-1 focus:ring-mega-orange transition-all resize-none placeholder-gray-600"
                placeholder="Detalhes técnicos do item..."
              />
            </div>

            <div className="border border-gray-800 rounded-md p-4 bg-[#121212]">
              <label className="block text-gray-400 font-bold uppercase tracking-wide mb-2 text-xs">Imagem do Produto</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-800 file:text-gray-300 file:font-bold hover:file:bg-gray-700 transition-colors cursor-pointer"
              />

              <div className="mt-4 text-center">
                <span className="text-xs text-gray-500 font-bold uppercase">Ou insira o Link da Imagem</span>
              </div>

              <input
                value={draft.image}
                onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))}
                className="mt-2 w-full bg-[#1a1a1a] border border-gray-800 rounded-md p-2 text-gray-100 focus:outline-none focus:border-mega-orange text-xs placeholder-gray-600"
                placeholder="https://suaimagem.com/foto.jpg"
              />

              {/* PREVIEW */}
              {(imageFile || draft.image) && (
                <div className="mt-4 border border-gray-800 rounded p-1 bg-[#1a1a1a] w-32 mx-auto shadow-sm">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : draft.image}
                    alt="Preview"
                    className="w-full aspect-square object-contain rounded"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-950/20 border border-red-900/50 p-3 mt-4 text-xs text-red-500 rounded-md uppercase text-center font-bold">
                {error}
              </div>
            )}

            <button
              onClick={save}
              disabled={busy}
              className="mt-6 w-full bg-mega-orange text-white py-4 rounded-md font-black uppercase tracking-wide hover:bg-[#e65c00] transition-all shadow-md disabled:opacity-50"
            >
              {busy ? "Salvando..." : editingId ? "Atualizar Produto" : "Cadastrar Produto"}
            </button>
          </div>
        </div>

        {/* LISTA DE PRODUTOS */}
        <div className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-lg font-black text-gray-100 uppercase tracking-tight">
              Todos os Produtos ({products.length})
            </h3>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou categoria..."
              className="w-full sm:w-64 bg-[#1a1a1a] border border-gray-800 rounded-md p-2 text-gray-100 text-sm focus:outline-none focus:border-mega-orange focus:ring-1 focus:ring-mega-orange shadow-sm placeholder-gray-600"
            />
          </div>

          <div className="grid gap-4">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="flex flex-col md:flex-row items-center justify-between border border-gray-800 rounded-xl bg-[#1a1a1a] shadow-sm hover:shadow-md hover:border-mega-orange transition-all group p-4 gap-4"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-16 h-16 flex-shrink-0 border border-gray-800 rounded bg-[#121212] flex items-center justify-center relative overflow-hidden">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-contain p-1 mix-blend-screen" />
                    ) : (
                      <span className="text-gray-700 font-black text-2xl">M</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-100 text-base leading-tight group-hover:text-mega-orange transition-colors">
                      {p.name}
                    </h4>
                    <div className="text-xs text-gray-500 uppercase font-bold mt-1.5">
                      <span className="text-mega-orange mr-2">
                        R$ {Number(p.price).toFixed(2)}
                      </span>
                      &bull; {p.category}
                    </div>
                  </div>
                </div>

                <div className="flex w-full md:w-auto gap-2 text-xs font-bold uppercase tracking-wide">
                  <button
                    onClick={() => startEdit(p)}
                    className="flex-1 md:flex-none border border-gray-700 bg-[#121212] text-gray-300 rounded px-4 py-2 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleRemove(p.id)}
                    disabled={busy}
                    className="flex-1 md:flex-none border border-red-900/50 bg-red-950/20 text-red-500 rounded px-4 py-2 hover:bg-red-900/40 hover:text-red-400 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="p-12 text-center text-gray-500 font-medium bg-[#1a1a1a] border border-dashed border-gray-800 rounded-xl">
                Nenhum produto cadastrado ou encontrado na busca.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
