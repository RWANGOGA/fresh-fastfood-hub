// src/app/menu/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useCartStore } from "@/app/store/cartStore"; // Correct path to your cart store
import toast from "react-hot-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

const menuItems: MenuItem[] = [
  // Local Favorites
  {
    id: "1",
    name: "Classic Rolex",
    description: "Fresh chapati with eggs, tomatoes, onions, cabbage & spices",
    price: 8000,
    imageUrl: "https://static01.nyt.com/images/2023/04/19/multimedia/14Komolafe1-bclj/14Komolafe1-bclj-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
    category: "Local Favorites",
  },
  {
    id: "2",
    name: "Loaded Rolex Special",
    description: "Extra eggs, avocado, sausage, cheese & veggies",
    price: 12000,
    imageUrl: "https://eatwellabi.com/wp-content/uploads/2022/05/Ugandan-Rolex-8.jpg",
    category: "Local Favorites",
  },
  {
    id: "matooke",
    name: "Matooke with Groundnut Sauce",
    description: "Steamed matooke with rich peanut sauce & chicken",
    price: 18000,
    imageUrl: "https://sixhungryfeet.com/wp-content/uploads/2023/07/Matoke-Recipe-8-500x375.jpg",
    category: "Local Favorites",
  },
  {
    id: "luwombo",
    name: "Chicken Luwombo",
    description: "Steamed chicken in banana leaves with groundnut sauce",
    price: 22000,
    imageUrl: "https://foodieatlas.com/uganda/luwombo/Luwombo-large.webp",
    category: "Local Favorites",
  },
  {
    id: "goat-stew",
    name: "Goat Meat Stew",
    description: "Tender goat in tomato-onion sauce with matooke",
    price: 25000,
    imageUrl: "https://i.ytimg.com/vi/5aLt0Zu4CQ4/sddefault.jpg",
    category: "Local Favorites",
  },
  {
    id: "posho-beans",
    name: "Posho & Beans",
    description: "Smooth posho with hearty beans stew & greens",
    price: 14000,
    imageUrl: "https://c8.alamy.com/comp/2CBK18E/nsima-also-known-as-ugali-or-posho-is-a-main-meal-for-millions-in-africa-a-popular-combination-with-nyama-choma-2CBK18E.jpg",
    category: "Local Favorites",
  },
  {
    id: "kabalagala",
    name: "Kabalagala",
    description: "Crispy fried banana fritters – sweet, golden & perfectly spiced",
    price: 5000,
    imageUrl: "https://i.ytimg.com/vi/0o1uZ2e9y1A/maxresdefault.jpg",
    category: "Local Favorites",
  },
  {
    id: "katogo",
    name: "Katogo",
    description: "Matooke or posho mixed with beans, meat stew & veggies",
    price: 15000,
    imageUrl: "https://i.ytimg.com/vi/0o1uZ2e9y1A/maxresdefault.jpg",
    category: "Local Favorites",
  },

  // Chicken & Meat
  {
    id: "peri-chicken",
    name: "Peri Peri Chicken",
    description: "Spicy grilled chicken with sauce, chips & salad",
    price: 22000,
    imageUrl: "https://i0.wp.com/smittenkitchen.com/wp-content/uploads//2016/09/piri-piri-chicken.jpg?fit=1200%2C800&ssl=1",
    category: "Chicken & Meat",
  },

  // Burgers & Combos
  {
    id: "burger",
    name: "Beef Burger Deluxe",
    description: "Juicy patty, cheese, lettuce & sauce",
    price: 18000,
    imageUrl: "https://thumbs.dreamstime.com/b/juicy-cheeseburger-tomato-lettuce-red-onion-sesame-seed-bun-close-up-gourmet-featuring-beef-patty-melted-cheese-366153608.jpg",
    category: "Burgers & Combos",
  },

  // Juices & Drinks
  {
    id: "passion-juice",
    name: "Passion Fruit Juice",
    description: "Chilled passion fruit with ice & mint",
    price: 7000,
    imageUrl: "https://thumbs.dreamstime.com/b/refreshing-passion-fruit-mojito-mint-leaves-orange-slice-glass-cup-summer-tropical-beverage-ice-water-drops-citrous-367406261.jpg",
    category: "Juices & Drinks",
  },

  // Milk & Milkshakes
  {
    id: "vanilla-shake",
    name: "Vanilla Milkshake",
    description: "Creamy vanilla with whipped cream & cherry",
    price: 10000,
    imageUrl: "https://media.istockphoto.com/id/1513782239/photo/creamy-milkshake-with-chocolate-drizzle-and-whipped-cream.jpg?s=612x612&w=0&k=20&c=9WjlLyGGCGX8jjI39Pue3Ak6Jg45DzGRZTS6WleeFL0=",
    category: "Milk & Milkshakes",
  },
  {
    id: "pure-milk",
    name: "Fresh Pure Milk",
    description: "Cold farm-fresh milk in elegant glass bottle",
    price: 5000,
    imageUrl: "https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=251833874613063",
    category: "Milk & Milkshakes",
  },

  // Coffee
  {
    id: "black-coffee",
    name: "Black Coffee",
    description: "Strong hot black coffee",
    price: 5000,
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80",
    category: "Coffee",
  },
  {
    id: "latte",
    name: "Latte",
    description: "Smooth espresso with steamed milk & foam art",
    price: 9000,
    imageUrl: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=1920&q=80",
    category: "Coffee",
  },
];

const categories = ["All", "Local Favorites", "Chicken & Meat", "Burgers & Combos", "Juices & Drinks", "Milk & Milkshakes", "Coffee"];

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
  const [activeCategory, setActiveCategory] = useState("All");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const addToCart = useCartStore((state) => state.addToCart);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-gray-50">
        {/* Welcome Heading */}
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

          {/* Sliding Carousel */}
          <div className="relative max-w-7xl mx-auto h-96 md:h-[600px] overflow-hidden rounded-3xl shadow-2xl">
            {carouselImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1500 ${
                  index === carouselIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img src={img} alt={`Featured ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-12">
                  <p className="text-white text-3xl md:text-5xl font-bold drop-shadow-2xl">
                    {index % 2 === 0 ? "BIG ON BREAKFAST" : "GENEROUS BIG MEALS"}
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

        {/* Main Menu Grid */}
        <section className="py-20 px-6 max-w-7xl mx-auto relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-5 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-4 border border-gray-100 group"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
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
                        UGX {item.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => {
                          useCartStore.getState().addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: 1,
                            imageUrl: item.imageUrl,
                          });
                          toast.success(`${item.name} added to cart! 🍔`, {
                            icon: "🛒",
                            style: {
                              background: "#10B981",
                              color: "white",
                              fontWeight: "bold",
                              borderRadius: "9999px",
                              padding: "12px 24px",
                            },
                          });
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