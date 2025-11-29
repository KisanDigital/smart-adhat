export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  shopName: string;
  ownerName: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  licenseNumber?: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  shopName: string;
  adhatId: number;
}

export interface User {
  id: number;
  username: string;
  shopName: string;
  ownerName: string;
  phone: string;
  email?: string;
}

