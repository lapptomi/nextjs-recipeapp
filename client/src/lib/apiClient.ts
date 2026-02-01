import axios from "axios";
import { getSession } from "./actions/auth";
import { API_URL } from "./constants";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
});

// Request interceptor - runs before every request
apiClient.interceptors.request.use(
  async (config) => {
    // Automatically add JWT token to every request
    const session = await getSession();
    if (session?.user.jwt) {
      config.headers.Authorization = `Bearer ${session.user.jwt}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors (e.g. network issues before request is sent)
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // This runs for error responses (4xx, 5xx status codes)
    console.error("API Error:", error.response?.status, error.message);

    // Handle specific errors
    if (error.response?.status === 401) {
      console.error("Unauthorized - redirect to login");
    }

    if (error.response?.status === 403) {
      console.error("Forbidden");
    }

    // Optionally transform error message
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);
