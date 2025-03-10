import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Minus, Plus, Gift, Truck, Barcode, QrCode } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAtom } from "jotai";
import { authAtom } from "../atoms/authAtom";


// Type definitions
interface Category {
  id: number;
  category_name: string;
  color: string;
}

interface ProductImage {
  id: number;
  product_id: number;
  image: string;
}

interface ProductVariant {
  id: number;
  name: string;
  price: string;
  stock: number;
  size: string | null;
  color: string | null;
  gender: string | null;
  images: ProductImage[];
}

interface Product {
  id: number;
  store_id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  cover_image: string;
  background_image: string | null;
  discount_type: string | null;
  discount_value: string | null;
  discounted_price: string;
  rating: string | null;
  barcode: string | null;
  qr_code: string | null;
  images: string[];
  categories: Category[];
  variants: ProductVariant[];
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const navigate = useNavigate();
 
  const [auth] = useAtom(authAtom);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`https://api.tamkeen.center/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setProduct(response.data.product);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load product');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle touch events for mobile swipe
  // const handleTouchStart = (e: React.TouchEvent) => {
  //   setTouchStart(e.touches[0].clientX);
  // };

  // const handleTouchMove = (e: React.TouchEvent) => {
  //   if (!touchStart) return;

  //   const currentTouch = e.touches[0].clientX;
  //   const diff = touchStart - currentTouch;

  //   if (diff > 50) {
  //     nextImage();
  //     setTouchStart(0);
  //   } else if (diff < -50) {
  //     prevImage();
  //     setTouchStart(0);
  //   }
  // };

  // const handleTouchEnd = () => {
  //   setTouchStart(0);
  // };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const token = Cookies.get('token');
      await axios.post('https://api.tamkeen.center/api/cart/add', 
        {
          cartItems: [{
            store_id: product.store_id,
            product_id: selectedVariant ? selectedVariant.id : product.id,
            quantity: quantity
          }]
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
      toast.error('Failed to add product to cart');
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    try {
      const token = Cookies.get('token');
      if (isInWishlist) {
        await axios.delete(`https://api.tamkeen.center/api/wishlists/remove/${product.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Removed from wishlist');
        setIsInWishlist(false);
      } else {
        await axios.post('https://api.tamkeen.center/api/wishlists/add', 
          { product_id: product.id },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        toast.success('Added to wishlist');
        setIsInWishlist(true);
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const nextImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-sky-100 to-sky-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-sky-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sky-50 text-sky-800">
        <p className="text-xl font-semibold">No product found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 py-4 sm:py-24 px-2 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className=" max-w-7xl  mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-8">
          {/* Image Gallery Section */}
          <div className="space-y-4">
            <div 
              className="relative w-96 md:w-full text-center aspect-square md:aspect-[2/3] lg:aspect-square rounded-lg overflow-hidden bg-sky-50"
              // onTouchStart={handleTouchStart}
              // onTouchMove={handleTouchMove}
              // onTouchEnd={handleTouchEnd}
            >
              <img 
                src={`https://api.tamkeen.center/${product.images[currentImageIndex]}`}
                alt={product.name}
                className={`w-full h-full object-contain transition-transform duration-300 ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-2 md:p-4 mr-12 md:mr-12">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="bg-white hover:bg-sky-100 text-sky-800 p-1 ml-8 md:ml-2 md:p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                  >
                    <ChevronLeft className="h-4 w-4 md:h-6 md:w-6 ml-2 md:ml-2" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="bg-white hover:bg-sky-100 text-sky-800 p-1 mr-2 md:mr-2 md:p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                  >
                    <ChevronRight className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-1" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="relative">
 <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent z-10" />
 <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent z-10" />
 
 <div className="grid grid-cols-4 md:flex gap-2 overflow-x-auto  pb-2">
   {product.images.map((img, index) => (
     <button
       key={index}
       onClick={() => setCurrentImageIndex(index)}
       className={`flex-shrink-0 w-14 sm:w-16 md:w-20 aspect-square rounded-md overflow-hidden transition-all duration-300  focus:outline-none
              focus:ring-2
              focus:ring-sky-500 ${
         index === currentImageIndex ? 'ring-2 ring-sky-500 scale-105' : 'opacity-60 hover:opacity-100'
       }`}
     >
       <img 
         src={`https://api.tamkeen.center/${img}`}
         alt={`Product view ${index + 1}`}
         className="w-full h-full object-cover"
       />
     </button>
   ))}
 </div>
