import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { fetchCategoriesById } from "../services/services";
// import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ProductCardProps {
  id?: number;
  image: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  stock: number;
  rating: number;
  colors?: string[];
  discounted_price: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  title,
  description,
  price,
  stock,
  rating,
  colors,
  discounted_price,
}) => {
  // Set selectedColor to the first color in the array or a default value if colors is not provided
  const [selectedColor, setSelectedColor] = useState(colors?.[0] || "");

  useEffect( () => {
    const fetchCategoriesById = async () => {
      const apiUrl = `https://api.tamkeen.center/api`;
      const { data } = await axios.get(`${apiUrl}/categories/${id}`);
      console.log("from landing page", data);
    }

    fetchCategoriesById();
  },[])


  const renderStars = (rating: number) => {
    const fullStars = Math.ceil(rating);

    return (
      <div className="rating rating-sm">
        {[...Array(5)].map((_, index) => (
          <input
            key={index}
            type="radio"
            name="rating"
            className={`mask mask-star-2 ${
              index < fullStars ? "bg-yellow-500" : "bg-gray-300"
            }`}
            checked={index < fullStars}
            readOnly
          />
        ))}
      </div>
    );
  };

  return (
    <Link
      to={`/categories/${id}`}
      className="card w-[300px] bg-white rounded-lg  transition transform hover:scale-105 hover:shadow-lg border overflow-hidden"
    >
      {/* Image Section */}
      <figure className="w-full">
        <img
          src={image || "https://via.placeholder.com/150"}
          alt={title}
          className="w-full h-60 object-cover"
        />
      </figure>

      {/* Content Section */}
      <div className="card-body p-4">
        {/* Title */}
        <h2 className="card-title text-lg font-semibold text-gray-800">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm line-clamp-2">{description}</p>

        {/* Price Section */}
        <div className="flex items-center space-x-2 my-2">
          <span className="text-xl font-bold text-primary">${price}</span>
          {discounted_price && (
            <span className="text-sm text-gray-500 line-through">
              {discounted_price} AED
            </span>
          )}
        </div>

        {/* Stock Warning */}
        {stock < 5 && (
          <p className="text-red-600 font-semibold text-sm">
            Only {stock} left in stock!
          </p>
        )}

        {/* Color Picker */}
        {colors && colors.length > 0 && (
          <div className="flex items-start flex-col mt-2">
            <p className="text-sm text-gray-600">Choose a color:</p>
            <ul className="flex gap-2 mt-1">
              {colors.map((color, index) => (
                <li key={index}>
                  <input
                    type="radio"
                    name={`color-${title}`}
                    className={`radio rounded-full cursor-pointer transition border-2 ${
                      selectedColor === color ? "ring-2 ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    checked={selectedColor === color}
                    onChange={() => setSelectedColor(color)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rating Section */}
        <div className="flex items-center justify-between mt-3">
          {renderStars(rating)}
          <span className="text-sm text-gray-600">{rating || 0} / 5</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
