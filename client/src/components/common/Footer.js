import React from 'react';
import { Link } from 'react-router-dom';
import { GiAutoRepair } from 'react-icons/gi';

const Footer = () => (
  <footer className="bg-steel-800 dark:bg-gray-950 text-steel-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <GiAutoRepair className="text-accent-400" />
            🔧 SparePartsHub
          </div>
          <p className="text-sm leading-relaxed">
            India's trusted multi-vendor marketplace for premium bike 🏍️ and car 🚗 spare parts.
            Genuine products from verified wholesalers, delivered to your doorstep. 🚚
          </p>
          <div className="flex gap-3 mt-4">
            <span className="text-2xl">🏍️</span>
            <span className="text-2xl">🚗</span>
            <span className="text-2xl">🛠️</span>
            <span className="text-2xl">⚙️</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">🔗 Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white transition">🛒 All Products</Link></li>
            <li><Link to="/products?vehicleType=bike" className="hover:text-white transition">🏍️ Bike Parts</Link></li>
            <li><Link to="/products?vehicleType=car" className="hover:text-white transition">🚗 Car Parts</Link></li>
            <li><Link to="/register" className="hover:text-white transition">📝 Register as Wholesaler</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-semibold mb-3">🏷️ Popular Categories</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white transition cursor-pointer">🔋 Batteries & Electrical</li>
            <li className="hover:text-white transition cursor-pointer">🛞 Tires & Wheels</li>
            <li className="hover:text-white transition cursor-pointer">🛢️ Engine & Oil</li>
            <li className="hover:text-white transition cursor-pointer">💡 Lights & Indicators</li>
            <li className="hover:text-white transition cursor-pointer">🔩 Brake Systems</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">📞 Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li>📧 support@sparepartshub.com</li>
            <li>📱 +91-1234567890</li>
            <li>🕐 Mon-Sat: 9:00 AM - 7:00 PM</li>
            <li>📍 Mumbai, Maharashtra, India</li>
          </ul>
          <div className="mt-4">
            <p className="text-xs text-steel-400">
              🔒 100% Secure Payments<br/>
              🚚 Free Shipping on orders above ₹2000<br/>
              ✅ Genuine Product Guarantee
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-steel-700 mt-8 pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-center">
            © {new Date().getFullYear()} SparePartsHub. All rights reserved. 🏁
          </p>
          <div className="flex gap-4 text-sm">
            <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition cursor-pointer">Refund Policy</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
