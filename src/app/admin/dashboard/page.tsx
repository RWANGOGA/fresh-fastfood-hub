// src/app/admin/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

// Same categories as your menu page
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
  image_url: string;
}

export default function AdminProducts() {
  const { user, role, loading: authLoading } = useAuth("admin");
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState(""); // ← new field for URL
  const [uploading, setUploading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

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

  // Add product (now supports URL or file)
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || (!file && !imageUrlInput.trim())) {
      toast.error("Name, price, and either image file or URL are required");
      return;
    }

    setUploading(true);

    try {
      let image_url = "";

      // Priority: uploaded file > pasted URL
      if (file) {
        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}.${fileExt}`;
        const storageRef = ref(storage, `products/${fileName}`);

        await uploadBytes(storageRef, file);
        image_url = await getDownloadURL(storageRef);
      } else if (imageUrlInput.trim()) {
        // Validate URL format roughly
        if (!imageUrlInput.startsWith("http")) {
          throw new Error("Image URL must start with http/https");
        }
        image_url = imageUrlInput.trim();
      }

      // Save to Firestore
      await addDoc(collection(db, "products"), {
        name,
        description,
        price: Number(price),
        category,
        image_url,
        createdAt: new Date().toISOString(),
      });

      toast.success("Product added successfully!");

      // Refresh list
      const querySnapshot = await getDocs(collection(db, "products"));
      const updatedProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(updatedProducts);

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setFile(null);
      setImageUrlInput("");
    } catch (err: any) {
      toast.error("Failed to add product: " + (err.message || "Unknown error"));
      console.error(err);
    } finally {
      setUploading(false);
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
            Admin – Manage Products
          </h1>

          {/* Add Product Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-12">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                    placeholder="e.g. Loaded Rolex Special"
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
                    step="100"
                    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                    placeholder="12000"
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
                  placeholder="Fresh chapati with eggs, avocado, sausage..."
                />
              </div>

              {/* New: Image URL field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image URL (optional – or upload file below)
                </label>
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              {/* File upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Image File {imageUrlInput.trim() ? "(or use URL above)" : "*"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required={!imageUrlInput.trim()} // only required if no URL
                  className="w-full p-4 border rounded-xl"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-4 bg-brand-red text-white font-bold rounded-xl hover:bg-red-700 transition disabled:opacity-50"
              >
                {uploading ? "Uploading & Saving..." : "Add Product to Menu"}
              </button>
            </form>
          </div>

          {/* Current Products List */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6">
              Current Menu Items ({products.length})
            </h2>

            {products.length === 0 ? (
              <p className="text-gray-600 text-center py-12">
                No products yet — add your first one above!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400?text=Image+Error";
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {product.description || "No description"}
                      </p>
                      <p className="text-brand-green font-bold mt-2">
                        UGX {Number(product.price).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}