import { useParams } from "react-router-dom";
// import MapComponent from "../components/Map";
import ProductCard from "../components/ProductCard";
import {
  FaRegEnvelope,
  FaRegClock,
  FaRegStar,
  FaRegUser,
  FaWhatsapp,
  // FaFacebook,
  // FaInstagram,
  // FaTwitter,
} from "react-icons/fa6"; // Outline icons and social icons
// import { useState, useEffect } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { IoStorefrontOutline } from "react-icons/io5";
import { fetchStoreProduct, getStore } from "../services/services";
import { useQuery } from "@tanstack/react-query";
import LoadingCard from "../components/LoadingCard";

export const stores = [
  {
    id: 1,
    name: "Store 1",
    slug: "store-1",
    imageUrl: "https://via.placeholder.com/600", // Dummy image for Store 1
    description: "This is Store 1's description",
    type: "Electronics",
    email: "store1@example.com",
    location: "123 Main St, New York, NY",
    openTime: "09:00",
    closeTime: "21:00",
    whatsapp: "+12345678901",
    followers: 1200,
    rating: 4.5,
    position: { lat: 40.748817, lng: -73.985428 },
    testimonials: [
      {
        name: "John Doe",
        role: "Tech Enthusiast",
        review: "Great store with amazing products!",
        image: "https://via.placeholder.com/50",
        rating: 5,
      },
      {
        name: "Jane Smith",
        role: "Customer",
        review: "Loved the customer service!",
        image: "https://via.placeholder.com/50",
        rating: 4.5,
      },
    ],
    socialMedia: {
      facebook: "https://facebook.com/store1",
      instagram: "https://instagram.com/store1",
      twitter: "https://twitter.com/store1",
    },
    similarStores: [
      { name: "Store 2", slug: "store-2" },
      { name: "Store 3", slug: "store-3" },
    ],
  },
  {
    id: 2,
    name: "Store 2",
    slug: "store-2",
    imageUrl: "https://via.placeholder.com/600", // Dummy image for Store 1
    description: "This is Store 2's description",
    type: "Fashion",
    email: "store2@example.com",
    location: "456 Broadway, New York, NY",
    openTime: "10:00",
    closeTime: "20:00",
    whatsapp: "+12345678902",
    followers: 950,
    rating: 4.7,
    position: { lat: 40.748817, lng: -73.985428 },
    testimonials: [
      {
        name: "Emily White",
        role: "Fashion Blogger",
        review: "Stylish clothes, great quality!",
        image: "https://via.placeholder.com/50",
        rating: 5,
      },
      {
        name: "Oliver Brown",
        role: "Customer",
        review: "Will definitely return!",
        image: "https://via.placeholder.com/50",
        rating: 4.7,
      },
    ],
    socialMedia: {
      facebook: "https://facebook.com/store2",
      instagram: "https://instagram.com/store2",
      twitter: "https://twitter.com/store2",
    },
    similarStores: [
      { name: "Store 1", slug: "store-1" },
      { name: "Store 3", slug: "store-3" },
    ],
  },
  {
    id: 3,
    name: "Store 3",
    slug: "store-3",
    imageUrl: "https://via.placeholder.com/600", // Dummy image for Store 1
    description: "This is Store 3's description",
    type: "Groceries",
    email: "store3@example.com",
    location: "789 Market St, New York, NY",
    openTime: "07:00",
    closeTime: "22:00",
    whatsapp: "+12345678903",
    followers: 1350,
    rating: 4.8,
    position: { lat: 40.748817, lng: -73.985428 },
    testimonials: [
      {
        name: "David Johnson",
        role: "Chef",
        review: "Fresh produce and excellent service!",
        image: "https://via.placeholder.com/50",
        rating: 4.8,
      },
      {
        name: "Maria Gonzales",
        role: "Customer",
        review: "Good variety of products.",
        image: "https://via.placeholder.com/50",
        rating: 4.5,
      },
    ],
    socialMedia: {
      facebook: "https://facebook.com/store3",
      instagram: "https://instagram.com/store3",
      twitter: "https://twitter.com/store3",
    },
    similarStores: [
      { name: "Store 1", slug: "store-1" },
      { name: "Store 2", slug: "store-2" },
    ],
  },
];

