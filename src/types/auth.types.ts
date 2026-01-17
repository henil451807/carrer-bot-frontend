import type { User } from "./user.types";

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  password: string;
}

export interface RegisterResponse {
  created_at: string;
  email: string;
  firstName: string;
  id: string;
  is_active: boolean;
  lastName: string;
  mobileNo: string;
  token: string;
}
