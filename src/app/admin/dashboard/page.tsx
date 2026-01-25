// src/app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";
import Link from "next/link";

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

export default function AdminDashboard() {
  const { user, role, loading: authLoading } = useAuth("admin");

  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState<File[]>([]); // Multiple files
  const [imageUrlInput, setImageUrlInput] = useState(""); // Optional single URL fallback
  const [uploading, setUploading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    if (role !== "admin") return;

    const fetchProducts = async () => {
      setFetchLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productsList);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProducts();
  }, [role]);

  // Prepare form for editing
  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(product.price.toString());
    setCategory(product.category || "");
    setImageUrlInput(product.image_url || "");
    setFiles([]); // Clear files for edit (user can add new ones)
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImageUrlInput("");
    setFiles([]);
  };

  // Save (Add or Update) product with multiple images
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

      // Upload new files if any
      if (files.length > 0) {
        image_urls = []; // Replace with new uploads
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
        image_url: image_urls[0] || "", // Main image = first one
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

      // Refresh list
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

  // Delete product
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

  if (authLoading || fetchLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">
              {authLoading ? "Verifying admin access..." : "Loading products..."}
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
      <main className="min-h-screen pt-20 bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-brand-red mb-8 text-center">
            Admin Dashboard
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 text-center">
            <p className="text-gray-600">
              Logged in as: <span className="font-semibold">{user.email}</span>  
              (Role: <span className="font-semibold text-brand-red">{role}</span>)
            </p>
          </div>

          {/* Product Management Section */}
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-12">
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

              {/* Multiple Image Upload */}
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

              {/* Optional single URL fallback */}
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

            {/* Current Products List */}
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
                    className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow"
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

          {/* Other Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/menu" className="block group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border border-gray-100">
                <div className="text-5xl mb-4">🍔</div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">Manage Menu</h2>
                <p className="text-gray-600 mb-6">
                  Add, edit, or remove menu items
                </p>
                <div className="w-full py-3 bg-brand-red text-white font-bold rounded-xl group-hover:bg-red-700 transition text-center">
                  Go to Menu
                </div>
              </div>
            </Link>

            <Link href="/admin/orders" className="block group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border border-gray-100">
                <div className="text-5xl mb-4">📦</div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">Orders</h2>
                <p className="text-gray-600 mb-6">
                  View and manage customer orders
                </p>
                <div className="w-full py-3 bg-brand-red text-white font-bold rounded-xl group-hover:bg-red-700 transition text-center">
                  View Orders
                </div>
              </div>
            </Link>

            <Link href="/admin/users" className="block group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border border-gray-100">
                <div className="text-5xl mb-4">👥</div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">Users</h2>
                <p className="text-gray-600 mb-6">
                  Manage user accounts and roles
                </p>
                <div className="w-full py-3 bg-brand-red text-white font-bold rounded-xl group-hover:bg-red-700 transition text-center">
                  Manage Users
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}