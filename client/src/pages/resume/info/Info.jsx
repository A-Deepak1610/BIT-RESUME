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
  const expertiseAreas = [
    "FULL STACK",
    "MACHINE LEARNING",
    // "CYBER SECURITY",
    // "UI UX",
    // "DATA SCIENCE",
    // "BLOCKCHAIN",
    // "DSA",
  ];
  
  const [open, setOpen] = useState(false);
  
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // Sidebar content component - reused in both drawer and desktop view
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
      <div className="flex mb-6">
        <div className="w-2/5 space-y-2 text-gray-900 text-sm">
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
        <div className="w-2/5 ml-2 space-y-2 text-primary font-medium text-sm">
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
        <div className="flex">
          <div className="w-2/5 space-y-2 text-gray-800 text-sm">
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
          <div className="w-3/5 space-y-2 text-primary font-medium text-sm overflow-hidden">
            <div className="truncate">+91 6380899737</div>
            <div className="truncate">email@gmail.com</div>
            <div className="truncate">github.com/selva</div>
            <div className="truncate">linkedin.com</div>
            <div className="truncate">portfolio.com</div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-300 mb-6" />

      {/* Area of expertise */}
      <div>
        <h1 className="text-primary text-sm font-semibold mb-3">
          AREAS OF EXPERTISE
        </h1>
        <div className="ml-2 relative max-h-[30vh] overflow-y-auto pr-2">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          {expertiseAreas.map((area, index) => (
            <div
              key={index}
              className="flex items-center mb-3 relative pl-4"
            >
              <div className="absolute left-0 top-[0.6rem] w-3 h-0.5 bg-gray-300"></div>
              <div className="text-black text-sm font-medium">
                {area}
              </div>
            </div>
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