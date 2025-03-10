import { useState, useEffect } from 'react';
import shoes from "../assets/blue sneakers.png";
import sofa from "../assets/sofa.png";
import toyTrain from "../assets/toyTrain.png";
import decor from "../assets/Decor.png";
import hats from "../assets/Hats.png";
import jewelry from "../assets/jewelry.png";
import ProductCard from "./ProductCardComp";
import { Wallet, PackageOpen, } from 'lucide-react';

import { FaArrowRightLong } from "react-icons/fa6";
import NewArrivalProducts from "../components/NewArrival";
import AboutUs from "./AboutUs";
import { Link } from "react-router-dom";
import coloredBuckets from "../assets/coloredBuckets.png";
import PricingCard from "../components/PricingCard";
import {
  addToMyCoupons,
  fetchCoupons,
  fetchPricing,
  fetchTestimonials,
  getBestSelling,
  getFlashSales,

} from "../services/services";



import Cookies from 'js-cookie';



import { useQuery } from "@tanstack/react-query";
import LoadingCard from "../components/LoadingCard";
import Testimonials from "../components/Testimonials";
import CouponCard from "../components/CouponCard";

import { authAtom } from "../atoms/authAtom";
import { useAtom } from "jotai";
import axios from "axios";
import BasketDisplay from './BasketBox';

type Product = {
  id: number;
  store_id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  cover_image: string | null;
  color: string | null;
  size: string | null;
  discounted_price: string;
  rating: string;
  orders_count: number;
};


const DEMO_PACKAGES = [
  {
    id: 1,
    name: "Silver Savings Plan",
    total_price: "5000.00",
    number_of_uses: 1000,
    description: "Affordable savings package for beginners"
  },
  {
    id: 2,
    name: "Gold Investment Bundle",
    total_price: "15000.00",
    number_of_uses: 500,
    description: "Comprehensive investment strategy"
  },
  {
    id: 3,
    name: "Platinum Growth Package",
    total_price: "25000.00",
    number_of_uses: 250,
    description: "Premium financial growth plan"
  },

  {
    id: 4,
    name: "Diamond Investment Bundle",
    total_price: "40000.00",
    number_of_uses: 400,
    description: "Comprehensive investment strategy"
  }
];


