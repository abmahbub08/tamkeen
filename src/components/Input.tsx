import React, { useState, useEffect } from "react";

// Define the Product interface
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  rating: string;
}

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load products from local storage or fetch from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // First, check local storage
        const storedProducts = localStorage.getItem('products');
        
        if (storedProducts) {
          // If products exist in local storage, parse and set them
          setProducts(JSON.parse(storedProducts));
        } else {
          // If no products in local storage, fetch from API
          const response = await fetch("https://api.tamkeen.center/api/products");
          const data = await response.json();
          
          // Save fetched products to local storage
          localStorage.setItem('products', JSON.stringify(data));
          
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback to local storage in case of network error
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

  // Filter and suggest products based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProducts([]);
    } else {
      // More comprehensive search including description and multiple matching
      const filtered = products.filter((product) => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Sort results to prioritize exact matches
      const sortedFiltered = filtered.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
        const bNameMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        return 0;
      });

      setFilteredProducts(sortedFiltered);
    }
  }, [searchTerm, products]);

  // Function to handle product selection
  const handleProductSelect = (product: Product) => {
    // You can implement additional logic here, like navigating to product detail
    console.log("Selected Product:", product);
    setSearchTerm(product.name); // Fill the search bar with selected product name
    setFilteredProducts([]); // Clear suggestions
  };

  return (
    <div className="w-full max-w-md mx-auto mt-32">
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading && (
          <div className="absolute right-4 top-2 text-gray-500">Loading...</div>
        )}
        {filteredProducts.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleProductSelect(product)}
              >
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
            ))}
          </div>
        )}
        {searchTerm !== "" && !loading && filteredProducts.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            <div className="px-4 py-2 text-gray-500">No results found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;