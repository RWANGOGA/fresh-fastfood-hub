// src/app/menu/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useCartStore } from "@/app/store/cartStore";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          toast.error("Product not found");
          router.push("/menu");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <p className="text-2xl text-gray-600">Loading product...</p>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <p className="text-2xl text-red-600">Product not found</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 text-brand-red hover:underline font-medium"
          >
            ← Back to Menu
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative h-96 md:h-[600px]">
              <img
                src={product.image_url || "https://via.placeholder.com/800?text=No+Image"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8">
              <h1 className="text-4xl font-bold text-brand-red mb-4">{product.name}</h1>
              <p className="text-2xl font-bold text-brand-green mb-6">
                UGX {Number(product.price).toLocaleString()}
              </p>
              <p className="text-gray-700 mb-6 text-lg">
                {product.description || "No description available"}
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Category: <span className="font-medium">{product.category || "Uncategorized"}</span>
              </p>

              <button
                onClick={() => {
                  useCartStore.getState().addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    imageUrl: product.image_url,
                  });
                  toast.success(`${product.name} added to cart! 🍔`);
                }}
                className="w-full py-5 bg-brand-yellow text-black font-bold text-xl rounded-full hover:bg-yellow-300 transition shadow-lg"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}