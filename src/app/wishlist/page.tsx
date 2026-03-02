'use client';
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Sparkles, ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductImageUrl } from '@/utils/imageHelper';
import { useWishlist } from '@/hooks/useWishlist';
import { useProducts } from '@/hooks/useProducts';

const WishlistPage = () => {
  const { addToCart, isLoading: cartLoading } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { products, loading: productsLoading } = useProducts();

  const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>({});
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const router = useRouter();

  const wishlistItems = products.filter(p => wishlist.includes(p.id));

  const handleAddToCart = async (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addingToCart[product.id]) return;
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    try {
      await addToCart(product, 1);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setAddingToCart(prev => ({ ...prev, [product.id]: false })), 1200);
    }
  };

  const handleRemove = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRemovingId(productId);
    setTimeout(() => {
      toggleWishlist(productId);
      setRemovingId(null);
    }, 350);
  };

  const handleClearAll = () => {
    wishlist.forEach(id => toggleWishlist(id));
    setShowClearConfirm(false);
  };

  const accent = (i: number) => (i % 2 === 0 ? '#f54f9a' : '#41cdcf');
  const accentRgb = (i: number) => (i % 2 === 0 ? '245,79,154' : '65,205,207');

  /* ── Loading ── */
  if (productsLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white animate-pulse" style={{ border: '1px solid rgba(26,26,46,0.07)' }}>
                <div className="aspect-[3/4] bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-10 bg-gray-100 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty ── */
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center pt-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#f54f9a]/[0.05] blur-[80px]" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#41cdcf]/[0.05] blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'radial-gradient(rgba(26,26,46,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full opacity-10 animate-ping"
              style={{ background: 'linear-gradient(135deg, #f54f9a, #41cdcf)' }} />
            <div className="relative w-20 h-20 flex items-center justify-center"
              style={{ border: '1px solid rgba(245,79,154,0.25)', background: 'rgba(245,79,154,0.05)' }}>
              <Heart size={32} style={{ color: 'rgba(26,26,46,0.18)' }} />
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#f54f9a]" />
            <span className="text-[9.5px] font-semibold tracking-[0.4em] uppercase text-[#41cdcf]"
              style={{ fontFamily: "'Jost', sans-serif" }}>Liste de souhaits</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#41cdcf]" />
          </div>

          <h2 className="text-3xl md:text-4xl font-light text-[#1a1a2e] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Votre liste est{' '}
            <em className="not-italic" style={{
              background: 'linear-gradient(110deg, #f54f9a, #41cdcf)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>vide</em>
          </h2>
          <p className="text-[12.5px] font-light text-[#1a1a2e]/40 mb-8 leading-[1.8]"
            style={{ fontFamily: "'Jost', sans-serif" }}>
            Parcourez notre collection et ajoutez vos coups de cœur pour les retrouver facilement.
          </p>
          <Link href="/products"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-[10.5px] font-semibold tracking-[0.22em] uppercase text-white transition-all duration-300"
            style={{ fontFamily: "'Jost', sans-serif", background: 'linear-gradient(135deg, #f54f9a, #d4326e)', textDecoration: 'none', boxShadow: '0 8px 24px rgba(245,79,154,0.28)' }}>
            Découvrir nos produits <ArrowRight size={13} />
          </Link>
        </div>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500;600&display=swap');`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-36 pb-24 relative overflow-hidden">

      {/* ── Atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#f54f9a]/[0.04] blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-[#41cdcf]/[0.04] blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'radial-gradient(rgba(26,26,46,0.8) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => router.back()}
            className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] uppercase transition-all duration-300 group"
            style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f54f9a')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,26,46,0.4)')}>
            <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Retour
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#f54f9a]" />
              <span className="text-[9px] font-semibold tracking-[0.4em] uppercase text-[#1a1a2e]/30"
                style={{ fontFamily: "'Jost', sans-serif" }}>Mes favoris</span>
              <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#41cdcf]" />
            </div>
            <h1 className="text-[28px] md:text-[36px] font-light text-[#1a1a2e]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Liste de{' '}
              <em className="not-italic" style={{
                background: 'linear-gradient(110deg, #f54f9a, #41cdcf)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>souhaits</em>
            </h1>
          </div>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.14em] uppercase transition-all duration-300"
            style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f54f9a')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,26,46,0.3)')}>
            <Trash2 size={13} /> Vider
          </button>
        </div>

        {/* ── Count ── */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-px bg-gradient-to-r from-[#f54f9a] to-transparent" />
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#1a1a2e]/38"
            style={{ fontFamily: "'Jost', sans-serif" }}>
            {wishlistItems.length} produit{wishlistItems.length !== 1 ? 's' : ''} sauvegardé{wishlistItems.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlistItems.map((product, index) => {
            const isHovered = hoveredId === product.id;
            const isRemoving = removingId === product.id;
            const inCart = !!addingToCart[product.id];
            const col = accent(index);
            const rgb = accentRgb(index);
            const hasDiscount = (product as any).discounted_price && (product as any).discounted_price > 0 && (product as any).original_price > (product as any).discounted_price;
            const price = hasDiscount ? (product as any).discounted_price : (product as any).original_price || (product as any).price;
            const oldPrice = (product as any).original_price;

            return (
              <Link
                key={product.id}
                href={`/products/${(product as any).slug || product.id}`}
                className="relative block select-none"
                style={{ textDecoration: 'none' }}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                draggable={false}
              >
                {/* Ghost number */}
                <span
                  className="absolute -top-5 -left-1 text-[80px] font-bold leading-none pointer-events-none select-none z-0 transition-opacity duration-500"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: `rgba(${rgb},${isHovered ? 0.08 : 0.03})`,
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Card */}
                <div
                  className="relative z-10 flex flex-col overflow-hidden transition-all duration-500 bg-white"
                  style={{
                    border: `1px solid ${isHovered ? `rgba(${rgb},0.3)` : 'rgba(26,26,46,0.08)'}`,
                    boxShadow: isHovered
                      ? `0 24px 56px rgba(${rgb},0.13), 0 4px 16px rgba(0,0,0,0.05)`
                      : '0 2px 8px rgba(0,0,0,0.04)',
                    transform: isRemoving
                      ? 'scale(0.95) translateY(8px)'
                      : isHovered
                      ? 'translateY(-6px)'
                      : 'translateY(0)',
                    opacity: isRemoving ? 0 : 1,
                  }}
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 z-20 transition-opacity duration-400"
                    style={{
                      height: '2px',
                      background: `linear-gradient(90deg, ${col}, transparent)`,
                      opacity: isHovered ? 1 : 0,
                    }} />

                  {/* Image */}
                  <div className="relative overflow-hidden bg-[#f7f5f2]" style={{ aspectRatio: '3/4' }}>
                    {product.image_url ? (
                      <img
                        src={getProductImageUrl(product.image_url)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700"
                        style={{ transform: isHovered ? 'scale(1.07)' : 'scale(1)' }}
                        draggable={false}
                        onError={e => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart size={32} style={{ color: 'rgba(26,26,46,0.12)' }} />
                      </div>
                    )}

                    {/* Scrim */}
                    <div className="absolute inset-0 transition-opacity duration-400 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, rgba(26,26,46,0.4) 0%, transparent 55%)', opacity: isHovered ? 1 : 0 }} />

                    {/* Heart / remove button */}
                    <button
                      onClick={e => handleRemove(product.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center z-30 transition-all duration-300"
                      style={{
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(245,79,154,0.35)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        opacity: isHovered ? 1 : 0.7,
                        transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(-3px) scale(0.9)',
                      }}>
                      <Heart size={13} fill="#f54f9a" stroke="#f54f9a" />
                    </button>

                    {/* Out of stock */}
                    {(product as any).stock_quantity === 0 && (
                      <div className="absolute top-3 left-3 px-2 py-1 z-30 text-[9px] font-semibold tracking-[0.15em] uppercase"
                        style={{ background: 'rgba(245,79,154,0.1)', border: '1px solid rgba(245,79,154,0.35)', color: '#f54f9a', fontFamily: "'Jost', sans-serif" }}>
                        Rupture
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 pb-5 flex flex-col flex-grow">
                    {(product as any).brand && (
                      <p className="text-[9.5px] font-semibold tracking-[0.26em] uppercase mb-1.5 transition-colors duration-300"
                        style={{ fontFamily: "'Jost', sans-serif", color: col }}>
                        {(product as any).brand}
                      </p>
                    )}

                    <p className="line-clamp-2 leading-snug mb-3 flex-grow transition-colors duration-300"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '16px',
                        fontWeight: 400,
                        color: isHovered ? '#1a1a2e' : '#3d3530',
                      }}>
                      {product.name}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-semibold text-[#1a1a2e]"
                        style={{ fontFamily: "'Jost', sans-serif", fontSize: '15px' }}>
                        {parseFloat(price?.toString() || '0').toFixed(2)}{' '}
                        <span className="text-[10px] font-normal text-[#1a1a2e]/35">د.م</span>
                      </span>
                      {hasDiscount && (
                        <span className="text-[11px] font-light line-through"
                          style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.28)' }}>
                          {parseFloat(oldPrice?.toString() || '0').toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={e => handleAddToCart(product, e)}
                        disabled={(product as any).stock_quantity === 0 || inCart}
                        className="flex-1 flex items-center justify-center gap-2 py-[10px] text-[10px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 disabled:cursor-not-allowed"
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          background: inCart
                            ? `rgba(${rgb},0.1)`
                            : isHovered && (product as any).stock_quantity !== 0
                            ? `linear-gradient(135deg, ${col}, ${index % 2 === 0 ? '#d4326e' : '#2aabb0'})`
                            : 'rgba(26,26,46,0.04)',
                          border: `1px solid ${inCart ? `rgba(${rgb},0.4)` : isHovered && (product as any).stock_quantity !== 0 ? 'transparent' : 'rgba(26,26,46,0.1)'}`,
                          color: inCart ? col : isHovered && (product as any).stock_quantity !== 0 ? '#fff' : (product as any).stock_quantity === 0 ? 'rgba(26,26,46,0.22)' : '#1a1a2e',
                          boxShadow: isHovered && (product as any).stock_quantity !== 0 && !inCart ? `0 6px 20px rgba(${rgb},0.28)` : 'none',
                          opacity: (product as any).stock_quantity === 0 ? 0.45 : 1,
                        }}>
                        {inCart ? (
                          <><Sparkles size={11} style={{ color: col }} /> Ajouté !</>
                        ) : (product as any).stock_quantity === 0 ? (
                          'Indisponible'
                        ) : (
                          <><ShoppingCart size={11} /> Ajouter</>
                        )}
                      </button>

                      <button
                        onClick={e => handleRemove(product.id, e)}
                        className="w-9 h-[38px] flex items-center justify-center transition-all duration-300 flex-shrink-0"
                        style={{
                          border: '1px solid rgba(26,26,46,0.1)',
                          color: 'rgba(26,26,46,0.3)',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#f54f9a';
                          (e.currentTarget as HTMLElement).style.color = '#f54f9a';
                          (e.currentTarget as HTMLElement).style.background = 'rgba(245,79,154,0.06)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,26,46,0.1)';
                          (e.currentTarget as HTMLElement).style.color = 'rgba(26,26,46,0.3)';
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}>
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Clear confirm modal ── */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-[#1a1a2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="relative bg-white max-w-sm w-full overflow-hidden"
            style={{ border: '1px solid rgba(26,26,46,0.1)', boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }}>
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: 'linear-gradient(90deg, #f54f9a, #41cdcf)' }} />
            <div className="p-7">
              <div className="w-12 h-12 flex items-center justify-center mb-5"
                style={{ background: 'rgba(245,79,154,0.08)', border: '1px solid rgba(245,79,154,0.25)' }}>
                <Heart size={20} fill="rgba(245,79,154,0.3)" style={{ color: '#f54f9a' }} />
              </div>
              <h3 className="text-[20px] font-light text-[#1a1a2e] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Vider la liste ?
              </h3>
              <p className="text-[12px] font-light text-[#1a1a2e]/45 mb-7 leading-relaxed"
                style={{ fontFamily: "'Jost', sans-serif" }}>
                Tous vos produits sauvegardés seront retirés de la liste. Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-3 text-[10px] font-semibold tracking-[0.18em] uppercase transition-all duration-300"
                  style={{ fontFamily: "'Jost', sans-serif", background: 'none', border: '1px solid rgba(26,26,46,0.12)', color: 'rgba(26,26,46,0.5)', cursor: 'pointer' }}>
                  Annuler
                </button>
                <button onClick={handleClearAll}
                  className="flex-1 px-4 py-3 text-[10px] font-semibold tracking-[0.18em] uppercase text-white transition-all duration-300"
                  style={{ fontFamily: "'Jost', sans-serif", background: 'linear-gradient(135deg, #f54f9a, #d4326e)', border: 'none', cursor: 'pointer', boxShadow: '0 6px 16px rgba(245,79,154,0.28)' }}>
                  Vider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  );
};

export default WishlistPage;