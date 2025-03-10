import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useRegister";
import { FaGoogle } from "react-icons/fa6";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebaseConfig";

const VendorSignUpPage: React.FC = () => {
  const { registerVendorUser, isVendorRegisterLoading, vendorRegisterErrors } = useAuth();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [location, setLocation] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (vendorRegisterErrors.length > 0) {
      setToastMessage(vendorRegisterErrors.join(", "));
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);

      setName("");
      setPassword("");
      setCompanyName("");
      setVatNumber("");
      setLocation("");
      setCompanyEmail("");
      setCompanyPhone("");
      setFiles(null);
      setIsGoogleUser(false);
      setMarketingConsent(false);
    }
  }, [vendorRegisterErrors]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const vendorData = {
      name,
      password,
      store_name: companyName,
      trn: vatNumber,
      location,
      store_phone: companyPhone,
      store_email: companyEmail,
      marketingConsent,
      documents: files,
    };

    registerVendorUser(vendorData, {
      onSuccess: () => {
        setToastMessage("Vendor registration successful!");
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
          // navigate("/");
          window.open("https://dashboard-new.tamkeen.center", "_blank"); // 🔹 Opens in a new tab
          navigate("/");
        }, 100);
      },
    });
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      const user = response.user;

      setName(user.displayName || "");
      setCompanyEmail(user.email || "");
      setPassword(user.uid);
      setIsGoogleUser(true);

      setToastMessage("Google login successful! Complete your vendor details.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mt-36">
      <div className="bg-white sm:px-36 mx-8 sm:mx-0 px-10 py-20 border rounded-lg max-w-3xl w-full space-y-4">
        {/* Google Sign-in Button */}
        {/* <button 
          onClick={handleGoogleLogin}
          className="btn btn-outline btn-primary w-full flex items-center justify-center"
        >
          <FaGoogle size={20} className="mr-2" /> Continue with Google
        </button> */}

        <div className="divider"></div>

        {/* Vendor Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold">Join as Vendor</h2>

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
              disabled={isGoogleUser}
              required
            />
          </div>

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
              disabled={isGoogleUser}
              required
            />
          </div>

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

          <div className="form-control">
            <label className="label">
              <span className="label-text">Company Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter company name"
              className="input input-bordered"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">VAT Number</span>
            </label>
            <input
              type="text"
              placeholder="Enter VAT number"
              className="input input-bordered"
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <input
              type="text"
              placeholder="Enter your location"
              className="input input-bordered"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload Legal Files</span>
            </label>
            <input type="file" className="file-input file-input-bordered" onChange={handleFileUpload} multiple required />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {isVendorRegisterLoading ? "Registering..." : "Join as Vendor"}
          </button>
        </form>

        <div className="w-full flex justify-center">
          <Link to="/login" className="link link-primary my-4">
            Already have an account? Log in
          </Link>
        </div>
      </div>

      {/* Loading Modal */}
      {isVendorRegisterLoading && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-center items-center">
              <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
            <p className="text-center mt-4 text-lg">Creating your vendor account...</p>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {showToast && <div className="toast toast-bottom toast-center"><div className="alert bg-primary text-white">{toastMessage}</div></div>}
      {showErrorToast && <div className="toast toast-bottom toast-center"><div className="alert alert-error text-white">{toastMessage}</div></div>}
    </div>
  );
};

export default VendorSignUpPage;
