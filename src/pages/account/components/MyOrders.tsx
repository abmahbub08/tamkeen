import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { accountOrders } from "../../../services/services";
import { format } from "date-fns";

interface Order {
  id: number;
  user_id: number;
  store_id: number;
  total_price: string;
  order_status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  review: null;
  cancel_reason: null;
  products: [
    {
      id: number;
      store_id: number;
      name: string;
      description: string;
      price: string;
      stock: number;
      cover_image: string;
      background_image: string;
      discount_type: null;
      discount_value: null;
      start_date: null;
      end_date: null;
      rating: null;
      created_at: string;
      updated_at: string;
      discounted_price: null;
      variants: [
        {
          id: number;
          product_id: number;
          size: string;
          color: string;
          material: string;
          style: string;
          gender: string;
          capacity: string;
          weight: string;
          created_at: string;
          updated_at: string;
        }
      ];
    }
  ];
}

const MyOrders: React.FC = () => {
  const [filter, setFilter] = useState("");

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["orders", filter],
    queryFn: () => accountOrders(filter),
  });

  // Filter options
  const filters = [
    "All",
    "Waiting for Payment",
    "pending",
    "Shipping",
    "Completed",
    "Refund/Exchange",
    "canceled",
  ];

  const statusColors: { [key: string]: string } = {
    "Waiting for Payment": "bg-yellow-500",
    pending: "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-lg",
    Shipping: "blue-500",
    Completed: "green-500",
    "Refund/Exchange": "purple-500",
    Canceled: "red-500",
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Your Orders
      </h2>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
        {filters.map((status, index) => (
          <button
            key={index}
            className={`btn ${
              filter === status ? "btn-primary" : "btn-outline btn-primary"
            }`}
            onClick={() => setFilter(status === "All" ? "" : status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 sm:p-6 rounded-lg border animate-pulse"
            >
              <div className="flex justify-between items-center mb-2 sm:mb-4">
                <div className="h-4 bg-gray-200 rounded w-1/3 sm:w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <hr className="my-2 sm:my-4" />
              <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4">
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gray-200 rounded-xl mb-2 sm:mb-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <hr className="my-2 sm:my-4" />
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Order Cards */
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {orders?.map((order) => (
            <Link to={`/account/order/${order.id}`} key={order.id}>
              <div className="bg-white p-4 sm:p-6 rounded-lg border">
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 font-bold text-lg">
                    <p className="text-base sm:text-lg">{order.id}</p>
                    <p className="text-sm sm:text-base">
                      {format(new Date(order.created_at), "MMMM d, yyyy")}
                    </p>
                  </div>

                  <p
                    className={`${
                      statusColors[order.order_status]
                    } font-semibold text-sm sm:text-sm`}
                  >
                    {order.order_status}
                  </p>
                </div>

                <hr className="my-2 sm:my-4" />

                {/* Product and Price Information */}
                <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4">
                  <img
                    src="https://via.placeholder.com/80"
                    alt="Product"
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl object-cover mb-2 sm:mb-0"
                  />
                  <div className="text-center sm:text-left">
                    <p className="text-sm sm:text-base">
                      {order?.products[0]?.name}
                    </p>
                    <p className="text-sm sm:text-base">
                      {order?.products.length > 1 &&
                        (order?.products.length > 1) + "+ more"}
                    </p>
                  </div>
                </div>

                <hr className="my-2 sm:my-4" />

                <div className="flex justify-between">
                  <p className="font-semibold text-sm sm:text-base">
                    Total Payment
                  </p>
                  <p className="text-lg sm:text-xl font-bold">
                    ${order.total_price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
