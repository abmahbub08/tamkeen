import logo from "../assets/lightLogo.svg";
import visaLogo from "../assets/visa.svg";
import paypalLogo from "../assets/paypal.svg";
import gpayLogo from "../assets/gpay.svg";
import applePayLogo from "../assets/applepay.svg";
import mastercardLogo from "../assets/mastercard.svg";
import { newsLetter } from "../services/services";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    newsLetter(email);
    setEmail("")
  };

  return (
    <div className="relative mt-40">
      <div className="absolute inset-x-0 -top-4 transform -translate-y-1/2">
        <div className="max-w-4xl mx-auto p-6 py-10 bg-primary shadow-2xl rounded-lg flex flex-wrap items-center justify-between">
          {/* Left side: Newsletter text */}
          <div className="text-lg font-bold">
            <p className="text-white">Subscribe to our newsletter</p>
          </div>

          {/* Right side: Email input form */}
          <form onSubmit={handleSubmit} className="flex flex-wrap justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-64 rounded-l-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn text-primary rounded-r-lg">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <footer className="w-full bg-[#363636] text-white py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 py-10">
            {/* Logo and Privacy */}
            <div className="col-span-full lg:col-span-2">
              <img
                src={logo}
                alt="Company Logo"
                className="mb-6 mx-auto lg:mx-0"
              />
              <p className="text-gray-400 text-sm lg:max-w-xs text-center lg:text-left">
                Your Privacy Policy warning text here.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-300">
                Navigation
              </h4>
              <ul className="space-y-2">
                {["Home", "About", "Pricing", "Features"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-300">
                Products
              </h4>
              <ul className="space-y-2">
                {[
                  "Figma UI System",
                  "Icons Assets",
                  "Responsive Blocks",
                  "Components Library",
                ].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-300">
                Resources
              </h4>
              <ul className="space-y-2">
                {["FAQs", "Quick Start", "Documentation", "User Guide"].map(
                  (item, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-white">
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Blogs */}
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-300">Blogs</h4>
              <ul className="space-y-2">
                {["News", "Tips & Tricks", "New Updates", "Events"].map(
                  (item, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-white">
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <span className="text-sm text-gray-400">
                © 2024{" "}
                <a href="https://pagedone.io/" className="hover:text-white">
                  pagedone
                </a>
                , All rights reserved.
              </span>
              <div className="flex mt-4 lg:mt-0 space-x-4">
                {[
                  visaLogo,
                  paypalLogo,
                  gpayLogo,
                  applePayLogo,
                  mastercardLogo,
                ].map((logoSrc, index) => (
                  <img
                    key={index}
                    src={logoSrc}
                    alt="Payment method"
                    className="h-4 text-gray-600"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
