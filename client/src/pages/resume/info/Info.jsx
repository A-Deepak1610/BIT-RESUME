import React, { useState } from "react";
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
  Link,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";

export default function Info() {
  const navigate = useNavigate();
  const SkillSet = [
    "Python",
    "React",
    "Go",
    "Pythrouch",
    "JavaScript",
    "Node.js",
    "CSS3",
  ];
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const SidebarContent = () => (
    <div className=" h-full font-sans font-semibold px-4 bg-white py-3 overflow-y-auto">
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
        <h2 className="text-xl font-semibold text-primary mt-2">Selva</h2>
        <p className="text-gray-800 text-xs text-center mt-1 px-2">
          Department of Computer Science and Engineering
        </p>
      </div>

      {/* Basic Info Section */}
      <div className="grid grid-cols-2 gap-x-4 mb-6">
        {/* Labels */}
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
        {/* Values */}
        <div className="space-y-2 text-primary font-medium text-sm">
          <div>01</div>
          <div>7376242AD136</div>
          <div>2024 to 2028</div>
          <div>Full Stack</div>
        </div>
      </div>

      <div className="border-b border-gray-300 mb-6" />
      
      {/* Additional Information */}
      <div className="mb-6">
        <h1 className="text-primary text-sm font-semibold mb-3">
          ADDITIONAL INFORMATION
        </h1>
        <div className="grid grid-cols-2 gap-x-4">
          {/* Labels */}
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
              <Link size={15} className="mr-2 flex-shrink-0" /> Personal
            </div>
          </div>
          {/* Values */}
          <div className="space-y-2 text-primary font-medium text-sm overflow-hidden">
            <div className="truncate">+91 6380899737</div>
            <div className="truncate">email@gmail.com</div>
            <div className="truncate">github.com/selva</div>
            <div className="truncate">linkedin.com</div>
            <div className="truncate">portfolio.com</div>
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
    </div>
  );

  return (
    <>
      {/* Mobile Drawer */}
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
        <SidebarContent />
      </Drawer>

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Header */}
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

        {/* Desktop Sidebar */}
        <div className="w-[280px] hidden lg:block shadow-md h-screen">
          <SidebarContent />
        </div>

        {/* Main Content Area - Add your content here */}
        <div className="flex-1  bg-gray-50">
          {/* Your main content goes here */}
        </div>
      </div>
    </>
  );
}