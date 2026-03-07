'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { label: 'Visage',     href: '/products?category_id=1' },
  { label: 'Corps',      href: '/products?category_id=2' },
  { label: 'Capillaire', href: '/products?category_id=3' },
  { label: 'Hommes',     href: '/products?category_id=4' },
  { label: 'Hygiène',    href: '/products?category_id=5' },
  { label: 'Solaires',   href: '/products?category_id=6' },
];

const info = [
  { label: 'À Propos',                    href: '/about' },
  { label: 'Contactez-nous',              href: '/contact' },
  { label: 'Livraison & Retour',          href: '/livraison' },
  { label: 'Conditions Générales',        href: '/cgv' },
  { label: 'Politique de Confidentialité', href: '/confidentialite' },
];

const socials = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
  },
];

/* ── Animated link item ── */
const FooterLink = ({ label, href }: { label: string; href: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-2 group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ textDecoration: 'none' }}
      >
        <span
          className="inline-block transition-all duration-300"
          style={{
            color: '#fff',
            width: hovered ? '20px' : '8px',
            height: '1px',
            background: hovered ? '#f54f9a' : 'rgba(26,26,46,0.2)',
            flexShrink: 0,
          }}
        />
        <span
          className="text-[12px] font-light tracking-[0.06em] transition-all duration-300"
          style={{
            fontFamily: "'Jost', sans-serif",
            color: hovered ? '#fff' : '#fff',
            transform: hovered ? 'translateX(2px)' : 'translateX(0)',
            display: 'inline-block',
          }}
        >
          {label}
        </span>
      </Link>
    </li>
  );
};

