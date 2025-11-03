import React from 'react';
import { useProduct } from '../../context/ProductContext';

const ProductFilter = () => {
  const { categories, filters, filterByCategory, searchProducts } = useProduct();

  return (
    <div className="card p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => searchProducts(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-auto">
          <select
            value={filters.category}
            onChange={(e) => filterByCategory(e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;