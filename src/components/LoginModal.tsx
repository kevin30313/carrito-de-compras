import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;
      if (isLogin) {
        success = await login(email, password);
      } else {
        success = await register(email, password, name);
      }

      if (success) {
        onClose();
        setEmail('');
        setPassword('');
        setName('');
      } else {
        alert('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 border border-cyan-500/30 rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  {isLogin ? 'LOGIN' : 'REGISTER'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-cyan-400 font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
                      placeholder="Enter your name"
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-cyan-400 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-cyan-400 font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : (isLogin ? 'LOGIN' : 'REGISTER')}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                </p>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-cyan-400 hover:text-pink-400 font-medium transition-colors"
                >
                  {isLogin ? 'Register here' : 'Login here'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;