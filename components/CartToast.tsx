"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

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
            fixed bottom-24 right-6 z-[60] px-4 py-3 shadow-lg rounded-lg
            bg-white border border-gray-100 text-gray-800
            flex items-center gap-3 transition-all
          `}
        >
          <CheckCircle2 className="text-[#00D000] w-6 h-6" />
          <span className="font-bold text-sm tracking-wide">
            Produto adicionado ao carrinho
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
