// src/app/order-tracking/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/app/components/Navbar";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderTracking() {
  const { user } = useAuth("user");
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");

  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlightedOrder, setHighlightedOrder] = useState<any>(null);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const ordersList = querySnapshot.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            ...data,
            total: data.total || 0,
            createdAt: data.createdAt?.toDate?.()
              ? data.createdAt.toDate().toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Just now",
          };
        });

        // Sort by date (newest first)
        ordersList.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setAllOrders(ordersList);

        // Calculate grand total
        const total = ordersList.reduce((sum, order) => sum + (order.total || 0), 0);
        setGrandTotal(total);

        // If highlight param is set, find and focus that order
        if (highlight) {
          const order = ordersList.find((o) => o.id === highlight);
          if (order) {
            setHighlightedOrder(order);
          }
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.uid, highlight]);

  if (loading) {
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
        <main className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
            <h2 className="text-3xl font-bold text-brand-red mb-4">Please login to view orders</h2>
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

  return (
    <>
      <Navbar />
      <main 
        className="min-h-screen pt-20 py-12 px-4 sm:px-6 relative"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%), url('https://img.freepik.com/premium-photo/assorted-food-dishes-takeout-containers-food-truck-counter-sunset-background_1317057-146.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Subtle overlay for better text readability - now 15-25% instead of 90% */}
        <div className="absolute inset-0 bg-linear-to-br from-black/20 to-black/10"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header with Appreciation Message */}
          <div className="text-center mb-8 md:mb-12">
            <div className="text-5xl md:text-6xl mb-4 animate-bounce">❤️</div>
            <h1 className="text-3xl md:text-5xl font-bold bg-linear-to-r from-white to-yellow-100 bg-clip-text text-transparent mb-4 drop-shadow-lg">
              Thank You for Your Trust!
            </h1>
            <p className="text-lg md:text-xl text-white mb-3 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-semibold">
              We truly appreciate your continued support and loyalty. Every order you place helps us grow and serve you better with fresh, delicious food! 🙏✨
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold text-sm shadow-lg">
                🎯 Quality Guaranteed
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm shadow-lg">
                ⚡ Fast Delivery
              </span>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm shadow-lg">
                💝 Best Value
              </span>
            </div>
          </div>

          {/* Grand Total Card */}
          {allOrders.length > 0 && (
            <div className="bg-linear-to-r from-brand-red to-orange-500 rounded-2xl shadow-2xl p-6 md:p-10 mb-12 text-white transform hover:scale-105 transition-transform border-4 border-yellow-300">
              <div className="text-center">
                <p className="text-lg md:text-xl opacity-95 mb-3 flex items-center justify-center gap-2 font-bold drop-shadow-lg">
                  <span>💰</span> Your Total Investment in Amazing Food
                </p>
                <h2 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
                  UGX {grandTotal.toLocaleString()}
                </h2>
                <p className="text-sm md:text-base opacity-95 max-w-2xl mx-auto font-semibold drop-shadow-md">
                  {allOrders.length} delicious order{allOrders.length !== 1 ? 's' : ''} • Supporting local food excellence
                </p>
              </div>
            </div>
          )}

          {/* Highlighted Order (if coming from order-confirmation) */}
          {highlightedOrder && (
            <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl shadow-2xl p-6 md:p-8 mb-12 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
                ⭐ Currently Viewing Order
              </h2>
              
              {/* Highlighted Order Details Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                  {/* Left Column: Order Details */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                      📋 Order Details
                    </h3>
                    <div className="space-y-3 text-sm md:text-base">
                      <p><strong>Order ID:</strong> #{highlightedOrder.id.slice(0, 8)}</p>
                      <p><strong>Placed on:</strong> {highlightedOrder.createdAt}</p>
                      <p className="flex items-center gap-2">
                        <strong>Status:</strong>
                        {highlightedOrder.status === "pending" && <span>⏳ Pending</span>}
                        {highlightedOrder.status === "processing" && <span>🔄 Processing</span>}
                        {highlightedOrder.status === "delivered" && <span>✅ Delivered</span>}
                        {highlightedOrder.status === "cancelled" && <span>❌ Cancelled</span>}
                      </p>
                      <p><strong>Payment:</strong> {highlightedOrder.paymentMethod === "cash" ? "💵 Cash on Delivery" : highlightedOrder.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Right Column: Delivery Info */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                      🚚 Delivery Info
                    </h3>
                    <div className="space-y-3 text-sm md:text-base">
                      <p><strong>Name:</strong> {highlightedOrder.name || highlightedOrder.fullName || "—"}</p>
                      <p><strong>Phone:</strong> {highlightedOrder.phone || "—"}</p>
                      <p><strong>Address:</strong> {highlightedOrder.address || "—"}</p>
                      {highlightedOrder.area && <p><strong>Area:</strong> {highlightedOrder.area}</p>}
                      <p><strong>Delivery Time:</strong> {highlightedOrder.deliveryTime || "ASAP"}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Method Reminder Card */}
                <div className="bg-blue-900/40 border-2 border-blue-300 rounded-lg p-4 md:p-6 mb-6">
                  <p className="text-sm md:text-base flex items-start gap-3">
                    <span className="text-2xl">📌</span>
                    <span>
                      <strong>Payment Reminder:</strong> You selected <span className="font-bold text-yellow-200">
                        {highlightedOrder.paymentMethod === "cash" 
                          ? "💵 Cash on Delivery" 
                          : highlightedOrder.paymentMethod === "momo"
                          ? "📱 MTN MoMo"
                          : highlightedOrder.paymentMethod === "airtel"
                          ? "📱 Airtel Money"
                          : highlightedOrder.paymentMethod}
                      </span> as your payment method. {highlightedOrder.paymentMethod === "cash" ? "Please have the exact amount ready for our delivery driver." : "Keep your phone ready for the payment prompt."}
                    </span>
                  </p>
                </div>

                {/* Order Items */}
                <div className="bg-white/10 rounded-lg p-4 md:p-6">
                  <h3 className="font-bold text-lg md:text-xl mb-4 flex items-center gap-2">
                    🍔 Items ({highlightedOrder.items?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {highlightedOrder.items?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm md:text-base pb-3 border-b border-white/20 last:border-b-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-white/80">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold">
                          UGX {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6 pt-4 border-t border-white/30 text-lg font-bold">
                    <span>Total</span>
                    <span>UGX {highlightedOrder.total?.toLocaleString() || "0"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Orders Section */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
              {allOrders.length === 0 ? "No Orders Yet" : `All Your Orders (${allOrders.length})`}
            </h2>

            {allOrders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🛍️</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Start Your Journey with Us!</h3>
                <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
                  We're excited to serve you! Your first delicious order is waiting. Let's create amazing food memories together! 🎉
                </p>
                <Link
                  href="/menu"
                  className="inline-block px-10 py-4 bg-brand-yellow text-black font-bold rounded-full hover:bg-yellow-300 transition"
                >
                  🍔 Order Your First Meal
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {allOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`border-2 rounded-xl p-4 md:p-6 transition-all ${
                      highlight === order.id
                        ? "border-blue-500 bg-blue-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    } ${order.status === "cancelled" ? "opacity-70 bg-gray-50" : ""}`}
                  >
                    {/* Order Header - Mobile & Desktop */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <div className="flex-1 w-full">
                        <p className="font-bold text-lg md:text-xl flex items-center gap-2 flex-wrap">
                          Order #{order.id.slice(0, 8)}
                          {order.status === "pending" && <span className="text-orange-500 text-sm">⏳ Pending</span>}
                          {order.status === "processing" && <span className="text-yellow-600 text-sm">🔄 Processing</span>}
                          {order.status === "delivered" && <span className="text-green-600 text-sm">✅ Delivered</span>}
                          {order.status === "cancelled" && <span className="text-red-600 text-sm">❌ Cancelled</span>}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{order.createdAt}</p>
                      </div>
                      <p className="text-xl md:text-2xl font-bold text-brand-green whitespace-nowrap">
                        UGX {order.total?.toLocaleString() || "0"}
                      </p>
                    </div>

                    {/* Order Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p><strong>Items:</strong> {order.items?.length || 0}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p><strong>Delivery:</strong> {order.area || order.address?.split(",")[0] || "—"}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p>
                          <strong>Payment:</strong> {
                            order.paymentMethod === "cash" 
                              ? "💵 Cash" 
                              : order.paymentMethod === "momo"
                              ? "📱 MoMo"
                              : order.paymentMethod === "airtel"
                              ? "📱 Airtel"
                              : order.paymentMethod || "—"
                          }
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p><strong>Time:</strong> {order.deliveryTime || "ASAP"}</p>
                      </div>
                    </div>

                    {/* Items Expandable Preview (Mobile Friendly) */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
                      <p className="font-semibold mb-2 text-sm">Items:</p>
                      <ul className="space-y-2 text-sm">
                        {order.items?.slice(0, 3).map((item: any, idx: number) => (
                          <li key={idx} className="flex justify-between gap-2">
                            <span>{item.name} × {item.quantity}</span>
                            <span className="font-medium text-gray-600">
                              UGX {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </li>
                        ))}
                        {order.items?.length > 3 && (
                          <li className="text-gray-500 italic">+{order.items.length - 3} more items</li>
                        )}
                      </ul>
                    </div>

                    {/* Action Link */}
                    {highlight !== order.id && (
                      <Link
                        href={`/order-tracking?highlight=${order.id}`}
                        className="text-brand-red hover:underline font-medium text-sm md:text-base inline-block"
                      >
                        View Full Details →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-12 space-y-4">
            <div className="bg-linear-to-r from-white/95 to-blue-50/95 rounded-2xl p-6 md:p-8 mb-8 border-4 border-brand-green backdrop-blur-md shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 drop-shadow-sm">
                🌟 Your Support Means Everything
              </h3>
              <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-semibold">
                Every meal you order, every choice you make with us - it fuels our passion to deliver excellence. We're committed to bringing you the freshest food and fastest service. Thank you for believing in us! 💪🍴
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/menu"
                className="inline-block px-8 py-3 md:px-10 md:py-4 bg-brand-yellow text-black font-bold rounded-full hover:bg-yellow-300 transition text-sm md:text-base shadow-lg transform hover:scale-105"
              >
                🍔 Order More Delicious Food
              </Link>
              <Link
                href="/dashboard"
                className="inline-block px-8 py-3 md:px-10 md:py-4 bg-brand-green text-white font-bold rounded-full hover:bg-green-700 transition text-sm md:text-base shadow-lg transform hover:scale-105"
              >
                📊 Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}