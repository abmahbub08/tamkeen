import { FaCopy } from "react-icons/fa6";

export const ReferralWidget = () => {
  return (
    <div className="lg:w-1/3 w-full  p-6 rounded-lg border h-fit bg-blue-50 border-gray-200 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">GIVE $20, GET $20</h2>
      <p>
        Get your referral link to give your friends a $20 off discount when they
        shop at Tamkeen. If they use it, we’ll reward you with $20 too!
      </p>

      <p className="font-semibold">Or copy your personal link</p>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value="voucherify.io"
          className="input bg-white input-disabled input-bordered w-full"
        />
        <button className="btn btn-primary text-white">
          <FaCopy className="mr-1" /> Copy
        </button>
      </div>

      <p className="mt-4">Or use:</p>

      {/* Social Media Icons (Placeholders) */}
      <div className="flex space-x-4">
        <a href="#" className="text-primary underline">
          Facebook
        </a>
        <a href="#" className="text-primary underline">
          Twitter
        </a>
        <a href="#" className="text-primary underline">
          Instagram
        </a>
      </div>

      <p className="mt-4 text-sm">
        <a href="#" className="text-primary underline">
          Terms & Conditions
        </a>
      </p>
    </div>
  );
};
