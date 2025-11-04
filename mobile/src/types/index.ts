export type UserRole = 'user' | 'admin';

export interface Address {
  address_id: string;
  label: string;
  full_name: string;
  phone: string;
  city: string;
  district: string;
  street: string;
  is_default: boolean;
}

export interface User {
  _id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  roles: UserRole[];
  addresses: Address[];
  wishlist: string[];
  created_at: string;
  updated_at: string;
}

export type ProductStatus = 'active' | 'draft' | 'archived';

export interface ProductSale {
  on: boolean;
  price: number;
  starts_at: string | null;
  ends_at: string | null;
}

export interface Product {
  _id: string;
  product_id: string;
  sku: string;
  name: string;
  brand: string;
  category_id: string[];
  price: number;
  stock: number;
  status: ProductStatus;
  thumbnail: string;
  images: string[];
  description: string;
  sale: ProductSale;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  _id: string;
  category_id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  icon: string | null;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  qty: number;
  price: number;
  product?: Product;
}

export interface Cart {
  _id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  updated_at: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type DeliveryStatus = 'preparing' | 'shipping' | 'delivered';

export interface OrderItem {
  product_id: string;
  name: string;
  qty: number;
  price: number;
  thumbnail: string;
}

export interface Order {
  _id: string;
  order_id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  address: Address;
  coupon_code?: string;
  discount?: number;
  created_at: string;
}

export interface Coupon {
  _id: string;
  coupon_id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  usage_limit: number;
  usage_count: number;
  starts_at: string | null;
  ends_at: string | null;
  status: 'active' | 'inactive' | 'expired';
  created_at: string;
  updated_at: string;
}

export interface ApiListResponse<T> {
  data: T[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data: T;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
