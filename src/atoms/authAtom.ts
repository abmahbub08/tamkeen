import { atom } from "jotai";
import Cookies from "js-cookie"; // Import js-cookie
import { RegisterData } from "../services/services";

interface AuthState {
  user: RegisterData | null; // User can be null when not authenticated
  isAuthenticated: boolean;
}

// Retrieve user and token from cookies (if they exist)
const userFromCookies = Cookies.get("user") ? JSON.parse(Cookies.get("user") || '{}') : null;
const tokenFromCookies = Cookies.get("token");

// Initialize the authAtom with values from cookies if available
export const authAtom = atom<AuthState>({
  user: userFromCookies, // Set user from cookies or null
  isAuthenticated: !!tokenFromCookies, // Set isAuthenticated based on the token
});
