import { useQuery } from "@tanstack/react-query";
import { getWishes } from "../../../services/services";
import { Link } from "react-router-dom";

interface Wish {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    store_id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    cover_image: string;
    background_image: string;
    discount_type: string;
    discount_value: string;
    start_date: string;
    end_date: string;
    rating: string;
    created_at: string;
    updated_at: string;
    discounted_price: string;
  };
}
const MyWishlist = () => {
  const { data: wishes } = useQuery<Wish[]>({
    queryKey: ["wishes"],
    queryFn: getWishes,
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg">
      {/* MyWishlist Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">MyWishlist ({wishes?.length})</h2>
        <button className="btn text-white btn-outline btn-primary">
          Move All To Bag
        </button>
      </div>

      {/* MyWishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishes?.map((wish, index) => (
          <div key={index} className=" rounded-lg p-4">
            {/* Product Image */}
            <img
              src={wish.product.cover_image}
              alt={wish.product.name}
              className="w-full rounded-lg h-72 object-cover mb-4"
            />

            {/* Product Name */}
            <h3 className="text-lg font-bold">{wish.product.name}</h3>

            {/* Product Rating */}
            <p className="text-sm text-gray-500 mb-2">
              Rating: {wish.product.rating}/5
            </p>

            {/* Price and Discount */}
            <div className="flex items-center space-x-4">
              <p className="text-xl font-bold">${wish.product.price}</p>
              {parseInt(wish.product.discounted_price) > 0 && (
                <p className="text-green-500 font-semibold">
                  -{wish.product.discounted_price}%
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <Link
              to={`/categories/${wish.product_id}`}
              className="btn btn-outline w-full btn-primary mt-4"
            >
              View Product
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyWishlist;
