'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqData = [
  {
    question: 'Quels sont les délais de livraison ?',
    answer:
      "Nos délais de livraison varient entre 24h et 72h selon votre ville. Nous faisons de notre mieux pour vous livrer le plus rapidement possible partout au Maroc.",
    tag: 'Livraison',
    tagColor: '#41cdcf',
  },
  {
    question: 'Comment puis-je retourner un produit ?',
    answer:
      "Vous disposez d'un délai de 7 jours après réception pour retourner un produit s'il est défectueux ou non conforme. Contactez notre service client pour initier la procédure de retour gratuite.",
    tag: 'Retour',
    tagColor: '#f54f9a',
  },
  {
    question: 'Est-ce que les produits sont authentiques ?',
    answer:
      "Absolument. Nous travaillons directement avec les distributeurs agréés et garantissons l'authenticité de 100% de nos produits. Chaque article est sourcé auprès des marques officielles.",
    tag: 'Authenticité',
    tagColor: '#41cdcf',
  },
  {
    question: 'Puis-je payer à la livraison ?',
    answer:
      "Oui, nous proposons le paiement à la livraison en espèces pour toutes les commandes partout au Maroc. Aucune surprise — vous payez uniquement à la réception.",
    tag: 'Paiement',
    tagColor: '#f54f9a',
  },
  {
    question: 'Comment contacter le service client ?',
    answer:
      "Vous pouvez nous contacter par téléphone au 06 60 20 65 76, via WhatsApp, ou par notre formulaire de contact — du Lundi au Dimanche de 9h à 20h. Réponse garantie sous 2h.",
    tag: 'Support',
    tagColor: '#41cdcf',
  },
  {
    question: 'La livraison est-elle gratuite ?',
    answer:
      "La livraison est offerte dès 200DH d'achat à Casablanca et dès 400DH hors Casablanca. En dessous de ces montants, des frais de livraison s'appliquent selon votre région.",
    tag: 'Livraison',
    tagColor: '#f54f9a',
  },
];

