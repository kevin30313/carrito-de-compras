import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, StarIcon, PlusIcon } from '@heroicons/react/24/solid';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { addItem } = useCartStore();

  if (!product) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tech': return 'from-blue-500 to-cyan-500';
      case 'gadgets': return 'from-orange-500 to-red-500';
      case 'clothing': return 'from-green-500 to-teal-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const handleAddToCart = () => {
    addItem(product);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-900 border-2 border-cyan-500/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/20 pointer-events-auto"
            >
              <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-cyan-500/30 p-4 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Product Details
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="relative overflow-hidden rounded-lg border-2 border-cyan-500/30 hover:border-pink-500/50 transition-all duration-300"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto object-cover rounded-lg cursor-zoom-in"
                      />
                      {product.featured && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded shadow-lg">
                          FEATURED
                        </div>
                      )}
                      <div className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${getCategoryColor(product.category)} text-white text-sm font-bold rounded uppercase`}>
                        {product.category}
                      </div>
                    </motion.div>
                    <p className="text-gray-500 text-xs text-center mt-2">
                      Hover to zoom
                    </p>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-4">
                        {product.name}
                      </h3>

                      <div className="flex items-center space-x-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-400">({product.rating})</span>
                      </div>

                      <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Stock disponible:</span>
                          <span className="text-cyan-400 font-bold">{product.stock} unidades</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Categoría:</span>
                          <span className="text-pink-400 font-bold uppercase">{product.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-cyan-500/30 pt-6">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-4xl font-bold text-white">
                          ${product.price.toLocaleString()}
                        </span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
                      >
                        <PlusIcon className="w-6 h-6" />
                        <span>Agregar al Carrito</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
