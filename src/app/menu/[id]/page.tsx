"use client";

import { useParams } from "next/navigation";
import { useCartStore } from "@/app/store/cartStore";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

const menuItems = [
  { id: "1", name: "Classic Rolex", description: "Fresh chapati with eggs, tomatoes, onions, cabbage & spices", price: 8000, imageUrl: "https://static01.nyt.com/images/2023/04/19/multimedia/14Komolafe1-bclj/14Komolafe1-bclj-articleLarge.jpg?quality=75&auto=webp&disable=upscale", category: "Local Favorites" },
  { id: "2", name: "Loaded Rolex Special", description: "Extra eggs, avocado, sausage, cheese & veggies", price: 12000, imageUrl: "https://eatwellabi.com/wp-content/uploads/2022/05/Ugandan-Rolex-8.jpg", category: "Local Favorites" },
  { id: "matooke", name: "Matooke with Groundnut Sauce", description: "Steamed matooke with rich peanut sauce & chicken", price: 18000, imageUrl: "https://sixhungryfeet.com/wp-content/uploads/2023/07/Matoke-Recipe-8-500x375.jpg", category: "Local Favorites" },
  { id: "luwombo", name: "Chicken Luwombo", description: "Steamed chicken in banana leaves with groundnut sauce", price: 22000, imageUrl: "https://foodieatlas.com/uganda/luwombo/Luwombo-large.webp", category: "Local Favorites" },
  { id: "goat-stew", name: "Goat Meat Stew", description: "Tender goat in tomato-onion sauce with matooke", price: 25000, imageUrl: "https://i.ytimg.com/vi/5aLt0Zu4CQ4/sddefault.jpg", category: "Local Favorites" },
  { id: "posho-beans", name: "Posho & Beans", description: "Smooth posho with hearty beans stew & greens", price: 14000, imageUrl: "https://c8.alamy.com/comp/2CBK18E/nsima-also-known-as-ugali-or-posho-is-a-main-meal-for-millions-in-africa-a-popular-combination-with-nyama-choma-2CBK18E.jpg", category: "Local Favorites" },
  { id: "kabalagala", name: "Kabalagala", description: "Crispy fried banana fritters – sweet, golden & perfectly spiced", price: 5000, imageUrl: "https://i.ytimg.com/vi/0o1uZ2e9y1A/maxresdefault.jpg", category: "Local Favorites" },
  { id: "katogo", name: "Katogo", description: "Matooke or posho mixed with beans, meat stew & veggies", price: 15000, imageUrl: "https://i.ytimg.com/vi/0o1uZ2e9y1A/maxresdefault.jpg", category: "Local Favorites" },
  { id: "peri-chicken", name: "Peri Peri Chicken", description: "Spicy grilled chicken with sauce, chips & salad", price: 22000, imageUrl: "https://i0.wp.com/smittenkitchen.com/wp-content/uploads//2016/09/piri-piri-chicken.jpg?fit=1200%2C800&ssl=1", category: "Chicken & Meat" },
  { id: "burger", name: "Beef Burger Deluxe", description: "Juicy patty, cheese, lettuce & sauce", price: 18000, imageUrl: "https://thumbs.dreamstime.com/b/juicy-cheeseburger-tomato-lettuce-red-onion-sesame-seed-bun-close-up-gourmet-featuring-beef-patty-melted-cheese-366153608.jpg", category: "Burgers & Combos" },
  { id: "passion-juice", name: "Passion Fruit Juice", description: "Chilled passion fruit with ice & mint", price: 7000, imageUrl: "https://thumbs.dreamstime.com/b/refreshing-passion-fruit-mojito-mint-leaves-orange-slice-glass-cup-summer-tropical-beverage-ice-water-drops-citrous-367406261.jpg", category: "Juices & Drinks" },
  { id: "vanilla-shake", name: "Vanilla Milkshake", description: "Creamy vanilla with whipped cream & cherry", price: 10000, imageUrl: "https://media.istockphoto.com/id/1513782239/photo/creamy-milkshake-with-chocolate-drizzle-and-whipped-cream.jpg?s=612x612&w=0&k=20&c=9WjlLyGGCGX8jjI39Pue3Ak6Jg45DzGRZTS6WleeFL0=", category: "Milk & Milkshakes" },
  { id: "pure-milk", name: "Fresh Pure Milk", description: "Cold farm-fresh milk in elegant glass bottle", price: 5000, imageUrl: "https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=251833874613063", category: "Milk & Milkshakes" },
  { id: "black-coffee", name: "Black Coffee", description: "Strong hot black coffee", price: 5000, imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80", category: "Coffee" },
  { id: "latte", name: "Latte", description: "Smooth espresso with steamed milk & foam art", price: 9000, imageUrl: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=1920&q=80", category: "Coffee" },
];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);
  
  // Tracking State
  const [progress, setProgress] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const item = menuItems.find((product) => product.id === id);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold mb-4 text-brand-red">Oops! Item not found.</h2>
        <Link href="/menu" className="bg-brand-yellow px-8 py-3 rounded-full font-bold">Back to Menu</Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Main Product Card */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
            <div className="md:w-1/2 h-[450px] md:h-auto overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover brightness-110 contrast-110"
              />
            </div>

            <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
              <span className="text-brand-red font-black uppercase tracking-widest text-sm mb-4">{item.category}</span>
              <h1 className="text-5xl font-black text-gray-900 mb-6">{item.name}</h1>
              <p className="text-4xl font-bold text-brand-green mb-8">UGX {item.price.toLocaleString()}</p>
              <div className="border-t pt-8 mb-10 text-gray-600 text-xl leading-relaxed">{item.description}.</div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    addToCart({ ...item, quantity: 1 });
                    toast.success(`${item.name} added! 😋`);
                  }}
                  className="w-full py-6 bg-brand-yellow text-black font-black text-2xl rounded-2xl hover:bg-yellow-300 transition-all shadow-xl active:scale-95"
                >
                  ADD TO CART
                </button>
                <Link href="/dashboard" className="w-full text-center py-6 bg-brand-red text-white font-black text-2xl rounded-2xl hover:bg-red-700 transition-all shadow-xl">
                  USER DASHBOARD
                </Link>
              </div>
            </div>
          </div>

          {/* Live Order Tracking Section */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-8 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900">Live Order Tracking</h2>
              <span className="px-4 py-1 bg-green-100 text-green-600 rounded-full text-sm font-bold animate-pulse">● Live Updates</span>
            </div>
            
            <div className="flex flex-col lg:flex-row">
              {/* Google Map Section */}
              <div className="lg:w-2/3 h-[400px] relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.027047716616!2d32.576191!3d0.324831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb9021755555%3A0x88989898989898!2sKampala!5e0!3m2!1sen!2sug!4v1700000000000!5m2!1sen!2sug"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                ></iframe>
              </div>

              {/* Status Details Section */}
              <div className="lg:w-1/3 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🛵</span>
                    <div>
                      <p className="text-sm font-bold text-gray-500 uppercase">Rider Information</p>
                      <p className="text-xl font-black">Musa Boda Boda</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-2 uppercase text-gray-400">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-green transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-gray-900">📍 Current Location</p>
                      <p className="text-gray-500">Passing through Wandegeya, heading your way!</p>
                    </div>
                  </div>
                </div>

                <a href="tel:+256756348528" className="mt-8 w-full py-4 border-2 border-brand-red text-brand-red font-black rounded-xl hover:bg-red-50 text-center transition">
                  CALL RIDER
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}