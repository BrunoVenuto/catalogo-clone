"use client";

import { motion } from "framer-motion";

const testimonials = [
  { name: "Carlos M.", text: "Produto chegou super rápido. Qualidade excepcional. Recomendo muito o vendedor!" },
  { name: "Mariana S.", text: "O produto mudou minha rotina. Construção muito sólida e rápida." },
  { name: "Ricardo P.", text: "Atendimento top do início ao fim. Produto 100% testado em exames!." },
  { name: "Fernanda L.", text: "Melhor investimento que fiz! Custo benefício imbatível." },
  { name: "André T.", text: "Qualidade e resultado garantido! Comprarei mais vezes." },
  { name: "Juliana R.", text: "Gostei tanto que indiquei todos da minha academia! Top !" },
];

function getInitials(name: string) {
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[1][0];
}

export default function SocialProof() {
  return (
    <section id="contato" className="py-20 bg-transparent text-gray-100 border-t border-gray-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-2 text-mega-orange">
            O QUE NOSSOS CLIENTES DIZEM
          </h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto mt-4">
            A satisfação de quem já usa os melhores produtos  do mercado.
          </p>
          <div className="w-24 h-1 bg-mega-orange mx-auto mt-6"></div>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col h-full relative"
            >
              {/* Aspas decorativas */}
              <div className="absolute top-4 right-6 text-gray-200 font-serif text-6xl leading-none">
                "
              </div>

              {/* Texto */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium flex-grow relative z-10 italic">
                {t.text}
              </p>

              {/* Topo / Autor */}
              <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
                <div className="w-12 h-12 flex-shrink-0 bg-mega-orange text-white font-bold rounded-full flex items-center justify-center text-lg">
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="font-black text-gray-100 uppercase">
                    {t.name}
                  </p>
                  <div className="text-xs text-[#00D000] mt-0.5 flex items-center gap-1 font-bold">
                    Compra Verificada
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
