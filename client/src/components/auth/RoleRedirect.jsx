// RoleRedirect.js
import { Navigate } from "react-router-dom";
import Login from "../login/Login";
import useAuth from "../../store/UseAuth"; // Import useAuth
import LoadingBar from "../loading/Loading"; // Import LoadingBar for consistency

// Remove the 'use' import, it's not standard React and likely a typo or from a canary build
// import { use } from "react"; // <-- REMOVE THIS

export default function RoleRedirect() {
  const { user, loading } = useAuth(); 
  if (loading) {
    return <LoadingBar />;
  }

  if (!user) return <Login />;
  if (user.role === "student") return <Navigate to="/dashboard" replace />;
  if (user.role === "faculty") return <Navigate to="/faculty-dashboard" replace />;
  if (user.role === "Admin") return <Navigate to="/admin-addactivity" replace />;
  return <Navigate to="/unauthorized" replace />; // Or back to login?
}