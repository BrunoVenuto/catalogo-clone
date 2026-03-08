import HeroSlider from "@/components/HeroSlider";
import ProductSection from "@/components/ProductSection";
import SocialProof from "@/components/SocialProof";

export default function HomePage() {
  return (
    <main className="bg-white">
      <HeroSlider />
      <ProductSection />
      <SocialProof />
    </main>
  );
}
