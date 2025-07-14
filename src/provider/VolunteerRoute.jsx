import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const VolunteerRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "volunteer") {
    return <Navigate to="/dashboard" />; // redirect if not volunteer
  }

  return children;
};

export default VolunteerRoute;
