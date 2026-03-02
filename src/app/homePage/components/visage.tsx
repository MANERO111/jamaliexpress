'use client';
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';

// Defines the Product interface
interface Product {
  id: number;
  brand: string;
  name: string;
  volume: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
}

// Mock Data for 10 products
const products: Product[] = [
  {
    id: 1,
    brand: 'LA ROCHE POSAY',
    name: 'CICAPLAST BAUME B5+',
    volume: '100ML + 50ML OFFERT',
    price: 169.00,
    originalPrice: 199.00,
    discount: 15,
    image: '/images/products/cicaplast.png' // Placeholder path
  },
  {
    id: 2,
    brand: 'LA ROCHE POSAY',
    name: 'HYALU B5 SÉRUM ANTI-RIDES',
    volume: '30ML + 10ML OFFERT',
    price: 340.00,
    originalPrice: 352.00,
    discount: 3,
    image: '/images/products/hyalu.png'
  },
  {
    id: 3,
    brand: 'LA ROCHE POSAY',
    name: 'PURE VITAMIN C10 SÉRUM',
    volume: '30ML + 10ML OFFERT',
    price: 340.00,
    originalPrice: 352.00,
    discount: 3,
    image: '/images/products/vitamin-c.png'
  },
  {
    id: 4,
    brand: 'LA ROCHE POSAY',
    name: 'RETINOL B3 SÉRUM',
    volume: '30ML + 10ML OFFERT',
    price: 340.00,
    originalPrice: 352.00,
    discount: 3,
    image: '/images/products/retinol.png'
  },
  {
    id: 5,
    brand: 'LA ROCHE POSAY',
    name: 'EFFACLAR DUO+',
    volume: '40ML + GEL 50ML OFFERT',
    price: 180.00,
    originalPrice: 210.00,
    discount: 14,
    image: '/images/products/effaclar.png'
  },
    {
    id: 6,
    brand: 'CERAVE',
    name: 'MOISTURIZING CREAM',
    volume: '454G',
    price: 220.00,
    originalPrice: 250.00,
    discount: 12,
    image: '/images/products/cerave-cream.png'
  },
  {
    id: 7,
    brand: 'VICHY',
    name: 'MINÉRAL 89',
    volume: '50ML',
    price: 280.00,
    originalPrice: 310.00,
    discount: 10,
    image: '/images/products/vichy-89.png'
  },
  {
    id: 8,
    brand: 'BIODERMA',
    name: 'SENSIBIO H2O',
    volume: '500ML',
    price: 130.00,
    originalPrice: 150.00,
    discount: 13,
    image: '/images/products/sensibio.png'
  },
  {
    id: 9,
    brand: 'AVĖNE',
    name: 'THERMAL SPRING WATER',
    volume: '300ML',
    price: 90.00,
    originalPrice: 110.00,
    discount: 18,
    image: '/images/products/avene-water.png'
  },
   {
    id: 10,
    brand: 'EUCERIN',
    name: 'EUCERIN OIL CONTROL',
    volume: '50ML',
    price: 190.00,
    originalPrice: 220.00,
    discount: 14,
    image: '/images/products/eucerin-oil.png'
  }
];

