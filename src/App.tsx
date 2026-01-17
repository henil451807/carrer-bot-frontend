import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.scss";
import ChatBot from "./components/ChatBot/ChatBot";
import LandingPage from "./components/LandingPage/LandingPage";
import LoginPage from "./components/Login/LoginPage";
import SignupPage from "./components/Signup/SignupPage";
import { AuthProvider } from "./auth/AuthProvider";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatBot />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
