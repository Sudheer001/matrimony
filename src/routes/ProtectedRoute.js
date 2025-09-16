import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";

export function ProtectedRoute({ children, roles }) {
  const { state:{user} } = useAuth();

  if (!user) {
    return <Navigate to={process.env.PUBLIC_URL + "/login"} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <h3 className="text-center mt-5">🚫 Access Denied</h3>;
  }

  return children;
}
