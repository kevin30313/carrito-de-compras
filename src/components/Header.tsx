import React from 'react';
import { ShoppingCartIcon, UserIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

interface HeaderProps {
  onLoginClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onMenuClick }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount, toggleCart } = useCartStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyan-500/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="lg:hidden">
            <Bars3Icon className="w-6 h-6 text-cyan-400" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
            CYBERSTORE
          </h1>
        </div>

        <nav className="hidden lg:flex space-x-8">
          <a href="#" className="text-cyan-400 hover:text-pink-400 transition-colors font-medium">
            TECH
          </a>
          <a href="#" className="text-cyan-400 hover:text-pink-400 transition-colors font-medium">
            GADGETS
          </a>
          <a href="#" className="text-cyan-400 hover:text-pink-400 transition-colors font-medium">
            CLOTHING
          </a>
          <a href="#" className="text-cyan-400 hover:text-pink-400 transition-colors font-medium">
            FEATURED
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleCart}
            className="relative p-2 text-cyan-400 hover:text-pink-400 transition-colors"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full border-2 border-cyan-400"
              />
              <span className="text-cyan-400 font-medium">{user?.name}</span>
              <button
                onClick={logout}
                className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-2 text-cyan-400 hover:text-pink-400 transition-colors"
            >
              <UserIcon className="w-6 h-6" />
              <span className="font-medium">Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;