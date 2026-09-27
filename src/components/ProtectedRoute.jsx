import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setChecking(false);
        return;
      }

      try {
        // JWT structure: header.payload.signature
        const payload = JSON.parse(atob(token.split(".")[1]));

        const currentTime = Math.floor(Date.now() / 1000);

        // JWT `exp` is in seconds
        if (payload.exp && payload.exp <= currentTime) {
          console.log("Token expired");

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setIsAuthenticated(false);
          setChecking(false);
          return;
        }

        setIsAuthenticated(true);
        setChecking(false);

      } catch (error) {
        console.error("Invalid token:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsAuthenticated(false);
        setChecking(false);
      }
    };

    // Check immediately
    checkToken();

    // Check every second
    const timer = setInterval(() => {
      checkToken();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Prevent page from rendering while checking token
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;