export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'tech' | 'gadgets' | 'clothing';
  image: string;
  description: string;
  stock: number;
  rating: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'paypal' | 'transfer' | 'crypto';
  icon: string;
  available: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: string;
  createdAt: Date;
}