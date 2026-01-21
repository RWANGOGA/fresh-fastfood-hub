"use client";

import Navbar from "@/app/components/Navbar";
import Link from "next/link";

const hubs = [
  {
    id: 1,
    name: "Kampala Central Hub",
    area: "Nakasero / City Center",
    address: "Plot 12, Kampala Road (Near Post Office)",
    phone: "+256 756 348 528",
    status: "Open 24/7",
    imageUrl: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop", 
    mapUrl: "https://www.google.com/maps/search/Kampala+Road+Nakasero"
  },
  {
    id: 2,
    name: "The Rolex Point",
    area: "Wandegeya",
    address: "Haji Kasule Road, Opposite Makerere Gate",
    phone: "+256 756 348 528",
    status: "Open: 7AM - 11PM",
    imageUrl: "https://images.unsplash.com/photo-1598218706344-9372134e7087?q=80&w=800&auto=format&fit=crop", 
    mapUrl: "https://www.google.com/maps/search/Wandegeya+Market+Kampala"
  },
  {
    id: 3,
    name: "Express Kitchen",
    area: "Entebbe Road",
    address: "Freedom City Mall, Ground Floor",
    phone: "+256 756 348 528",
    status: "Open: 9AM - Midnight",
    imageUrl: "https://images.unsplash.com/photo-1582213708522-f88632aa0722?q=80&w=800&auto=format&fit=crop", 
    mapUrl: "https://www.google.com/maps/search/Freedom+City+Mall+Entebbe+Road"
  }
];

export default function Locations() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-16 text-center">
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-4">
              Our <span className="text-brand-red underline decoration-brand-yellow">Hubs</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-sm">
              Fresh food stations across the heart of Kampala
            </p>
          </div>

          {/* Grid of Hubs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hubs.map((hub) => (
              <div 
                key={hub.id} 
                className="group bg-white rounded-[3rem] overflow-hidden border-2 border-gray-100 hover:border-brand-yellow hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                {/* Image Header */}
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={hub.imageUrl} 
                    alt={hub.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-8">
                    <span className="bg-brand-yellow text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {hub.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-gray-900 mb-1">{hub.name}</h3>
                  <p className="text-brand-red font-bold text-xs mb-6 uppercase tracking-widest">{hub.area}</p>
                  
                  <div className="space-y-4 mb-8 text-sm">
                     <div className="flex items-start gap-3">
                        <span className="opacity-40">📍</span>
                        <p className="text-gray-600 font-bold">{hub.address}</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="opacity-40">📞</span>
                        <p className="text-gray-900 font-black">{hub.phone}</p>
                     </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-3">
                    <a 
                      href={hub.mapUrl} 
                      target="_blank" 
                      className="w-full bg-gray-900 text-white text-center py-4 rounded-2xl font-black text-xs hover:bg-brand-red transition-all transform active:scale-95"
                    >
                      OPEN IN GOOGLE MAPS
                    </a>
                    <Link 
                      href="/dashboard" 
                      className="w-full border-2 border-gray-100 text-gray-900 text-center py-4 rounded-2xl font-black text-xs hover:bg-gray-50 transition-all"
                    >
                      ORDER FROM THIS BRANCH
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Map Visual Section */}
          <div className="mt-24 rounded-[4rem] overflow-hidden h-[500px] relative bg-gray-900 border-8 border-white shadow-2xl group">
              <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop" 
                  alt="City Grid" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
                  <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl text-center max-w-lg transform group-hover:-translate-y-4 transition-transform duration-500 border-b-8 border-brand-yellow">
                      <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center shadow-lg mb-6 mx-auto animate-bounce">
                          <span className="text-3xl">🛵</span>
                      </div>
                      <h3 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">Delivery Network</h3>
                      <p className="text-gray-500 font-bold mb-8 uppercase text-[10px] tracking-[0.2em]">
                          Covering the greater Kampala area
                      </p>
                      <Link 
                          href="/dashboard" 
                          className="inline-block bg-brand-red text-white px-10 py-5 rounded-[2rem] font-black text-sm hover:scale-105 transition-all shadow-xl"
                      >
                          BACK TO USER DASHBOARD
                      </Link>
                  </div>
              </div>
              
              {/* Pulsing Location Points */}
              <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-brand-red rounded-full animate-ping opacity-75"></div>
              <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-brand-yellow rounded-full animate-ping opacity-75 delay-1000"></div>
          </div>

        </div>
      </main>
    </>
  );
}