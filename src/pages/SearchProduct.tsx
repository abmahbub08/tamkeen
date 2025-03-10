import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from '../atoms/authAtom';

import { 
  ShoppingCart, 
  Star, 
  Truck, 
  RefreshCw, 
  Shield, 
  Heart, 
  CheckCircle,
  ArrowRight,
  Package,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';


interface AuthState {
  isAuthenticated: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

// Interfaces
interface CartItem {
  id: number;
  store_id: number;
  parent_id: number | null;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  discounted_price: string;
  cover_image: string;
  additional_images?: string[];
  color?: string | null;
  size?: string;
  material?: string;
  stock?: number;
  rating?: number;
  category?: string;
}

const ProductDetailPage: React.FC = () => {
  // State Management
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);


   // Authentication State
   const [auth] = useAtom<AuthState>(authAtom);
   const navigate = useNavigate();
 
  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    const parsedCart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
    setCartItems(parsedCart);
  }, []);

  // Fetch Product Details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`https://api.tamkeen.center/api/product-all`);
        const products = response.data;
        const productId = window.location.pathname.split('/').pop();
        const matchedProduct = products.find((p: Product) => p.id === Number(productId));
        
        if (matchedProduct) {
          setProduct(matchedProduct);
          setSelectedSize(matchedProduct.size || null);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Error fetching product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, []);

  // Image Navigation
  const nextImage = () => {
    if (!product?.additional_images) return;
    setCurrentImageIndex((prev) => 
      (prev + 1) % ([product.cover_image, ...(product.additional_images || [])].length)
    );
  };

  const prevImage = () => {
    if (!product?.additional_images) return;
    setCurrentImageIndex((prev) => 
      prev === 0 
        ? [product.cover_image, ...(product.additional_images || [])].length - 1 
        : prev - 1
    );
  };

  // Add to Cart Handler
  const handleAddToCart = () => {
      // Authentication Check
      if (!auth.isAuthenticated) {
        toast.error('Please login to add items to cart');
        navigate('/login', { 
          state: { 
            from: window.location.pathname, 
            message: 'Login required to add products to cart' 
          } 
        });
        return;
      }
  
      if (!product) {
        toast.error('Product details are not available');
        return;
      }
  

    // Create new cart item
    const newCartItem: CartItem = {
      id: product.id,
      store_id: 229, // Example store ID, replace with actual store logic
      parent_id: null,
      name: product.name,
      quantity: quantity,
      price: parseFloat(product.discounted_price),
      image: product.cover_image
    };

    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

    let updatedCart: CartItem[];
    if (existingItemIndex > -1) {
      // Update quantity if product exists
      updatedCart = cartItems.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new item to cart
      updatedCart = [...cartItems, newCartItem];
    }

    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));

    // Update cart state
    setCartItems(updatedCart);

    // Show success toast
    toast.success(`${product.name} added to cart`, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#4ade80',
        color: 'white',
      },
      icon: '🛒'
    });
  };

  // Loading State
  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg">
        <Package className="mx-auto w-16 h-16 text-blue-500 mb-4 animate-pulse" />
        <p className="text-lg text-gray-700 font-semibold">Loading Product Details</p>
        <p className="text-sm text-gray-500 mt-2">Please wait a moment...</p>
      </div>
    </div>
  );

  // Error State
  if (error || !product) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="text-center bg-white p-10 rounded-xl shadow-2xl">
        <Lock className="mx-auto w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-600 mb-3">Oops! Something Went Wrong</h2>
        <p className="text-base text-gray-700">{error || 'Product Not Found'}</p>
      </div>
    </div>
  );

  // Prepare Images
  const images = [
    product.cover_image,
    ...(product.additional_images || [])
  ].map(img => `https://api.tamkeen.center/${img}`);

  // Discount Calculation
  const discountPercentage = Math.round(
    ((parseFloat(product.price) - parseFloat(product.discounted_price)) / parseFloat(product.price)) * 100
  );

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden grid md:grid-cols-2 gap-8 p-8">
          {/* Image Gallery Section */}
          <div className="relative">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <div className="relative">
                <img 
                  src={images[currentImageIndex]} 
                  alt={product.name}
                  className="w-full h-[500px] object-cover transition-transform duration-300 hover:scale-105"
                />
                
                {/* Image Navigation Buttons */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex justify-center space-x-2 p-4 bg-gray-100">
                {images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transform transition ${
                      currentImageIndex === index 
                        ? 'border-blue-500 scale-105' 
                        : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center text-sm">
                  <div className="flex items-center mr-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 0) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                    <span className="ml-2 text-gray-600 font-medium">
                      {product.rating || 0} ({product.rating ? 'Verified' : 'No'} Reviews)
                    </span>
                  </div>
                  {product.category && (
                    <span className="text-gray-500 text-sm">
                      • {product.category}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <Heart 
                  className={`w-6 h-6 transition ${
                    isFavorite 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-300 hover:text-red-300'
                  }`} 
                />
              </button>
            </div>

            {/* Pricing */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-sky-700">
                ${parseFloat(product.discounted_price).toFixed(2)}
              </span>
              {discountPercentage > 0 && (
                <>
                  <span className="line-through text-gray-500 text-lg">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Product Description */}
            <p className="text-base text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-xl text-sm">
              {product.color && (
                <div>
                  <span className="font-semibold text-gray-700 block mb-1">Color:</span> 
                  <span className="text-sky-600">{product.color}</span>
                </div>
              )}
              {product.size && (
                <div>
                  <span className="font-semibold text-gray-700 block mb-1">Size:</span> 
                  <span className="text-gray-600">{product.size}</span>
                </div>
              )}
              {product.material && (
                <div>
                  <span className="font-semibold text-gray-700 block mb-1">Material:</span> 
                  <span className="text-gray-600">{product.material}</span>
                </div>
              )}
              {product.stock && (
                <div className="flex items-center">
                  <CheckCircle className="mr-2 text-green-500 w-5 h-5" />
                  <span className="text-green-700">{product.stock} In Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button 
            onClick={handleAddToCart}
            className={`w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl flex items-center justify-center space-x-2 text-lg font-semibold shadow-lg shadow-blue-300/50 transition-all ${
              !auth.isAuthenticated 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
            disabled={!auth.isAuthenticated}
          >
            <ShoppingCart className="mr-2 w-6 h-6" />
            {auth.isAuthenticated ? 'Add to Cart' : 'Login to Add'}
            <ArrowRight className="ml-2 w-6 h-6" />
          </button>

    

            {/* Product Guarantees - Final Section */}
            <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-xl text-sm">
              <div className="flex items-center text-sky-700 flex-col text-center">
                <Truck className="w-8 h-8 mb-2 text-sky-600" />
                <span className="font-semibold">Free Shipping</span>
                <span className="text-xs text-sky-500 mt-1">Worldwide</span>
              </div>
              <div className="flex items-center text-sky-700 flex-col text-center">
                <RefreshCw className="w-8 h-8 mb-2 text-sky-600" />
                <span className="font-semibold">Easy Returns</span>
                <span className="text-xs text-sky-500 mt-1">30 Days</span>
              </div>
              <div className="flex items-center text-sky-700 flex-col text-center">
                <Shield className="w-8 h-8 mb-2 text-sky-600" />
                <span className="font-semibold">Quality Guarantee</span>
                <span className="text-xs text-sky-500 mt-1">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;