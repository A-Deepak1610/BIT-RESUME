import React, { useState, useRef, useMemo } from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../store/UseAuth";
import GroupWorkOutlinedIcon from "@mui/icons-material/GroupWorkOutlined";
import ApprovalOutlinedIcon from "@mui/icons-material/ApprovalOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    studentRequests: false,
    activityTracker: false,
  });

  const studentRequestsRef = useRef(null);
  const activityTrackerRef = useRef(null);

  const { user, logout } = useAuth();
  // Add activeItem and handleItemClick
  const activeItem = useMemo(() => {
    const path = location.pathname;
    if (
      path === "/dashboard" ||
      path === "/faculty-dashboard" ||
      path === "/admin-dashboard"
    )
      return "dashboard";
    if (path === "/faculty/uploadview") return "faculty/uploadview";
    if (path === "/faculty/outside-world-interaction") return "outsideWorldInteraction";
    if (path === "/consultancy") return "consultancy";
    return "";
  }, [location.pathname]);

  const handleItemClick = (itemName) => {
    // For future use if needed
  };

  const renderSidebarContent = () => {
    // Simplified navigation for Principal, IQAC, Hod - only Dashboard and Consultancy
    if (["Principal", "IQAC", "Hod"].includes(user?.role)) {
      return (
        <>
          <div className="flex flex-col mt-8">
            <ul className="space-y-4 text-[#2e2d2d] font-medium text-[16px]">
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "dashboard"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  handleItemClick("dashboard");
                  navigate("/dashboard");
                }}
              >
                <DashboardOutlinedIcon fontSize="small" /> Dashboard
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "consultancy"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate("/consultancy")}
              >
                <GroupWorkOutlinedIcon fontSize="small" /> Consultancy
              </li>
            </ul>
          </div>
          <div className="">
            <div
              onClick={async () => {
                await logout();
                navigate("/");
              }}
              className="flex items-center gap-3 text-[#2e2d2d] font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 p-2 rounded-md"
            >
              <LogoutOutlinedIcon fontSize="small" />
              Logout
            </div>
          </div>
        </>
      );
    }
    
    // Full navigation for faculty and other roles
    return (
      <>
        <div className="flex flex-col mt-8">
          <ul className="space-y-4 text-[#2e2d2d] font-medium text-[16px]">
            <li
              className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                activeItem === "dashboard"
                  ? "text-white bg-primary w-55"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => {
                handleItemClick("dashboard");
                if (user?.role === "faculty") navigate("/faculty-dashboard");
                else if (user?.role === "Admin") navigate("/admin-dashboard");
                else navigate("/dashboard");
              }}
            >
              <DashboardOutlinedIcon fontSize="small" /> Dashboard
            </li>
            <li
              className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                activeItem === "faculty/uploadview"
                  ? "text-white bg-primary w-55"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => navigate("/faculty/uploadview")}
            >
              <StarBorderRoundedIcon fontSize="small" /> Faculty Achievements
            </li>
            <li
              className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                activeItem === "outsideWorldInteraction"
                  ? "text-white bg-primary w-55"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => navigate("/faculty/outside-world-interaction")}
            >
              <PublicOutlinedIcon fontSize="small" /> Outside World Interaction
            </li>
            <li
              className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                activeItem === "consultancy"
                  ? "text-white bg-primary w-55"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => navigate("/consultancy")}
            >
              <GroupWorkOutlinedIcon fontSize="small" /> Consultancy
            </li>
          </ul>
        </div>
        <div className="">
          <div
            onClick={async () => {
              await logout();
              navigate("/");
            }}
            className="flex items-center gap-3 text-[#2e2d2d] font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 p-2 rounded-md"
          >
            <LogoutOutlinedIcon fontSize="small" />
            Logout
          </div>
        </div>
      </>
    );
  };

  return (
    <aside className="w-[220px] hidden lg:flex bg-white shadow-md h-full flex-col justify-between p-4">
      {renderSidebarContent()}
    </aside>
  );
}
