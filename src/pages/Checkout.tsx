import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { 
  ShoppingCart, 
  MapPin, 
  CreditCard, 
  Check 
} from 'lucide-react';

interface CartData {
  cart_total_price: number;
  stores: Array<{
    store_id: number;
    store_name: string;
    products: Array<{
      product_id: number;
      product_name: string;
      product_cover_image: string | null;
      product_price: string;
      quantity: number;
      product_total: number;
    }>;
    store_total_price: number;
  }>;
}

const CheckoutPage: React.FC = () => {
  // State management
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>('39'); // Default to Home Address
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>('51'); // Default to Cash on Delivery
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sample static data (replace with actual data from your backend)
  const addressOptions = [
    { 
      id: '39', 
      name: 'Home Address', 
      details: '123 Main St, City, Country',
      icon: <MapPin className="text-green-500 mr-2" />
    },
    { 
      id: '40', 
      name: 'Office Address', 
      details: '456 Work Blvd, City, Country',
      icon: <MapPin className="text-blue-500 mr-2" />
    }
  ];

  const paymentMethodOptions = [
    { 
      id: '51', 
      name: 'Cash on Delivery', 
      icon: <CreditCard className="text-orange-500 mr-2" />
    },
    
  ];

  // Fetch cart data
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
            'Content-Type': 'application/json'
          }
        });

        setCartData(response.data.cart);
        
        // Automatically select first store if available
        if (response.data.cart.stores.length > 0) {
          setSelectedStoreId(response.data.cart.stores[0].store_id.toString());
        }

        setLoading(false);
      } catch (err) {
        toast.error('Failed to load cart data');
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  // Checkout submission handler
  const handleCheckout = async () => {
    // Validate selections
    if (!selectedStoreId || !selectedAddressId || !selectedPaymentMethodId) {
      toast.error('Please select store, address, and payment method');
      return;
    }

    try {
      const bearerToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('token'))
        ?.split('=')[1];

      // Prepare checkout data
      const checkoutData = {
        store_id: "17",
        address_id: selectedAddressId,
        payment_method_id: selectedPaymentMethodId
      };

      // Show loading toast
      const loadingToast = toast.loading('Processing your order...');

      // Checkout API call
      const response = await axios.post(
        'https://api.tamkeen.center/api/cart/checkout', 
        checkoutData,
        { 
          headers: { 
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Handle successful checkout
      if (response.data.success) {
        toast.success('Order placed successfully!', {
          duration: 4000,
          position: 'top-right',
          icon: '🎉'
        });
        // Optionally redirect or reset cart
      } else {
        toast.error('Order placement failed');
      }
    } catch (err) {
      toast.error('Checkout failed. Please try again.');
      console.error(err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* React Hot Toast */}
      <Toaster />

      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <ShoppingCart className="mr-3" /> Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column: Order Summary */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          
          {cartData?.stores.map((store) => (
            <div key={store.store_id} className="mb-4">
              <h3 className="font-semibold text-lg">{store.store_name}</h3>
              {store.products.map((product) => (
                <div 
                  key={product.product_id} 
                  className="flex justify-between items-center mb-2"
                >
                  <div className="flex items-center">
                    <img 
                      src={product.product_cover_image || '/placeholder-product.png'}
                      alt={product.product_name}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <span>{product.product_name}</span>
                  </div>
                  <div>
                    <span>{product.quantity} x ${product.product_price}</span>
                  </div>
                </div>
              ))}
              <div className="text-right font-bold">
                Store Total: ${store.store_total_price.toFixed(2)}
              </div>
            </div>
          ))}

          {/* Total Price */}
          <div className="mt-4 border-t pt-4 text-right">
            <span className="text-xl font-bold">
              Total: ${cartData?.cart_total_price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Right Column: Checkout Details */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <MapPin className="mr-3" /> Select Address
          </h2>
          
          {addressOptions.map((address) => (
            <div 
              key={address.id}
              onClick={() => setSelectedAddressId(address.id)}
              className={`p-4 border rounded-lg mb-3 cursor-pointer flex items-center ${
                selectedAddressId === address.id 
                  ? 'border-green-500 bg-green-50' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {address.icon}
              <div>
                <h3 className="font-semibold">{address.name}</h3>
                <p>{address.details}</p>
                {selectedAddressId === address.id && (
                  <Check className="ml-auto text-green-500" />
                )}
              </div>
            </div>
          ))}

          <h2 className="text-2xl font-bold mt-6 mb-4 flex items-center">
            <CreditCard className="mr-3" /> Payment Method
          </h2>
          
          {paymentMethodOptions.map((method) => (
            <div 
              key={method.id}
              onClick={() => setSelectedPaymentMethodId(method.id)}
              className={`p-4 border rounded-lg mb-3 cursor-pointer flex items-center ${
                selectedPaymentMethodId === method.id 
                  ? 'border-green-500 bg-green-50' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {method.icon}
              <div className="flex-grow">
                {method.name}
              </div>
              {selectedPaymentMethodId === method.id && (
                <Check className="ml-auto text-green-500" />
              )}
            </div>
          ))}

          <button 
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white py-3 rounded-lg mt-6 hover:bg-green-700 transition-colors flex items-center justify-center"
            disabled={!selectedAddressId || !selectedPaymentMethodId}
          >
            <Check className="mr-2" /> Complete Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;