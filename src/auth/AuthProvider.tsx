import { useEffect, useState } from "react";
// import api from "../api/axios";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = () => {
      const token = localStorage.getItem("authToken");
      setLoading(false);

      if (!token) {
        return;
      }
      setIsAuthenticated(true);

      //   try {
      //     await api.get("/me");
      //     setIsAuthenticated(true);
      //   } catch {
      //     localStorage.removeItem("authToken");
      //     setIsAuthenticated(false);
      //   } finally {
      //     setLoading(false);
      //   }
    };

    verifyToken();
  }, []);

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
