'use client';
import React from 'react';
import { Package, AlertTriangle, XCircle, RefreshCw, Search, Plus } from 'lucide-react';
import { getProductImageUrl } from '@/utils/imageHelper';

import { Product } from '@/types/admin';

interface InventoryProps {
  products: Product[];
}

const Inventory: React.FC<InventoryProps> = ({ products }) => {
  const [visibleCount, setVisibleCount] = React.useState(50);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 50);
  };

  return (
    <div className="space-y-6 mb-40">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion d&apos;Inventaire</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm w-64"
            />
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 transition-colors">
            <RefreshCw size={20} />
            <span>Mise à jour en lot</span>
          </button>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Stock Total</p>
              <p className="text-2xl font-bold text-gray-900">{products.reduce((sum, p) => sum + (p.stock_quantity || p.stock || 0), 0)}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Stock Faible</p>
              <p className="text-2xl font-bold text-red-600">{products.filter(p => (p.stock_quantity || p.stock || 0) < 10).length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500 bg-red-50 p-1.5 rounded-lg" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rupture de Stock</p>
              <p className="text-2xl font-bold text-red-600">{products.filter(p => (p.stock_quantity || p.stock || 0) === 0).length}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500 bg-red-50 p-1.5 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actuel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Min</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedProducts.map((product) => {
                const currentStock = product.stock_quantity || product.stock || 0;
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={getProductImageUrl(product.image_url)} 
                          alt={product.name} 
                          className="w-12 h-12 rounded-lg object-cover mr-4" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400';
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">
                            {typeof product.category === 'object' ? product.category.name : (product.category || 'N/A')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${currentStock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {currentStock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">10</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {currentStock === 0 ? (
                        <span className="inline-flex px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-800 uppercase tracking-wider">
                          Rupture
                        </span>
                      ) : currentStock < 10 ? (
                        <span className="inline-flex px-2.5 py-0.5 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 uppercase tracking-wider">
                          Stock Faible
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-800 uppercase tracking-wider">
                          En Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                        Réapprovisionner
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 text-gray-200 mb-2" />
                      <p>Aucun produit trouvé</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {filteredProducts.length > 0 && (
        <div className="mt-8 flex flex-col items-center space-y-4">
          <p className="text-sm text-gray-500">
            Affichage de <span className="font-medium text-gray-900">{displayedProducts.length}</span> sur{" "}
            <span className="font-medium text-gray-900">{filteredProducts.length}</span> articles
          </p>
          
          {hasMore && (
            <button
              onClick={handleLoadMore}
              className="group relative flex items-center gap-3 px-10 py-3.5 bg-white border border-gray-300 rounded-xl shadow-sm hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
            >
              <span className="text-sm font-bold uppercase tracking-wider">Charger plus d&apos;articles</span>
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          )}

          <div className="w-72 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shadow-inner">
            <div 
              className="h-full bg-red-600 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]"
              style={{ width: `${(displayedProducts.length / filteredProducts.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;