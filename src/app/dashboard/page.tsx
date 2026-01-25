// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/app/components/Navbar";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore";

export default function UserDashboard() {
  const { user, role, loading: authLoading } = useAuth("user");
  const { cart, totalPrice, removeFromCart } = useCartStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    email: "",
    createdAt: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [likedItems, setLikedItems] = useState([]);

  // Fetch profile
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfile({
            fullName: data.fullName || user.displayName || "User",
            phone: data.phone || "Not set",
            email: data.email || user.email || "Not set",
            createdAt: data.createdAt
              ? new Date(data.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Unknown",
          });
        } else {
          setProfile({
            fullName: user.displayName || "User",
            phone: "Not set",
            email: user.email || "Not set",
            createdAt: "Unknown",
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        toast.error("Could not load profile");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch past orders
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
      } catch (err) {
        console.error("Orders fetch error:", err);
        toast.error("Could not load past orders");
      }
    };

    fetchOrders();
  }, [user]);

  // Fetch liked items (from subcollection users/{uid}/likedItems)
  useEffect(() => {
    if (!user) return;

    const fetchLiked = async () => {
      try {
        const likedSnapshot = await getDocs(collection(db, "users", user.uid, "likedItems"));
        const likedList = likedSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLikedItems(likedList);
      } catch (err) {
        console.error("Liked items fetch error:", err);
        toast.error("Could not load liked items");
      }
    };

    fetchLiked();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  if (authLoading || profileLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-brand-red border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">Loading your dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (role !== "user") return null;

  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-20 bg-gradient-to-br from-orange-100 via-red-100 to-yellow-100 flex relative">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-24 left-4 z-50 bg-brand-red p-3 rounded-full shadow-lg text-white focus:outline-none"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-40 md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:shadow-none`}
        >
          <div className="p-6 border-b bg-gradient-to-r from-brand-red to-red-600 text-white">
            <h2 className="text-2xl font-bold">
              Hi, {profile.fullName.split(" ")[0] || "Welcome"}!
            </h2>
            <p className="text-sm opacity-90 mt-1">{profile.email}</p>
          </div>

          <nav className="p-4 space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-brand-red font-medium hover:bg-red-100 transition"
            >
              <span className="text-xl">🏠</span>
              Dashboard Home
            </Link>

            <Link
              href="/menu"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition"
            >
              <span className="text-xl">🍔</span>
              Browse Menu
            </Link>

            <Link
              href="/cart"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition"
            >
              <span className="text-xl">🛒</span>
              Cart ({cart.length})
            </Link>

            <Link
              href="/checkout"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition"
            >
              <span className="text-xl">💳</span>
              Checkout
            </Link>

            <Link
              href="/orders"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition"
            >
              <span className="text-xl">📦</span>
              My Orders ({orders.length})
            </Link>

            <Link
              href="/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition"
            >
              <span className="text-xl">👤</span>
              Edit Profile
            </Link>

            <a
              href="https://wa.me/256756348528"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition"
            >
              <span className="text-xl">💬</span>
              Contact Support
            </a>

            <button
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition mt-8"
            >
              <span className="text-xl">🚪</span>
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-red mb-8">
            Hello, {profile.fullName || "Welcome back"}!
          </h1>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-700">Items in Cart</h3>
              <p className="text-4xl font-bold text-brand-red mt-2">{cart.length}</p>
              <Link href="/cart" className="text-sm text-brand-red hover:underline mt-2 block">
                View cart →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-700">Cart Total</h3>
              <p className="text-4xl font-bold text-brand-green mt-2">
                UGX {totalPrice().toLocaleString()}
              </p>
              <Link href="/checkout" className="text-sm text-brand-red hover:underline mt-2 block">
                Proceed to checkout →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-700">Member Since</h3>
              <p className="text-2xl font-bold text-gray-600 mt-2">
                {profile.createdAt || "Just joined"}
              </p>
            </div>
          </div>

          {/* Past Orders */}
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-12">
            <h2 className="text-2xl font-bold mb-6">Your Past Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No orders yet — place your first one from the menu!
              </p>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-lg">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "Date unknown"}
                        </p>
                      </div>
                      <p className="text-xl font-bold text-brand-green">
                        UGX {(order.total || 0).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm">
                      Status: <span className={`font-medium ${order.status === "delivered" ? "text-green-600" : "text-orange-600"}`}>
                        {order.status || "Pending"}
                      </span>
                    </p>
                    <p className="text-sm mt-2">
                      Items: {order.items?.length || 0}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Liked Items */}
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-12">
            <h2 className="text-2xl font-bold mb-6">Liked Items ({likedItems.length})</h2>
            {likedItems.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No liked items yet — browse the menu and tap the heart!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                  >
                    <img
                      src={item.image_url || "https://via.placeholder.com/400?text=No+Image"}
                      alt={item.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.description || "No description"}
                      </p>
                      <p className="text-brand-green font-bold mt-2">
                        UGX {(Number(item.price) || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {cart.length > 0 ? (
                <div className="border-l-4 border-brand-yellow pl-4 py-3">
                  <p className="font-medium">Added items to cart</p>
                  <p className="text-sm text-gray-600">
                    {cart.length} item{cart.length !== 1 ? "s" : ""} —{" "}
                    {new Date().toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">No recent activity — start ordering something delicious!</p>
              )}
              {/* You can expand this with real logs later */}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}