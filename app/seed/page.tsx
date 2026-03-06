"use client";

import { useState } from "react";
import { addProduct } from "@/services/products";
import { MOCK_PRODUCTS } from "@/components/ProductSection";

export default function SeedPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSeed = async () => {
        setLoading(true);
        setMessage("Iniciando injeção de dados no Firebase...");

        try {
            for (const product of MOCK_PRODUCTS) {
                // Remove the hardcoded ID to let Firestore generate one
                const { id, ...productData } = product;

                await addProduct(productData);
                setMessage(`Produto injetado: ${product.name}`);
            }

            setMessage("Todos os produtos foram semeados com sucesso! Você pode deletar essa página (app/seed) depois.");
        } catch (error) {
            console.error(error);
            setMessage("Erro ao semear os dados. Olhe o console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-neutral-900 border border-fuchsia-500/30 cyber-clip p-8 text-center">
                <h1 className="text-2xl font-mono text-fuchsia-400 font-bold mb-4">
                    {"<"} INJEÇÃO_DE_DADOS {">"}
                </h1>
                <p className="text-neutral-400 font-mono text-sm mb-8">
                    Clique no botão abaixo para copiar todos os produtos de teste (MOCK_PRODUCTS) para o banco de dados do Firebase.
                </p>

                <button
                    onClick={handleSeed}
                    disabled={loading}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 font-mono font-bold uppercase disabled:opacity-50 cyber-clip transition-colors w-full"
                >
                    {loading ? "Injetando..." : "Semear Banco de Dados"}
                </button>

                {message && (
                    <p className="mt-6 text-sm font-mono text-yellow-400 bg-black/50 p-4 border border-yellow-400/30 cyber-clip-reverse">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
