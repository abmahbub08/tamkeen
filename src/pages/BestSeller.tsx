import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Flame } from 'lucide-react';
import ProductCard from './ProductCardComp';

type Product = {
    id: number;
    store_id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    cover_image: string | null;
    color: string | null;
    size: string | null;
    discounted_price: string;
    rating: string;
    orders_count: number;
  };
  
const BestSellProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const response = await axios.get('https://api.tamkeen.center/api/best-selling-products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching best-selling products:', error);
        setLoading(false);
      }
    };

    fetchBestSellingProducts();
  }, []);

  const handleAddToCart = (id: number) => {
    console.log(`Added product ${id} to cart`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sky-50">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-sky-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 py-16 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-12 space-x-4">
          <div className="bg-sky-100 p-3 rounded-full">
            <Flame className="w-8 h-8 text-sky-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-sky-900 tracking-tight">
            Best Selling Products
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <div className="col-span-full text-center mt-24 py-10 text-sky-500">
              No best-selling products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestSellProduct;
