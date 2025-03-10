import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { register, login, RegisterData, LoginData } from "../services/services";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { authAtom } from "../atoms/authAtom";
import Cookies from "js-cookie";

type AuthResponse = { token: string; user: any }; // Replace `any` with actual user type

export const useAuth = () => {
  const [registerErrors, setRegisterErrors] = useState<string[]>([]);
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

  const { mutate: registerUser, isPending: isRegisterLoading } = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const registrationResponse = await register(userData); // Expected RegisterResponse type
      return registrationResponse;
    },
    onSuccess: (data: AuthResponse) => {
      const { token, user } = data;

      // Store token and user in cookies for 7 days
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });

      setAuth({ user, isAuthenticated: true });
      navigate("/");
    },
    onError: (error: any) => {
      const errors = parseErrorMessage(error);
      setRegisterErrors(errors);
    },
  });

  const { mutate: loginUser, isPending: isLoginLoading } = useMutation({
    mutationFn: (credentials: LoginData) => login(credentials),
    onSuccess: (data: AuthResponse) => {
      const { token, user } = data;

      // Store token and user in cookies for 7 days
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
      console.log(token);

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
    loginUser,
    isRegisterLoading,
    isLoginLoading,
    registerErrors,
    loginErrors,
  };
};

const parseErrorMessage = (error: any): string[] => {
  if (error.response?.data) {
    const errorData = error.response.data;

    // If errorData is an array or object, gather the error messages
    return Object.values(errorData).flatMap(value => 
      Array.isArray(value) ? value : [value]
    ).filter(Boolean); // Filters out any undefined or false values
  }
  
  // Fallback for any other errors
  return [error.message || "An unknown error occurred."];
};