const Visage = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300; // Adjust as needed
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <section className="py-8 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Left Banner Section */}
                    <div className="md:w-1/4 w-full relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-[#4DD0E1] to-[#26C6DA] text-white p-6 flex flex-col justify-between min-h-[400px] group cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
                        <Link href="/products?category=Visage" className="absolute inset-0 z-20" aria-label="Go to Visage category"></Link>
                         {/* Background decorative circles */}
                        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                        
                        <div className="relative z-10 text-center pointer-events-none">
                            <h2 className="text-3xl font-bold mb-2 tracking-wide uppercase drop-shadow-md pt-6">Visage</h2>
                            <p className="text-white/90 text-sm mb-6 font-medium">Découvrez notre gamme de soins</p>
                            
                            <div className="my-8 mx-auto w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/30">
                                {/* Placeholder for a featured product or icon */}
                                <Heart className="w-16 h-16 text-white drop-shadow-lg" />
                            </div>
                        </div>

                        <div className="relative z-10 text-center pb-4 pointer-events-none">
                            <button className="bg-white text-[#00ACC1] font-bold py-3 px-8 rounded-full shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 uppercase tracking-wider text-sm">
                                Voir Tout
                            </button>
                        </div>
                    </div>

                    {/* Right Product Carousel Section */}
                    <div className="md:w-3/4 w-full relative group">
                        
                        {/* Navigation Buttons */}
                         <button 
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 text-gray-700 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        
                        <button 
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 text-gray-700 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>


                        {/* Scrollable Container */}
                        <div 
                            ref={scrollContainerRef}
                            className="flex overflow-x-auto gap-4 pb-4 pt-2 px-1 snap-x snap-mandatory scrollbar-hide"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {products.map((product) => (
                                <div key={product.id} className="min-w-[240px] md:min-w-[260px] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-4 flex flex-col snap-start relative">
                                    
                                    {/* Discount Badge */}
                                    {product.discount > 0 && (
                                        <div className="absolute top-0 right-0 bg-[#F48FB1] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl z-10 shadow-sm">
                                            -{product.discount}%
                                        </div>
                                    )}

                                    {/* Product Image Area */}
                                    <div className="relative w-full h-48 mb-4 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden group/image">
                                         {/* Placeholder Image Logic since we don't have real images */}
                                        <div className="relative w-full h-full flex items-center justify-center text-gray-300">
                                            {/* <Image 
                                                src={product.image} 
                                                alt={product.name} 
                                                fill 
                                                className="object-contain p-4 group-hover/image:scale-105 transition-transform duration-300"
                                            /> */}
                                            <div className="text-center p-2">
                                                <div className="w-16 h-32 mx-auto bg-gray-200 rounded-md shadow-inner flex items-center justify-center mb-2">
                                                    <span className="text-xs text-gray-400">IMG</span>
                                                </div>
                                            </div>
                                            
                                             {/* "OFFERTE" vertical badge simulated */}
                                             <div className="absolute right-2 top-10 flex flex-col items-center gap-1">
                                                 {product.name.includes("OFFERT") && (
                                                    <span className="text-[10px] font-bold text-[#4DD0E1] border border-[#4DD0E1] rounded px-1 py-0.5 bg-white uppercase tracking-tighter">
                                                        Offert
                                                    </span>
                                                 )}
                                             </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow flex flex-col gap-1">
                                        <p className="text-[#888] text-[10px] font-bold uppercase tracking-wide truncate">{product.brand}</p>
                                        <h3 className="text-slate-800 text-sm font-semibold leading-tight line-clamp-2 min-h-[2.5em]">{product.name}</h3>
                                        <p className="text-xs text-gray-500 mb-2 truncate">{product.volume}</p>
                                        
                                        <div className="mt-auto">
                                            <div className="flex items-center gap-2 mb-3">
                                                 <span className="text-[#333] font-bold text-lg">{product.price.toFixed(2)} dh</span>
                                                 {product.originalPrice > product.price && (
                                                    <span className="text-gray-400 text-xs line-through decoration-gray-400">{product.originalPrice.toFixed(2)} dh</span>
                                                 )}
                                            </div>
                                            
                                            <button className="w-full bg-white hover:bg-[#F48FB1] text-slate-700 hover:text-white border border-gray-200 hover:border-[#F48FB1] font-medium py-2 rounded-lg transition-colors duration-300 text-xs uppercase flex items-center justify-center gap-2 group/btn">
                                                <span>Ajouter au panier</span>
                                                <ShoppingCart className="w-3 h-3 group-hover/btn:text-white transition-colors" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Visage;
