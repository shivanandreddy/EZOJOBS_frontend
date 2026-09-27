
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "./Spinner";

const CandiateProtectedRoute = ({ children }) => {
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");

      // No token
      if (!token) {
        setIsAuthenticated(false);
        setChecking(false);
        return;
      }

      try {
        // JWT structure:
        // header.payload.signature
        const payload = JSON.parse(atob(token.split(".")[1]));

        const currentTime = Math.floor(Date.now() / 1000);

        // JWT exp is in seconds
        if (payload.exp && payload.exp <= currentTime) {
          console.log("Candidate token expired");

          // Remove candidate authentication data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("candiate");

          setIsAuthenticated(false);
          setChecking(false);
          return;
        }

        // Token is valid
        setIsAuthenticated(true);
        setChecking(false);
      } catch (error) {
        console.error("Invalid candidate token:", error);

        // Invalid token cleanup
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("candiate");

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

  // Candidate is not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/ezohr/candiate/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Candidate is authenticated
  return children;
};

export default CandiateProtectedRoute;

