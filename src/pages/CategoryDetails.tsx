import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
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
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleCategoryFilter = async (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    try {
      if (categoryId === null) {
        setFilteredProducts(products);
      } else {
        const response = await axios.get(`https://api.tamkeen.center/api/categories/${categoryId}/products`);
        setFilteredProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      setFilteredProducts([]);
    }
    setIsMobileMenuOpen(false);
  };

  const handleAddToCart = (id: number) => {
    console.log(`Added product ${id} to cart`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for larger screens */}
      <aside className=" mt-16 hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-gray-200">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
              selectedCategory === null ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                selectedCategory === category.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category.category_name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                {selectedCategory === null
                  ? 'All Products'
                  : `Products in ${categories.find(c => c.id === selectedCategory)?.category_name}`}
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu, show/hide based on menu state */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 z-40 flex mt-6">
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto mt-4">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    <button
                      onClick={() => handleCategoryFilter(null)}
                      className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                        selectedCategory === null ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryFilter(category.id)}
                        className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                          selectedCategory === category.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {category.category_name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No products found
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductCategoryPage;

