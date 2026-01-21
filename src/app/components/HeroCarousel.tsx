// src/components/HeroCarousel.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Phase constants
const PHASE_IMAGES = "images";
const PHASE_VIDEOS = "videos";

// Food image slides
const foodSlides = [
  {
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1920&q=80",
    alt: "Juicy burger and fries combo",
  },
  {
    src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80",
    alt: "Crispy fried chicken with sides",
  },
  {
    src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1920&q=80",
    alt: "Delicious cheeseburger",
  },
  {
    src: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=1920&q=80",
    alt: "Variety of fast food dishes",
  },
];

// Your local videos
const serviceVideos = [
  "/videos/foodhub.mp4",
  "/videos/foodhub2.mp4",
];

export default function HeroCarousel() {
  const [phase, setPhase] = useState(PHASE_IMAGES);
  const [foodIndex, setFoodIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (phase === PHASE_IMAGES) {
      interval = setInterval(() => {
        setFoodIndex((prev) => {
          const next = (prev + 1) % foodSlides.length;
          if (next === 0) {
            // Immediately switch to videos after last image
            setPhase(PHASE_VIDEOS);
            setVideoIndex(0);
          }
          return next;
        });
      }, 4000);
    } else if (phase === PHASE_VIDEOS) {
      interval = setInterval(() => {
        setVideoIndex((prev) => {
          const next = (prev + 1) % serviceVideos.length;
          if (next === 0) {
            // Immediately switch back to images after last video
            setPhase(PHASE_IMAGES);
            setFoodIndex(0);
          }
          return next;
        });
      }, 15000); // ← This is per-video duration – adjust to match your actual video lengths
    }

    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Food images phase */}
      {phase === PHASE_IMAGES &&
        foodSlides.map((slide, index) => (
          <div
            key={`food-${index}`}
            className={`absolute inset-0 transition-opacity duration-1500 ${
              index === foodIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover brightness-110 contrast-110" // Brighter & more vivid
              priority={index === 0}
              quality={90}
            />
          </div>
        ))}

      {/* Video phase – full visibility */}
      {phase === PHASE_VIDEOS &&
        serviceVideos.map((src, index) => (
          <video
            key={`video-${index}`}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-1500 ${
              index === videoIndex ? "opacity-100" : "opacity-0"
            } brightness-110 contrast-110`} // Make videos brighter & clearer
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}

      {/* Lighter overlay – text stays readable but media not too dark */}
      <div className="absolute inset-0 bg-black/35 z-10" />

      {/* Text & CTA – always on top, never hidden */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 drop-shadow-2xl">
          Fresh$FastFood-Hub
        </h1>
        <p className="text-xl md:text-3xl lg:text-4xl mb-10 font-medium max-w-4xl">
          Fast. Fresh. Delivered Hot in Kampala – Ready in Minutes!
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <a
            href="/menu"
            className="inline-block px-10 py-5 bg-brand-yellow text-black font-bold text-xl rounded-full shadow-2xl hover:bg-yellow-300 transition transform hover:scale-105"
          >
            START ORDER
          </a>
          <a
            href="/menu"
            className="inline-block px-10 py-5 bg-transparent border-2 border-white text-white font-bold text-xl rounded-full hover:bg-white/20 transition"
          >
            VIEW MENU
          </a>
        </div>
      </div>
    </div>
  );
}