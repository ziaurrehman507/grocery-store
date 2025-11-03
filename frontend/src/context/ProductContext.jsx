import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../utils/api';

const ProductContext = createContext();

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    page: 1,
    limit: 12
  });

  // Get all products with filters
  const getProducts = async (filtersObj = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filtersObj.category) params.append('category', filtersObj.category);
      if (filtersObj.search) params.append('search', filtersObj.search);
      params.append('page', filtersObj.page);
      params.append('limit', filtersObj.limit);

      const { data } = await API.get(`/products?${params}`);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get featured products
  const getFeaturedProducts = async () => {
    try {
      const { data } = await API.get('/products?featured=true&limit=8');
      setFeaturedProducts(data.products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  // Get categories
  const getCategories = async () => {
    try {
      const { data } = await API.get('/products/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Search products
  const searchProducts = (searchTerm) => {
    updateFilters({ search: searchTerm, page: 1 });
    getProducts({ ...filters, search: searchTerm, page: 1 });
  };

  // Filter by category
  const filterByCategory = (category) => {
    updateFilters({ category, page: 1 });
    getProducts({ ...filters, category, page: 1 });
  };

  useEffect(() => {
    getProducts();
    getFeaturedProducts();
    getCategories();
  }, []);

  useEffect(() => {
    getProducts(filters);
  }, [filters.page, filters.category]);

  const value = {
    products,
    featuredProducts,
    categories,
    loading,
    filters,
    getProducts,
    getFeaturedProducts,
    searchProducts,
    filterByCategory,
    updateFilters
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};