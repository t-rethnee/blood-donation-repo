import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (user && user.role === "admin") {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default AdminRoute;
