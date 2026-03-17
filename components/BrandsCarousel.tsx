"use client"

import Image from "next/image";

const brands = [
  { name: "Cooper", src: "/images/cooperpharma.jpeg" },
  { name: "king", src: "/images/king.jpeg" },
  { name: "Landerlan", src: "/images/landerlagold.jpeg" },
  { name: "alphapharma", src: "/images/alphapharma.jpeg" },
];

export default function BrandsCarousel() {
  // Duplicamos as marcas várias vezes para garantir que preencham telas largas sem vazios
  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands, ...brands, ...brands, ...brands, ...brands];

  return (
    <section className="py-8 bg-mega-dark border-y border-gray-800 overflow-hidden relative w-full">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-mega-dark to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-mega-dark to-transparent z-10 pointer-events-none"></div>

      <div className="text-center mb-6">
        <p className="text-xs text-mega-orange uppercase font-black tracking-widest px-4">
          As Melhores Marcas do Mercado
        </p>
      </div>

      <div className="flex w-max animate-scroll">
        {duplicatedBrands.map((brand, idx) => (
          <div
            key={idx}
            className="flex-none w-40 md:w-56 mx-3 border-2 border-gray-800 bg-[#121212] rounded-xl flex justify-center items-center overflow-hidden"
          >
            <div className="relative h-24 w-full md:h-32 flex items-center justify-center p-4">
              <Image
                src={brand.src}
                alt={brand.name}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 160px, 224px"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
