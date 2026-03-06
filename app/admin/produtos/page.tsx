"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
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
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin");
      } else {
        setLoadingAuth(false);
        refresh();
      }
    });
    return () => unsub();
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
        imageUrl = await uploadImage(imageFile);
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

      if (editingId != null) {
        await updateProduct(String(editingId), payload);
      } else {
        await addProduct(payload);
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
      <div className="flex flex-col items-center justify-center py-32 text-cyan-400 font-mono">
        <span className="w-8 h-8 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin mb-4"></span>
        [ VERIFICANDO CREDENCIAIS DE ACESSO... ]
      </div>
    );
  }

  return (
    <div className="space-y-12 font-mono animate-in fade-in duration-500 pb-20">
      {/* HEADER PAGE */}
      <div className="flex items-center justify-between border-l-4 border-fuchsia-500 pl-4 py-2 bg-gradient-to-r from-fuchsia-900/20 to-transparent">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">GERENCIAMENTO_DE_INVENTÁRIO</h2>
          <p className="text-sm text-fuchsia-400 mt-1">[ Modificação de Registros Core ]</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* FORMULÁRIO */}
        <div className="lg:col-span-1 border border-white/10 bg-neutral-900/50 backdrop-blur-sm p-6 cyber-clip self-start sticky top-6">
          <h3 className="text-xl font-bold text-cyan-400 mb-6 uppercase tracking-widest border-b border-white/10 pb-4 flex justify-between items-center">
            {editingId ? "++ UPDATE_ITEM ++" : "++ CREATE_ITEM ++"}
            {editingId && (
              <button onClick={startCreate} className="text-xs text-white bg-red-900/50 border border-red-500 px-2 py-1 hover:bg-red-500 cyber-clip">
                CANCELAR
              </button>
            )}
          </h3>

          <div className="space-y-4 text-sm mt-4">
            <div>
              <label className="block text-neutral-400 uppercase tracking-widest mb-1 text-xs">Identificador_Nome</label>
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="w-full bg-black border border-white/10 p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="NOME DO PRODUTO"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 uppercase tracking-widest mb-1 text-xs">Valor</label>
                <input
                  value={draft.price}
                  onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                  inputMode="decimal"
                  className="w-full bg-black border border-white/10 p-3 text-yellow-400 font-bold focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-widest mb-1 text-xs">Classe</label>
                <input
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                  className="w-full bg-black border border-white/10 p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="Suplementos"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-widest mb-1 text-xs">Log_de_Descrição</label>
              <textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                rows={4}
                className="w-full bg-black border border-white/10 p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                placeholder="Detalhes técnicos do item..."
              />
            </div>

            <div className="border border-white/10 p-4 bg-black/50">
              <label className="block text-neutral-400 uppercase tracking-widest mb-2 text-xs">Upload_de_Imagem</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:bg-cyan-900/30 file:text-cyan-400 file:border-0 file:font-mono hover:file:bg-cyan-800 transition-colors cursor-pointer"
              />

              <div className="mt-4 text-center">
                <span className="text-xs text-neutral-500 uppercase">OU INSIRA UMA URL DIRETA</span>
              </div>

              <input
                value={draft.image}
                onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))}
                className="mt-2 w-full bg-black border border-white/10 p-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
                placeholder="https://..."
              />

              {/* PREVIEW */}
              {(imageFile || draft.image) && (
                <div className="mt-4 border border-cyan-500/30 p-1 cyber-clip w-32 mx-auto">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : draft.image}
                    alt="Preview"
                    className="w-full aspect-square object-cover filter grayscale hover:grayscale-0 transition-all cyber-clip"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-500 p-3 mt-4 text-xs text-red-400 animate-pulse uppercase text-center font-bold">
                [ERRO] {error}
              </div>
            )}

            <button
              onClick={save}
              disabled={busy}
              className="mt-6 w-full bg-cyan-600/20 border border-cyan-500 text-cyan-400 py-4 font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all cyber-clip disabled:opacity-50"
            >
              {busy ? "PROCESSANDO..." : editingId ? "[ CONFIRMAR UPDATE ]" : "[ INJETAR NOVO ITEM ]"}
            </button>
          </div>
        </div>

        {/* LISTA DE PRODUTOS */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-neutral-300 uppercase tracking-widest">
              REGISTROS_ATIVOS ({products.length})
            </h3>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="BUSCAR [ NOME, CLASSE ]"
              className="w-64 bg-black border border-white/20 p-2 text-white text-sm focus:outline-none focus:border-cyan-400 cyber-clip-reverse"
            />
          </div>

          <div className="grid gap-4">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="flex flex-col md:flex-row items-center justify-between border border-white/5 bg-neutral-900 overflow-hidden hover:border-cyan-500/30 transition-colors group p-4 gap-4"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-16 h-16 flex-shrink-0 border border-white/10 cyber-clip relative bg-black">
                    {p.image && <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition" />}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg tracking-wider group-hover:text-cyan-400 transition-colors">
                      {p.name}
                    </p>
                    <div className="text-xs text-neutral-500 uppercase tracking-widest mt-1">
                      <span className="text-yellow-400 mr-2 border-b border-yellow-400/30 font-bold">R$ {Number(p.price).toFixed(2)}</span>
                      | CLASSE: {p.category}
                    </div>
                  </div>
                </div>

                <div className="flex w-full md:w-auto gap-2 text-xs font-bold uppercase tracking-wider">
                  <button
                    onClick={() => startEdit(p)}
                    className="flex-1 md:flex-none border border-cyan-500/50 bg-cyan-900/20 text-cyan-400 px-4 py-2 hover:bg-cyan-500 hover:text-black transition-colors"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleRemove(p.id)}
                    disabled={busy}
                    className="flex-1 md:flex-none border border-red-500/50 bg-red-900/20 text-red-400 px-4 py-2 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    DEL
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="p-12 text-center text-neutral-500 border border-dashed border-white/10">
                {"< NENHUM_REGISTRO_ENCONTRADO />"}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
