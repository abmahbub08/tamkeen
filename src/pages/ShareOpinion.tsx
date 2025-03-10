import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { addRating } from "../services/services";
import { useParams } from "react-router-dom";

const Reviews = () => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [hover, setHover] = useState<number>(0);
  const { slug } = useParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleShowToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (slug) {
      if (rating > 0) {
        addRating(rating, review, slug).then(() => {
          handleShowToast("Rating Submitted Successfully");
          setReview("");
          setRating(0);
        });
      } else {
        handleShowToast("Rating is Required");
      }
    }
  };

  return (
    <div className="container px-20 border p-6 rounded-lg mt-20 space-y-6">
      {/* No Reviews Message */}
      <h2 className="text-2xl font-semibold">Reviews</h2>
      {/* Review Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Rating Section */}
        <div>
          <h3 className="font-semibold mb-2">Your Rating</h3>
          <div className="flex">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    className="hidden"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                  />
                  <FaStar
                    className={`cursor-pointer text-2xl ${
                      (hover || rating) >= ratingValue
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>
        </div>
        <div className="w-full">
          <label className="block font-semibold mb-2" htmlFor="review">
            Your Review
          </label>
          <textarea
            id="review"
            className="textarea textarea-bordered w-full"
            rows={4}
            placeholder="Write your review here"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button type="submit" className="btn btn-primary w-full text-white">
            Submit
          </button>
        </div>
      </form>
      {showToast && (
        <div className="toast toast-bottom toast-center min-w-72 z-50">
          <div className="alert bg-primary text-white">
            <div>
              <span className="text-wrap text-center">{toastMessage}</span>
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

export default Reviews;
