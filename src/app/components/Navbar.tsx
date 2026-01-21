"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore";

export default function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems());
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Filtered links for the clean Desktop view
  const desktopLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Locations", href: "/locations" },
  ];

  const sidebarLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Cart", href: "/cart" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Locations", href: "/locations" },
    { name: "My Orders", href: "/dashboard" },
    { name: "Favorites", href: "/menu" },
    { name: "Contact Us", href: "/locations" },
  ];

  return (
    <>
      {/* Navbar UI */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-red/90 backdrop-blur-md text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-tight shrink-0">
            Fresh$FastFood-Hub
          </Link>

          {/* --- NEW: DESKTOP NAVIGATION (Shows on md screens and up) --- */}
          <div className="hidden md:flex items-center space-x-8">
            {desktopLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="font-bold hover:text-brand-yellow transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            <Link 
              href="/dashboard" 
              className="bg-brand-yellow text-black px-5 py-2 rounded-full font-black text-sm hover:scale-105 transition-transform"
            >
              MY DASHBOARD
            </Link>

            <Link href="/cart" className="relative">
              <span className="text-2xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-brand-red text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-red">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Toggle (Shows only on small screens) */}
          <div className="md:hidden flex items-center gap-4">
             <Link href="/dashboard" className="text-xl">📋</Link>
             <button onClick={toggleSidebar} className="text-white focus:outline-none">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
             </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/70 z-[60] transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} 
        onClick={toggleSidebar}
      />

      {/* Sidebar Panel (Hidden on Desktop) */}
      <aside 
        className={`fixed top-0 right-0 h-screen w-[85%] max-w-sm bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-in-out md:hidden flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-13.8 0-25 11.2-25 25s11.2 25 25 25 25-11.2 25-25-11.2-25-25-25zm0 45c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z' fill='%23ef4444' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>

        <div className="flex-grow overflow-y-auto overflow-x-hidden p-8 relative">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-brand-red rounded-full animate-ping" />
               <span className="font-black text-gray-400 text-xs tracking-widest uppercase">Live in Kampala</span>
            </div>
            <button onClick={toggleSidebar} className="text-gray-900 text-4xl leading-none">&times;</button>
          </div>

          <div className="mb-12 relative">
            <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tighter">
              First we <span className="text-brand-red underline decoration-brand-yellow decoration-4 underline-offset-4">eat</span>, <br /> 
              then we do everything else.
            </h2>
          </div>

          <div className="flex flex-col space-y-6 pb-10">
            {sidebarLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={toggleSidebar}
                className="text-4xl font-black text-gray-900 hover:text-brand-red flex items-center justify-between"
              >
                <span>{link.name}</span>
                {link.name === "Cart" && totalItems > 0 && (
                  <span className="bg-brand-yellow text-black text-sm px-3 py-1 rounded-full">{totalItems}</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="p-8 bg-white border-t border-gray-100 relative z-20">
             <Link 
              href="/dashboard" 
              onClick={toggleSidebar}
              className="block w-full bg-brand-red text-white text-center py-5 rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all"
            >
              MY DASHBOARD
            </Link>
        </div>
      </aside>
    </>
  );
}