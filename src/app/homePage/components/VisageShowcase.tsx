'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/axios';
import { useCart } from '@/contexts/CartContext';
import { getProductImageUrl } from '@/utils/imageHelper';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  brand: string;
  slug: string;
  description: string;
  original_price: number;
  discounted_price?: number | null;
  stock_quantity: number;
  image_url: string;
  created_at: string;
  updated_at: string;
  category_id: number;
  subcategory_id: number | null;
  sub_subcategory_id: number | null;
}

const CATEGORY_ID = 1;
const SCROLL_AMOUNT = 300;

import { useWishlist } from '@/hooks/useWishlist';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 101,
    name: "ADDAX SEPTIDOL BODY GEL NETTOYANT 250 ML ",
    brand: "ADDAX",
    slug: "addax-septidol-body-gel-nettoyant-250ml-699ced5060446",
    description: "ADDAX SEPTIDOL BODY GEL NETTOYANT 250ML",
    original_price: 175.91,
    discounted_price: 150.00,
    stock_quantity: 15,
    image_url: "img/products/ADDAX-SEPTIDOL-BODY-GEL-NETTOYANT-250ML-300x300.jpeg.webp",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: CATEGORY_ID,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 102,
    name: "ALPHANOVA CREME RICHE HYDRATANTE HYDRA+ 50ML",
    brand: "ALPHANOVA",
    slug: "alpha-creme-riche-hydratante-hydra-50ml",
    description: "ALPHANOVA CREME RICHE HYDRATANTE HYDRA+ 50ML",
    original_price: 220.00,
    discounted_price: null,
    stock_quantity: 8,
    image_url: "img/products/3760075072780-300x318.png.webp",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: CATEGORY_ID,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 103,
    name: "ALPHANOVA DAILY SUN STICK LEVRES HYDRATANT SPF50+ 4G",
    brand: "ALPHANOVA",
    slug: "alpha-daily-sun-stick-levres-hydratant-spf50-4g",
    description: "ALPHANOVA DAILY SUN STICK LEVRES HYDRATANT SPF50+ 4G",
    original_price: 310.00,
    discounted_price: 280.00,
    stock_quantity: 20,
    image_url: "img/products/3760075073404-300x320.png.webp",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: CATEGORY_ID,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 104,
    name: "ALPHANOVA MOUSSE NETTOYANTE APAISANTE HYDRA+ 150ML",
    brand: "ALPHANOVA",
    slug: "alpha-mousse-nettoyante-apaisante-hydra-150ml",
    description: "ALPHANOVA MOUSSE NETTOYANTE APAISANTE HYDRA+ 150ML",
    original_price: 145.00,
    discounted_price: null,
    stock_quantity: 12,
    image_url: "img/products/3760075072797-300x309.png.webp",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: CATEGORY_ID,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 105,
    name: "ALPHANOVA SERUM BOOSTER ANTI RIDES LISSANT+ 30ML",
    brand: "ALPHANOVA",
    slug: "alpha-serum-booster-anti-rides-lissanto-30ml",
    description: "ALPHANOVA SERUM BOOSTER ANTI RIDES LISSANT+ 30ML",
    original_price: 260.00,
    discounted_price: 230.00,
    stock_quantity: 5,
    image_url: "img/products/3760075072834-300x313.png.webp",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: CATEGORY_ID,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 106,
    name: "BABE DEPIGMENT+ CONTROL FLUID 40ML",
    brand: "BABE",
    slug: "babe-depigment-control-fluid-40ml",
    description: "BABE DEPIGMENT+ CONTROL FLUID 40ML",
    original_price: 350.00,
    discounted_price: 299.00,
    stock_quantity: 10,
    image_url: "img/products/BABE-DEPIGMENT-CONTROL-FLUID-40ML-300x300.jpg.webp",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: CATEGORY_ID,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 107,
    name: "BELLA AURORA CC CREME TEINTE ANTI TACHES MEDIUM SPF50+ 30ML + TROUSSE...",
    brand: "BELLA AURORA",
    slug: "bella-aurora-cc-creme-teinte-anti-taches-medium-spf50-30ml-trousse",
    description: "BELLA AURORA CC CREME TEINTE ANTI TACHES MEDIUM SPF50+ 30ML + TROUSSE...",
    original_price: 90.00,
    discounted_price: null,
    stock_quantity: 30,
    image_url: "img/products/8413400020424-300x297.png",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: CATEGORY_ID,
    subcategory_id: null,
    sub_subcategory_id: null,
  },
  {
    id: 108,
    name: "CLINIQUE ALL ABOUT EYES SERUM CONCENTRE ILLUMINATEUR 10ML V4KZ",
    brand: "CLINIQUE",
    slug: "clinique-all-about-eyes-serum-concentre-illuminateur-10ml-v4kz",
    description: "CLINIQUE ALL ABOUT EYES SERUM CONCENTRE ILLUMINATEUR 10ML V4KZ",
    original_price: 195.00,
    discounted_price: 175.00,
    stock_quantity: 18,
    image_url: "img/products/CLINIQUE-ALL-ABOUT-EYES-SERUM-CONCENTRE-ILLUMINATEUR-10ML-V4KZ-300x300.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: CATEGORY_ID,
    subcategory_id: null,
    sub_subcategory_id: null,
  }
];

