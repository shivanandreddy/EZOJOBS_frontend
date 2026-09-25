// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// ===============================
// REQUEST INTERCEPTOR
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ===============================
// RESPONSE INTERCEPTOR
// ===============================
api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      console.log("JWT expired or unauthorized");

      // Remove authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("candiate");

      // Check current route
      const currentPath = window.location.pathname;

      // Candidate
      if (currentPath.startsWith("/ezohr/candiate")) {
        window.location.href = "/ezohr/candiate/login";
      }

      // HR/Admin
      else {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;