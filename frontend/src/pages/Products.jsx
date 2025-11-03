import React from 'react';
import { useProduct } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';

const Products = () => {
  const { products, loading } = useProduct();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <ProductFilter />
      
      {products.products?.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-600">Try changing your search or filter criteria</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.products?.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {products.pages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button className="btn-secondary">Previous</button>
              <span className="px-4 py-2">
                Page {products.page} of {products.pages}
              </span>
              <button className="btn-secondary">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;