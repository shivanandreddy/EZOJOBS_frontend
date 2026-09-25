
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();

  const {
    isAuthenticated,
    user,
    loading,
  } = useUser();

  // Wait for UserContext to initialize
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // No authentication
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location }}
      />
    );
  }

  // Role authorization
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.includes(user?.role);

    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;