import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "../auth/useAuth";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
