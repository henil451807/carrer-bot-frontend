import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

  return isAuthenticated ? <Navigate to="/chat" replace /> : children;
};
