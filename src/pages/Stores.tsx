import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchStores } from "../services/services";
import { 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaClock, 
  FaStore, 

  FaChevronRight 
} from "react-icons/fa";

const StoreCard = ({ store }: { store: Store }) => (
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-sky-200 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-300 ease-in-out"></div>
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-sky-50 transition-all duration-300 transform hover:-translate-y-3 overflow-hidden">
      <div className="p-6 pb-4">
        <div className="flex items-center mb-6">
          <div className="bg-sky-100 p-3 rounded-full mr-4">
            <FaStore className="text-sky-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-semibold text-sky-900 truncate flex-grow">
            {store.store_name}
          </h2>
        </div>
        
        <div className="space-y-4">
          <StoreDetailItem 
            icon={<FaMapMarkerAlt className="text-sky-500" />} 
            text={store.location} 
          />
          <StoreDetailItem 
            icon={<FaBriefcase className="text-sky-500" />} 
            text={store.type || 'Unspecified Type'} 
          />
          <StoreDetailItem 
            icon={<FaClock className="text-sky-500" />} 
            text={store.working_hours || 'No Hours Specified'} 
          />
          
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="h-1 w-1/3 bg-sky-100 rounded-full"></div>
          <div className="h-1 w-1/3 bg-sky-100 rounded-full"></div>
        </div>
      </div>
      
      <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <FaChevronRight className="text-sky-600 text-2xl" />
      </div>
    </div>
  </div>
);

const StoreDetailItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center text-sky-800">
    <div className="w-6 mr-3 flex items-center justify-center">
      {icon}
    </div>
    <span className="text-lg truncate flex-grow">{text}</span>
  </div>
);

const StoreGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <div 
        key={index} 
        className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-sky-100 rounded-full mr-4"></div>
            <div className="h-6 bg-sky-200 rounded w-3/4"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center">
                <div className="w-6 h-6 bg-sky-100 rounded-full mr-3"></div>
                <div className="h-4 bg-sky-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const StoreGrid = () => {
  const { data: stores, isLoading } = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: fetchStores,
  });

  return (
    <div className="container min-h-screen px-4 sm:px-10 md:px-20 py-10 bg-gradient-to-br from-sky-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-sky-900 mb-10 text-center">
          Our Stores
        </h1>
        
        {isLoading ? (
          <StoreGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores?.map((store: any) => (
              <Link
                key={store.id}
                to={`/store/${store.id}`}
                className="focus:outline-none focus:ring-2 focus:ring-sky-300 rounded-2xl"
              >
                <StoreCard store={store} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreGrid;