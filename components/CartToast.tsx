"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CartToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleAdd() {
      setShow(true);
      setTimeout(() => setShow(false), 2000);
    }

    window.addEventListener("cart:add", handleAdd);
    return () => window.removeEventListener("cart:add", handleAdd);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`
            fixed bottom-24 right-6 z-[60] px-6 py-4 shadow-[0_0_20px_rgba(217,70,239,0.3)]
            bg-neutral-900 border-l-4 border-fuchsia-500 text-fuchsia-400
            flex items-center gap-4 transition-all
            font-mono text-sm uppercase tracking-widest cyber-clip
            backdrop-blur-md
          `}
        >
          <span className="animate-pulse">⚡</span>
          <span>[ Item Injetado no Inventário ]</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
