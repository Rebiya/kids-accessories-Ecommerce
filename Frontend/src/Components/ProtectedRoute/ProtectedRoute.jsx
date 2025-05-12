import React, { useEffect } from "react";
import { useAuth } from "../DataProvider/DataProvider";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [], msg, redirect }) => {
  const navigate = useNavigate();
  const { state: { user } } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/auth", { state: { msg, redirect } });
    } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role_id)) {
      navigate("/unauthorized", {
        state: { msg: "Access denied: insufficient permissions." },
      });
    }
  }, [user, allowedRoles, msg, redirect, navigate]);

  return user && (allowedRoles.length === 0 || allowedRoles.includes(user.role_id)) 
    ? children 
    : null;
};

export default ProtectedRoute;