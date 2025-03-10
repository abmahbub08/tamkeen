import { signInWithPopup } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, googleProvider } from "../../firebaseConfig.ts";
import { FaGoogle } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useRegister.tsx";

const LoginPage: React.FC = () => {
  const { loginUser, isLoginLoading, loginErrors } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showErrorToast, setErrorShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginUser({ email, password });
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      const user = response.user;

      loginUser({ email: user.email || "", password: user.uid });
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  useEffect(() => {
    if (loginErrors.length > 0) {
      setToastMessage(loginErrors.join(", "));
      setErrorShowToast(true); // Show the toast
      setTimeout(() => setErrorShowToast(false), 3000); // Hide after 3 seconds
    }
  }, [loginErrors]);

  return (
    <div className="flex items-center justify-center min-h-screen mt-36">
      <div className="bg-white sm:px-36 mx-8 sm:mx-0 px-10 py-20 border rounded-lg max-w-3xl w-full gap-4 space-y-4">
        <h2 className="text-2xl font-bold">Log in</h2>
        <div className="flex  items-center">
          <span>Don’t have an account?</span>
          <Link to="/signup" className="link link-primary">
            Sign up
          </Link>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline btn-primary w-full flex items-center justify-center"
          >
            <FaGoogle size={20} className="mr-2" /> Continue with Google
          </button>
          {/* <button className="btn btn-outline btn-primary w-full flex items-center justify-center">
            <FaFacebook size={20} className="mr-2" /> Continue with Facebook
          </button> */}
          {/* <button className="btn btn-outline btn-primary w-full flex items-center justify-center">
            <FaApple size={20} className="mr-2" /> Continue with Apple
          </button> */}
        </div>

        <div className="divider">Or continue with email</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email address or Username</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <Link to="/auth" className="link place-self-end  w-fit link-primary">
              Forgot your password?
            </Link>
          </div>

          <div className="flex justify-between items-center">
            <label className="cursor-pointer flex items-center">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="pl-2">Remember me</span>
            </label>
          </div>

          <button type="submit" className="btn text-white btn-primary w-full">
            Log in
          </button>
        </form>
      </div>

      {isLoginLoading && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-center items-center">
              <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
            <p className="text-center mt-4 text-lg">
              Signing into your you account
            </p>
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

export default LoginPage;
