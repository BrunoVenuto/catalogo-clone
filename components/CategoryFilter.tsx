"use client";

type Props = {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
};

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
            transition border border-neutral-800
            ${active === category
              ? "bg-fuchsia-600 text-black"
              : "bg-neutral-900 text-white hover:bg-neutral-800"
            }
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
