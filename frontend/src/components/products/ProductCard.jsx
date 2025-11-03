import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    const result = await addToCart(product, 1);
    if (result.success) {
      alert('Product added to cart!');
    }
  };

  return (
    <div className="card p-4 hover:shadow-lg transition duration-200">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-square mb-4 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img 
              src={`http://localhost:5000${product.image}`} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-4xl">🛒</div>
          )}
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary-600">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
            )}
          </div>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            {product.unit}
          </span>
        </div>
      </Link>
      
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className={`w-full mt-3 ${
          product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'btn-primary'
        }`}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;