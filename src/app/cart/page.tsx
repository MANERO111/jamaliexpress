'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Minus, Trash2, ArrowLeft, CreditCard,
  ShoppingBag, ArrowRight, X, Lock
} from 'lucide-react';
import { getProductImageUrl } from '@/utils/imageHelper';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/login';

const CartPage: React.FC = () => {
  const { cartItems, cartCount, isLoading, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { isAuthenticated, login } = useAuth();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: number) => {
    setRemovingId(productId);
    await removeFromCart(productId);
    setRemovingId(null);
  };

  const handleClearCart = async () => {
    await clearCart();
    setShowClearConfirm(false);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) setShowLoginModal(true);
    else window.location.href = '/checkout';
  };

  const handleLoginSuccess = async (userData: any) => {
    await login(userData);
    setShowLoginModal(false);
    window.location.href = '/checkout';
  };

  const subtotal = getCartTotal();
  const shippingCost = 20;
  const freeShippingThreshold = 200;
  const shippingFree = subtotal >= freeShippingThreshold;
  const shipping = shippingFree ? 0 : shippingCost;
  const tax = subtotal * 0.20;
  const total = subtotal + shipping + tax;
  const progressPct = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] pt-36 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#41cdcf]/[0.04] blur-[80px]" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#f54f9a]/[0.04] blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 animate-pulse"
                  style={{ border: '1px solid rgba(26,26,46,0.07)' }}>
                  <div className="flex gap-5">
                    <div className="w-24 h-24 bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-8 bg-gray-100 rounded w-28" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-5">
              <div className="bg-white p-6 animate-pulse" style={{ border: '1px solid rgba(26,26,46,0.07)' }}>
                <div className="h-5 bg-gray-100 rounded w-1/2 mb-6" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between mb-4">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty cart ── */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center pt-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#41cdcf]/[0.05] blur-[80px]" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#f54f9a]/[0.05] blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'radial-gradient(rgba(26,26,46,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 flex items-center justify-center mx-auto mb-8"
            style={{ border: '1px solid rgba(65,205,207,0.28)', background: 'rgba(65,205,207,0.05)' }}>
            <ShoppingBag size={30} style={{ color: 'rgba(26,26,46,0.2)' }} />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-7 h-px bg-gradient-to-r from-transparent to-[#f54f9a]" />
            <span className="text-[9.5px] font-semibold tracking-[0.4em] uppercase text-[#41cdcf]"
              style={{ fontFamily: "'Jost', sans-serif" }}>Panier vide</span>
            <div className="w-7 h-px bg-gradient-to-l from-transparent to-[#41cdcf]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-[#1a1a2e] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Votre panier est{' '}
            <em className="not-italic" style={{
              background: 'linear-gradient(110deg, #f54f9a, #41cdcf)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>vide</em>
          </h2>
          <p className="text-[12.5px] font-light text-[#1a1a2e]/40 mb-8 leading-[1.8]"
            style={{ fontFamily: "'Jost', sans-serif" }}>
            Découvrez notre collection et ajoutez vos produits favoris.
          </p>
          <Link href="/"
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
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#41cdcf]/[0.04] blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-[#f54f9a]/[0.04] blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'radial-gradient(rgba(26,26,46,0.8) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 lg:px-10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/"
            className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] uppercase transition-all duration-300 group"
            style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.4)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f54f9a')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,26,46,0.4)')}>
            <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Continuer mes achats
          </Link>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#f54f9a]" />
              <span className="text-[9px] font-semibold tracking-[0.4em] uppercase text-[#1a1a2e]/35"
                style={{ fontFamily: "'Jost', sans-serif" }}>Shopping</span>
              <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#41cdcf]" />
            </div>
            <h1 className="text-[28px] md:text-[36px] font-light text-[#1a1a2e]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Mon{' '}
              <em className="not-italic" style={{
                background: 'linear-gradient(110deg, #f54f9a, #41cdcf)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>Panier</em>
            </h1>
          </div>

          {/* Clear button */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.14em] uppercase transition-all duration-300"
            style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f54f9a')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,26,46,0.3)')}>
            <Trash2 size={13} /> Vider
          </button>
        </div>

        {/* ── Count label ── */}
        <div className="flex items-center gap-3 mb-7">
          <div className="w-9 h-px bg-gradient-to-r from-[#f54f9a] to-transparent" />
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#1a1a2e]/40"
            style={{ fontFamily: "'Jost', sans-serif" }}>
            {cartCount} article{cartCount !== 1 ? 's' : ''} dans votre panier
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Cart items ── */}
          <div className="lg:col-span-7 space-y-4">
            {cartItems.map((item: any, index: number) => {
              const isHovered = hoveredId === item.id;
              const isRemoving = removingId === item.id;
              const isPink = index % 2 === 0;
              const col = isPink ? '#f54f9a' : '#41cdcf';
              const rgb = isPink ? '245,79,154' : '65,205,207';
              const hasDiscount = item.discounted_price && item.discounted_price > 0 && item.original_price > item.discounted_price;

              return (
                <div key={item.id}
                  className="relative overflow-hidden bg-white transition-all duration-500"
                  style={{
                    border: `1px solid ${isHovered ? `rgba(${rgb},0.28)` : 'rgba(26,26,46,0.08)'}`,
                    boxShadow: isHovered ? `0 16px 48px rgba(${rgb},0.1), 0 4px 12px rgba(0,0,0,0.04)` : '0 2px 8px rgba(0,0,0,0.03)',
                    opacity: isRemoving ? 0.4 : 1,
                    transform: isRemoving ? 'translateX(20px)' : 'translateX(0)',
                  }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] transition-opacity duration-400"
                    style={{ background: `linear-gradient(90deg, ${col}, transparent)`, opacity: isHovered ? 1 : 0 }} />

                  {/* Left colour bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] transition-opacity duration-400"
                    style={{ background: `linear-gradient(to bottom, ${col}, transparent)`, opacity: isHovered ? 1 : 0 }} />

                  <div className="flex gap-5 p-5 md:p-6">
                    {/* Image */}
                    <div className="relative flex-shrink-0 w-[88px] h-[88px] overflow-hidden bg-[#f7f5f2]"
                      style={{ border: `1px solid ${isHovered ? `rgba(${rgb},0.2)` : 'rgba(26,26,46,0.06)'}` }}>
                      <img src={getProductImageUrl(item.image_url)} alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-600"
                        style={{ transform: isHovered ? 'scale(1.07)' : 'scale(1)' }} />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          {item.brand && (
                            <p className="text-[9.5px] font-semibold tracking-[0.24em] uppercase mb-1"
                              style={{ fontFamily: "'Jost', sans-serif", color: col }}>
                              {item.brand}
                            </p>
                          )}
                          <h3 className="text-[16px] font-light text-[#1a1a2e] leading-snug truncate"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {item.name}
                          </h3>
                          <p className="text-[10.5px] font-light mt-1"
                            style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.35)' }}>
                            Stock : {item.stock_quantity}
                          </p>
                        </div>
                        <button onClick={() => handleRemoveItem(item.id)}
                          className="w-7 h-7 flex-shrink-0 flex items-center justify-center transition-all duration-300"
                          style={{ border: '1px solid rgba(26,26,46,0.1)', color: 'rgba(26,26,46,0.3)' }}
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

                      <div className="flex items-center justify-between mt-4">
                        {/* Price */}
                        <div>
                          <span className="text-[17px] font-semibold text-[#1a1a2e]"
                            style={{ fontFamily: "'Jost', sans-serif" }}>
                            {(item.price * item.quantity).toFixed(2)}{' '}
                            <span className="text-[10px] font-normal text-[#1a1a2e]/35">د.م</span>
                          </span>
                          {hasDiscount && (
                            <span className="ml-2 text-[11px] font-light line-through"
                              style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.28)' }}>
                              {(item.original_price * item.quantity).toFixed(2)}
                            </span>
                          )}
                          <p className="text-[10px] font-light mt-0.5"
                            style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.3)' }}>
                            {item.price.toFixed(2)} د.م / unité
                          </p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center"
                          style={{ border: `1px solid ${isHovered ? `rgba(${rgb},0.25)` : 'rgba(26,26,46,0.1)'}` }}>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                            style={{ color: 'rgba(26,26,46,0.5)', borderRight: '1px solid rgba(26,26,46,0.08)' }}
                            onMouseEnter={e => item.quantity > 1 && ((e.currentTarget as HTMLElement).style.color = col)}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(26,26,46,0.5)')}>
                            <Minus size={12} />
                          </button>
                          <span className="w-10 text-center text-[13px] font-semibold text-[#1a1a2e]"
                            style={{ fontFamily: "'Jost', sans-serif" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock_quantity}
                            className="w-8 h-8 flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                            style={{ color: 'rgba(26,26,46,0.5)', borderLeft: '1px solid rgba(26,26,46,0.08)' }}
                            onMouseEnter={e => item.quantity < item.stock_quantity && ((e.currentTarget as HTMLElement).style.color = col)}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(26,26,46,0.5)')}>
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Order summary ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <div className="relative overflow-hidden bg-white"
                style={{ border: '1px solid rgba(26,26,46,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
                {/* Gradient top border */}
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, #f54f9a, #41cdcf)' }} />

                <div className="p-6 md:p-7">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6 pb-5"
                    style={{ borderBottom: '1px solid rgba(26,26,46,0.06)' }}>
                    <div className="w-6 h-px bg-[#f54f9a]" />
                    <h3 className="text-[16px] font-light text-[#1a1a2e]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Récapitulatif
                    </h3>
                    <span className="ml-auto text-[9.5px] font-semibold tracking-[0.14em] uppercase px-2 py-0.5"
                      style={{ fontFamily: "'Jost', sans-serif", background: 'rgba(245,79,154,0.08)', border: '1px solid rgba(245,79,154,0.2)', color: '#f54f9a' }}>
                      {cartCount} article{cartCount > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Free shipping progress */}
                  {!shippingFree && (
                    <div className="mb-6 p-4 relative overflow-hidden"
                      style={{ background: 'rgba(65,205,207,0.04)', border: '1px solid rgba(65,205,207,0.15)' }}>
                      <div className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: 'linear-gradient(90deg, #41cdcf, transparent)' }} />
                      <p className="text-[11px] font-light mb-3 text-center"
                        style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.55)' }}>
                        Encore{' '}
                        <strong style={{ color: '#41cdcf' }}>
                          {(freeShippingThreshold - subtotal).toFixed(2)} د.م
                        </strong>
                        {' '}pour la livraison gratuite
                      </p>
                      <div className="relative h-1 overflow-hidden"
                        style={{ background: 'rgba(26,26,46,0.08)' }}>
                        <div className="absolute left-0 top-0 h-full transition-all duration-500"
                          style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #41cdcf, #f54f9a)' }} />
                      </div>
                    </div>
                  )}

                  {shippingFree && (
                    <div className="mb-6 p-3 text-center relative overflow-hidden"
                      style={{ background: 'rgba(65,205,207,0.06)', border: '1px solid rgba(65,205,207,0.2)' }}>
                      <div className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: 'linear-gradient(90deg, #41cdcf, transparent)' }} />
                      <p className="text-[11px] font-medium"
                        style={{ fontFamily: "'Jost', sans-serif", color: '#41cdcf' }}>
                        🎉 Livraison gratuite débloquée !
                      </p>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="space-y-3 mb-6">
                    {[
                      { label: `Sous-total (${cartCount} articles)`, value: `${subtotal.toFixed(2)} د.م` },
                      { label: 'Livraison', value: shipping === 0 ? 'Gratuite 🎉' : `${shipping.toFixed(2)} د.م`, highlight: shipping === 0 },
                      { label: 'TVA (20%)', value: `${tax.toFixed(2)} د.م` },
                    ].map(({ label, value, highlight }) => (
                      <div key={label} className="flex justify-between items-baseline">
                        <span className="text-[11.5px] font-light text-[#1a1a2e]/42"
                          style={{ fontFamily: "'Jost', sans-serif" }}>{label}</span>
                        <span className="text-[12px] font-medium transition-colors duration-300"
                          style={{ fontFamily: "'Jost', sans-serif", color: highlight ? '#41cdcf' : '#1a1a2e' }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-baseline py-5 mb-6"
                    style={{ borderTop: '1px solid rgba(26,26,46,0.06)', borderBottom: '1px solid rgba(26,26,46,0.06)' }}>
                    <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#1a1a2e]/50"
                      style={{ fontFamily: "'Jost', sans-serif" }}>Total</span>
                    <span className="text-[26px] font-light text-[#1a1a2e]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {total.toFixed(2)}{' '}
                      <span style={{ fontSize: '15px' }}>د.م</span>
                    </span>
                  </div>

                  {/* CTA */}
                  <button onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-2 py-4 text-[11px] font-semibold tracking-[0.22em] uppercase text-white transition-all duration-300 group"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      background: 'linear-gradient(135deg, #f54f9a, #d4326e)',
                      border: 'none', cursor: 'pointer',
                      boxShadow: '0 10px 28px rgba(245,79,154,0.3)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #41cdcf, #2aabb0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(65,205,207,0.3)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #f54f9a, #d4326e)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(245,79,154,0.3)';
                    }}>
                    {isAuthenticated ? (
                      <><CreditCard size={14} /> Procéder au paiement</>
                    ) : (
                      <><Lock size={14} /> Connexion & Paiement</>
                    )}
                    <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  {/* Security */}
                  <div className="flex items-center justify-center gap-6 mt-5">
                    {[
                      { icon: Lock, label: '100% Sécurisé' },
                      { icon: CreditCard, label: 'Paiement CMI' },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <Icon size={11} style={{ color: 'rgba(26,26,46,0.25)' }} />
                        <span className="text-[9.5px] font-light tracking-[0.08em] text-[#1a1a2e]/30"
                          style={{ fontFamily: "'Jost', sans-serif" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Clear cart modal ── */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-[#1a1a2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="relative bg-white max-w-sm w-full overflow-hidden"
            style={{ border: '1px solid rgba(26,26,46,0.1)', boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }}>
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: 'linear-gradient(90deg, #f54f9a, #41cdcf)' }} />
            <div className="p-7">
              <div className="w-12 h-12 flex items-center justify-center mb-5"
                style={{ background: 'rgba(245,79,154,0.08)', border: '1px solid rgba(245,79,154,0.25)' }}>
                <Trash2 size={20} style={{ color: '#f54f9a' }} />
              </div>
              <h3 className="text-[20px] font-light text-[#1a1a2e] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Vider le panier ?
              </h3>
              <p className="text-[12px] font-light text-[#1a1a2e]/45 mb-7 leading-relaxed"
                style={{ fontFamily: "'Jost', sans-serif" }}>
                Tous les articles seront supprimés. Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-3 text-[10px] font-semibold tracking-[0.18em] uppercase transition-all duration-300"
                  style={{
                    fontFamily: "'Jost', sans-serif", background: 'none',
                    border: '1px solid rgba(26,26,46,0.12)', color: 'rgba(26,26,46,0.5)', cursor: 'pointer',
                  }}>
                  Annuler
                </button>
                <button onClick={handleClearCart}
                  className="flex-1 px-4 py-3 text-[10px] font-semibold tracking-[0.18em] uppercase text-white transition-all duration-300"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    background: 'linear-gradient(135deg, #f54f9a, #d4326e)',
                    border: 'none', cursor: 'pointer',
                    boxShadow: '0 6px 16px rgba(245,79,154,0.28)',
                  }}>
                  Vider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  );
};

export default CartPage;