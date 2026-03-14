"use client"

import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import ProductSection from "@/components/ProductSection";
import SocialProof from "@/components/SocialProof";
import { useState } from "react";

export default function HomePage() {

  const [searchTerm, setSearchTerm] = useState("")

  return (
    <main className="bg-transparent">
      <Header onSearch={setSearchTerm} />
      <HeroSlider />
      <ProductSection searchTerm={searchTerm} />
      <SocialProof />
    </main>
  );
}