/* ── Newsletter form ── */
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 1000)); // replace with real API call
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      {status === 'success' ? (
        <div
          className="flex items-center gap-3 px-4 py-3 text-[12px] font-medium tracking-[0.08em]"
          style={{
            fontFamily: "'Jost', sans-serif",
            background: 'rgba(65,205,207,0.08)',
            border: '1px solid rgba(65,205,207,0.3)',
            color: '#41cdcf',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Merci ! Vous êtes abonné(e).
        </div>
      ) : (
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse e-mail"
            required
            className="w-full text-[12px] font-light tracking-[0.04em] outline-none transition-all duration-300"
            style={{
              fontFamily: "'Jost', sans-serif",
              background: 'rgba(26,26,46,0.03)',
              border: '1px solid rgba(26,26,46,0.12)',
              borderBottom: '1.5px solid rgba(26,26,46,0.2)',
              padding: '12px 48px 12px 14px',
              color: '#1a1a2e',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#f54f9a';
              e.target.style.borderBottomColor = '#f54f9a';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(26,26,46,0.12)';
              e.target.style.borderBottomColor = 'rgba(26,26,46,0.2)';
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center transition-all duration-300"
            style={{
              background: status === 'loading'
                ? 'rgba(245,79,154,0.7)'
                : 'linear-gradient(135deg, #f54f9a, #d4326e)',
              color: '#fff',
              border: 'none',
              cursor: status === 'loading' ? 'wait' : 'pointer',
            }}
          >
            {status === 'loading' ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </button>
        </div>
      )}
    </form>
  );
};

/* ── Main Footer ── */
export default function Footer() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  /* Intersection observer for entrance animation */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <footer ref={ref} className="relative overflow-hidden bg-[#1a1a2e]">

      {/* ── Background atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* pink glow bottom-left */}
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#f54f9a]/[0.07] blur-[100px]" />
        {/* teal glow top-right */}
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-[#41cdcf]/[0.07] blur-[80px]" />
        {/* subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        {/* diagonal slice accent */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(162deg, transparent 60%, rgba(65,205,207,0.04) 60%)',
          }}
        />
      </div>

      {/* ── Top gradient border ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent, #f54f9a 35%, #41cdcf 65%, transparent)' }}
      />

      {/* ── Main grid ── */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6">

          {/* ── Col 1: Brand ── */}
          <div
            className="lg:col-span-4 transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '0ms' }}
          >
            {/* Logo */}
            <div className="mb-6">
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Image
                  src="/img/logo2.png"
                  alt="Jamali Express"
                  width={160}
                  height={50}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Description */}
            <p
              className="text-[12.5px] font-light leading-[1.9] tracking-[0.03em] mb-8 max-w-[280px]"
              style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(255,255,255,0.42)' }}
            >
              Votre destination beauté de confiance au Maroc. Des produits authentiques, livrés rapidement et aux meilleurs prix.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center transition-all duration-300 group"
                  style={{
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#f54f9a';
                    (e.currentTarget as HTMLElement).style.color = '#f54f9a';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(245,79,154,0.08)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Contact pills */}
            <div className="flex flex-col gap-2 mt-6">
              {['06 60 20 65 76', '06 65 47 40 87'].map((num) => (
                <a
                  key={num}
                  href={`tel:${num.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 text-[11px] font-light tracking-[0.06em] transition-colors duration-300"
                  style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#41cdcf')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#41cdcf', flexShrink: 0 }}>
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.89 9.11 19.79 19.79 0 01.82 4.45 2 2 0 012.82 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 9.91a16 16 0 006 6l.98-.98a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  {num}
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2: Categories ── */}
          <div
            className="lg:col-span-2 transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '100ms' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-[1.5px] bg-[#f54f9a]" />
              <h3
                className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Catégories
              </h3>
            </div>
            <ul className="space-y-3 ">
              {categories.map((c) => (
                <FooterLink key={c.label} label={c.label} href={c.href} />
              ))}
            </ul>
          </div>

          {/* ── Col 3: Info ── */}
          <div
            className="lg:col-span-3 transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '200ms' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-[1.5px] bg-[#41cdcf]" />
              <h3
                className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Informations
              </h3>
            </div>
            <ul className="space-y-3">
              {info.map((i) => (
                <FooterLink key={i.label} label={i.label} href={i.href} />
              ))}
            </ul>

            {/* Delivery info card */}
            <div
              className="mt-8 p-4 relative overflow-hidden"
              style={{
                background: 'rgba(65,205,207,0.06)',
                border: '1px solid rgba(65,205,207,0.15)',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, #41cdcf, transparent)' }} />
              <p
                className="text-[10.5px] font-medium tracking-[0.06em] text-white mb-1"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                🚚 Livraison offerte
              </p>
              <p
                className="text-[10px] font-light leading-relaxed"
                style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(255,255,255,0.38)' }}
              >
                Livraison gratuite à <span style={{ color: '#41cdcf' }}>Maarif</span> et <span style={{ color: '#41cdcf' }}>Bourgogne</span><br />
                Dès <span style={{ color: '#41cdcf' }}>200DH</span> à Casablanca<br />
                Dès <span style={{ color: '#41cdcf' }}>400DH</span> hors Casablanca
                
              </p>
            </div>
          </div>

          {/* ── Col 4: Newsletter ── */}
          <div
            className="lg:col-span-3 transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '300ms' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-[1.5px] bg-[#f54f9a]" />
              <h3
                className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Newsletter
              </h3>
            </div>

            <p
              className="text-[12px] font-light leading-[1.85] tracking-[0.03em] mb-5"
              style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(255,255,255,0.4)' }}
            >
              Recevez nos offres exclusives, nouveautés et conseils beauté directement dans votre boîte mail.
            </p>

            <Newsletter />

            {/* Trust badges */}
            <div className="flex flex-col gap-2.5 mt-6">
              {[
                { icon: '🔒', text: 'Paiement 100% sécurisé' },
                { icon: '✓',  text: 'Produits authentiques garantis' },
                { icon: '↩',  text: 'Retour facile sous 30 jours' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <span className="text-[12px]">{icon}</span>
                  <span
                    className="text-[10.5px] font-light tracking-[0.04em]"
                    style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(255,255,255,0.32)' }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className="my-10 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
        />

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transitionDelay: '450ms' }}
        >
          {/* Copyright */}
          <p
            className="text-[11px] font-light tracking-[0.06em]"
            style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(255,255,255,0.25)' }}
          >
            © {new Date().getFullYear()}{' '}
            <span style={{ color: 'rgba(255,255,255,0.45)' }}>Jamali Express</span>
            {' '}— Tous droits réservés.
          </p>

          {/* Payment icons */}
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-light tracking-[0.1em] uppercase mr-2"
              style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(255,255,255,0.2)' }}
            >
              Paiement sécurisé
            </span>
            {/* CMI / Visa / Mastercard / Cash pills */}
            {['Visa', 'MC', 'CMI', 'Cash'].map((m, i) => (
              <div
                key={m}
                className="px-3 py-1 text-[9px] font-semibold tracking-[0.12em] transition-colors duration-300"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                {m}
              </div>
            ))}
          </div>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-[10px] font-medium tracking-[0.16em] uppercase transition-all duration-300 group"
            style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f54f9a')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)')}
          >
            Haut de page
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:-translate-y-1">
              <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Bottom gradient glow ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, #f54f9a 35%, #41cdcf 65%, transparent)' }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500;600&display=swap');
      `}</style>
    </footer>
  );
}