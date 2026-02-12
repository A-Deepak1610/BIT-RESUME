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
  const activeItem = useMemo(() => {
    const path = location.pathname;
    if (
      path === "/dashboard" ||
      path === "/faculty-dashboard" ||
      path == "/admin-dashboard"
    )
      return "dashboard";
    if (path === "/uploadview") return "upload";
    if (path === "/resume") return "resume";
    if (path.includes("/Achivement/ActivityMaster")) return "activityMaster";
    if (path.includes("/Achivement/ActivityLogger")) return "activityLogger";
    if (path === "/faculty-approval") return "projectApprovals";
    if (path === "/faculty-verification") return "certificateVerifications";
    if (
      path.includes("/faculty-approval") ||
      path.includes("/faculty-verification")
    )
      return "studentRequests";
    if (path === "/faculty/tracker/all-events-log") return "allEventsLog";
    if (path === "/faculty-manageActivity") return "manageActivities";
    if (
      path.includes("/faculty/tracker") ||
      path.includes("/faculty-manageActivity")
    )
      return "activityTracker";
    if (path === "/faculty-studentperformance") return "studentPerformance";
    if (path === "/faculty-resumeDraft") return "resumeDrafts";
    if (path === "/admin-addactivity") return "addactivity";
    if (path == "/admin-studentsPerformance") return "studentsPerformance";
    if (path == "/admin-facultyMetrics") return "facultyMetrics";
    if (path == "/admin-facultyVerifications") return "facultyVerifications";
    if (path == "/admin-AddUsers") return "addusers";
    if (path == "/uploadview/certificate") return "upload";
    if (path == "/uploadview/paperpresentation") return "upload";
    if (path == "/admin-reports") return "admin-reports";
    if (path == "/faculty/uploadview") return "faculty/uploadview";
    if (path == "/faculty/achievements/newsletter") return "faculty/uploadview";
    if (path == "/faculty/achievements/e-content") return "faculty/uploadview";
    if (path == "/faculty/achievements/events-attended")
      return "faculty/uploadview";
    if (path == "/faculty/achievements/events-organized")
      return "faculty/uploadview";
    if (path == "/faculty/achievements/external-examiner")
      return "faculty/uploadview";
    if (path == "/faculty/achievements/journal-reviewer")
      return "faculty/uploadview";
    if (path == "/faculty/achievements/guest-lectures")
      return "faculty/uploadview";
    if (path == "/faculty/achievements/international-visits")
      return "faculty/uploadview";
    if (path == "/faculty/achievements/awards") return "faculty/uploadview";
    if (path == "/faculty/achievements/online-courses")
      return "faculty/uploadview";
    if (path == "/faculty/achievements/papers") return "faculty/uploadview";
    if (path == "/faculty/achievements/resource-person")
      return "faculty/uploadview";
    if (path == "/faculty/outside-world-interaction")
      return "outsideWorldInteraction";
    return "";
  }, [location.pathname]);

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

  const subMenuTransitionClass =
    "transition-all overflow-hidden duration-300 ease-in-out";

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
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "faculty/uploadview"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate("/faculty/uploadview")}
              >
                <StarBorderRoundedIcon fontSize="small" />
                Faculty Achievements
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "outsideWorldInteraction"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate("/faculty/outside-world-interaction")}
              >
                <PublicOutlinedIcon fontSize="small" />
                Outside World Interaction
              </li>
              {/* <li>
                <div
                  className={`relative flex items-center gap-1 cursor-pointer p-2 rounded-md text-[14px] transition-all duration-300 ease-in-out ${
                    expandedMenus.studentRequests
                      ? "text-[#0200e1] w-51"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => toggleMenu("studentRequests")}
                >
                  <GroupWorkOutlinedIcon fontSize="small" />
                  <span
                    className={`transition-colors duration-300 ease-in-out ${
                      activeItem === "studentRequests" ||
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
                      expandedMenus.studentRequests
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
              </li> */}
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
                  activeItem === "dashboard"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate("/admin-dashboard")}
              >
                <DashboardOutlinedIcon fontSize="small" /> Dashboard
              </li>
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
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "studentsPerformance"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate("/admin-studentsPerformance")}
              >
                <BarChartOutlinedIcon fontSize="small" /> Student Metrics
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "facultyMetrics"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate("/admin-facultyMetrics")}
              >
                <BarChartOutlinedIcon fontSize="small" /> Faculty Metrics
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "facultyVerifications"
                    ? "text-white bg-primary"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate("/admin-facultyVerifications")}
              >
                <VerifiedOutlinedIcon fontSize="small" /> Faculty Verifications
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "admin-reports"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate("/admin-reports")}
              >
                <AutoAwesomeIcon fontSize="small" /> Report Generation
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "addusers"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate("/admin-AddUsers")}
              >
                <AddCircleOutlineIcon fontSize="small" /> Add Users
              </li>
            </ul>
          </div>
          <div className="mt-auto">
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
                  activeItem === "achievement" ? "text-[#0200e1] w-55" : ""
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