const VisageShowcase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>({});
  
  const { wishlist, toggleWishlist: toggleWishlistHook } = useWishlist();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [progressPct, setProgressPct] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  /* ── Fetch ── */
  useEffect(() => {
    const fetchCapillaire = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/products', {
          params: { category_id: CATEGORY_ID, limit: 10 },
        });
        const data: Product[] = res.data.data || res.data;
        if (data && data.length > 0) {
          setProducts(data.slice(0, 10));
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch (err: unknown) {
        console.error('Fetch error, using mocks:', err);
        setProducts(MOCK_PRODUCTS);
        // We don't set the error state anymore so the component displays mocks instead of an error message
      } finally {
        setLoading(false);
      }
    };
    fetchCapillaire();
  }, []);

  /* ── Scroll tracking ── */
  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < max - 8);
    setProgressPct(max > 0 ? (el.scrollLeft / max) * 100 : 0);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    return () => el.removeEventListener('scroll', updateScroll);
  }, [updateScroll, products]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: 'smooth',
    });
  };

  /* ── Drag scroll ── */
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setDragStartX(e.pageX - scrollRef.current.offsetLeft);
    setDragScrollLeft(scrollRef.current.scrollLeft);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = dragScrollLeft - (x - dragStartX);
  };
  const stopDrag = () => setIsDragging(false);

  /* ── Cart ── */
  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addingToCart[product.id] || product.stock_quantity === 0) return;
    
    setAddingToCart((p) => ({ ...p, [product.id]: true }));
    try {
      const result = await addToCart(product, 1);
       if (!result.success) {
        alert(result.message || 'Erreur lors de l\'ajout au panier');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
       setAddingToCart((p) => ({ ...p, [product.id]: false }));
    }
  };

  /* ── Wishlist ── */
  const toggleWishlist = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistHook(id);
  };

  const accent = (i: number) => (i % 2 === 0 ? '#f54f9a' : '#41cdcf');
  const accentRgb = (i: number) => (i % 2 === 0 ? '245,79,154' : '65,205,207');

  /* ── Skeleton ── */
  const Skeleton = () => (
    <div className="flex gap-5 px-6 md:px-10 pb-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[230px] animate-pulse">
          <div className="h-[280px] rounded-sm bg-gray-100" />
          <div className="mt-3 space-y-2 px-1">
            <div className="h-2 w-16 bg-gray-100 rounded" />
            <div className="h-4 w-40 bg-gray-100 rounded" />
            <div className="h-9 bg-gray-100 rounded-sm mt-4" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-white py-20">

      {/* ── Background details ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large teal arc top-right */}
        <div
          className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #41cdcf 0%, transparent 70%)' }}
        />
        {/* Pink arc bottom-left */}
        <div
          className="absolute -bottom-48 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #f54f9a 0%, transparent 70%)' }}
        />
        {/* Diagonal stripe pattern */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #1a1a2e 0px, #1a1a2e 1px, transparent 0px, transparent 8px)',
            backgroundSize: '12px 12px',
          }}
        />
      </div>

      {/* ── Top decorative border ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(65,205,207,0.4) 30%, rgba(245,79,154,0.4) 70%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-[1500px] mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-6 md:px-10 mb-12">

          {/* Left: text */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-px bg-gradient-to-r from-[#41cdcf] to-transparent" />
              <span
                className="text-[10px] font-semibold tracking-[0.38em] uppercase text-[#41cdcf]"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Beauté & Soin
              </span>
              <div className="w-9 h-px bg-gradient-to-l from-[#f54f9a] to-transparent" />
            </div>

            <h2
              className="text-4xl md:text-[52px] font-light text-[#1a1a2e] leading-[1.06]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Soin{' '}
              <em
                className="not-italic"
                style={{
                  background: 'linear-gradient(110deg, #41cdcf 0%, #2aabb0 40%, #f54f9a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Visage
              </em>
            </h2>

            <p
              className="mt-3 text-[12.5px] font-light tracking-[0.04em] text-[#1a1a2e]/40 leading-[1.8] max-w-sm"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {loading
                ? 'Chargement…'
                : `${products.length} produits pour sublimer vos cheveux`}
            </p>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-4">
            <Link
              href="/products?category_id=3"
              className="hidden md:flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase text-[#1a1a2e]/38 hover:text-[#f54f9a] transition-colors duration-300 border-b border-transparent hover:border-[#f54f9a] pb-px"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Voir tout <ArrowRight size={12} />
            </Link>

            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-10 h-10 flex items-center justify-center border transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
                style={{
                  borderColor: canScrollLeft ? 'rgba(65,205,207,0.5)' : 'rgba(26,26,46,0.1)',
                  color: canScrollLeft ? '#41cdcf' : 'rgba(26,26,46,0.2)',
                  background: canScrollLeft ? 'rgba(65,205,207,0.06)' : 'transparent',
                }}
              >
                <ChevronLeft size={17} />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-10 h-10 flex items-center justify-center border transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
                style={{
                  borderColor: canScrollRight ? 'rgba(245,79,154,0.5)' : 'rgba(26,26,46,0.1)',
                  color: canScrollRight ? '#f54f9a' : 'rgba(26,26,46,0.2)',
                  background: canScrollRight ? 'rgba(245,79,154,0.06)' : 'transparent',
                }}
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Products track ── */}
        {loading ? (
          <Skeleton />
        ) : error ? (
          <div className="px-10 py-16 text-center">
            <p
              className="text-sm tracking-wide"
              style={{ fontFamily: "'Jost', sans-serif", color: '#f54f9a' }}
            >
              {error}
            </p>
          </div>
        ) : (
          <>
            <div
              ref={scrollRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
              className="flex gap-5 px-6 md:px-10 pb-6 overflow-x-auto"
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
                {products.map((product, index) => {
                  const inWishlist = wishlist.includes(product.id);
                  const inCart = addingToCart[product.id];
                  const outOfStock = product.stock_quantity === 0;
                  const isHovered = hoveredId === product.id;
                  const col = accent(index);
                  const rgb = accentRgb(index);

                  // Calculate discount percentage
                  const hasDiscount = product.discounted_price && Number(product.discounted_price) > 0 && Number(product.original_price) > Number(product.discounted_price);
                  const discountPercent = hasDiscount 
                    ? Math.round(((Number(product.original_price) - Number(product.discounted_price)) / Number(product.original_price)) * 100)
                    : 0;

                  return (
                    <Link
                      key={product.id}
                      href={`/products?category=Visage`}
                      className="flex-shrink-0 w-[230px] group relative block select-none"
                      style={{ textDecoration: 'none' }}
                      onMouseEnter={() => setHoveredId(product.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      draggable={false}
                    >
                      {/* ── Card ── */}
                      <div className="relative">

                        {/* Ghost number — behind card */}
                        <span
                          className="absolute -top-6 -left-1 text-[88px] font-bold leading-none pointer-events-none select-none z-0 transition-opacity duration-500"
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            color: `rgba(${rgb}, ${isHovered ? 0.08 : 0.04})`,
                          }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        {/* Card shell */}
                        <div
                          className="relative z-10 overflow-hidden transition-all duration-500 bg-[#faf8f5]"
                          style={{
                            border: `1px solid ${isHovered ? `rgba(${rgb}, 0.3)` : 'rgba(26,26,46,0.07)'}`,
                            boxShadow: isHovered
                              ? `0 24px 56px rgba(${rgb}, 0.14), 0 4px 16px rgba(0,0,0,0.05)`
                              : '0 2px 8px rgba(0,0,0,0.04)',
                            transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                          }}
                        >
                          {/* Top accent line */}
                          <div
                            className="absolute top-0 left-0 right-0 z-20 transition-opacity duration-400"
                            style={{
                              height: '2px',
                              background:
                                index % 2 === 0
                                  ? 'linear-gradient(90deg, #41cdcf, transparent)'
                                  : 'linear-gradient(90deg, #f54f9a, transparent)',
                              opacity: isHovered ? 1 : 0,
                            }}
                          />

                          {/* Image area */}
                          <div className="relative h-[280px] overflow-hidden bg-[#f0ede8]">
                            <img
                              // src={getProductImageUrl(product.image_url)}
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-700"
                              style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
                              draggable={false}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                              }}
                            />

                            {/* Scrim on hover */}
                            <div
                              className="absolute inset-0 transition-opacity duration-400"
                              style={{
                                background:
                                  'linear-gradient(to top, rgba(26,26,46,0.45) 0%, transparent 55%)',
                                opacity: isHovered ? 1 : 0,
                              }}
                            />

                            {/* Discount Badge */}
                            {hasDiscount && (
                              <div 
                                className="absolute top-3 left-3 px-2 py-1 z-30 text-[10px] font-bold tracking-wider text-white shadow-sm"
                                style={{ 
                                  background: '#f54f9a',
                                  fontFamily: "'Jost', sans-serif"
                                }}
                              >
                                -{discountPercent}%
                              </div>
                            )}

                            {/* Wishlist */}
                            <button
                              onClick={(e) => toggleWishlist(product.id, e)}
                              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center z-30 transition-all duration-300"
                              style={{
                                background: 'rgba(255,255,255,0.92)',
                                backdropFilter: 'blur(8px)',
                                border: `1px solid ${inWishlist ? '#f54f9a' : 'rgba(26,26,46,0.1)'}`,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                opacity: isHovered || inWishlist ? 1 : 0,
                                transform:
                                  isHovered || inWishlist
                                    ? 'translateY(0) scale(1)'
                                    : 'translateY(-6px) scale(0.85)',
                              }}
                            >
                              <Heart
                                size={13}
                                fill={inWishlist ? '#f54f9a' : 'none'}
                                stroke={inWishlist ? '#f54f9a' : '#1a1a2e'}
                              />
                            </button>

                            {/* Out of stock */}
                            {outOfStock && (
                              <div
                                className="absolute top-3 left-3 px-2 py-1 z-30 text-[9px] font-semibold tracking-[0.15em] uppercase"
                                style={{
                                  background: 'rgba(245,79,154,0.1)',
                                  border: '1px solid rgba(245,79,154,0.35)',
                                  color: '#f54f9a',
                                  fontFamily: "'Jost', sans-serif",
                                }}
                              >
                                Rupture
                              </div>
                            )}

                            {/* Low stock */}
                            {!outOfStock && product.stock_quantity <= 5 && (
                              <div
                                className="absolute bottom-3 left-3 px-2 py-1 z-30 text-[9px] font-medium tracking-[0.1em] uppercase transition-opacity duration-300"
                                style={{
                                  background: 'rgba(255,255,255,0.9)',
                                  border: '1px solid rgba(245,79,154,0.3)',
                                  color: '#f54f9a',
                                  fontFamily: "'Jost', sans-serif",
                                  opacity: isHovered ? 1 : 0,
                                }}
                              >
                                Plus que {product.stock_quantity}
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="p-4 pb-5 flex flex-col">
                            <div className="mb-2">
                              {product.brand ? (
                                <p
                                  className="text-[9.5px] font-semibold tracking-[0.28em] uppercase transition-colors duration-300 h-[14px] overflow-hidden"
                                  style={{ fontFamily: "'Jost', sans-serif", color: col }}
                                >
                                  {product.brand}
                                </p>
                              ) : (
                                <div className="h-[14px]" />
                              )}
                            </div>

                            <div className="h-[44px] mb-3 overflow-hidden">
                              <p
                                className="line-clamp-2 leading-tight transition-colors duration-300"
                                style={{
                                  fontFamily: "'Cormorant Garamond', serif",
                                  fontSize: '16.5px',
                                  fontWeight: 400,
                                  color: isHovered ? '#1a1a2e' : '#3d3530',
                                }}
                              >
                                {product.name}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between mb-4 mt-auto">
                              <div className="flex items-center gap-3">
                                <span
                                  className="font-semibold text-[#1a1a2e]"
                                  style={{ fontFamily: "'Jost', sans-serif", fontSize: '15px' }}
                                >
                                  {hasDiscount 
                                    ? Number(product.discounted_price).toFixed(2) 
                                    : Number(product.original_price).toFixed(2)}{' '}
                                  <span className="text-[10px] font-normal text-[#1a1a2e]/35 uppercase">
                                    د.م
                                  </span>
                                </span>
                                {hasDiscount && (
                                  <span className="text-[11px] text-gray-400 line-through decoration-[#f54f9a]/30">
                                    {Number(product.original_price).toFixed(2)} د.م
                                  </span>
                                )}
                              </div>
                            </div>

                          {/* Cart button */}
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={outOfStock || addingToCart[product.id]}
                            className="w-full bg-transparent border-2 border-black hover:bg-black hover:text-white px-4 py-3 text-sm font-medium text-black transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black uppercase tracking-wider mt-4"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>
                              {addingToCart[product.id] ? 'ajout en cours...' : 'ajouter au panier'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* End "voir tout" card */}
              <Link
                href="/products?category_id=3"
                className="flex-shrink-0 w-[150px] flex flex-col items-center justify-center gap-4 group"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    border: '1px solid rgba(245,79,154,0.3)',
                    background: 'rgba(245,79,154,0.05)',
                  }}
                >
                  <ArrowRight
                    size={20}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: '#f54f9a' }}
                  />
                </div>
                <span
                  className="text-[9.5px] font-medium tracking-[0.24em] uppercase text-[#1a1a2e]/32 group-hover:text-[#f54f9a] transition-colors duration-300 text-center leading-relaxed"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Voir tous les<br />soins visages
                </span>
              </Link>
            </div>

            {/* ── Progress bar ── */}
            <div className="px-6 md:px-10 mt-2">
              <div
                className="relative h-px overflow-hidden"
                style={{ background: 'rgba(26,26,46,0.07)' }}
              >
                <div
                  className="absolute left-0 top-0 h-full transition-all duration-150 ease-out"
                  style={{
                    width: `${Math.max(progressPct, 4)}%`,
                    background: 'linear-gradient(90deg, #41cdcf, #f54f9a)',
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Bottom border ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(65,205,207,0.25) 35%, rgba(245,79,154,0.25) 65%, transparent 100%)',
        }}
      />
      <div className='relative w-full h-[800px] mt-20'>
        <Image src="/img/MAGICLEAR-RENAISSANCE.jpg" alt="picture" fill className='object-cover' />
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .overflow-x-auto::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default VisageShowcase;