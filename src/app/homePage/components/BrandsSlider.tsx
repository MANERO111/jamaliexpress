'use client';
import React, { useState } from 'react';
import Image from 'next/image';
/* ────────────────────────────────────────────────────────────
   BRAND DATA
   logo  → replace with your real logo paths when ready
   Using Clearbit Logo API (reliable, no CORS issues) as
   placeholder until you upload your own assets.
──────────────────────────────────────────────────────────── */
const brands = [
  { name: 'La Roche-Posay', logo: 'img/roche_posay.webp' },
  { name: 'Vichy',          logo: 'img/vichy.webp' },
  { name: 'Bioderma',       logo: 'img/bioderma.webp' },
  { name: 'Avène',          logo: 'img/avene.webp' },
  { name: 'Neutrogena',     logo: 'img/neutrogena.webp' },
  { name: 'Cetaphil',       logo: 'img/cetaphil.webp' },
  { name: 'Nuxe',           logo: 'img/nuxe.webp' },
  { name: 'SVR',            logo: 'img/svr.webp' },
  { name: 'Ducray',         logo: 'img/ducray.webp' },
  { name: 'Uriage',         logo: 'img/uriage.webp' },
  { name: 'Caudalie',       logo: 'img/caudalie.webp' },
  { name: 'Filorga',        logo: 'img/filorga.webp' },
  { name: 'biocol',    logo: 'img/biocol.webp' },
  { name: 'cerave',        logo: 'img/cerave.webp' },
  { name: 'Liérac',         logo: 'img/lierac.webp' },
];

/* Triple for seamless infinite loop */
const row1 = [...brands, ...brands, ...brands];
const row2 = [...brands, ...brands, ...brands].reverse();

/* ── Single pill card ── */
interface PillProps {
  brand: { name: string; logo: string };
  index: number;
  size?: 'lg' | 'sm';
}