/* ── Single accordion item ── */
interface ItemProps {
  item: typeof faqData[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isVisible: boolean;
}

const FaqItem = ({ item, index, isOpen, onToggle, isVisible }: ItemProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const isPink = item.tagColor === '#f54f9a';
  const rgb = isPink ? '245,79,154' : '65,205,207';

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className="transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div
        className="relative overflow-hidden transition-all duration-400"
        style={{
          background: isOpen ? '#fff' : 'rgba(255,255,255,0.7)',
          border: `1px solid ${isOpen ? `rgba(${rgb},0.3)` : 'rgba(26,26,46,0.08)'}`,
          boxShadow: isOpen
            ? `0 16px 48px rgba(${rgb},0.1), 0 4px 16px rgba(0,0,0,0.04)`
            : '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[2px] transition-opacity duration-400"
          style={{
            background: `linear-gradient(to bottom, ${item.tagColor}, transparent)`,
            opacity: isOpen ? 1 : 0,
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px] transition-opacity duration-400"
          style={{
            background: `linear-gradient(90deg, ${item.tagColor}, transparent)`,
            opacity: isOpen ? 1 : 0,
          }}
        />

        {/* Question row */}
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 p-3 md:p-4 text-left group"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {/* Index number */}
          <span
            className="flex-shrink-0 font-light transition-colors duration-300"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '18px',
              color: isOpen ? item.tagColor : 'rgba(26,26,46,0.15)',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Question text */}
          <span
            className="flex-1 transition-colors duration-300"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '16px',
              fontWeight: 400,
              color: isOpen ? '#1a1a2e' : '#3d3530',
              letterSpacing: '0.01em',
              lineHeight: 1.4,
            }}
          >
            {item.question}
          </span>

          {/* Tag */}
          <span
            className="hidden sm:inline-flex flex-shrink-0 items-center px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.18em] uppercase mr-2 transition-all duration-300"
            style={{
              fontFamily: "'Jost', sans-serif",
              background: isOpen ? `rgba(${rgb},0.1)` : 'rgba(26,26,46,0.04)',
              border: `1px solid ${isOpen ? `rgba(${rgb},0.3)` : 'rgba(26,26,46,0.08)'}`,
              color: isOpen ? item.tagColor : 'rgba(26,26,46,0.35)',
            }}
          >
            {item.tag}
          </span>

          {/* Plus / Minus icon */}
          <div
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center transition-all duration-400"
            style={{
              background: isOpen ? `rgba(${rgb},0.1)` : 'rgba(26,26,46,0.04)',
              border: `1px solid ${isOpen ? `rgba(${rgb},0.3)` : 'rgba(26,26,46,0.1)'}`,
              transform: isOpen ? 'rotate(0deg)' : 'rotate(0deg)',
            }}
          >
            {isOpen ? (
              <Minus size={13} style={{ color: item.tagColor }} />
            ) : (
              <Plus size={13} style={{ color: 'rgba(26,26,46,0.4)' }} />
            )}
          </div>
        </button>

        {/* Answer — smooth height transition */}
        <div
          style={{
            height: `${height}px`,
            overflow: 'hidden',
            transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div ref={bodyRef}>
            <div
              className="px-4 md:px-5 pb-4 pl-[60px]"
              style={{
                borderTop: `1px solid rgba(26,26,46,0.05)`,
              }}
            >
              <p
                className="pt-3 text-[12px] font-light leading-[1.8] tracking-[0.03em]"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  color: 'rgba(26,26,46,0.58)',
                }}
              >
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main FAQ component ── */
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#faf8f5] py-14">

      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#f54f9a]/[0.05] blur-[100px]" />
        <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-[#41cdcf]/[0.05] blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.016]"
          style={{
            backgroundImage: 'radial-gradient(rgba(26,26,46,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* ── Top border ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(65,205,207,0.4) 35%, rgba(245,79,154,0.4) 65%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-[860px] mx-auto px-6 md:px-10">

        {/* ── Header ── */}
        <div
          className="text-center mb-10 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-14 h-px bg-gradient-to-r from-transparent to-[#f54f9a]" />
            <span
              className="text-[9.5px] font-semibold tracking-[0.45em] uppercase text-[#1a1a2e]/35"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Aide & Support
            </span>
            <div className="w-14 h-px bg-gradient-to-l from-transparent to-[#41cdcf]" />
          </div>

          <h2
            className="text-[30px] md:text-[40px] font-light text-[#1a1a2e] leading-[1.08] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Questions{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(110deg, #f54f9a 0%, #d4326e 42%, #41cdcf 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              fréquentes
            </em>
          </h2>

          <p
            className="text-[12px] font-light tracking-[0.04em] text-[#1a1a2e]/38 max-w-md mx-auto leading-[1.8]"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Tout ce que vous devez savoir sur nos produits, livraisons et services.
          </p>
        </div>

        {/* ── Accordion list ── */}
        <div className="flex flex-col gap-1">
          {faqData.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
              isVisible={visible}
            />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: '600ms',
          }}
        >
          <p
            className="text-[12.5px] font-light tracking-[0.04em] text-[#1a1a2e]/40"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Vous n'avez pas trouvé votre réponse ?
          </p>

          {/* <a
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[10px] font-semibold tracking-[0.22em] uppercase text-white transition-all duration-300"
            style={{
              fontFamily: "'Jost', sans-serif",
              background: 'linear-gradient(135deg, #f54f9a, #d4326e)',
              boxShadow: '0 8px 24px rgba(245,79,154,0.25)',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background =
                'linear-gradient(135deg, #41cdcf, #2aabb0)';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 8px 24px rgba(65,205,207,0.28)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background =
                'linear-gradient(135deg, #f54f9a, #d4326e)';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 8px 24px rgba(245,79,154,0.25)';
            }}
          >
            Contactez-nous
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a> */}
        </div>
      </div>

      {/* ── Bottom border ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(245,79,154,0.3) 35%, rgba(65,205,207,0.3) 65%, transparent 100%)',
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500;600&display=swap');
      `}</style>
    </section>
  );
};

export default FAQ;