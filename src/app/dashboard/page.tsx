// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/app/components/Navbar";
import { auth, db, storage } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile as updateAuthProfile, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore";
import { useSyncedCart } from "@/app/store/cartStore";

// Types
interface Order {
  id: string;
  userId: string;
  items: Array<{ id: string; name: string; price: number; quantity: number; imageUrl: string }>;
  total: number;
  status: "pending" | "processing" | "delivered" | "cancelled";
  createdAt: string;
}

interface LikedItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string;
}

export default function UserDashboard() {
  const { user, role, loading: authLoading } = useAuth("user");
  const { cart, totalPrice, removeFromCart, clearCart } = useCartStore();

  // Sync cart with localStorage per user
  useSyncedCart();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    createdAt: "",
    photoURL: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [likedItems, setLikedItems] = useState<LikedItem[]>([]);

  // Editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch profile
  useEffect(() => {
    if (!user?.uid) return;

    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const profileData = {
            fullName: data.fullName || user.displayName || "User",
            phone: data.phone || "Not set",
            email: data.email || user.email || "Not set",
            address: data.address || "Not set",
            city: data.city || "Not set",
            createdAt: data.createdAt
              ? new Date(data.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Unknown",
            photoURL: data.photoURL || user.photoURL || "",
          };
          setProfile(profileData);
          setEditFormData({
            fullName: profileData.fullName,
            phone: profileData.phone === "Not set" ? "" : profileData.phone,
            address: profileData.address === "Not set" ? "" : profileData.address,
            city: profileData.city === "Not set" ? "" : profileData.city,
          });
        } else {
          const profileData = {
            fullName: user.displayName || "User",
            phone: "Not set",
            email: user.email || "Not set",
            address: "Not set",
            city: "Not set",
            createdAt: "Unknown",
            photoURL: user.photoURL || "",
          };
          setProfile(profileData);
          setEditFormData({
            fullName: profileData.fullName,
            phone: "",
            address: "",
            city: "",
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
  }, [user?.uid]);

  // Fetch orders
  useEffect(() => {
    if (!user?.uid) return;

    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const ordersList: Order[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId || user.uid,
            items: data.items || [],
            total: Number(data.total) || 0,
            status: data.status || "pending",
            createdAt: data.createdAt || "",
          };
        });
        setOrders(ordersList);
      } catch (err) {
        console.error("Orders fetch error:", err);
        toast.error("Could not load past orders");
      }
    };

    fetchOrders();
  }, [user?.uid]);

  // Fetch liked items
  useEffect(() => {
    if (!user?.uid) return;

    const fetchLiked = async () => {
      try {
        const likedSnapshot = await getDocs(collection(db, "users", user.uid, "likedItems"));
        const likedList: LikedItem[] = likedSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unnamed",
            price: Number(data.price) || 0,
            image_url: data.image_url || "",
            description: data.description || "",
          };
        });
        setLikedItems(likedList);
      } catch (err) {
        console.error("Liked items fetch error:", err);
        toast.error("Could not load liked items");
      }
    };

    fetchLiked();
  }, [user?.uid]);

  // Handle profile photo upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `profile-pictures/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update local state
      setProfile((prev) => ({ ...prev, photoURL: downloadURL }));

      // Save to Firestore
      await setDoc(doc(db, "users", user.uid), { photoURL: downloadURL }, { merge: true });

      // Update Firebase Auth
      await updateAuthProfile(user, { photoURL: downloadURL });

      toast.success("Profile photo updated!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  // Handle profile save
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          fullName: editFormData.fullName,
          phone: editFormData.phone,
          address: editFormData.address,
          city: editFormData.city,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      if (editFormData.fullName) {
        await updateAuthProfile(user, { displayName: editFormData.fullName });
      }

      setProfile((prev) => ({
        ...prev,
        fullName: editFormData.fullName,
        phone: editFormData.phone || "Not set",
        address: editFormData.address || "Not set",
        city: editFormData.city || "Not set",
      }));

      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      clearCart();
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
          } md:relative md:shadow-none overflow-y-auto`}
        >
          <div className="p-6 border-b bg-gradient-to-r from-brand-red to-red-600 text-white">
            <div className="flex items-center gap-4 mb-2">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white">
                  <span className="text-3xl">👤</span>
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  Hi, {profile.fullName.split(" ")[0] || "Welcome"}!
                </h2>
                <p className="text-xs opacity-90 mt-1 truncate">{profile.email}</p>
              </div>
            </div>
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
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-red mb-8">
            Hello, {profile.fullName || "Welcome back"}!
          </h1>

          {/* Profile Section */}
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Profile</h2>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-6 py-2 bg-brand-yellow text-black font-semibold rounded-xl hover:bg-yellow-300 transition"
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="flex items-center gap-6 pb-6 border-b">
                  {profile.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-brand-red shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                      <span className="text-5xl text-gray-400">👤</span>
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="profile-upload"
                      className={`px-6 py-3 bg-brand-yellow text-black font-semibold rounded-xl cursor-pointer hover:bg-yellow-300 transition shadow-md inline-block ${
                        uploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {uploading ? "Uploading..." : "Change Photo"}
                    </label>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-2">Max 5MB • JPG, PNG, GIF</p>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.fullName}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-red focus:outline-none"
                      placeholder="+256 700 000 000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={editFormData.city}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-red focus:outline-none"
                      placeholder="Kampala"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email (cannot be changed)
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      readOnly
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={editFormData.address}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, address: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-red focus:outline-none resize-none"
                    placeholder="Enter your full delivery address..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`flex-1 py-3 bg-brand-red text-white font-bold rounded-xl hover:bg-red-700 transition ${
                      saving ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  {profile.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-brand-red shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                      <span className="text-5xl text-gray-400">👤</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-gray-700">Full Name</h3>
                    <p className="text-gray-600">{profile.fullName}</p>
                    <h3 className="font-bold text-lg text-gray-700 mt-4">Email</h3>
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-700">Phone</h3>
                    <p className="text-gray-600">{profile.phone}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-700">City</h3>
                    <p className="text-gray-600">{profile.city}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-700">Address</h3>
                    <p className="text-gray-600">{profile.address}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-700">Member Since</h3>
                    <p className="text-gray-600">{profile.createdAt}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

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
              <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
              <p className="text-4xl font-bold text-brand-red mt-2">{orders.length}</p>
              <Link href="/orders" className="text-sm text-brand-red hover:underline mt-2 block">
                View orders →
              </Link>
            </div>
          </div>

          {/* My Cart Section */}
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-12">
            <h2 className="text-2xl font-bold mb-6">My Cart ({cart.length})</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                Your cart is empty — browse the menu and add some items!
              </p>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                    <img
                      src={item.imageUrl || "https://via.placeholder.com/80?text=Item"}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">
                        {item.name} × {item.quantity}
                      </h3>
                      <p className="text-sm text-gray-600">
                        UGX {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.success("Item removed from cart");
                      }}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-xl pt-4 border-t">
                  <span>Total</span>
                  <span className="text-brand-red">UGX {totalPrice().toLocaleString()}</span>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full py-4 bg-brand-red text-white font-bold rounded-xl text-center mt-6 hover:bg-red-700 transition"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
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
                  <div
                    key={order.id}
                    className="border rounded-xl p-6 shadow-sm hover:shadow-md transition"
                  >
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
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          order.status === "delivered" ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </p>
                    <p className="text-sm mt-2">Items: {order.items?.length || 0}</p>
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
            </div>
          </div>
        </main>
      </div>
    </>
  );
}