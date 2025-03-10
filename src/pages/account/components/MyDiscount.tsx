import { getMyDiscounts } from "../../../services/services";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface CouponRelatedItem {
  id: number;
  name: string;
  coupon_type: string;
  promotion_code: string;
  expired_at: string;
  discount_type: string;
  percentage: string;
  status: string;
  number_of_uses: number;
  use_for: string;
  created_at: string;
  updated_at: string;
}

interface ProductRelatedItem {
  id: number;
  store_id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  cover_image: string;
  background_image: string;
  discount_type: string | null;
  discount_value: string | null;
  start_date: string | null;
  end_date: string | null;
  rating: string;
  created_at: string;
  updated_at: string;
  discounted_price: string;
}

type RelatedItem = CouponRelatedItem | ProductRelatedItem;

interface DiscountItem {
  id: number;
  user_id: number;
  discountable_id: number;
  discountable_type: "coupon" | "product";
  created_at: string;
  updated_at: string;
  related_item: RelatedItem;
}

const CountdownTimer = ({ expiryDate }: { expiryDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(expiryDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [expiryDate]);

  return (
    <div className="mt-4 flex justify-between bg-[#FFCB30] px-2 items-center w-full">
      <p className="font-semibold">Expires in</p>
      <div className="flex items-center gap-3 mt-1">
        <p className="text-sm">Ends in</p>
        <div className="flex gap-1 items-center">
          <span className="text-lg font-bold">{timeLeft.hours}</span>
          <span className="text-sm">h</span>
        </div>
        <div className="flex gap-1 items-center">
          <span className="text-lg font-bold">{timeLeft.minutes}</span>
          <span className="text-sm">m</span>
        </div>
        <div className="flex gap-1 items-center">
          <span className="text-lg font-bold">{timeLeft.seconds}</span>
          <span className="text-sm">s</span>
        </div>
      </div>
    </div>
  );
};

const MyDiscounts = () => {
  const { data: discounts } = useQuery<DiscountItem[]>({
    queryKey: ["discounts"],
    queryFn: getMyDiscounts,
  });
  const [isCopying, setIsCopying] = useState<boolean>(false);

  const copyCodeToClipboard = async (code: string) => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error("Failed to copy: ", err);
    } finally {
      setTimeout(() => {
        setIsCopying(false);
      }, 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Available Discounts</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {discounts?.map((card, index) => (
          <div key={index} className="p-4 border rounded-lg">
            {card.discountable_type === "coupon" ? (
              // Coupon Type Card
              <div className="p-4 rounded-lg">
                <h3 className="text-xl font-bold">Coupon Code</h3>
                <div className="flex justify-between items-center">
                  {" "}
                  <p className="text-lg text-primary">
                    {(card.related_item as CouponRelatedItem).promotion_code}
                  </p>
                  <button
                    className={"btn btn-primary text-white"}
                    onClick={() =>
                      copyCodeToClipboard(
                        (card.related_item as CouponRelatedItem).promotion_code
                      )
                    }
                    disabled={isCopying}
                  >
                   {isCopying ? "Copied":"Copy Code"}
                  </button>
                </div>
                <CountdownTimer
                  expiryDate={
                    (card.related_item as CouponRelatedItem).expired_at
                  }
                />
              </div>
            ) : (
              // Product Type Card
              <div className="p-4 rounded-lg">
                <h3 className="text-xl font-bold">
                  Product: {(card.related_item as ProductRelatedItem).name}
                </h3>
                <p className="text-sm">
                  {(card.related_item as ProductRelatedItem).description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <p className="text-primary font-semibold">
                      $
                      {
                        (card.related_item as ProductRelatedItem)
                          .discounted_price
                      }
                    </p>
                    <p className="text-gray-500 line-through">
                      ${(card.related_item as ProductRelatedItem).price}
                    </p>
                  </div>
                  <Link to="/categories" className="btn btn-secondary">
                    Shop Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDiscounts;
