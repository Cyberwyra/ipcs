import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, CartItem, PosAction, PosState } from '../data/types';

const initialState: PosState = {
  cart: JSON.parse(localStorage.getItem('pos_cart') || '[]'),
  total: JSON.parse(localStorage.getItem('pos_total') || '0'),
};

const posReducer = (state: PosState, action: PosAction): PosState => {
  let newState;
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      let newCart;
      if (existingItem) {
        newCart = state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      newState = {
        ...state,
        cart: newCart,
        total: newCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
      break;
    }
    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(item => item.id !== action.payload);
      newState = {
        ...state,
        cart: newCart,
        total: newCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
      break;
    }
    case 'UPDATE_QUANTITY': {
      const newCart = state.cart.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      newState = {
        ...state,
        cart: newCart,
        total: newCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
      break;
    }
    case 'CLEAR_CART':
      newState = { cart: [], total: 0 };
      break;
    default:
      return state;
  }
  
  localStorage.setItem('pos_cart', JSON.stringify(newState.cart));
  localStorage.setItem('pos_total', JSON.stringify(newState.total));
  return newState;
};

interface PosContextType {
  state: PosState;
  dispatch: React.Dispatch<PosAction>;
}

const PosContext = createContext<PosContextType | undefined>(undefined);

export const PosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(posReducer, initialState);

  return (
    <PosContext.Provider value={{ state, dispatch }}>
      {children}
    </PosContext.Provider>
  );
};

export const usePos = () => {
  const context = useContext(PosContext);
  if (context === undefined) {
    throw new Error('usePos must be used within a PosProvider');
  }
  return context;
};
