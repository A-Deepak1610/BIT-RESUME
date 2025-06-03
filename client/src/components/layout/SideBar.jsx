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
import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  // const [activeItem, setActiveItem] = useState(location.pathname);
  const [expandedMenus, setExpandedMenus] = useState({
    activityLogger: false,
    collegeEvents: false,
    studentRequests: false,
    activityTracker: false,
  });
  const activityLoggerRef = useRef(null);
  const collegeEventsRef = useRef(null);
  const studentRequestsRef = useRef(null);
  const activityTrackerRef = useRef(null);

  const { user, logout } = useAuth();
  const activeItem = useMemo(() => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/faculty-dashboard") return "dashboard";
    if (path === "/uploadview") return "upload";
    if (path === "/resume") return "resume";
    if (path.includes("/Achivement/ActivityMaster")) return "activityMaster";
    if (path.includes("/Achivement/ActivityLogger/RegisteredEvents")) return "registeredEvents";
    if (path.includes("/Achivement/ActivityLogger/RequestedEvents")) return "requestedEvents";
    if (path.includes("/Achivement/ActivityLogger")) return "activityLogger";
    if (path.includes("/Achivement/ColEvents/Surveys")) return "surveys";
    if (path.includes("/Achivement/ColEvents/Meetings")) return "meetings";
    if (path.includes("/Achivement/ColEvents")) return "collegeEvents";
    if (path === "/faculty-approval") return "projectApprovals";
    if (path === "/faculty-verification") return "certificateVerifications";
    if (path.includes("/faculty-approval") || path.includes("/faculty-verification")) return "studentRequests";
    if (path === "/faculty/tracker/all-events-log") return "allEventsLog";
    if (path === "/faculty-manageActivity") return "manageActivities";
    if (path.includes("/faculty/tracker") || path.includes("/faculty-manageActivity")) return "activityTracker";
    if (path === "/faculty-studentperformance") return "studentPerformance";
    if (path === "/faculty-resumeDraft") return "resumeDrafts";
    return "";
  }, [location.pathname]);  
  const handleItemClick = (itemName) => {
    // setActiveItem(itemName);
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
  return (
    <aside className="w-[220px] hidden lg:flex bg-white shadow-md h-full flex-col justify-between p-4">
      {user && user.role === "faculty" ? (
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
                    }} // Corrected navigation path
                  >
                    <VerifiedOutlinedIcon fontSize="small" className="mr-1" />{" "}
                    Verifications
                  </li>
                </ul>
              </li>

              <li>
                <div
                  className={`relative flex items-center gap-1 cursor-pointer p-2 rounded-md text-[14px] transition-all duration-300 ease-in-out ${
                    expandedMenus.activityTracker
                      ? "text-[#0200e1] w-51"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => toggleMenu("activityTracker")}
                >
                  <ManageHistoryOutlinedIcon fontSize="small" />
                  <span
                    className={`transition-colors duration-300 ease-in-out ${
                      activeItem === "activityTracker" ||
                      expandedMenus.activityTracker
                        ? "text-[#0200e1]"
                        : ""
                    }`}
                  >
                    Activity Tracker
                  </span>
                  <div
                    className={`ml-auto transform transition-transform duration-100 ${
                      expandedMenus.activityTracker ? "rotate-90" : ""
                    }`}
                  >
                    <KeyboardArrowRightRoundedIcon fontSize="small" />
                  </div>
                  <div
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-[3px] h-6 bg-primary rounded-full transition-all duration-300 ease-in-out ${
                      expandedMenus.activityTracker
                        ? "block opacity-100"
                        : "hidden opacity-0"
                    }`}
                  ></div>
                </div>
                <ul
                  ref={activityTrackerRef}
                  className={`${subMenuTransitionClass} w-55 ${
                    expandedMenus.activityTracker ? "max-h-24" : "max-h-0"
                  }`}
                >
                  <li
                    className={`flex items-center mt-3 gap-3 cursor-pointer ml-6 pl-4 text-[15px] p-2 rounded-md transition-all duration-300 ease-in-out ${
                      activeItem === "allEventsLog"
                        ? "text-white bg-primary"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      handleItemClick("allEventsLog");
                      navigate("/faculty/tracker/all-events-log");
                    }}
                  >
                    <FormatListBulletedOutlinedIcon
                      fontSize="small"
                      className="mr-1"
                    />{" "}
                    All Events Log
                  </li>
                  <li
                    className={`flex items-center mt-3  gap-3 cursor-pointer ml-6 pl-4 text-[15px] p-2 rounded-md transition-all duration-300 ease-in-out ${
                      activeItem === "manageActivities"
                        ? "text-white bg-primary"
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
                <BarChartOutlinedIcon fontSize="small" /> Students Performance
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
      ) : (
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
                  navigate("/dashboard");
                }}
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
                onClick={() => {
                  navigate("/Achivement/ActivityMaster");
                }}
              >
                Activity Master
              </li>
              <li>
                <div
                  className={`relative flex items-center cursor-pointer p-2 rounded-md pl-9 text-[15px] transition-all duration-300 ease-in-out ${
                    expandedMenus.activityLogger
                      ? "text-[#0200e1] w-51"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => toggleMenu("activityLogger")}
                >
                  <span
                    className={`transition-colors duration-300 ease-in-out ${
                      activeItem === "activityLogger" ||
                      expandedMenus.activityLogger
                        ? "text-[#0200e1]"
                        : ""
                    }`}
                  >
                    Activity Logger
                  </span>
                  <div
                    className={`ml-4 transform transition-transform duration-100 ${
                      expandedMenus.activityLogger ? "rotate-90" : ""
                    }`}
                  >
                    <KeyboardArrowRightRoundedIcon fontSize="small" />
                  </div>
                  <div
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-[3px] h-6 bg-primary rounded-full transition-all duration-300 ease-in-out ${
                      expandedMenus.activityLogger
                        ? "block opacity-100"
                        : "hidden opacity-0"
                    }`}
                  ></div>
                </div>
                <ul
                  ref={activityLoggerRef}
                  className={`${subMenuTransitionClass} w-55 ${
                    expandedMenus.activityLogger ? "max-h-24" : "max-h-0"
                  }`}
                >
                  <li
                    className={`flex items-center mt-3 gap-3 cursor-pointer ml-8 p-2 rounded-md pl-6 text-[14px] transition-all duration-300 ease-in-out ${
                      activeItem === "registeredEvents"
                        ? "text-white bg-primary"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      navigate("/Achivement/ActivityLogger/RegisteredEvents");
                    }}
                  >
                    Registered Events
                  </li>
                  <li
                    className={`flex items-center mt-3 gap-3 cursor-pointer ml-8 p-2 rounded-md pl-6 text-[14px] transition-all duration-300 ease-in-out ${
                      activeItem === "requestedEvents"
                        ? "text-white bg-primary w-45"
                        : "hover:bg-gray-100"
                    }`} // Assuming w-45 is defined
                    onClick={() => {
                      handleItemClick("requestedEvents");
                      navigate("/Achivement/ActivityLogger/RequestedEvents");
                    }}
                  >
                    Requested Events
                  </li>
                </ul>
              </li>
              <li>
                <div
                  className={`relative flex items-center cursor-pointer p-2 rounded-md pl-9 text-[15px] transition-all duration-100 ease-in-out ${
                    expandedMenus.collegeEvents
                      ? "text-[#0200e1] w-51"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => toggleMenu("collegeEvents")}
                >
                  <span
                    className={`transition-colors duration-300 ease-in-out ${
                      activeItem === "collegeEvents" ||
                      expandedMenus.collegeEvents
                        ? "text-[#0200e1]"
                        : ""
                    }`}
                  >
                    College Events
                  </span>
                  <div
                    className={`ml-4 transform transition-transform duration-300 ${
                      expandedMenus.collegeEvents ? "rotate-90" : ""
                    }`}
                  >
                    <KeyboardArrowRightRoundedIcon fontSize="small" />
                  </div>
                  <div
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-[3px] h-6 bg-primary rounded-full transition-all duration-100 ease-in-out ${
                      expandedMenus.collegeEvents
                        ? "block opacity-100"
                        : "hidden opacity-0"
                    }`}
                  ></div>
                </div>
                <ul
                  ref={collegeEventsRef}
                  className={`${subMenuTransitionClass} w-55 ${
                    expandedMenus.collegeEvents ? "max-h-24" : "max-h-0"
                  }`}
                >
                  <li
                    className={`flex items-center mt-3 gap-3 ml-8 cursor-pointer p-2 rounded-md pl-6 text-[14px] transition-all duration-300 ease-in-out ${
                      activeItem === "surveys"
                        ? "text-white bg-primary"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      handleItemClick("surveys");
                      navigate("/Achivement/ColEvents/Surveys");
                    }}
                  >
                    Surveys
                  </li>
                  <li
                    className={`flex items-center mt-3 gap-3 cursor-pointer p-2 rounded-md ml-8 pl-6 text-[14px] transition-all duration-300 ease-in-out ${
                      activeItem === "meetings"
                        ? "text-white bg-primary"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      handleItemClick("meetings");
                      navigate("/Achivement/ColEvents/Meetings");
                    }} // Added navigation
                  >
                    Meetings/Sessions
                  </li>
                </ul>
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "upload"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  handleItemClick("upload");
                  navigate("/uploadview");
                }}
              >
                <FindInPageOutlinedIcon fontSize="small" /> Upload / View
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "resume"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  handleItemClick("resume");
                  navigate("/resume");
                }}
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
      )}
    </aside>
  );
}
