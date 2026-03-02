'use client';
import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

interface ProductFilterProps {
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  searchQuery: string;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onSortChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  minPrice,
  maxPrice,
  sortBy,
  searchQuery,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  onSearchChange,
  onClearFilters,
  isOpen = true,
  onClose
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Filter Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto
        w-80 lg:w-full bg-white border-r lg:border-r-0 lg:border border-gray-200 
        overflow-y-auto z-50 lg:z-0 p-6 rounded-lg
        transition-transform duration-300 lg:transition-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal size={20} />
            Filtres
          </h2>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal size={20} />
            Filtres
          </h2>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rechercher
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Nom du produit..."
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA2D27] text-sm"
          />
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Prix (DH)
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => onMinPriceChange(Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA2D27] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA2D27] text-sm"
              />
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trier par
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA2D27] text-sm bg-white"
          >
            <option value="">Par défaut</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="name_asc">Nom A-Z</option>
            <option value="name_desc">Nom Z-A</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={onClearFilters}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          Réinitialiser les filtres
        </button>
      </aside>
    </>
  );
};

export default ProductFilter;
