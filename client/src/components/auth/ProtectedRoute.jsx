import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../store/UseAuth";
import LoadingBar from "../loading/Loading";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingBar />;
  if (!user) return <Navigate to="/" />;
  const userRole = user?.role;
  // console.log("User Role:", userRole);
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
