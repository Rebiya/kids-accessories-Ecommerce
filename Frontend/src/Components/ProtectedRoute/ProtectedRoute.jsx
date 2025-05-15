import React, { useEffect } from "react";
import { useAuth } from "../DataProvider/DataProvider";
import { useNavigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: { user, isAuthenticated } } = useAuth();
useEffect(() => {
  if (user === undefined) return;

  // Handle unauthorized access attempts
  if (isAuthenticated && allowedRoles.length > 0 && !allowedRoles.includes(user?.role_id)) {
    if (user?.role_id === 3) {
      navigate("/admin/welcome", { 
        replace: true,
        state: { error: "You don't have permission to access this page" }
      });
    } else {
      navigate("/", {
        replace: true,
        state: { error: "You don't have permission to access this page" }
      });
    }
    return;
  }

  // Handle unauthenticated access
  if (!isAuthenticated && !["/auth", "/register"].includes(location.pathname)) {
    navigate("/auth", { 
      replace: true,
      state: { from: location.pathname }
    });
  }
}, [user, isAuthenticated, allowedRoles, navigate, location]);

  if (!isAuthenticated) return null;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role_id)) return null;
  
  return children;
};

export default ProtectedRoute;