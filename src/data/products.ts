import { Product, PaymentMethod } from '../types';

export const products: Product[] = [
  // Tech
  {
    id: '1',
    name: 'Neural Interface Pro X1',
    price: 2499.99,
    category: 'tech',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=400&h=400&fit=crop',
    description: 'Interfaz neural de última generación para realidad aumentada',
    stock: 15,
    rating: 4.8,
    featured: true
  },
  {
    id: '2',
    name: 'Quantum Processor Core',
    price: 1899.99,
    category: 'tech',
    image: 'https://images.pexels.com/photos/2061168/pexels-photo-2061168.jpeg?w=400&h=400&fit=crop',
    description: 'Procesador cuántico para computación avanzada',
    stock: 8,
    rating: 4.9,
    featured: true
  },
  {
    id: '3',
    name: 'Holographic Display Matrix',
    price: 3299.99,
    category: 'tech',
    image: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?w=400&h=400&fit=crop',
    description: 'Pantalla holográfica 4K con proyección 360°',
    stock: 5,
    rating: 4.7
  },

  // Gadgets
  {
    id: '4',
    name: 'Cyber Drone Stealth',
    price: 899.99,
    category: 'gadgets',
    image: 'https://images.pexels.com/photos/336948/pexels-photo-336948.jpeg?w=400&h=400&fit=crop',
    description: 'Drone invisible con IA avanzada y modo sigilo',
    stock: 12,
    rating: 4.6,
    featured: true
  },
  {
    id: '5',
    name: 'Smart Contact Lenses',
    price: 599.99,
    category: 'gadgets',
    image: 'https://images.pexels.com/photos/1557843/pexels-photo-1557843.jpeg?w=400&h=400&fit=crop',
    description: 'Lentillas inteligentes con realidad aumentada',
    stock: 25,
    rating: 4.4
  },
  {
    id: '6',
    name: 'Biometric Scanner Glove',
    price: 399.99,
    category: 'gadgets',
    image: 'https://images.pexels.com/photos/7862477/pexels-photo-7862477.jpeg?w=400&h=400&fit=crop',
    description: 'Guante biométrico para seguridad avanzada',
    stock: 18,
    rating: 4.3
  },

  // Clothing
  {
    id: '7',
    name: 'Neo-Tokyo Jacket',
    price: 299.99,
    category: 'clothing',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?w=400&h=400&fit=crop',
    description: 'Chaqueta cyberpunk con LEDs integrados',
    stock: 30,
    rating: 4.5,
    featured: true
  },
  {
    id: '8',
    name: 'Quantum Fiber Boots',
    price: 199.99,
    category: 'clothing',
    image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?w=400&h=400&fit=crop',
    description: 'Botas de fibra cuántica con suela anti-gravedad',
    stock: 22,
    rating: 4.2
  },
  {
    id: '9',
    name: 'Digital Camo Pants',
    price: 149.99,
    category: 'clothing',
    image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?w=400&h=400&fit=crop',
    description: 'Pantalones con camuflaje digital adaptativo',
    stock: 35,
    rating: 4.1
  }
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'visa',
    name: 'Visa/Mastercard',
    type: 'card',
    icon: '💳',
    available: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'paypal',
    icon: '🅿️',
    available: true
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    type: 'card',
    icon: '💙',
    available: true
  },
  {
    id: 'webpay',
    name: 'Webpay Plus (Chile)',
    type: 'card',
    icon: '🇨🇱',
    available: true
  },
  {
    id: 'transfer',
    name: 'Transferencia Bancaria',
    type: 'transfer',
    icon: '🏦',
    available: true
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    type: 'crypto',
    icon: '₿',
    available: true
  }
];