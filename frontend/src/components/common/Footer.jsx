import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">🛒 GroceryStore</h3>
            <p className="text-gray-300">
              Your one-stop shop for fresh groceries and daily essentials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/products" className="hover:text-white transition">Products</a></li>
              <li><a href="/about" className="hover:text-white transition">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/products?category=fruits" className="hover:text-white transition">Fruits</a></li>
              <li><a href="/products?category=vegetables" className="hover:text-white transition">Vegetables</a></li>
              <li><a href="/products?category=dairy" className="hover:text-white transition">Dairy</a></li>
              <li><a href="/products?category=meat" className="hover:text-white transition">Meat</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📞 +1 234 567 890</li>
              <li>✉️ support@grocerystore.com</li>
              <li>📍 123 Grocery Street, City</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
          <p>&copy; 2024 GroceryStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;