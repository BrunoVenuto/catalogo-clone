"use client"

import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import BrandsCarousel from "@/components/BrandsCarousel";
import ProductSection from "@/components/ProductSection";
import SocialProof from "@/components/SocialProof";
import { useState } from "react";

export default function HomePage() {

  const [searchTerm, setSearchTerm] = useState("")

  return (
    <main className="bg-transparent">
      <Header onSearch={setSearchTerm} />
      <HeroSlider />
      <BrandsCarousel />
      <ProductSection searchTerm={searchTerm} />
      <SocialProof />
    </main>
  );
}
