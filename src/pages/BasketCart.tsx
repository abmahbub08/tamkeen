import React, { useState, useEffect } from 'react';

import { toast, Toaster } from 'react-hot-toast';
import { 
  Trash2, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Package,
  DollarSign 
} from 'lucide-react';

interface BasketItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  type: 'product' | 'package';
}

const BasketPage: React.FC = () => {
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedBasket = localStorage.getItem('basket');
    if (savedBasket) {
      setBasketItems(JSON.parse(savedBasket));
    }
  }, []);

  const updateBasketInLocalStorage = (items: BasketItem[]) => {
    localStorage.setItem('basket', JSON.stringify(items));
    setBasketItems(items);
  };

  const removeItem = (id: number) => {
    const updatedItems = basketItems.filter(item => item.id !== id);
    updateBasketInLocalStorage(updatedItems);
    toast.success('Item removed from basket');
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    const updatedItems = basketItems.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item
    );
    updateBasketInLocalStorage(updatedItems);
  };

  const calculateTotal = () => {
    return basketItems.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    ).toFixed(2);
  };

  const clearBasket = () => {
    updateBasketInLocalStorage([]);
    toast.success('Basket cleared');
  };

  const checkout = () => {
    // Implement checkout logic
    toast.success('Checkout processing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="mr-4 text-sky-600" /> Your Basket
          </h1>
          {basketItems.length > 0 && (
            <button 
              onClick={clearBasket}
              className="text-red-500 hover:text-red-700 transition flex items-center"
            >
              <Trash2 className="mr-2" /> Clear Basket
            </button>
          )}
        </div>

        {basketItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-100 rounded-xl">
            <Package className="mx-auto w-16 h-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">Your basket is empty</p>
          </div>
        ) : (
          <>
            {basketItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between bg-gray-100 rounded-xl p-4 mb-4"
              >
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-md mr-4" 
                  />
                )}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sky-700">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-white rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-4 text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-8 bg-blue-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-sky-700 flex items-center">
                  <DollarSign className="mr-2 w-6 h-6" />
                  {calculateTotal()}
                </span>
              </div>

              <button 
                onClick={checkout}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl 
                  flex items-center justify-center text-lg font-semibold 
                  shadow-lg shadow-blue-300/50 transition-all"
              >
                Proceed to Checkout
                <ShoppingCart className="ml-2 w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BasketPage;