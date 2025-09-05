import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '../store/cartStore';
import { paymentMethods } from '../data/products';

const Cart: React.FC = () => {
  const { items, isOpen, total, closeCart, updateQuantity, removeItem, clearCart } = useCartStore();

  const handleCheckout = () => {
    // Aquí implementarías la lógica de checkout real
    alert('Redirecting to payment...');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-cyan-500/30 z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
                <button
                  onClick={closeCart}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
                  <p className="text-gray-500">Add some cyberpunk items to get started!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex items-center space-x-4 bg-gray-800/50 p-4 rounded-lg border border-cyan-500/20">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-sm">{item.product.name}</h3>
                          <p className="text-cyan-400 font-bold">${item.product.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="text-cyan-400 hover:text-pink-400 transition-colors"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-cyan-400 hover:text-pink-400 transition-colors"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-red-400 hover:text-red-300 transition-colors ml-2"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-cyan-500/30 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-white">Total:</span>
                      <span className="text-2xl font-bold text-cyan-400">${total.toFixed(2)}</span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <h3 className="text-white font-medium">Payment Methods:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {paymentMethods.slice(0, 4).map((method) => (
                          <div
                            key={method.id}
                            className="flex items-center space-x-2 p-2 bg-gray-800/50 rounded border border-cyan-500/20 text-sm"
                          >
                            <span>{method.icon}</span>
                            <span className="text-gray-300">{method.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCheckout}
                        className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                      >
                        PROCEED TO CHECKOUT
                      </motion.button>
                      <button
                        onClick={clearCart}
                        className="w-full border border-red-500/50 text-red-400 hover:bg-red-500/10 py-2 rounded-lg font-medium transition-colors"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;