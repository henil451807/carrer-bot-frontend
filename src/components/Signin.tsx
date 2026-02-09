import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import { googleSignIn } from "../auth/google";
import { useAuth } from "../auth/useAuth";

export function GoogleLoginButton() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleLogin = async () => {
    try {
      const firebaseToken = await googleSignIn();
      const res = await authApi.googleSignup({
        firebase_token: firebaseToken,
      });

      if (res.data?.token) {
        await login(res.data?.token);
        navigate("/chat");
      }
    } catch (err) {
      console.error("Google sign-in failed", err);
    }
  };

  return (
    <>
      <style>
        {`
        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 10px 16px;
          background-color: #ffffff;
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          cursor: pointer;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #3c4043;
          transition: background-color 0.2s, box-shadow 0.2s;
          margin-top: 15px; /* Re-enabled this to space it from the divider */
        }

        .google-btn:hover {
          background-color: #f8f9fa;
          border-color: #d2d7df;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .google-btn:active {
          background-color: #eeeeee;
        }

        .google-icon {
          width: 18px;
          height: 18px;
          margin-right: 12px;
        }
          `}
      </style>

      <button className="google-btn" onClick={handleLogin}>
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
        <span>Sign in with Google</span>
      </button>
    </>
  );
}
