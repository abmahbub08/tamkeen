import { ReferralWidget } from "../components/ReferralWidget";

const Invoice = () => {
  return (
    <div className="flex mt-20 flex-col lg:flex-row justify-between p-6 space-y-6 lg:space-y-0 lg:space-x-8">
      {/* Left Section: Order Information */}
      <div className="lg:w-2/3 w-full p-6 rounded-lg border border-gray-200 space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Thanks for your order!</h2>
        <p>
          We are preparing your order and will notify you as soon as it has
          shipped.
        </p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Order information</h3>
          <p className="mb-2">
            <span className="font-semibold">Your order number:</span> 13650
          </p>
          <p className="mb-2">
            <span className="font-semibold">You paid:</span> $93.87
          </p>
          <p>
            <span className="font-semibold">
              We will send the confirmation to:
            </span>{" "}
            mary@voucherify.io
          </p>
        </div>
        <div className="divider"></div>
        {/* Flex Box for Shipping Details and Method */}
        <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 md:space-x-8">
          {/* Shipping Address */}
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold mb-2">Shipping address</h3>
            <p>Mary Doe</p>
            <p>300 Twin Ln S</p>
            <p>Wantagh</p>
            <p>New York (NY), 11793</p>
          </div>

          {/* Shipping Method */}
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold mb-2">Shipping method</h3>
            <p>Free Shipping</p>
            <p>Between 20.04.2022 - 28.04.2022</p>
            <div className="mt-4">
              <a href="#" className="text-primary underline mr-4">
                Track my order
              </a>
            </div>
          </div>
        </div>{" "}
        <div className="divider"></div>
        {/* Email Input */}
        <div className="mt-4">
          <a href="#" className="text-lg font-semibold mb-2">
            Sign up for offers and more
          </a>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email here"
              className="input input-bordered w-full"
            />
            <button className="btn btn-primary text-white">send</button>
          </div>
        </div>
      </div>

      {/* Right Section: Referral */}
      <ReferralWidget />
    </div>
  );
};

export default Invoice;
