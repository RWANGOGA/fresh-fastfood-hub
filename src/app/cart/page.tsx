"use client";

import Navbar from "@/app/components/Navbar";
import { useCartStore } from "@/app/store/cartStore";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCartStore();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-gray-50 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-brand-red mb-10 text-center">
            Your Cart ({totalItems()})
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600 mb-6">
                Your cart is empty
              </p>
              <Link
                href="/menu"
                className="inline-block px-10 py-5 bg-brand-yellow text-black font-bold text-xl rounded-full hover:bg-yellow-300 transition"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition gap-4"
                  >
                    {/* Wrapped the item details in a Link to show full details */}
                    <Link 
                      href={`/menu/${item.id}`} 
                      className="flex flex-1 items-center gap-4 hover:opacity-80 transition"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-brand-red">{item.name}</h3>
                        <p className="text-gray-600">UGX {item.price.toLocaleString()}</p>
                        <span className="text-sm text-blue-500 underline">View details</span>
                      </div>
                    </Link>

                    {/* Controls (Quantity and Remove) remain outside the detail Link */}
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-xl font-bold min-w-[2rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 font-bold ml-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-white rounded-2xl shadow-xl text-center">
                <p className="text-3xl font-bold mb-6">
                  Total: UGX {totalPrice().toLocaleString()}
                </p>
                
                <Link href="/dashboard">
                  <button className="px-12 py-6 bg-brand-red text-white font-bold text-2xl rounded-full hover:bg-red-700 transition shadow-lg">
                    Go to Dashboard
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}