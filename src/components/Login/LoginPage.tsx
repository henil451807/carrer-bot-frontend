import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";
import authApi from "../../api/authApi";
import { useAuth } from "../../auth/useAuth";
import axios from "axios";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
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

  return (
    <>
      <div className="login-container">
        <div className="login-background-circle login-background-circle--1"></div>
        <div className="login-background-circle login-background-circle--2"></div>

        <div className="login-card">
          <div className="login-header">
            <div className="login-header__logo">
              <div className="login-header__icon">🤖</div>
            </div>
            <h1 className="login-header__title">Career Bot</h1>
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
            <p className="login-footer__text">
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
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
