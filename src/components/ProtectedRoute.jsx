import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Spinner from './Spinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { isAuthenticated, user, loading } = useUser();
 
  // 1. Wait until UserContext finishes loading/parsing session from storage
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // 2. If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location }}
      />
    );
  }

  // 3. Optional: Role-based authorization check
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.includes(user?.role);
    if (!hasRequiredRole) {
      // Redirect unauthorized users to the default dashboard
      return <Navigate to="/ezohr/home" replace />;
    }
  }

  // 4. Render protected content if all checks pass
  return children;
};

export default ProtectedRoute;