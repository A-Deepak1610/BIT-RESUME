import React, { useState } from "react";
import { Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Award,
//   Briefcase,
  BookOpen,
  Users,
  Calendar,
//   ExternalLink,
//   Search,
  TrendingUp,
  FileText,
//   Clock,
//   MapPin,
  Building,
//   GraduationCap,
//   Download,
//   Plus,
//   Loader2,
  Globe,
  Mic,
  Newspaper,
  Monitor,
  ClipboardCheck,
  UserCheck,
  Plane,
//   Star,
  Video,
  PenTool,
} from "lucide-react";

export default function UploadModel({ open, handleClose }) {
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();

  const items = [
    { 
        id: "newsletter", 
        label: "Newsletter", 
        desc: "Upload department or research newsletters",
        icon: Newspaper 
    },
    { 
        id: "econtent", 
        label: "E-Content", 
        desc: "Upload developed e-content details", 
        icon: Monitor
    },
    { 
        id: "eventsAttended", 
        label: "Events Attended", 
        desc: "Workshops, FDPs, and conferences attended", 
        icon: Users
    },
    { 
        id: "eventsOrganized", 
        label: "Events Organized", 
        desc: "Details of events you have organized", 
        icon: Calendar
    },
    { 
        id: "examiner", 
        label: "External Examiner", 
        desc: "Examiner roles in other institutions", 
        icon: ClipboardCheck
    },
    { 
        id: "reviewer", 
        label: "Journal Reviewer", 
        desc: "Journal review contributions", 
        icon: PenTool
    },
    { 
        id: "guestLecture", 
        label: "Guest Lectures", 
        desc: "Guest lectures delivered at other institutions", 
        icon: Mic
    },
    { 
        id: "internationalVisit", 
        label: "International Visits", 
        desc: "International academic visits and exchanges", 
        icon: Plane
    },
    { 
        id: "awards", 
        label: "Awards", 
        desc: "Honors and awards received", 
        icon: Trophy
    },
    { 
        id: "onlineCourse", 
        label: "Online Courses", 
        desc: "Courses completed on MOOC platforms", 
        icon: Video
    },
    { 
        id: "papers", 
        label: "Papers", 
        desc: "Research papers presented or published", 
        icon: FileText
    },
    { 
        id: "resourcePerson", 
        label: "Resource Person", 
        desc: "Served as resource person for events", 
        icon: UserCheck
    },
  ];

  const handleNavigateToForm = (type) => {
    // Navigate to a generic form page with the type as a parameter
    navigate(`/faculty/achievements/form/${encodeURIComponent(type)}`);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[90%] max-w-[800px] max-h-[90vh] flex flex-col outline-none">
        <div className="bg-[#e2eefe] rounded-t-lg p-6 pb-4">
          <div className="flex justify-center mb-2">
            <div className="px-4 py-1 rounded-[15px] bg-[#dbeafe]">
              <p className="text-center text-lg font-semibold text-[#3371ea]">
                Add Achievement
              </p>
            </div>
          </div>
          <h2 className="text-center text-xl font-bold text-[#3371ea] mb-2">
            Select the type of achievement
          </h2>
          <p className="text-center text-xs text-gray-500">
            Choose the appropriate category to add your record
          </p>
        </div>

        <div className="p-6 pt-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {items.map((item) => {
                const Icon = item.icon;
                return (
              <div
                key={item.id}
                className={`group border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  selectedType === item.label
                    ? "border-blue-500 bg-blue-50 shadow-md hover:scale-105 "
                    : "border-gray-200 hover:border-blue-300 hover:shadow-sm hover:scale-105 hover:bg-[#eff6ff]"
                }`}
                onClick={() => setSelectedType(item.label)}
              >
                <div className="flex flex-row gap-3 items-center">
                  <div className={`p-2 rounded-[50%] transition-colors ${
                      selectedType === item.label
                        ? "bg-[#265ee1] text-white"
                        : "bg-[#f3f4f6] text-black group-hover:bg-[#e5edfd]"
                    }`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-sm text-gray-800">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
        <div className="p-6 pt-0 border-t border-gray-100 mt-auto bg-white rounded-b-lg">
          <button
            className={`w-full py-2.5 rounded-md text-white font-medium shadow-sm active:scale-[0.99] transition-all ${
              selectedType
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-blue-200"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!selectedType}
            onClick={() => {
              if (selectedType) {
                handleNavigateToForm(selectedType);
                handleClose();
              }
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
}
