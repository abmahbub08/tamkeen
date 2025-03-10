import React, { useState, useEffect } from "react";
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Tag,

  Star,
  Users,
  Award,
  Globe,
 
  ShoppingCart,
  Compass,
  Heart,
  Share2,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { FaFacebook, FaInstagram } from "react-icons/fa6";

interface Owner {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface StoreData {
  id: number;
  store_name: string;
  location: string;
  store_email: string;
  store_phone: string;
  trn: string;
  type: string | null;
  working_hours: string | null;
  image: string | null;
  description?: string;
  owner: Owner;
  followers?: number;
  rating?: number;
  socials?: {
    website?: string;
    facebook?: string;
    instagram?: string;
  };
}

const StoreDetailsComponent: React.FC = () => {
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [similarStores, setSimilarStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'details' | 'description'>('details');
  const { id } = useParams();

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await fetch(`https://api.tamkeen.center/api/stores/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch store details");
        }
        const data = await response.json();
        setStoreData(data.store.data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [id]);

  useEffect(() => {
    const fetchSimilarStores = async () => {
      const ids = Array.from({ length: 4 }, (_, i) => parseInt(id || "1") + i + 1);
      const requests = ids.map((storeId) =>
        fetch(`https://api.tamkeen.center/api/stores/${storeId}`).then((res) =>
          res.ok ? res.json() : null
        )
      );
      const responses = await Promise.all(requests);
      const stores = responses
        .filter((res) => res && res.store?.data)
        .map((res) => res.store.data);
      setSimilarStores(stores);
    };

    if (id) fetchSimilarStores();
  }, [id]);

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-600"></div>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    </div>
  );

  const SocialLinks = ({ socials }: { socials?: StoreData['socials'] }) => {
    if (!socials) return null;

    console.log(SocialLinks);

    return (
      <div className="flex space-x-4 mt-4 justify-center">
        {socials.website && (
          <a 
            href={socials.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 bg-blue-50 p-3 rounded-full hover:bg-blue-100 transition"
          >
            <Globe size={24} />
          </a>
        )}
        {socials.facebook && (
          <a 
            href={socials.facebook} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 bg-blue-50 p-3 rounded-full hover:bg-blue-100 transition"
          >
            <FaFacebook size={24} />
          </a>
        )}
        {socials.instagram && (
          <a 
            href={socials.instagram} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-pink-600 hover:text-pink-800 bg-pink-50 p-3 rounded-full hover:bg-pink-100 transition"
          >
            <FaInstagram size={24} />
          </a>
        )}
      </div>
    );
  };

  const renderStoreDetails = () => {
    if (!storeData) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 mt-8">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="relative">
            {/* Hero Image Section */}
            <div className="relative h-[500px]">
              
                <img
                  src="https://i.ibb.co.com/WvL8zGs/mike-petrucci-c9-FQyq-IECds-unsplash.jpg"
                  alt={storeData.store_name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

             
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-5xl font-bold mb-2">{storeData.store_name}</h1>
                <p className="text-xl opacity-80">{storeData.type || "Store"}</p>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition">
                  <Heart className="text-white" size={24} />
                </button>
                <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition">
                  <Share2 className="text-white" size={24} />
                </button>
              </div>
            </div>

            {/* Action Buttons and Tabs */}
            <div className="bg-white py-6 px-8">
              <div className="flex justify-center space-x-6 mb-6">
                <a 
                  href="/categories/17" 
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
                >
                  <ShoppingCart size={24} />
                  <span>Shop Now</span>
                </a>
                <a
                  href="/"
                  className="flex items-center space-x-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 hover:text-white transition"
                >
                  <Compass size={24} />
                  <span>Explore More</span>
                </a>
              </div>

              {/* Tabs for Details and Description */}
              <div className="flex justify-center space-x-6 border-b border-gray-200">
                <button 
                  onClick={() => setActiveSection('details')}
                  className={`pb-3 ${activeSection === 'details' 
                    ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' 
                    : 'text-gray-500 hover:text-blue-600'}`}
                >
                  Store Details
                </button>
                <button 
                  onClick={() => setActiveSection('description')}
                  className={`pb-3 ${activeSection === 'description' 
                    ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' 
                    : 'text-gray-500 hover:text-blue-600'}`}
                >
                  About Store
                </button>
              </div>
            </div>

            {/* Content Sections */}
            <div className="p-8">
              {activeSection === 'details' ? (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-blue-700 border-b pb-2">Store Information</h2>
                    <div className="space-y-4">
                      {[
                        { icon: <MapPin className="text-blue-500" />, text: storeData.location || "No location" },
                        { icon: <Phone className="text-blue-500" />, text: storeData.store_phone || "No phone" },
                        { icon: <Mail className="text-blue-500" />, text: storeData.store_email },
                        { icon: <Tag className="text-blue-500" />, text: `TRN: ${storeData.trn}` }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 bg-blue-50 p-3 rounded-lg">
                          {item.icon}
                          <span className="text-gray-700">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-blue-700 border-b pb-2">Store Statistics</h2>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {[
                        { icon: <Users className="text-blue-500 mx-auto" />, value: storeData.followers || 0, label: "Followers" },
                        { icon: <Star className="text-yellow-500 mx-auto" />, value: storeData.rating?.toFixed(1) || "N/A", label: "Rating" },
                        { icon: <Award className="text-green-500 mx-auto" />, value: storeData.type || "N/A", label: "Type" }
                      ].map((stat, index) => (
                        <div key={index} className="bg-blue-50 p-4 rounded-lg">
                          {stat.icon}
                          <p className="font-bold text-xl text-blue-800 mt-2">{stat.value}</p>
                          <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold text-blue-700 border-b pb-2 mb-4">About {storeData.store_name}</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {storeData.description || "No description available for this store."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSimilarStores = () => (
    <div className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-800">Similar Stores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {similarStores.map((store) => (
            <div 
              key={store.id} 
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              {store.image ? (
                <img 
                  src="https://i.ibb.co.com/WvL8zGs/mike-petrucci-c9-FQyq-IECds-unsplash.jpg"
                  alt={store.store_name} 
                  className="w-full h-48 object-cover" 
                />
              ) : (
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-48 flex items-center justify-center">
                  <Store className="text-white" size={48} />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-bold text-blue-900 text-lg mb-1">{store.store_name}</h3>
                <p className="text-sm text-blue-600 mb-1">{store.type || "Store"}</p>
                <p className="text-sm text-gray-500">{store.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {loading ? <LoadingSpinner /> : error ? <ErrorDisplay /> : renderStoreDetails()}
      {!loading && !error && similarStores.length > 0 && renderSimilarStores()}
    </div>
  );
};

export default StoreDetailsComponent;