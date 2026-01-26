// src/app/menu/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useCartStore } from "@/app/store/cartStore";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image_urls?: string[];
  category: string;
}

const categories = [
  "All",
  "Local Favorites",
  "Chicken & Meat",
  "Burgers & Combos",
  "Juices & Drinks",
  "Milk & Milkshakes",
  "Coffee",
];

const carouselImages = [
  "https://tb-static.uber.com/prod/image-proc/processed_images/38bce3348e282757f7d567e6f4a8ba51/fb86662148be855d931b37d6c1e5fcbe.jpeg",
  "https://tb-static.uber.com/prod/image-proc/processed_images/c996ccd6cb17d6d6ae85ca3ffe80e762/fb86662148be855d931b37d6c1e5fcbe.jpeg",
  "https://www.smilepolitely.com/wp-content/uploads/2025/12/Rainbow-Garden-1-1024x769.jpg",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1920&q=80",
  "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=1920&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80",
  "https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=1920&q=80",
];

export default function MenuPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const addToCart = useCartStore((state) => state.addToCart);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MenuItem[];

        setMenuItems(products);
        console.log("Loaded from Firestore:", products.length, "products");

        if (products.length === 0) {
          setErrorMsg("No products found – add some in the admin dashboard");
        } else {
          toast.success(`Loaded ${products.length} menu items`);
        }
      } catch (err: any) {
        console.error("Firestore fetch error:", err);
        setErrorMsg(`Failed to load menu: ${err.message || "Check connection"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Load user's liked items
  useEffect(() => {
    if (!user) return;

    const loadLikes = async () => {
      try {
        const likedSnapshot = await getDocs(collection(db, "users", user.uid, "likedItems"));
        const likedSet = new Set(likedSnapshot.docs.map((doc) => doc.id));
        setLikedItems(likedSet);
      } catch (err) {
        console.error("Error loading likes:", err);
      }
    };

    loadLikes();
  }, [user]);

  // Toggle like / unlike - FIXED VERSION
  const toggleLike = async (itemId: string) => {
    if (!user) {
      toast.error("Please login to like items");
      return;
    }

    const isLiked = likedItems.has(itemId);

    try {
      if (isLiked) {
        // Unlike
        await deleteDoc(doc(db, "users", user.uid, "likedItems", itemId));
        setLikedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
        toast.success("Removed from liked items");
      } else {
        // Like - SAVE FULL PRODUCT DATA
        const item = menuItems.find((m) => m.id === itemId);
        if (!item) {
          toast.error("Item not found");
          return;
        }

        await setDoc(doc(db, "users", user.uid, "likedItems", itemId), {
          name: item.name,
          description: item.description || "",
          price: item.price,
          image_url: item.image_url || "",
          category: item.category || "",
          likedAt: new Date().toISOString(),
        });
        
        setLikedItems((prev) => new Set([...prev, itemId]));
        toast.success("Added to liked items ❤️");
      }
    } catch (err) {
      console.error("Like error:", err);
      toast.error("Failed to update like");
    }
  };

  // Carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <p className="text-2xl text-gray-600 animate-pulse">Loading menu...</p>
        </main>
      </>
    );
  }

  if (errorMsg || filteredItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <p className="text-2xl text-red-600 text-center max-w-xl px-4">
            {errorMsg || "No products available yet"}
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-gray-50">
        {/* Welcome Heading + Carousel */}
        <section className="bg-white py-20 px-6 text-center border-b border-gray-200">
          <h1 className="text-5xl md:text-7xl font-extrabold text-brand-red mb-6">
            Welcome To Fresh$FastFood-Hub!!
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-5xl mx-auto mb-12 font-medium">
            Welcome to Fresh$FastFood-Hub's delicious universe. Everything from our Big on Breakfast, Refreshing Drinks, Decadent Milkshakes to your Generous Big Meals right here at your fingertips. 
            <span className="block mt-6 text-brand-orange font-bold text-4xl">
              ORDER NOW
            </span>
          </p>

          <div className="relative max-w-7xl mx-auto h-96 md:h-[600px] overflow-hidden rounded-3xl shadow-2xl">
            {carouselImages.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1500 ${
                  idx === carouselIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img src={img} alt={`Featured ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-12">
                  <p className="text-white text-3xl md:text-5xl font-bold drop-shadow-2xl">
                    {idx % 2 === 0 ? "BIG ON BREAKFAST" : "GENEROUS BIG MEALS"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Tabs */}
        <section className="py-8 px-6 bg-white shadow-sm sticky top-20 z-10 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex justify-center gap-4 md:gap-6 whitespace-nowrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-brand-red text-white shadow-lg scale-105"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:scale-105"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Menu Grid */}
        <section className="py-20 px-6 max-w-7xl mx-auto relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-5 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-4 border border-gray-100 group relative"
                >
                  {/* Like Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item.id);
                    }}
                    className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/80 shadow hover:bg-white transition"
                  >
                    <span className="text-2xl">
                      {likedItems.has(item.id) ? "❤️" : "🤍"}
                    </span>
                  </button>

                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={item.image_url || "https://via.placeholder.com/400?text=No+Image"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {item.image_urls && item.image_urls.length > 1 && (
                      <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                        +{item.image_urls.length - 1} more photos
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-brand-yellow text-black text-sm font-bold px-4 py-2 rounded-full shadow-md">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-brand-red line-clamp-2 group-hover:text-brand-orange transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-700 mb-5 text-base line-clamp-3">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-brand-green">
                        UGX {(Number(item.price) || 0).toLocaleString()}
                      </span>
                      <button
                        onClick={() => {
                          useCartStore.getState().addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: 1,
                            imageUrl: item.image_url,
                          });
                          toast.success(`${item.name} added to cart! 🍔`);
                        }}
                        className="px-8 py-4 bg-brand-yellow text-black font-bold rounded-xl hover:bg-yellow-300 transition shadow-lg transform hover:scale-105"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}