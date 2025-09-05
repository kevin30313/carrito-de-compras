import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import { Product } from '../types';

const ProductGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const categories = [
    { id: 'all', name: 'ALL PRODUCTS', color: 'from-white to-gray-300' },
    { id: 'tech', name: 'TECH', color: 'from-blue-400 to-cyan-400' },
    { id: 'gadgets', name: 'GADGETS', color: 'from-pink-400 to-purple-400' },
    { id: 'clothing', name: 'CLOTHING', color: 'from-green-400 to-teal-400' }
  ];

  const filteredProducts = products.filter(product =>
    selectedCategory === 'all' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              CYBER PRODUCTS
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Discover the latest in cyberpunk technology and fashion
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-black shadow-lg`
                    : 'bg-gray-800 text-cyan-400 border border-cyan-500/30 hover:border-pink-500/50'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-cyan-500/30 rounded-lg text-cyan-400 focus:border-pink-500 focus:outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;