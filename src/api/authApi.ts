import type {
  GoogleSignupResponse,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth.types";
import type { User } from "../types/user.types";
import axiosWrapper from "./axios";

class AuthApi {
  async userLogin(payload: { email: string; password: string }): Promise<{
    error: boolean;
    message: string;
    status: number;
    data?: LoginResponse;
  }> {
    const response = await axiosWrapper.post(`/auth/login`, payload, {
      skipAuthRedirect: true,
    });
    return response.data;
  }

  async userRegistration(payload: RegisterRequest): Promise<{
    error: boolean;
    message: string;
    status: number;
    data?: RegisterResponse;
  }> {
    const response = await axiosWrapper.post(`/auth/register`, payload, {
      skipAuthRedirect: true,
    });
    return response.data;
  }

  async getUser(): Promise<{
    error: boolean;
    message: string;
    status: number;
    data?: User;
  }> {
    const response = await axiosWrapper.get(`/user/profile`);
    return response.data;
  }

  async googleSignup(payload: { firebase_token: string }): Promise<{
    error: boolean;
    message: string;
    status: number;
    data?: GoogleSignupResponse;
  }> {
    const response = await axiosWrapper.post(`/auth/google/signup`, payload, {
      skipAuthRedirect: true,
    });
    return response.data;
  }
}

const authApi = new AuthApi();
export default authApi;
