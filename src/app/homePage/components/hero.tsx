"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  // Parallax on scroll
  useEffect(() => {
    const bg = document.getElementById("hero-bg");
    const handleScroll = () => {
      if (bg) {
        bg.style.transform = `scale(1.08) translateY(${window.scrollY * 0.18}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="hero-section" ref={heroRef}>

        {/* Background */}
        <div id="hero-bg" className="hero-bg-img" />
        <div className="hero-overlay" />
        <div className="hero-glow-teal" />
        <div className="hero-glow-pink" />
        <div className="hero-slice" />
        <div className="hero-grain" />

        {/* Corner accents */}
        <div className="corner-tl" />
        <div className="corner-br" />

        {/* Grid */}
        <div className="hero-inner">

          {/* ── LEFT ── */}
          <div className="hero-left">

            {/* Live promo pill */}
            <div className="promo-pill">
              <div className="promo-dot" />
              <span className="promo-text">Offre spéciale · <strong>Jusqu&apos;à −30%</strong> sur la beauté</span>
            </div>

            {/* Eyebrow */}
            <div className="hero-eyebrow">
              <div className="eyebrow-line-pink" />
              <span className="eyebrow-text">Nouvelle Collection 2025</span>
              <div className="eyebrow-line-teal" />
            </div>

            {/* Title */}
            <h1 className="hero-title">
              Révélez votre<br />
              <span className="line-italic">beauté naturelle</span>
            </h1>

            {/* Desc */}
            <p className="hero-desc">
              Découvrez notre sélection exclusive de soins premium, cosmétiques et produits de parapharmacie — livrés en 24h partout au Maroc.
            </p>

            {/* CTAs */}
            <div className="hero-ctas">
              <Link href="/products" className="btn-primary">
                <span>Découvrir la boutique</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link href="/products" className="btn-ghost">
                Voir les promotions
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-num">5K<span className="unit">+</span></span>
                <span className="stat-label">Produits</span>
              </div>
              <div className="stat-sep" />
              <div className="stat">
                <span className="stat-num">50K<span className="unit">+</span></span>
                <span className="stat-label">Clients satisfaits</span>
              </div>
              <div className="stat-sep" />
              <div className="stat">
                <span className="stat-num">24<span className="unit">h</span></span>
                <span className="stat-label">Livraison express</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: trust cards ── */}
          <div className="hero-right">

            <div className="trust-card pink">
              <div className="trust-icon pink">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f54f9a" strokeWidth="1.8">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <div className="trust-title">Produits 100% Authentiques</div>
                <div className="trust-sub">Certifiés & garantis d&apos;origine</div>
              </div>
            </div>

            <div className="trust-card teal">
              <div className="trust-icon teal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#41cdcf" stroke="#41cdcf" strokeWidth="1.4">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <div className="trust-title">4.9 / 5 · Avis clients</div>
                <div className="trust-sub">+12 000 avis vérifiés</div>
              </div>
            </div>

            <div className="trust-card pink">
              <div className="trust-icon pink">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f54f9a" strokeWidth="1.8">
                  <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div>
                <div className="trust-title">Livraison 24h à Casablanca</div>
                <div className="trust-sub">Partout au Maroc en 48h</div>
              </div>
            </div>

            <div className="trust-card teal">
              <div className="trust-icon teal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#41cdcf" strokeWidth="1.8">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div>
                <div className="trust-title">Meilleur prix garanti</div>
                <div className="trust-sub">Remboursé si moins cher ailleurs</div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll cue */}
        <div className="scroll-cue">
          <span className="scroll-cue-text">Défiler</span>
          <div className="scroll-cue-line" />
        </div>
      </section>

      {/* ── Trust strip ── */}
      <div className="trust-strip">
        <div className="trust-strip-inner">
          <div className="ts-item">
            <svg className="ts-icon-teal" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span>Livraison <strong>24h</strong> Casablanca</span>
          </div>
          <div className="ts-item">
            <svg className="ts-icon-pink" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Produits <strong>100% authentiques</strong></span>
          </div>
          <div className="ts-item">
            <svg className="ts-icon-teal" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
            <span>Prix <strong>le plus bas garanti</strong></span>
          </div>
          <div className="ts-item">
            <svg className="ts-icon-pink" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span>Service client <strong>7j/7</strong></span>
          </div>
        </div>
      </div>
      {/* <div className="relative w-full h-[150px]">
        <Image src="/img/BANNER RAMADAN JAMALI.webp" alt="logo" fill className="object-cover" />
      </div> */}
    </>
  );
}