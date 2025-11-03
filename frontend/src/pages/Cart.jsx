import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const { cart, updateCartItem, removeFromCart, clearCart, getCartStats } = useCart();
    const { user } = useAuth();
    const { totalItems, totalAmount } = getCartStats();

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔒</div>
                    <h3 className="text-xl font-semibold mb-4">Please login to view your cart</h3>
                    <Link to="/login" className="btn-primary">Login Now</Link>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-semibold mb-4">Your cart is empty</h3>
                    <p className="text-gray-600 mb-6">Add some products to your cart to see them here</p>
                    <Link to="/products" className="btn-primary">Start Shopping</Link>
                </div>
            </div>
        );
    }

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        updateCartItem(productId, newQuantity);
    };

    const handleRemoveItem = (productId) => {
        if (window.confirm('Are you sure you want to remove this item from cart?')) {
            removeFromCart(productId);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">
                                Cart Items ({totalItems})
                            </h2>
                            <button
                                onClick={clearCart}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Clear Cart
                            </button>
                        </div>

                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                <div key={item.product._id} className="flex items-center gap-4 pb-4 border-b">
                                    {/* Product Image */}
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                        {item.product.image ? (
                                            <img
                                                src={`http://localhost:5000${item.product.image}`}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="text-gray-400">🛒</div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1">
                                        <Link
                                            to={`/product/${item.product._id}`}
                                            className="font-semibold hover:text-primary-600 transition"
                                        >
                                            {item.product.name}
                                        </Link>
                                        <p className="text-gray-600 text-sm mt-1">₹{item.price} per {item.product.unit}</p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 mt-2">
                                            <button
                                                onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price and Remove */}
                                    <div className="text-right">
                                        <p className="font-semibold text-lg">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => handleRemoveItem(item.product._id)}
                                            className="text-red-600 hover:text-red-800 text-sm mt-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal ({totalItems} items)</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{totalAmount > 500 ? 'FREE' : '₹50.00'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (10%)</span>
                                <span>₹{(totalAmount * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>
                                        ₹{(
                                            totalAmount +
                                            (totalAmount > 500 ? 0 : 50) +
                                            (totalAmount * 0.1)
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Link to="/checkout" className="btn-primary w-full py-3 text-lg block text-center">
                            Proceed to Checkout
                        </Link>

                        <Link to="/products" className="block text-center text-primary-600 hover:underline mt-4">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;