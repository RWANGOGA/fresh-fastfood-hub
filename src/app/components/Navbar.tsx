// src/app/components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

function CartBadge({ count }: { count: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || count === 0) return null;

  return (
    <span className="ml-1 bg-brand-yellow text-black text-xs font-bold px-2 py-1 rounded-full">
      {count}
    </span>
  );
}

export default function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems());
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // { uid, email, displayName, role? }
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  // Listen to Firebase auth state in real-time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Optional: Fetch role from Firestore if you have it
        const role = "user"; // Replace with real fetch if needed
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
          role,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      setDropdownOpen(false);
      router.push("/");
    } catch (err) {
      toast.error("Logout failed");
      console.error(err);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Cart", href: "/cart" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Locations", href: "/locations" },
  ];

  return (
    <>
      {/* Main Navbar (Desktop + Mobile Toggle) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-red/90 backdrop-blur-md text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Fresh$FastFood-Hub
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-lg font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-brand-yellow transition-colors duration-200 relative"
              >
                {link.name}
                {link.name === "Cart" && <CartBadge count={totalItems} />}
              </Link>
            ))}

            {/* Login / User Area (Desktop) */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:text-brand-yellow transition-colors duration-200 focus:outline-none"
                >
                  <span className="font-medium">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                  <span className="text-xl">👤</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Dashboard
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hover:text-brand-yellow transition-colors duration-200">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* Mobile Sidebar Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden overflow-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="p-8 flex flex-col min-h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-red rounded-full animate-ping" />
                <span className="font-black text-gray-400 text-xs tracking-widest uppercase">Live in Kampala</span>
              </div>
              <button onClick={toggleSidebar} className="text-gray-900 text-4xl leading-none">
                ×
              </button>
            </div>

            {/* Quote */}
            <div className="mb-12 relative group">
              <span className="absolute -top-10 -left-4 text-8xl text-brand-yellow opacity-20 font-serif select-none">“</span>
              <h2 className="text-4xl font-black text-gray-900 leading-[1.05] tracking-tighter">
                First we <span className="text-brand-red underline decoration-brand-yellow decoration-4 underline-offset-8">eat</span>, <br />
                then we do everything else.
              </h2>
              <span
                className={`absolute -right-4 top-0 text-5xl transition-all duration-1000 ${
                  isOpen ? "rotate-12 scale-110" : "rotate-0 scale-100"
                } opacity-20`}
              >
                🌯
              </span>
            </div>

            {/* Nav Links (full list in sidebar) */}
            <div className="flex flex-col space-y-5 flex-grow relative z-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={toggleSidebar}
                  className="text-4xl font-black text-gray-900 hover:text-brand-red flex items-center justify-between transition-all active:scale-95"
                >
                  <span>{link.name}</span>
                  {link.name === "Cart" && <CartBadge count={totalItems} />}
                </Link>
              ))}

              {/* Login / User Section in Sidebar */}
              {user ? (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-3xl font-black text-gray-900">
                    <span>{user.displayName || user.email?.split("@")[0]}</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <Link
                      href="/dashboard"
                      onClick={toggleSidebar}
                      className="block text-xl font-medium hover:text-brand-red transition"
                    >
                      My Dashboard
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        onClick={toggleSidebar}
                        className="block text-xl font-medium hover:text-brand-red transition"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleSidebar();
                      }}
                      className="block text-xl font-medium text-red-600 hover:text-red-800 transition w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={toggleSidebar}
                  className="text-4xl font-black text-gray-900 hover:text-brand-red flex items-center justify-between transition-all active:scale-95 pt-4 border-t border-gray-200"
                >
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Bottom Branding */}
            <div className="mt-auto pt-8">
              <div className="bg-gray-50 p-6 rounded-[2.5rem] mb-6 border border-gray-100">
                <p className="text-xs font-black text-brand-red uppercase mb-1">Our Mission</p>
                <p className="text-sm font-bold text-gray-600">
                  Making local food faster, fresher, and better for every Ugandan plate.
                </p>
              </div>

              <Link
                href="/dashboard"
                onClick={toggleSidebar}
                className="block w-full bg-brand-red text-white text-center py-5 rounded-[2.2rem] font-black text-xl shadow-[0_20px_40px_rgba(239,68,68,0.25)] hover:shadow-none transition-all"
              >
                MY DASHBOARD
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}