const LandingPage = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [authState] = useAtom(authAtom);


  const [packages, setPackages] = useState([]);
  const [isPackagesLoading, setIsPackagesLoading] = useState(true);
  const [error, setError] = useState(null);




  const handleShowToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
  };
  const handleAddToCart = (id: number) => {
    console.log(`Added product ${id} to cart`);
  };
  const bentoGrid = [
    {
      id: 1,
      class: "md:col-span-2 bg-[#d4edf8] rounded-xl flex-col md:flex-row", // Span 2 columns on medium+ screens, stack vertically on small screens
      img: shoes,
      title: "Clothing & Shoes",
      button: "bg-[#0A73A1] text-white hover:bg-[#0A73A1]",
      subtitle: "SNEAKERS",
    },
    {
      id: 2,
      class: "bg-[#EEEEEE] rounded-xl flex-col col-span-1", // One column by default
      img: sofa,
      title: "Home & Living",
      subtitle: "SOFA",
    },
    {
      id: 3,
      class: "bg-[#FEF9C4] rounded-xl flex-col col-span-1", // One column by default
      img: toyTrain,
      title: "Toys & Entertainment",
      subtitle: "TOY TRAIN",
    },
    {
      id: 4,
      class: "md:col-span-2 bg-[#f2e7e3] rounded-xl flex-col md:flex-row", // Span 2 columns on medium+ screens
      img: decor,
      title: "Toys & Entertainment",
      button: "bg-[#A46E1C] text-white hover:bg-[#A46E1C]",
      subtitle: "Decor",
    },
    {
      id: 5,
      class: "bg-[#E3F2E6] rounded-xl flex-col col-span-1", // One column by default
      img: hats,
      title: "Toys & Entertainment",
      subtitle: "PARTY DECORS",
    },
    {
      id: 6,
      class: "bg-[#FAE8E8] rounded-xl flex-col col-span-1", // One column by default
      img: jewelry,
      title: "Jewelry & Accessories",
      subtitle: "DIAMOND",
    },
  ];

  const { data: pricing, isLoading: isPricingLoading } = useQuery({
    queryKey: ["pricing"],
    queryFn: fetchPricing,
  });

  const { data: coupons, isLoading: isCouponsLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: fetchCoupons,
  });

  const { data: testimonials, isLoading: isTestimonialsLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });

  // const { data: packages, isLoading: isPackagesLoading } = useQuery({
  //   queryKey: ["packages"],
  //   queryFn: getPackages,
  // });

  const { data: bestSelling, isLoading: isBestSellingLoading } = useQuery({
    queryKey: ["bestSelling"],
    queryFn: getBestSelling,
  });

  console.log(bestSelling);


  const { data: flashSales, isLoading: isFlashSalesLoading } = useQuery({
    queryKey: ["flashSales"],
    queryFn: getFlashSales,
  });

  console.log(flashSales);



  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = Cookies.get('auth_token');

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('https://api.tamkeen.center/api/packages', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setPackages(response.data.length > 0 ? response.data : DEMO_PACKAGES);
        setIsPackagesLoading(false);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setPackages(DEMO_PACKAGES);
        // setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsPackagesLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-24 mt-28 sm:mt-28">
      <section className=" flex flex-col items-center gap-6">
        <p className="text-3xl text-primary">Monthly string values</p>
        <p className="text-gray-500">
          Making monthly purchases through our different investment packages
        </p>
        <div className="flex flex-wrap justify-center w-full gap-4 mt-10">
          {isPricingLoading
            ? Array(3).fill(<LoadingCard />)
            : pricing?.map((item: any) => (
              <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4"> {/* Adjust the width based on screen size */}
                <PricingCard key={item.id} {...item} />
              </div>
            ))}
        </div>
      </section>

      {/* Hero Section */}
      <section className="container max-w-7xl flex flex-col items-center p-6 sm:p-10 gap-6 ">
        <p className="text-3xl sm:text-5xl max-w-3xl leading-normal font-bold text-center">
          Shop everything you need online from the US businesses{" "}
          <p className="text-primary">you love</p>
        </p>
        <p className="text-gray-400">And for a limited time only...</p>
        <Link
          className="btn btn-primary text-white rounded-full px-12 sm:px-20"
          to={"/signup"}
        >
          Join The Tamkeen
        </Link>
        <Link to="/categories" className="btn btn-link text-black">
          Shop all products
        </Link>
      </section>

      <section className="container flex flex-col gap-10">
        <div className="md:flex px-4 sm:px-20">
          <p className="sm:text-5xl text-3xl font-black">
            WE REVOLUTIONIZE SHOPPING ONLINE
          </p>
          <div className="flex flex-col gap-4 ">
            <p>
              Lorem ipsum dolor sit amet consectetur. Quis vitae cras lacus orci
              enim id imperdiet. Purus sit aliquet donec sagittis scelerisque.
            </p>
            <div className="flex gap-2">
              <button className="btn btn-primary text-white">
                Shop Now <FaArrowRightLong />{" "}
              </button>
              <button className="btn btn-primary btn-outline">
                Learn more <FaArrowRightLong />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full">
          <img className="w-full" src={coloredBuckets} alt="" />
        </div>
      </section>


      {/* basket */}
      <section className="container px-4 sm:px-20 py-10 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-sky-700 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-sky-500" />
            Savings Baskets
          </h2>
        </div>

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isPackagesLoading
          ? Array(4).fill(0).map((_, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))
          : packages.map((basket) => (
              <div 
                key={basket.id} 
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-sky-800 flex items-center gap-2">
                      <PackageOpen className="w-6 h-6 text-sky-500" />
                      {basket.name}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-sky-400" />
                      Price: {parseFloat(basket.total_price).toLocaleString()} SAR
                    </p>
                    <p className="text-gray-600">
                      Uses: {basket.number_of_uses.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
      </div> */}
        <BasketDisplay></BasketDisplay>

        {/* <div className="flex justify-center mt-10">
          <Link
            to="/categories/19"
            className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2 shadow-md"
          >
            View All Baskets
            <PackageOpen className="w-5 h-5" />
          </Link>
        </div> */}
      </section>

      <section className="container flex flex-col gap-10">
        <div className="w-full flex items-start justify-start">
          <p className="text-lg sm:text-xl text-primary mb-4">Best Selling</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ">
          {bestSelling?.map((prod: Product) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCart={handleAddToCart}
            />
          ))
          }
        </div>
        <div className="self-center">
          <Link to="/bestselling" className="btn  btn-primary text-white">
            View all Products
          </Link>
        </div>
      </section>


      {/* Bento Grid Section */}
      <section className="container max-w-8xl sm:px-10 h-auto">
        <Link to="/categories/17">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bentoGrid.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col p-4 sm:p-8 justify-between items-center ${item.class} `}
              >

                <div className="flex flex-col justify-around">
                  <div>
                    <p>{item.title}</p>
                    <p className="text-2xl sm:text-4xl text-gray-500 font-semibold">
                      {item.subtitle}
                    </p>
                  </div>
                  {item.button && (
                    <Link to='/categories/17' className={`btn ${item.button} mt-4`}>
                      Shop Now<FaArrowRightLong />
                    </Link>
                  )}
                </div>
                <div className="flex justify-center">
                  <img
                    src={item.img}
                    alt={item.subtitle}
                    className="max-w-full h-auto object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </Link>
      </section>

      <section className="container flex flex-col gap-10">
        <div className="w-full flex items-start justify-start">
          <p className="text-lg sm:text-xl text-primary mb-4">Flash Sales</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ">
          {flashSales?.map((prod: Product) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCart={handleAddToCart}
            />
          ))
          }
        </div>
        <div className="self-center">
          <Link to="/flashSale" className="btn btn-primary text-white">
            View all Products
          </Link>
        </div>
      </section>


      {authState.isAuthenticated && (
        <section className="container px-4 sm:px-20 flex flex-col gap-10 items-center mx-auto">
          <h2 className="text-lg sm:text-xl text-primary">Available Coupons</h2>
          <div className="flex flex-wrap gap-6 place-items-start w-full">
            {isCouponsLoading
              ? Array(4).fill(
                <div className="card p-10 border">
                  <div className=" flex w-52 flex-col gap-4 ">
                    <div className="flex items-center gap-4">
                      <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                      <div className="flex flex-col gap-4">
                        <div className="skeleton h-4 w-20"></div>
                        <div className="skeleton h-4 w-28"></div>
                      </div>
                    </div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                  </div>
                </div>
              )
              : coupons?.map((coupon: Coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onSave={(type: string, id: number) =>
                    addToMyCoupons(type, id).then((message) => {
                      handleShowToast(message);
                      return message;
                    })
                  }
                />
              ))}
          </div>
        </section>
      )}

      <section>
        {" "}
        <p className="text-primary text-center text-3xl">
          Latest Products
        </p>{" "}
        <NewArrivalProducts />
      </section>

      <AboutUs />

      <section className=" container gap-10">
        {isTestimonialsLoading ? (
          Array(4).fill(
            <div className="card p-10 border">
              <div className=" flex w-52 flex-col gap-4 ">
                <div className="flex items-center gap-4">
                  <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                  <div className="flex flex-col gap-4">
                    <div className="skeleton h-4 w-20"></div>
                    <div className="skeleton h-4 w-28"></div>
                  </div>
                </div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
              </div>
            </div>
          )
        ) : (
          <Testimonials testimonials={testimonials} />
        )}
      </section>
      {showToast && (
        <div className="toast toast-bottom toast-center min-w-96 z-50">
          <div className="alert bg-primary text-white">
            <div>
              <span>{toastMessage}</span>
            </div>
            <div className="cursor-pointer" onClick={() => setShowToast(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;