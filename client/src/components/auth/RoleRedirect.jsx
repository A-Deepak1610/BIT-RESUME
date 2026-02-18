import { Navigate } from "react-router-dom";
import Login from "../login/Login";
import useAuth from "../../store/UseAuth"; 
import LoadingBar from "../loading/Loading"; 
export default function RoleRedirect() {
  const { user, loading } = useAuth(); 
  if (loading) {
    return <LoadingBar />;
  }
  if (!user) return <Login />;
  if (user.role === "student") return <Navigate to="/dashboard" replace />;
  if (user.role === "faculty") return <Navigate to="/faculty-dashboard" replace />;
  if (user.role === "Admin") return <Navigate to="/admin-dashboard" replace />;
  if (user.role === "Hod") return <Navigate to="/dashboard" replace />;
  if (user.role === "Principal") return <Navigate to="/dashboard" replace />;
  if (user.role === "IQAC") return <Navigate to="/dashboard" replace />;
  return <Navigate to="/unauthorized" replace />; 
}