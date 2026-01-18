import { createContext } from "react";
import type { User } from "../types/user.types";

export type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  user: User | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);
