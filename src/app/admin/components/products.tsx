'use client';
import React, { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { getProductImageUrl } from '@/utils/imageHelper';

import { Product, Category, Subcategory, SubSubcategory } from '@/types/admin';
import Image from 'next/image';

interface ProductsProps {
  products: Product[];
  categories: Category[];
  subCategories: Subcategory[];
  subSubCategories: SubSubcategory[];
  getStatusColor: (status: string) => string;
  openModal: (type: string, item?: Product | Category | Subcategory | SubSubcategory | null) => void;
  deleteProduct: (id: number) => Promise<void>;
}

const Products: React.FC<ProductsProps> = ({
  products,
  categories,
  subCategories,
  subSubCategories,
  getStatusColor,
  openModal,
  deleteProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(50);

  const getCategoryPath = (product: Product) => {
    const cat = categories.find(c => c.id === product.category_id);
    const sub = subCategories.find(s => s.id === product.subcategory_id);
    const subsub = subSubCategories.find(ss => ss.id === product.sub_subcategory_id);

    let path = cat?.name || 'N/A';
    if (sub) path += ` > ${sub.name}`;
    if (subsub) path += ` > ${subsub.name}`;
    return path;
  };

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = product.name?.toLowerCase().includes(searchLower) || 
                          product.brand?.toLowerCase().includes(searchLower) ||
                          product.id.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || product.category_id.toString() === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 50);
  };

  // Reset visibleCount when filters change
  React.useEffect(() => {
    setVisibleCount(50);
  }, [searchTerm, filterStatus, filterCategory]);

  return (
    <div className="space-y-6 mb-40">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
        <button
          onClick={() => openModal('product')}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nouveau Produit</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher des produits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-red-500"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-red-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="draft">Brouillon</option>
          <option value="out_of_stock">Rupture de stock</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix O.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix R.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Image
                        src={getProductImageUrl(product.image_url)}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.brand || '---'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs" title={getCategoryPath(product)}>
                    {getCategoryPath(product)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.original_price}DH</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{product.discounted_price ? `${product.discounted_price}DH` : '---'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${(product.stock_quantity || product.stock || 0) < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock_quantity || product.stock || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status || 'active')}`}>
                      {product.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900"><Eye size={16} /></button>
                      <button
                        onClick={() => openModal('product', product)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex flex-col items-center space-y-4">
        <p className="text-sm text-gray-500">
          Affichage de <span className="font-medium text-gray-900">{displayedProducts.length}</span> sur{" "}
          <span className="font-medium text-gray-900">{filteredProducts.length}</span> produits
        </p>
        
        {hasMore && (
          <button
            onClick={handleLoadMore}
            className="group relative flex items-center gap-3 px-8 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-300"
          >
            <span className="text-sm font-semibold text-gray-700">Charger plus de produits</span>
            <Plus size={18} className="text-red-600 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        )}

        <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600 transition-all duration-500"
            style={{ width: `${(displayedProducts.length / filteredProducts.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;