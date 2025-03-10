import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, CreditCard, Check, Plus, Trash2, Edit } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Product {
  product_id: number;
  product_name: string;
  product_cover_image: string | null;
  product_price: string;
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

interface Address {
  id: number;
  name: string;
  phone: string;
  street: string;
  city: string;
  apartment: string;
  email: string;
}

const CheckoutPage: React.FC = () => {

  const navigate = useNavigate(); 
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>('51');
  const [error, setError] = useState<string | null>(null);
  const [checkoutProgress, setCheckoutProgress] = useState<{[key: number]: 'pending' | 'success' | 'failed'}>({});
  
  // Address Management States
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressFormData, setAddressFormData] = useState<Partial<Address>>({});
  const [isEditing, setIsEditing] = useState(false);

  const paymentMethodOptions = [
    { 
      id: '51', 
      name: 'Cash on Delivery', 
      icon: <CreditCard className="text-orange-500 mr-2" />
    }
  ];

  // Get authentication token
  const getAuthToken = () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token'))
      ?.split('=')[1];

    if (!token) {
      throw new Error('No bearer token found');
    }
    return token;
  };

  // Fetch cart data
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const bearerToken = getAuthToken();

        const response = await axios.get('https://api.tamkeen.center/api/view-cart', {
          headers: { 
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
          }
        });

        setCartData(response.data.cart);
        
        const initialProgress = response.data.cart.stores.reduce((acc, store) => {
          acc[store.store_id] = 'pending';
          return acc;
        }, {});
        setCheckoutProgress(initialProgress);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        toast.error('Failed to load cart data');
      }
    };

    const fetchAddresses = async () => {
      try {
        const bearerToken = getAuthToken();

        const response = await axios.get('https://api.tamkeen.center/api/addresses', {
          headers: { 
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
          }
        });

        setAddresses(response.data.addresses);
      } catch (err) {
        toast.error('Failed to load addresses');
      }
    };

    fetchCartData();
    fetchAddresses();
  }, []);

  // Handle address form input changes
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save or update address
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const bearerToken = getAuthToken();

      const endpoint = isEditing && selectedAddressId
        ? `https://api.tamkeen.center/api/addresses/${selectedAddressId}`
        : 'https://api.tamkeen.center/api/add-address';

      const method = isEditing && selectedAddressId ? 'put' : 'post';

      const response = await axios[method](endpoint, addressFormData, {
        headers: { 
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Refresh addresses
      const addressesResponse = await axios.get('https://api.tamkeen.center/api/addresses', {
        headers: { 
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      setAddresses(addressesResponse.data.addresses);

      // Reset form and close modal
      setIsAddressModalOpen(false);
      setAddressFormData({});
      setIsEditing(false);
      setSelectedAddressId(null);

      toast.success(isEditing ? 'Address updated successfully' : 'Address added successfully');
    } catch (err) {
      toast.error('Failed to save address');
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId: number) => {
    try {
      const bearerToken = getAuthToken();

      await axios.delete(`https://api.tamkeen.center/api/addresses/${addressId}`, {
        headers: { 
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Refresh addresses
      const response = await axios.get('https://api.tamkeen.center/api/addresses', {
        headers: { 
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      setAddresses(response.data.addresses);
      
      // Unselect address if deleted
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }

      toast.success('Address deleted successfully');
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  // Multi-store checkout logic
  const handleMultiStoreCheckout = async () => {
    if (!selectedPaymentMethodId) {
      toast.error('Please select a payment method');
      return;
    }

    if (!selectedAddressId) {
      toast.error('Please select an address');
      return;
    }

    if (!cartData || cartData.stores.length === 0) {
      toast.error('No stores in cart');
      return;
    }

    const bearerToken = getAuthToken();
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

    if (!selectedAddress) {
      toast.error('Selected address not found');
      return;
    }

    const storesToCheckout = [...cartData.stores];

    for (const store of storesToCheckout) {
      try {
        const checkoutData = {
          store_id: store.store_id.toString(),
          payment_method_id: selectedPaymentMethodId,
          address: `${selectedAddress.street}, ${selectedAddress.apartment}, ${selectedAddress.city}`
        };

        await axios.post(
          'https://api.tamkeen.center/api/cart/checkout', 
          checkoutData,
          { 
            headers: { 
              'Authorization': `Bearer ${bearerToken}`,
              'Content-Type': 'application/json'
            } 
          }
        );

        setCheckoutProgress(prev => ({
          ...prev, 
          [store.store_id]: 'success'
        }));

      } catch (storeErr) {
        console.error(storeErr);
        setCheckoutProgress(prev => ({
          ...prev, 
          [store.store_id]: 'failed'
        }));
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Always show success toast
    toast.success('All orders placed successfully!');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <ShoppingCart className="mr-3" /> Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column: Order Summary - Same as before */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          
          {cartData?.stores.map((store) => (
            <div key={store.store_id} className="mb-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{store.store_name}</h3>
                {checkoutProgress[store.store_id] === 'success' && (
                  <span className="text-green-500">✓ Checkout Complete</span>
                )}
                {checkoutProgress[store.store_id] === 'success' && (
                  <span className="text-sky-500">✓ Checkout Successful</span>
                )}
              </div>
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

          <div className="mt-4 border-t pt-4 text-right">
            <span className="text-xl font-bold">
              Total: ${cartData?.cart_total_price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Right Column: Checkout Details */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            Payment Method
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

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Delivery Addresses</h3>
              <button 
                onClick={() => {
                  setIsAddressModalOpen(true);
                  setIsEditing(false);
                  setAddressFormData({});
                }}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <Plus className="mr-1" /> Add
              </button>
            </div>

            {addresses.map((address) => (
              <div 
                key={address.id}
                onClick={() => setSelectedAddressId(address.id)}
                className={`p-4 border rounded-lg mb-2 cursor-pointer flex justify-between items-center ${
                  selectedAddressId === address.id 
                    ? 'border-green-500 bg-green-50' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div>
                  <p className="font-semibold">{address.name}</p>
                  <p>{`${address.street}, ${address.apartment}`}</p>
                  <p>{`${address.city}`}</p>
                  <p>{address.phone}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setSelectedAddressId(address.id);
                      setAddressFormData(address);
                      setIsAddressModalOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(address.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleMultiStoreCheckout}
            className="w-full bg-green-600 text-white py-3 rounded-lg mt-4 hover:bg-green-700 transition-colors flex items-center justify-center"
            disabled={!selectedPaymentMethodId || !selectedAddressId}
          >
            <Check className="mr-2" /> Complete Multi-Store Order
          </button>
        </div>
      </div>

    
  {isAddressModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? 'Edit Address' : 'Add New Address'}
        </h2>
        
        <form onSubmit={handleSaveAddress}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={addressFormData.name || ''}
              onChange={handleAddressInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={addressFormData.phone || ''}
              onChange={handleAddressInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={addressFormData.email || ''}
              onChange={handleAddressInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              id="street"
              name="street"
              required
              value={addressFormData.street || ''}
              onChange={handleAddressInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
              Apartment/Unit Number
            </label>
            <input
              type="text"
              id="apartment"
              name="apartment"
              value={addressFormData.apartment || ''}
              onChange={handleAddressInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={addressFormData.city || ''}
              onChange={handleAddressInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => {
                setIsAddressModalOpen(false);
                setAddressFormData({});
                setIsEditing(false);
                setSelectedAddressId(null);
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              {isEditing ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
   </div>
  );
};

export default CheckoutPage;

