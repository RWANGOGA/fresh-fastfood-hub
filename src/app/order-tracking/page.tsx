// src/app/order-tracking/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/app/components/Navbar";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, desc } from "firebase/firestore";
import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore";
import toast from "react-hot-toast";

interface Order {
  id: string;
  userId: string;
  items: Array<{ id: string; name: string; price: number; quantity: number; imageUrl: string }>;
  total: number;
  status: "pending" | "processing" | "delivered" | "cancelled";
  createdAt: string;
  name: string;
  phone: string;
  address: string;
  area?: string;
  deliveryTime: string;
  paymentMethod: string;
}

export default function OrderTracking() {
  const { user, loading: authLoading } = useAuth("user");
  const { addMultipleToCart } = useCartStore(); // assuming your store has this method

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  const fetchOrders = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      const ordersList: Order[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAtFormatted = data.createdAt?.toDate
          ? data.createdAt.toDate().toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : data.createdAt || "Just now";

        return {
          id: doc.id,
          userId: data.userId,
          items: data.items || [],
          total: Number(data.total) || 0,
          status: data.status || "pending",
          createdAt: createdAtFormatted,
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          area: data.area || "",
          deliveryTime: data.deliveryTime || "ASAP",
          paymentMethod: data.paymentMethod || "Cash on Delivery",
        };
      });

      setOrders(ordersList);
    } catch (err) {
      console.error("Error loading orders:", err);
      // Silent fail - we show nice empty state instead
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.uid]);

  // Calculate grand total of all orders
  const grandTotal = orders.reduce((sum, order) => sum + order.total, 0);

  // Convert deliveryTime to friendly ETA
  const getETA = (time: string) => {
    switch (time) {
      case "ASAP": return "≈ 30–45 min";
      case "1hr": return "≈ 60 min";
      case "2hr": return "≈ 2 hours";
      case "later": return "Scheduled for later";
      default: return time;
    }
  };

  // Reorder all items from an order
  const handleReorder = (items: Order["items"]) => {
    addMultipleToCart(items); // You need this method in your cart store
    toast.success("Items added back to cart!");
  };

  if (authLoading || loading) {
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
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
            <h2 className="text-3xl font-bold text-brand-red mb-4">Please log in</h2>
            <p className="text-gray-600 mb-6">Sign in to view and track your orders.</p>
            <Link href="/login" className="inline-block px-10 py-4 bg-brand-yellow text-black font-bold rounded-full hover:bg-yellow-300 transition">
              Log In
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main
        className="min-h-screen pt-20 bg-cover bg-center bg-fixed relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=2000&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-2xl text-center md:text-left">
              Track Your Orders
            </h1>

            <div className="flex gap-4">
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="px-6 py-3 bg-white/90 backdrop-blur-sm text-brand-red font-bold rounded-full hover:bg-white transition shadow-lg disabled:opacity-50"
              >
                {loading ? "Refreshing..." : "↻ Refresh"}
              </button>

              <Link
                href="/dashboard"
                className="px-6 py-3 bg-brand-yellow text-black font-bold rounded-full hover:bg-yellow-300 transition shadow-lg"
              >
                ← Dashboard
              </Link>
            </div>
          </div>

          {/* Grand Total (only shown when there are orders) */}
          {orders.length > 0 && (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 mb-10 shadow-2xl text-center md:text-left">
              <p className="text-lg text-gray-700">Total spent with us</p>
              <p className="text-4xl md:text-5xl font-bold text-brand-green mt-2">
                UGX {grandTotal.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Thank you for choosing Fresh & Fast Food Hub! 🍔🚚
              </p>
            </div>
          )}

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 md:p-16 text-center">
              <div className="text-8xl mb-8 animate-bounce">🚚</div>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-red mb-6">
                Your first order is waiting!
              </h2>
              <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto leading-relaxed">
                Fast. Fresh. Delivered with love. <br />
                Place your first order today and taste the difference!
              </p>
              <Link
                href="/menu"
                className="inline-block px-12 py-5 bg-brand-red text-white text-xl font-bold rounded-full hover:bg-red-700 transition shadow-2xl transform hover:scale-105"
              >
                Start Ordering Now
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl ${
                    order.status === "cancelled" ? "opacity-75" : ""
                  }`}
                >
                  {/* Header */}
                  <div className="p-6 md:p-8 border-b bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-3">
                          Order #{order.id.slice(0, 8)}
                          {order.status === "cancelled" && (
                            <span className="text-red-600 text-xl">✕ Cancelled</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Placed on {order.createdAt}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-brand-green">
                          UGX {order.total.toLocaleString()}
                        </p>
                        <span
                          className={`inline-block px-5 py-2 mt-3 rounded-full text-sm font-medium ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info & ETA */}
                  <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 border-b">
                    <div>
                      <h4 className="font-bold text-lg mb-4">Delivery Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {order.name}</p>
                        <p><strong>Phone:</strong> {order.phone}</p>
                        <p><strong>Address:</strong> {order.address}</p>
                        {order.area && <p><strong>Area:</strong> {order.area}</p>}
                        <p>
                          <strong>Estimated Time:</strong>{" "}
                          <span className="font-medium text-brand-red">
                            {getETA(order.deliveryTime)}
                          </span>
                        </p>
                        <p><strong>Payment:</strong> {order.paymentMethod}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-4">Order Items ({order.items.length})</h4>
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-4 pb-4 border-b last:border-b-0 last:pb-0 ${
                              order.status === "cancelled" ? "line-through opacity-70" : ""
                            }`}
                          >
                            <img
                              src={item.imageUrl || "https://via.placeholder.com/80"}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover shadow-sm"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium">{item.name}</h5>
                              <p className="text-sm text-gray-600">
                                × {item.quantity} • UGX {item.price.toLocaleString()} each
                              </p>
                            </div>
                            <p className="font-bold text-brand-green whitespace-nowrap">
                              UGX {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 md:p-8 flex flex-wrap gap-4">
                    <Link
                      href="/menu"
                      className="px-6 py-3 bg-brand-yellow text-black font-bold rounded-xl hover:bg-yellow-300 transition shadow-md"
                    >
                      Continue Shopping
                    </Link>

                    {order.status !== "delivered" && order.status !== "cancelled" && (
                      <button
                        onClick={() => handleReorder(order.items)}
                        className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-md"
                      >
                        Reorder This
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// Helper function for ETA display
function getETA(time: string): string {
  switch (time) {
    case "ASAP": return "≈ 30–45 minutes";
    case "1hr": return "≈ 60 minutes";
    case "2hr": return "≈ 2 hours";
    case "later": return "Scheduled for later";
    default: return time;
  }
}