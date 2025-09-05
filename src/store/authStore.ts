import { create } from 'zustand';
import { User } from '../types';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    // Simulación de login - en producción esto sería una API call
    if (email && password) {
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        avatar: `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face`
      };
      
      set({ user, isAuthenticated: true });
      Cookies.set('user', JSON.stringify(user), { expires: 7 });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    Cookies.remove('user');
  },

  register: async (email: string, password: string, name: string) => {
    // Simulación de registro
    if (email && password && name) {
      const user: User = {
        id: Date.now().toString(),
        email,
        name,
        avatar: `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face`
      };
      
      set({ user, isAuthenticated: true });
      Cookies.set('user', JSON.stringify(user), { expires: 7 });
      return true;
    }
    return false;
  }
}));