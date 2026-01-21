// src/app/checkout/page.tsx
"use client";

import { useCartStore } from "@/app/store/cartStore";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import toast from "react-hot-toast";

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

    // Simulate order placement
    toast.success("Order placed successfully! 🎉 We will contact you shortly.");
    clearCart(); // Empty cart after order
    // In real app: send to backend / WhatsApp API here
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <a href="/menu" className="text-brand-red hover:underline">
              Go back to menu
            </a>
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
          <h1 className="text-4xl font-bold text-brand-red mb-8 text-center">
            Checkout
          </h1>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium">{item.name} × {item.quantity}</p>
                    <p className="text-sm text-gray-600">UGX {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <p className="font-bold text-brand-green">UGX {item.price.toLocaleString()}</p>
                </div>
              ))}
              <div className="flex justify-between pt-4 border-t font-bold text-xl">
                <span>Total</span>
                <span className="text-brand-red">UGX {totalPrice().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-brand-red focus:border-brand-red"
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
                  className="w-full p-3 border rounded-lg focus:ring-brand-red focus:border-brand-red"
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
                  className="w-full p-3 border rounded-lg focus:ring-brand-red focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Area</label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-brand-red focus:border-brand-red"
                >
                  <option value="">Select area</option>
                  <option>Kampala Central</option>
                  <option>Kololo</option>
                  <option>Nakasero</option>
                  <option>Kabowa</option>
                  <option>Makindye</option>
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
                  className="w-full p-3 border rounded-lg focus:ring-brand-red focus:border-brand-red"
                >
                  <option value="ASAP">ASAP (within 45 min)</option>
                  <option value="1hour">In 1 hour</option>
                  <option value="2hours">In 2 hours</option>
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === "cash"}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  Cash on Delivery
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={formData.paymentMethod === "momo"}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  MTN MoMo
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="airtel"
                    checked={formData.paymentMethod === "airtel"}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  Airtel Money
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-5 bg-brand-red text-white font-bold text-xl rounded-full hover:bg-red-700 transition shadow-lg"
            >
              Place Order – UGX {totalPrice().toLocaleString()}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}