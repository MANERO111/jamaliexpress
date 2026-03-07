'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6 pt-32 pb-20">
      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#41cdcf]/[0.05] blur-[80px]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#f54f9a]/[0.05] blur-[80px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Animated check */}
        <div className="relative w-24 h-24 mx-auto mb-10">
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-10"
            style={{ background: 'linear-gradient(135deg, #41cdcf, #f54f9a)' }}
          />
          <div
            className="relative w-24 h-24 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #41cdcf, #2aabb0)',
              boxShadow: '0 16px 48px rgba(65,205,207,0.35)',
            }}
          >
            <CheckCircle size={40} color="#fff" />
          </div>
        </div>

        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#f54f9a]" />
          <span
            className="text-[9.5px] font-semibold tracking-[0.4em] uppercase text-[#41cdcf]"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Paiement confirmé
          </span>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#41cdcf]" />
        </div>

        <h2
          className="text-[38px] md:text-[48px] font-light text-[#1a1a2e] mb-3 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Merci pour votre{' '}
          <em
            className="not-italic"
            style={{
              background: 'linear-gradient(110deg, #f54f9a, #41cdcf)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            commande !
          </em>
        </h2>

        <p
          className="text-[13px] font-light text-[#1a1a2e]/42 mb-10 leading-[1.8]"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          Votre paiement par carte a été traité avec succès.
          <br />
          Vous recevrez un email de confirmation sous peu.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-7 py-3 text-[10.5px] font-semibold tracking-[0.22em] uppercase text-white transition-all duration-300"
            style={{
              fontFamily: "'Jost', sans-serif",
              background: 'linear-gradient(135deg, #f54f9a, #d4326e)',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(245,79,154,0.28)',
            }}
          >
            Continuer mes achats <ArrowRight size={13} />
          </Link>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-7 py-3 text-[10.5px] font-semibold tracking-[0.22em] uppercase transition-all duration-300"
            style={{
              fontFamily: "'Jost', sans-serif",
              background: 'transparent',
              border: '1px solid rgba(65,205,207,0.4)',
              color: '#41cdcf',
              textDecoration: 'none',
            }}
          >
            <ShoppingBag size={13} /> Mes commandes
          </Link>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  );
}
