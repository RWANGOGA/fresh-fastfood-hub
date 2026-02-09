"use client";

// src/app/page.tsx
import Navbar from "@/app/components/Navbar";
import HeroCarousel from "@/app/components/HeroCarousel";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Carousel – main attraction */}
      <HeroCarousel />

      <main className="bg-gray-50">
        
        {/* ================= FOOD DELIVERY SECTION ================= */}
        <section 
          className="relative py-24 md:py-32 px-4 md:px-8 flex items-center justify-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <div className="inline-block bg-brand-red text-white px-4 py-2 rounded-full font-bold mb-6">
                  🚗 Fast Delivery
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Fresh Food Delivery<br />At Your Doorstep
                </h2>
                <p className="text-xl mb-8 leading-relaxed opacity-90">
                  Experience the convenience of having Fresh Fast Food Hub delivered right to your doorstep. We bring the same quality, freshness, and professionalism to every delivery.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/menu"
                    className="bg-brand-red text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition shadow-lg"
                  >
                    Order Now 🛒
                  </Link>
                  <Link
                    href="/contact"
                    className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">⏱️</div>
                      <p className="font-bold text-xl">30 min</p>
                      <p className="text-sm opacity-80">Average Delivery</p>
                    </div>
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">📍</div>
                      <p className="font-bold text-xl">Islandwide</p>
                      <p className="text-sm opacity-80">Delivery Coverage</p>
                    </div>
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🔥</div>
                      <p className="font-bold text-xl">Hot & Fresh</p>
                      <p className="text-sm opacity-80">Food Quality</p>
                    </div>
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">💰</div>
                      <p className="font-bold text-xl">Free Delivery</p>
                      <p className="text-sm opacity-80">Orders Over €25</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ONLINE ORDERING SECTION ================= */}
        <section className="py-20 md:py-28 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-brand-yellow text-black px-4 py-2 rounded-full font-bold mb-4">
                💻 Easy & Convenient
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
                Online Ordering System
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Order your favorite meals with just a few clicks. Our user-friendly online platform makes it easy to browse our menu, customize your order, and schedule delivery or pickup.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📱</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Easy Ordering</h3>
                <p className="text-gray-600">Browse our full menu and customize your order in just a few taps.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">💳</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Secure Payment</h3>
                <p className="text-gray-600">Pay securely online with multiple payment options available.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📅</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Schedule Ahead</h3>
                <p className="text-gray-600">Order now and schedule delivery for later at your preferred time.</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Real-time Tracking</h3>
                <p className="text-gray-600">Track your order in real-time from kitchen to your door.</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/menu"
                className="inline-block bg-gray-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition shadow-lg"
              >
                Browse Menu & Order Now 📋
              </Link>
            </div>
          </div>
        </section>

        {/* ================= OUTSIDE CATERING SECTION ================= */}
        <section 
          className="relative py-24 md:py-32 px-4 md:px-8 flex items-center justify-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <div className="inline-block bg-brand-orange text-white px-4 py-2 rounded-full font-bold mb-6">
                🍽️ Professional Service
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                Outside Catering Services
              </h2>
              <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                From intimate gatherings to grand celebrations, our professional catering team brings the finest cuisine to your venue. We handle every detail so you can enjoy your event.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white hover:bg-white/20 transition">
                <div className="text-5xl mb-6">💒</div>
                <h3 className="text-xl font-bold mb-4">Weddings</h3>
                <p className="opacity-90">Make your special day unforgettable with our exquisite wedding catering and personalized service.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white hover:bg-white/20 transition">
                <div className="text-5xl mb-6">🏢</div>
                <h3 className="text-xl font-bold mb-4">Corporate Events</h3>
                <p className="opacity-90">Impress your clients and employees with professional business lunch and event catering.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white hover:bg-white/20 transition">
                <div className="text-5xl mb-6">🎉</div>
                <h3 className="text-xl font-bold mb-4">Private Parties</h3>
                <p className="opacity-90">Birthdays, anniversaries, and any celebration deserves exceptional food and service.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white hover:bg-white/20 transition">
                <div className="text-5xl mb-6">🎓</div>
                <h3 className="text-xl font-bold mb-4">Graduations</h3>
                <p className="opacity-90">Celebrate academic achievements with delicious food and memorable catering.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white hover:bg-white/20 transition">
                <div className="text-5xl mb-6">⛪</div>
                <h3 className="text-xl font-bold mb-4">Baptisms & Communions</h3>
                <p className="opacity-90">Honour these special occasions with thoughtful catering that reflects your traditions.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white hover:bg-white/20 transition">
                <div className="text-5xl mb-6">🏖️</div>
                <h3 className="text-xl font-bold mb-4">Outdoor Events</h3>
                <p className="opacity-90">From beach parties to garden gatherings, we bring the kitchen to you.</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/contact"
                className="inline-block bg-brand-red text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition shadow-lg"
              >
                Get a Catering Quote 📞
              </Link>
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
                Why Choose Fresh Fast Food Hub
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
                <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👨‍🍳</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Expert Chefs</h3>
                <p className="text-gray-600 text-sm">Professional chefs with years of culinary experience.</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
                <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🥬</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Fresh Ingredients</h3>
                <p className="text-gray-600 text-sm">Locally sourced, high-quality ingredients daily.</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
                <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚗</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">30-minute average delivery time islandwide.</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💯</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">100% Satisfaction</h3>
                <p className="text-gray-600 text-sm">Your happiness is our top priority.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CUSTOMER TESTIMONIALS ================= */}
        <section className="py-20 md:py-28 px-4 md:px-8 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-300">Real reviews from real customers</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-white text-lg mb-6 leading-relaxed">
                  "Fresh Fast Food Hub never disappoints! The food is always hot, fresh, and delicious. Fast delivery and excellent service!"
                </p>
                <p className="text-white font-semibold">Sarah M.</p>
                <p className="text-gray-400 text-sm">Regular Customer</p>
              </div>

              <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-white text-lg mb-6 leading-relaxed">
                  "We booked Fresh Fast Food Hub for our company event. Professional service, amazing food, and great presentation. Highly recommend!"
                </p>
                <p className="text-white font-semibold">John K.</p>
                <p className="text-gray-400 text-sm">Corporate Client</p>
              </div>

              <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-white text-lg mb-6 leading-relaxed">
                  "The wedding catering was absolutely perfect! Our guests are still talking about the amazing food. Thank you for making our day special!"
                </p>
                <p className="text-white font-semibold">Emily & Michael</p>
                <p className="text-gray-400 text-sm">Wedding Client</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/contact"
                className="inline-block bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg"
              >
                Share Your Experience 📝
              </Link>
            </div>
          </div>
        </section>

        {/* ================= CTA SECTION ================= */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-brand-red to-red-700 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                  Ready to Taste<br />the Difference?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Order now and discover why Fresh Fast Food Hub is the preferred choice for thousands of customers.
                </p>
                <Link
                  href="/menu"
                  className="inline-block bg-white text-brand-red px-10 py-4 rounded-full font-bold text-lg hover:bg-brand-yellow hover:text-black transition shadow-xl"
                >
                  Order Now & Enjoy 🛒
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      </>
  );
}
