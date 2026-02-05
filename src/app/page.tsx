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
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="bg-brand-red rounded-3xl sm:rounded-[4rem] p-6 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-[0_30px_60px_rgba(239,68,68,0.3)]">
            <span className="absolute top-0 left-0 text-6xl sm:text-8xl md:text-[10rem] font-black text-white/5 select-none -translate-x-10">FRESH</span>

            <div className="relative z-10">
              <h2 className="text-white text-2xl sm:text-4xl md:text-6xl font-black mb-6 sm:mb-8 tracking-tighter">
                Everything is ready.<br />Just confirm your delivery.
              </h2>
              <Link
                href="/menu"
                className="inline-block bg-white text-brand-red px-6 sm:px-14 py-3 sm:py-6 rounded-full font-black text-base sm:text-xl hover:bg-brand-yellow hover:text-black hover:scale-110 transition-all shadow-2xl"
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