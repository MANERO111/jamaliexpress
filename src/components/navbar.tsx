"use client";
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, User, Menu, X, ChevronDown, Settings, LogOut, Search, ShoppingBag, Heart, Package } from 'lucide-react';
import LoginModal from './login';
import ProductModal from './products/ProductModal';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { navigationItems, NavItem } from '@/constants/navigationData';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts, Product } from '@/hooks/useProducts';
import { getProductImageUrl } from '@/utils/imageHelper';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Search State
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  const { cartCount } = useCart();

  useEffect(() => {
    const loadWishlistCount = () => {
      try {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          const wishlistItems = JSON.parse(savedWishlist);
          setWishlistCount(wishlistItems.length);
        }
      } catch (error) {
        console.error('Error loading wishlist count:', error);
      }
    };
    loadWishlistCount();
    const handleStorageChange = (e: StorageEvent) => { if (e.key === 'wishlist') loadWishlistCount(); };
    const handleWishlistUpdate = () => loadWishlistCount();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024 && isMenuOpen) setIsMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setIsProfileDropdownOpen(false);
    try {
      await logout();
      // alert('Vous avez été déconnecté avec succès');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      // alert('Erreur lors de la déconnexion: ' + message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
    setActiveSubcategory(null); // Close subcategories when switching categories
  };

  const toggleSubcategory = (subcategoryName: string) => {
    setActiveSubcategory(activeSubcategory === subcategoryName ? null : subcategoryName);
  };
  
  const handleLoginSuccess = async (userData: { name: string; [key: string]: unknown }) => { await login(userData); setIsLoginModalOpen(false); };

  const navigateToProfile = () => { setIsProfileDropdownOpen(false); window.location.href = '/profile'; };
  const navigateToOrders = () => { setIsProfileDropdownOpen(false); window.location.href = '/orders'; };
  const navigateToDashboard = () => { setIsProfileDropdownOpen(false); window.location.href = '/admin'; };

  // Search Logic
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    
    // Search broadly across names, brands, and categories
    return products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      (p.brand && p.brand.toLowerCase().includes(query)) ||
      (p.slug && p.slug.toLowerCase().includes(query))
    ).slice(0, 4); // Limit to 4 results
  };

  const searchResults = getSearchResults();

  return (
    <>
      <div className="w-full relative navbar-font">
        {/* Announcement Bar */}
        <div className="announcement-bar lg:block z-10">


        </div>

        {/* Main Navbar */}
        <nav className={`main-nav fixed  ${typeof window !== 'undefined' && window.scrollY > 10 ? 'scrolled' : ''} w-full z-[100]`} style={{ top: 0 }}>
          {/* <div className="relative w-full lg:h-[90px] h-[30px]">
            <Image src="/img/BANNER RAMADAN JAMALI.png" alt="logo" fill className="object-cover" />
          </div> */}
          {/* Actually handle scroll class properly */}
          <div className={`main-nav w-full z-[10] transition-all duration-300 ${isScrolled ? 'scrolled' : ''}`}>
            {/* Top row: search | logo | actions */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-5">

                {/* Search - Left */}
                <div className="hidden lg:flex items-center flex-1">
                  <div className="search-wrapper" ref={searchWrapperRef}>
                    <input
                      type="text"
                      placeholder="Rechercher un produit..."
                      className="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                    />
                    <Search size={15} className="search-icon" />
                    
                    {/* Live Search Dropdown */}
                    {isSearchFocused && searchQuery.length > 0 && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-100 shadow-xl z-50 rounded-sm">
                        {searchResults.length > 0 ? (
                          <div className="max-h-80 overflow-y-auto">
                            {searchResults.map((product) => (
                              <button 
                                key={product.id}
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setIsProductModalOpen(true);
                                  setIsSearchFocused(false);
                                }}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors text-left"
                              >
                                <div className="w-10 h-10 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                                  <img 
                                    src={getProductImageUrl(product.image_url)} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] uppercase font-semibold text-[#41cdcf] truncate" style={{ fontFamily: "'Jost', sans-serif" }}>
                                    {product.brand || "Produit"}
                                  </p>
                                  <p className="text-xs text-black truncate" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>
                                    {product.name}
                                  </p>
                                  {/* <p className="text-xs text-black truncate" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>
                                    {product.discounted_price} DH
                                  </p> */}
                                </div>
                              </button>
                            ))}
                            
                            <div className="p-2 border-t border-gray-100 bg-gray-50">
                              <Link 
                                href={`/products`}
                                className="block w-full text-center text-xs py-1.5 text-[#f54f9a] hover:text-[#d4326e] transition-colors"
                                style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500 }}
                              >
                                Voir tous les résultats
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 text-center text-sm text-gray-400" style={{ fontFamily: "'Jost', sans-serif" }}>
                            Aucun produit trouvé.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Logo - Center */}
                <div className="flex-shrink-0 flex justify-center flex-1 lg:flex-initial logo-area">
                  <Link href="/" style={{ textDecoration: 'none' }}>
                    <Image src="/img/logo2.png" alt="Logo" width={200} height={200} />
                  </Link>
                </div>

                {/* Actions - Right */}
                <div className="flex items-center gap-6 lg:gap-8 flex-1 justify-end">

                  {/* Login / Profile */}
                  {isLoading ? (
                    <div className="w-16 h-4 bg-gray-100 animate-pulse rounded hidden sm:block" />
                  ) : isAuthenticated && user ? (
                    <div className="relative hidden sm:block z-[100]" ref={profileDropdownRef}>
                      <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="action-btn">
                        <User />
                        <span>{user.name}</span>
                        <ChevronDown size={12} style={{ transition: 'transform 0.3s', transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                      </button>
                      <div className={`profile-dropdown ${isProfileDropdownOpen ? 'visible-drop' : 'hidden-drop'}`}>
                        <div className="profile-dropdown-header">
                          <div className="name">{user.name}</div>
                          <div className="email">{user.email}</div>
                        </div>
                        <button onClick={navigateToProfile} className="dropdown-item"><Settings size={14} /> Profil</button>
                        <button onClick={navigateToOrders} className="dropdown-item"><Package size={14} /> Commandes</button>
                        {user.role === 'admin' && (
                          <button onClick={navigateToDashboard} className="dropdown-item"><LayoutDashboard size={14} /> Dashboard</button>
                        )}
                        <button onClick={handleLogout} disabled={isLoggingOut} className="dropdown-item danger"><LogOut size={14} /> Déconnexion</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setIsLoginModalOpen(true)} className="action-btn hidden sm:flex">
                      <User />
                      <span>Se connecter</span>
                    </button>
                  )}

                  {/* Wishlist */}
                  <a href="/wishlist" className="action-btn hidden sm:flex" style={{ position: 'relative' }}>
                    <Heart />
                    {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
                  </a>

                  {/* Cart */}
                  <a href="/cart" className="action-btn hidden sm:flex" style={{ position: 'relative' }}>
                    <div style={{ position: 'relative' }}>
                      <ShoppingBag />
                      {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </div>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {cartCount > 0 ? `${cartCount} article${cartCount > 1 ? 's' : ''}` : 'Panier'}
                    </span>
                  </a>

                  {/* Mobile hamburger */}
                  <button className="lg:!hidden action-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Bar */}
            <div className={`bottom-nav ${isMenuOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center lg:space-x-2">
                  {navigationItems.map((category) => (
                    <div key={category.name} className="nav-category relative group">
                      <div className="flex items-center justify-between lg:block">
                        <a
                          href={`/products?category=${encodeURIComponent(category.name)}`}
                          className="nav-category-link"
                        >
                          {category.name}
                          {category.subcategories && category.subcategories.length > 0 && (
                            <ChevronDown size={11} className="hidden lg:inline-block opacity-60" />
                          )}
                        </a>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <button
                            onClick={(e) => { e.preventDefault(); toggleCategory(category.name); }}
                            className="lg:hidden px-3 py-2 text-gray-400"
                          >
                            <ChevronDown size={14} style={{ transform: activeCategory === category.name ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                          </button>
                        )}
                      </div>

                      {/* Level 2 */}
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className={`nav-dropdown ${isMenuOpen ? (activeCategory === category.name ? 'block !opacity-100 !visible' : 'hidden') : ''}`}>
                          {category.subcategories.map((sub: NavItem) => (
                            <div key={sub.name} className="nav-dropdown-item relative group/sub">
                              <a
                                href={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub.name)}`}
                                className="nav-dropdown-link"
                              >
                                {sub.name}
                              </a>
                              {sub.subcategories && sub.subcategories.length > 0 && (
                                <>
                                  <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSubcategory(sub.name); }}
                                    className="px-4 text-gray-400 hover:text-[#41cdcf] lg:cursor-default"
                                  >
                                    <ChevronDown size={11} className="hidden lg:block -rotate-90" />
                                    <ChevronDown size={11} className="lg:hidden" style={{ transform: activeSubcategory === sub.name ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                                  </button>

                                  {/* Level 3 */}
                                  <div className={`nav-subdropdown ${isMenuOpen ? (activeSubcategory === sub.name ? '!opacity-100 !visible block' : 'hidden') : ''}`}>
                                    {sub.subcategories.map((subSub: NavItem) => (
                                      <a
                                        key={subSub.name}
                                        href={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub.name)}&subsubcategory=${encodeURIComponent(subSub.name)}`}
                                        className="nav-dropdown-link block border-b border-gray-50 last:border-0"
                                      >
                                        {subSub.name}
                                      </a>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
    </>
  );
};

export default Navbar;