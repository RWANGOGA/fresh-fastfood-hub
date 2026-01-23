// src/app/page.tsx
import Navbar from "@/app/components/Navbar";
import HeroCarousel from "@/app/components/HeroCarousel";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Carousel – main attraction */}
      <HeroCarousel />

      <main className="bg-gray-50 pb-20">
        {/* Dashboard Call-to-Action – kept as strong closer */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="bg-brand-red rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_30px_60px_rgba(239,68,68,0.3)]">
            <span className="absolute top-0 left-0 text-[10rem] font-black text-white/5 select-none -translate-x-10">FRESH</span>

            <div className="relative z-10">
              <h2 className="text-white text-4xl md:text-6xl font-black mb-8 tracking-tighter">
                Everything is ready.<br />Just confirm your delivery.
              </h2>
              <Link
                href="/menu"  // Changed to /menu for direct access
                className="inline-block bg-white text-brand-red px-14 py-6 rounded-full font-black text-xl hover:bg-brand-yellow hover:text-black hover:scale-110 transition-all shadow-2xl"
              >
                START ORDER NOW 🛒
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}