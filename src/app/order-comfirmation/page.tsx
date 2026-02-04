// src/app/order-confirmation/page.tsx
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderConfirmation() {
  const { user } = useAuth("user");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !user) return;

    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists() && orderSnap.data()?.userId === user.uid) {
          setOrder({ id: orderSnap.id, ...orderSnap.data() });
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);

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

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
            <h2 className="text-3xl font-bold text-brand-red mb-4">Order not found</h2>
            <p className="text-gray-600 mb-6">
              The order could not be found or you don't have permission to view it.
            </p>
            <Link href="/dashboard" className="text-brand-red hover:underline">
              Back to Dashboard →
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-green mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-gray-700">
              Your order has been placed successfully!
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600">Order Number</p>
              <p className="text-4xl font-bold text-brand-red mt-2">
                #{order.id.slice(0, 8)}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-xl mb-4">Order Details</h3>
                <p><strong>Placed on:</strong> {new Date(order.createdAt?.toDate?.() || Date.now()).toLocaleString()}</p>
                <p><strong>Status:</strong> <span className="text-orange-600 font-medium">Pending</span></p>
                <p><strong>Payment:</strong> {order.paymentMethod === "cash" ? "Cash on Delivery" : order.paymentMethod}</p>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-4">Delivery Information</h3>
                <p><strong>Name:</strong> {order.name || order.fullName}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Address:</strong> {order.address}</p>
                {order.area && <p><strong>Area:</strong> {order.area}</p>}
                <p><strong>Delivery Time:</strong> {order.deliveryTime}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-4">Items ({order.items.length})</h3>
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
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
                <span className="text-brand-red">UGX {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-6">
            <p className="text-lg text-gray-700">
              We will contact you shortly to confirm your order.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/menu"
                className="inline-block px-10 py-4 bg-brand-yellow text-black font-bold rounded-full hover:bg-yellow-300 transition"
              >
                Continue Shopping
              </Link>
              <Link
                href="/dashboard"
                className="inline-block px-10 py-4 bg-brand-red text-white font-bold rounded-full hover:bg-red-700 transition"
              >
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}