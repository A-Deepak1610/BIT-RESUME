import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Plus,
  Download,
  Search,
  Loader2,
  FileText,
} from "lucide-react";
import useAuth from "../../../store/UseAuth";
import OutsideWorldModal from "./OutsideWorldModal";

const API_URL = import.meta.env.VITE_API_URL;

// Helper component for status badge
const StatusBadge = ({ status }) => {
  const statusLower = (status || "pending").toLowerCase();
  const statusConfig = {
    verified: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      label: "Verified",
    },
    approved: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      label: "Approved",
    },
    rejected: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "Rejected",
    },
    pending: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      label: "Pending",
    },
  };
  const config = statusConfig[statusLower] || statusConfig.pending;
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {config.label}
    </span>
  );
};

// Helper component for remarks
const RemarksBox = ({ remarks }) => {
  if (!remarks) return null;
  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-xs text-gray-500 font-medium mb-1">Admin Remarks:</p>
      <p className="text-sm text-gray-700">{remarks}</p>
    </div>
  );
};

export default function OutsideWorldInteraction() {
  const [activeTab, setActiveTab] = useState("mou");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [interactions, setInteractions] = useState({
    mou: [],
    iprVisit: [],
    consultancy: [],
    externalVipVisit: [],
    facultyIndustryProjects: [],
    coe: [],
    facultyTrainedByIndustry: [],
    industryAdvisors: [],
    laboratoryDevelopedByIndustry: [],
    studentsIndustrialVisit: [],
    technicalSocieties: [],
    trainingToIndustry: [],
    professionalBodyMembership: [],
  });

  const { user, rollno } = useAuth();

  // Fetch functions (to be implemented with actual API endpoints)
  const fetchMou = async () => {
    // TODO: Implement API call
    return [];
  };

  const fetchIprVisit = async () => {
    // TODO: Implement API call
    return [];
  };

  const fetchConsultancy = async () => {
    // TODO: Implement API call
    return [];
  };

  const fetchExternalVipVisit = async () => {
    // TODO: Implement API call
    return [];
  };

  const fetchFacultyIndustryProjects = async () => {
    // TODO: Implement API call
    return [];
  };

  const fetchCoe = async () => {
    // TODO: Implement API call
    return [];
  };

  const fetchFacultyTrainedByIndustry = async () => {
    // TODO: Implement API call
    return [];
  };

  const fetchIndustryAdvisors = async () => {
    // TODO: Implement API call
    return [];
  };

  const fetchLaboratoryDevelopedByIndustry = async () => {
    // TODO: Implement API call
    return [];
  };

  const fetchStudentsIndustrialVisit = async () => {
    // TODO: Implement API call
    return [];
  };

  const fetchTechnicalSocieties = async () => {
    // TODO: Implement API call
    return [];
  };

  const fetchTrainingToIndustry = async () => {
    // TODO: Implement API call
    return [];
  };

  const fetchProfessionalBodyMembership = async () => {
    // TODO: Implement API call
    return [];
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [
          mouData,
          iprVisitData,
          consultancyData,
          externalVipVisitData,
          facultyIndustryProjectsData,
          coeData,
          facultyTrainedByIndustryData,
          industryAdvisorsData,
          laboratoryDevelopedByIndustryData,
          studentsIndustrialVisitData,
          technicalSocietiesData,
          trainingToIndustryData,
          professionalBodyMembershipData,
        ] = await Promise.all([
          fetchMou(),
          fetchIprVisit(),
          fetchConsultancy(),
          fetchExternalVipVisit(),
          fetchFacultyIndustryProjects(),
          fetchCoe(),
          fetchFacultyTrainedByIndustry(),
          fetchIndustryAdvisors(),
          fetchLaboratoryDevelopedByIndustry(),
          fetchStudentsIndustrialVisit(),
          fetchTechnicalSocieties(),
          fetchTrainingToIndustry(),
          fetchProfessionalBodyMembership(),
        ]);

        setInteractions({
          mou: mouData,
          iprVisit: iprVisitData,
          consultancy: consultancyData,
          externalVipVisit: externalVipVisitData,
          facultyIndustryProjects: facultyIndustryProjectsData,
          coe: coeData,
          facultyTrainedByIndustry: facultyTrainedByIndustryData,
          industryAdvisors: industryAdvisorsData,
          laboratoryDevelopedByIndustry: laboratoryDevelopedByIndustryData,
          studentsIndustrialVisit: studentsIndustrialVisitData,
          technicalSocieties: technicalSocietiesData,
          trainingToIndustry: trainingToIndustryData,
          professionalBodyMembership: professionalBodyMembershipData,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const tabs = [
    { id: "mou", label: "MoU", icon: Handshake },
    { id: "iprVisit", label: "IPR Visit", icon: Lightbulb },
    { id: "consultancy", label: "Consultancy", icon: Briefcase },
    { id: "externalVipVisit", label: "External VIP Visit", icon: Users },
    {
      id: "facultyIndustryProjects",
      label: "Faculty Industry Projects",
      icon: Factory,
    },
    { id: "coe", label: "COE", icon: Award },
    {
      id: "facultyTrainedByIndustry",
      label: "Faculty Trained by Industry",
      icon: GraduationCap,
    },
    { id: "industryAdvisors", label: "Industry Advisors", icon: UserCheck },
    {
      id: "laboratoryDevelopedByIndustry",
      label: "Lab by Industry",
      icon: Microscope,
    },
    {
      id: "studentsIndustrialVisit",
      label: "Students Industrial Visit",
      icon: Plane,
    },
    { id: "technicalSocieties", label: "Technical Societies", icon: Network },
    { id: "trainingToIndustry", label: "Training to Industry", icon: BookOpen },
    {
      id: "professionalBodyMembership",
      label: "Professional Membership",
      icon: BadgeCheck,
    },
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      );
    }

    const currentData = interactions[activeTab] || [];
    const filteredData = currentData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );

    if (filteredData.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No records found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search"
              : "Start by adding your first record"}
          </p>
        </div>
      );
    }

    // Render different card layouts based on active tab
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                {item.title || item.name || `Record ${index + 1}`}
              </h3>
              <StatusBadge status={item.status} />
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {Object.entries(item).map(([key, value]) => {
                if (key === "status" || key === "remarks" || !value)
                  return null;
                return (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                );
              })}
            </div>
            <RemarksBox remarks={item.remarks} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Outside World Interaction
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Manage your industry collaborations, visits, and professional
                engagements
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => setOpenModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center sm:justify-start"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center sm:justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Scrollable */}
        <div className="mb-8">
          <nav className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex cursor-pointer items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-1.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Modal */}
      <OutsideWorldModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
      />
    </div>
  );
}
