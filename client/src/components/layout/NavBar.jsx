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
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo_bit.jpg"; // Assuming this is the correct profile logo
import useAuth from "../../store/UseAuth";

// Faculty Menu Icons (ensure these are imported)
import GroupWorkOutlinedIcon from '@mui/icons-material/GroupWorkOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import ApprovalOutlinedIcon from '@mui/icons-material/ApprovalOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import ManageHistoryOutlinedIcon from '@mui/icons-material/ManageHistoryOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';


export default function NavBar() {
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
  const [expandedMenus, setExpandedMenus] = useState({
    activityLogger: false,
    collegeEvents: false,
    // Faculty menu states
    studentRequests: false,
    activityTracker: false,
  });
  const activityLoggerRef = useRef(null); // Keep for student menu
  const collegeEventsRef = useRef(null);  // Keep for student menu
  const studentRequestsRef = useRef(null); // For faculty menu
  const activityTrackerRef = useRef(null); // For faculty menu

  const { user, logout } = useAuth(); // Assuming user object has a 'role' property
  // const user = { role: 'faculty' }; // FOR TESTING: uncomment and set role to 'faculty' or 'student'

  const handleItemClick = (itemName) => {
    // setActiveItem(itemName);
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

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const DrawerList = (
    <>
      <div className="flex items-center  text-2xl font-semibold text-primary  justify-center mt-5  ">
        <img src="dummy" alt="LOGO" className="w-7 h-7 rounded-full mr-2 " />
        <p>BIT RESUME</p>
      </div>
      <aside className="w-[220px] overflow-x-hidden bg-white shadow-md h-full flex flex-col mt-[-5px] justify-between p-4">
        {user && user.role === 'faculty' ? (
          // Faculty Menu
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
                    navigate("/faculty/dashboard"); // Adjust path as needed
                  }}
                >
                  <DashboardOutlinedIcon fontSize="small" /> Dashboard
                </li>

                {/* Student Requests - Expandable */}
                <div className="overflow-hidden">
                  <li
                    className={`relative flex items-center gap-1 cursor-pointer p-2 rounded-md text-[14px] transition-all duration-300 ease-in-out ${
                      expandedMenus.studentRequests
                        ? "text-[#0200e1] w-51" // Active parent style
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => toggleMenu("studentRequests")}
                  >
                    <GroupWorkOutlinedIcon fontSize="small" /> 
                    <span className={`transition-colors duration-300 ease-in-out ${activeItem === "studentRequests" || expandedMenus.studentRequests ? "text-[#0200e1]" : ""}`}>
                       Student Requests
                    </span>
                    <div
                      className={`ml-auto transform transition-transform duration-100 ${ // Use ml-auto to push arrow to the right
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
                  </li>
                  <div
                    ref={studentRequestsRef}
                    className={`transition-all overflow-hidden duration-300 w-55 ease-in-out ${
                      expandedMenus.studentRequests ? "max-h-40" : "max-h-0" // Adjusted max-h for 3 items
                    }`}
                  >
                    <li
                      className={`flex items-center mt-3 gap-3 cursor-pointer ml-6 pl-4 text-[15px] p-2 rounded-md transition-all duration-300 ease-in-out ${
                        activeItem === "eventParticipation"
                          ? "text-white bg-primary"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        handleItemClick("eventParticipation");
                        navigate("/faculty/requests/event-participation"); // Adjust path
                      }}
                    >
                      <EventAvailableOutlinedIcon fontSize="small" className="mr-1" /> Event Participation
                    </li>
                    <li
                      className={`flex items-center mt-3 gap-3 cursor-pointer ml-6 pl-4 text-[15px] p-2 rounded-md transition-all duration-300 ease-in-out ${
                        activeItem === "projectApprovals"
                          ? "text-white bg-primary"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        handleItemClick("projectApprovals");
                        navigate("/faculty/requests/project-approvals"); // Adjust path
                      }}
                    >
                      <ApprovalOutlinedIcon fontSize="small" className="mr-1" /> Project Approvals
                    </li>
                    <li
                      className={`flex items-center mt-3 gap-3 cursor-pointer ml-6 pl-4 text-[15px] p-2 rounded-md transition-all duration-300 ease-in-out ${
                        activeItem === "certificateVerifications"
                          ? "text-white bg-primary"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        handleItemClick("certificateVerifications");
                        navigate("/faculty/requests/certificate-verifications"); // Adjust path
                      }}
                    >
                      <VerifiedOutlinedIcon fontSize="small" className="mr-1" /> Certificate Verifications
                    </li>
                  </div>
                </div>

                {/* Activity Tracker - Expandable */}
                 <div className="overflow-hidden">
                  <li
                    className={`relative flex items-center gap-1 cursor-pointer p-2 rounded-md text-[14px] transition-all duration-300 ease-in-out ${
                      expandedMenus.activityTracker
                        ? "text-[#0200e1] w-51" // Active parent style
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => toggleMenu("activityTracker")}
                  >
                     <ManageHistoryOutlinedIcon fontSize="small" />
                     <span className={`transition-colors duration-300 ease-in-out ${activeItem === "activityTracker" || expandedMenus.activityTracker ? "text-[#0200e1]" : ""}`}>
                        Activity Tracker
                     </span>
                    <div
                       className={`ml-auto transform transition-transform duration-100 ${ // Use ml-auto
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
                  </li>
                  <div
                    ref={activityTrackerRef}
                    className={`transition-all overflow-hidden duration-300 w-55 ease-in-out ${
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
                        navigate("/faculty/tracker/all-events-log"); // Adjust path
                      }}
                    >
                      <FormatListBulletedOutlinedIcon fontSize="small" className="mr-1" /> All Events Log
                    </li>
                    <li
                      className={`flex items-center mt-3 gap-3 cursor-pointer ml-6 pl-4 text-[15px] p-2 rounded-md transition-all duration-300 ease-in-out ${
                        activeItem === "manageActivities"
                          ? "text-white bg-primary"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        handleItemClick("manageActivities");
                        navigate("/faculty-manageActivity"); 
                      }}
                    >
                       <TuneOutlinedIcon fontSize="small" className="mr-1" /> Manage Activities
                    </li>
                  </div>
                </div>
                
                <li
                  className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                    activeItem === "studentPerformance"
                      ? "text-white bg-primary w-55"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    handleItemClick("studentPerformance");
                    navigate("/faculty/student-performance"); // Adjust path
                  }}
                >
                  <BarChartOutlinedIcon fontSize="small" /> Student Performance
                </li>
                <li
                  className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                    activeItem === "resumeDrafts"
                      ? "text-white bg-primary w-55"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    handleItemClick("resumeDrafts");
                    navigate("/faculty/resume-drafts"); // Adjust path
                  }}
                >
                  <ArticleOutlinedIcon fontSize="small" /> Resume Drafts
                </li>
              </ul>
            </div>
            <div className=""> {/* Logout Section */}
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
          // Original Student Menu
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
                  className={`flex items-center gap-1  text-[14px] p-2 rounded-md transition-all duration-300 ease-in-out ${
                    activeItem === "achievement" ? "text-[#0200e1] w-55" : ""
                  }`}
                >
                  <StarBorderRoundedIcon fontSize="small" /> Achievement
                </li>
                <li
                  className={`flex items-center gap-3 cursor-pointer p-2 rounded-md  ml-6 pl-4 text-[15px]  transition-all duration-300 ease-in-out ${
                    activeItem === "activityMaster"
                      ? "text-white bg-primary w-55"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    handleItemClick("activityMaster");
                    navigate("/Achivement/ActivityMaster");
                  }}
                >
                  Activity Master
                </li>
                <div className="ovderflow-hidden"> {/* Typo: should be overflow-hidden */}
                  <li
                    className={`relative flex items-center cursor-pointer p-2 rounded-md pl-9 text-[15px] transition-all duration-300 ease-in-out ${
                      expandedMenus.activityLogger
                        ? "text-[#0200e1] w-51"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => toggleMenu("activityLogger")}
                  >
                    <span
                      className={`transition-colors duration-300  ease-in-out ${
                        activeItem === "activityLogger" ? "text-[#0200e1] " : ""
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
                  </li>
                  <div
                    ref={activityLoggerRef}
                    className={`transition-all overflow-hidden duration-300 w-55 ease-in-out ${
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
                        handleItemClick("registeredEvents");
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
                      }`}
                      onClick={() => {
                        handleItemClick("requestedEvents");
                        navigate("/Achivement/ActivityLogger/RequestedEvents");
                      }}
                    >
                      Requested Events
                    </li>
                  </div>
                </div>
                <div className="">
                  <li
                    className={`relative flex items-center cursor-pointer p-2 rounded-md pl-9 text-[15px] transition-all duration-100 ease-in-out ${
                      expandedMenus.collegeEvents
                        ? "text-[#0200e1] w-51"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => toggleMenu("collegeEvents")}
                  >
                    <span
                      className={`transition-colors duration-300 ease-in-out ${
                        activeItem === "collegeEvents" ? "text-[#0200e1]" : ""
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
                  </li>
                  <div
                    ref={collegeEventsRef}
                    className={`overflow-hidden transition-all w-55 duration-300 ease-in-out ${
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
                      onClick={() => handleItemClick("meetings")} // Missing navigate for meetings? Kept as original
                    >
                      Meetings/Sessions
                    </li>
                  </div>
                </div>
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
    </>
  );

  const handleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    console.log("dark mode toggled");
  };

  return (
    <header className="h-14 dark:bg-gray-100 bg-white shadow-md flex items-center justify-between ">
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      <div className="flex items-center  text-2xl font-semibold text-primary lg:w-55  h-full justify-center  lg:shadow-md">
        <img
          src="dummy" // Assuming this should be the main logo for header as well, or specific for header
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
          className="w-8 h-8 sm:flex  hidden   bg-white border border-secondary rounded-md md:flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100 transition duration-300"
        >
          <DarkModeIcon className="text-secondary" />
        </div>
        <div className="w-8 h-8 sm:flex  hidden   bg-white border border-secondary rounded-md md:flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100 transition duration-300">
          <NotificationsNoneIcon className="text-secondary" />
        </div>
        <div className="md:flex flex-col sm:flex  hidden items-start justify-center gap-1 cursor-pointer">
          <p className="font-semibold text-[17px] leading-none">{user?.name || "User"}</p> {/* Display user name */}
          <p className="text-xs text-gray-600 leading-none font-medium">
            {user?.id || "User ID"} {/* Display user ID */}
          </p>
        </div>
        <div className="w-9 h-9  bg-white border border-secondary rounded-full overflow-hidden shadow-md cursor-pointer hover:bg-gray-100 transition duration-300">
          <img
            src={logo} // Profile picture from assets
            alt="profile"
            className="w-full h-full object-cover "
          />
        </div>
      </div>
    </header>
  );
}