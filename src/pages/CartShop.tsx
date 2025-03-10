import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Store, Tag, Star, Trash2, Plus, Minus, ChevronRight, Home, ArrowRight } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

// TypeScript interfaces remain the same
interface Product {
  product_id: number;
  product_name: string;
  product_cover_image: string | null;
  product_background_image: string | null;
  product_description: string;
  product_price: string;
  product_discounted_price: string;
  discount_type: string | null;
  discount_value: string | null;
  rating: string | null;
  color: string;
  material: string | null;
  style: string | null;
  gender: string | null;
  capacity: string | null;
  weight: string | null;
  quantity: number;
  product_total: number;
}

interface Store {
  store_id: number;
  store_name: string;
  store_image: string;
  products: Product[];
  store_total_price: number;
}

interface CartData {
  cart_total_price: number;
  stores: Store[];
}

const CartPage: React.FC = () => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
    // Checkout Process
    const checkout = () => {
     
  
      // Add your checkout logic here
      navigate('/checkout/product');
    };
  
    // Continue Shopping
    const continueShopping = () => {
      navigate('/');
    };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const bearerToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('token'))
          ?.split('=')[1];

        if (!bearerToken) {
          throw new Error('No bearer token found');
        }

        const response = await axios.get('https://api.tamkeen.center/api/view-cart', {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          }
        });

        setCartData(response.data.cart);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleQuantityChange = (storeIndex: number, productIndex: number, change: number) => {
    if (!cartData) return;

    const updatedCartData = { ...cartData };
    const currentQuantity = updatedCartData.stores[storeIndex].products[productIndex].quantity;
    const newQuantity = Math.max(0, currentQuantity + change);

    updatedCartData.stores[storeIndex].products[productIndex].quantity = newQuantity;
    
    // Recalculate store and cart total prices
    updatedCartData.stores[storeIndex].store_total_price = 
      updatedCartData.stores[storeIndex].products.reduce(
        (total, product) => total + (parseFloat(product.product_price) * product.quantity), 
        0
      );

    updatedCartData.cart_total_price = 
      updatedCartData.stores.reduce(
        (total, store) => total + store.store_total_price, 
        0
      );

    setCartData(updatedCartData);
  };

  const handleRemoveProduct = (storeIndex: number, productIndex: number) => {
    if (!cartData) return;

    const updatedCartData = { ...cartData };
    updatedCartData.stores[storeIndex].products.splice(productIndex, 1);

    // Recalculate store and cart total prices
    updatedCartData.stores[storeIndex].store_total_price = 
      updatedCartData.stores[storeIndex].products.reduce(
        (total, product) => total + (parseFloat(product.product_price) * product.quantity), 
        0
      );

    updatedCartData.cart_total_price = 
      updatedCartData.stores.reduce(
        (total, store) => total + store.store_total_price, 
        0
      );

    setCartData(updatedCartData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center mb-8 space-x-4">
          <ShoppingCart className="text-blue-600" size={36} />
          <h1 className="text-3xl font-extrabold text-gray-800">Your Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            {cartData && cartData.stores.map((store, storeIndex) => (
              <div 
                key={store.store_id} 
                className="bg-white shadow-md rounded-xl mb-6 overflow-hidden"
              >
                <div className="bg-blue-50 p-4 flex items-center">
                  <img 
                    src={store.store_image || '/placeholder-store.png'} 
                    alt={store.store_name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-blue-200"
                  />
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-gray-800">{store.store_name}</h2>
                    <p className="text-gray-500">Store Total: ${store.store_total_price.toFixed(2)}</p>
                  </div>
                </div>

                {store.products.map((product, productIndex) => (
                  <div 
                    key={product.product_id} 
                    className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <img 
                        src={product.product_cover_image || '/placeholder-product.png'} 
                        alt={product.product_name} 
                        className="w-24 h-24 object-cover rounded-lg shadow-md"
                      />
                      
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{product.product_name}</h3>
                        
                        <div className="flex space-x-3 mb-2">
                          {product.style && (
                            <div className="flex items-center space-x-1">
                              <Tag className="text-blue-500" size={14} />
                              <span className="text-sm text-gray-600">{product.style}</span>
                            </div>
                          )}
                          {product.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="text-yellow-500" size={14} />
                              <span className="text-sm text-gray-600">{product.rating}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xl font-bold text-green-600">
                              ${product.product_price}
                            </span>
                            {product.product_discounted_price !== product.product_price && (
                              <span className="ml-2 text-sm line-through text-gray-400">
                                ${product.product_discounted_price}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border rounded-full overflow-hidden">
                              <button 
                                onClick={() => handleQuantityChange(storeIndex, productIndex, -1)}
                                className="p-2 bg-blue-50 hover:bg-blue-100 transition-colors"
                              >
                                <Minus size={16} className="text-blue-600" />
                              </button>
                              <span className="px-3 text-gray-700">{product.quantity}</span>
                              <button 
                                onClick={() => handleQuantityChange(storeIndex, productIndex, 1)}
                                className="p-2 bg-blue-50 hover:bg-blue-100 transition-colors"
                              >
                                <Plus size={16} className="text-blue-600" />
                              </button>
                            </div>
                            <button 
                              onClick={() => handleRemoveProduct(storeIndex, productIndex)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {cartData && (
            <div className="col-span-4">
              <div className="bg-white shadow-lg rounded-xl p-6 sticky top-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold text-gray-700">Total Cart Value</span>
                  <span className="text-3xl font-bold text-green-600">
                    ${cartData.cart_total_price.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${cartData.cart_total_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
                    <span>Total</span>
                    <span>${cartData.cart_total_price.toFixed(2)}</span>
                  </div>
                </div>
               {/* Action Buttons */}
               <div className="mt-6 space-y-3">
              <button 
                onClick={checkout}
                // disabled={cart.length === 0}
                className="w-full bg-sky-600 text-white py-3 rounded-md hover:bg-sky-700 transition-colors flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2" size={20} />
              </button> 
              <button 
                onClick={continueShopping}
                className="w-full border border-sky-600 text-sky-700 py-3 rounded-md hover:bg-sky-100 transition-colors flex items-center justify-center"
              >
                <Home className="mr-2" size={20} />
                Continue Shopping
              </button>
            </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;