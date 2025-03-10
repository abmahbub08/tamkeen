import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "https://api.tamkeen.center/api", // Replace with your base URL
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response, // If the response is successful, just return it
  (error) => {
    // Check if the error response status is 401
    if (error.response.status === 401) {
      Cookies.remove("token");
      Cookies.remove("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
