import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

  // Get user's cart
  const getCart = async () => {
    if (!user) return;
    
    setCartLoading(true);
    try {
      const { data } = await API.get('/cart');
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setCartLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      return { success: false, error: 'Please login to add items to cart' };
    }

    try {
      const { data } = await API.post('/cart/items', {
        productId: product._id,
        quantity,
        price: product.price
      });
      setCart(data);
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add item to cart';
      return { success: false, error: errorMsg };
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    try {
      const { data } = await API.put(`/cart/items/${productId}`, { quantity });
      setCart(data);
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const { data } = await API.delete(`/cart/items/${productId}`);
      setCart(data);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await API.delete('/cart');
      setCart({ items: [], totalAmount: 0 });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  // Calculate cart stats
  const getCartStats = () => {
    if (!cart || !cart.items) return { totalItems: 0, totalAmount: 0 };
    
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.totalAmount || cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return { totalItems, totalAmount };
  };

  useEffect(() => {
    if (user) {
      getCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const value = {
    cart,
    cartLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartStats,
    refreshCart: getCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};