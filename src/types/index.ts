declare interface Product {
  id: number;
  store_id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  cover_image:string;
  background_image: string;
  discount_type: string;
  discount_value: string;
  start_date: string;
  end_date: string;
  rating: number;
  created_at: string;
  updated_at: string;
  discounted_price: string;
}

declare interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  gender: string;
  phone: string;
  date_of_birth: string;
}

declare interface Store {
  id: number;
  store_name: string;
  owner_id: number;
  location: string;
  type: string;
  working_hours: string;
  image: string;
  created_at: string;
  updated_at: string;
  store_email: string;
  store_phone: string;
  trn: string;
}

declare interface Coupon {
  id: number;
  name: string;
  coupon_type: string;
  promotion_code: string;
  expired_at: string;
  discount_type: string;
  percentage: string;
  status: string;
  number_of_uses: number;
  use_for: string;
  created_at: string;
  updated_at: string;
}
