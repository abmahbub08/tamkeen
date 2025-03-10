import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getLastProducts } from "../services/services";
import { Link } from "react-router-dom";

// const products: = [
//   {
//     title: "Playstation 5",
//     description: "Next-gen gaming console experience",
//     imageUrl:
//       "https://images.pexels.com/photos/3945652/pexels-photo-3945652.jpeg?auto=compress&cs=tinysrgb&w=600", // PlayStation 5 image from Pexels
//   },
//   {
//     title: "Wireless Speaker",
//     description: "Crisp sound, seamless connection",
//     imageUrl:
//       "https://images.pexels.com/photos/922378/pexels-photo-922378.jpeg?auto=compress&cs=tinysrgb&w=600", // Wireless Speaker image from Pexels
//   },
//   {
//     title: "Premium Perfume",
//     description: "A fragrance that lasts all day",
//     imageUrl:
//       "https://img.freepik.com/free-photo/perfume-bottle-black-background_53876-102865.jpg?auto=compress&cs=tinysrgb&w=600", // Perfume image from Freepik
//   },
//   {
//     title: "Elegant Women's Hat",
//     description: "Stylish hat for any occasion",
//     imageUrl:
//       "https://images.pexels.com/photos/1550336/pexels-photo-1550336.jpeg?auto=compress&cs=tinysrgb&w=600", // Women's Hat image from Pexels
//   },
// ];

const ProductCard: React.FC<Product> = ({ name, description,id }) => {
  return (
    <div className="relative h-full bg-black overflow-hidden">
      {/* Background Image with a dark overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-75"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/3945652/pexels-photo-3945652.jpeg?auto=compress&cs=tinysrgb&w=600)`,
        }}
      >
        {/* Adding black overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Text content */}
      <div className="relative z-10 p-4 flex flex-col justify-end h-full">
        <h2 className="text-2xl font-bold text-white">{name}</h2>
        <p className="text-white">{description}</p>
        <div>
          {" "}
          <Link  to={`/categories/${id}`} className="link text-white mt-2">
            Shop Now
          </Link >
        </div>
      </div>
    </div>
  );
};

const NewArrivalProducts = () => {

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["last-products"],
    queryFn: getLastProducts,
  });

  if (isLoading) {
    return <div>Loading...</div>; // or a loading spinner
  }


  if (!products || products.length === 0) {
    return <div>No products available.</div>;
  }

  return (
    <div className="container px-4 sm:px-20 mx-auto p-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 min-h-[800px]">
      {/* Make it responsive */}
      <div className="lg:row-span-2">
        <ProductCard {...products[0]} />
      </div>
      <div className="lg:col-span-2">
        <ProductCard {...products[1]} />
      </div>
      <div className="lg:col-start-2 lg:row-start-2">
        <ProductCard {...products[2]} />
      </div>
      <div className="lg:col-start-3 lg:row-start-2">
        <ProductCard {...products[3]} />
      </div>
    </div>
  );
};

export default NewArrivalProducts;
