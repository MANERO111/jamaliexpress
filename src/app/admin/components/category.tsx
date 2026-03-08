'use client';
import React, { useState } from 'react';
import { Plus, Tag, Edit, Trash2, ChevronRight, Layers, LayoutGrid } from 'lucide-react';

import { Category, Subcategory, SubSubcategory, Product } from '@/types/admin';

interface CategoriesProps {
  categories: Category[];
  subCategories: Subcategory[];
  subSubCategories: SubSubcategory[];
  products?: Product[];
  openModal: (type: string, item?: Category | Subcategory | SubSubcategory | Product) => void;
  deleteCategory: (id: number) => Promise<void>;
  deleteSubCategory: (id: number) => Promise<void>;
  deleteSubSubCategory: (id: number) => Promise<void>;
}

const Categories: React.FC<CategoriesProps> = ({
  categories,
  subCategories,
  subSubCategories,
  products = [],
  openModal,
  deleteCategory,
  deleteSubCategory,
  deleteSubSubCategory
}) => {
  const [activeView, setActiveView] = useState<'main' | 'sub' | 'subsub'>('main');

  const getProductCount = (type: 'category' | 'subcategory' | 'subsubcategory', id: number): number => {
    return products.filter(product => {
      if (type === 'category') return product.category_id === id;
      if (type === 'subcategory') return product.subcategory_id === id;
      return product.sub_subcategory_id === id;
    }).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des High-Level Categories</h2>
          <p className="text-sm text-gray-500">Gérez la hiérarchie de vos catégories (3 niveaux)</p>
        </div>
        <div className="flex items-center space-x-2">
          {activeView === 'main' && (
            <button 
              onClick={() => openModal('category')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Nouvelle Catégorie</span>
            </button>
          )}
          {activeView === 'sub' && (
            <button 
              onClick={() => openModal('subcategory')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Nouvelle Sous-catégorie</span>
            </button>
          )}
          {activeView === 'subsub' && (
            <button 
              onClick={() => openModal('sub_subcategory')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Nouvelle Sous-sous-catégorie</span>
            </button>
          )}
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveView('main')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeView === 'main' 
              ? 'border-red-600 text-red-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <LayoutGrid size={18} />
            <span>Catégories ({categories.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveView('sub')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeView === 'sub' 
              ? 'border-red-600 text-red-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Layers size={18} />
            <span>Sous-catégories ({subCategories.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveView('subsub')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeView === 'subsub' 
              ? 'border-red-600 text-red-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <ChevronRight size={18} />
            <span>Sous-sous-catégories ({subSubCategories.length})</span>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeView === 'main' ? 'Catégorie' : activeView === 'sub' ? 'Sous-catégorie' : 'Sous-sous-catégorie'}
              </th>
              {(activeView === 'sub' || activeView === 'subsub') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produits</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activeView === 'main' && categories.map((category) => {
              const productCount = getProductCount('category', category.id);
              const subCount = subCategories.filter(sc => sc.category_id === category.id).length;
              return (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{category.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {productCount} produits
                    </span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {subCount} sous-cat.
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal('category', category)} className="text-green-600 hover:text-green-900 mr-3"><Edit size={16} /></button>
                    <button onClick={() => deleteCategory(category.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                  </td>
                </tr>
              );
            })}

            {activeView === 'sub' && subCategories.map((sc) => {
              const parent = categories.find(c => c.id === sc.category_id);
              const productCount = getProductCount('subcategory', sc.id);
              const sscCount = subSubCategories.filter(ssc => ssc.subcategory_id === sc.id).length;
              return (
                <tr key={sc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sc.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{parent?.name || 'Inconnu'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{sc.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {productCount} produits
                    </span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {sscCount} ss-sous-cat.
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal('subcategory', sc)} className="text-green-600 hover:text-green-900 mr-3"><Edit size={16} /></button>
                    <button onClick={() => deleteSubCategory(sc.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                  </td>
                </tr>
              );
            })}

            {activeView === 'subsub' && subSubCategories.map((ssc) => {
              const parent = subCategories.find(sc => sc.id === ssc.subcategory_id);
              const productCount = getProductCount('subsubcategory', ssc.id);
              return (
                <tr key={ssc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ssc.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{parent?.name || 'Inconnu'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{ssc.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {productCount} produits
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal('sub_subcategory', ssc)} className="text-green-600 hover:text-green-900 mr-3"><Edit size={16} /></button>
                    <button onClick={() => deleteSubSubCategory(ssc.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                  </td>
                </tr>
              );
            })}

            {(activeView === 'main' && categories.length === 0) || 
             (activeView === 'sub' && subCategories.length === 0) || 
             (activeView === 'subsub' && subSubCategories.length === 0) ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Aucun élément trouvé dans cette catégorie.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;