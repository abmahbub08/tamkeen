import { useEffect, useState } from "react";
import {
  FaShippingFast,
  FaShoppingCart,
  FaRegCreditCard,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import {
  addToCart,
  addToWishList,
  fetchProduct,
  RemoveFromWishList,
} from "../services/services";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { authAtom } from "../atoms/authAtom";

interface Product {
  id: number; // Change from 1 to number
  store_id: number; // Change from 1 to number
  name: string; // Change from "Red T-Shirt" to string
  description: string; // Change from "A casual red t-shirt made from 100% cotton." to string
  price: string; // Change from "19.99" to string
  stock: number; // Change from 59 to number
  cover_image: string; // Change from "red_tshirt_cover.jpg" to string
  background_image: string; // Change from "red_tshirt_bg.jpg" to string
  discount_type: string | null; // Change from null to string | null
  discount_value: string | null; // Change from null to string | null
  start_date: string | null; // Change from null to string | null
  end_date: string | null; // Change from null to string | null
  rating: number | null; // Change from null to number | null
  created_at: string; // Change from "2024-10-02T11:55:42.000000Z" to string
  updated_at: string; // Change from "2024-10-06T13:47:54.000000Z" to string
  discounted_price: string | null; // Change from null to string | null
  variants: {
    // Change from [ to Array<{
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
    images: any[]; // Change from [] to any[]
  }[];
  ratings: {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    review: string;
    created_at: string;
    updated_at: string;
  }[]; // Change from [] to any[]
  added_to_wishlist: boolean; // Change from false to boolean
  added_to_cart: boolean; // Change from true to boolean
  purchased: boolean; // Change from true to boolean
}

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState("description"); // State to manage active tab
  const [quantity, setQuantity] = useState(1); // State to manage quantity
  const [selectedVariantId, setSelectedVariantId] = useState<number>();
  const { slug } = useParams();
  const [addedToWishList, setAddedToWishlist] = useState<boolean>();
  const [authState] = useAtom(authAtom);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleShowToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
  };

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["products", slug, addedToWishList],
    queryFn: () => fetchProduct(slug),
  });

  console.log(product);
  


  useEffect(() => {
    if (product) {
      setAddedToWishlist(product.added_to_wishlist);
    }
  }, [product]);
   

  const handleVariantSelection = (variantId: number) => {
    setSelectedVariantId(variantId);
  };

  const incrementQuantity = () => {
    setQuantity((prevQty) => prevQty + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQty) => (prevQty > 1 ? prevQty - 1 : 1));
  };

  if (isLoading) {
    return (
      <section className="py-22 mt-12 sm:py-16 sm:px-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16 mt-8 lg:mt-12">
            {/* Image Gallery Skeleton */}
            <div className="  col-span-3 row-span-3 flex gap-4">
              <div className="flex sm:flex-col  col-span-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 w-20 bg-gray-200 rounded-lg"
                  ></div>
                ))}
              </div>{" "}
              <div className="h-[400px] w-[600px] bg-gray-200 rounded-lg"></div>
            </div>

            {/* Product Details Skeleton */}
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 rounded-md"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded-md"></div>
              <div className="h-8 w-1/3 bg-gray-200 rounded-md"></div>
              <div className="h-8 w-1/3 bg-gray-200 rounded-md"></div>
              <div className="h-8 w-1/3 bg-gray-200 rounded-md"></div>
              <div className="h-8 w-1/3 bg-gray-200 rounded-md"></div>
              <div className="h-8 w-1/3 bg-gray-200 rounded-md"></div>
              <div className="h-8 w-1/3 bg-gray-200 rounded-md"></div>

              <div className="space-y-2 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-5 w-full bg-gray-200 rounded-md"
                  ></div>
                ))}
              </div>

              <div className="mt-6 flex gap-4">
                <div className="h-10 w-1/4 bg-gray-200 rounded-md"></div>
                <div className="h-10 w-1/3 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-22 sm:py-16">
      <div className="container mt-14 mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <a href="#" className="link link-hover hover:text-gray-800">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="#" className="link link-hover hover:text-gray-800">
                Products
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="#" className="link link-hover hover:text-gray-800">
                Coffee
              </a>
            </li>
          </ol>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16 mt-8 lg:mt-12">
          {/* Image Gallery */}
          <div className="lg:col-span-3">
            <div className="lg:flex lg:items-start">
              <div className="lg:order-2 lg:ml-5">
                <div className="max-w-xl rounded-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={`https://api.tamkeen.center/${product?.cover_image}`} // Use fetched image
                    alt={product?.name} // Use product? name for alt text
                  />
                </div>
              </div>
              <div className="mt-2 lg:order-1 lg:w-32 lg:flex-shrink-0">
                <div className="flex flex-row items-start lg:flex-col">
                  {[1, 2, 3].map((_, index) => (
                    <button
                      key={index}
                      className={`aspect-square h-20 mb-3 border-2 ${
                        index === 0 ? "border-gray-900" : "border-transparent"
                      } rounded-lg overflow-hidden`}
                    >
                      <img
                        className="h-full w-full object-cover"
                        src={`https://via.placeholder.com/100x100?text=Image+${
                          index + 1
                        }`} // Placeholder for thumbnails
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold sm:text-3xl">{product?.name}</h1>

            <div className="mt-5 flex items-center space-x-2">
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, index) =>
                    index < (product?.rating || 0) ? (
                      <AiFillStar
                        key={index}
                        className="text-yellow-500 h-5 w-5"
                      />
                    ) : (
                      <AiFillStar
                        key={index}
                        className="text-gray-300 h-5 w-5"
                      />
                    )
                  )}
              </div>
              <p className="text-sm text-gray-500">{product?.rating}/5</p>
            </div>

            {/* Price after rating */}
            <div className="mt-2 flex items-end text-3xl font-bold">
              <span>{product?.price}$</span>
              {/* Uncomment if you have a discount */}
              {/* <span className="line-through text-xl text-gray-500 mr-2">
                {product?.base_price}$
              </span>
              <span className="ml-2 text-red-500 text-base">(25% off)</span> */}
            </div>

            {product?.stock && product.stock < 5 && (
              <p className="text-red-600 font-semibold text-sm">
                Only {product?.stock} left in stock!
              </p>
            )}

            <div className="mt-3 flex select-none flex-wrap items-center gap-1">
              {product?.variants?.map((variant) => (
                <div key={variant.id}>
                  <ul className="flex flex-col gap-2">
                    {variant.gender && (
                      <li>
                        <strong>Gender : </strong> {variant.gender}
                      </li>
                    )}{" "}
                    {variant.material && (
                      <li>
                        <strong>Material : </strong> {variant.material}
                      </li>
                    )}
                    {variant.style && (
                      <li>
                        <strong>Style : </strong>
                        {variant.style}
                      </li>
                    )}{" "}
                    {variant.capacity && (
                      <li>
                        <strong>Capacity : </strong> {variant.capacity}
                      </li>
                    )}{" "}
                    {variant.weight && (
                      <li>
                        <strong>Weight : </strong> {variant.weight}
                      </li>
                    )}
                  </ul>
                  <h2 className="mt-8 text-lg font-semibold text-gray-900">
                    Pick a Color
                  </h2>
                  <label className="relative">
                    <input
                      type="radio"
                      name="color"
                      className="peer sr-only"
                      onChange={() => handleVariantSelection(variant.id)}
                    />
                    <span
                      className={`peer-checked:ring-2 peer-checked:ring-offset-2 rounded-full border border-gray-300 w-8 h-8 block cursor-pointer transition-all hover:scale-110 ${
                        selectedVariantId === variant.id
                          ? "ring-2 ring-black"
                          : ""
                      }`} // Add a ring effect if selected
                      style={{ backgroundColor: variant.color }}
                    ></span>
                  </label>
                  <h2 className="mt-8 text-lg font-semibold text-gray-900">
                    Select Size
                  </h2>
                  <label>
                    <input
                      type="radio"
                      name="size"
                      value={variant.size}
                      className="peer sr-only "
                      onChange={() => handleVariantSelection(variant.id)}
                    />
                    <p
                      className={`peer-checked:bg-primary cursor-pointer peer-checked:text-white rounded-lg border border-primary px-6 py-2 font-bold ${
                        selectedVariantId === variant.id
                          ? "bg-primary text-white"
                          : ""
                      }`}
                    >
                      {variant.size}
                    </p>
                  </label>
                </div>
              ))}
            </div>

            {/* Moved Add to Cart Button */}
            <div className="mt-6 flex gap-4">
              {/* Quantity Counter */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    className="btn btn-outline btn-circle btn-primary"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    className="btn btn-outline btn-circle btn-primary"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>
              </div>

              {authState.isAuthenticated && (
                <button
                  onClick={() =>
                    addToCart(
                      product?.store_id,
                      product?.id,
                      quantity,
                      selectedVariantId || 0
                    ).then((message) => {
                      handleShowToast(message);
                      return message;
                    })
                  }
                  className="btn text-white btn-primary flex items-center justify-center"
                  disabled={selectedVariantId === undefined}
                >
                  <FaShoppingCart size={20} className="mr-3" /> Add to cart
                </button>
              )}

              {product?.added_to_wishlist !== undefined ? (
                <button
                  className="btn"
                  onClick={() => {
                    product?.added_to_wishlist === false
                      ? (addToWishList(product?.id).then((message) => {
                          handleShowToast("Prodcut added To Wishlist Successfully");
                          return message;
                        }),
                        setAddedToWishlist(true))
                      : (RemoveFromWishList(product?.id).then((message) => {
                          handleShowToast(message);
                          return message;
                        }),
                        setAddedToWishlist(false));
                  }}
                >
                  {addedToWishList ? (
                    <FaHeart size={30} />
                  ) : (
                    <FaRegHeart size={30} />
                  )}
                </button>
              ) : (
                ""
              )}
            </div>

            <ul className="mt-8 space-y-2">
              <li className="flex items-center text-sm">
                <FaShippingFast className="mr-2 text-gray-500" />
                Free shipping worldwide
              </li>
              <li className="flex items-center text-sm">
                <FaRegCreditCard className="mr-2 text-gray-500" />
                Cancel Anytime
              </li>
            </ul>
          </div>

          {/* Product Description & Reviews Tabs */}
          <div className="lg:col-span-5">
            <div className="border-b border-gray-300">
              <nav className="flex justify-between w-full gap-4">
                <button
                  className={`py-4 w-full ${
                    activeTab === "description"
                      ? "border-b-2 border-gray-900 text-gray-900"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`py-4 w-full ${
                    activeTab === "reviews"
                      ? "border-b-2 border-gray-900 text-gray-900"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="mt-8">
              {activeTab === "description" ? (
                <>
                  <h2 className="text-3xl font-bold">Product Description</h2>
                  <p className="mt-4">{product?.description}</p>
                </>
              ) : (
                <div className="grid sm:grid-cols-2 gap-2 sm:gap-10">
                  {product?.purchased && (
                    <div className="col-start-2 justify-self-end">
                      <Link
                        to={`/categories/${product.id}/review`}
                        className="btn text-white btn-primary flex items-center justify-center"
                      >
                        Add a review
                      </Link>
                    </div>
                  )}
                  {product?.ratings?.map((review) => (
                    <div className="card border p-10 w-full h-full">
                      <div className="flex items-center">
                        {/* <div className="mr-3">
                          <img
                            src="https://via.placeholder.com/50"
                            alt="Reviewer"
                            className="rounded-full"
                          />
                        </div> */}
                        <div>
                          <p className="font-semibold">Reviewer Name</p>
                          <div className="flex items-center">
                            {Array(5)
                              .fill(0)
                              .map((_, index) =>
                                index < review.rating ? (
                                  <AiFillStar
                                    key={index}
                                    className="text-yellow-500 h-4 w-4"
                                  />
                                ) : (
                                  <AiFillStar
                                    key={index}
                                    className="text-gray-300 h-4 w-4"
                                  />
                                )
                              )}
                            <p className="text-sm text-gray-500 ml-2">
                              {review.rating}/5
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2">{review.review}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {showToast && (
          <div className="toast toast-bottom toast-center min-w-96 z-50">
            <div className="alert bg-primary text-white">
              <div>
                <span className="text-wrap text-center">{toastMessage}</span>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setShowToast(false)}
              >
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
      
    </section>
  );
};

export default ProductPage;
