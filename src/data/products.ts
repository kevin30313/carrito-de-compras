import { Product, PaymentMethod } from '../types';

export const products: Product[] = [
  // Tech
  {
    id: '1',
    name: 'Neural Interface Pro X1',
    price: 2499.99,
    category: 'tech',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Interfaz neural de última generación para realidad aumentada con conectividad directa cerebro-máquina',
    stock: 15,
    rating: 4.8,
    featured: true
  },
  {
    id: '2',
    name: 'Quantum Processor Core',
    price: 1899.99,
    category: 'tech',
    image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Procesador cuántico de 128 qubits para computación avanzada y criptografía post-cuántica',
    stock: 8,
    rating: 4.9,
    featured: true
  },
  {
    id: '3',
    name: 'Holographic Display Matrix',
    price: 3299.99,
    category: 'tech',
    image: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Pantalla holográfica 8K con proyección 360° y seguimiento ocular integrado',
    stock: 5,
    rating: 4.7
  },

  // Gadgets
  {
    id: '4',
    name: 'Cyber Drone Stealth',
    price: 899.99,
    category: 'gadgets',
    image: 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Drone autónomo con IA avanzada, modo sigilo y capacidades de reconocimiento táctico',
    stock: 12,
    rating: 4.6,
    featured: true
  },
  {
    id: '5',
    name: 'Smart Contact Lenses',
    price: 599.99,
    category: 'gadgets',
    image: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Lentillas inteligentes con realidad aumentada, monitoreo de salud y traducción en tiempo real',
    stock: 25,
    rating: 4.4
  },
  {
    id: '6',
    name: 'Biometric Scanner Glove',
    price: 399.99,
    category: 'gadgets',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Guante biométrico táctil con escáner molecular y capacidades de hackeo ético',
    stock: 18,
    rating: 4.3
  },

  // Clothing
  {
    id: '7',
    name: 'Neo-Tokyo Jacket',
    price: 299.99,
    category: 'clothing',
    image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Chaqueta cyberpunk impermeable con LEDs RGB programables y fibras termoreguladoras',
    stock: 30,
    rating: 4.5,
    featured: true
  },
  {
    id: '8',
    name: 'Quantum Fiber Boots',
    price: 199.99,
    category: 'clothing',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Botas de fibra cuántica con suela magnetizada y sistema de amortiguación inteligente',
    stock: 22,
    rating: 4.2
  },
  {
    id: '9',
    name: 'Digital Camo Pants',
    price: 149.99,
    category: 'clothing',
    image: 'https://images.pexels.com/photos/1972115/pexels-photo-1972115.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Pantalones tácticos con camuflaje digital adaptativo y múltiples bolsillos ocultos',
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