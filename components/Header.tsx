"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b-[2px] border-cyan-500/30 w-full"
      >
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 sm:h-18 md:h-20 flex items-center justify-between">

          {/* LOGO + NOME */}
          <Link href="/" className="flex items-center gap-4 min-w-0 group">
            <div
              className="
                relative
                h-10 w-10 sm:h-12 sm:w-12
                shrink-0
                cyber-clip-reverse
                overflow-hidden
                border border-cyan-400
                bg-cyan-500/10
                group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]
                transition-all duration-300
              "
            >
              <Image
                src="/images/logo-desktop.jpg"
                alt={`${siteConfig.name} logo`}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col">
              <span
                className="
                   truncate
                   text-lg sm:text-xl
                   font-black tracking-widest uppercase
                   text-cyan-400 cyber-glow-text
                   group-hover:text-white transition-colors duration-300
                 "
              >
                {siteConfig.name}
              </span>
              <span className="text-[10px] font-mono text-fuchsia-400 tracking-[0.2em] hidden sm:block uppercase">
                 /// SYSTEM ENABLED
              </span>
            </div>
          </Link>

          {/* MENU (aparece no tablet e desktop) */}
          <nav className="hidden sm:flex items-center gap-8 text-sm font-mono tracking-widest uppercase text-neutral-400">
            <Link href="/" className="hover:text-cyan-400 hover:text-shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all">
              Home
            </Link>
            <Link href="/#collections" className="hover:text-cyan-400 transition-all">
              Coleções
            </Link>
            <Link href="/#products" className="hover:text-cyan-400 transition-all">
              Produtos
            </Link>
            <Link href="/#contact" className="hover:text-cyan-400 transition-all">
              Contato
            </Link>

            {/* CTA (desktop/tablet) */}
            <button
              onClick={() =>
                document.dispatchEvent(new Event("open-consultoria"))
              }
              className="
                ml-4 relative
                bg-fuchsia-600/10 text-fuchsia-400
                border border-fuchsia-500
                px-6 py-2 
                font-black uppercase cyber-clip
                hover:bg-fuchsia-600 hover:text-black hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all
              "
            >
              Consultoria
              {/* Terminal cursor blink effect */}
              <span className="inline-block w-2 h-4 bg-fuchsia-400 ml-2 animate-pulse align-middle"></span>
            </button>
          </nav>

          {/* HAMBURGUER (somente mobile) */}
          <button
            onClick={() => setOpen(true)}
            className="sm:hidden text-cyan-400 text-3xl leading-none font-mono tracking-tighter"
            aria-label="Abrir menu"
          >
            [=]
          </button>
        </div>
      </motion.header>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="absolute top-0 right-0 w-[85vw] max-w-sm h-full bg-neutral-950 border-l border-cyan-500/30 p-8 shadow-[-10px_0_30px_rgba(34,211,238,0.1)]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, type: "spring", stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative scanline */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

              {/* TOPO */}
              <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 min-w-0"
                >
                  <div className="relative h-12 w-12 shrink-0 cyber-clip-reverse overflow-hidden border border-cyan-400 bg-cyan-500/10">
                    <Image
                      src="/images/logo-mobile.jpg"
                      alt={`${siteConfig.name} logo`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  <span
                    className="
                      truncate
                      text-xl font-black uppercase
                      text-cyan-400 cyber-glow-text
                    "
                  >
                    {siteConfig.name}
                  </span>
                </Link>

                <button
                  onClick={() => setOpen(false)}
                  className="text-fuchsia-400 font-mono text-xl cyber-clip p-2 border border-fuchsia-500/30 hover:bg-fuchsia-500/20 transition-colors"
                  aria-label="Fechar menu"
                >
                  [X]
                </button>
              </div>

              {/* NAV MOBILE */}
              <nav className="flex flex-col gap-6 text-xl font-mono uppercase tracking-widest text-neutral-400">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="hover:text-cyan-400 transition-colors border-l-2 border-transparent hover:border-cyan-400 pl-4"
                >
                  <span className="text-cyan-500 mr-2 opacity-50">#</span>Home
                </Link>
                <Link
                  href="/#collections"
                  onClick={() => setOpen(false)}
                  className="hover:text-cyan-400 transition-colors border-l-2 border-transparent hover:border-cyan-400 pl-4"
                >
                  <span className="text-cyan-500 mr-2 opacity-50">#</span>Coleções
                </Link>
                <Link
                  href="/#products"
                  onClick={() => setOpen(false)}
                  className="hover:text-cyan-400 transition-colors border-l-2 border-transparent hover:border-cyan-400 pl-4"
                >
                  <span className="text-cyan-500 mr-2 opacity-50">#</span>Produtos
                </Link>
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="hover:text-cyan-400 transition-colors border-l-2 border-transparent hover:border-cyan-400 pl-4"
                >
                  <span className="text-cyan-500 mr-2 opacity-50">#</span>Contato
                </Link>

                {/* CTA MOBILE */}
                <button
                  onClick={() => {
                    setOpen(false);
                    document.dispatchEvent(new Event("open-consultoria"));
                  }}
                  className="
                    mt-8 relative
                    bg-fuchsia-600/10 text-fuchsia-400
                    border border-fuchsia-500
                    py-4 text-center
                    font-black uppercase cyber-clip
                    hover:bg-fuchsia-600 hover:text-black hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all
                  "
                >
                  Consultoria
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