const BrandPill = ({ brand, index, size = 'lg' }: PillProps) => {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isPink = index % 2 === 0;
  const col    = isPink ? '#f54f9a' : '#41cdcf';
  const rgb    = isPink ? '245,79,154' : '65,205,207';

  const pillH  = size === 'lg' ? '98px' : '86px';
  const pillW  = size === 'lg' ? '182px' : '164px';
  const logoSz = size === 'lg' ? '52px' : '44px';
  const fontSize= size === 'lg' ? '9.5px' : '8.5px';

  return (
    <div
      className="flex-shrink-0 mx-3 relative"
      style={{ width: pillW, height: pillH, cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card shell */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: hovered ? '#fff' : 'rgba(255,255,255,0.8)',
          border: `1px solid ${hovered ? `rgba(${rgb},0.35)` : 'rgba(26,26,46,0.08)'}`,
          boxShadow: hovered
            ? `0 16px 48px rgba(${rgb},0.14), 0 4px 14px rgba(0,0,0,0.07)`
            : '0 2px 8px rgba(0,0,0,0.04)',
          transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Top colour accent line */}
      <div
        className="absolute top-0 left-0 right-0 z-10 transition-opacity duration-400"
        style={{
          height: '2px',
          background: `linear-gradient(90deg, ${col}, transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Inner layout: logo + name */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 w-full h-full px-3">

        {/* Logo image */}
        <div
          className="flex items-center justify-center transition-transform duration-400"
          style={{
            height: logoSz,
            width: '100%',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          {imgError ? (
            /* Fallback: styled text logo */
            <span
              className="text-center leading-tight font-medium"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '14px',
                color: hovered ? col : 'rgba(26,26,46,0.55)',
                transition: 'color 0.3s',
                letterSpacing: '0.04em',
              }}
            >
              {brand.name}
            </span>
          ) : (
            <img
              src={brand.logo}
              alt={brand.name}
              style={{
                maxWidth: '100%',
                maxHeight: logoSz,
                objectFit: 'contain',
                filter: hovered
                  ? 'none'
                  : 'grayscale(100%) opacity(0.5)',
                transition: 'filter 0.45s ease, transform 0.4s ease',
              }}
              onError={() => setImgError(true)}
              draggable={false}
            />
          )}
        </div>

        {/* Brand name label */}
        <span
          className="text-center whitespace-nowrap transition-colors duration-300 w-full overflow-hidden text-ellipsis"
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: fontSize,
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: hovered ? col : 'rgba(26,26,46,0.38)',
          }}
        >
          {brand.name}
        </span>
      </div>

      {/* Subtle corner dot */}
      <div
        className="absolute bottom-2 right-2 w-1 h-1 rounded-full transition-opacity duration-400"
        style={{ background: col, opacity: hovered ? 0.6 : 0 }}
      />
    </div>
  );
};

/* ── Separator between pills ── */
const Dot = ({ index }: { index: number }) => (
  <div className="flex-shrink-0 flex flex-col items-center justify-center gap-1 mx-1 self-stretch">
    <div className="w-[3px] h-[3px] rounded-full" style={{ background: index % 2 === 0 ? 'rgba(245,79,154,0.25)' : 'rgba(65,205,207,0.25)' }} />
    <div className="w-[3px] h-[3px] rounded-full" style={{ background: index % 2 === 0 ? 'rgba(245,79,154,0.12)' : 'rgba(65,205,207,0.12)' }} />
  </div>
);

/* ── Main component ── */
const BrandsSlider = () => {
  const [paused, setPaused] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#faf8f5] pt-20 pb-20">

      {/* ── Ambient glows ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#f54f9a]/[0.05] blur-[80px]" />
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#41cdcf]/[0.06] blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.016]"
          style={{
            backgroundImage: 'radial-gradient(rgba(26,26,46,0.9) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* ── Header ── */}
      <div className="relative z-10 flex flex-col items-center mb-14 px-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#f54f9a]" />
          <span
            className="text-[9.5px] font-semibold tracking-[0.48em] uppercase text-[#1a1a2e]/35"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Partenaires officiels
          </span>
          <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#41cdcf]" />
        </div>

        <h2
          className="text-[34px] md:text-[46px] font-light text-center text-[#1a1a2e] leading-[1.1]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Nos marques{' '}
          <em
            className="not-italic"
            style={{
              background: 'linear-gradient(110deg, #f54f9a 0%, #d4326e 42%, #41cdcf 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            d&apos;exception
          </em>
        </h2>

        <p
          className="mt-4 text-[12.5px] font-light text-[#1a1a2e]/38 tracking-[0.04em] max-w-[360px] text-center leading-[1.8]"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          Une sélection rigoureuse des meilleures marques de parapharmacie — 100% authentiques et garanties.
        </p>
      </div>

      {/* ── Slider area ── */}
      <div
        className="relative z-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Left fade mask */}
        <div
          className="absolute left-0 top-0 bottom-0 w-28 md:w-52 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #faf8f5 0%, transparent 100%)' }}
        />
        {/* Right fade mask */}
        <div
          className="absolute right-0 top-0 bottom-0 w-28 md:w-52 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #faf8f5 0%, transparent 100%)' }}
        />

        {/* ── Row 1 → scroll left ── */}
        <div className="flex overflow-hidden mb-4">
          <div
            className="flex items-center"
            style={{
              animation: 'marquee-left 55s linear infinite',
              animationPlayState: paused ? 'paused' : 'running',
              willChange: 'transform',
            }}
          >
            {row1.map((brand, i) => (
              <React.Fragment key={`r1-${brand.name}-${i}`}>
                <BrandPill brand={brand} index={i} size="lg" />
                <Dot index={i} />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Row 2 → scroll right ── */}
        <div className="flex overflow-hidden">
          <div
            className="flex items-center"
            style={{
              animation: 'marquee-right 68s linear infinite',
              animationPlayState: paused ? 'paused' : 'running',
              willChange: 'transform',
            }}
          >
            {row2.map((brand, i) => (
              <React.Fragment key={`r2-${brand.name}-${i}`}>
                <BrandPill brand={brand} index={i + 1} size="sm" />
                <Dot index={i + 1} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="relative z-10 flex items-center justify-center flex-wrap gap-0 mt-16 px-6">
        {[
          { value: '15+',    label: 'Marques premium',       color: '#f54f9a' },
          { value: '5 000+', label: 'Références produits',   color: '#1a1a2e' },
          { value: '100%',   label: 'Authenticité garantie', color: '#41cdcf' },
        ].map(({ value, label, color }, i) => (
          <React.Fragment key={label}>
            {i > 0 && (
              <div className="w-px h-10 mx-10 bg-gradient-to-b from-transparent via-[rgba(26,26,46,0.12)] to-transparent" />
            )}
            <div className="flex flex-col items-center gap-1.5">
              <span
                className="text-[30px] md:text-[36px] font-light leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif", color }}
              >
                {value}
              </span>
              <span
                className="text-[9px] font-medium tracking-[0.26em] uppercase text-[#1a1a2e]/30"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ── Bottom gradient line ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(245,79,154,0.3) 30%, rgba(65,205,207,0.3) 70%, transparent 100%)',
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500;600&display=swap');

        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>

    </section>
  );
};

export default BrandsSlider;