"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useCartStore } from "@/app/store/cartStore";
import Link from "next/link";
import toast from "react-hot-toast";

export default function UserDashboard() {
  const { cart, removeFromCart, addToCart, clearCart, totalPrice } = useCartStore();
  const [instructions, setInstructions] = useState("");

  // Professional Business Format: 256 (Country) + 756348528
  const phoneNumber = "256756348528";

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) {
      toast.error("Your tray is empty! Add some food first.");
      return;
    }

    const itemDetails = cart
      .map((item) => `• ${item.name} (x${item.quantity}) - UGX ${(item.price * item.quantity).toLocaleString()}`)
      .join("\n");

    const message = `*FRESH$FASTFOOD-HUB ORDER* 📋\n\n` +
      `*Items Ordered:*\n${itemDetails}\n\n` +
      `*Grand Total:* UGX ${totalPrice().toLocaleString()}\n` +
      `--------------------------\n` +
      `*Notes:* ${instructions || "None"}\n` +
      `--------------------------\n` +
      `*Confirming for delivery!* 🛵`;

    // Direct API link to bypass "Open in..." prompts on most browsers
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    // Immediate redirect for app-native feel
    window.location.assign(whatsappUrl);
  };

  return (
    <>
      <Navbar />
      
      {/* Floating Live Total Bubble (Mobile Only) */}
      {cart.length > 0 && (
        <div className="fixed bottom-24 right-6 z-50 bg-brand-red text-white px-6 py-3 rounded-full shadow-2xl font-black animate-bounce md:hidden border-2 border-white">
          UGX {totalPrice().toLocaleString()}
        </div>
      )}

      <main className="min-h-screen bg-gray-50 pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
                Your <span className="text-brand-red">Command</span> Center
              </h1>
              <p className="text-gray-500 font-bold mt-2 uppercase text-xs tracking-widest">
                Manage your tray and confirm your Kampala delivery
              </p>
            </div>
            <button 
              onClick={clearCart} 
              className="bg-white border-2 border-gray-200 text-gray-400 hover:border-brand-red hover:text-brand-red px-6 py-2 rounded-2xl text-xs font-black transition-all active:scale-90"
            >
              RESET TRAY
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Side: Cart Items & Notes */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Subtle Background Pattern */}
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-9xl">🍳</div>
                
                {cart.length > 0 ? (
                  <div className="space-y-8 relative z-10">
                    {cart.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 pb-8 group">
                        
                        <Link href={`/menu/${item.id}`} className="flex items-center gap-6 flex-1 w-full sm:w-auto mb-4 sm:mb-0">
                          <div className="w-24 h-24 rounded-[2rem] overflow-hidden relative shadow-lg ring-4 ring-gray-50">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-xl group-hover:text-brand-red transition-colors">
                              {item.name}
                            </p>
                            <p className="text-brand-green font-black">
                              UGX {item.price.toLocaleString()}
                            </p>
                          </div>
                        </Link>

                        <div className="flex items-center bg-gray-50 rounded-2xl p-2 border border-gray-100">
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="w-10 h-10 flex items-center justify-center font-black text-2xl hover:bg-white hover:shadow-sm rounded-xl transition-all text-brand-red"
                          >-</button>
                          <span className="px-6 font-black text-lg">{item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item)} 
                            className="w-10 h-10 flex items-center justify-center font-black text-2xl hover:bg-white hover:shadow-sm rounded-xl transition-all text-brand-green"
                          >+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-6">📥</div>
                    <p className="text-gray-400 font-black text-xl mb-8 uppercase tracking-tighter">Your tray is empty.</p>
                    <Link href="/menu" className="inline-block bg-brand-red text-white px-12 py-5 rounded-[2rem] font-black shadow-xl hover:shadow-none transition-all hover:translate-y-1">
                      VIEW THE MENU
                    </Link>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <h3 className="text-xl font-black mb-4 flex items-center gap-3">
                  <span className="bg-brand-yellow/20 p-2 rounded-lg">📝</span> 
                  Special Preparation Notes
                </h3>
                <textarea 
                  className="w-full h-32 p-6 bg-gray-50 rounded-[2rem] border-2 border-transparent focus:border-brand-yellow focus:bg-white outline-none transition-all font-bold text-gray-700"
                  placeholder="e.g. Extra onions on the Rolex, or 'Don't put chili'..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
            </div>

            {/* Right Side: Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 text-white p-10 rounded-[3.5rem] shadow-2xl sticky top-28 border-4 border-white/5">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-3 h-3 bg-brand-green rounded-full animate-pulse" />
                   <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Final Checkout</h3>
                </div>

                <div className="space-y-6 mb-12">
                   <div className="flex justify-between items-center opacity-60">
                      <span className="font-bold">Total Items</span>
                      <span className="font-black text-xl">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
                   </div>
                   <div className="h-[1px] bg-white/10 w-full" />
                   <div>
                      <span className="text-gray-400 font-bold block mb-2 uppercase text-[10px] tracking-widest">Grand Total</span>
                      <span className="text-4xl font-black text-brand-yellow tracking-tighter">
                        UGX {totalPrice().toLocaleString()}
                      </span>
                   </div>
                </div>
                
                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-brand-yellow text-black py-7 rounded-[2.5rem] font-black text-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(255,214,0,0.2)] flex items-center justify-center gap-4 group"
                >
                  <span>ORDER NOW</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </button>
                
                <div className="mt-8 flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                   <span className="text-2xl">⚡</span>
                   <p className="text-[10px] font-bold text-gray-400 leading-tight uppercase">
                     Orders are sent directly to our WhatsApp hub for instant confirmation.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}