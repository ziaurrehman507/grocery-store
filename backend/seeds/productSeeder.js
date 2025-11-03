const mongoose = require('mongoose');
const Product = require('../models/product');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Fresh Apples',
    description: 'Sweet and crunchy red apples, perfect for snacks and desserts.',
    price: 120,
    originalPrice: 150,
    category: 'fruits',
    stock: 50,
    unit: 'kg',
    brand: 'Fresh Farms',
    featured: true
  },
  {
    name: 'Bananas',
    description: 'Ripe yellow bananas, great for smoothies and healthy snacks.',
    price: 60,
    category: 'fruits',
    stock: 30,
    unit: 'dozen',
    brand: 'Tropical',
    featured: true
  },
  {
    name: 'Carrots',
    description: 'Fresh organic carrots, rich in vitamins and perfect for cooking.',
    price: 40,
    category: 'vegetables',
    stock: 25,
    unit: 'kg',
    brand: 'Organic Greens'
  },
  {
    name: 'Milk',
    description: 'Pure cow milk, pasteurized and homogenized for daily consumption.',
    price: 60,
    category: 'dairy',
    stock: 100,
    unit: 'liter',
    brand: 'Pure Dairy',
    featured: true
  },
  {
    name: 'Eggs',
    description: 'Farm fresh eggs, rich in protein and essential nutrients.',
    price: 90,
    category: 'dairy',
    stock: 60,
    unit: 'dozen',
    brand: 'Happy Hens'
  },
  {
    name: 'Chicken Breast',
    description: 'Boneless chicken breast, perfect for healthy meals and grilling.',
    price: 350,
    category: 'meat',
    stock: 20,
    unit: 'kg',
    brand: 'Premium Meats'
  },
  {
    name: 'Whole Wheat Bread',
    description: 'Freshly baked whole wheat bread, great for sandwiches and toast.',
    price: 45,
    category: 'bakery',
    stock: 40,
    unit: 'pack',
    brand: 'Bakery Fresh'
  },
  {
    name: 'Orange Juice',
    description: '100% pure orange juice without any added sugar or preservatives.',
    price: 120,
    category: 'beverages',
    stock: 35,
    unit: 'liter',
    brand: 'Juice King'
  },
  {
    name: 'Potato Chips',
    description: 'Crispy and delicious potato chips, perfect for snacking.',
    price: 30,
    category: 'snacks',
    stock: 80,
    unit: 'pack',
    brand: 'Crunchy'
  },
  {
    name: 'Tomatoes',
    description: 'Fresh red tomatoes, ideal for salads, curries and cooking.',
    price: 25,
    category: 'vegetables',
    stock: 45,
    unit: 'kg',
    brand: 'Farm Fresh'
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products added successfully');

    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();