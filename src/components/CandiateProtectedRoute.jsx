import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CandiateProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default CandiateProtectedRoute;