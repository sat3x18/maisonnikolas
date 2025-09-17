import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useEffect } from 'react';
import { CartItem, Product, DiscountCode } from '../lib/supabase';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedDiscount?: DiscountCode;
  discountAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; color?: string; size?: string } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number; color?: string; size?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'APPLY_DISCOUNT'; payload: { discount: DiscountCode; amount: number } }
  | { type: 'REMOVE_DISCOUNT' }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, color, size } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && 
                item.color === color && 
                item.size === size
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity = updatedItems[existingItemIndex].quantity + 1;
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: [...state.items, { product, quantity: 1, color, size }]
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item, index) => index !== parseInt(action.payload))
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity, color, size } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            item => !(item.product.id === productId && 
                     item.color === color && 
                     item.size === size)
          )
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === productId && 
          item.color === color && 
          item.size === size
            ? { ...item, quantity }
            : item
        )
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    case 'APPLY_DISCOUNT':
      return { 
        ...state, 
        appliedDiscount: action.payload.discount,
        discountAmount: action.payload.amount
      };

    case 'REMOVE_DISCOUNT':
      return { 
        ...state, 
        appliedDiscount: undefined,
        discountAmount: 0
      };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (product: Product, color?: string, size?: string) => void;
  removeItem: (index: number) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getFinalTotal: () => number;
  applyDiscount: (discount: DiscountCode, amount: number) => void;
  removeDiscount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Get user's IP-based identifier
  const getUserId = () => {
    let userId = localStorage.getItem('cart_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('cart_user_id', userId);
    }
    return userId;
  };

  // Load cart from localStorage on mount
  const loadCartFromStorage = () => {
    try {
      const userId = getUserId();
      const savedCart = localStorage.getItem(`cart_${userId}`);
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        return {
          items: cartData.items || [],
          isOpen: false,
          appliedDiscount: cartData.appliedDiscount,
          discountAmount: cartData.discountAmount || 0
        };
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
    return {
      items: [],
      isOpen: false,
      discountAmount: 0
    };
  };

  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    discountAmount: 0
  }, loadCartFromStorage);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      const userId = getUserId();
      const cartData = {
        items: state.items,
        appliedDiscount: state.appliedDiscount,
        discountAmount: state.discountAmount
      };
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }, [state.items, state.appliedDiscount, state.discountAmount]);

  const addItem = (product: Product, color?: string, size?: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, color, size } });
  };

  const removeItem = (index: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: index.toString() });
  };

  const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity, color, size } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const price = item.product.discount_price || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getSubtotal = () => {
    return getTotalPrice();
  };

  const getFinalTotal = () => {
    return Math.max(0, getTotalPrice() - state.discountAmount);
  };

  const applyDiscount = (discount: DiscountCode, amount: number) => {
    dispatch({ type: 'APPLY_DISCOUNT', payload: { discount, amount } });
  };

  const removeDiscount = () => {
    dispatch({ type: 'REMOVE_DISCOUNT' });
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getTotalItems,
    getTotalPrice,
    getSubtotal,
    getFinalTotal,
    applyDiscount,
    removeDiscount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};