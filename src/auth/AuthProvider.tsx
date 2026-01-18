import { useEffect, useState } from "react";
// import api from "../api/axios";
import { AuthContext } from "./AuthContext";
import authApi from "../api/authApi";
import type { User } from "../types/user.types";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await fetchUser();
      } catch {
        // Error already handled in fetchUser
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authApi.getUser();
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const login = async (token: string) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    try {
      await fetchUser();
    } catch (error) {
      // If fetching user fails after login, revert authentication
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, login, logout, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
