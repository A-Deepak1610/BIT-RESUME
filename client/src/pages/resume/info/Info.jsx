import React, { useState, useEffect } from "react"; // Added useEffect
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import logo from "../../../assets/logo_bit.jpg";
import Drawer from "@mui/material/Drawer";
import {
  Trophy,
  User,
  Network,
  BookOpen,
  Phone,
  MapPin ,
  Linkedin,
  Github,
  Mail,
  Download,
} from "lucide-react";
import useAuth from "../../../store/UseAuth";

export default function Info(props) {
  const { rollno, name } = useAuth();
  const Student_rollno = props.rollno || rollno;
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  // State to hold the fetched profile information
  const [profileData, setProfileData] = useState(null);

  const SkillSet = [
    "Java",
    "React",
    "Go",
    "Mysql",
    "JavaScript",
    "Node.js",
    "CSS3",
  ];

  // Fetch profile data when the component mounts or rollno changes
  useEffect(() => {
    const getProfileInfo = async () => {
      if (!Student_rollno) return;
      try {
        const response = await fetch(
          `http://localhost:6001/api/header/getprofile/${Student_rollno}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          setProfileData(result.data);
        } else {
          console.error("Failed to fetch profile info");
          setProfileData({}); // Set to empty object on failure to prevent errors
        }
      } catch (error) {
        console.error("Error fetching profile info:", error);
        setProfileData({}); // Set to empty object on error
      }
    };
    getProfileInfo();
  }, [Student_rollno]); // Dependency array ensures fetch runs when rollno changes

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // Sidebar component now accepts profile as a prop
  const SidebarContent = ({ profile }) => {
    // Show a loading state while data is being fetched
    if (!profile) {
      return <div className="p-4 text-center">Loading profile...</div>;
    }

    return (
      <div className="h-full font-sans font-semibold px-4 bg-white py-3 overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex items-center text-primary mb-4">
          <ArrowBackIcon
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer mr-2"
          />
          <h1 className="text-lg font-bold">BIT Resume</h1>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="profile"
            className="rounded-full w-20 h-20 object-cover"
          />
          <h2 className="text-xl font-semibold text-primary mt-2">{name}</h2>
          <p className="text-gray-800 text-xs text-center mt-1 px-2">
            Department of Computer Science and Engineering
          </p>
        </div>

        {/* Basic Info Section */}
        <div className="grid grid-cols-2 gap-x-4 mb-6">
          <div className="space-y-2 text-gray-900 text-sm">
            <div className="flex items-center text-[#dfb400]">
              <Trophy size={15} className="mr-2 flex-shrink-0" /> Group Rank
            </div>
            <div className="flex items-center">
              <User size={15} className="mr-2 flex-shrink-0" /> Register No
            </div>
            <div className="flex items-center">
              <BookOpen size={15} className="mr-2 flex-shrink-0" /> Batch
            </div>
            <div className="flex items-center">
              <Network size={15} className="mr-2 flex-shrink-0" /> Domain
            </div>
          </div>
          <div className="space-y-2 text-primary font-medium text-sm">
            <div>01</div>
            <div>{Student_rollno}</div>
            <div>{profile.batch}</div>
            {/* Mapped Data */}
            <div>{profile.domain || "Not specified"}</div>
          </div>
        </div>

        <div className="border-b border-gray-300 mb-6" />

        {/* Additional Information */}
        <div className="mb-6">
          <h1 className="text-primary text-sm font-semibold mb-3">
            ADDITIONAL INFORMATION
          </h1>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="space-y-2 text-gray-800 text-sm">
              <div className="flex items-center">
                <Phone size={15} className="mr-2 flex-shrink-0" /> Phone
              </div>
              <div className="flex items-center">
                <Mail size={15} className="mr-2 flex-shrink-0" /> Email
              </div>
              <div className="flex items-center">
                <Github size={15} className="mr-2 flex-shrink-0" /> Git Hub
              </div>
              <div className="flex items-center">
                <Linkedin size={15} className="mr-2 flex-shrink-0" /> LinkedIn
              </div>
              <div className="flex items-center">
                <MapPin  size={15} className="mr-2 flex-shrink-0" /> Location
              </div>
            </div>
            {/* Mapped Data */}
            <div className="space-y-2 text-primary font-medium text-sm overflow-hidden">
              <div className="truncate">
                {profile.phone ? `+91 ${profile.phone}` : "Not specified"}
              </div>
              <div className="truncate">{profile.user_email}</div>
              <div className="truncate"><a href={profile.github || "Not specified"} target="blank">{profile.github}</a></div>
              <div className="truncate"><a href={profile.linkedin} target="blank">{profile.linkedin || "Not specified"}</a></div>
              <div className="truncate">{profile.location || "Not specified"}</div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-300 mb-6" />

        {/* Areas of Expertise */}
        <div>
          <h1 className="text-primary text-sm font-semibold mb-3">
            AREAS OF EXPERTISE
          </h1>
          <div className="flex flex-wrap gap-2">
            {SkillSet.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-gray-300 transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <button
            onClick={() => navigate("/downloadResume")}
            className="group cursor-pointer bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg mt-2 px-4 py-2 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <span className="group-hover:mr-2 transition-all duration-300">
              Download Resume
            </span>
            <Download
              size={20}
              className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300"
            />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          width: 280,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
          },
        }}
      >
        {/* Pass the fetched data as a prop */}
        <SidebarContent profile={profileData} />
      </Drawer>

      <div className="flex flex-col lg:flex-row">
        <div className="flex lg:hidden">
          <div className="w-full flex h-16 items-center justify-between text-primary bg-white shadow-md px-4">
            <div className="flex items-center">
              <ArrowBackIcon
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer mr-2"
              />
              <h1 className="text-lg font-bold">BIT Resume</h1>
            </div>
            <img
              src={logo}
              onClick={toggleDrawer(true)}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
            />
          </div>
        </div>

        <div className="w-[280px] hidden lg:block shadow-md h-screen">
          {/* Pass the fetched data as a prop */}
          <SidebarContent profile={profileData} />
        </div>

        <div className="flex-1 bg-gray-50"></div>
      </div>
    </>
  );
}