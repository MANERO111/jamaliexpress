'use client';
import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function CheckoutFailPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6 pt-32 pb-20">
      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#f54f9a]/[0.05] blur-[80px]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#41cdcf]/[0.05] blur-[80px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Icon */}
        <div className="relative w-24 h-24 mx-auto mb-10">
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-10"
            style={{ background: 'linear-gradient(135deg, #f54f9a, #d4326e)' }}
          />
          <div
            className="relative w-24 h-24 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #f54f9a, #d4326e)',
              boxShadow: '0 16px 48px rgba(245,79,154,0.35)',
            }}
          >
            <XCircle size={40} color="#fff" />
          </div>
        </div>

        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#f54f9a]" />
          <span
            className="text-[9.5px] font-semibold tracking-[0.4em] uppercase text-[#f54f9a]"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Paiement refusé
          </span>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#f54f9a]" />
        </div>

        <h2
          className="text-[38px] md:text-[48px] font-light text-[#1a1a2e] mb-3 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Paiement{' '}
          <em
            className="not-italic"
            style={{
              background: 'linear-gradient(110deg, #f54f9a, #d4326e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            échoué
          </em>
        </h2>

        <p
          className="text-[13px] font-light text-[#1a1a2e]/42 mb-10 leading-[1.8]"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          Votre paiement par carte n&apos;a pas pu être traité.
          <br />
          Veuillez réessayer ou choisir un autre mode de paiement.
        </p>

        {/* Info box */}
        <div
          className="mb-8 p-4 relative overflow-hidden text-left"
          style={{
            background: 'rgba(245,79,154,0.04)',
            border: '1px solid rgba(245,79,154,0.2)',
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, #f54f9a, transparent)' }}
          />
          <p
            className="text-[11.5px] font-light leading-relaxed"
            style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.6)' }}
          >
            Causes possibles : fonds insuffisants, carte expirée, ou authentification 3D Secure échouée.
            Votre compte n&apos;a <strong style={{ color: '#f54f9a' }}>pas été débité</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 px-7 py-3 text-[10.5px] font-semibold tracking-[0.22em] uppercase text-white transition-all duration-300"
            style={{
              fontFamily: "'Jost', sans-serif",
              background: 'linear-gradient(135deg, #f54f9a, #d4326e)',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(245,79,154,0.28)',
            }}
          >
            <RefreshCw size={13} /> Réessayer
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 px-7 py-3 text-[10.5px] font-semibold tracking-[0.22em] uppercase transition-all duration-300"
            style={{
              fontFamily: "'Jost', sans-serif",
              background: 'transparent',
              border: '1px solid rgba(26,26,46,0.15)',
              color: 'rgba(26,26,46,0.55)',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={13} /> Retour au panier
          </Link>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  );
}
