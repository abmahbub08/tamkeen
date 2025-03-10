import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Flame, Eye, View } from 'lucide-react';

type ProductVariant = {
  id: number;
  color: string | null;
  size: string | null;
  stock: number;
};

type FlashSaleProduct = {
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
  variants?: ProductVariant[];
};

const FlashSalePage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVariants, setSelectedVariants] = useState<{[key: number]: ProductVariant | null}>({});
  const [quantities, setQuantities] = useState<{[key: number]: number}>({});

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const response = await axios.get('https://api.tamkeen.center/api/best-selling-products');
        setProducts(response.data);
        
        // Initialize selected variants and quantities for each product
        const initialVariants: {[key: number]: ProductVariant | null} = {};
        const initialQuantities: {[key: number]: number} = {};
        
        response.data.forEach((product: FlashSaleProduct) => {
          initialVariants[product.id] = product.variants && product.variants.length > 0 
            ? product.variants[0] 
            : null;
          initialQuantities[product.id] = 1;
        });

        setSelectedVariants(initialVariants);
        setQuantities(initialQuantities);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching best-selling products:', error);
        setLoading(false);
      }
    };

    fetchBestSellingProducts();
  }, []);

  const handleAddToCart = async (product: FlashSaleProduct) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('Please log in first');
        return;
      }

      const quantity = quantities[product.id] || 1;
      const selectedVariant = selectedVariants[product.id];

      await axios.post('https://api.tamkeen.center/api/cart/add', 
        {
          cartItems: [
            {
              store_id: product.store_id,
              product_id: selectedVariant ? selectedVariant.id : product.id,
              quantity: quantity
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Cart addition error:', error);
      toast.error('Failed to add product to cart');
    }
  };

  const handleVariantChange = (productId: number, variant: ProductVariant) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant
    }));
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
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
      <Toaster position="top-right" />
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-12 space-x-4">
          <div className="bg-sky-100 p-3 rounded-full">
            <Flame className="w-8 h-8 text-sky-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-sky-900 tracking-tight">
            Flash Sale - Best Selling Products
          </h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map(product => (
              <div 
                key={product.id} 
                className="
                  bg-white rounded-2xl shadow-lg overflow-hidden 
                  transition-all duration-300 
                  hover:shadow-xl hover:-translate-y-2
                  border border-sky-100
                "
              >
                <div className="relative h-56 bg-sky-50 flex items-center justify-center overflow-hidden">
                  {product.cover_image ? (
                    <img
                      src={`https://api.tamkeen.center/${product.cover_image}`}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <span className="text-sky-500 text-lg">No Image</span>
                  )}
                  <div className="absolute top-0 left-0 right-0 flex justify-between p-3">
                    {product.rating && (
                      <div className="bg-amber-400 text-white px-3 py-1 rounded-full flex items-center shadow-md">
                        <Star className="w-4 h-4 mr-1" fill="white" />
                        {product.rating}
                      </div>
                    )}
                    <div className="bg-sky-500 text-white px-2 py-1 rounded-full text-xs shadow-md">
                      {product.orders_count} Sold
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-sky-900 mb-3 truncate">{product.name}</h3>
                  <p className="text-sm text-sky-700 mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="flex items-center">
                        <p className="text-sky-700 font-bold text-2xl mr-3">${product.discounted_price}</p>
                        {product.price !== product.discounted_price && (
                          <span className="text-sky-500 line-through text-sm">
                            ${product.price}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 space-x-2">
                        {/* Variant Selection */}
                        {product.variants && product.variants.length > 0 && (
                          <div className="mt-2">
                            <label className="block text-sm text-sky-700 mb-1">Select Variant:</label>
                            <select 
                              value={selectedVariants[product.id]?.id || ''}
                              onChange={(e) => {
                                const selectedVariant = product.variants?.find(
                                  variant => variant.id === parseInt(e.target.value)
                                );
                                if (selectedVariant) {
                                  handleVariantChange(product.id, selectedVariant);
                                }
                              }}
                              className="w-full px-2 py-1 border border-sky-200 rounded-md text-sm"
                            >
                              {product.variants.map(variant => (
                                <option key={variant.id} value={variant.id}>
                                  {variant.color || variant.size || 'Default Variant'}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Quantity Selection */}
                        <div className="mt-2 flex items-center space-x-2">
                          <label className="text-sm text-sky-700">Qty:</label>
                          <input 
                            type="number" 
                            min="1" 
                            max={(selectedVariants[product.id]?.stock || product.stock)} 
                            value={quantities[product.id] || 1}
                            onChange={(e) => handleQuantityChange(
                              product.id, 
                              parseInt(e.target.value)
                            )}
                            className="w-16 px-2 py-1 border border-sky-200 rounded-md text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <span 
                      className={`
                        text-xs font-semibold px-3 py-1 rounded-full
                        ${product.stock > 0 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-rose-100 text-rose-700'}
                      `}
                    >
                      {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                    </span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      className="
                        flex-grow bg-sky-600 text-white py-3 rounded-lg 
                        flex items-center justify-center space-x-3
                        hover:bg-sky-700 transition duration-300
                        disabled:bg-sky-300 disabled:cursor-not-allowed
                        transform active:scale-95
                      "
                      disabled={
                        (selectedVariants[product.id]?.stock || product.stock) === 0
                      }
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-5 h-6" />
                      <span className="font-semibold">Add  Cart</span>
                    </button>

                    <button
                      className="
                        bg-gray-200 text-gray-700 py-3 rounded-lg 
                        flex items-center justify-center space-x-2
                        hover:bg-gray-300 transition-all duration-300
                        group w-2/5
                      "
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <Eye className="w-6 h-5 group-hover:scale-110" />
                      <span className="text-sm">View</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center mt-24 py-10 text-sky-500">
              No flash-selling products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashSalePage;