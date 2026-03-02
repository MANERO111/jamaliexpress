'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import axios from '@/lib/axios';
import { useCart } from '@/contexts/CartContext';
import { getProductImageUrl } from '@/utils/imageHelper';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  stock_quantity: number;
}

interface Category {
  id: number;
  name: string;
}

interface ProductListProps {
  categoryName: string;
}

const ProductList: React.FC<ProductListProps> = ({ categoryName }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>({});
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories')
        ]);

        const allProducts = productsResponse.data.data || productsResponse.data;
        const allCategories = categoriesResponse.data.data || categoriesResponse.data;

        setProducts(allProducts);

        const category = allCategories.find((c: Category) => 
          c.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (category) {
          const filtered = allProducts.filter((p: Product) => p.category_id === category.id);
          setFilteredProducts(filtered);
        } else {
            console.warn(`Category "${categoryName}" not found.`);
            setFilteredProducts([]);
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
  }, [categoryName]);

  const formatPrice = (price: number) => {
    return `${parseFloat(price.toString()).toFixed(2)} DH`;
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-600">
        Erreur: {error}
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 uppercase text-center border-b pb-4">
          {categoryName}
        </h1>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                   {product.image_url ? (
                      <img 
                        src={getProductImageUrl(product.image_url)} 
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  
                  {product.stock_quantity < 5 && product.stock_quantity > 0 && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      Stock faible
                    </span>
                  )}
                  {product.stock_quantity === 0 && (
                     <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Rupture
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock_quantity === 0 || addingToCart[product.id]}
                      className="inline-flex items-center justify-center p-2 rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Ajouter au panier"
                    >
                      {addingToCart[product.id] ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ShoppingCart size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun produit trouvé pour la catégorie {categoryName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
