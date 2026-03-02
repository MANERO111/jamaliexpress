'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user, isAuthenticated } = useAuth();

  // Initialize cart on mount and auth changes
  useEffect(() => {
    initializeCart();
  }, [isAuthenticated, user]);

  // Update cart count whenever cart items change
  useEffect(() => {
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalCount);
  }, [cartItems]);

  const initializeCart = async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated && user) {
        // User is logged in - load from database
        await loadCartFromDatabase();
        // Sync any localStorage items to database
        await syncLocalStorageToDatabase();
      } else {
        // Guest user - load from localStorage
        loadCartFromLocalStorage();
      }
    } catch (error) {
      console.error('Error initializing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCartItems([]);
    }
  };

  const saveCartToLocalStorage = (items) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  const loadCartFromDatabase = async () => {
    try {
      const response = await axios.get('/api/cart');
      const dbCartItems = response.data.data || [];
      console.log('Loaded cart items from database:', dbCartItems);

      // Transform database items to match our cart structure
      const transformedItems = dbCartItems.map(item => {
        const originalPrice = parseFloat(item.product?.original_price || 0);
        const discountedPrice = item.product?.discounted_price ? parseFloat(item.product.discounted_price) : null;
        const effectivePrice = (discountedPrice && discountedPrice > 0) ? discountedPrice : originalPrice;

        return {
          id: item.product_id,
          name: item.product?.name || 'Unknown Product',
          original_price: originalPrice,
          discounted_price: discountedPrice,
          price: effectivePrice,
          image_url: item.product?.image_url || '',
          quantity: item.quantity,
          stock_quantity: item.product?.stock_quantity || 0
        };
      });

      setCartItems(transformedItems);
    } catch (error) {
      console.error('Error loading cart from database:', error);
      setCartItems([]);
    }
  };

  const syncLocalStorageToDatabase = async () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart && isAuthenticated) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          // Sync each item to database
          for (const item of parsedCart) {
            await axios.post('/api/cart/add', {
              product_id: item.id,
              quantity: item.quantity
            });
          }

          // Clear localStorage after successful sync
          localStorage.removeItem('cart');

          // Reload cart from database to get updated data
          await loadCartFromDatabase();
        }
      }
    } catch (error) {
      console.error('Error syncing localStorage to database:', error);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!product) {
      return { success: false, message: 'Produit invalide' };
    }

    setIsLoading(true);
    try {
      if (isAuthenticated && user) {
        // Add to database
        await axios.post('/api/cart/add', {
          product_id: product.id,
          quantity: quantity
        });
        // Reload cart from database
        await loadCartFromDatabase();
      } else {
        // Add to localStorage
        const currentCart = [...cartItems];
        const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
          // Update existing item
          currentCart[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          const originalPrice = parseFloat(product.original_price || product.price || 0);
          const discountedPrice = product.discounted_price ? parseFloat(product.discounted_price) : null;
          const effectivePrice = (discountedPrice && discountedPrice > 0) ? discountedPrice : originalPrice;

          currentCart.push({
            id: product.id,
            name: product.name,
            original_price: originalPrice,
            discounted_price: discountedPrice,
            price: effectivePrice,
            image_url: product.image_url,
            quantity: quantity,
            stock_quantity: product.stock_quantity || 0
          });
        }

        setCartItems(currentCart);
        saveCartToLocalStorage(currentCart);
      }

      return { success: true, message: 'Produit ajouté au panier' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'ajout au panier'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setIsLoading(true);
    try {
      if (isAuthenticated && user) {
        // Update in database
        await axios.put(`/api/cart/update/${productId}`, {
          quantity: newQuantity
        });
        // Reload cart from database
        await loadCartFromDatabase();
      } else {
        // Update in localStorage
        const updatedCart = cartItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);
        saveCartToLocalStorage(updatedCart);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setIsLoading(true);
    try {
      if (isAuthenticated && user) {
        // Remove from database
        await axios.delete(`/api/cart/remove/${productId}`);
        // Reload cart from database
        await loadCartFromDatabase();
      } else {
        // Remove from localStorage
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
        saveCartToLocalStorage(updatedCart);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated && user) {
        // Clear database cart
        await axios.delete('/api/cart/clear');
      } else {
        // Clear localStorage
        localStorage.removeItem('cart');
      }
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.id === productId);
  };

  const value = {
    cartItems,
    cartCount,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItem,
    initializeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};