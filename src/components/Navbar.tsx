import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { Link, useNavigate } from "react-router-dom";
import { 
  IoCartOutline, 
  IoMenu, 
  IoClose, 
  IoFilter, 
  IoCloseCircle, 
  IoSearchOutline 
} from "react-icons/io5";
import { MdOutlineAccountCircle } from "react-icons/md";
import { authAtom } from "../atoms/authAtom";
import logo from "../assets/TamkeenLogo.svg";
import Cookies from "js-cookie";

// Product Interface
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  rating: string;
  image?: string;
  categoryId?: number;
}

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [authState, setAuthState] = useAtom(authAtom);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Navigation items
  const nav = [
    { label: "Home", route: "/" },
    { label: "Category", route: "/category" },
    { label: "Contact", route: "/contact" },
    { label: "Stores", route: "/stores" },
  ];

  // Logout handler
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setAuthState({ user: null, isAuthenticated: false });
    setMenuOpen(false);
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const storedProducts = localStorage.getItem('products');
        
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        } else {
          const response = await fetch("https://api.tamkeen.center/api/product-all");
          const data = await response.json();
          
          localStorage.setItem('products', JSON.stringify(data));
          
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Clear search input and dropdown
  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredProducts([]);
    setShowDropdown(false);
  };

  // Filter products based on search term
  const filterProducts = () => {
    if (searchTerm === "") {
      setFilteredProducts([]);
      setShowDropdown(false);
      return;
    }

    const filtered = products.filter((product) => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedFiltered = filtered.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
      const bNameMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      return 0;
    });

    setFilteredProducts(sortedFiltered);
    setShowDropdown(sortedFiltered.length > 0);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Only show dropdown after 2 characters
    if (value.length >= 2) {
      filterProducts();
    } else {
      setFilteredProducts([]);
      setShowDropdown(false);
    }
  };

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    navigate(`/product/${product.id}`);
    setSearchTerm("");
    setFilteredProducts([]);
    setShowDropdown(false);
    setMobileSearchOpen(false);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setShowDropdown(false);
      setFilteredProducts([]);
      setMobileSearchOpen(false);
    }
  };

  // Handle filter button click
  const handleFilterClick = () => {
    navigate('/categories/17');
    setMenuOpen(false);
  };

  // Render search dropdown
  const renderSearchDropdown = (isMobile = false) => {
    if (!showDropdown) return null;

    return (
      <div 
        className={`absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg 
          ${isMobile ? 'max-h-[50vh]' : 'max-h-60'} overflow-y-auto`}
      >
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
            onClick={() => handleProductSelect(product)}
          >
            {product.image && (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-12 h-12 mr-4 object-cover rounded"
              />
            )}
            <div className="flex-grow">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    {product.description}
                  </div>
                </div>
                <div className="text-sm text-indigo-500 font-semibold">
                  ${product.price}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Stock: {product.stock} | Rating: {product.rating}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Desktop and Mobile Navbar */}
      <nav className="fixed w-full z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="w-20">
            <img src={logo} alt="Tamkeen Logo" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Desktop Menu Items */}
            <div className="flex space-x-4">
              {nav.map((item) => (
                <Link
                  key={item.label}
                  to={item.route}
                  className="text-gray-600 hover:text-indigo-600 transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Search */}
            <div className="relative min-w-[300px]">
              <form onSubmit={handleSearchSubmit} className="flex">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={filterProducts}
                    className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <IoCloseCircle size={20} />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleFilterClick}
                  className="bg-gray-100 px-3 py-2 border rounded-r-md hover:bg-gray-200"
                >
                  <IoFilter />
                </button>
              </form>
              
              {/* Desktop Dropdown */}
              {renderSearchDropdown()}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="flex items-center space-x-2">
              {authState.isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link to="/cart" className="text-gray-600 hover:text-indigo-600">
                    <IoCartOutline size={24} />
                  </Link>
                  <Link to="/account" className="text-gray-600 hover:text-indigo-600">
                    <MdOutlineAccountCircle size={28} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-outline btn-danger"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/signup" className="btn btn-primary">
                    Register
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-primary">
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="text-gray-600 hover:text-indigo-600"
            >
              <IoSearchOutline size={24} />
            </button>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 hover:text-indigo-600"
            >
              {menuOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden container mx-auto px-4 pb-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={filterProducts}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <IoCloseCircle size={20} />
                </button>
              )}
              <button
                type="button"
                onClick={handleFilterClick}
                className="absolute right-0 top-0 h-full px-3 bg-gray-100 border-l rounded-r-md hover:bg-gray-200"
              >
                <IoFilter />
              </button>
            </form>
            
            {/* Mobile Dropdown */}
            {renderSearchDropdown(true)}
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden absolute w-full bg-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-4 mb-4">
                {nav.map((item) => (
                  <Link
                    key={item.label}
                    to={item.route}
                    className="block text-gray-700 hover:text-indigo-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="space-y-3">
                {authState.isAuthenticated ? (
                  <div className="space-y-3">
                    <Link 
                      to="/cart" 
                      className="block btn btn-outline w-full"
                      onClick={() => setMenuOpen(false)}
                    >
                      Cart
                    </Link>
                    <Link 
                      to="/account" 
                      className="block btn btn-outline w-full"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="btn btn-danger w-full"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      to="/signup" 
                      className="btn btn-primary w-full"
                      onClick={() => setMenuOpen(false)}
                    >
                      Register
                    </Link>
                    <Link 
                      to="/login" 
                      className="btn btn-outline btn-primary w-full"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;