import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, PlusIcon } from '@heroicons/react/24/solid';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tech': return 'from-blue-400 to-cyan-400';
      case 'gadgets': return 'from-pink-400 to-purple-400';
      case 'clothing': return 'from-green-400 to-teal-400';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg overflow-hidden hover:border-pink-500/50 transition-all duration-300 group"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded">
            FEATURED
          </div>
        )}
        <div className={`absolute top-2 right-2 px-2 py-1 bg-gradient-to-r ${getCategoryColor(product.category)} text-white text-xs font-bold rounded uppercase`}>
          {product.category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-600'
                }`}
              />
            ))}
            <span className="text-gray-400 text-sm ml-1">({product.rating})</span>
          </div>
          <span className="text-sm text-cyan-400">
            Stock: {product.stock}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            ${product.price.toLocaleString()}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addItem(product)}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;