import React, {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import { useAuth } from "../../auth/useAuth";
import type { RegisterRequest } from "../../types/auth.types";
import "./SignupPage.scss";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNo?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

type SignupStep = "details" | "otp" | "success";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState<SignupStep>("details");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // OTP State
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [otpError, setOtpError] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const togglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword((prev) => !prev);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (!/^[A-Za-z]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = "First name must contain only letters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (!/^[A-Za-z]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = "Last name must contain only letters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must include uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.mobileNo) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!/^\+[1-9]\d{7,14}$/.test(formData.mobileNo)) {
      newErrors.mobileNo =
        "Please enter a valid mobile number with country code";
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
      const payload: RegisterRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobileNo: formData.mobileNo,
        password: formData.password,
      };

      const res = await authApi.userRegistration(payload);

      if (res.data) {
        await login(res.data.token);
      }

      // Move to OTP step
      setCurrentStep("otp");
      startResendTimer();

      // Focus first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      console.error("Signup failed:", error);
      setErrors({ general: "Signup failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string): void => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);
    setOtpError("");

    // Auto-focus next input
    if (value && index < otp.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ): void => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, otp.length);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < otp.length) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus last filled input or last input
    const lastFilledIndex = Math.min(pastedData.length, otp.length - 1);
    otpInputRefs.current[lastFilledIndex]?.focus();
  };

  const handleVerifyOtp = async (): Promise<void> => {
    const otpValue = otp.join("");

    if (otpValue.length !== otp.length) {
      setOtpError("Please enter complete OTP");
      return;
    }

    navigate("/chat");

    //to be implemented

    // setIsLoading(true);
    // setOtpError("");

    // try {
    //   // Simulate API call to verify OTP
    //   await new Promise((resolve) => setTimeout(resolve, 2000));

    //   // For demo: accept any 6-digit OTP, in real app verify with backend
    //   console.log("OTP verified:", otpValue);
    //   console.log("User data:", {
    //     firstName: formData.firstName,
    //     lastName: formData.lastName,
    //     email: formData.email,
    //   });

    //   // Success! Redirect or show success
    //   alert("Account verified successfully! Redirecting to dashboard...");

    //   // In real app, you would:
    //   // 1. Store auth token
    //   // 2. Redirect to dashboard
    //   // window.location.href = '/dashboard';

    //   setCurrentStep("success");
    // } catch (error) {
    //   console.error("OTP verification failed:", error);
    //   setOtpError("Invalid OTP. Please try again.");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const startResendTimer = (): void => {
    setCanResend(false);
    setResendTimer(60);

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async (): Promise<void> => {
    if (!canResend) return;

    //to be implemented
    // setIsLoading(true);
    // setOtpError("");

    // try {
    //   // Simulate API call to resend OTP
    //   await new Promise((resolve) => setTimeout(resolve, 1500));

    //   console.log("OTP resent to:", formData.email);
    //   alert("New OTP sent to your email!");

    //   // Reset OTP inputs
    //   setOtp(new Array(6).fill(""));
    //   otpInputRefs.current[0]?.focus();

    //   startResendTimer();
    // } catch (error) {
    //   console.error("Resend OTP failed:", error);
    //   setOtpError("Failed to resend OTP. Please try again.");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleEditEmail = (): void => {
    setCurrentStep("details");
    setOtp(new Array(6).fill(""));
    setOtpError("");
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-background-circle signup-background-circle--1"></div>
        <div className="signup-background-circle signup-background-circle--2"></div>

        <div className="signup-card">
          {currentStep === "details" && (
            <>
              <div className="signup-header">
                <div className="signup-header__logo">
                  <div className="signup-header__icon">🤖</div>
                </div>
                <h1 className="signup-header__title">Create Account</h1>
                <p className="signup-header__subtitle">
                  Join thousands using AI-powered career guidance
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="signup-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-group__label">
                      First Name
                    </label>
                    <div className="form-group__input-wrapper">
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className={`form-group__input ${
                          errors.firstName ? "form-group__input--error" : ""
                        }`}
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid={errors.firstName ? "true" : "false"}
                        aria-describedby={
                          errors.firstName ? "firstName-error" : undefined
                        }
                      />
                    </div>
                    {errors.firstName && (
                      <p
                        id="firstName-error"
                        className="form-group__error"
                        role="alert"
                      >
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-group__label">
                      Last Name
                    </label>
                    <div className="form-group__input-wrapper">
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className={`form-group__input ${
                          errors.lastName ? "form-group__input--error" : ""
                        }`}
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid={errors.lastName ? "true" : "false"}
                        aria-describedby={
                          errors.lastName ? "lastName-error" : undefined
                        }
                      />
                    </div>
                    {errors.lastName && (
                      <p
                        id="lastName-error"
                        className="form-group__error"
                        role="alert"
                      >
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-row">
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
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                      />
                    </div>
                    {errors.email && (
                      <p
                        id="email-error"
                        className="form-group__error"
                        role="alert"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="mobileNo" className="form-group__label">
                      Mobile Number
                    </label>
                    <div className="form-group__input-wrapper">
                      <input
                        type="text"
                        id="mobileNo"
                        name="mobileNo"
                        className={`form-group__input ${
                          errors.mobileNo ? "form-group__input--error" : ""
                        }`}
                        placeholder="+919865894350"
                        value={formData.mobileNo}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid={errors.mobileNo ? "true" : "false"}
                        aria-describedby={
                          errors.mobileNo ? "mobileNo-error" : undefined
                        }
                      />
                    </div>
                    {errors.mobileNo && (
                      <p
                        id="mobileNo-error"
                        className="form-group__error"
                        role="alert"
                      >
                        {errors.mobileNo}
                      </p>
                    )}
                  </div>
                </div>

                {/* <div className="form-group">
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
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                    />
                  </div>
                  {errors.email && (
                    <p
                      id="email-error"
                      className="form-group__error"
                      role="alert"
                    >
                      {errors.email}
                    </p>
                  )}
                </div> */}

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
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
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

                <div className="form-group">
                  <label
                    htmlFor="confirmPassword"
                    className="form-group__label"
                  >
                    Confirm Password
                  </label>
                  <div className="form-group__input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`form-group__input form-group__input--password ${
                        errors.confirmPassword ? "form-group__input--error" : ""
                      }`}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      aria-invalid={errors.confirmPassword ? "true" : "false"}
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirmPassword-error"
                          : undefined
                      }
                    />
                    <button
                      type="button"
                      className="form-group__toggle-password"
                      onClick={toggleConfirmPasswordVisibility}
                      disabled={isLoading}
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p
                      id="confirmPassword-error"
                      className="form-group__error"
                      role="alert"
                    >
                      {errors.confirmPassword}
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

                <div className="signup-actions">
                  <button
                    type="submit"
                    className={`btn btn--primary ${
                      isLoading ? "btn--loading" : ""
                    }`}
                    disabled={isLoading}
                  >
                    {!isLoading && "Create Account"}
                    {isLoading && "Creating Account..."}
                  </button>
                </div>
              </form>

              <div className="signup-footer">
                <p className="signup-footer__text">
                  Already have an account?{" "}
                  <a
                    href="#login"
                    className="signup-footer__link"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      navigate("/login");
                      //   alert("Login functionality - Add your route here");
                    }}
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </>
          )}

          {currentStep === "otp" && (
            <div className="otp-section">
              <div className="otp-info">
                <div className="otp-info__icon">📧</div>
                <h2 className="otp-info__title">Verify Your Email</h2>
                <p className="otp-info__message">
                  We've sent a 6-digit code to
                </p>
                <p className="otp-info__email">
                  {formData.email}
                  <a className="otp-info__edit" onClick={handleEditEmail}>
                    Edit
                  </a>
                </p>
              </div>

              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`otp-input ${
                      otpError ? "otp-input--error" : ""
                    }`}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    disabled={isLoading}
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>

              {otpError && (
                <p className="otp-error" role="alert">
                  {otpError}
                </p>
              )}

              <div className="otp-actions">
                <button
                  className={`btn btn--primary ${
                    isLoading ? "btn--loading" : ""
                  }`}
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otp.join("").length !== otp.length}
                >
                  {!isLoading && "Verify & Continue"}
                </button>

                <div className="otp-resend">
                  {canResend ? (
                    <>
                      Didn't receive code?{" "}
                      <a className="otp-resend__link" onClick={handleResendOtp}>
                        Resend OTP
                      </a>
                    </>
                  ) : (
                    <>
                      Resend code in{" "}
                      <span className="otp-resend__timer">{resendTimer}s</span>
                    </>
                  )}
                </div>

                <button
                  className="btn btn--secondary"
                  onClick={handleEditEmail}
                  disabled={isLoading}
                >
                  Change Email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SignupPage;