const StoreDetails = () => {
  const { slug } = useParams();
  // const [isOpen, setIsOpen] = useState(false);

 

  // Helper function to check if the store is open based on the current time
 

  // useEffect(() => {
  //   setIsOpen(checkIfOpen());
  // }, []);

  const { data: products, isLoading:isProductLoading } = useQuery({
    queryKey: ["products",slug],
    queryFn: () => fetchStoreProduct(slug),
  });

  const { data: store } = useQuery<Store>({
    queryKey: ["store",slug],
    queryFn: () => getStore(slug),
  });


//  const checkIfOpen = () => {
//     const currentTime = new Date();
//     const openTime = new Date(`1970-01-01T${store.openTime}`);
//     const closeTime = new Date(`1970-01-01T${store.closeTime}`);

//     return currentTime >= openTime && currentTime <= closeTime;
//   };

  return (
    <div className="container mx-auto mt-20 px-4 sm:px-10 md:px-20 py-10">
      {/* Hero Section */}
      <div className="rounded-xl shadow border flex flex-col md:flex-row items-center justify-between py-10 px-5">
        <div className="text-black md:w-1/2">
          <h1 className="text-3xl sm:text-4xl font-bold">{store?.store_name}</h1>
          {/* <p className="mt-3 text-xl sm:text-2xl">{store.description}</p> */}
          <div className="mt-5 flex space-x-4">
            <a href="category" className="btn btn-primary text-white text-lg">
              Shop Now
            </a>
            <a
              href="#explore"
              className="btn btn-outline btn-primary hover:text-white text-lg"
            >
              Explore More
            </a>
          </div>
        </div>
        <div className="mt-6 md:mt-0 md:w-1/2">
          <img
            src={store?.image}
            alt={store?.store_name}
            className="object-cover h-[240px] md:h-full w-full"
          />
        </div>
      </div>

      {/* Store Information Section */}
      <div
        id="explore"
        className="flex flex-col md:flex-row justify-between gap-6 my-10"
      >
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold">{store?.store_name}</h2>
          <div className="text-lg text-gray-500 flex items-center mt-4">
            <IoStorefrontOutline className="mr-3" />
            {store?.type}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center mt-2 text-lg">
              <FaRegEnvelope className="mr-3" />
              <span>{store?.store_email}</span>
            </div>
            <div className="flex items-center mt-2 text-lg">
              <FaRegClock className="mr-3" />
              <span>
                {store?.working_hours}
              </span>
              {/* <span
                className={`ml-4 text-lg ${
                  isOpen ? "text-green-500" : "text-red-500"
                }`}
              >
                {isOpen ? "Open Now" : "Closed"}
              </span> */}
            </div>
            <div className="flex items-center mt-2 text-lg">
              <FaWhatsapp className="mr-3" />
              <span>{store?.store_phone}</span>
            </div>
            <div className="flex items-center mt-2 text-lg">
              <CiLocationArrow1 className="mr-3" />
              <span>{store?.location}</span>
            </div>
            <div className="flex items-center mt-2 text-lg">
              <FaRegUser className="mr-3" />
              {/* <span>{store.followers} Followers</span> */}
            </div>
            <div className="flex items-center mt-2 text-lg">
              <FaRegStar className="mr-3" />
              {/* <span>{store.} Rating</span> */}
            </div>
          </div>

          {/* Social Media Links Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
            {/* <div className="flex space-x-6 text-3xl">
              {store.socialMedia?.facebook && (
                <a
                  href={store.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  <FaFacebook />
                </a>
              )}
              {store.socialMedia?.instagram && (
                <a
                  href={store.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500"
                >
                  <FaInstagram />
                </a>
              )}
              {store.socialMedia?.twitter && (
                <a
                  href={store.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400"
                >
                  <FaTwitter />
                </a>
              )}
            </div> */}
          </div>
        </div>

        <div className="w-full md:w-[40vw] mt-6 md:mt-0">
          {/* <MapComponent position={store.position} /> */}
        </div>
      </div>

      {/* Product Section */}
      <section
        id="shop"
        className="container flex flex-col gap-10 items-center mx-auto"
      >
        <div className="w-full flex items-start justify-start">
          <p className="text-xl text-primary">Best Selling</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-start w-full">
        {isProductLoading
            ? Array(4).fill(<LoadingCard />)
            : products?.map((product: any) => <ProductCard {...product} />)}
        </div>
      </section>

      {/* Testimonials */}
      {/* <div className="my-10">
        <Testimonials testimonials={store.testimonials} />
      </div> */}

      {/* Similar Stores */}
      <div className="my-10">
        <h2 className="text-2xl font-semibold mb-4">Similar Stores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* {store.similarStores.map((similarStore, index) => (
            <div key={index} className="card bg-blue-500 p-4 text-white">
              {similarStore.name}
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;
