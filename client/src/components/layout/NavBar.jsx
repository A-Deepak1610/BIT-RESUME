import React, { useState, useRef, useMemo } from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DehazeIcon from "@mui/icons-material/Dehaze";
import Drawer from "@mui/material/Drawer";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo_bit.jpg";
import useAuth from "../../store/UseAuth";

// Faculty & Admin Menu Icons
import GroupWorkOutlinedIcon from '@mui/icons-material/GroupWorkOutlined';
import ApprovalOutlinedIcon from '@mui/icons-material/ApprovalOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Updated activeItem logic to include all Admin routes
  const activeItem = useMemo(() => {
    const path = location.pathname;
    // Common routes
    if (path === "/dashboard" || path === "/faculty-dashboard" || path === "/admin-dashboard") return "dashboard";
    if (path === "/uploadview") return "upload";
    if (path === "/resume") return "resume";
    // Student routes
    if (path.includes("/Achivement/ActivityMaster")) return "activityMaster";
    if (path.includes("/Achivement/ActivityLogger")) return "activityLogger";
    // Faculty routes
    if (path === "/faculty-approval") return "projectApprovals";
    if (path === "/faculty-verification") return "certificateVerifications";
    if (path.includes("/faculty-approval") || path.includes("/faculty-verification")) return "studentRequests";
    if (path === "/faculty-manageActivity") return "manageActivities";
    if (path === "/faculty-studentperformance") return "studentPerformance";
    if (path === "/faculty-resumeDraft") return "resumeDrafts";
    // Admin routes
    if (path === "/admin-addactivity") return "addactivity";
    if (path === "/admin-studentsPerformance") return "studentsPerformance";
    if (path === "/admin-AddUsers") return "addusers";
    return "";
  }, [location.pathname]);

  const [expandedMenus, setExpandedMenus] = useState({
    studentRequests: false,
    // activityTracker is no longer needed here as it's removed
  });

  const studentRequestsRef = useRef(null);
  // activityTrackerRef is no longer needed

  const handleItemClick = (itemName) => {
    // Kept for consistency or future use
  };

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const subMenuTransitionClass = "transition-all overflow-hidden duration-300 ease-in-out";

  // This function is now updated to match SideBar's renderSidebarContent
  const renderDrawerContent = () => {
    if (user?.role === "faculty") {
      return (
        // Updated Faculty Drawer Content
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
                  setOpen(false);
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
                      setOpen(false);
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
                      setOpen(false);
                    }}
                  >
                    <VerifiedOutlinedIcon fontSize="small" className="mr-1" />{" "}
                    Verifications
                  </li>
                </ul>
              </li>

              {/* "Manage Activities" moved out of dropdown */}
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 mt-3 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "manageActivities"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  handleItemClick("manageActivities");
                  navigate("/faculty-manageActivity");
                  setOpen(false);
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
                  setOpen(false);
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
                  setOpen(false);
                }}
              >
                <ArticleOutlinedIcon fontSize="small" /> Resume Drafts
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <div
              onClick={() => { handleLogout(); setOpen(false); }}
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
        // Updated Admin Drawer Content
        <>
          <div className="flex flex-col mt-8">
            <ul className="space-y-4 text-[#2e2d2d] font-medium text-[16px]">
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "dashboard"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => { navigate("/admin-dashboard"); setOpen(false); }}
              >
                <DashboardOutlinedIcon fontSize="small" /> Dashboard
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "addactivity"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => { navigate("/admin-addactivity"); setOpen(false); }}
              >
                <AddCircleOutlineIcon fontSize="small" /> Add Activity
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "studentsPerformance"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => { navigate("/admin-studentsPerformance"); setOpen(false); }}
              >
                <BarChartOutlinedIcon fontSize="small" /> Student Metrics
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "addusers"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => { navigate("/admin-AddUsers"); setOpen(false); }}
              >
                <AddCircleOutlineIcon fontSize="small" /> Add Users
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <div
              onClick={() => { handleLogout(); setOpen(false); }}
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
        // Student Drawer Content (remains the same)
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
                  setOpen(false);
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
                  setOpen(false);
                }}
              >
                Activity Master
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md ml-6 pl-4 text-[15px] transition-all duration-300 ease-in-out ${
                  activeItem === "activityLogger"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  navigate("/Achivement/ActivityLogger");
                  setOpen(false);
                }}
              >
                Activity Logger
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                  activeItem === "upload"
                    ? "text-white bg-primary w-55"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  navigate("/uploadview");
                  setOpen(false);
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
                  navigate("/resume");
                  setOpen(false);
                }}
              >
                <ArticleOutlinedIcon fontSize="small" /> Resume
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <div
              onClick={() => { handleLogout(); setOpen(false); }}
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

  const DrawerList = (
    <>
      <div className="flex items-center text-2xl font-semibold text-primary justify-center mt-5">
        <img src="dummy" alt="LOGO" className="w-7 h-7 rounded-full mr-2" />
        <p>BIT RESUME</p>
      </div>
      <aside className="w-[220px] overflow-x-hidden bg-white shadow-md h-full flex flex-col mt-[-5px] justify-between p-4">
        {renderDrawerContent()}
      </aside>
    </>
  );

  const handleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-14 dark:bg-gray-100 bg-white shadow-md flex items-center justify-between ">
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      <div className="flex items-center text-2xl font-semibold text-primary lg:w-55 h-full justify-center lg:shadow-md">
        <img
          src="dummy"
          alt="LOGO"
          className="w-7 h-7 rounded-full mr-2 hidden lg:block"
        />
        <div className="block lg:hidden mb-1 ml-2 cursor-pointer">
          <DehazeIcon onClick={toggleDrawer(true)} />
        </div>
        <p className="lg:ml-0 ml-2">BIT RESUME</p>
      </div>
      <div className="flex items-center gap-4 px-6">
        <div
          onClick={handleDarkMode}
          className="w-8 h-8 sm:flex hidden bg-white border border-secondary rounded-md md:flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100 transition duration-300"
        >
          <DarkModeIcon className="text-secondary" />
        </div>
        <div className="w-8 h-8 sm:flex hidden bg-white border border-secondary rounded-md md:flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100 transition duration-300">
          <NotificationsNoneIcon className="text-secondary" />
        </div>
        <div className="md:flex flex-col sm:flex hidden items-start justify-center gap-1 cursor-pointer">
          <p className="font-semibold text-[17px] leading-none">{user?.name || "User"}</p>
          <p className="text-xs text-gray-600 leading-none font-medium">
            {user?.id || "7376242AD136"}
          </p>
        </div>
        <div className="w-9 h-9 bg-white border border-secondary rounded-full overflow-hidden shadow-md cursor-pointer hover:bg-gray-100 transition duration-300">
          <img
            src={logo}
            alt="profile"
            className="w-full h-full object-cover "
          />
        </div>
      </div>
    </header>
  );
}