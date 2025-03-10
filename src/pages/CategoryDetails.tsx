import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, ShoppingCart, Star } from 'lucide-react';
import ProductCard from './ProductCardComp';

type Category = {
  id: number;
  category_name: string;
};

type Product = {
  id: number;
  store_id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  cover_image: string | null;
  color: string | null;
  size: string | null;
  discounted_price: string;
  rating: string;
  orders_count: number;
};


const ProductCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get('https://api.tamkeen.center/api/categories'),
          axios.get(`https://api.tamkeen.center/api/categories/${id}/products`)
        ]);
        setCategories(categoriesResponse.data);
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);
        setLoading(false);
        console.log(products)
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleCategoryFilter = async (categoryId: number) => {
    setSelectedCategory(categoryId);
    try {
      const response = await axios.get(`https://api.tamkeen.center/api/categories/${categoryId}/products`);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      setFilteredProducts([]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sky-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-sky-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-sky-50 mt-24">
      {/* Categories Sidebar */}

      {/* Categories Sidebar */}
      <div className="w-64 bg-white p-4 border-r shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-sky-900 mb-6 flex-shrink-0">Categories</h2>
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-sky-300 scrollbar-track-sky-100 pr-2">
          <div className="space-y-2">
            {categories.map(category => (
              <div
                key={category.id}
                className={`
            p-2 cursor-pointer rounded-lg  
            ${selectedCategory === category.id ? 'bg-sky-200' : 'hover:bg-sky-100'}
            transition-colors duration-200
          `}
                onClick={() => handleCategoryFilter(category.id)}
              >
                <span className="text-sm font-medium">{category.category_name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Products Grid */}
      <div className="flex-grow p-6 ">
        <h1 className="text-3xl font-bold text-sky-900 mb-6">

          {selectedCategory
            ? `Products in ${categories.find(c => c.id === selectedCategory)?.category_name}`
            : 'All Products'}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {filteredProducts.length > 0 ? (
            filteredProducts?.map(prod => (
              //           <div 
              //             key={product.id} 
              //             className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              //           >
              //             <div className="relative h-48 bg-gray-100 flex items-center justify-center">
              //               {product.cover_image ? (
              //                 <img
              //                   src={`https://api.tamkeen.center/${product.cover_image}`}
              //                   alt={product.name}
              //                   className="h-full w-full object-cover"
              //                 />
              //               ) : (
              //                 <span className="text-gray-500">No Image</span>
              //               )}
              //               {product.rating && (
              //                 <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-full flex items-center">
              //                   <Star className="w-4 h-4 mr-1" fill="white" />
              //                   {product.rating}
              //                 </div>
              //               )}
              //             </div>
              //             <div className="p-4">
              //               <h3 className="text-lg font-bold text-sky-900 mb-2">{product.name}</h3>
              //               <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

              //               <div className="flex justify-between items-center mb-3">
              //                 <div>
              //                   <p className="text-sky-700 font-bold text-xl">${product.discounted_price}</p>
              //                   {product.size && (
              //                     <span className="text-xs text-gray-500 mr-2">Size: {product.size}</span>
              //                   )}
              //                   {product.color && (
              //                     <span className="text-xs text-gray-500">Color: {product.color}</span>
              //                   )}
              //                 </div>
              //                 <span 
              //                   className={`
              //                     text-xs font-semibold px-2 py-1 rounded-full
              //                     ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
              //                   `}
              //                 >
              //                   {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
              //                 </span>
              //               </div>

              //               <div className="flex space-x-2">
              //                 <button
              //                     className="
              //         w-full bg-sky-600 text-white py-3 rounded-lg 
              //         flex items-center justify-center space-x-3
              //         hover:bg-sky-700 transition duration-300
              //         disabled:bg-sky-300 disabled:cursor-not-allowed
              //         transform active:scale-95
              //       "
              //                     disabled={product.stock === 0}
              //                 >
              //                     <ShoppingCart className="w-6 h-6" />
              //                     <span className="font-semibold">Add to Cart</span>
              //                 </button>

              //                 <button
              //                     className="
              //   flex items-center justify-center bg-gray-500 text-white p-3 rounded-lg
              //   hover:bg-gray-600 transition duration-300
              //   transform active:scale-95
              // "
              //                     onClick={() => navigate("/products/"+product.id)}
              //                 >
              //                     <Eye className="w-6 h-6" />
              //                 </button>
              //             </div>
              //             </div>
              //           </div>
              <ProductCard
                key={prod.id}
                product={prod}
                
                onAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <div className="col-span-full text-center mt-24 py-10 text-sky-500">
              No products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const handleAddToCart = (id: number) => {
  console.log(`Added product ${id} to cart`);
};
export default ProductCategoryPage;