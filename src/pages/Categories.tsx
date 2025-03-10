import { useQuery } from "@tanstack/react-query";
import Filter from "../components/Filter";
import ProductCard from "../components/ProductCard";
import { fetchCategories, fetchProducts } from "../services/services";
import { useEffect, useState } from "react";
import LoadingCard from "../components/LoadingCard";
import { useLocation, useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Update URL when filters change

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters({
      category_id: params.get("category_id")?.split(",").map(Number) || [],
      min_price: params.get("min_price") || "",
      max_price: params.get("max_price") || "",
      color: params.get("color") || "",
      size: params.get("size") || "",
    });
  }, [location.search]);

  
  // State for active filters
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [filters, setFilters] = useState<{
    category_id: number[];
    min_price: string;
    max_price: string;
    color: string; // Update to array
    size: string; // Update to array
  }>({
    category_id: [],
    min_price: "",
    max_price: "",
    color: "", // Initialize as array
    size: "", // Initialize as array
    // Initialize as array for dress styles
  });

  // Update query key when filters change
  const { data: products, isLoading: isProductLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(),
  });

  const handleCategoryClick = (id: number) => {
    const isChildCategory = childCategories.some(
      (child: any) => child.id === id
    );

    if (isChildCategory) {
      // If a child category is clicked, toggle its selection
      setFilters((prevFilters: any) => {
        const updatedCategoryIds = prevFilters.category_id.includes(id)
          ? prevFilters.category_id.filter((catId: any) => catId !== id) // Deselect child
          : [...new Set([...prevFilters.category_id, id])]; // Select child (ensure parent is selected if not already)

        // Ensure the parent category is included if a child is selected
        if (!updatedCategoryIds.includes(activeCategory)) {
          return {
            ...prevFilters,
            category_id: [...new Set([...updatedCategoryIds, activeCategory])],
          };
        }
        console.log(prevFilters);

        return {
          ...prevFilters,
          category_id: updatedCategoryIds,
        };
      });
    } else {
      // Handle parent category selection/deselection
      setActiveCategory(id); // Update activeCategory state
      setFilters((prevFilters) => {
        const isActive = prevFilters.category_id.includes(id);
        const updatedCategoryIds = isActive
          ? prevFilters.category_id.filter((catId) => catId !== id) // Deselect parent
          : [...new Set([...prevFilters.category_id, id])]; // Select parent
        console.log(prevFilters);

        return {
          ...prevFilters,
          category_id: updatedCategoryIds,
        };
      });
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  
  useEffect(() => {
    const searchParams = new URLSearchParams();
    
    // Keep category_id intact
    if (filters.category_id?.length > 0) {
      searchParams.append("category_id", filters.category_id.join(","));
    }
    
    // Add other filters
    if (filters.min_price) searchParams.append("min_price", filters.min_price);
    if (filters.max_price) searchParams.append("max_price", filters.max_price);
    if (filters.color) searchParams.append("color", filters.color);
    if (filters.size) searchParams.append("size", filters.size);
  
    // Update the URL with the search parameters
    navigate({
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    });
  }, [filters, navigate, location.pathname]);
  
  // Filter child categories based on the selected parent category
  const selectedParentCategory = categories?.find(
    (category: any) => category.id === activeCategory
  );
  const childCategories = selectedParentCategory?.children || [];

  return (
    <div className="container mx-auto px-6 py-12 mt-20">
      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
        <div className="md:col-span-1">
          <Filter
            isLoading={isCategoriesLoading}
            categories={categories}
            onCategoryClick={handleCategoryClick}
            onApplyFilters={handleFilterChange}
            filters={filters} // Pass the current filters state
            setFilters={setFilters} // Allow Filter to update filters
          />
        </div>
        <div className="md:col-span-3">
          {/* Child Categories Bar */}
          {childCategories?.length > 0 && (
            <div className="flex space-x-4 mb-6">
              {childCategories.map((child: any) => (
                <button
                  key={child.id}
                  onClick={() => handleCategoryClick(child.id)}
                  className={`py-2 px-4 rounded-lg ${
                    filters.category_id.includes(child.id)
                      ? "bg-primary text-white" // Set primary color if selected
                      : "bg-gray-200 text-gray-800" // Default color if not selected
                  }`}
                >
                  {child.category_name}
                </button>
              ))}
            </div>
          )}

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {isProductLoading
              ? Array(9).fill(<LoadingCard />)
              : products?.map((product: any) => (
                  <ProductCard key={product.title} {...product} />
                ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <div className="btn-group">
              <button className="btn btn-sm">1</button>
              <button className="btn btn-sm btn-active">2</button>
              <button className="btn btn-sm">3</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
