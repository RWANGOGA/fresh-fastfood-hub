// src/app/admin/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import Link from "next/link";

interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: string;
  createdAt: string;
  address?: string;
  phone?: string;
  notes?: string;  // For tracking/admin notes
}

export default function AdminOrders() {
  const { user, role, loading: authLoading } = useAuth("admin");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");

  useEffect(() => {
    if (role !== "admin") return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const ordersList: Order[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            userEmail: data.userEmail || "Unknown",
            items: data.items || [],
            total: Number(data.total) || 0,
            status: data.status || "pending",
            createdAt: data.createdAt
              ? new Date(data.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Unknown",
            address: data.address || "Not provided",
            phone: data.phone || "Not provided",
            notes: data.notes || "",
          };
        });
        setOrders(ordersList);
      } catch (err: any) {
        console.error("Orders fetch error:", err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [role]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  const saveNotes = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { notes: notesText });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, notes: notesText } : o))
      );
      setEditingNotes(null);
      toast.success("Tracking notes saved");
    } catch (err: any) {
      toast.error("Failed to save notes");
      console.error(err);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading orders...</p>
          </div>
        </main>
      </>
    );
  }

  if (role !== "admin") return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-cover bg-center bg-fixed relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=2000&q=80')`,
        }}
      >
        {/* Semi-transparent overlay for readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          {/* Back to Dashboard Link */}
          <Link href="/admin/dashboard" className="inline-flex items-center mb-8 text-white hover:text-brand-yellow transition">
            <span className="text-xl mr-2">←</span>
            <span className="font-medium">Back to Admin Dashboard</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 drop-shadow-lg">
            Manage All Orders
          </h1>

          {orders.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">No orders yet</h2>
              <p className="text-gray-600 text-lg">
                When customers place orders, they will appear here for you to manage.
              </p>
            </div>
          ) : (
            <div className="grid gap-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all"
                >
                  <div className="p-6 md:p-8 border-b bg-gradient-to-r from-gray-50 to-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-xl md:text-2xl text-gray-800">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.createdAt} • {order.userEmail}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl md:text-3xl font-bold text-brand-green">
                        UGX {order.total.toLocaleString()}
                      </p>
                      <span
                        className={`inline-block px-5 py-2 mt-3 rounded-full text-sm font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Order Items ({order.items.length})</h4>
                        <ul className="space-y-3 text-sm">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>{item.name} × {item.quantity}</span>
                              <span className="font-medium">
                                UGX {(item.price * item.quantity).toLocaleString()}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg mb-3">Delivery Info</h4>
                        <p className="text-sm text-gray-700">
                          <strong>Phone:</strong> {order.phone}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                          <strong>Address:</strong> {order.address}
                        </p>
                      </div>
                    </div>

                    {/* Status Controls */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-3">Update Status</h4>
                      <div className="flex gap-4">
                        <button
                          onClick={() => updateStatus(order.id, "pending")}
                          className={`px-6 py-2 rounded-full text-sm font-medium ${
                            order.status === "pending"
                              ? "bg-orange-600 text-white"
                              : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => updateStatus(order.id, "processing")}
                          className={`px-6 py-2 rounded-full text-sm font-medium ${
                            order.status === "processing"
                              ? "bg-yellow-600 text-white"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          }`}
                        >
                          Processing
                        </button>
                        <button
                          onClick={() => updateStatus(order.id, "delivered")}
                          className={`px-6 py-2 rounded-full text-sm font-medium ${
                            order.status === "delivered"
                              ? "bg-green-600 text-white"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }`}
                        >
                          Delivered
                        </button>
                      </div>
                    </div>

                    {/* Tracking Notes */}
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Tracking Notes</h4>
                      {editingNotes === order.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            rows={4}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-brand-red outline-none resize-none"
                            placeholder="Add notes (e.g. 'Out for delivery by John, ETA 30 min')"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => saveNotes(order.id)}
                              className="px-6 py-2 bg-brand-green text-white rounded-xl font-medium hover:bg-green-600 transition"
                            >
                              Save Notes
                            </button>
                            <button
                              onClick={() => {
                                setEditingNotes(null);
                                setNotesText(order.notes || "");
                              }}
                              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <p className="flex-1 text-sm text-gray-700">
                            {order.notes || "No notes yet"}
                          </p>
                          <button
                            onClick={() => {
                              setEditingNotes(order.id);
                              setNotesText(order.notes || "");
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Edit Notes
                          </button>
                        </div>
                      )}
                    </div>
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