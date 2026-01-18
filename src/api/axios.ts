import axios from "axios";
declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}

const axiosWrapper = axios.create({
  baseURL: "https://career-bot-api-ct5m.onrender.com/api",
});

axiosWrapper.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["ngrok-skip-browser-warning"] = "true";
  }
  return config;
});

axiosWrapper.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const skip = err.config?.skipAuthRedirect;

    if (status === 401 && !skip) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default axiosWrapper;
