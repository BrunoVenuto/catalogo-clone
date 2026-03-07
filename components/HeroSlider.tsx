"use client";

import { siteConfig } from "@/config/site";
import { motion } from "framer-motion";

export default function HeroSlider() {
  function scrollToProducts() {
    const el = document.getElementById("products");
    if (!el) return;

    const headerOffset = 80;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition =
      elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  return (
    <section className="relative min-h-[90vh] md:h-screen w-full bg-neutral-950 overflow-hidden flex items-center justify-center">
      {/* Background Grid Pattern is handled in globals.css */}

      {/* Tech Elements / Decorations */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-400 opacity-80" />
      <div className="absolute top-20 right-10 hidden md:block opacity-40">
        <div className="w-32 h-1 border-t-2 border-r-2 border-cyan-500 mb-2"></div>
        <div className="w-16 h-1 border-b-2 border-l-2 border-fuchsia-500"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left Column: Typography & CTA */}
        <div className="flex flex-col justify-center items-start pt-20 md:pt-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-3 py-1 bg-yellow-400 text-black font-mono text-sm font-bold mb-6 tracking-widest uppercase cyber-clip-reverse">
              [ SYSTEM STATUS: OPTIMAL ]
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500 leading-tight uppercase tracking-tighter mb-4">
              <span className="block text-cyan-400 cyber-glow-text">Evolução</span>
              <span className="block">Extrema</span>
            </h1>

            <p className="text-neutral-400 text-lg md:text-xl font-mono max-w-md mb-8 border-l-4 border-cyan-500 pl-4 py-1 bg-white/5 backdrop-blur-sm">
              {siteConfig.hero.subtitle}
            </p>

            <button
              onClick={scrollToProducts}
              className="
                group relative
                bg-cyan-400 text-black
                px-10 py-4
                font-black uppercase tracking-wider text-lg
                cyber-clip transition-all duration-300
                hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]
              "
            >
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 cyber-clip transition-colors"></div>
              {siteConfig.hero.cta}
            </button>
          </motion.div>
        </div>

        {/* Right Column: Hero Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center mt-10 md:mt-0"
        >
          {/* Glow behind image */}
          <div className="absolute -inset-4 bg-fuchsia-600/20 blur-3xl rounded-full w-3/4 h-3/4 m-auto"></div>

          <div className="relative border border-white/10 bg-neutral-900/40 backdrop-blur-md p-4 cyber-clip-reverse">
            {/* IMAGEM DESKTOP */}
            <img
              src={siteConfig.hero.imageDesktop}
              alt="Hero desktop"
              className="w-full max-w-[600px] h-auto object-cover hidden md:block border-2 border-cyan-500/50"
            />

            {/* IMAGEM MOBILE */}
            <img
              src={siteConfig.hero.imageMobile}
              alt="Hero mobile"
              className="w-full h-auto object-cover object-center md:hidden border-2 border-fuchsia-500/50"
            />

            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-fuchsia-400"></div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
