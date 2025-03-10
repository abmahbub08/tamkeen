import { signInWithPopup } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { auth, googleProvider } from "../../firebaseConfig";
import { FaGoogle } from "react-icons/fa6";
import { useAuth } from "../hooks/useRegister";

const SignUpPage: React.FC = () => {
  const { registerUser, isRegisterLoading, registerErrors } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [date_of_birth, setDate_of_birth] = useState({
    month: "",
    date: "",
    year: "",
  });
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false); // To disable fields if logged in with Google
  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setErrorShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (registerErrors.length > 0) {
      setToastMessage(registerErrors.join(", ")); // Join errors into a single message
      setErrorShowToast(true); // Show the toast
      setTimeout(() => setErrorShowToast(false), 3000); // Hide after 3 seconds

      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setGender("");
      setDate_of_birth({ month: "", date: "", year: "" });
      setIsGoogleUser(false);
      setMarketingConsent(false);
    }
  }, [registerErrors]);

  const formattedDateOfBirth = `${date_of_birth.year}-${String(
    months.indexOf(date_of_birth.month) + 1
  ).padStart(2, "0")}-${String(date_of_birth.date).padStart(2, "0")}`;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      password,
      phone,
      password_confirmation: password,
      gender: gender.toLowerCase(),
      date_of_birth: formattedDateOfBirth,
      marketingConsent,
      referring_token: token,
    };

    // Call the registerUser function from the useAuth hook
    registerUser(userData);
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      const user = response.user;

      // Populate name and email from Google account
      setName(user.displayName || "");
      setEmail(user.email || "");
      setPassword(user.uid);
      setIsGoogleUser(true); // Set the flag to true to disable inputs
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      console.log("Google login successful:", user);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="flex items-center mt-36 justify-center min-h-screen">
      <div className="bg-white sm:px-36 mx-8 sm:mx-0 px-10 py-20 border rounded-lg max-w-3xl w-full space-y-4">
        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline btn-primary w-full flex items-center justify-center"
        >
          <FaGoogle size={20} className="mr-2" /> Continue with Google
        </button>
        <div className="divider"></div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold">Create an account</h2>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Profile Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your profile name"
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isGoogleUser} // Disable if logged in with Google
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isGoogleUser} // Disable if logged in with Google
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Phone Number</span>{" "}
              {/* Added Phone Label */}
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="input input-bordered"
              value={phone} // Bind phone state
              onChange={(e) => setPhone(e.target.value)} // Update phone state
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
              disabled={isGoogleUser}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">What’s your gender? (optional)</span>
            </label>
            <div className="flex gap-8">
              <label className="cursor-pointer flex items-center">
                <input
                  type="radio"
                  name="gender"
                  className="radio radio-primary"
                  value="Female"
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="label-text pl-2">Female</span>
              </label>
              <label className="cursor-pointer flex items-center">
                <input
                  type="radio"
                  name="gender"
                  className="radio radio-primary"
                  value="Male"
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="label-text pl-2">Male</span>
              </label>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">What’s your date of birth?</span>
            </label>
            <div className="flex space-x-2">
              <select
                className="select select-bordered"
                value={date_of_birth.month}
                onChange={(e) =>
                  setDate_of_birth({ ...date_of_birth, month: e.target.value })
                }
                required
              >
                <option disabled value="">
                  Month
                </option>
                {months.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="select select-bordered"
                value={date_of_birth.date}
                onChange={(e) =>
                  setDate_of_birth({ ...date_of_birth, date: e.target.value })
                }
                required
              >
                <option disabled value="">
                  Date
                </option>
                {[...Array(31)].map((_, i) => (
                  <option key={i}>{i + 1}</option>
                ))}
              </select>
              <select
                className="select select-bordered"
                value={date_of_birth.year}
                onChange={(e) =>
                  setDate_of_birth({ ...date_of_birth, year: e.target.value })
                }
                required
              >
                <option disabled value="">
                  Year
                </option>
                {[...Array(100)].map((_, i) => (
                  <option key={i}>{new Date().getFullYear() - i}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="cursor-pointer label">
              <input
                type="checkbox"
                className="checkbox mr-4 checkbox-primary"
                checked={marketingConsent}
                onChange={() => setMarketingConsent(!marketingConsent)}
              />{" "}
              <span className="label-text">
                Share my registration data with our content providers for
                marketing purposes.
              </span>
            </label>
          </div>

          <div className="form-control">
            <span className="label-text">
              By creating an account, you agree to the
              <a href="#" className="link mx-1 link-primary">
                Terms of use
              </a>
              and
              <a href="#" className="link mx-1 link-primary">
                Privacy Policy
              </a>
              .
            </span>
          </div>

          <button type="submit" className="btn text-white btn-primary w-full">
            Sign up
          </button>
          <Link
            to="/vendor-signup"
            className="btn btn-primary text-white w-full"
          >
            Join as vendor
          </Link>
          <div className="w-full flex justify-center">
            <Link
              to="/login"
              className="link link-primary my-4 justify-self-center "
            >
              Already have an account? Log in
            </Link>
          </div>
        </form>
      </div>

      {isRegisterLoading && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-center items-center">
              <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
            <p className="text-center mt-4 text-lg">Creating you account</p>
          </div>
        </div>
      )}

      {showToast && (
        <div className="toast toast-bottom toast-center min-w-80 z-50">
          <div className="alert bg-primary text-white">
            <div>
              <span>Continue the registration!</span>
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

      {showErrorToast && (
        <div className="toast toast-bottom toast-center z-50">
          <div className="alert alert-error text-white">
            <div>
              <span>{toastMessage}</span>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setErrorShowToast(false)}
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
  );
};

export default SignUpPage;
