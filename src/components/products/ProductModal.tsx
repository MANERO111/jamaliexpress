'use client';
import React, { useEffect, useState } from 'react';
import { X, ShoppingCart, Plus, Minus, Heart, Share2, Check } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { getProductImageUrl } from '@/utils/imageHelper';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setQuantity(1);
      setAdded(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!product) return null;

  const hasDiscount = product.discounted_price && 
                     Number(product.discounted_price) > 0 && 
                     Number(product.discounted_price) < Number(product.original_price);
  
  const currentPrice = hasDiscount ? product.discounted_price : product.original_price;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async () => {
    if (adding || product.stock_quantity === 0) return;
    setAdding(true);
    try {
      const result = await addToCart(product, quantity);
      if (result.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-modal flex flex-col md:flex-row max-h-[95vh] sm:max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-500 hover:text-black transition-colors shadow-sm md:bg-gray-100/50"
        >
          <X size={20} />
        </button>

        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 bg-[#f8f6f3] flex items-center justify-center p-8 md:p-12 relative overflow-hidden group min-h-[300px] md:min-h-0">
          <img 
            src={getProductImageUrl(product.image_url)} 
            alt={product.name}
            className="w-full h-full max-h-[400px] md:max-h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Decorative elements */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl" />
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-12 overflow-y-auto flex flex-col">
          <div className="flex-grow">
            {/* Category/Brand */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-500/80">
                {product.brand || 'Jamali Express'}
              </span>
              <div className="h-px w-8 bg-gray-200" />
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-3xl font-light text-gray-900 mb-4 leading-tight">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl md:text-3xl font-bold text-gray-900">
                {Number(currentPrice).toFixed(2)} <span className="text-sm font-normal text-gray-400">DH</span>
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  {Number(product.original_price).toFixed(2)} DH
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {product.description || 'Aucune description disponible pour ce produit.'}
              </p>
            </div>

            {/* Stock */}
            <div className="mb-8 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs font-medium text-gray-500">
                {product.stock_quantity > 0 ? `En stock (${product.stock_quantity} disponibles)` : 'Rupture de stock'}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-auto space-y-4 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-white rounded-lg transition-colors text-gray-500 disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="p-2.5 hover:bg-white rounded-lg transition-colors text-gray-500 disabled:opacity-30"
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Wishlist Button */}
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition-all duration-300 ${
                  inWishlist 
                  ? 'bg-pink-50 border-pink-200 text-pink-500' 
                  : 'bg-white border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900'
                }`}
              >
                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
              
              {/* Share Button */}
              <button className="p-3 rounded-xl border border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all duration-300">
                <Share2 size={20} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0 || adding}
              className={`w-full py-4.5 rounded-2xl font-bold uppercase tracking-[0.15em] text-xs transition-all duration-500 flex items-center justify-center gap-3 ${
                added 
                ? 'bg-green-500 text-white' 
                : 'bg-black text-white hover:bg-gray-900 shadow-xl hover:shadow-2xl translate-y-0 hover:-translate-y-1'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {added ? (
                <>
                  <Check size={18} />
                  <span>Ajouté au panier</span>
                </>
              ) : adding ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Ajout en cours...</span>
                </div>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>Ajouter au panier</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal {
          animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default ProductModal;
