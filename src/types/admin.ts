export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface Subcategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    category_id: number;
    created_at: string;
    updated_at: string;
}

export interface SubSubcategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    subcategory_id: number;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    brand?: string;
    description?: string;
    price: number;
    original_price?: number | string;
    discounted_price?: number | string | null;
    stock_quantity: number;
    stock?: number;
    image_url?: string;
    created_at: string;
    updated_at: string;
    category_id: number;
    subcategory_id?: number | null;
    sub_subcategory_id?: number | null;
    active?: boolean;
    status?: string;
    category?: Category;
}

export interface User {
    id: number;
    name: string;
    email?: string;
    role: string;
    status: string;
    created_at?: string;
    updated_at?: string;
    email_verified_at?: string | null;
    orders_count?: number;
    orders?: Order[];
}

export interface Order {
    id: number;
    user_id: number;
    total_amount: number | string;
    status: 'pending' | 'paid' | 'shipped' | 'cancelled' | 'canceled' | 'delivered' | 'retour' | string;
    payment_method?: string;
    shipping_address?: string | {
        full_name?: string;
        phone?: string;
        address?: string;
        city?: string;
        postal_code?: string;
    };
    placed_at?: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
        role?: string;
        status?: string;
        phone?: string;
    };
    items_count?: number;
    order_items?: OrderItem[];
    items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number | string;
    product?: Product;
    name?: string;
    image_url?: string;
}

export interface UpdateOrderData {
    status: string;
    total_amount: number;
    shipping_address: {
        full_name: string;
        phone: string;
        address: string;
        city: string;
    };
}
