import React from "react";
import { useParams } from "react-router-dom";
import { getOrder } from "../../../services/services";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  total_price: string;
  order_status: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

const MyOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  const timelineItems = [
    {
      year: "Wed, 1 lth Jan",
      description: "Order Confirmed",
    },
    {
      year: "Wed, 1 lth Jan",
      description: "Shipped",
    },
    {
      year: "Wed, 1 lth Jan",
      description: "Out for delivery",
    },
    {
      year: "Wed, 1 lth Jan",
      description: "Delivered",
    },
  ];

  const renderStatusContent = () => {
    switch (order.order_status) {
      case "shipping":
        return (
          <div className=" p-4 rounded-md">
            <div className="flex items-center justify-end gap-2 ">
              <p className="text-right text-gray-600 text-sm">
                {order.id} • Aug 14, 2024
              </p>
              <p className="bg-purple-100 font-bold py-1 px-2 rounded-lg text-sm text-purple-800">
                {" "}
                Shipping
              </p>
            </div>

            <div className="my-4 flex flex-col gap-4">
              <p className="text-4xl font-bold">Order Id: #{order.id}</p>
              <div className="flex gap-2">
                <p>
                  Order date :
                  {format(new Date(order.created_at), "MMMM d, yyyy")}
                </p>{" "}
                |
                <p className="text-green-500">
                  Estimated delivery: May 14, 2022
                </p>
              </div>
            </div>
            <div className="divider"></div>
            <div className="flex flex-col gap-6">
              <div className="w-full md:w-1/4 flex md:flex-col items-center md:items-start">
                <p className="text-lg font-bold">Order Timeline</p>
              </div>

              <ul className="items-center sm:flex w-full justify-between">
                {timelineItems.map((item, index) => (
                  <li className="relative w-full  mb-6 sm:mb-0">
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">
                      {item.description}
                    </time>
                    <div className="flex items-center">
                      <div className="z-10 flex items-center justify-center w-6 h-6 bg-green-100 rounded-full ring-0 ring-white  sm:ring-8 shrink-0">
                        <svg
                          className="w-2.5 h-2.5 text-green-600 "
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                      </div>
                      {index < 3 && (
                        <div className="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
                      )}
                    </div>
                    <div className="mt-3 sm:pe-8">
                      <h3 className="text-sm font-semibold text-gray-900 ">
                        {item.year}
                      </h3>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case "completed":
        return (
          <div className="text-green-700 bg-green-100 w-44 items-center justify-center flex px-2 py-1 rounded-lg font-bold">
            Order Completed
          </div>
        );
      case "canceled":
        return (
          <div className="text-red-700 bg-red-100 w-44 items-center justify-center flex px-2 py-1 rounded-lg font-bold">
            Order Canceled
          </div>
        );
      case "pending":
        return (
          <div className="p-4 rounded-md flex flex-col">
            <div className="flex items-center justify-end gap-2 ">
              <p className="text-right text-gray-600 text-sm">
                {order.id} • Aug 14, 2024
              </p>
              <p className="bg-yellow-100 font-bold py-1 px-2 rounded-lg text-sm text-yellow-800">
                {" "}
                Waiting for payment
              </p>
            </div>
            <p>Pay before Aug 15, 2024 10:04</p>
            <p>Payment method: {order.payment_method}</p>
            <div className="flex gap-2 place-self-end">
              <button className="btn btn-primary btn-outline">
                Cancel Order
              </button>
              <button className="btn btn-primary text-white">
                Continue with Payment
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className=" flex flex-col max-w-4xl mx-auto gap-10">
      <div className="p-6 bg-white border rounded-xl">
        {" "}
        {renderStatusContent()}
      </div>
      <div className=" p-6 bg-white border rounded-xl">
        <h2 className="text-2xl font-bold mb-6">Order {id}</h2>

        <div className="space-y-6 mt-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div>
                <img
                  src="https://via.placeholder.com/100"
                  alt={item.product_name}
                  className="w-28 h-28 rounded-lg object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">{item.product_name}</h3>
                <p className="text-lg font-bold mt-2">Price : ${item.price}</p>
                <p className="text-lg font-bold mt-2">QTY : {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <hr className="my-6" />

        <div className="flex justify-between">
          <div className="flex justify-between">
            {" "}
            <p className="text-xl font-bold">Total</p>
            <p className="text-xl font-bold">${order.total_price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
