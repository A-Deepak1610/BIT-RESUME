import React, { useState } from "react";
import { Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Handshake,
  Lightbulb,
  Briefcase,
  Users,
  Factory,
  Award,
  GraduationCap,
  UserCheck,
  Microscope,
  Plane,
  Network,
  BookOpen,
  BadgeCheck,
} from "lucide-react";

export default function OutsideWorldModal({ open, handleClose }) {
  const [selectedType, setSelectedType] = useState(null);

  const navigate = useNavigate();

  const items = [
    { id: "mou", label: "MoU", desc: "Memorandum of Understanding with institutions", icon: Handshake },
    { id: "iprVisit", label: "IPR Visit", desc: "Intellectual Property Rights visits and activities", icon: Lightbulb },

    { id: "externalVipVisit", label: "External VIP Visit", desc: "Visits by external VIPs and dignitaries", icon: Users },
    { id: "facultyIndustryProjects", label: "Faculty Industry Projects", desc: "Faculty members' industry collaboration projects", icon: Factory },
    { id: "coe", label: "COE", desc: "Centre of Excellence initiatives", icon: Award },
    { id: "facultyTrainedByIndustry", label: "Faculty Trained by Industry", desc: "Training programs attended from industry", icon: GraduationCap },
    { id: "industryAdvisors", label: "Industry Advisors", desc: "Industry advisory board members", icon: UserCheck },
    { id: "laboratoryDevelopedByIndustry", label: "Laboratory by Industry", desc: "Laboratories developed with industry support", icon: Microscope },
    { id: "studentsIndustrialVisit", label: "Students Industrial Visit", desc: "Industrial visits organized for students", icon: Plane },
    { id: "technicalSocieties", label: "Technical Societies", desc: "Technical societies and chapter memberships", icon: Network },
    { id: "trainingToIndustry", label: "Training to Industry", desc: "Training programs conducted for industry personnel", icon: BookOpen },
    { id: "professionalBodyMembership", label: "Professional Membership", desc: "Professional body and association memberships", icon: BadgeCheck },
  ];

  const handleNavigateToForm = (type) => {
    const routeMap = {
      "MoU": "/faculty/outside-world/mou",
      "IRP Visit": "/faculty/outside-world/irp-visit",

      "External VIP Visit": "/faculty/outside-world/external-vip-visit",
      "Faculty Industry Projects": "/faculty/outside-world/faculty-industry-projects",
      "COE": "/faculty/outside-world/coe",
      "Faculty Trained by Industry": "/faculty/outside-world/faculty-trained-by-industry",
      "Industry Advisors": "/faculty/outside-world/industry-advisors",
      "Laboratory by Industry": "/faculty/outside-world/laboratory-by-industry",
      "Students Industrial Visit": "/faculty/outside-world/students-industrial-visit",
      "Technical Societies": "/faculty/outside-world/technical-societies",
      "Training to Industry": "/faculty/outside-world/training-to-industry",
      "Professional Membership": "/faculty/outside-world/professional-membership",
    };

    if (routeMap[type]) {
      navigate(routeMap[type]);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        setSelectedType(null);
      }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[90%] max-w-[900px] max-h-[90vh] flex flex-col outline-none">

        {/* Header */}
        <div className="bg-[#e2eefe] rounded-t-lg p-6 pb-4">
          <div className="flex justify-center mb-2">
            <div className="px-4 py-1 rounded-[15px] bg-[#dbeafe]">
              <p className="text-center text-lg font-semibold text-[#3371ea]">
                Add Outside World Interaction Record
              </p>
            </div>
          </div>
          <h2 className="text-center text-xl font-bold text-[#3371ea] mb-2">
            Select the type of interaction
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
                  className={`group border rounded-lg p-3 cursor-pointer transition-all duration-200 ${selectedType === item.label
                      ? "border-blue-500 bg-blue-50 shadow-md hover:scale-105"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-sm hover:scale-105 hover:bg-[#eff6ff]"
                    }`}
                  onClick={() =>
                    setSelectedType(
                      selectedType === item.label ? null : item.label
                    )
                  }
                >
                  <div className="flex flex-row gap-3 items-center">
                    <div
                      className={`p-2 rounded-[50%] transition-colors ${selectedType === item.label
                        ? "bg-[#265ee1] text-white"
                        : "bg-[#f3f4f6] text-black group-hover:bg-[#e5edfd]"
                        }`}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-medium text-sm text-gray-800">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 mt-auto bg-blue-100 rounded-b-lg">
          <button
            className={`w-full py-2.5 shadow-lg shadow-gray-400 border border-gray-400 rounded-md text-white font-medium active:scale-[0.99] transition-all ${selectedType
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-blue-200"
                : "bg-gray-300 cursor-not-allowed"
              }`}
            disabled={!selectedType}
            onClick={() => {
              if (selectedType) {
                console.log("Navigating to:", selectedType);
                handleNavigateToForm(selectedType);
                handleClose();
                setSelectedType(null);
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

