import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Tags, 
  
  Tag,
  ArrowRight,
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Type definition for cart item
interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image?: string | null;
}

// Coupon interface
interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  discount: number;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Predefined coupon options
  const COUPONS: Coupon[] = [
    { code: 'SAVE10', type: 'percentage', discount: 10 },
    { code: 'SUMMER20', type: 'percentage', discount: 20 },
    { code: 'FLAT5', type: 'fixed', discount: 5 }
  ];

  useEffect(() => {
    // Load cart from local storage
    const savedCart = localStorage.getItem('basket');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    const updatedCart = cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem('basket', JSON.stringify(updatedCart));
  };

  const removeItem = (id: number) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('basket', JSON.stringify(updatedCart));
  };

  const applyCoupon = () => {
    // Reset previous coupon state
    setCouponError('');
    setAppliedCoupon(null);

    // Find matching coupon
    const foundCoupon = COUPONS.find(
      coupon => coupon.code.toUpperCase() === couponCode.toUpperCase()
    );

    if (foundCoupon) {
      setAppliedCoupon(foundCoupon);
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (total, item) => total + parseFloat(item.total_price) * item.quantity, 
      0
    );

    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        return subtotal * (1 - appliedCoupon.discount / 100);
      } else {
        return Math.max(0, subtotal - appliedCoupon.discount);
      }
    }

    return subtotal;
  };

  const continueShopping = () => {
    // Navigate to product listing page
    window.location.href = '/';
  };

  const checkout = () => {
    // Navigate to checkout page
    window.location.href = '/checkout/basket';
  };

  return (
    <div className="min-h-screen bg-sky-50 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Cart Items */}
          <div className="bg-white shadow-xl rounded-xl border border-sky-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <ShoppingCart size={28} className="text-sky-600" />
                <h2 className="text-2xl font-bold text-sky-800">
                  Basket cart
                </h2>
              </div>
              <div className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm">
                {cart.length} Items
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={64} className="mx-auto text-sky-300 mb-4" />
                <p className="text-xl text-sky-700">
                  Your cart is empty
                </p>
                <p className="text-sky-500 mt-2">
                  Browse our products and add some items!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center border-b border-sky-100 pb-4"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 mr-4 rounded-lg overflow-hidden border border-sky-200">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-sky-50 flex items-center justify-center">
                          <Tags size={32} className="text-sky-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="text-sm font-semibold text-sky-800">
                        {item.name}
                      </h3>
                      <p className="text-sky-600">
                        ${item.total_price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-sky-200 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-sky-600 hover:bg-sky-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 text-sky-800">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-sky-600 hover:bg-sky-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Order Summary */}
          <div className="border rounded-lg p-6 bg-sky-50">
            <h3 className="text-xl font-bold border-b pb-3 mb-4 flex items-center text-sky-800">
              <Tag className="mr-2 text-sky-600" size={20} />
              Order Summary
            </h3>
            
            {/* Coupon Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-sky-700 mb-2">
                Discount Coupon
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="w-full px-3 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button 
                  onClick={applyCoupon}
                  className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-red-500 text-xs mt-1">{couponError}</p>
              )}
              {appliedCoupon && (
                <div className="mt-2 text-green-600 text-sm">
                  Coupon applied: {appliedCoupon.code} 
                  {appliedCoupon.type === 'percentage' 
                    ? ` (${appliedCoupon.discount}% off)` 
                    : ` ($${appliedCoupon.discount} off)`}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-sky-200 pt-4">
              <div className="flex justify-between">
                <span className="text-sky-700">Subtotal</span>
                <span className="font-bold text-sky-900">
                  ${cart.reduce((total, item) => total + parseFloat(item.total_price) * item.quantity, 0).toFixed(2)}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-bold">
                    -${(cart.reduce((total, item) => total + parseFloat(item.total_price) * item.quantity, 0) * (appliedCoupon.discount / 100)).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-sky-200 pt-2">
                <span className="text-sky-800">Total</span>
                <span className="text-sky-900">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <Link to="/checkout/basket">
                <button 
                  onClick={checkout}
                  disabled={cart.length === 0}
                  className="w-full bg-sky-600 text-white py-3 rounded-md hover:bg-sky-700 transition-colors flex items-center justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2" size={20} />
                </button> 
              </Link>
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
      </div>
    </div>
  );
};

export default CartPage;