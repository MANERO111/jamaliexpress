'use client';
import React, { useState } from 'react';
import { Heart, ShoppingCart, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { getProductImageUrl } from '@/utils/imageHelper';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>({});
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return '0.00';
    return parseFloat(price.toString()).toFixed(2);
  };

  const hasDiscount = (product: Product) =>
    product.discounted_price &&
    product.discounted_price > 0 &&
    product.discounted_price < product.original_price;

  const discountPct = (product: Product) => {
    if (!hasDiscount(product)) return 0;
    return Math.round(
      ((product.original_price - product.discounted_price!) / product.original_price) * 100
    );
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addingToCart[product.id] || product.stock_quantity === 0) return;
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    try {
      const result = await addToCart(product, 1);
      if (!result.success) console.error(result.message);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setAddingToCart(prev => ({ ...prev, [product.id]: false })), 1200);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  // Alternate accent per row-position
  const accent = (i: number) => (i % 2 === 0 ? '#f54f9a' : '#41cdcf');
  const accentRgb = (i: number) => (i % 2 === 0 ? '245,79,154' : '65,205,207');

  if (products.length === 0) return null; // handled by parent

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
      `}</style>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product, index) => {
          const isHovered   = hoveredId === product.id;
          const inCart      = !!addingToCart[product.id];
          const inWishlist  = isInWishlist(product.id);
          const outOfStock  = product.stock_quantity === 0;
          const lowStock    = product.stock_quantity > 0 && product.stock_quantity < 5;
          const col         = accent(index);
          const rgb         = accentRgb(index);
          const pct         = discountPct(product);
          const hasPromo    = product.discounted_price !== null && product.discounted_price !== undefined && Number(product.discounted_price) > 0;
          const price       = formatPrice(hasPromo ? product.discounted_price : product.original_price);
          const oldPrice    = formatPrice(product.original_price);

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug || product.id}`}
              className="relative block select-none group"
              style={{ textDecoration: 'none' }}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              draggable={false}
            >
              {/* Ghost index number */}
              <span
                className="absolute -top-5 -left-1 text-[80px] font-bold leading-none pointer-events-none select-none z-0 transition-opacity duration-500"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: `rgba(${rgb},${isHovered ? 0.08 : 0.035})`,
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Card */}
              <div
                className="relative z-10 flex flex-col overflow-hidden transition-all duration-500 bg-white"
                style={{
                  border: `1px solid ${isHovered ? `rgba(${rgb},0.32)` : 'rgba(26,26,46,0.08)'}`,
                  boxShadow: isHovered
                    ? `0 24px 56px rgba(${rgb},0.14), 0 4px 16px rgba(0,0,0,0.05)`
                    : '0 2px 8px rgba(0,0,0,0.04)',
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 z-20 transition-opacity duration-400"
                  style={{
                    height: '2px',
                    background: `linear-gradient(90deg, ${col}, transparent)`,
                    opacity: isHovered ? 1 : 0,
                  }}
                />

                {/* ── Image zone ── */}
                <div className="relative overflow-hidden bg-[#f7f5f2]" style={{ aspectRatio: '1/1' }}>
                  {product.image_url ? (
                    <img
                      // src={getProductImageUrl(product.image_url)}
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 transition-transform duration-700"
                      style={{ transform: isHovered ? 'scale(1.07)' : 'scale(1)' }}
                      draggable={false}
                      onError={e => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div
                        className="w-16 h-20 flex items-center justify-center"
                        style={{ background: 'rgba(26,26,46,0.06)' }}
                      >
                        <ShoppingCart size={22} style={{ color: 'rgba(26,26,46,0.2)' }} />
                      </div>
                    </div>
                  )}

                  {/* Hover scrim */}
                  <div
                    className="absolute inset-0 transition-opacity duration-400 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(26,26,46,0.38) 0%, transparent 55%)',
                      opacity: isHovered ? 1 : 0,
                    }}
                  />

                  {/* ── Badges ── */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                    {pct > 0 && (
                      <span
                        className="px-2 py-0.5 text-[9px] font-bold tracking-[0.12em] text-white"
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          background: 'linear-gradient(135deg, #f54f9a, #d4326e)',
                        }}
                      >
                        −{pct}%
                      </span>
                    )}
                    {outOfStock && (
                      <span
                        className="px-2 py-0.5 text-[9px] font-semibold tracking-[0.1em] uppercase"
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          background: 'rgba(245,79,154,0.1)',
                          border: '1px solid rgba(245,79,154,0.35)',
                          color: '#f54f9a',
                        }}
                      >
                        Rupture
                      </span>
                    )}
                    {lowStock && !outOfStock && (
                      <span
                        className="px-2 py-0.5 text-[9px] font-semibold tracking-[0.1em] uppercase transition-opacity duration-300"
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          background: 'rgba(255,255,255,0.92)',
                          border: '1px solid rgba(245,79,154,0.3)',
                          color: '#f54f9a',
                          opacity: isHovered ? 1 : 0.7,
                        }}
                      >
                        Plus que {product.stock_quantity}
                      </span>
                    )}
                  </div>

                  {/* Wishlist button */}
                  <button
                    onClick={e => handleWishlistClick(e, product.id)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center z-30 transition-all duration-300"
                    style={{
                      background: 'rgba(255,255,255,0.92)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${inWishlist ? '#f54f9a' : 'rgba(26,26,46,0.1)'}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      opacity: isHovered || inWishlist ? 1 : 0,
                      transform: isHovered || inWishlist ? 'translateY(0) scale(1)' : 'translateY(-5px) scale(0.85)',
                    }}
                  >
                    <Heart
                      size={13}
                      fill={inWishlist ? '#f54f9a' : 'none'}
                      stroke={inWishlist ? '#f54f9a' : '#1a1a2e'}
                    />
                  </button>
                </div>

                {/* ── Info zone ── */}
                <div className="flex flex-col flex-grow p-4 pb-5">

                  {/* Brand */}
                  {product.brand && (
                    <p
                      className="text-[9.5px] font-semibold tracking-[0.26em] uppercase mb-1.5 transition-colors duration-300"
                      style={{ fontFamily: "'Jost', sans-serif", color: col }}
                    >
                      {product.brand}
                    </p>
                  )}

                  {/* Name */}
                  <p
                    className="line-clamp-2 leading-snug mb-1 transition-colors duration-300"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '16px',
                      fontWeight: 400,
                      color: isHovered ? '#1a1a2e' : '#3d3530',
                    }}
                  >
                    {product.name}
                  </p>

                  {/* Description */}
                  {product.description && (
                    <p
                      className="text-[11px] font-light leading-relaxed line-clamp-2 mb-3 transition-opacity duration-300"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        color: 'rgba(0, 0, 0, 1)',
                        opacity: isHovered ? 0.7 : 0.5,
                      }}
                    >
                      {product.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-auto mb-4">
                    <span
                      className="font-semibold text-[#1a1a2e]"
                      style={{ fontFamily: "'Jost', sans-serif", fontSize: '16px' }}
                    >
                      {price}{' '}
                      <span className="text-[10px] font-normal text-[#1a1a2e]/35">د.م</span>
                    </span>
                    {hasDiscount(product) && (
                      <span
                        className="text-[11px] font-light line-through"
                        style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.3)' }}
                      >
                        {oldPrice} د.م
                      </span>
                    )}
                  </div>

                  {/* Cart button */}
                  <button
                    onClick={e => handleAddToCart(product, e)}
                    disabled={outOfStock || inCart}
                    className="w-full flex items-center justify-center gap-2 py-[11px] text-[10px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      background: inCart
                        ? `rgba(${rgb},0.1)`
                        : isHovered && !outOfStock
                        ? `linear-gradient(135deg, ${col}, ${index % 2 === 0 ? '#d4326e' : '#2aabb0'})`
                        : 'rgba(26,26,46,0.04)',
                      border: `1px solid ${
                        inCart
                          ? `rgba(${rgb},0.4)`
                          : isHovered && !outOfStock
                          ? 'transparent'
                          : 'rgba(26,26,46,0.1)'
                      }`,
                      color: inCart
                        ? col
                        : isHovered && !outOfStock
                        ? '#fff'
                        : outOfStock
                        ? 'rgba(26,26,46,0.22)'
                        : '#1a1a2e',
                      boxShadow:
                        isHovered && !outOfStock && !inCart
                          ? `0 8px 24px rgba(${rgb},0.28)`
                          : 'none',
                      opacity: outOfStock ? 0.45 : 1,
                    }}
                  >
                    {inCart ? (
                      <>
                        <Sparkles size={12} style={{ color: col }} />
                        Ajouté !
                      </>
                    ) : outOfStock ? (
                      'Indisponible'
                    ) : (
                      <>
                        <ShoppingCart size={12} />
                        Ajouter au panier
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default ProductGrid;