import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};
export default RequireAuth;
