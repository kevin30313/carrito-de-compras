import React, { useState, useEffect } from 'react';
import NetworkAnimation from './components/NetworkAnimation';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import LoginModal from './components/LoginModal';
import { useAuthStore } from './store/authStore';
import Cookies from 'js-cookie';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check for stored user session
    const storedUser = Cookies.get('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        useAuthStore.setState({ user: userData, isAuthenticated: true });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        Cookies.remove('user');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-x-hidden">
      <NetworkAnimation />
      
      <div className="relative z-10">
        <Header 
          onLoginClick={() => setShowLoginModal(true)}
          onMenuClick={() => setShowMobileMenu(!showMobileMenu)}
        />
        
        <Hero />
        
        <div id="products">
          <ProductGrid />
        </div>
        
        <footer className="bg-black/80 backdrop-blur-md border-t border-cyan-500/30 py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              CYBERSTORE
            </h3>
            <p className="text-gray-400 mb-4">
              The future is now. Shop the cyberpunk revolution.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="#" className="text-cyan-400 hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-cyan-400 hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-cyan-400 hover:text-blue-400 transition-colors">Contact</a>
              <a href="#" className="text-cyan-400 hover:text-blue-400 transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>

      <Cart />
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}

export default App;