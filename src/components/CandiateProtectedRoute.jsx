import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CandiateProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { token, loading } = useAuth(); // Destructure token and loading (if available)

  // 1. If still initializing/loading, render a loader or null to prevent premature redirect
  if (loading) {
    return <div>Loading...</div>; // Or your custom spinner component
  }

  // 2. If no token found after loading, redirect to login
  if (!token) {
    return <Navigate to="/ezohr/candiate/login" state={{ from: location }} replace />;
  }

  // 3. Otherwise, render protected content
  return children;
};

export default CandiateProtectedRoute;