'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/axios';
import { useCart } from '@/contexts/CartContext';
import { getProductImageUrl } from '@/utils/imageHelper';

interface Product {
  id: number;
  name: string;
  description: string;
  original_price: number;
  discounted_price?: number | null;
  image_url: string;
  category_id: number;
  stock_quantity: number;
}

interface Category {
  id: number;
  name: string;
}

const ProductsShowcase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Get cart functions
  const { addToCart } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories')
        ]);
        
        const productsData = productsResponse.data.data || productsResponse.data;
        const categoriesData = categoriesResponse.data.data || categoriesResponse.data;
        
        setProducts(productsData);
        setCategories(categoriesData);
        
        // Set first category as active if available
        if (categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].name);
        }
        
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products by category
  useEffect(() => {
    if (products.length > 0 && categories.length > 0) {
      const currentCategory = categories.find(c => c.name === activeCategory);
      if (currentCategory) {
        const filtered = products.filter(product => product.category_id === currentCategory.id);
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts([]);
      }
    }
  }, [products, activeCategory, categories]);

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return '0.00 DH';
    return `${parseFloat(price.toString()).toFixed(2)} DH`;
  };

  // Handle adding product to cart
  const handleAddToCart = async (product: Product) => {
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      const result = await addToCart(product, 1);
      
      if (result.success) {
        console.log('Product added to cart successfully');
      } else {
        alert(result.message || 'Erreur lors de l\'ajout au panier');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      scrollRight();
    } else if (isRightSwipe) {
      scrollLeft();
    }
    
    setIsDragging(false);
  };

  // Mouse handlers for desktop dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !touchStart) return;
    e.preventDefault();
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      scrollRight();
    } else if (isRightSwipe) {
      scrollLeft();
    }
    
    setIsDragging(false);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Scroll functions for carousel
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = (scrollContainerRef.current.children[0] as HTMLElement)?.offsetWidth || 288;
      scrollContainerRef.current.scrollBy({
        left: -(cardWidth + 24), // card width + gap
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = (scrollContainerRef.current.children[0] as HTMLElement)?.offsetWidth || 288;
      scrollContainerRef.current.scrollBy({
        left: cardWidth + 24, // card width + gap
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-400 to-cyan-300 min-h-1/3 flex items-center justify-center">
        <div className="text-white text-xl">Chargement des produits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-blue-400 to-cyan-300 min-h-1/3 flex items-center justify-center">
        <div className="text-white text-xl">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#DEF9FF] min-h-[750px] max-w-screen overflow-hidden">
      <div className="container-fluid mx-auto px-2 sm:px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Side - Woman Image */}
          <div className="relative hidden lg:block">
            <div className="relative h-[600px] lg:h-[700px]">
              <img 
                src="img/productPic.png" 
                alt="Woman applying skincare product"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right Side - Products */}
          <div className="space-y-6 sm:space-y-8 w-full overflow-hidden">
            
            {/* Category Tabs */}
            <div className="flex justify-center lg:justify-start space-x-4 sm:space-x-8 px-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.name)}
                  className={`text-base sm:text-lg font-medium transition-colors duration-300 whitespace-nowrap ${
                    activeCategory === category.name
                      ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Products Carousel */}
            <div className="relative">



              {/* Products container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 cursor-grab active:cursor-grabbing select-none"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  scrollSnapType: 'x mandatory',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="flex-shrink-0 w-64 sm:w-72 bg-transparent flex flex-col items-center text-center relative group"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <Link 
                        href={`/products?category=${encodeURIComponent(activeCategory)}`}
                        className="w-full flex flex-col items-center text-center"
                        style={{ textDecoration: 'none' }}
                      >
                        {/* Product Image */}
                        <div className="w-full aspect-square bg-transparent relative overflow-hidden mb-4">
                          {product.image_url ? (
                            <img 
                              src={getProductImageUrl(product.image_url )} 
                              alt={product.name}
                              className="w-full h-full object-contain pointer-events-none"
                              draggable={false}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-20 h-24 bg-white/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                  <span className="text-white/60 text-sm font-medium">Galby</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Stock indicator */}
                          {product.stock_quantity < 5 && product.stock_quantity > 0 && (
                            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                              Stock faible
                            </div>
                          )}
                          {product.stock_quantity === 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                              Rupture
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="w-full">
                          <h3 className="font-bold text-black text-sm mb-2 line-clamp-2 uppercase tracking-wide">
                            {product.name}
                          </h3>
                          
                          <p className="text-black/70 text-xs mb-4 line-clamp-2 px-2">
                            {product.description}
                          </p>
                          
                          <div className="flex flex-col items-center mb-4">
                            <span className="text-lg font-bold text-black">
                              {formatPrice((product.discounted_price && Number(product.discounted_price) > 0) ? product.discounted_price : product.original_price)}
                            </span>
                            {product.discounted_price && product.discounted_price > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.original_price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                        
                      {/* Add to Cart Button */}
                      <button 
                        className="w-full bg-transparent border-2 border-black hover:bg-black hover:text-white px-4 py-3 text-sm font-medium text-black transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black uppercase tracking-wider"
                        disabled={product.stock_quantity === 0 || addingToCart[product.id]}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>
                          {addingToCart[product.id] ? 'ajout en cours...' : 'ajouter au panier'}
                        </span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center py-12">
                    <p className="text-white text-lg">
                      Aucun produit trouvé pour la catégorie {activeCategory}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Optional: Show total count */}
            {/* {filteredProducts.length > 0 && (
              <div className="text-center mt-4">
                <p className="text-white/80 text-sm">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
                </p>
              </div>
            )} */}
          </div>
        </div>
      </div>
      
      {/* Custom styles for hiding scrollbar and smooth scrolling */}
      <style jsx>{`
        .scrollbar-hide {
          -webkit-overflow-scrolling: touch;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProductsShowcase;