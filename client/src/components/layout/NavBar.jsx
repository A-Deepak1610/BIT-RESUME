import React, { useState, useRef, useMemo, useEffect } from "react";
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
import logo_main from "../../assets/bit_logo.png";
import useAuth from "../../store/UseAuth";
import { User, Phone, Github, Linkedin, MapPin, Briefcase } from 'lucide-react';
import GroupWorkOutlinedIcon from '@mui/icons-material/GroupWorkOutlined';
import ApprovalOutlinedIcon from '@mui/icons-material/ApprovalOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
const InputField = ({ icon, name, placeholder, value, onChange, error }) => (
    <div>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            <input
                type="text"
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                    error 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-indigo-500'
                }`}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
            />
        </div>
        {error && <p id={`${name}-error`} className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

// --- All-in-One Profile Update Card with Validation ---
const ProfileUpdateCard = ({ user, onClose, onLogout }) => {
    const { rollno } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL
    const [formData, setFormData] = useState({ domain: '', phone: '', github: '', linkedin: '', location: '' });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // --- Validation Logic ---
    const validate = (fieldValues = formData) => {
        const tempErrors = {};
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        const phoneRegex = /^\d{10}$/;

        if (!fieldValues.domain) tempErrors.domain = "Domain is required.";
        if (!fieldValues.phone) tempErrors.phone = "Phone number is required.";
        else if (!phoneRegex.test(fieldValues.phone)) tempErrors.phone = "Enter a valid 10-digit phone number.";
        
        if (!fieldValues.github) tempErrors.github = "GitHub URL is required.";
        else if (!urlRegex.test(fieldValues.github)) tempErrors.github = "Enter a valid URL.";
        
        if (!fieldValues.linkedin) tempErrors.linkedin = "LinkedIn URL is required.";
        else if (!urlRegex.test(fieldValues.linkedin)) tempErrors.linkedin = "Enter a valid URL.";
        
        if (!fieldValues.location) tempErrors.location = "Location is required.";
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // --- Data Fetching and Mapping ---
    useEffect(() => {
        const getProfileInfo = async () => {
            if (!rollno) return;
            try {
                const response = await fetch(`${API_URL}api/header/getprofile/-`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (response.ok) {
                    const result = await response.json();
                    const profileData = result.data; // Correctly access the nested data object
                    setFormData({
                        domain: profileData.domain || '',
                        phone: profileData.phone || '',
                        github: profileData.github || '', // Correct key
                        linkedin: profileData.linkedin || '', // Correct key
                        location: profileData.location || ''
                    });
                } else {
                    console.error("Failed to fetch profile info");
                }
            } catch (error) {
                console.error("Error fetching profile info:", error);
            }
        };
        getProfileInfo();
    }, [rollno]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        validate(newFormData); // Validate on every change for real-time feedback
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!validate()) return; // Stop if form is not valid
        setIsSaving(true);
        try {
            const response = await fetch(`${API_URL}api/header/updateprofile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            if (response.ok) {
                // alert("Profile updated successfully!");
                onClose();
            } else {
                const errorData = await response.json();
                alert(`Update failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-fade-in-down">
            <div className="p-4 border-b border-gray-200">
                <p className="font-semibold text-gray-800 truncate">Update your profile</p>
                <p className="text-sm text-black font-bold truncate">{rollno || "User ID"}</p>
            </div>
            <form onSubmit={handleUpdateProfile}>
                <div className="p-4 space-y-4">
                    <InputField icon={<Briefcase size={16} className="text-gray-400" />} name="domain" placeholder="Your Domain" value={formData.domain} onChange={handleChange} error={errors.domain} />
                    <InputField icon={<Phone size={16} className="text-gray-400" />} name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} error={errors.phone} />
                    <InputField icon={<Github size={16} className="text-gray-400" />} name="github" placeholder="GitHub URL" value={formData.github} onChange={handleChange} error={errors.github} />
                    <InputField icon={<Linkedin size={16} className="text-gray-400" />} name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} error={errors.linkedin} />
                    <InputField icon={<MapPin size={16} className="text-gray-400" />} name="location" placeholder="Location" value={formData.location} onChange={handleChange} error={errors.location} />
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-between items-center">
                    <button type="button" onClick={onClose} className="text-sm cursor-pointer text-gray-600 hover:text-red-600 font-medium">Close</button>
                    <button type="submit" disabled={isSaving || Object.keys(errors).length > 0} className="px-4 py-2 cursor-pointer bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 font-medium disabled:bg-indigo-300 disabled:cursor-not-allowed">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// --- NavBar Component (No changes needed below this line) ---
export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const profileCardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (profileCardRef.current && !profileCardRef.current.contains(event.target)) {
            setIsProfileCardOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeItem = useMemo(() => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/faculty-dashboard" || path === "/admin-dashboard") return "dashboard";
    if (path === "/uploadview") return "upload";
    if (path === "/resume") return "resume";
    if (path.includes("/Achivement/ActivityMaster")) return "activityMaster";
    if (path.includes("/Achivement/ActivityLogger")) return "activityLogger";
    if (path === "/faculty-approval") return "projectApprovals";
    if (path === "/faculty-verification") return "certificateVerifications";
    if (path.includes("/faculty-approval") || path.includes("/faculty-verification")) return "studentRequests";
    if (path === "/faculty-manageActivity") return "manageActivities";
    if (path === "/faculty-studentperformance") return "studentPerformance";
    if (path === "/faculty-resumeDraft") return "resumeDrafts";
    if (path === "/admin-addactivity") return "addactivity";
    if (path === "/admin-studentsPerformance") return "studentsPerformance";
    if (path === "/admin-AddUsers") return "addusers";
    if (path === "/admin-reports") return "admin-reports";
    if (path === "/faculty/uploadview") return "faculty/uploadview";
     if(path == "/faculty/achievements/form/Newsletter") return "faculty/uploadview";
    if(path == "/faculty/achievements/form/E-Content") return "faculty/uploadview";
    if(path == "/faculty/achievements/form/Events%20Attended") return "faculty/uploadview";
    if(path == "/faculty/achievements/form/Events%20Organized") return "faculty/uploadview";
    if(path == "/faculty/achievements/form/External%20Examiner") return "faculty/uploadview";
    if(path == "/faculty/achievements/form/Journal%20Reviewer") return "faculty/uploadview";
    if(path == "/faculty/achievements/form/Guest%20Lectures") return "faculty/uploadview";
    if(path == "/faculty/achievements/form/International%20Visits") return "faculty/uploadview";
    if(path == "/faculty/achievements/form/Awards") return "faculty/uploadview";
    if(path == "/faculty/achievements/form/Online%20Courses") return "faculty/uploadview";
    if(path == "/faculty/achievements/form/Papers") return "faculty/uploadview";
    if(path == "/faculty/achievements/form/Resource%20Person") return "faculty/uploadview";
    return "";
  }, [location.pathname]);

  const [expandedMenus, setExpandedMenus] = useState({
    studentRequests: false,
  });

  const studentRequestsRef = useRef(null);

  const handleItemClick = (itemName) => {};

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

  const renderDrawerContent = () => {
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
                  setOpen(false);
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
              {/* <li
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
              </li> */}
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
        <img src={logo_main} alt="LOGO" className="w-7 h-7 rounded-full mr-2" />
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
  const {rollno,name}=useAuth();
  return (
    <>
      <header className="h-14  bg-white shadow-md flex items-center justify-between ">
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
        <div className="flex items-center text-2xl font-semibold text-primary lg:w-55 h-full justify-center lg:shadow-md">
          <img
            src={logo_main}
            alt="LOGO"
            className="w-12 h-15 rounded-full mr-2 mt-5 hidden lg:block"
          />
          <div className="block lg:hidden mb-1 ml-2 cursor-pointer">
            <DehazeIcon onClick={toggleDrawer(true)} />
          </div>
          <p className="lg:ml-0 ml-2">BIT RESUME</p>
        </div>
        <div className="flex items-center gap-4 px-6">
          {/* <div
            onClick={handleDarkMode}
            className="w-8 h-8 sm:flex hidden bg-white border border-secondary rounded-md md:flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100 transition duration-300"
          >
            <DarkModeIcon className="text-secondary" />`
          </div> */}
          <div className="w-8 h-8 sm:flex hidden bg-white border border-secondary rounded-md md:flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100 transition duration-300">
            <NotificationsNoneIcon className="text-secondary" />
          </div>
          <div className="relative" ref={profileCardRef}>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setIsProfileCardOpen(prev => !prev)}
            >
                <div className="md:flex flex-col sm:flex hidden items-end justify-center gap-1">
                    <p className="font-semibold text-[17px] leading-none">{name || "User"}</p>
                    <p className="text-xs text-gray-600 leading-none font-medium">{rollno || "User ID"}</p>
                </div>
                <div className="w-9 h-9 bg-white border border-secondary rounded-full overflow-hidden shadow-md">
                    <img src={logo} alt="profile" className="w-full h-full object-cover" />
                </div>
            </div>
            {isProfileCardOpen && (
                <ProfileUpdateCard 
                    user={user}
                    onLogout={handleLogout}
                    onClose={() => setIsProfileCardOpen(false)}
                />
            )}
          </div>
        </div>
      </header>
    </>
  );
}