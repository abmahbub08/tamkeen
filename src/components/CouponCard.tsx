import { IoMdBookmark } from "react-icons/io";

interface CouponCardProps {
  coupon: Coupon;
  onSave: (type: string, id: number) => void;
}

const CouponCard = ({ coupon, onSave }: CouponCardProps) => {
  const handleSaveClick = () => {
    onSave("coupon", coupon.id);
  };

  return (
    <div className="relative w-96 border border-primary p-6 rounded-2xl shadow-md overflow-hidden transform transition-transform hover:shadow-lg">
      {/* Decorative Background Circle */}
      <div className="absolute top-0 -z-10 -right-10 h-32 w-32 bg-blue-200 opacity-30 rounded-full"></div>

      <div className="flex justify-between items-center mb-3">
        <h3 className="text-2xl font-bold text-secondary">{coupon.name}</h3>
        <button
          className="p-2 btn btn-circle btn-primary btn-outline hover:text-white rounded-full text-white focus:outline-none transition-colors shadow-lg"
          onClick={handleSaveClick}
          aria-label="Save Coupon"
        >
          <IoMdBookmark size={25} />
        </button>
      </div>

      <p className="text-lg font-medium text-primary">
        Use code: <span className="font-bold">{coupon.promotion_code}</span>
      </p>
      <p className="text-sm text-gray-600 mb-1">
        Expires on: {new Date(coupon.expired_at).toLocaleDateString()}
      </p>
      <p className="text-lg font-semibold text-primary">
        {coupon.discount_type === "percentage"
          ? `${coupon.percentage}% off`
          : ""}
      </p>
    </div>
  );
};

export default CouponCard;
