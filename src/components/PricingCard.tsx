import { useState } from 'react';
import { FaCheck, FaStar, FaShoppingCart } from "react-icons/fa"; // Icons for rating and cart
import PricingTable from './PricingTable';

interface Props {
  id: number;
  level_name: string;
  monthly_fee: number;
  description: string;
  rating: number; // Subscription plan rating
  active?: boolean; // Whether the plan is active or not
  percentage_in_level_1: number; percentage_in_level_2: number; percentage_in_level_3: number;
}

const levelColors: Record<string, { border: string; text: string; button: string }> = {
  bronze: { border: "border-[#CA9666]", text: "text-[#CA9666]", button: "bg-[#CA9666] hover:bg-[#b5712e] text-white" },
  silver: { border: "border-[#A3A3A3]", text: "text-[#A3A3A3]", button: "bg-[#A3A3A3] hover:bg-[#a8a8a8] text-white" },
  gold: { border: "border-[#FDC936]", text: "text-[#FDC936]", button: "bg-[#FDC936] hover:bg-[#e6c200] text-black" },
  platinum: { border: "border-[#434343]", text: "text-[#434343]", button: "bg-[#434343] hover:bg-[#636363] text-white" },
  diamond: { border: "border-primary", text: "text-primary", button: "bg-primary hover:bg-primary-dark text-white" },
};

const PricingCard = ({
  level_name,
  monthly_fee,
  description,
  rating,
  active, // Whether the plan is active or not
  percentage_in_level_1,percentage_in_level_2,percentage_in_level_3,
}: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const levelClass = levelColors[level_name.toLowerCase()] || {
    border: "border-stroke",
    text: "text-primary",
    button: "btn-primary",
  };

  return (
    <>
      <div className="flex justify-center px-2 w-full mb-8">
        <div className={`relative flex flex-col justify-between items-center mb-10 w-[300px] max-w-full overflow-hidden rounded-[15px] border-2 ${levelClass.border} bg-white p-6 shadow-lg hover:scale-105 transition-all duration-300`}>

          {/* Subscription Plan Name */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{level_name}</h2>

          {/* Rating */}
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, index) => (
              <FaStar key={index} className={`text-${index < rating ? 'yellow-500' : 'gray-300'} text-lg`} />
            ))}
            <span className="ml-2 text-gray-500">({rating})</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4">{description}</p>

          {/* Price */}
          <span className="text-lg font-bold text-gray-800 mb-4">${monthly_fee} / month</span>

          {/* Active Status */}
          <div className={`text-sm ${active ? 'text-green-500' : 'text-red-500'} mb-4`}>
            {active ? "Active Plan" : "Inactive Plan"}
          </div>

          {/* Subscription Features */}
          <div className="text-sm text-gray-600 mb-4">
            <ul className="list-disc pl-5">
              <li>Access to premium features</li>
              <li>Priority customer support</li>
              <li>Exclusive content</li>
            </ul>
          </div>

          {/* Subscribe Button */}
          <button
            className={`w-full py-3 text-lg font-semibold ${levelClass.button} rounded-xl shadow-md hover:shadow-lg transition-all duration-200`}
            onClick={() => setModalOpen(true)}
          >
            <FaShoppingCart className="inline mr-2" /> Subscribe
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-[90%] sm:w-[90vw] max-w-lg sm:max-w-7xl p-6 rounded-2xl shadow-lg relative transform transition-all duration-300">
            <h2 className={`text-3xl font-bold mb-4 ${levelClass.text}`}>
              {level_name} Subscription
            </h2>
            <PricingTable level_name={level_name} levelColor={levelClass.text} monthly_fee={monthly_fee} p1={percentage_in_level_1} p2={percentage_in_level_2} p3={percentage_in_level_3} />

            <button
              className={`mt-4 w-full py-3 text-lg font-semibold ${levelClass.button} rounded-xl shadow-md hover:shadow-lg transition-all duration-200`}
              onClick={() => setModalOpen(false)}
            >
              Buy Subscription
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PricingCard;