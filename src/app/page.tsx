// src/app/page.tsx
import Navbar from "@/app/components/Navbar"; // Your existing path
import HeroCarousel from "@/app/components/HeroCarousel"; // Adjust if path differs

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroCarousel />
    </>
  );
}