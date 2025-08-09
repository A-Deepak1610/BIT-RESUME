import React, { useState, useRef, useMemo, useEffect } from "react";
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
import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Get current active item and determine which menus should be expanded
  const { activeItem, shouldExpandStudentRequests, shouldExpandActivityTracker } = useMemo(() => {
    const path = location.pathname;
    let active = "";
    let expandStudentRequests = false;
    let expandActivityTracker = false;

    // Dashboard routes
    if (path === "/dashboard" || path === "/faculty-dashboard") {
      active = "dashboard";
    }
    // Student routes
    else if (path === "/uploadview") {
      active = "upload";
    }
    else if (path === "/resume") {
      active = "resume";
    }
    else if (path.includes("/Achivement/ActivityMaster")) {
      active = "activityMaster";
    }
    else if (path.includes("/Achivement/ActivityLogger")) {
      active = "activityLogger";
    }
    // Faculty routes - Student Requests submenu
    else if (path === "/faculty-approval") {
      active = "projectApprovals";
      expandStudentRequests = true;
    }
    else if (path === "/faculty-verification") {
      active = "certificateVerifications";
      expandStudentRequests = true;
    }
    // Faculty routes - Activity Tracker submenu
    else if (path === "/faculty/tracker/all-events-log") {
      active = "allEventsLog";
      expandActivityTracker = true;
    }
    // Faculty routes - Other
    else if (path === "/faculty-manageActivity") {
      active = "manageActivities";
    }
    else if (path === "/faculty-studentperformance") {
      active = "studentPerformance";
    }
    else if (path === "/faculty-resumeDraft") {
      active = "resumeDrafts";
    }
    // Admin routes
    else if (path === "/admin-addactivity") {
      active = "addactivity";
    }

    return {
      activeItem: active,
      shouldExpandStudentRequests: expandStudentRequests,
      shouldExpandActivityTracker: expandActivityTracker
    };
  }, [location.pathname]);

  // State for expanded menus
  const [expandedMenus, setExpandedMenus] = useState({
    studentRequests: shouldExpandStudentRequests,
    activityTracker: shouldExpandActivityTracker,
  });

  // Update expanded menus when route changes
  useEffect(() => {
    setExpandedMenus({
      studentRequests: shouldExpandStudentRequests,
      activityTracker: shouldExpandActivityTracker,
    });
  }, [shouldExpandStudentRequests, shouldExpandActivityTracker]);

  const studentRequestsRef = useRef(null);
  const activityTrackerRef = useRef(null);

  const handleItemClick = (itemName) => {
    // This function is kept for potential future use or consistency
  };

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const subMenuTransitionClass = "transition-all overflow-hidden duration-300 ease-in-out";

  const renderSidebarContent = () => {
    if (user?.role === "faculty") {
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
                  navigate("/faculty-dashboard");
                }}
              >
                <DashboardOutlinedIcon fontSize="small" /> Dashboard
              </li>

              <li>
                <div
                  className={`relative flex items-center gap-1 cursor-pointer p-2 rounded-md text-[14px] transition-all duration-300 ease-in-out ${
                    expandedMenus.studentRequests || activeItem === "projectApprovals" || activeItem === "certificateVerifications"
                      ? "text-[#0200e1] w-51"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => toggleMenu("studentRequests")}
                >
                  <GroupWorkOutlinedIcon fontSize="small" />
                  <span
                    className={`transition-colors duration-300 ease-in-out ${
                      activeItem === "projectApprovals" || activeItem === "certificateVerifications" ||
                      expandedMenus.studentRequests
                        ? "text-[#0200e1]"
                        : ""
                    }`}
                  >
                    Student Requests
                  </span>
                  <div
                    className={`ml-auto transform transition-transform duration-100 ${
                      expandedMenus.studentRequests ? "rotate-90" : ""
                    }`}
                  >
                    <KeyboardArrowRightRoundedIcon fontSize="small" />
                  </div>
                  <div
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-[3px] h-6 bg-primary rounded-full transition-all duration-300 ease-in-out ${
                      expandedMenus.studentRequests || activeItem === "projectApprovals" || activeItem === "certificateVerifications"
                        ? "block opacity-100"
                        : "hidden opacity-0"
                    }`}
                  ></div>
                </div>
                <ul
                  ref={studentRequestsRef}
                  className={`${subMenuTransitionClass} w-55 ${
                    expandedMenus.studentRequests ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <li
                    className={`flex items-center mt-3 gap-3 cursor-pointer ml-6 pl-4 text-[15px] p-2 rounded-md transition-all duration-300 ease-in-out ${
                      activeItem === "projectApprovals"
                        ? "text-white bg-primary"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      handleItemClick("projectApprovals");
                      navigate("/faculty-approval");
                    }}
                  >
                    <ApprovalOutlinedIcon fontSize="small" className="mr-1" />{" "}
                    Approvals
                  </li>
                  <li
                    className={`flex items-center mt-3 gap-3 cursor-pointer ml-6 pl-4 text-[15px] p-2 rounded-md transition-all duration-300 ease-in-out ${
                      activeItem === "certificateVerifications"
                        ? "text-white bg-primary"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      handleItemClick("certificateVerifications");
                      navigate("/faculty-verification");
                    }}
                  >
                    <VerifiedOutlinedIcon fontSize="small" className="mr-1" />{" "}
                    Verifications
                  </li>
                </ul>
              </li>

              <li
                className={`flex items-center gap-3 cursor-pointer p-2 mt-3 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "manageActivities"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  handleItemClick("manageActivities");
                  navigate("/faculty-manageActivity");
                }}
              >
                <TuneOutlinedIcon fontSize="small" className="mr-1" />{" "}
                Manage Activities
              </li>

              <li
                className={`flex items-center gap-3 cursor-pointer p-2 mt-3 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "studentPerformance"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  handleItemClick("studentPerformance");
                  navigate("/faculty-studentperformance");
                }}
              >
                <BarChartOutlinedIcon fontSize="small" /> Students Metrics
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "resumeDrafts"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  handleItemClick("resumeDrafts");
                  navigate("/faculty-resumeDraft");
                }}
              >
                <ArticleOutlinedIcon fontSize="small" /> Resume Drafts
              </li>
            </ul>
          </div>
          <div className="">
            <div
              onClick={handleLogout}
              className="flex items-center gap-3 text-[#2e2d2d] font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 p-2 rounded-md"
            >
              <LogoutOutlinedIcon fontSize="small" />
              Logout
            </div>
          </div>
        </>
      );
    } else if (user?.role === "Admin") {
      return (
        <>
          <div className="flex flex-col mt-8">
            <ul className="space-y-4 text-[#2e2d2d] font-medium text-[16px]">
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "addactivity"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate("/admin-addactivity")}
              >
                <AddCircleOutlineIcon fontSize="small" /> Add Activity
              </li>
            </ul>
          </div>
          <div className="">
            <div
              onClick={handleLogout}
              className="flex items-center gap-3 text-[#2e2d2d] font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 p-2 rounded-md"
            >
              <LogoutOutlinedIcon fontSize="small" />
              Logout
            </div>
          </div>
        </>
      );
    } else {
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
                onClick={() => navigate("/dashboard")}
              >
                <DashboardOutlinedIcon fontSize="small" /> Dashboard
              </li>
              <li
                className={`flex items-center gap-1 text-[14px] p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "activityMaster" || activeItem === "activityLogger" ? "text-[#0200e1] w-55" : ""
                }`}
              >
                <StarBorderRoundedIcon fontSize="small" /> Achievement
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md ml-6 pl-4 text-[15px] transition-all duration-300 ease-in-out ${
                  activeItem === "activityMaster"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate("/Achivement/ActivityMaster")}
              >
                Activity Master
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md ml-6 pl-4 text-[15px] transition-all duration-300 ease-in-out ${
                  activeItem === "activityLogger"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate("/Achivement/ActivityLogger")}
              >
                Activity Logger
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "upload"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate("/uploadview")}
              >
                <FindInPageOutlinedIcon fontSize="small" /> Upload / View
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "resume"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate("/resume")}
              >
                <ArticleOutlinedIcon fontSize="small" /> Resume
              </li>
            </ul>
          </div>
          <div className="">
            <div
              onClick={handleLogout}
              className="flex items-center gap-3 text-[#2e2d2d] font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 p-2 rounded-md"
            >
              <LogoutOutlinedIcon fontSize="small" />
              Logout
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <aside className="w-[220px] hidden lg:flex bg-white shadow-md h-full flex-col justify-between p-4">
      {renderSidebarContent()}
    </aside>
  );
}