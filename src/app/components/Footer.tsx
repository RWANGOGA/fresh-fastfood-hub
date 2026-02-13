// src/app/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Fresh$FastFood-Hub</h3>
          <p className="text-gray-300 leading-relaxed">
            Your trusted partner for online food ordering, catering services,restuarant and hotel Services and doorstep delivery across Uganda.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="text-gray-300 hover:text-white transition">Home</Link></li>
            <li><Link href="/menu" className="text-gray-300 hover:text-white transition">Menu</Link></li>
            <li><Link href="/cooking-classes" className="text-gray-300 hover:text-white transition">Cooking Classes</Link></li>
            <li><Link href="/locations" className="text-gray-300 hover:text-white transition">Locations</Link></li>
            <li><Link href="/affiliate" className="text-gray-300 hover:text-white transition">Affiliate Program</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Services</h4>
          <ul className="space-y-2">
            <li><Link href="/menu" className="text-gray-300 hover:text-white transition">Online Ordering</Link></li>
            <li><Link href="/menu" className="text-gray-300 hover:text-white transition">Food Delivery</Link></li>
            <li><Link href="/menu" className="text-gray-300 hover:text-white transition">Catering</Link></li>
            <li><Link href="/menu" className="text-gray-300 hover:text-white transition">Hotel Services</Link></li>
            <li><Link href="/menu" className="text-gray-300 hover:text-white transition">Restaurant Services</Link></li>
            <li><Link href="/order-tracking" className="text-gray-300 hover:text-white transition">Order Tracking</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-2 text-gray-300">
            <li>📞 +256 756348528</li>
            <li>📧 info@freshfastfoodhub.com</li>
            <li>📍 Kampala, Uganda</li>
            <li>🕒 Mon-Sun: 8AM-6AM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-8 text-center">
        <p className="text-gray-400">
          © 2024 Fresh$FastFood-Hub. All rights reserved. | Powered by Smart Technology
        </p>
      </div>
    </footer>
  );
}