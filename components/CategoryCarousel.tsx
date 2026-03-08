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
    <div className="flex flex-wrap justify-center gap-3 mb-10 w-full overflow-x-auto pb-4 scrollbar-hide">
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
              text-xs sm:text-sm font-bold tracking-wide uppercase
              transition-all duration-300 rounded-full
              ${isActive
                ? "bg-mega-orange text-white shadow-md scale-105"
                : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
