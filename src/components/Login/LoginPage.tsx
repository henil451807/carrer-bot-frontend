import axios from "axios";
import { FirebaseError } from "firebase/app";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import logo1M1B from "../../assets/Logo/login1m1blogo.png";
import botJyoti from "../../assets/Logo/BotJyoti.jpeg";
import jobShipzLogo from "../../assets/Logo/JobShipzLogo.png";
import { googleSignIn } from "../../auth/google";
import { useAuth } from "../../auth/useAuth";
import "./LoginPage.scss";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errors, setErrors] = useState<{ google?: string }>({});
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);

    try {
      const firebaseToken = await googleSignIn();
      if (!firebaseToken) return;

      const res = await authApi.googleSignup({
        firebase_token: firebaseToken,
      });

      if (res.data?.token) {
        await login(res.data.token);
        navigate("/chat");
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error?.code === "auth/popup-closed-by-user") {
          console.log("this run");
          return;
        }

        if (error?.code === "auth/popup-blocked") {
          setErrors({ google: "Please allow popups to sign in with Google." });
          return;
        }
      }

      if (axios.isAxiosError(error)) {
        setErrors({
          google:
            error.response?.data?.message ?? "Login failed. Please try again.",
        });
        return;
      }

      console.error("Google sign-in failed", error);
      setErrors({ google: "Login failed. Please try again." });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-corner-logos">
          <img
            src={logo1M1B}
            alt="1M1B Logo"
            className="login-corner-logo login-corner-logo--left"
          />
          <img
            src={jobShipzLogo}
            alt="JobShipz Logo"
            className="login-corner-logo login-corner-logo--right"
          />
        </div>
        <div className="login-background-circle login-background-circle--1"></div>
        <div className="login-background-circle login-background-circle--2"></div>
        <div className="login-card">
          <div className="login-header-layout">
            <div className="login-image-container">
              <img
                src={botJyoti}
                alt="Career Jyoti"
                className="login-bot-img"
              />
            </div>
            <div className="login-text-content">
              <h1 className="login-title">Career Jyoti</h1>
              <p className="login-description">
                Got career questions? Career Jyoti got answers that actually
                make sense
              </p>
            </div>
          </div>

          <p className="login-signin-prompt">
            Sign in to access your AI-powered career guidance
          </p>
          <div className="login-divider"></div>

          <div className="login-actions">
            <button className="google-login-btn" onClick={handleGoogleLogin}>
              <svg className="google-icon" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>
                {!isGoogleLoading && "Sign in with google"}
                {isGoogleLoading && "Signing in..."}
              </span>
            </button>

            {errors.google && (
              <p className="login-error" role="alert">
                {errors.google}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
