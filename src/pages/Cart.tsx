import React, { useState } from 'react';
import { FaShoppingCart, FaClipboardList } from 'react-icons/fa';
import ShoppingCart from './CartShop';
import CartPage from './CartBasket';

// Placeholder Cart Components
const Cart1 = () => (
  <div className="p-6 bg-sky-50 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-sky-800 mb-4">First Cart</h2>
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-sky-600">Item 1</h3>
        <p className="text-gray-500">Description of first item</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sky-700 font-bold">$19.99</span>
          <button className="bg-sky-500 text-white px-3 py-1 rounded-md hover:bg-sky-600 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-sky-600">Item 2</h3>
        <p className="text-gray-500">Description of second item</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sky-700 font-bold">$24.99</span>
          <button className="bg-sky-500 text-white px-3 py-1 rounded-md hover:bg-sky-600 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Cart2 = () => (
  <div className="p-6 bg-sky-50 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-sky-800 mb-4">Second Cart</h2>
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-sky-600">Item A</h3>
        <p className="text-gray-500">Description of first item in second cart</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sky-700 font-bold">$29.99</span>
          <button className="bg-sky-500 text-white px-3 py-1 rounded-md hover:bg-sky-600 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-sky-600">Item B</h3>
        <p className="text-gray-500">Description of second item in second cart</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sky-700 font-bold">$34.99</span>
          <button className="bg-sky-500 text-white px-3 py-1 rounded-md hover:bg-sky-600 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Main Tabs Component
const TabsComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cart1' | 'cart2'>('cart1');

  return (
    <div className="max-w-7xl mx-auto my-12 mt-12 p-6 bg-white rounded-xl shadow-2xl gap-4">
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b-2 border-sky-200 mt-6">
        <button
          onClick={() => setActiveTab('cart1')}
          className={`
            flex items-center gap-2 px-6 py-3 text-lg font-semibold transition-all duration-300
            ${activeTab === 'cart1' 
              ? 'text-sky-700 border-b-4 border-sky-700' 
              : 'text-gray-500 hover:text-sky-600'}
          `}
        >
          <FaShoppingCart />
      Shopping Cart
        </button>
        <button
          onClick={() => setActiveTab('cart2')}
          className={`
            flex items-center gap-2 px-6 py-3 text-lg font-semibold transition-all duration-300
            ${activeTab === 'cart2' 
              ? 'text-sky-700 border-b-4 border-sky-700' 
              : 'text-gray-500 hover:text-sky-600'}
          `}
        >
          <FaClipboardList />
        Basket Cart
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'cart1' ? <ShoppingCart></ShoppingCart>: <CartPage />}
      </div>
    </div>
  );
};

export default TabsComponent;