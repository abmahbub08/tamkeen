import React from "react";
import { Link } from "react-router-dom";
import vegetables from "../assets/vegetables.png"

interface BasketCardProps {
  //image: string;
  name: string;
  total_price: number;
}

const BasketCard: React.FC<BasketCardProps> = ({
  //image,
  name,
  total_price,
  
}) => {
  return (
    <Link
      to={"/categories/product"}
      className="card w-[300px] bg-white rounded-lg overflow-hidden"
    >
      {/* Image Section */}
      <figure className="w-full px-10">
        <img
          src={vegetables}
          alt={name}
          className="w-full rounded-lg h-60 object-cover"
        />
      </figure>

      {/* Content Section */}
      <div className="card-body p-4">
        {/* Title */}
        <h2 className="card-title text-lg font-semibold text-gray-800">
          {name}
        </h2>

        {/* Price Section */}
        <div className="flex items-center space-x-2 my-2">
          <span className="text-xl font-bold text-primary">{total_price}$</span>
          {/* <span className="text-sm text-gray-500 line-through">
            {discountPrice} AED
          </span> */}
        </div>
      </div>
    </Link>
  );
};

export default BasketCard;
