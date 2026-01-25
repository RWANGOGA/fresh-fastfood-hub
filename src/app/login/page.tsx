// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      router.push("/dashboard"); // Redirect to dashboard – hook handles role
    } catch (error: any) {
      let errMsg = "Login failed";
      if (error.code === "auth/user-not-found") errMsg = "No account found";
      if (error.code === "auth/wrong-password") errMsg = "Incorrect password";
      if (error.code === "auth/invalid-email") errMsg = "Invalid email";
      toast.error(errMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
        <h1 className="text-4xl font-black text-brand-red mb-8 text-center">Login</h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-brand-red outline-none"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-brand-red outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand-red text-white font-bold rounded-2xl hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-brand-red hover:underline font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}