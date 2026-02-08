// src/app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

// Categories (same as menu page)
const categories = [
  "All",
  "Local Favorites",
  "Chicken & Meat",
  "Burgers & Combos",
  "Juices & Drinks",
  "Milk & Milkshakes",
  "Coffee",
];

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;       // Main image (legacy)
  image_urls?: string[];   // Multiple images (new)
}

interface User {
  id: string;
  email: string;
  displayName?: string;
  role?: string;
  createdAt?: string;
}

interface Order {
  id: string;
  createdAt?: any; // Firestore Timestamp
}

export default function AdminDashboard() {
  const { user, role, loading: authLoading } = useAuth("admin");

  // ─── PRODUCT MANAGEMENT STATE ────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ─── DASHBOARD STATE ─────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [ordersByMonth, setOrdersByMonth] = useState<Record<string, number>>({});

  // ─── FETCH ALL DATA ──────────────────────────────────────────────
  useEffect(() => {
    if (role !== "admin") return;

    const fetchAllData = async () => {
      setFetchLoading(true);
      try {
        // Products
        const productsSnap = await getDocs(collection(db, "products"));
        const productsList = productsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productsList);

        // Category counts
        const counts: Record<string, number> = {};
        productsList.forEach((p) => {
          const cat = p.category || "Uncategorized";
          counts[cat] = (counts[cat] || 0) + 1;
        });
        setCategoryCounts(counts);

        // Orders
        const ordersSnap = await getDocs(
          query(collection(db, "orders"), orderBy("createdAt", "desc"))
        );
        const ordersList = ordersSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setTotalOrders(ordersList.length);

        // Group orders by month
        const now = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const last6Months: Record<string, number> = {};

        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
          last6Months[key] = 0;
        }

        ordersList.forEach((order) => {
          if (order.createdAt) {
            const date = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
            const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            if (last6Months.hasOwnProperty(monthKey)) {
              last6Months[monthKey]++;
            }
          }
        });
        setOrdersByMonth(last6Months);

        // Users
        const usersSnap = await getDocs(collection(db, "users"));
        const usersList = usersSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(usersList);
        setTotalUsers(usersList.length);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchAllData();
  }, [role]);

  // ─── CHART DATA ──────────────────────────────────────────────────
  const ordersChartData = {
    labels: Object.keys(ordersByMonth),
    datasets: [
      {
        label: "Orders per Month",
        data: Object.values(ordersByMonth),
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const categoryChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
          "#9966FF", "#FF9F40", "#C9CBCF",
        ],
        hoverOffset: 20,
      },
    ],
  };

  // ─── PRODUCT FUNCTIONS (exactly your original code) ──────────────

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(product.price.toString());
    setCategory(product.category || "");
    setImageUrlInput(product.image_url || "");
    setFiles([]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImageUrlInput("");
    setFiles([]);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      toast.error("Name and price are required");
      return;
    }
    if (!editingId && files.length === 0 && !imageUrlInput.trim()) {
      toast.error("Upload at least one image or provide a URL");
      return;
    }
    setUploading(true);
    try {
      let image_urls: string[] = imageUrlInput.trim() ? [imageUrlInput.trim()] : [];
      if (files.length > 0) {
        image_urls = [];
        for (const file of files) {
          const fileExt = file.name.split(".").pop() || "jpg";
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
          const storageRef = ref(storage, `products/${fileName}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          image_urls.push(url);
        }
      }
      const productData = {
        name,
        description,
        price: Number(price),
        category,
        image_urls,
        image_url: image_urls[0] || "",
        updatedAt: new Date().toISOString(),
      };
      if (editingId) {
        const productRef = doc(db, "products", editingId);
        await updateDoc(productRef, productData);
        toast.success("Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: new Date().toISOString(),
        });
        toast.success("Product added successfully!");
      }
      const querySnapshot = await getDocs(collection(db, "products"));
      const updatedProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(updatedProducts);
      cancelEdit();
    } catch (err: any) {
      toast.error("Failed: " + (err.message || "Unknown error"));
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product permanently? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Product deleted");
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      toast.error("Delete failed: " + err.message);
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Delete this user permanently? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err: any) {
      toast.error("Failed to delete user: " + err.message);
      console.error(err);
    }
  };

  if (authLoading || fetchLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">
              {authLoading ? "Verifying admin access..." : "Loading dashboard..."}
            </p>
          </div>
        </main>
      </>
    );
  }

  if (role !== "admin") return null;

  return (
    <>
      <Navbar />

      <div
        className="relative min-h-screen bg-gray-50"
        style={{
          backgroundImage: `url('https://thumbs.dreamstime.com/b/buffet-breakfast-counter-breakfast-room-buffet-breakfast-counter-breakfast-room-luxury-hotel-193423016.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex min-h-screen">
          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:relative lg:shadow-none overflow-y-auto`}
          >
            <div className="p-6 border-b bg-gradient-to-r from-purple-700 to-indigo-700 text-white">
              <h2 className="text-2xl font-bold">Admin Panel</h2>
              <p className="text-sm opacity-90 mt-1">Fresh-FastFood-hub</p>
            </div>

            <nav className="p-4 space-y-1">
              <Link
                href="/admin/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 text-purple-700 font-medium"
              >
                <span className="text-xl">📊</span>
                Dashboard
              </Link>
              <Link
                href="/menu"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition"
              >
                <span className="text-xl">🍔</span>
                Manage Menu
              </Link>
              <Link
                href="/admin/orders"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition"
              >
                <span className="text-xl">📦</span>
                Orders
              </Link>
              <Link
                href="/admin/users"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition"
              >
                <span className="text-xl">👥</span>
                Users
              </Link>
              <hr className="my-4 border-gray-200" />
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition"
              >
                <span className="text-xl">🚪</span>
                Logout
              </button>
            </nav>
          </aside>

          {/* Mobile toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>

          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                  Admin Dashboard
                </h1>
                <div className="text-sm text-white drop-shadow-md">
                  Welcome, <span className="font-semibold">{user?.email}</span>
                </div>
              </div>

              {/* Analytics cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition">
                  <h3 className="text-lg font-semibold text-gray-800">Total Orders</h3>
                  <p className="text-4xl font-bold text-red-600 mt-2">{totalOrders}</p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition">
                  <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
                  <p className="text-4xl font-bold text-green-600 mt-2">{totalUsers}</p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition">
                  <h3 className="text-lg font-semibold text-gray-800">Menu Items</h3>
                  <p className="text-4xl font-bold text-purple-600 mt-2">{products.length}</p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition">
                  <h3 className="text-lg font-semibold text-gray-800">Top Category</h3>
                  <p className="text-2xl font-bold text-orange-600 mt-2 truncate">
                    {Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} items
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Orders Trend (Last 6 Months)</h3>
                  <div className="h-80">
                    {Object.keys(ordersByMonth).length > 0 ? (
                      <Line
                        data={ordersChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { position: "top" } },
                          scales: {
                            y: { beginAtZero: true, title: { display: true, text: "Number of Orders" } },
                          },
                        }}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        No orders yet
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Menu Items by Category</h3>
                  <div className="h-80 flex items-center justify-center">
                    {Object.keys(categoryCounts).length > 0 ? (
                      <Pie
                        data={categoryChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: "bottom" },
                          },
                        }}
                      />
                    ) : (
                      <p className="text-gray-500">No products added yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ─── PRODUCT MANAGEMENT (YOUR ORIGINAL CODE) ───────────── */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8 mb-12 border border-gray-200">
                <h2 className="text-2xl font-bold mb-6">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>

                {editingId && (
                  <p className="text-sm text-gray-600 mb-4 italic">
                    Editing product ID: {editingId}
                  </p>
                )}

                <form onSubmit={handleSaveProduct} className="space-y-6 mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Price (UGX) *</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min="0"
                        className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-4 border rounded-xl h-32 focus:ring-2 focus:ring-brand-red outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Images (multiple allowed) {editingId ? "(replace existing)" : "*"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setFiles(Array.from(e.target.files || []))}
                      className="w-full p-4 border rounded-xl"
                    />
                    {files.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {Array.from(files).map((file, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-20 object-cover rounded-md shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Or paste a single Image URL (fallback)
                    </label>
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 py-4 bg-brand-red text-white font-bold rounded-xl hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {uploading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex-1 py-4 bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 transition"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>

                <h3 className="text-xl font-bold mb-4">Current Menu Items ({products.length})</h3>
                {products.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    No products yet — add one above!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow bg-white/95 backdrop-blur-sm"
                      >
                        <div className="relative h-48">
                          <img
                            src={product.image_url || product.image_urls?.[0] || "https://via.placeholder.com/400?text=No+Image"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400?text=Image+Error")}
                          />
                          {product.image_urls && product.image_urls.length > 1 && (
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                              {product.image_urls.length} photos
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h4 className="font-bold text-lg">{product.name}</h4>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {product.description || "No description"}
                          </p>
                          <p className="text-brand-green font-bold mt-2">
                            UGX {Number(product.price || 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{product.category}</p>

                          <div className="mt-4 flex gap-3">
                            <button
                              onClick={() => startEdit(product)}
                              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Users Table */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8 mb-12 border border-gray-200">
                <h2 className="text-2xl font-bold mb-6">Users ({users.length})</h2>

                {users.length === 0 ? (
                  <p className="text-gray-600 text-center py-12">No users registered yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50/80">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Email / Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{u.email}</div>
                              <div className="text-sm text-gray-600">{u.displayName || "—"}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  u.role === "admin"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {u.role || "user"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}