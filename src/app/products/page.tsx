'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Search, ArrowRight } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import ProductFilter from '@/components/products/ProductFilter';
import ProductGrid from '@/components/products/ProductGrid';

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const { products, categories, loading, error } = useProducts();

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(30);
  const sortRef = useRef<HTMLDivElement>(null);

  const categoryParam = searchParams.get('category') || '';
  const subcategoryParam = searchParams.get('subcategory') || '';
  const subsubcategoryParam = searchParams.get('subsubcategory') || '';

  const findCategoryIds = () => {
    if (!categoryParam) return null;
    const category = categories.find(c => c.name.toLowerCase() === categoryParam.toLowerCase());
    if (!category) return null;
    let subcategoryId = null;
    let subsubcategoryId = null;
    if (subcategoryParam && category.subcategories) {
      const sub = category.subcategories.find(s => s.name.toLowerCase() === subcategoryParam.toLowerCase());
      if (sub) {
        subcategoryId = sub.id;
        if (subsubcategoryParam && sub.sub_subcategories) {
          const subsub = sub.sub_subcategories.find(ss => ss.name.toLowerCase() === subsubcategoryParam.toLowerCase());
          if (subsub) subsubcategoryId = subsub.id;
        }
      }
    }
    return {
      categoryId: category.id, subcategoryId, subsubcategoryId,
      hasSubParam: !!subcategoryParam, hasSubSubParam: !!subsubcategoryParam,
    };
  };

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products.length === 0) return;
    let result = [...products];
    const ids = findCategoryIds();
    if (ids) {
      result = result.filter(p => p.category_id === ids.categoryId);
      if (ids.hasSubParam) {
        result = ids.subcategoryId ? result.filter(p => p.subcategory_id === ids.subcategoryId) : [];
      }
      if (ids.hasSubSubParam && result.length > 0) {
        result = ids.subsubcategoryId ? result.filter(p => p.sub_subcategory_id === ids.subsubcategoryId) : [];
      }
    } else if (categoryParam) result = [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    result = result.filter(p => {
      const price = p.discounted_price || p.original_price;
      return price >= minPrice && price <= maxPrice;
    });
    if (sortBy === 'price_asc') result.sort((a, b) => (a.discounted_price || a.original_price) - (b.discounted_price || b.original_price));
    else if (sortBy === 'price_desc') result.sort((a, b) => (b.discounted_price || b.original_price) - (a.discounted_price || a.original_price));
    else if (sortBy === 'name_asc') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'name_desc') result.sort((a, b) => b.name.localeCompare(a.name));
    setFilteredProducts(result);
  }, [products, categories, categoryParam, subcategoryParam, subsubcategoryParam, minPrice, maxPrice, sortBy, searchQuery]);

  // Reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(30);
  }, [categoryParam, subcategoryParam, subsubcategoryParam, minPrice, maxPrice, sortBy, searchQuery]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 30);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setIsSortOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleClearFilters = () => {
    setMinPrice(0); setMaxPrice(10000); setSortBy(''); setSearchQuery('');
  };

  const getPageTitle = () => {
    if (subsubcategoryParam) return subsubcategoryParam;
    if (subcategoryParam) return subcategoryParam;
    if (categoryParam) return categoryParam;
    return 'Tous les produits';
  };

  const getBreadcrumb = () => {
    const crumbs = [{ label: 'Accueil', href: '/' }, { label: 'Produits', href: '/products' }];
    if (categoryParam) crumbs.push({ label: categoryParam, href: `/products?category=${categoryParam}` });
    if (subcategoryParam) crumbs.push({ label: subcategoryParam, href: `/products?category=${categoryParam}&subcategory=${subcategoryParam}` });
    if (subsubcategoryParam) crumbs.push({ label: subsubcategoryParam, href: '#' });
    return crumbs;
  };

  const sortOptions = [
    { value: '', label: 'Par défaut' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'name_asc', label: 'Nom A → Z' },
    { value: 'name_desc', label: 'Nom Z → A' },
  ];

  const activeFiltersCount = [
    minPrice > 0, maxPrice < 10000, sortBy !== '', searchQuery !== ''
  ].filter(Boolean).length;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center pt-32">
        <div className="flex flex-col items-center gap-6">
          {/* Animated logo mark */}
          <div className="relative w-16 h-16">
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: 'linear-gradient(135deg, #f54f9a, #41cdcf)' }}
            />
            <div
              className="absolute inset-2 rounded-full animate-pulse"
              style={{ background: 'linear-gradient(135deg, #f54f9a, #41cdcf)' }}
            />
          </div>
          <div className="text-center">
            <p
              className="text-[13px] font-light tracking-[0.18em] uppercase text-[#1a1a2e]/40"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Chargement des produits…
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center pt-32 px-6">
        <div className="text-center max-w-sm">
          <div
            className="w-14 h-14 flex items-center justify-center mx-auto mb-5"
            style={{ border: '1px solid rgba(245,79,154,0.3)', background: 'rgba(245,79,154,0.06)' }}
          >
            <X size={22} style={{ color: '#f54f9a' }} />
          </div>
          <p
            className="text-xl font-light mb-2 text-[#1a1a2e]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Une erreur est survenue
          </p>
          <p
            className="text-[12px] font-light text-[#1a1a2e]/45"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-37 pb-20 relative overflow-hidden">

      {/* ── Background atmosphere ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#41cdcf]/[0.04] blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-[#f54f9a]/[0.04] blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'radial-gradient(rgba(26,26,46,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 lg:px-10">

        {/* ── Page header ── */}
        <div className="mb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 flex-wrap">
            {getBreadcrumb().map((crumb, i, arr) => (
              <React.Fragment key={crumb.label}>
                <a
                  href={crumb.href}
                  className="text-[10.5px] font-medium tracking-[0.14em] uppercase transition-colors duration-200"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    color: i === arr.length - 1 ? '#1a1a2e' : 'rgba(26,26,46,0.38)',
                    textDecoration: 'none',
                    pointerEvents: i === arr.length - 1 ? 'none' : 'auto',
                  }}
                >
                  {crumb.label}
                </a>
                {i < arr.length - 1 && (
                  <ChevronDown
                    size={11}
                    className="-rotate-90 flex-shrink-0"
                    style={{ color: 'rgba(26,26,46,0.2)' }}
                  />
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-px bg-gradient-to-r from-[#f54f9a] to-transparent" />
                <span
                  className="text-[9.5px] font-semibold tracking-[0.38em] uppercase text-[#41cdcf]"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Parapharmacie
                </span>
              </div>
              <h1
                className="text-4xl md:text-[52px] font-light text-[#1a1a2e] leading-[1.06]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {getPageTitle().split(' ').map((word, i) => (
                  <span key={i}>
                    {i === 0 ? word : (
                      <>
                        {' '}
                        <em
                          className="not-italic"
                          style={{
                            background: 'linear-gradient(110deg, #f54f9a 0%, #d4326e 45%, #41cdcf 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {word}
                        </em>
                      </>
                    )}
                  </span>
                ))}
              </h1>
              <p
                className="mt-2 text-[12px] font-light tracking-[0.06em] text-[#1a1a2e]/38"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Desktop toolbar */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(26,26,46,0.35)' }}
                />
                <input
                  type="text"
                  placeholder="Rechercher…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 text-[12px] font-light tracking-[0.04em] outline-none transition-all duration-300"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    background: '#fff',
                    border: '1px solid rgba(26,26,46,0.1)',
                    color: '#1a1a2e',
                    width: '200px',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#f54f9a')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(26,26,46,0.1)')}
                />
              </div>

              {/* Sort dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] uppercase transition-all duration-300"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    background: '#fff',
                    border: `1px solid ${isSortOpen ? '#41cdcf' : 'rgba(26,26,46,0.1)'}`,
                    color: sortBy ? '#1a1a2e' : 'rgba(26,26,46,0.45)',
                    minWidth: '160px',
                  }}
                >
                  <span className="flex-1 text-left">
                    {sortOptions.find(o => o.value === sortBy)?.label || 'Trier par'}
                  </span>
                  <ChevronDown
                    size={13}
                    style={{
                      color: '#41cdcf',
                      transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s',
                    }}
                  />
                </button>
                {isSortOpen && (
                  <div
                    className="absolute top-full right-0 mt-1 z-50 overflow-hidden"
                    style={{
                      background: '#fff',
                      border: '1px solid rgba(26,26,46,0.1)',
                      borderTop: '2px solid #41cdcf',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
                      minWidth: '180px',
                    }}
                  >
                    {sortOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                        className="w-full text-left px-4 py-3 text-[11px] font-light tracking-[0.06em] transition-all duration-200"
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          color: sortBy === opt.value ? '#41cdcf' : 'rgba(26,26,46,0.6)',
                          background: sortBy === opt.value ? 'rgba(65,205,207,0.05)' : 'transparent',
                          borderBottom: '1px solid rgba(26,26,46,0.05)',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(65,205,207,0.05)')}
                        onMouseLeave={e => (e.currentTarget.style.background = sortBy === opt.value ? 'rgba(65,205,207,0.05)' : 'transparent')}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Active filter count badge */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-3 py-2.5 text-[10px] font-semibold tracking-[0.14em] uppercase transition-all duration-300"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    background: 'rgba(245,79,154,0.08)',
                    border: '1px solid rgba(245,79,154,0.3)',
                    color: '#f54f9a',
                  }}
                >
                  <X size={11} />
                  Réinitialiser ({activeFiltersCount})
                </button>
              )}
            </div>
          </div>

          {/* Gradient separator */}
          <div
            className="mt-8 h-px"
            style={{ background: 'linear-gradient(90deg, rgba(245,79,154,0.3) 0%, rgba(65,205,207,0.3) 50%, transparent 100%)' }}
          />
        </div>

        {/* ── Mobile toolbar ── */}
        <div className="flex md:hidden items-center gap-3 mb-6">
          {/* Mobile search */}
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(26,26,46,0.35)' }} />
            <input
              type="text"
              placeholder="Rechercher…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 text-[12px] font-light outline-none"
              style={{
                fontFamily: "'Jost', sans-serif",
                background: '#fff',
                border: '1px solid rgba(26,26,46,0.1)',
                color: '#1a1a2e',
              }}
            />
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-medium tracking-[0.1em] uppercase transition-all duration-300 flex-shrink-0"
            style={{
              fontFamily: "'Jost', sans-serif",
              background: isFilterOpen ? 'rgba(245,79,154,0.08)' : '#fff',
              border: `1px solid ${isFilterOpen ? 'rgba(245,79,154,0.35)' : 'rgba(26,26,46,0.1)'}`,
              color: isFilterOpen ? '#f54f9a' : 'rgba(26,26,46,0.6)',
            }}
          >
            <SlidersHorizontal size={14} />
            Filtres
            {activeFiltersCount > 0 && (
              <span
                className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background: '#f54f9a', color: '#fff' }}
              >
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Main layout ── */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Filter sidebar ── */}
          <div
            className="lg:w-64 flex-shrink-0 transition-all duration-300"
            style={{
              opacity: isFilterOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 1 : 0,
              display: isFilterOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 'block' : 'none',
            }}
          >
            {/* Sidebar header */}
            <div
              className="hidden lg:flex items-center gap-3 mb-6 pb-4"
              style={{ borderBottom: '1px solid rgba(26,26,46,0.08)' }}
            >
              <div className="w-5 h-[1.5px]" style={{ background: 'linear-gradient(90deg, #f54f9a, transparent)' }} />
              <span
                className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#1a1a2e]"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Filtres
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="ml-auto flex items-center gap-1 text-[9px] font-semibold tracking-[0.1em] uppercase transition-colors duration-200"
                  style={{ fontFamily: "'Jost', sans-serif", color: '#f54f9a', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={10} /> Tout effacer
                </button>
              )}
            </div>

            <ProductFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              sortBy={sortBy}
              searchQuery={searchQuery}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onSortChange={setSortBy}
              onSearchChange={setSearchQuery}
              onClearFilters={handleClearFilters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          {/* ── Products area ── */}
          <div className="flex-grow min-w-0">

            {/* Empty state */}
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div
                  className="w-16 h-16 flex items-center justify-center mb-6"
                  style={{
                    border: '1px solid rgba(65,205,207,0.25)',
                    background: 'rgba(65,205,207,0.05)',
                  }}
                >
                  <Search size={24} style={{ color: 'rgba(26,26,46,0.2)' }} />
                </div>
                <h3
                  className="text-2xl font-light text-[#1a1a2e] mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Aucun produit trouvé
                </h3>
                <p
                  className="text-[12px] font-light text-[#1a1a2e]/38 mb-6 max-w-xs leading-relaxed"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Essayez de modifier vos filtres ou d'élargir votre recherche.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-6 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-white transition-all duration-300"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    background: 'linear-gradient(135deg, #f54f9a, #d4326e)',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(245,79,154,0.28)',
                  }}
                >
                  Réinitialiser les filtres <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <>
                <ProductGrid products={displayedProducts} />
                
                {/* ── Load More button ── */}
                {hasMore && (
                  <div className="mt-16 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      className="group relative flex items-center gap-4 px-10 py-4 overflow-hidden transition-all duration-500"
                      style={{
                        background: '#fff',
                        border: '1px solid rgba(26,26,46,0.1)',
                      }}
                    >
                      {/* Animated background on hover */}
                      <div 
                        className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"
                        style={{ background: 'linear-gradient(135deg, #f54f9a, #d4326e)' }}
                      />
                      
                      {/* Button Content */}
                      <div className="relative z-10 flex items-center gap-3">
                        <span
                          className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#1a1a2e] group-hover:text-white transition-colors duration-300"
                          style={{ fontFamily: "'Jost', sans-serif" }}
                        >
                          Afficher plus de produits
                        </span>
                        <div className="relative">
                          <ArrowRight 
                            size={16} 
                            className="text-[#f54f9a] group-hover:text-white group-hover:translate-x-1 transition-all duration-300" 
                          />
                        </div>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#41cdcf] group-hover:w-full transition-all duration-700 delay-100 z-10" />
                    </button>
                  </div>
                )}
                
                {/* ── Scroll progress indicator ── */}
                <div className="mt-8 text-center">
                  <p 
                    className="text-[10px] font-light tracking-[0.15em] uppercase text-[#1a1a2e]/30"
                    style={{ fontFamily: "'Jost', sans-serif" }}
                  >
                    Affichage de {displayedProducts.length} sur {filteredProducts.length} produits
                  </p>
                  <div className="w-48 h-[2px] bg-black/5 mx-auto mt-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#f54f9a] to-[#41cdcf] transition-all duration-700"
                      style={{ width: `${(displayedProducts.length / filteredProducts.length) * 100}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  );
};

export default ProductsPage;