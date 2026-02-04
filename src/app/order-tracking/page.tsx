// src/app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/app/components/Navbar";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useCartStore } from "@/app/store/cartStore";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth("user");
  const { cart, totalPrice, clearCart } = useCartStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    area: "",
    deliveryTime: "ASAP",
    paymentMethod: "cash",
  });
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill name from logged-in user
  useEffect(() => {
    if (user?.displayName) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName,
      }));
    }
  }, [user]);

  // Handle change for input, select, and textarea
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to place order");
      router.push("/login");
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Please fill all required fields");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        area: formData.area,
        deliveryTime: formData.deliveryTime,
        paymentMethod: formData.paymentMethod,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        total: totalPrice(),
        status: "pending",
        createdAt: serverTimestamp(),
      };

      // Save to Firestore
      const orderRef = await addDoc(collection(db, "orders"), orderData);
      const orderId = orderRef.id;

      // Clear cart
      clearCart();

      // Send WhatsApp notification to admin
      const adminPhone = "256756348528"; // 0756348528 without leading zero
      const message = encodeURIComponent(
        `🛒 *NEW ORDER RECEIVED!* 🛒\n\n` +
        `Order ID: ${orderId}\n` +
        `Customer: ${formData.name}\n` +
        `Phone: ${formData.phone}\n` +
        `Email: ${user.email || "Not provided"}\n` +
        `Delivery: ${formData.address}${formData.area ? `, ${formData.area}` : ""}\n` +
        `Time: ${formData.deliveryTime}\n` +
        `Payment: ${formData.paymentMethod === "cash" ? "Cash on Delivery" : formData.paymentMethod}\n` +
        `Items: ${cart.length}\n` +
        `Total: UGX ${totalPrice().toLocaleString()}\n\n` +
        `View in admin: https://your-app-url/admin/orders\n` +
        `Thank you! 🍔🚚`
      );

      // Open WhatsApp
      window.open(`https://wa.me/${adminPhone}?text=${message}`, "_blank");

      toast.success("Order placed successfully! 🎉 Admin notified via WhatsApp.");
      router.push("/dashboard?order=success");
    } catch (err: any) {
      console.error("Order submission error:", err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
            <h2 className="text-3xl font-bold text-brand-red mb-4">Please login to checkout</h2>
            <Link
              href="/login"
              className="inline-block px-10 py-4 bg-brand-yellow text-black font-bold rounded-full hover:bg-yellow-300 transition"
            >
              Go to Login
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
            <h2 className="text-3xl font-bold text-brand-red mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items first!</p>
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
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-red mb-12 text-center">
            Checkout
          </h1>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Left: Order Summary */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
                Your Order
              </h2>

              <div className="space-y-6">
                {cart.map((item) => (
                  <Link
                    href={`/menu/${item.id}`}
                    key={item.id}
                    className="block hover:opacity-90 transition"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shadow">
                          <img
                            src={item.imageUrl || "https://via.placeholder.com/80"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{item.name} × {item.quantity}</h3>
                          <p className="text-sm text-gray-600">
                            UGX {item.price.toLocaleString()} each
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
                  <span>Grand Total</span>
                  <span className="text-brand-red">UGX {totalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right: Delivery & Payment Form */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left">
                Delivery & Payment
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-brand-yellow outline-none"
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
                      className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-brand-yellow outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Plot 12, Kololo, Kampala"
                    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-brand-yellow outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Area / Suburb</label>
                    <select
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-brand-yellow outline-none"
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
                      className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-brand-yellow outline-none"
                    >
                      <option value="ASAP">ASAP (30–60 min)</option>
                      <option value="1hr">In 1 hour</option>
                      <option value="2hr">In 2 hours</option>
                      <option value="later">Schedule for later</option>
                    </select>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Payment Method</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.paymentMethod === "cash"
                          ? "border-brand-red bg-red-50"
                          : "border-gray-300 hover:border-brand-yellow"
                      }`}
                    >
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

                    <label
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.paymentMethod === "momo"
                          ? "border-brand-red bg-red-50"
                          : "border-gray-300 hover:border-brand-yellow"
                      }`}
                    >
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

                    <label
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.paymentMethod === "airtel"
                          ? "border-brand-red bg-red-50"
                          : "border-gray-300 hover:border-brand-yellow"
                      }`}
                    >
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
                  disabled={submitting}
                  className={`w-full py-5 bg-brand-red text-white font-bold text-xl rounded-full hover:bg-red-700 transition shadow-lg transform hover:scale-105 ${
                    submitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? "Placing Order..." : `Place Order – UGX ${totalPrice().toLocaleString()}`}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10 text-center text-gray-600">
            <Link href="/menu" className="hover:text-brand-red">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}