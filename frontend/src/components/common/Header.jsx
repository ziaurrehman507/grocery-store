import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
    const { user, logout } = useAuth();
    const { getCartStats } = useCart();
    const { totalItems } = getCartStats();

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-primary-600">
                        🛒 GroceryStore
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
                            Home
                        </Link>
                        <Link to="/products" className="text-gray-700 hover:text-primary-600 transition">
                            Products
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition">
                                    🛍️ Cart
                                    {totalItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition">
                                        Admin
                                    </Link>
                                )}
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Hello, {user.name}</span>
                                    <button
                                        onClick={logout}
                                        className="btn-secondary text-sm"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;