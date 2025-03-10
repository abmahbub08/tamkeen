import React, { useState } from "react";
import { Link } from "react-router-dom";

const VendorSignUpPage: React.FC = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [location, setLocation] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      name,
      password,
      companyName,
      vatNumber,
      location,
      companyEmail,
      companyPhone,
      files,
      marketingConsent,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen mt-36">
      <form
        onSubmit={handleSubmit}
        className="bg-white sm:px-36 mx-8 sm:mx-0 px-10 py-20 border rounded-lg max-w-3xl w-full space-y-4"
      >
        <h2 className="text-2xl font-bold">Join as Vendor</h2>

        {/* Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="input input-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="input input-bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Company Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Company or Store Name</span>
          </label>
          <input
            type="text"
            placeholder="Enter your company name or store name"
            className="input input-bordered"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        {/* VAT Register Number */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">VAT Register Number</span>
          </label>
          <input
            type="text"
            placeholder="Enter the VAT number"
            className="input input-bordered"
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value)}
            required
          />
        </div>

        {/* Location */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <input
            type="text"
            placeholder="Enter your company location"
            className="input input-bordered"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* Company Email */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Company Email</span>
          </label>
          <input
            type="email"
            placeholder="Enter the company email"
            className="input input-bordered"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
            required
          />
        </div>

        {/* Company Phone */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Company Phone</span>
          </label>
          <input
            type="tel"
            placeholder="Enter the company phone number"
            className="input input-bordered"
            value={companyPhone}
            onChange={(e) => setCompanyPhone(e.target.value)}
            required
          />
        </div>

        {/* Upload Legal Files */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Upload legal files</span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
            onChange={handleFileUpload}
            multiple
            required
          />
          <span className="text-sm">
            Upload your company paper, trade license, and identity documents.
          </span>
        </div>

        {/* Marketing Consent */}
        <div className="form-control">
          <label className="cursor-pointer label">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={marketingConsent}
              onChange={() => setMarketingConsent(!marketingConsent)}
            />
            <span className="label-text pl-2">
              Share my registration data with our content providers for marketing
              purposes.
            </span>
          </label>
        </div>

        {/* Terms of Use */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              By creating an account, you agree to the{" "}
              <a href="#" className="link link-primary">
                Terms of use
              </a>{" "}
              and{" "}
              <a href="#" className="link link-primary">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

        {/* I'm not a robot */}
        <div className="form-control">
          <label className="cursor-pointer label">
            <input type="checkbox" className="checkbox checkbox-primary" required />
            <span className="label-text">I’m not a robot</span>
          </label>
        </div>

        {/* Sign up Button */}
        <button type="submit" className="btn text-white btn-primary w-full">
          Sign up
        </button>

        <div className="w-full flex justify-center">
          <Link to="/login" className="link link-primary my-4">
            Already have an account? Log in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default VendorSignUpPage;
