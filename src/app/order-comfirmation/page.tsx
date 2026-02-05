// src/app/order-confirmation/page.tsx
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderConfirmation() {
  const { user } = useAuth("user");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [recentOrder, setRecentOrder] = useState<any>(null); // the one just placed (if orderId exists)
  const [allOrders, setAllOrders] = useState<any[]>([]);     // all user's orders
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Fetch the specific order (if orderId is provided from checkout)
        if (orderId) {
          const orderRef = doc(db, "orders", orderId);
          const orderSnap = await getDoc(orderRef);

          if (orderSnap.exists() && orderSnap.data()?.userId === user.uid) {
            const data = orderSnap.data();
            setRecentOrder({
              id: orderSnap.id,
              ...data,
              createdAt: data.createdAt?.toDate?.()
                ? data.createdAt.toDate().toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "Just now",
            });
          }
        }

        // 2. Fetch all user's orders (for tracking)
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const ordersList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
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
      } catch (err) {
        console.error("Error fetching order data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, user?.uid]);

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Thank You / Confirmation Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-green mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-gray-700">
              {recentOrder
                ? "Your order has been placed successfully!"
                : "Welcome back! Here's your order history."}
            </p>
          </div>

          {/* Show just-placed order (if coming from checkout) */}
          {recentOrder && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-2 border-green-200">
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600 font-medium">Your Latest Order</p>
                <p className="text-3xl font-bold text-brand-red mt-2">
                  #{recentOrder.id.slice(0, 8)}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-xl mb-4">Order Details</h3>
                  <p><strong>Placed on:</strong> {recentOrder.createdAt}</p>
                  <p><strong>Status:</strong> <span className="text-orange-600 font-medium">Pending</span></p>
                  <p><strong>Payment:</strong> {recentOrder.paymentMethod === "cash" ? "Cash on Delivery" : recentOrder.paymentMethod}</p>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-4">Delivery Information</h3>
                  <p><strong>Name:</strong> {recentOrder.name || recentOrder.fullName || "—"}</p>
                  <p><strong>Phone:</strong> {recentOrder.phone || "—"}</p>
                  <p><strong>Address:</strong> {recentOrder.address || "—"}</p>
                  {recentOrder.area && <p><strong>Area:</strong> {recentOrder.area}</p>}
                  <p><strong>Delivery Time:</strong> {recentOrder.deliveryTime || "ASAP"}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-4">Items ({recentOrder.items?.length || 0})</h3>
                <div className="space-y-4">
                  {recentOrder.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between border-b pb-3 last:border-b-0">
                      <div>
                        <p className="font-medium">{item.name} × {item.quantity}</p>
                      </div>
                      <p className="font-medium">
                        UGX {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-6 pt-4 border-t font-bold text-xl">
                  <span>Total</span>
                  <span className="text-brand-red">UGX {recentOrder.total?.toLocaleString() || "0"}</span>
                </div>
              </div>
            </div>
          )}

          {/* All Orders / Tracking Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                {recentOrder ? "Your Other Orders" : "Your Orders & Tracking"}
              </h2>
              {allOrders.length > 0 && (
                <Link
                  href="/order-tracking"
                  className="px-6 py-2 bg-brand-red text-white font-medium rounded-xl hover:bg-red-700 transition"
                >
                  View All Orders →
                </Link>
              )}
            </div>

            {allOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🛍️</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                  No orders yet
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  Your first delicious order is just a click away!
                </p>
                <Link
                  href="/menu"
                  className="inline-block px-10 py-4 bg-brand-yellow text-black font-bold rounded-full hover:bg-yellow-300 transition"
                >
                  Start Ordering Now
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {allOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`border rounded-xl p-6 shadow-sm hover:shadow-md transition ${
                      order.status === "cancelled" ? "opacity-70 bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                      <div>
                        <p className="font-bold text-lg flex items-center gap-2">
                          Order #{order.id.slice(0, 8)}
                          {order.status === "pending" && <span className="text-orange-500">⏳ Pending</span>}
                          {order.status === "processing" && <span className="text-yellow-600">🔄 Processing</span>}
                          {order.status === "delivered" && <span className="text-green-600">✅ Delivered</span>}
                          {order.status === "cancelled" && <span className="text-red-600">❌ Cancelled</span>}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{order.createdAt}</p>
                      </div>
                      <p className="text-xl font-bold text-brand-green">
                        UGX {order.total?.toLocaleString() || "0"}
                      </p>
                    </div>

                    <div className="text-sm space-y-1 mb-4">
                      <p><strong>Items:</strong> {order.items?.length || 0}</p>
                      <p><strong>Delivery:</strong> {order.address || "—"}</p>
                    </div>

                    <Link
                      href={`/order-tracking?highlight=${order.id}`}
                      className="text-brand-red hover:underline font-medium"
                    >
                      View & Track this order →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-6">
            <p className="text-lg text-gray-700">
              We will contact you shortly to confirm your order.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/menu"
                className="inline-block px-10 py-4 bg-brand-yellow text-black font-bold rounded-full hover:bg-yellow-300 transition"
              >
                Continue Shopping
              </Link>
              <Link
                href="/order-tracking"
                className="inline-block px-10 py-4 bg-brand-red text-white font-bold rounded-full hover:bg-red-700 transition"
              >
                View All My Orders
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}