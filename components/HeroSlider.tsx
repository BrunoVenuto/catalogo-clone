"use client";

import { siteConfig } from "@/config/site";
import { motion } from "framer-motion";

export default function HeroSlider() {
  function scrollToProducts() {
    const el = document.getElementById("ofertas");
    if (!el) return;

    const headerOffset = 100;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition =
      elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  return (
    <section className="relative w-full bg-mega-gray overflow-hidden">
      {/* Container Background Split (Desktop) */}
      <div className="absolute inset-0 flex">
        <div className="w-full md:w-1/2 bg-white"></div>
        <div className="hidden md:block w-1/2 bg-mega-orange"></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col md:flex-row items-stretch min-h-[70vh] md:min-h-[600px] shadow-sm">

        {/* Left Area - Text */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-8 md:p-12 lg:p-16 bg-white shrink-0 relative overflow-hidden">
          {/* Faded Background Text like in the print "NOVO NOVO" */}
          <div className="absolute top-10 left-10 opacity-5 pointer-events-none flex flex-col leading-none">
            <span className="text-[120px] font-black italic text-black">NOVO</span>
            <span className="text-[120px] font-black italic text-black -mt-10">NOVO</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-mega-orange italic uppercase tracking-tighter leading-none mb-4">
              <span className="block">{siteConfig.hero.title.split(' ')[0]}</span>
              <span className="block text-black">{siteConfig.hero.title.split(' ')[1] || 'RACK'}</span>
            </h1>

            <div className="w-24 h-2 bg-mega-orange mb-6"></div>

            <p className="text-mega-slate text-lg md:text-xl font-bold max-w-sm mb-8 leading-tight">
              {siteConfig.hero.subtitle}
            </p>

            <button
              onClick={scrollToProducts}
              className="group relative bg-mega-orange text-white px-8 py-4 font-black uppercase tracking-wide text-lg rounded-md hover:bg-[#e65c00] transition-colors shadow-lg"
            >
              {siteConfig.hero.cta}
            </button>
          </motion.div>
        </div>

        {/* Right Area - Images */}
        <div className="w-full md:w-1/2 bg-mega-orange relative flex items-center justify-center p-8 overflow-hidden min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Main Product Image Mockup. Since we don't know if hero.jpg exists, we add a fallback box or style */}
            <div className="relative w-full max-w-[500px] aspect-square lg:aspect-[4/3] bg-white rounded-lg shadow-2xl overflow-hidden border-4 border-white flex items-center justify-center">
              <img
                src={siteConfig.hero.imageDesktop}
                alt="Banner principal mega gym"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback visual if image does not load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement?.classList.add('bg-neutral-200');
                  target.parentElement!.innerHTML = '<span class="text-neutral-400 font-bold text-center p-4">[IMAGEM MEGA RACK]</span>';
                }}
              />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
