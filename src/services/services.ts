import apiClient from "./api-client";
import Cookies from "js-cookie";

export interface RegisterData {
  email: string;
  phone: string;
  name: string;
  password: string;
  password_confirmation?: string;
  date_of_birth: string;
}

export interface Response {
  user: RegisterData;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = async (userData: RegisterData): Promise<Response> => {
  const { data } = await apiClient.post<Response>("/register", userData);
  return data;
};

export const login = async (credentials: LoginData): Promise<Response> => {
  const { data } = await apiClient.post<Response>("/login", credentials);
  return data;
};

export const fetchCategories = async () => {
  const { data } = await apiClient.get("/categories");
  return data;
};


// export const fetchProducts = async (filters: Record<string, any>) => {
//   const queryParams = new URLSearchParams(filters).toString();
//   const { data } = await apiClient.get(`/show-products?${queryParams}`);
//   return data;
// };

export const fetchProducts = async () => {
  const token = Cookies.get("token");

  const { data } = await apiClient.get('/products', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const fetchProduct = async (id: string | undefined) => {
  const token = Cookies.get("token");

  const { data } = await apiClient.get(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.product;
};

export const getBestSelling = async () => {
  const { data } = await apiClient.get("/best-selling-products");
  return data;
};

export const getFlashSales = async () => {
  const { data } = await apiClient.get("/flash-sales");
  return data;
};

export const fetchTestimonials = async () => {
  const { data } = await apiClient.get("/happyCustomers");
  return data;
};



export const fetchStores = async () => {
  const { data } = await apiClient.get(`/stores`);
  return data.stores;
};



export const fetchStoreProduct = async (id: string | undefined) => {
  const { data } = await apiClient.get(`/stores/${id}/products`);
  return data.products;
};

export const getPackages = async () => {
  const { data } = await apiClient.get(`/packages`);
  return data;
};

export const getOrder = async (id: string | undefined) => {
  const token = Cookies.get("token");
  const { data } = await apiClient.get(`/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.order;
};

export const getStore = async (id: string | undefined) => {
  const { data } = await apiClient.get(`/stores/${id}`);
  return data.store;
};

export const getLastProducts = async () => {
  const { data } = await apiClient.get("/last-products");
  return data;
};

export const addToCart = async (
  store_id: number | undefined,
  id: number | undefined,
  quantity: number | undefined,
  product_variant_id: number | undefined
) => {
  const token = Cookies.get("token");
  const cartItem = {
    store_id: store_id,
    product_variant_id: product_variant_id,
    product_id: id,
    quantity: quantity,
  };

  const { data } = await apiClient.post(
    "/cart/add",
    { cart: [{ ...cartItem }] },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
        "Content-Type": "application/json",
      },
    }
  );

  return data.message;
};

export const addToWishList = async (product_id: number | undefined) => {
  const token = Cookies.get("token");

  apiClient.post(
    "/wishlists/add",
    { product_id: product_id },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
        "Content-Type": "application/json",
      },
    }
  );
};

export const RemoveFromWishList = async (product_id: number | undefined) => {
  const token = Cookies.get("token");

  const { data } = await apiClient.delete("/wishlists/remove", {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the headers
      "Content-Type": "application/json",
    },
    data: { product_id: product_id },
  });

  return data.message;
};

export const viewCart = async () => {
  const token = Cookies.get("token");
  const { data } = await apiClient.get(`/view-cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.cart;
};

export const accountOrders = async (filter: string) => {
  const token = Cookies.get("token");
  const { data } = await apiClient.get(
    `/user-orders${filter && "?order_status=" + filter}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data.Orders;
};

export const getInvoice = async (filter: string) => {
  const token = Cookies.get("token");
  const { data } = await apiClient.get(
    `/user-orders${filter && "?order_status=" + filter}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data.Orders;
};

export const checkout = async (store_id: number, coupon_code: string) => {
  const token = Cookies.get("token");

  const { data } = await apiClient.post(
    "/cart/checkout",
    { store_id: store_id, coupon_code: coupon_code },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};

export const fetchPricing = async () => {
  const { data } = await apiClient.get(`/membership-levels`);
  return data;
};

export const fetchCoupons = async () => {
  const { data } = await apiClient.get("/coupons");
  return data.coupons;
};

export const addToMyCoupons = async (
  type: string | undefined,
  id: number | undefined
) => {
  const token = Cookies.get("token");

  const response = await apiClient.post(
    "/add-to-my-discount",
    { type: type, id: id },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.message;
};

export const newsLetter = async (email: string) => {
  const response = await apiClient.post("/newsletters", {
    email: email,
    content: "Subscription To News Letter",
  });

  return response.data;
};

export const getMyDiscounts = async () => {
  const token = Cookies.get("token");
  const { data } = await apiClient.get("/my-discount", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.my_discount_items;
};

export const getWishes = async () => {
  const token = Cookies.get("token");
  const { data } = await apiClient.get("/wishlists", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.wishes;
};

export const fetchProfile = async () => {
  const token = Cookies.get("token");
  const { data } = await apiClient.get("/show-profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.my_profile;
};

export const updateProfile = async (
  name: string,
  phone: string,
  email: string,
  date_of_birth?: string,
  gender?: string
  // currentPassword?: string,
  // newPassword?: string,
  // confirmNewPassword?: string
) => {
  const token = Cookies.get("token");

  const { data } = await apiClient.put(
    "/update-profile",
    {
      name: name,
      gender: gender,
      phone: phone,
      email: email,
      date_of_birth: date_of_birth,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};

export const addRating = async (
  rating: number,
  review: string,
  product_id: string
) => {
  const token = Cookies.get("token");

  const { data } = await apiClient.post(
    `/products/${product_id}/rate`,
    { rating: rating, review: review },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.message;
};
