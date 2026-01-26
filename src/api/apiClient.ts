import { toast } from "@/hooks/useToast";
import axios from "axios";

// Determine the baseURL based on the environment
// const baseURL =
//   import.meta.env.NODE_ENV === "development"
//     ? import.meta.env.REACT_APP_DEV
//     : import.meta.env.NODE_ENV === "test"
//     ? import.meta.env.REACT_APP_TEST
//     : import.meta.env.NODE_ENV === "production"
//     ? import.meta.env.REACT_APP_PROD
//     : import.meta.env.REACT_APP_DEFAULT;

const baseURL = import.meta.env.VITE_VOICEBOT_URL;

const apiClient = axios.create({
  baseURL, // Dynamically set baseURL
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

// Optional: Attach token if available
apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("businessos_access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Optional: Global error handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.danger("Session expired");
      localStorage.removeItem("businessos_access_token");
      localStorage.removeItem("businessos_user");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
