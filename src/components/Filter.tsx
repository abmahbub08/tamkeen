import { useEffect, useState } from "react";
import { Range } from "react-range";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";

const Filter = ({
  categories,
  onCategoryClick,
  
  filters,
  isLoading,
}: any) => {
  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "black",
    "white",
    "orange",
    "pink",
    "gray",
  ];

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    category: true,
    price: true,
    colors: true,
    size: true,
    //dressStyle: true,
  });

  const [priceRange, setPriceRange] = useState([20, 80]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  // const [selectedSize, setSelectedSize] = useState<string>("");
  //const [selectedStyle, setSelectedStyle] = useState<string>("");

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor((prev) => (prev === color ? "" : color));
  };

  // Handle size selection
  // const handleSizeSelect = (size: string) => {
  //   setSelectedSize((prev) => (prev === size ? "" : size));
  // };

  // Handle style selection
  // const handleStyleSelect = (style: string) => {
  //   setSelectedStyle((prev) => (prev === style ? "" : style));
  // };

  // Apply filters function
  // Inside Filter component
  // const applyFilters = () => {
  //   setFilters({
  //     color: selectedColor,
  //     size: selectedSize,
  //     min_price: priceRange[0].toString(),
  //     max_price: priceRange[1].toString(),
  //   });
  // };

  useEffect(() => {
    // Function to read URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Get values from URL params or use defaults
    const urlPriceMin = parseInt(urlParams.get("min_price") || "");
    const urlPriceMax = parseInt(urlParams.get("max_price") || "");
    const urlColor = urlParams.get("color") || "";
    const urlSize = urlParams.get("size") || "";

    // Update states if URL params are present and valid
    if (!isNaN(urlPriceMin) && !isNaN(urlPriceMax)) {
      setPriceRange([urlPriceMin, urlPriceMax]);
    }

    if (urlColor) {
      setSelectedColor(urlColor);
    }

    if (urlSize) {
      // setSelectedSize(urlSize);
    }
  }, []);

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h1 className="text-2xl font-bold">Filters</h1>
      <div className="divider"></div>
      {/* Filter by Category */}
      {isLoading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse h-8 w-20 rounded"
            ></div>
          ))}
        </div>
      ) : (
        <div>
          <h3
            onClick={() => toggleSection("category")}
            className="text-lg font-semibold mb-2 cursor-pointer flex justify-between items-center"
          >
            Category
            {openSections["category"] ? <FiChevronUp /> : <FiChevronDown />}
          </h3>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openSections["category"] ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((category: any) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryClick(category.id)}
                  className={`px-4 py-2 border rounded ${
                    filters.category_id?.includes(category.id)
                      ? "bg-primary text-white" // Set primary color if selected
                      : "bg-gray-200 text-gray-800" // Default color if not selected
                  }`}
                >
                  {category.category_name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Filter by Price */}
      <div>
        <h3
          onClick={() => toggleSection("price")}
          className="text-lg font-semibold mb-2 cursor-pointer flex justify-between items-center"
        >
          Price
          {openSections["price"] ? <FiChevronUp /> : <FiChevronDown />}
        </h3>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSections["price"] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {openSections["price"] && (
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <span>{`$${priceRange[0]}`}</span>
                <span>{`$${priceRange[1]}`}</span>
              </div>
              <Range
                values={priceRange}
                step={1}
                min={0}
                max={100}
                onChange={(values) => setPriceRange(values)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="w-full h-2 bg-gray-300 rounded-full"
                    style={{
                      background: `linear-gradient(to right, #d1d5db ${
                        ((priceRange[0] - 0) / (100 - 0)) * 100
                      }%, #27AAE1 ${
                        ((priceRange[0] - 0) / (100 - 0)) * 100
                      }%, #27AAE1 ${
                        ((priceRange[1] - 0) / (100 - 0)) * 100
                      }%, #d1d5db ${((priceRange[1] - 0) / (100 - 0)) * 100}%)`,
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="h-6 w-6 rounded-full bg-white shadow-md"
                  />
                )}
              />
            </div>
          )}
        </div>
      </div>
      {/* Filter by Colors */}
      <div>
        <h3
          onClick={() => toggleSection("colors")}
          className="text-lg font-semibold mb-2 cursor-pointer flex justify-between items-center"
        >
          Colors
          {openSections["colors"] ? <FiChevronUp /> : <FiChevronDown />}
        </h3>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSections["colors"] ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="flex flex-wrap my-2 p-2 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`relative w-10 h-10  rounded-full ${
                  selectedColor === color
                    ? "ring-2 ring-offset-2 ring-gray-500"
                    : "opacity-80 hover:opacity-100 ring-gray-200 ring-1"
                }`}
                style={{ backgroundColor: color }}
              >
                {selectedColor === color && (
                  <div className="absolute -top-2 -right-2 text-white bg-gray-800 p-1 rounded-full">
                    <FaCheck />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Filter by Size */}
      {/* <div>
        <h3
          onClick={() => toggleSection("size")}
          className="text-lg font-semibold mb-2 cursor-pointer flex justify-between items-center"
        >
          Size
          {openSections["size"] ? <FiChevronUp /> : <FiChevronDown />}
        </h3>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSections["size"] ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="flex flex-wrap gap-2">
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                onClick={() => handleSizeSelect(size)}
                className={`px-4 py-2 border rounded ${
                  selectedSize === size
                    ? "bg-primary text-white"
                    : "bg-gray-200"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div> */}
      {/* Filter by Dress Style */}
      {/* <div>
        <h3
          onClick={() => toggleSection("dressStyle")}
          className="text-lg font-semibold mb-2 cursor-pointer flex justify-between items-center"
        >
          Dress Style
          {openSections["dressStyle"] ? <FiChevronUp /> : <FiChevronDown />}
        </h3>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSections["dressStyle"] ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="flex flex-wrap gap-2">
            {["Casual", "Formal", "Sporty"].map((style) => (
              <button
                key={style}
                onClick={() => handleStyleSelect(style)}
                className={`px-4 py-2 border rounded ${
                  selectedStyle === style
                    ? "bg-primary text-white"
                    : "bg-gray-200"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div> */}
      {/* <button
        onClick={applyFilters}
        className="mt-4 text-white btn btn-primary w-full"
      >
        Apply Filters
      </button> */}
    </div>
  );
};

export default Filter;



