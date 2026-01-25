import axios from "axios";
import { FirebaseError } from "firebase/app";
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import logo from "../../assets/Logo/1M1BLogo.png";
import jobShipzLogo from "../../assets/Logo/JobShipzLogo.png";
import { googleSignIn } from "../../auth/google";
import { useAuth } from "../../auth/useAuth";
import "./LoginPage.scss";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
  google?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = () => {
    validateForm();
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    try {
      const res = await authApi.userLogin({
        email: formData.email,
        password: formData.password,
      });
      if (res.data?.token) {
        await login(res.data?.token);
        navigate("/chat");
      }
    } catch (error: unknown) {
      console.log("axios.isAxiosError(error)", axios.isAxiosError(error));
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        setErrors({ general: message ?? "Invalid credentials" });
        return;
      }
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="login-background-circle login-background-circle--1"></div>
        <div className="login-background-circle login-background-circle--2"></div>
        <div className="login-card">
          <div className="login-header">
            <div className="login-header__title-row">
              <img
                src={logo}
                alt="1M1B Logo"
                className="login-header__logo-img"
              />
              <h1 className="login-header__title">Career Bot</h1>
              <img
                src={jobShipzLogo}
                alt="JobShipz Logo"
                className="login-header__logo-img"
              />
            </div>
            <p className="login-header__subtitle">
              Sign in to access your AI-powered career guidance
            </p>
          </div>
          <form onSubmit={handleSubmit} noValidate className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-group__label">
                Email Address
              </label>
              <div className="form-group__input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-group__input ${
                    errors.email ? "form-group__input--error" : ""
                  }`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="form-group__error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-group__label">
                Password
              </label>
              <div className="form-group__input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`form-group__input form-group__input--password ${
                    errors.password ? "form-group__input--error" : ""
                  }`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  className="form-group__toggle-password"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="form-group__error"
                  role="alert"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {errors.general && (
              <div className="form-group">
                <p className="form-group__error" role="alert">
                  {errors.general}
                </p>
              </div>
            )}

            <div className="login-actions">
              <button
                type="submit"
                className={`btn btn--primary ${
                  isLoading ? "btn--loading" : ""
                }`}
                disabled={isLoading}
              >
                {!isLoading && "Sign In"}
                {isLoading && "Signing In..."}
              </button>
            </div>
          </form>

          <div className="login-footer">
            {/* <p className="login-footer__text">
              Don't have an account?{" "}
              <a
                href="#signup"
                className="login-footer__link"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  //   alert("Sign up functionality - Add your route here");
                  navigate("/signup");
                }}
              >
                Sign up
              </a>
            </p> */}
            <button className="google-btn" onClick={handleGoogleLogin}>
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
                {!isGoogleLoading && "Sign in with Google"}
                {isGoogleLoading && "Signing In with Google..."}
              </span>
            </button>

            {errors.google && (
              <div className="form-group">
                <p className="form-group__error" role="alert">
                  {errors.google}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
