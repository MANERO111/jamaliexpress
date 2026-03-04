import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from '@/data/mockProducts';

export interface Product {
    id: number;
    name: string;
    brand?: string; // Added brand field
    description: string;
    original_price: number;
    discounted_price?: number | null;
    image_url: string;
    category_id: number;
    subcategory_id?: number | null;
    sub_subcategory_id?: number | null;
    price: number;
    slug: string;
    stock_quantity: number;
    active: boolean;
    created_at: string;
    updated_at: string;
}

// Based on DB structure of separate tables
export interface SubSubcategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    subcategory_id: number;
}

export interface Subcategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    category_id: number;
    sub_subcategories?: SubSubcategory[];
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    subcategories?: Subcategory[];
}

interface UseProductsReturn {
    products: Product[];
    categories: Category[];
    loading: boolean;
    error: string | null;
}

export const useProducts = (): UseProductsReturn => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

                if (productsData && productsData.length > 0) {
                    setProducts(productsData);
                } else {
                    setProducts(FALLBACK_PRODUCTS);
                }

                if (categoriesData && categoriesData.length > 0) {
                    setCategories(categoriesData);
                } else {
                    setCategories(FALLBACK_CATEGORIES);
                }

                setError(null);
            } catch (err: unknown) {
                console.error('Error fetching data, using fallback products instead:', err);
                setProducts(FALLBACK_PRODUCTS);
                setCategories(FALLBACK_CATEGORIES);
                setError(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { products, categories, loading, error };
};
