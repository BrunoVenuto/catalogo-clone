"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HEADER TOP BAR (Optional Mini Bar like MegaGym) */}


      {/* HEADER MAIN */}
      <header className="sticky top-0 z-50 bg-mega-dark w-full shadow-lg border-b-4 border-mega-orange">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-20 md:h-24 flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="relative h-12 w-32 sm:h-14 sm:w-40 flex items-center">
              {/* Fallback text if logo is missing, matching the print "MEGA GYM EQUIPAMENTOS" */}
              <span className="text-2xl sm:text-3xl font-black text-mega-orange italic tracking-tighter">
                MEGAGYM
              </span>
            </div>
          </Link>

          {/* MENU DESKTOP */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold uppercase text-white tracking-wide">
            {siteConfig.menu.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={(e) => {
                  if (item.href.startsWith("#")) {
                    e.preventDefault();
                    const el = document.querySelector(item.href);
                    if (el) {
                      const headerOffset = 100;
                      const elementPosition = el.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    }
                  }
                }}
                className="hover:text-mega-orange transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* SEARCH BAR & ICONS */}
          <div className="hidden md:flex flex-1 max-w-md items-center relative ml-4">
            <input
              type="text"
              placeholder="Busque por produtos"
              className="w-full bg-white text-black py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-mega-orange"
            />
            <button className="absolute right-0 top-0 bottom-0 bg-mega-orange px-4 rounded-r-md flex items-center justify-center hover:bg-[#e65c00] transition-colors">
              <Search size={20} className="text-white" />
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-white ml-auto lg:ml-4">
            <button className="hidden sm:flex flex-col items-center hover:text-mega-orange transition-colors">
              <User size={24} />
            </button>
            <button
              onClick={() => document.dispatchEvent(new Event("open-cart"))}
              className="flex flex-col items-center hover:text-mega-orange transition-colors relative"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-mega-orange text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* HAMBURGUER (MOBILE) */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden text-white hover:text-mega-orange transition-colors"
              aria-label="Abrir menu"
            >
              <Menu size={28} />
            </button>
          </div>

        </div>

        {/* MOBILE SEARCH BAR */}
        <div className="md:hidden px-4 pb-4">
          <div className="flex items-center relative">
            <input
              type="text"
              placeholder="Busque por produtos"
              className="w-full bg-white text-black py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-mega-orange text-sm"
            />
            <button className="absolute right-0 top-0 bottom-0 bg-mega-orange px-4 rounded-r-md flex items-center justify-center">
              <Search size={18} className="text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="absolute top-0 right-0 w-[80vw] max-w-sm h-full bg-mega-dark p-6 shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* TOPO MOBILE */}
              <div className="flex items-center justify-between mb-8 border-b border-mega-slate pb-4">
                <span className="text-2xl font-black text-mega-orange italic tracking-tighter">
                  MEGAGYM
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Fechar menu"
                >
                  <X size={28} />
                </button>
              </div>

              {/* NAV MOBILE */}
              <nav className="flex flex-col gap-4 text-lg font-bold uppercase text-white tracking-wide flex-1 overflow-y-auto">
                {siteConfig.menu.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith("#")) {
                        e.preventDefault();
                        const el = document.querySelector(item.href);
                        if (el) {
                          const headerOffset = 100;
                          const elementPosition = el.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                        }
                      }
                      setOpen(false);
                    }}
                    className="hover:text-mega-orange transition-colors py-2 border-b border-white/5"
                  >
                    {item.label}
                  </a>
                ))}

                {/* CTA MOBILE */}
                <button
                  onClick={() => {
                    setOpen(false);
                    document.dispatchEvent(new Event("open-consultoria"));
                  }}
                  className="mt-6 bg-mega-orange text-white py-4 text-center font-bold uppercase rounded-md shadow-lg hover:bg-[#e65c00] transition-colors"
                >
                  Central de Atendimento
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
