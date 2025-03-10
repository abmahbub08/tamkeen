import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-lg p-8">
        {/* Left Small Card */}
        <div className="card p-6 rounded-lg shadow-md justify-around w-full lg:w-1/3">
          <div className="flex flex-col">
            {/* Top: Call to us */}
            <div className=" mb-4">
              <div className="flex mb-4">
                {" "}
                <FaPhoneAlt className="text-primary text-2xl mr-4" />
                <h2 className="text-lg font-semibold">Call to Us</h2>
              </div>{" "}
              <p className="text-gray-600">+123 456 7890</p>
            </div>
            <div className="divider divide-neutral"></div>
            {/* Bottom: Write to us */}
            <div className="flex flex-col gap-6 ">
              <div className="flex items-center">
                <FaEnvelope className="text-primary text-2xl mr-4" />
                <h2 className="text-lg font-semibold">Write to Us</h2>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-gray-600">support@example.com</p>
                <p className="text-gray-600">info@example.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="card flex flex-col w-full lg:w-2/3 shadow-md p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Name Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full"
              />
            </div>
            {/* Email Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Your Email
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className="input input-bordered w-full"
              />
            </div>
            {/* Phone Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                placeholder="(123) 456-7890"
                className="input input-bordered w-full"
              />
            </div>
            {/* Message Field */}
            <div className="col-span-1 lg:col-span-3">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={4}
                placeholder="Your message here..."
              ></textarea>
            </div>
          </div>
          {/* Send Message Button */}
          <div className="flex justify-end mt-4">
            <button className="btn btn-primary text-white">Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
