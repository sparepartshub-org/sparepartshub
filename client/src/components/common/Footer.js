import React from 'react';
import { GiAutoRepair } from 'react-icons/gi';

const Footer = () => (
  <footer className="bg-steel-800 text-steel-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <GiAutoRepair className="text-accent-400" />
            SparePartsHub
          </div>
          <p className="text-sm">Your one-stop multi-vendor marketplace for quality bike and car spare parts.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="/products" className="hover:text-white transition">Products</a></li>
            <li><a href="/products?vehicleType=bike" className="hover:text-white transition">Bike Parts</a></li>
            <li><a href="/products?vehicleType=car" className="hover:text-white transition">Car Parts</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-1 text-sm">
            <li>Email: support@sparepartshub.com</li>
            <li>Phone: +91-1234567890</li>
            <li>Mon-Sat: 9:00 AM - 7:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-steel-700 mt-6 pt-4 text-center text-sm">
        © {new Date().getFullYear()} SparePartsHub. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
