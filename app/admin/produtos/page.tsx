"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/config/products";
import {
  ensureProductsSeeded,
  getStoredProducts,
  nextProductId,
  resetProductsToDefault,
  setStoredProducts,
} from "@/lib/products-store";

type Draft = {
  id?: number;
  name: string;
  price: string; // keep as string for input
  category: string;
  description: string;
  image: string; // url or dataURL
};

function emptyDraft(): Draft {
  return {
    name: "",
    price: "",
    category: "Linha Gold",
    description: "",
    image: "",
  };
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    ensureProductsSeeded();
    const load = () => setProducts(getStoredProducts());
    load();
    window.addEventListener("products:update", load);
    return () => window.removeEventListener("products:update", load);
  }, []);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removeProduct(id: number) {
    if (!confirm("Excluir este produto?")) return;
    const next = products.filter((p) => p.id !== id);
    setStoredProducts(next);
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      setDraft((d) => ({ ...d, image: dataUrl }));
    } finally {
      setBusy(false);
    }
  }

  function validate(d: Draft) {
    if (!d.name.trim()) return "Nome é obrigatório";
    const price = Number(d.price);
    if (!Number.isFinite(price) || price <= 0) return "Preço inválido";
    if (!d.category.trim()) return "Categoria é obrigatória";
    if (!d.image.trim()) return "Imagem é obrigatória (upload ou URL)";
    return null;
  }

  function save() {
    const err = validate(draft);
    if (err) {
      alert(err);
      return;
    }

    const price = Number(draft.price);
    const next: Product[] = [...products];

    if (editingId == null) {
      const id = nextProductId(next);
      next.unshift({
        id,
        name: draft.name.trim(),
        price,
        category: draft.category.trim(),
        description: draft.description.trim() || "-",
        image: draft.image.trim(),
      });
    } else {
      const idx = next.findIndex((p) => p.id === editingId);
      if (idx === -1) {
        alert("Produto não encontrado para editar");
        return;
      }
      next[idx] = {
        ...next[idx],
        name: draft.name.trim(),
        price,
        category: draft.category.trim(),
        description: draft.description.trim() || "-",
        image: draft.image.trim(),
      };
    }

    setStoredProducts(next);
    startCreate();
    alert("Salvo!");
  }

  function handleReset() {
    if (!confirm("Restaurar lista padrão de produtos? Isso substitui o que está no navegador.")) return;
    resetProductsToDefault();
    startCreate();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {editingId == null ? "Adicionar produto" : `Editando produto #${editingId}`}
            </h2>
            <p className="text-sm text-zinc-300">
              Os produtos são salvos no <b>LocalStorage</b> deste navegador.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={startCreate}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900"
            >
              Novo
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900"
            >
              Restaurar padrão
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm text-zinc-200">Nome</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
              placeholder="Ex: Whey X"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm text-zinc-200">Preço (R$)</span>
            <input
              value={draft.price}
              onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
              inputMode="decimal"
              placeholder="Ex: 199.90"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm text-zinc-200">Categoria</span>
            <input
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
              placeholder="Ex: Linha Premium"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm text-zinc-200">Descrição</span>
            <input
              value={draft.description}
              onChange={(e) =>
                setDraft((d) => ({ ...d, description: e.target.value }))
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
              placeholder="Descrição curta"
            />
          </label>

          <div className="space-y-1 md:col-span-2">
            <span className="text-sm text-zinc-200">Imagem</span>
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                value={draft.image}
                onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
                placeholder="Cole uma URL (/images/x.jpg) ou faça upload"
              />
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900">
                <input type="file" accept="image/*" className="hidden" onChange={onPickFile} />
                {busy ? "Carregando..." : "Upload"}
              </label>
            </div>
            {draft.image ? (
              <div className="mt-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={draft.image}
                  alt="preview"
                  className="h-16 w-16 rounded-lg object-cover ring-1 ring-zinc-800"
                />
                <span className="text-xs text-zinc-400 break-all">{draft.image.startsWith("data:") ? "(imagem em base64 salva no navegador)" : draft.image}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={save}
            className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-300"
          >
            Salvar
          </button>
          {editingId != null ? (
            <button
              onClick={() => removeProduct(editingId)}
              className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-2 text-sm text-red-200 hover:bg-red-950/70"
            >
              Excluir
            </button>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold">Produtos cadastrados ({products.length})</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome/categoria..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:w-96"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-zinc-300">
              <tr className="border-b border-zinc-800">
                <th className="py-3 pr-4">Produto</th>
                <th className="py-3 pr-4">Categoria</th>
                <th className="py-3 pr-4">Preço</th>
                <th className="py-3 pr-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-zinc-800/60">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-10 w-10 rounded-lg object-cover ring-1 ring-zinc-800"
                      />
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-zinc-400">#{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-zinc-200">{p.category}</td>
                  <td className="py-3 pr-4 text-zinc-200">
                    R$ {Number(p.price).toFixed(2)}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 hover:bg-zinc-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => removeProduct(p.id)}
                        className="rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-1.5 text-red-200 hover:bg-red-950/70"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