</div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-4 md:space-y-6 ">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {product.categories.map(category => (
                <span 
                  key={category.id}
                  className="px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium"
                  style={{ backgroundColor: category.color, color: '#ffffff' }}
                >
                  {category.category_name}
                </span>
              ))}
            </div>

            {/* Product Name & Rating */}
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-sky-800 mb-2">{product.name}</h1>
              {product.rating && (
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 md:h-5 md:w-5 ${
                          i < Math.round(parseFloat(product.rating || '0')) ? 'fill-current' : 'stroke-current'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm md:text-base ml-2">({product.rating})</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="text-sm md:text-base">
              <p className={`text-gray-600 leading-relaxed ${!isDescriptionExpanded && 'line-clamp-3'}`}>
                {product.description}
              </p>
              {product.description.length > 150 && (
                <button 
                  onClick={toggleDescription}
                  className="text-sky-600 hover:text-sky-700 font-medium mt-1"
                >
                  {isDescriptionExpanded ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>

            {/* Pricing & Discount */}
            <div className="flex items-center flex-wrap gap-2 md:gap-4">
              <span className="text-2xl md:text-3xl font-bold text-sky-700">
                ${parseFloat(selectedVariant?.price || product.discounted_price).toFixed(2)}
              </span>
              {product.discount_type && product.discount_value && (
                <div className="flex items-center gap-2">
                  <span className="line-through text-gray-400 text-lg md:text-xl">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs md:text-sm font-medium">
                    {product.discount_type === 'percentage' ? `${product.discount_value}% OFF` : `$${product.discount_value} OFF`}
                  </span>
                </div>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="border-t border-sky-300 pt-4">
                <h3 className="font-semibold mb-2">Available Variants</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 mr-12  gap-2 ">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex flex-col space-y-4  p-2 md:p-4 border-t border-sky-300 rounded-lg border text-sm space-x-4 md:text-base transition-all  duration-300 ${
                        selectedVariant?.id === variant.id 
                          ? 'border-sky-500 bg-sky-50 shadow-md' 
                          : 'border-gray-200 hover:border-sky-200 hover:shadow-sm'
                      }`}
                    >
                      {variant.size && <div className="text-gray-500 ml-4">Size: {variant.size}</div>}
                     
                      {variant.color && (
                        <div className="flex items-center mt-1">
                          <div 
                            className="w-3 h-3 md:w-4 md:h-4 rounded-full mr-1"
                            style={{ backgroundColor: variant.color }}
                          ></div>
                          <span className="text-xs md:text-sm">Color</span>
                        </div>

                      )}
                       <div className="text-sky-600">${parseFloat(variant.price).toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 border-t border-sky-100 pt-4">
              <div className="flex items-center border-2 border-sky-200 rounded-lg overflow-hidden">
                <button 
                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
                 className="p-2 text-sky-600 hover:bg-sky-100 transition-colors duration-300"
               >
                 <Minus className="h-4 w-4 md:h-5 md:w-5" />
               </button>
               <span className="px-3 md:px-4 py-2 font-semibold text-sm md:text-base">
                 {quantity}
               </span>
               <button 
                 onClick={() => setQuantity(Math.min((selectedVariant?.stock || product.stock), quantity + 1))}
                 className="p-2 text-sky-600 hover:bg-sky-100 transition-colors duration-300"
               >
                 <Plus className="h-4 w-4 md:h-5 md:w-5" />
               </button>
             </div>
             <span className="text-sm md:text-base text-gray-500">
               {selectedVariant?.stock || product.stock} items in stock
             </span>
           </div>

           {/* Action Buttons */}
           <div className="flex gap-1 md:gap-4 border-t border-sky-100 pt-4">
             <button 
               onClick={handleAddToCart}
               disabled={(selectedVariant?.stock || product.stock) === 0}
               className=" bg-sky-600 text-white py-2 md:py-3 px-4 rounded-lg
                        hover:bg-sky-700 transition-all duration-300 
                        flex items-center justify-center gap-4
                        transform hover:scale-102 active:scale-98
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-sm md:text-base"
             >
               <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
               <span>
                 {(selectedVariant?.stock || product.stock) === 0 ? 'Out of Stock' : 'Add to Cart'}
               </span>
             </button>
             <button 
               onClick={handleWishlistToggle}
               className={`p-2 md:p-3 rounded-lg transition-all duration-300 
                        transform hover:scale-105 active:scale-95
                        ${isInWishlist 
                          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                          : 'text-sky-600 bg-sky-100 hover:bg-sky-200'
                        }`}
             >
               <Heart className={`h-5 w-5 md:h-6 md:w-6 ${isInWishlist ? 'fill-current' : ''}`} />
             </button>
           </div>

           {/* Product Features */}
           <div className=" grid grid-cols-2 gap-3 md:gap-4 border-t border-sky-100 pt-4">
             <div className="flex items-center gap-2 text-sm md:text-base">
               <Truck className="text-sky-500 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
               <span>Free Shipping</span>
             </div>
             <div className="flex items-center gap-2 text-sm md:text-base">
               <Gift className="text-sky-500 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
               <span>Gift Wrap Available</span>
             </div>
           </div>

           {/* Product Identifiers */}
           {(product.barcode || product.qr_code) && (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 border-t border-sky-100 pt-4">
               {product.barcode && (
                 <div className="flex items-center gap-2 text-sm md:text-base">
                   <Barcode className="text-sky-500 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                   <span className="truncate">Barcode: {product.barcode}</span>
                 </div>
               )}
               {product.qr_code && (
                 <div className="flex items-center gap-2 text-sm md:text-base">
                   <QrCode className="text-sky-500 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                   <span className="truncate">QR Code: {product.qr_code}</span>
                 </div>
               )}
             </div>
           )}

           {/* Responsive Back to Top Button - Only visible on mobile */}
           {/* <button 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             className="fixed bottom-4 right-4 bg-sky-600 text-white p-3 rounded-full shadow-lg 
                      hover:bg-sky-700 transition-all duration-300 md:hidden"
           >
             <ChevronLeft className="h-5 w-5 transform rotate-90" />
           </button> */}
         </div>
       </div>
     </div>
   </div>
 );
};
export default ProductDetailPage; 

