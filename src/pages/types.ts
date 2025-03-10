export interface Category {
    id: number;
    category_name: string;
    color: string;
  }
  
  export interface ProductVariant {
    id: number;
    name: string;
    price: string;
    stock: number;
    size: string | null;
    color: string | null;
    weight: string | null;
  }
  
  export interface Product {
    id: number;
    store_id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    cover_image: string;
    background_image: string | null;
    discount_type: string | null;
    discount_value: string | null;
    discounted_price: string;
    rating: string | null;
    barcode: string | null;
    qr_code: string | null;
    serial_number: string | null;
    track_stock: number;
    track_stock_number: string | null;
    size: string | null;
    color: string | null;
    material: string | null;
    style: string | null;
    gender: string | null;
    capacity: string | null;
    weight: string | null;
    created_at: string;
    updated_at: string;
    images: string[];
    ratings: any[];
    categories: Category[];
    variants: ProductVariant[];
    in_wishlist?: boolean;
  }
  
  