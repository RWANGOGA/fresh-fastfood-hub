"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const products = [
  {
    name: "Chicken and Meat",
    img: "https://media.istockphoto.com/id/531469196/photo/chicken-thighs.jpg?s=612x612&w=0&k=20&c=E3JBbXz_xVhOk1sikuVOgO8BufwAqgdk0hC417E0CqI=",
  },
  {
    name: "Local Favourites",
    img: "https://www.theugandaguide.com/wp-content/uploads/2020/05/Katogo.jpg",
  },
  {
    name: "Burgers and Combos",
    img: "https://wimpy.co.za/site/images/pages/family-restaurant-news/burger-milkshakes/burger-strawberry-milkshake.png",
  },
  {
    name: "Juice,Drinks and Coffee",
    img: "https://cmg-cmg-tv-10020-prod.cdn.arcpublishing.com/resizer/v2/BBD2AOV2UI7DRBUOVDZMMVQ7CM.jpg?smart=true&auth=bc589160cc2f52cf8393e838c8c820974e0f7d9271863e0995ad491a2fa0c689&width=1280&height=720",
  },
];

export default function AffiliateProgram() {
  const [earning, setEarning] = useState("+6%");
  const [userEarned, setUserEarned] = useState("€450.64");
  const earningOptions = ["+6%", "+7%", "+5%", "+8%"];
  const userEarnedOptions = ["€450.64", "€523.18", "€678.92", "€715.64", "€392.50"];

  // Animate earnings every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setEarning(earningOptions[Math.floor(Math.random() * earningOptions.length)]);
      setUserEarned(userEarnedOptions[Math.floor(Math.random() * userEarnedOptions.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-white relative">

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-4 md:py-8 lg:py-12 px-2 sm:px-4 md:px-8 min-h-[650px] sm:min-h-[700px]">
        {/* Main rounded red container */}
        <div className="relative bg-gradient-to-br from-red-600 to-red-700 rounded-[30px] sm:rounded-[50px] md:rounded-[80px] min-h-[600px] sm:min-h-[650px] md:min-h-[700px] px-4 sm:px-6 md:px-12 py-8 sm:py-12 md:py-16 overflow-visible shadow-2xl">
          
          {/* Left sidebar badge - hidden on very small screens */}
          <div className="hidden sm:block absolute left-0 top-1/4 bg-pink-600 text-white py-6 sm:py-8 px-2 sm:px-3 rounded-r-2xl shadow-lg z-20">
            <p className="text-xs sm:text-sm font-bold tracking-wider transform rotate-180" style={{ writingMode: 'vertical-rl' }}>
              Rewards
            </p>
          </div>

          {/* Left content */}
          <div className="max-w-full sm:max-w-xl md:max-w-2xl relative z-10">
            <p className="text-base sm:text-xl md:text-2xl mb-2 sm:mb-4 font-semibold text-white">
              Earn with our Affiliate program
            </p>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 md:mb-8 leading-tight text-white">
              You could earn <span className="text-white block sm:inline">€3,000</span><br className="hidden sm:block" />
              per month
            </h1>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-gray-900 text-white font-bold py-3 sm:py-4 md:py-5 px-6 sm:px-8 rounded-full text-sm sm:text-base md:text-lg hover:bg-gray-800 transition shadow-lg w-full sm:w-auto"
              >
                JOIN AND EARN
                <span className="ml-2 sm:ml-3">→</span>
              </Link>
              
              <div className="bg-teal-500/90 backdrop-blur-sm text-gray-900 px-4 sm:px-6 py-3 sm:py-4 rounded-full w-full sm:w-auto transition-all duration-300">
                <p className="text-xs sm:text-sm font-semibold">User** earned</p>
                <p className="text-xl sm:text-2xl font-bold">{userEarned}</p>
              </div>
            </div>
          </div>

          {/* Floating product images - responsive positioning */}
          {products.map((product, i) => {
            // Define positions for different screen sizes
            const positions = [
              { 
                top: "8%", 
                right: "5%", 
                rotate: "5deg",
                mobileTop: "2%",
                mobileRight: "2%"
              },      // Top right - Gyoza
              { 
                top: "45%", 
                right: "2%", 
                rotate: "-3deg",
                mobileTop: "28%",
                mobileRight: "1%"
              },     // Middle right - Vegetable
              { 
                top: "15%", 
                right: "28%", 
                rotate: "-4deg",
                mobileTop: "55%",
                mobileRight: "50%"
              },    // Upper middle - Happy Desi
            ];
            
            if (i >= 3) return null; // Only show 3 products
            
            const pos = positions[i];
            
            return (
              <div
                key={i}
                className="absolute transition-all duration-500 ease-in-out hover:scale-105 sm:hover:scale-110 hover:z-50"
                style={{
                  top: pos.mobileTop,
                  right: pos.mobileRight,
                  transform: `rotate(${pos.rotate})`,
                  width: "120px",
                }}
              >
                <style jsx>{`
                  @media (min-width: 640px) {
                    div {
                      top: ${pos.top} !important;
                      right: ${pos.right} !important;
                      width: 150px !important;
                    }
                  }
                  @media (min-width: 768px) {
                    div {
                      width: 180px !important;
                    }
                  }
                `}</style>
                <div className="relative bg-white/95 backdrop-blur-sm p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white shadow-2xl">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="rounded-lg sm:rounded-xl shadow-xl object-cover w-full h-28 sm:h-32 md:h-40"
                  />
                  
                  {/* Product name below image */}
                  <p className="text-center text-gray-800 font-bold mt-1 sm:mt-2 text-[10px] sm:text-xs leading-tight">
                    {product.name}
                  </p>
                  
                  {/* Earnings badge */}
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-pink-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-xs font-bold shadow-lg">
                    {earning} EARNINGS
                  </div>
                </div>
              </div>
            );
          })}

          {/* "People love us" badge - responsive positioning */}
          <div className="absolute bottom-4 sm:bottom-8 md:bottom-16 left-1/2 -translate-x-1/2 bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl font-bold text-center z-10">
            <p className="text-sm sm:text-base md:text-lg">People</p>
            <p className="text-sm sm:text-base md:text-lg">love us</p>
            <div className="flex gap-0.5 justify-center mt-0.5 sm:mt-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-blue-600 text-[10px] sm:text-xs">★</span>
              ))}
            </div>
            <p className="text-[8px] sm:text-xs text-gray-600 mt-0.5">★ Trustpilot</p>
          </div>

          {/* CFR badge in top right corner - responsive */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-2 sm:border-3 md:border-4 border-dashed border-yellow-400 rounded-full flex items-center justify-center bg-red-700/50">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-yellow-400">CFR</span>
          </div>
        </div>
      </section>

      {/* ================= PURPOSE & HOW IT WORKS SECTION ================= */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-red-700 via-red-800 to-red-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white">
            Our Purpose
          </h2>

          <p className="text-xl md:text-2xl leading-relaxed mb-16 max-w-3xl mx-auto text-white">
            Get paid from new shoppers you invited and existing shoppers you inspired.
            Share your link and earn passive income by spreading the word in your networks.
          </p>

          <div className="grid md:grid-cols-2 gap-14 items-start">

            {/* BOX 1 — Share your link */}
            <div className="text-left">
              <img
                src="https://www.shutterstock.com/image-photo/man-using-virtual-screen-presses-600nw-2471126033.jpg"
                alt="Share your link"
                className="w-full h-auto object-contain mb-6 rounded-xl shadow-lg"
              />

              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Share your link
              </h3>

              <p className="text-lg opacity-90 mb-6 text-white">
                Earn 6% commission using your unique affiliate link.
              </p>

              <button className="bg-white text-red-700 font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition">
                START SHARING →
              </button>
            </div>

            {/* BOX 2 — Refer & keep earning */}
            <div className="text-left">
              <img
                src="https://rakutenadvertising.com/wp-content/uploads/sites/2/2024/11/Image-01.png"
                alt="Refer and keep earning"
                className="w-full h-auto object-contain mb-6 rounded-xl shadow-lg"
              />

              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Refer & keep earning
              </h3>

              <p className="text-lg opacity-90 mb-6 text-white">
                Get 6% commission on all purchases from people you referred — even months later.
              </p>

              <button className="bg-white text-red-700 font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition">
                REFER NOW →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative bg-white px-4 md:px-8 py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Image — FIRST, FULLY VISIBLE, NO CROPPING */}
          <div className="relative w-full order-1">
            <img
              src="https://px-studioassets.pixpa.com/pixpacom/images/affiliate/affiliate_01.jpg"
              alt="Affiliate program"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Right content - Text */}
          <div className="text-black order-2">
            <div className="inline-block bg-pink-600 text-white px-4 py-2 rounded-lg mb-6">
              🎁 <span className="font-bold">Rewards</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Join our Affiliates
              <br />
              program
            </h2>

            <p className="text-lg md:text-xl mb-2">
              Contact us directly for any questions.
            </p>
            <p className="text-lg md:text-xl font-semibold">
              affiliates@fresh-fastfoodhub.com
            </p>
          </div>

          {/* Floating CTA - positioned over the image */}
          <Link
            href="/signup"
            className="absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 bg-black text-white font-bold text-xl md:text-2xl lg:text-3xl py-4 md:py-6 px-10 md:px-16 rounded-full hover:bg-gray-800 transition-all shadow-2xl z-10"
          >
            sign up →
          </Link>
        </div>
      </section>
    </div>
  );
}