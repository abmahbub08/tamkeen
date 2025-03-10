import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, PackageX } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useAtom } from 'jotai';
import { authAtom } from '../atoms/authAtom';

const BasketDisplay = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [auth] = useAtom(authAtom);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api.tamkeen.center/api/packages');
        const data = await response.json();
        
        if (data === "This store does not have any packages") {
          setError(data);
          setProducts([]);
        } else {
          setProducts(data || []);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error(`Error fetching products: ${err.message}`);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    if (!auth.isAuthenticated) {
      navigate("/login");
      return;
    }

    const existingCartItems = JSON.parse(localStorage.getItem('basket') || '[]');
    const existingProductIndex = existingCartItems.findIndex((item) => item.id === product.id);

    if (existingProductIndex > -1) {
      existingCartItems[existingProductIndex].quantity =
        (existingCartItems[existingProductIndex].quantity || 1) + 1;
    } else {
      existingCartItems.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('basket', JSON.stringify(existingCartItems));

    toast.success(`${product.name} added to cart`, {
      style: {
        background: '#4299e1',
        color: 'white',
      },
      icon: '🛒',
    });
  };

  const viewProductDetails = (productId) => {
    navigate(`/basket/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error === "This store does not have any packages") {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <PackageX className="w-16 h-16 text-sky-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Packages Available</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600">
        <p className="text-xl font-semibold mb-4">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="container mx-auto p-4">
        <div className="grid md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden border border-sky-100"
            >
              <div className="bg-sky-100 p-4 flex justify-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`https://api.tamkeen.center/${product.images[0].image}`}
                    alt={product.name}
                    className="h-48 w-auto object-contain"
                  />
                ) : (
                  <PackageX className="w-16 h-16 text-gray-400" />
                )}
              </div>

              <div className="p-4">
                <h2 className="text-xl font-bold text-sky-800 mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">Price: ${product.total_price}</p>
                <p className="text-sm text-gray-500 mb-4">Uses: {product.number_of_uses}</p>

                <div className="flex space-x-2">
                  <button
                    className="
                      w-full bg-sky-600 text-white py-3 rounded-lg 
                      flex items-center justify-center space-x-3
                      hover:bg-sky-700 transition duration-300
                      transform active:scale-95
                      disabled:bg-sky-300 disabled:cursor-not-allowed
                    "
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="w-6 h-6" />
                    <span className="font-semibold">Add to Cart</span>
                  </button>
                  <button
                    className="
                      flex items-center justify-center bg-gray-500 text-white p-3 rounded-lg
                      hover:bg-gray-600 transition duration-300
                      transform active:scale-95
                    "
                    onClick={() => viewProductDetails(product.id)}
                  >
                    <Eye className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BasketDisplay;