"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useCartStore } from "@/app/store/cartStore";
import Link from "next/link";
import toast from "react-hot-toast";

export default function UserDashboard() {
  const { cart, removeFromCart, addToCart, clearCart, totalPrice } = useCartStore();
  const [instructions, setInstructions] = useState("");

  const phoneNumber = "256700000000";

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) {
      toast.error("Tray is empty!");
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

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <>
      <Navbar />
      
      {/* Floating Live Total Bubble - Visible on scroll */}
      {cart.length > 0 && (
        <div className="fixed bottom-24 right-6 z-50 bg-brand-red text-white px-6 py-3 rounded-full shadow-2xl font-black animate-bounce md:hidden">
          UGX {totalPrice().toLocaleString()}
        </div>
      )}

      <main className="min-h-screen bg-gray-50 pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Your Command Center</h1>
              <p className="text-gray-500 font-medium">Click an item to view full details.</p>
            </div>
            <button onClick={clearCart} className="bg-gray-200 hover:bg-red-100 hover:text-red-600 px-4 py-2 rounded-xl text-xs font-black transition-colors">
              RESET TRAY
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Item List */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                {cart.length > 0 ? (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-6 group">
                        
                        {/* LINKED AREA: Image and Name click to Detail Page */}
                        <Link href={`/menu/${item.id}`} className="flex items-center gap-4 flex-1">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden relative shadow-inner">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="w-full h-full object-cover brightness-110 contrast-110 group-hover:scale-110 transition-transform duration-500" 
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-lg group-hover:text-brand-red transition-colors">
                              {item.name}
                            </p>
                            <p className="text-brand-green font-bold text-sm underline opacity-0 group-hover:opacity-100 transition-opacity">
                              View Full Info →
                            </p>
                          </div>
                        </Link>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                            <button 
                              onClick={() => removeFromCart(item.id)} 
                              className="w-8 h-8 flex items-center justify-center font-black text-xl hover:bg-white rounded-xl transition-all"
                            >-</button>
                            <span className="px-4 font-black">{item.quantity}</span>
                            <button 
                              onClick={() => addToCart(item)} 
                              className="w-8 h-8 flex items-center justify-center font-black text-xl hover:bg-white rounded-xl transition-all"
                            >+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-gray-400 font-bold mb-6">Your tray is empty.</p>
                    <Link href="/menu" className="bg-brand-yellow text-black px-10 py-4 rounded-2xl font-black shadow-lg">
                      EXPLORE MENU
                    </Link>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                  <span>📝</span> Special Cooking Notes
                </h3>
                <textarea 
                  className="w-full h-24 p-5 bg-gray-50 rounded-[1.5rem] border-none focus:ring-4 focus:ring-brand-yellow/20 transition-all font-medium"
                  placeholder="e.g. Please wrap the rolex tightly, extra salt on fries..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 text-white p-10 rounded-[3rem] shadow-2xl sticky top-28 border border-white/5">
                <h3 className="text-sm font-black text-brand-yellow uppercase tracking-widest mb-8">Order Summary</h3>
                <div className="space-y-6 mb-10">
                   <div className="flex justify-between items-center opacity-60">
                      <span className="font-bold">Items Count</span>
                      <span className="font-black">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
                   </div>
                   <div className="h-[1px] bg-white/10 w-full" />
                   <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Total Amount</span>
                      <span className="text-3xl font-black text-brand-yellow">
                        UGX {totalPrice().toLocaleString()}
                      </span>
                   </div>
                </div>
                
                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-brand-yellow text-black py-6 rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,214,0,0.3)]"
                >
                  Confirm on WhatsApp
                </button>
                
                <p className="text-center text-[10px] uppercase font-bold mt-6 opacity-40 tracking-widest">
                  Secure Checkout via WhatsApp Business
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}