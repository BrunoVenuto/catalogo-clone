"use client";

type Props = {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
};

export default function CategoryCarousel({
  categories,
  active,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {categories.map((category) => {
        const isActive = active === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`
              relative whitespace-nowrap
              px-5 py-2 sm:px-6 sm:py-3 
              text-xs sm:text-sm font-black font-mono tracking-widest uppercase
              transition-all duration-300
              cyber-clip
              ${isActive
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-105"
                : "bg-neutral-900 border border-white/10 text-neutral-500 hover:text-white hover:border-white/30 hover:scale-105"
              }
            `}
          >
            {/* Active Indicator Line */}
            {isActive && (
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400"></div>
            )}
            {category}
          </button>
        );
      })}
    </div>
  );
}
