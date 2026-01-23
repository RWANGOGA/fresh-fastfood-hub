// src/app/checkout/page.tsx
"use client";

import { useCartStore } from "@/app/store/cartStore";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCartStore();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    area: "",
    deliveryTime: "ASAP",
    paymentMethod: "cash",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Order placed successfully! 🎉 We will contact you shortly.");
    clearCart(); // Empty cart after order
    // In real app: send to backend / WhatsApp API here
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
            <h2 className="text-3xl font-bold text-brand-red mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items from the menu first!</p>
            <Link
              href="/menu"
              className="inline-block px-10 py-4 bg-brand-yellow text-black font-bold rounded-full hover:bg-yellow-300 transition"
            >
              Go to Menu
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-red mb-10 text-center">
            Checkout
          </h1>

          {/* Order Summary */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">Order Summary</h2>
            <div className="space-y-4 md:space-y-6">
              {cart.map((item) => (
                <Link href={`/menu/${item.id}`} key={item.id} className="block hover:opacity-90 transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shadow">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{item.name} × {item.quantity}</h3>
                        <p className="text-sm text-gray-600">
                          UGX {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-lg text-brand-green ml-auto">
                      UGX {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
              <div className="flex justify-between pt-6 font-bold text-xl md:text-2xl border-t">
                <span>Total</span>
                <span className="text-brand-red">UGX {totalPrice().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left">Delivery & Payment</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 077xxxxxxx"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Plot 12, Kololo, Kampala"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Area / Suburb</label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none"
                >
                  <option value="">Select area</option>
                  <option>Kampala Central</option>
                  <option>Kololo / Nakasero</option>
                  <option>Kamwokya</option>
                  <option>Makindye</option>
                  <option>Kabowa / Rubaga</option>
                  <option>Entebbe</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Delivery Time</label>
                <select
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none"
                >
                  <option value="ASAP">ASAP (30–60 min)</option>
                  <option value="1hr">In 1 hour</option>
                  <option value="2hr">In 2 hours</option>
                  <option value="later">Schedule for later</option>
                </select>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-10">
              <h3 className="text-xl md:text-2xl font-bold mb-6">Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === "cash" ? "border-brand-red bg-red-50" : "border-gray-300 hover:border-brand-yellow"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === "cash"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <span className="block text-2xl mb-2">💵</span>
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                </label>

                <label className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === "momo" ? "border-brand-red bg-red-50" : "border-gray-300 hover:border-brand-yellow"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={formData.paymentMethod === "momo"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <span className="block text-2xl mb-2">📱</span>
                    <span className="font-medium">MTN MoMo</span>
                  </div>
                </label>

                <label className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === "airtel" ? "border-brand-red bg-red-50" : "border-gray-300 hover:border-brand-yellow"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="airtel"
                    checked={formData.paymentMethod === "airtel"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <span className="block text-2xl mb-2">📱</span>
                    <span className="font-medium">Airtel Money</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              className="w-full py-5 bg-brand-red text-white font-bold text-xl rounded-full hover:bg-red-700 transition shadow-lg transform hover:scale-105"
            >
              Place Order – UGX {totalPrice().toLocaleString()}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}