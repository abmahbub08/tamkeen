import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Info, 
  Tag, 
  Box, 
  Clock, 
  Star, 
  Target, 
  CheckCircle 
} from 'lucide-react';
import { useAtom } from 'jotai';
import { authAtom } from '../atoms/authAtom';
import toast, { Toaster } from 'react-hot-toast';

// Comprehensive TypeScript Interfaces
interface PackageImage {
  id: number;
  image: string;
  package_id: number;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: number;
  store_id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  size: string;
  color: string;
  rating: string;
  barcode: string;
}

interface PackageItem {
  id: number;
  package_id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

interface Package {
  id: number;
  name: string;
  total_price: string;
  number_of_uses: number;
  store_id: number;
  image: string | null;
  images: PackageImage[];
  items: PackageItem[];
  created_at: string;
  updated_at: string;
  profit_percentage_in_level_1?: number | null;
  profit_percentage_in_level_2?: number | null;
  profit_percentage_in_level_3?: number | null;
}

const PackageDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [packageDetails, setPackageDetails] = useState<Package | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [auth] = useAtom(authAtom);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(`https://api.tamkeen.center/api/packages/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch package details');
        }

        const data: Package = await response.json();
        setPackageDetails(data);
        
        // Set first image as active if images exist
        if (data.images && data.images.length > 0) {
          setActiveImage(`https://api.tamkeen.center/${data.images[0].image}`);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch package details');
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!auth.isAuthenticated) {
      navigate("/login", { 
        state: { 
          from: window.location.pathname, 
          message: 'You need to log in to add products to your cart' 
        } 
      });
      return;
    }

    if (!packageDetails) return;

    const existingBasket = JSON.parse(localStorage.getItem('basket') || '[]');
    const isPackageInBasket = existingBasket.some((item: Package) => item.id === packageDetails.id);

    if (!isPackageInBasket) {
      const updatedBasket = [...existingBasket, packageDetails];
      localStorage.setItem('basket', JSON.stringify(updatedBasket));
      toast.success(`${packageDetails.name} added to basket!`, {
        icon: '🛒',
        style: {
          borderRadius: '10px',
          background: '#90EE90',
          color: '#fff',
        },
      });
    } else {
      toast.error('Package is already in the basket', {
        icon: '⚠️',
        style: {
          borderRadius: '10px',
          background: '#f44336',
          color: '#fff',
        },
      });
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-sky-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center p-8 bg-red-100 text-red-600">
      <Info className="mx-auto mb-4" size={48} />
      <h2 className="text-2xl font-bold">Oops! Something went wrong</h2>
      <p>{error}</p>
    </div>
  );

  if (!packageDetails) return null;

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 mt-12">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="grid md:grid-cols-2 gap-10 bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Image Gallery Section */}
        <div className="p-6 bg-gray-100">
          {activeImage ? (
            <img 
              src={activeImage} 
              alt={packageDetails.name} 
              className="w-full h-96 object-cover rounded-xl shadow-lg mb-4"
            />
          ) : (
            <div className="bg-gray-200 h-96 flex items-center justify-center rounded-xl">
              <Info className="text-gray-500" size={48} />
              <p>No Image Available</p>
            </div>
          )}

          {packageDetails.images.length > 1 && (
            <div className="flex space-x-2 mt-4">
              {packageDetails.images.map((img) => (
                <img
                  key={img.id}
                  src={`https://api.tamkeen.center/${img.image}`}
                  alt={`${packageDetails.name} thumbnail`}
                  onClick={() => setActiveImage(`https://api.tamkeen.center/${img.image}`)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer ${
                    activeImage === `https://api.tamkeen.center/${img.image}` 
                      ? 'border-4 border-sky-500' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Package Details Section */}
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold text-gray-800">{packageDetails.name}</h1>
            <span className="text-3xl font-semibold text-sky-600">
              ${packageDetails.total_price}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <Box className="mr-2" size={20} />
              <span>Uses Remaining: {packageDetails.number_of_uses}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2" size={20} />
              <span>Created: {new Date(packageDetails.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Package Contents */}
          <div className="bg-sky-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-sky-800 flex items-center">
              <Target className="mr-2" size={24} />
              Package Contents
            </h3>
            {packageDetails.items.map((item) => (
              <div 
                key={item.id} 
                className="flex justify-between items-center border-b py-3 last:border-b-0"
              >
                <div className="flex items-center">
                  <CheckCircle className="mr-3 text-sky-500" size={24} />
                  <div>
                    <p className="font-medium text-gray-800">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.product.size} | Color: {item.product.color}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${item.product.price}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <Tag className="mr-3 text-sky-500" size={24} />
              <div>
                <p className="font-semibold">Store ID</p>
                <p className="text-gray-600">{packageDetails.store_id}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <Star className="mr-3 text-sky-500" size={24} />
              <div>
                <p className="font-semibold">Total Products</p>
                <p className="text-gray-600">{packageDetails.items.length}</p>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center space-x-2 py-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
              auth.isAuthenticated
                ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-lg hover:shadow-xl'
                : 'bg-gray-400 text-gray-700 cursor-not-allowed'
            }`}
            disabled={!auth.isAuthenticated}
          >
            <ShoppingCart className="mr-2" size={24} />
            {auth.isAuthenticated ? 'Add to Basket' : 'Login to Add to Basket'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsPage;