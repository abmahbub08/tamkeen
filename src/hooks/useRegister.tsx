import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { register, login, RegisterData, LoginData, registerVendor, VendorRegisterData } from "../services/services";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { authAtom } from "../atoms/authAtom";
import Cookies from "js-cookie";
import { saveUserData } from "../pages/chat/utility";

type AuthResponse = { token: string; user: any }; // Replace `any` with actual user type

export const useAuth = () => {
  const [registerErrors, setRegisterErrors] = useState<string[]>([]);
  const [vendorRegisterErrors, setVendorRegisterErrors] = useState<string[]>([]);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const [, setAuth] = useAtom(authAtom);

  useEffect(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("user");

    if (token && user) {
      setAuth({ user: JSON.parse(user), isAuthenticated: true });
    }
  }, [setAuth]);

  // Normal User Registration
  const { mutate: registerUser, isPending: isRegisterLoading } = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const registrationResponse = await register(userData);
      return registrationResponse;
    },
    onSuccess: (data: AuthResponse) => {
      const { token, user } = data;

      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
      Cookies.set("type", user.role, { expires: 7 });

      saveUserData(user.id, user.name, user.email, user.referral_code);
      setAuth({ user, isAuthenticated: true });
      navigate("/");
    },
    onError: (error: any) => {
      const errors = parseErrorMessage(error);
      setRegisterErrors(errors);
    },
  });

  // Vendor Registration
  const { mutate: registerVendorUser, isPending: isVendorRegisterLoading } = useMutation({
    mutationFn: async (vendorData: VendorRegisterData) => {
      const vendorRegistrationResponse = await registerVendor(vendorData);
      return vendorRegistrationResponse;
    },
    onSuccess: (data: AuthResponse) => {
      const { token, user } = data;

      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
      Cookies.set("type", user.role, { expires: 7 });


      saveUserData(user.id, user.name, user.email, user.referral_code);
      setAuth({ user, isAuthenticated: true });

    },
    onError: (error: any) => {
      const errors = parseErrorMessage(error);
      setVendorRegisterErrors(errors);
    },
  });

  // User Login
  const { mutate: loginUser, isPending: isLoginLoading } = useMutation({
    mutationFn: (credentials: LoginData) => login(credentials),
    onSuccess: (data: AuthResponse) => {
      const { token, user } = data;

      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
      Cookies.set("type", user.role, { expires: 7 });

      saveUserData(user.id, user.name, user.email, user.referral_code);
      setAuth({ user, isAuthenticated: true });
      navigate("/");
    },
    onError: (error: any) => {
      const errors = parseErrorMessage(error);
      setLoginErrors(errors);
    },
  });

  return {
    registerUser,
    registerVendorUser,
    loginUser,
    isRegisterLoading,
    isVendorRegisterLoading,
    isLoginLoading,
    registerErrors,
    vendorRegisterErrors,
    loginErrors,
  };
};

const parseErrorMessage = (error: any): string[] => {
  if (error.response?.data) {
    const errorData = error.response.data;

    return Object.values(errorData).flatMap(value => 
      Array.isArray(value) ? value : [value]
    ).filter(Boolean);
  }

  return [error.message || "An unknown error occurred."];
};
