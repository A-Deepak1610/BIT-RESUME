import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Calendar,
  ExternalLink,
  MapPin,
  X,
  Phone,
  Mail,
  Globe,
  Building2,
  Eye
} from "lucide-react";
import useAuth from "../../../store/UseAuth";

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
    initiated: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      label: "Initiated",
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
  const navigate = useNavigate();
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [selectedLaboratory, setSelectedLaboratory] = useState(null);
  const [showLaboratoryModal, setShowLaboratoryModal] = useState(false);
  const [interactions, setInteractions] = useState({
    mou: [],
    irpVisit: [],
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

  // State for modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  const fetchData = async (endpoint, key, basePath = 'api/faculty') => {
    try {
      const response = await axios.get(`${API_URL}api/faculty/${endpoint}`, { withCredentials: true });
      return response.data[key] || response.data.data || [];
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      return [];
    }
  };

  // Fetch industry advisors separately since it uses a different endpoint
  const fetchIndustryAdvisors = async () => {
    try {
      const response = await axios.get(`${API_URL}api/owi/industryAdvisor`, {
        withCredentials: true,
      });
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching industry advisors:", error);
      return [];
    }
  };

  // Fetch laboratory by industry
  const fetchLaboratoryByIndustry = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/owi/laboratoryByIndustry`,
        {
          withCredentials: true,
        },
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching laboratory by industry:", error);
      return [];
    }
  };

  // Fetch students industrial visit
  const fetchStudentsIndustrialVisit = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/owi/studentsIndustrialVisit`,
        {
          withCredentials: true,
        },
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching students industrial visit:", error);
      return [];
    }
  };

  // Fetch technical societies
  const fetchTechnicalSocieties = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/owi/technicalSocieties`,
        {
          withCredentials: true,
        },
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching technical societies:", error);
      return [];
    }
  };

  // Fetch training to industry
  const fetchTrainingToIndustry = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/owi/trainingToIndustry`,
        {
          withCredentials: true,
        },
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching training to industry:", error);
      return [];
    }
  };

  // Fetch professional membership
  const fetchProfessionalMembership = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/owi/professionalMembership`,
        {
          withCredentials: true,
        },
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching professional membership:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [
          mou,
          irpVisit,
          consultancy,
          externalVipVisit,
          facultyIndustryProjects,
          coe,
          facultyTrainedByIndustry,
          industryAdvisors,
          laboratoryDevelopedByIndustry,
          studentsIndustrialVisit,
          technicalSocieties,
          trainingToIndustry,
          professionalBodyMembership
        ] = await Promise.all([
          fetchData("mouGet", "mous"),
          fetchData("irpVisitGet", "irpVisits"),
          fetchData("consultancyGet", "consultancies"),
          fetchData("externalVipVisitGet", "externalVipVisits"),
          fetchData("industryProjectGet", "industryProjects"),
          fetchData("coeGet", "coes"),
          fetchData("trainedByIndustryGet", "trainedByIndustries"),
          fetchIndustryAdvisors(),
          fetchLaboratoryByIndustry(),
          fetchStudentsIndustrialVisit(),
          fetchTechnicalSocieties(),
          fetchTrainingToIndustry(),
          fetchProfessionalMembership(),
        ]);

        setInteractions(prev => ({
          ...prev,
          mou,
          irpVisit,
          consultancy,
          externalVipVisit,
          facultyIndustryProjects,
          coe,
          facultyTrainedByIndustry,
          industryAdvisors,
          laboratoryDevelopedByIndustry,
          studentsIndustrialVisit,
          technicalSocieties,
          trainingToIndustry,
          professionalBodyMembership
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Helper to open modal
  const openDetailModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };

  const tabs = [
    { id: "mou", label: "MoU", icon: Handshake },
    { id: "irpVisit", label: "IRP Visit", icon: Lightbulb },
    { id: "consultancy", label: "Consultancy", icon: Briefcase },
    { id: "externalVipVisit", label: "External VIP Visit", icon: Users },
    {
      id: "facultyIndustryProjects",
      label: "Industry Projects",
      icon: Factory,
    },
    { id: "coe", label: "COE", icon: Award },
    {
      id: "facultyTrainedByIndustry",
      label: "Trained by Industry",
      icon: GraduationCap,
    },
    { id: "industryAdvisors", label: "Industry Advisors", icon: UserCheck },
    {
      id: "laboratoryDevelopedByIndustry",
      label: "Lab by Industry",
      icon: Microscope,
    },
    { id: "studentsIndustrialVisit", label: "Students Visit", icon: Plane },
    { id: "technicalSocieties", label: "Tech Societies", icon: Network },
    { id: "trainingToIndustry", label: "Training to Industry", icon: BookOpen },
    {
      id: "professionalBodyMembership",
      label: "Prof. Membership",
      icon: BadgeCheck,
    },
  ];

  const renderCard = (item, type) => {
    // Common card wrapper
    const CardWrapper = ({ children, title, subtitle, status }) => (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow relative h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-blue-600 font-medium mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <StatusBadge status={status} />
        </div>
        <div className="flex-1 space-y-3 text-sm text-gray-600 mb-4">
          {children}
        </div>
        <RemarksBox remarks={item.remarks} />
        {(item.signed_mou ||
          item.proof_document ||
          item.consolidated_document ||
          item.report) && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
            {[
              { file: item.signed_mou, label: "MoU" },
              { file: item.proof_document, label: "Proof" },
              { file: item.consolidated_document, label: "Docs" },
              { file: item.report, label: "Report" },
            ].map(
              (doc, idx) =>
                doc.file && (
                  <a
                    key={idx}
                    href={`${API_URL}${doc.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center font-medium bg-blue-50 px-2 py-1 rounded"
                  >
                    <Download className="h-3 w-3 mr-1" /> {doc.label}
                  </a>
                ),
            )}
          </div>
        )}
      </div>
    );

    switch (type) {
      case "mou":
        return (
          <div
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => navigate(`/faculty/outside-world/mou/${item.id}`)}
          >
            <CardWrapper
              title={item.legal_name_of_industry}
              subtitle={`${item.type_of_mou} - ${item.mou_based_on || 'General'}`}
              status={item.verification_status}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="font-medium">Agreement:</span>&nbsp;{new Date(item.date_of_agreement).toLocaleDateString()}
                    {item.duration && <span className="text-gray-500 ml-1">({item.duration})</span>}
                  </p>
                  <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-red-500" /> {item.industry_location}</p>
                  {item.domain_area && <p className="flex items-center"><Briefcase className="h-4 w-4 mr-2 text-gray-500" /> {item.domain_area}</p>}
                  {item.spoc_name && <p className="flex items-center"><Users className="h-4 w-4 mr-2 text-gray-500" /> SPOC: {item.spoc_name}</p>}
                </div>
                <div className="space-y-2">
                  {item.task_id && <p className="text-xs text-gray-500">Task ID: {item.task_id}</p>}
                  {item.type_of_industry && <p><span className="font-medium">Industry Type:</span> {item.type_of_industry}</p>}
                  {item.special_lab && <p><span className="font-medium">Special Lab:</span> {item.special_lab}</p>}
                  {item.purpose_of_mou && <p><span className="font-medium">Purpose:</span> {item.purpose_of_mou}</p>}
                </div>
              </div>

              {/* View Details Button */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {[
                    { file: item.signed_mou, label: "Signed MoU" },
                    { file: item.apex_proof, label: "Apex Proof" },
                  ].map((doc, idx) => doc.file && (
                    <a
                      key={idx}
                      href={`${API_URL}${doc.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center font-medium bg-blue-50 px-2 py-1 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="h-3 w-3 mr-1" /> {doc.label}
                    </a>
                  ))}
                </div>
                <button
                  className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center font-medium bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                  onClick={(e) => { e.stopPropagation(); navigate(`/faculty/outside-world/mou/${item.id}`); }}
                >
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </button>
              </div>
            </CardWrapper>
          </div>
        );
      case "irpVisit":
        return (
          <div
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => navigate(`/faculty/outside-world/irp-visit/${item.id}`)}
          >
            <CardWrapper
              title={item.mou_name || item.purpose_of_visit || "IRP Visit"}
              subtitle={item.mode_of_interaction}
              status={item.verification_status}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    {new Date(item.from_date).toLocaleDateString()} - {new Date(item.to_date).toLocaleDateString()}
                  </p>
                  {item.amount_incurred > 0 && <p className="font-semibold text-green-700">Amount: ₹{item.amount_incurred}</p>}
                  {item.number_of_industry && <p>Industries Visited: {item.number_of_industry}</p>}
                  {item.number_of_faculty && <p>Faculty Count: {item.number_of_faculty}</p>}
                </div>
                <div className="space-y-2">
                  {item.claimed_for_department && <p><strong>Dept:</strong> {item.claimed_for_department}</p>}
                  {item.type_of_approval && <p><strong>Approval:</strong> {item.type_of_approval}</p>}
                  {item.special_lab && <p><strong>Lab:</strong> {item.special_lab}</p>}
                </div>
              </div>

              {item.purpose_of_visit && (
                <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                  <strong>Purpose:</strong> {item.purpose_of_visit}
                </div>
              )}

              {/* Documents Section for IRP */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {[
                    { file: item.apex_proof, label: "Apex Proof" },
                    { file: item.irp_form_signed, label: "Signed Form" },
                    { file: item.consolidated_document, label: "Consolidated Doc" },
                  ].map((doc, idx) => doc.file && (
                    <a
                      key={idx}
                      href={`${API_URL}${doc.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center font-medium bg-blue-50 px-2 py-1 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="h-3 w-3 mr-1" /> {doc.label}
                    </a>
                  ))}
                </div>
                <button
                  className="text-amber-600 hover:text-amber-800 text-xs flex items-center font-medium bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                  onClick={(e) => { e.stopPropagation(); navigate(`/faculty/outside-world/irp-visit/${item.id}`); }}
                >
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </button>
              </div>
            </CardWrapper>
          </div>
        );

      case 'consultancy':
        return (
          <div
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => navigate(`/faculty/outside-world/consultancy/${item.id}`)}
          >
            <CardWrapper
              title={item.consultancy_title || item.organization_name || "Consultancy"}
              subtitle={item.consultancy_type || item.domain}
              status={item.verification_status}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {item.date && (
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  )}
                  {item.amount && <p className="font-semibold text-green-700">Amount: ₹{item.amount}</p>}
                  {item.organization_name && <p><Building2 className="inline h-4 w-4 mr-1 text-gray-500" />{item.organization_name}</p>}
                </div>
                <div className="space-y-2">
                  {item.faculty_name && <p><strong>Faculty:</strong> {item.faculty_name}</p>}
                  {item.department && <p><strong>Department:</strong> {item.department}</p>}
                </div>
              </div>

              {item.description && (
                <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                  <strong>Description:</strong> {item.description}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {item.proof_document && (
                    <a
                      href={`${API_URL}${item.proof_document}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center font-medium bg-blue-50 px-2 py-1 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="h-3 w-3 mr-1" /> Document
                    </a>
                  )}
                </div>
                <button
                  className="text-amber-600 hover:text-amber-800 text-xs flex items-center font-medium bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                  onClick={(e) => { e.stopPropagation(); navigate(`/faculty/outside-world/consultancy/${item.id}`); }}
                >
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </button>
              </div>
            </CardWrapper>
          </div>
        );

      case 'externalVipVisit':
        return (
          <div
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => navigate(`/faculty/outside-world/external-vip-visit/${item.id}`)}
          >
            <CardWrapper
              title={item.event_name}
              subtitle={`${item.designation} - ${item.organization_name}`}
              status={item.verification_status}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-blue-500" /> {new Date(item.start_date).toLocaleDateString()}</p>
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Event Type:</strong> {item.event_type}</p>
                  {item.mobile_number && <p className="text-xs text-gray-500">Contact: {item.mobile_number}</p>}
                </div>
                <div className="space-y-2">
                  {item.guest_belongs_to_industry === "Yes" && <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold">Industry Guest</span>}
                  {item.is_bit_alumni === "Yes" && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold ml-2">Alumni</span>}
                </div>
              </div>

              {item.purpose_of_visit && (
                <div className="mt-3 bg-gray-50 p-2 rounded text-sm">
                  <strong>Purpose:</strong> {item.purpose_of_visit}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {[
                    { file: item.formal_photo, label: "Photo" },
                    { file: item.photo_proof, label: "Proof" },
                    { file: item.approval_letter, label: "Approval" },
                  ].map((doc, idx) => doc.file && (
                    <a key={idx} href={`${API_URL}${doc.file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs flex items-center font-medium bg-blue-50 px-2 py-1 rounded" onClick={(e) => e.stopPropagation()}>
                      <Download className="h-3 w-3 mr-1" /> {doc.label}
                    </a>
                  ))}
                </div>
                <button
                  className="text-teal-600 hover:text-teal-800 text-xs flex items-center font-medium bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors"
                  onClick={(e) => { e.stopPropagation(); navigate(`/faculty/outside-world/external-vip-visit/${item.id}`); }}
                >
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </button>
              </div>
            </CardWrapper>
          </div>
        );
      case "facultyIndustryProjects":
        return (
          <div className="cursor-pointer" onClick={() => openDetailModal(item, 'facultyIndustryProjects')}>
            <CardWrapper
              title={item.project_title}
              subtitle={item.industry_name}
              status={item.verification_status}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-blue-500" /> {new Date(item.start_date).toLocaleDateString()} ({item.duration_months} mo)</p>
                  <p><strong>Type:</strong> {item.type_of_industry}</p>
                  <p><strong>Students:</strong> {item.number_of_students}</p>
                  <p><strong>Faculty:</strong> {item.number_of_faculty}</p>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <p className="font-semibold text-gray-800">Team:</p>
                  <p>{item.faculty} {item.faculty2 && `, ${item.faculty2}`} {item.faculty3 && `, ${item.faculty3}`}</p>
                  <p>{item.student1} {item.student2 && `, ${item.student2}`} {item.student3 && `, ${item.student3}`}</p>
                </div>
              </div>

              {item.outcome && (
                <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                  <strong>Outcome:</strong> {item.outcome}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {[
                    { file: item.industry_project_proof, label: "Proof" },
                  ].map((doc, idx) => doc.file && (
                    <a key={idx} href={`${API_URL}${doc.file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs flex items-center font-medium bg-blue-50 px-2 py-1 rounded" onClick={(e) => e.stopPropagation()}>
                      <Download className="h-3 w-3 mr-1" /> {doc.label}
                    </a>
                  ))}
                </div>
                <button className="text-orange-600 hover:text-orange-800 text-xs flex items-center font-medium bg-orange-50 px-3 py-1.5 rounded-lg">
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </button>
              </div>
            </CardWrapper>
          </div>
        );
      case "coe":
        return (
          <div className="cursor-pointer" onClick={() => openDetailModal(item, 'coe')}>
            <CardWrapper
              title={item.coe_name}
              subtitle={item.domain}
              status={item.verification_status}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><strong>Type:</strong> {item.type_of_coe}</p>
                  <p><strong>Industry:</strong> {item.collaborative_industry1}</p>
                  <p><strong>In-Charge:</strong> {item.faculty_incharge}</p>
                  <p className="text-xs">Area: {item.area_in_sqm} sqm</p>
                </div>
                <div className="space-y-2 border-l pl-4 border-gray-100">
                  <p className="text-xs text-gray-500">Financials:</p>
                  <p>Total: ₹{item.total_amount_incurred}</p>
                  <p>Industry: ₹{item.industry_contribution_with_gst}</p>
                  <p>BIT: ₹{item.bit_contribution}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {[
                    { file: item.syllabus_document, label: "Syllabus" },
                    { file: item.lab_photo, label: "Photo" },
                    { file: item.communication_proof, label: "Comm. Proof" },
                    { file: item.apex_document, label: "Apex" },
                    { file: item.facilities_report, label: "Facilities" },
                    { file: item.utilization_report, label: "Utilization" },
                  ].map((doc, idx) => doc.file && (
                    <a key={idx} href={`${API_URL}${doc.file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs flex items-center font-medium bg-blue-50 px-2 py-1 rounded" onClick={(e) => e.stopPropagation()}>
                      <Download className="h-3 w-3 mr-1" /> {doc.label}
                    </a>
                  ))}
                </div>
                <button className="text-cyan-600 hover:text-cyan-800 text-xs flex items-center font-medium bg-cyan-50 px-3 py-1.5 rounded-lg">
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </button>
              </div>
            </CardWrapper>
          </div>
        );
      case "facultyTrainedByIndustry":
        return (
          <div className="cursor-pointer" onClick={() => openDetailModal(item, 'facultyTrainedByIndustry')}>
            <CardWrapper
              title={item.training_program_name}
              subtitle={item.industry_name}
              status={item.verification_status}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-blue-500" /> {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'N/A'} ({item.duration_in_days} days)</p>
                  <p><strong>Mode:</strong> {item.mode_of_training}</p>
                  <p><strong>Domain:</strong> {item.domain_area}</p>
                </div>
                <div>
                  <p><strong>Trainer:</strong> {item.trainer1_name}</p>
                  <p className="text-xs text-gray-500">{item.trainer1_designation}</p>
                  <p><strong>Financial:</strong> {item.financial_assistance} (₹{item.amount_incurred})</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <button className="text-purple-600 hover:text-purple-800 text-xs flex items-center font-medium bg-purple-50 px-3 py-1.5 rounded-lg">
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </button>
              </div>
            </CardWrapper>
          </div>
        );
      case 'industryAdvisors':
        return (
          <div
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => navigate(`/faculty/outside-world/industry-advisors/${item.id}`)}
          >
            <CardWrapper
              title={item.expert_name || item.ExpertName}
              subtitle={item.industry_name || item.IndustryName}
              status={item.owi_verification || item.OWIVerification}
            >
              <div className="space-y-2">
                <p><strong>Designation:</strong> {item.designation || item.Designation}</p>
                <p><strong>Domain:</strong> {item.domain_area || item.DomainArea}</p>
                <p><strong>Experience:</strong> {item.experience_years || item.ExperienceYears} years</p>
                <p className="text-xs text-gray-500">{item.email_id || item.EmailID}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {(item.approval_document || item.ApprovalDocument) && (
                    (() => {
                      const files = (item.approval_document || item.ApprovalDocument).split(',').filter(f => f.trim());
                      return files.slice(0, 2).map((file, idx) => (
                        <a
                          key={idx}
                          href={`${API_URL}${file.trim()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center font-medium bg-blue-50 px-2 py-1 rounded"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="h-3 w-3 mr-1" /> Doc {idx + 1}
                        </a>
                      ));
                    })()
                  )}
                </div>
                <button
                  className="text-teal-600 hover:text-teal-800 text-xs flex items-center font-medium bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors"
                  onClick={(e) => { e.stopPropagation(); navigate(`/faculty/outside-world/industry-advisors/${item.id}`); }}
                >
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </button>
              </div>
            </CardWrapper>
          </div>
        );
      case 'laboratoryDevelopedByIndustry':
        return (
          <div className="cursor-pointer" onClick={() => openDetailModal(item, 'laboratoryDevelopedByIndustry')}>
            <CardWrapper
              title={item.name_of_laboratory || item.NameOfLaboratory}
              subtitle={item.collaborative_industry || item.CollaborativeIndustry}
              status={item.owi_verification || item.OWIVerification}
            >
              <div className="space-y-2">
                <p><strong>Domain:</strong> {item.domain_area_of_industry || item.DomainAreaOfIndustry}</p>
                <p><strong>Area:</strong> {item.laboratory_area || item.LaboratoryArea} sqm</p>
                <p><strong>Total Investment:</strong> ₹{item.total_amount_incurred || item.TotalAmountIncurred}</p>
                <p><strong>Industry Support:</strong> ₹{item.financial_support_from_industry || item.FinancialSupportFromIndustry}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <button className="text-orange-600 hover:text-orange-800 text-xs flex items-center font-medium bg-orange-50 px-3 py-1.5 rounded-lg">
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </button>
              </div>
            </CardWrapper>
          </div>
        );
      case 'studentsIndustrialVisit':
        return (
          <div className="cursor-pointer" onClick={() => openDetailModal(item, 'studentsIndustrialVisit')}>
            <CardWrapper
              title={item.industry_name || item.IndustryName}
              subtitle={item.domain_area || item.DomainArea}
              status={item.owi_verification || item.OWIVerification}
            >
              <div className="space-y-2">
                <p className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-blue-500" /> {item.visit_start_date ? new Date(item.visit_start_date).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Students:</strong> {item.number_of_students || item.NumberOfStudents}</p>
                <p><strong>Programme:</strong> {item.programme || item.Programme} - {item.year_of_study || item.YearOfStudy}</p>
                <p><strong>Location:</strong> {item.industry_location || item.IndustryLocation}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <button className="text-cyan-600 hover:text-cyan-800 text-xs flex items-center font-medium bg-cyan-50 px-3 py-1.5 rounded-lg">
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </button>
              </div>
            </CardWrapper>
          </div>
        );
      case 'technicalSocieties':
        return (
          <div className="cursor-pointer" onClick={() => openDetailModal(item, 'technicalSocieties')}>
            <CardWrapper
              title={item.society || item.Society}
              subtitle={item.name || item.Name}
              status={item.status || item.Status}
            >
              <div className="space-y-2">
                <p><strong>Member:</strong> {item.name || item.Name}</p>
                <p><strong>Status:</strong> <span className={item.status === 'Active' ? 'text-green-600' : 'text-red-600'}>{item.status || item.Status}</span></p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <button className="text-violet-600 hover:text-violet-800 text-xs flex items-center font-medium bg-violet-50 px-3 py-1.5 rounded-lg">
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </button>
              </div>
            </CardWrapper>
          </div>
        );
      case 'trainingToIndustry':
        return (
          <div className="cursor-pointer" onClick={() => openDetailModal(item, 'trainingToIndustry')}>
            <CardWrapper
              title={item.event_name || item.EventName}
              subtitle={item.industry_name || item.IndustryName}
              status={item.owi_verification || item.OWIVerification}
            >
              <div className="space-y-2">
                <p className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-blue-500" /> {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'N/A'} ({item.duration_days || item.DurationDays} days)</p>
                <p><strong>Mode:</strong> {item.mode_of_training || item.ModeOfTraining}</p>
                <p><strong>Persons Trained:</strong> {item.number_of_persons_trained || item.NumberOfPersonsTrained}</p>
                <p><strong>Honorarium:</strong> ₹{item.honorarium_received || item.HonorariumReceived}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <button className="text-rose-600 hover:text-rose-800 text-xs flex items-center font-medium bg-rose-50 px-3 py-1.5 rounded-lg">
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </button>
              </div>
            </CardWrapper>
          </div>
        );
      case 'professionalBodyMembership':
        return (
          <div className="cursor-pointer" onClick={() => openDetailModal(item, 'professionalBodyMembership')}>
            <CardWrapper
              title={item.name_of_professional_body || item.NameOfProfessionalBody}
              subtitle={item.membership_category || item.MembershipCategory}
              status={item.owi_verification || item.OWIVerification}
            >
              <div className="space-y-2">
                <p><strong>Type:</strong> {item.membership_type || item.MembershipType}</p>
                <p><strong>Membership ID:</strong> {item.membership_id || item.MembershipID}</p>
                <p><strong>Category:</strong> {item.category || item.Category}</p>
                <p><strong>Amount:</strong> ₹{item.amount || item.Amount}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <button className="text-amber-600 hover:text-amber-800 text-xs flex items-center font-medium bg-amber-50 px-3 py-1.5 rounded-lg">
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </button>
              </div>
            </CardWrapper>
          </div>
        );
      case "industryAdvisors":
        return (
          <div
            onClick={() => {
              setSelectedAdvisor(item);
              setShowAdvisorModal(true);
            }}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer relative h-full flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                  {item.expertName || "Unknown Expert"}
                </h3>
                <p className="text-sm text-blue-600 font-medium mt-1">
                  {item.designation}
                </p>
              </div>
              <StatusBadge status={item.owiVerification} />
            </div>
            <div className="flex-1 space-y-3 text-sm text-gray-600 mb-4">
              <div className="grid grid-cols-1 gap-3">
                <p className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-indigo-500" />
                  <span className="font-medium">{item.industryName}</span>
                </p>
                <p className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                  {item.domainArea || "N/A"}
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  {item.emailId}
                </p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  {item.phoneNumber}
                </p>
                {item.experienceYears && (
                  <p className="text-xs text-gray-500">
                    Experience: {item.experienceYears} years
                  </p>
                )}
              </div>
            </div>
            {item.approvalDocument && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                <a
                  href={`${API_URL}${item.approvalDocument}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs flex items-center font-medium bg-blue-50 px-2 py-1 rounded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="h-3 w-3 mr-1" /> Document
                </a>
              </div>
            )}
            <p className="text-xs text-blue-500 mt-2 text-right">
              Click for details
            </p>
          </div>
        );
      case "laboratoryDevelopedByIndustry":
        return (
          <div
            onClick={() => {
              setSelectedLaboratory(item);
              setShowLaboratoryModal(true);
            }}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer relative h-full flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                  {item.nameOfLaboratory || "Unnamed Laboratory"}
                </h3>
                <p className="text-sm text-blue-600 font-medium mt-1">
                  {item.collaborativeIndustry}
                </p>
              </div>
              <StatusBadge status={item.owiVerification} />
            </div>
            <div className="flex-1 space-y-3 text-sm text-gray-600 mb-4">
              <div className="grid grid-cols-1 gap-3">
                <p className="flex items-center">
                  <Microscope className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="font-medium">
                    {item.domainAreaOfIndustry || "N/A"}
                  </span>
                </p>
                <p className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                  Area:{" "}
                  {item.laboratoryArea ? `${item.laboratoryArea} sq.m` : "N/A"}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <p>
                    <span className="text-gray-500">Total Cost:</span>{" "}
                    <span className="font-semibold text-green-700">
                      ₹{item.totalAmountIncurred || 0}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">BIT:</span>{" "}
                    <span className="font-semibold">
                      ₹{item.bitContribution || 0}
                    </span>
                  </p>
                </div>
                {item.financialSupportFromIndustry > 0 && (
                  <p className="text-xs text-indigo-600">
                    Industry Support: ₹{item.financialSupportFromIndustry}
                  </p>
                )}
              </div>
            </div>
            {item.proofDocument && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                <a
                  href={`${API_URL}${item.proofDocument}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs flex items-center font-medium bg-blue-50 px-2 py-1 rounded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="h-3 w-3 mr-1" /> Document
                </a>
              </div>
            )}
            <p className="text-xs text-blue-500 mt-2 text-right">
              Click for details
            </p>
          </div>
        );
      default:
        // Generic Fallback
        return (
          <CardWrapper
            title={item.title || "Untitled Record"}
            status={item.status || "Pending"}
          >
            {Object.entries(item)
              .slice(0, 3)
              .map(([k, v]) => (
                <p key={k} className="truncate">
                  <strong>{k}:</strong> {String(v)}
                </p>
              ))}
          </CardWrapper>
        );
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      );
    }

    const currentData = interactions[activeTab] || [];

    // All categories are now implemented
    const implementedCategories = ['mou', 'irpVisit', 'consultancy', 'externalVipVisit', 'facultyIndustryProjects', 'coe', 'facultyTrainedByIndustry', 'industryAdvisors', 'laboratoryDevelopedByIndustry', 'studentsIndustrialVisit', 'technicalSocieties', 'trainingToIndustry', 'professionalBodyMembership'];

    const filteredData = currentData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );

    if (filteredData.length === 0) {
      return (
        <div className="text-center py-16 rounded-lg">
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

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item, index) => (
          <div key={index}>
            {renderCard(item, activeTab)}
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
                onClick={() => {
                  const routeMap = {
                    mou: "/faculty/outside-world/mou",
                    irpVisit: "/faculty/outside-world/irp-visit",

                    externalVipVisit: "/faculty/outside-world/external-vip-visit",
                    facultyIndustryProjects: "/faculty/outside-world/faculty-industry-projects",
                    coe: "/faculty/outside-world/coe",
                    facultyTrainedByIndustry:
                      "/faculty/outside-world/faculty-trained-by-industry",
                    industryAdvisors:
                      "/faculty/outside-world/industry-advisors",
                    laboratoryDevelopedByIndustry:
                      "/faculty/outside-world/laboratory-by-industry",
                    studentsIndustrialVisit:
                      "/faculty/outside-world/students-industrial-visit",
                    technicalSocieties:
                      "/faculty/outside-world/technical-societies",
                    trainingToIndustry:
                      "/faculty/outside-world/training-to-industry",
                    professionalBodyMembership:
                      "/faculty/outside-world/professional-membership",
                  };
                  if (routeMap[activeTab]) {
                    navigate(routeMap[activeTab]);
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center sm:justify-start shadow-sm transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center sm:justify-start shadow-sm transition-all">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          {/* Desktop view: 2 rows stretched */}
          <nav className="hidden lg:flex flex-col gap-3 w-full">
            {[tabs.slice(0, 7), tabs.slice(7)].map((rowTabs, rowIndex) => (
              <div key={rowIndex} className="flex w-full gap-2">
                {rowTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                      }}
                      className={`flex-1 min-w-0 flex justify-center cursor-pointer items-center px-2 py-2.5 text-xs xl:text-sm font-medium rounded-full transition-all border ${activeTab === tab.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      title={tab.label}
                    >
                      <IconComponent className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Mobile/Tablet view: Scrollable */}
          <nav className="flex lg:hidden gap-2 p-1 -mx-1 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                  className={`flex cursor-pointer items-center px-4 py-2.5 text-sm font-medium rounded-full transition-all whitespace-nowrap border ${activeTab === tab.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search Bar - Hide on Overview */}
        {activeTab !== "overview" && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          type={modalType}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

// Generic Detail Modal Component
function DetailModal({ item, type, onClose }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const getTitle = () => {
    switch (type) {
      case 'externalVipVisit': return item.event_name || 'External VIP Visit';
      case 'facultyIndustryProjects': return item.project_title || 'Industry Project';
      case 'coe': return item.coe_name || 'Centre of Excellence';
      case 'facultyTrainedByIndustry': return item.training_program_name || 'Training Program';
      case 'industryAdvisors': return item.expert_name || item.ExpertName || 'Industry Advisor';
      case 'laboratoryDevelopedByIndustry': return item.name_of_laboratory || item.NameOfLaboratory || 'Laboratory';
      case 'studentsIndustrialVisit': return item.industry_name || item.IndustryName || 'Industrial Visit';
      case 'technicalSocieties': return item.society || item.Society || 'Technical Society';
      case 'trainingToIndustry': return item.event_name || item.EventName || 'Training to Industry';
      case 'professionalBodyMembership': return item.name_of_professional_body || item.NameOfProfessionalBody || 'Professional Membership';
      default: return 'Details';
    }
  };

  const renderContent = () => {
    // Helper to display field
    const Field = ({ label, value }) => {
      if (!value || value === 'Choose an option') return null;
      return (
        <div className="py-2 border-b border-gray-100 last:border-0">
          <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
          <p className="text-gray-900 font-medium">{value}</p>
        </div>
      );
    };

    const DocLink = ({ file, label }) => {
      if (!file || !file.includes('/')) return null;
      return (
        <a
          href={`${API_URL}${file}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" /> {label}
        </a>
      );
    };

    // Helper to handle multiple files (comma-separated)
    const MultiDocLink = ({ files, label }) => {
      if (!files) return null;
      const fileArray = files.split(',').filter(f => f.trim());
      if (fileArray.length === 0) return null;
      
      return (
        <div className="flex flex-wrap gap-2">
          {fileArray.map((file, idx) => (
            <a
              key={idx}
              href={`${API_URL}${file.trim()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" /> {label} {fileArray.length > 1 && `(${idx + 1})`}
            </a>
          ))}
        </div>
      );
    };

    switch (type) {
      case 'externalVipVisit':
        return (
          <div className="space-y-1">
            <Field label="Event Name" value={item.event_name} />
            <Field label="Event Type" value={item.event_type} />
            <Field label="Category" value={item.category} />
            <Field label="Designation" value={item.designation} />
            <Field label="Organization" value={item.organization_name} />
            <Field label="Organization Address" value={item.organization_address} />
            <Field label="Start Date" value={item.start_date ? new Date(item.start_date).toLocaleDateString() : ''} />
            <Field label="End Date" value={item.end_date ? new Date(item.end_date).toLocaleDateString() : ''} />
            <Field label="Purpose of Visit" value={item.purpose_of_visit} />
            <Field label="Topic Presented" value={item.topic_presented} />
            <Field label="Mobile Number" value={item.mobile_number} />
            <Field label="Guest Email" value={item.guest_email} />
            <Field label="Guest From Industry" value={item.guest_belongs_to_industry} />
            <Field label="BIT Alumni" value={item.is_bit_alumni} />
            <div className="flex flex-wrap gap-2 mt-4">
              <DocLink file={item.formal_photo} label="Formal Photo" />
              <DocLink file={item.photo_proof} label="Photo Proof" />
              <DocLink file={item.approval_letter} label="Approval Letter" />
            </div>
          </div>
        );
      case 'facultyIndustryProjects':
        return (
          <div className="space-y-1">
            <Field label="Project Title" value={item.project_title} />
            <Field label="Industry Name" value={item.industry_name} />
            <Field label="Industry Type" value={item.type_of_industry} />
            <Field label="Project Type" value={item.industry_project} />
            <Field label="Duration" value={`${item.duration_months} months`} />
            <Field label="Start Date" value={item.start_date ? new Date(item.start_date).toLocaleDateString() : ''} />
            <Field label="End Date" value={item.end_date ? new Date(item.end_date).toLocaleDateString() : ''} />
            <Field label="Number of Faculty" value={item.number_of_faculty} />
            <Field label="Faculty 2" value={item.faculty2} />
            <Field label="Faculty 3" value={item.faculty3} />
            <Field label="Number of Students" value={item.number_of_students} />
            <Field label="Student 1" value={item.student1} />
            <Field label="Student 2" value={item.student2} />
            <Field label="Student 3" value={item.student3} />
            <Field label="Outcome" value={item.outcome} />
            <div className="flex flex-wrap gap-2 mt-4">
              <DocLink file={item.industry_project_proof} label="Project Proof" />
            </div>
          </div>
        );
      case 'coe':
        return (
          <div className="space-y-1">
            <Field label="COE Name" value={item.coe_name} />
            <Field label="Domain" value={item.domain} />
            <Field label="Type of COE" value={item.type_of_coe} />
            <Field label="Faculty Incharge" value={item.faculty_incharge} />
            <Field label="Department" value={item.centre_claimed_department} />
            <Field label="Collaborative Industry 1" value={item.collaborative_industry1} />
            <Field label="Collaborative Industry 2" value={item.collaborative_industry2} />
            <Field label="Area (sqm)" value={item.area_in_sqm} />
            <Field label="Part of MoU" value={item.is_mou_part} />
            <Field label="MoU Name" value={item.mou_name} />
            <Field label="IRP Result" value={item.is_irp_result} />
            <Field label="Stock Register" value={item.stock_register_maintained} />
            <Field label="Total Amount" value={`₹${item.total_amount_incurred}`} />
            <Field label="BIT Contribution" value={`₹${item.bit_contribution}`} />
            <Field label="Industry (with GST)" value={`₹${item.industry_contribution_with_gst}`} />
            <Field label="Students per Batch" value={item.students_per_batch} />
            <Field label="Academic Course" value={item.academic_course} />
            <div className="flex flex-wrap gap-2 mt-4">
              <DocLink file={item.syllabus_document} label="Syllabus" />
              <DocLink file={item.lab_photo} label="Lab Photo" />
              <DocLink file={item.communication_proof} label="Communication" />
              <DocLink file={item.apex_document} label="Apex" />
              <DocLink file={item.facilities_report} label="Facilities" />
              <DocLink file={item.utilization_report} label="Utilization" />
            </div>
          </div>
        );
      case 'facultyTrainedByIndustry':
        return (
          <div className="space-y-1">
            <Field label="Training Program" value={item.training_program_name} />
            <Field label="Industry Name" value={item.industry_name} />
            <Field label="Domain Area" value={item.domain_area} />
            <Field label="Industry Type" value={item.type_of_industry} />
            <Field label="Mode of Training" value={item.mode_of_training} />
            <Field label="Duration" value={`${item.duration_in_days} days`} />
            <Field label="Start Date" value={item.start_date ? new Date(item.start_date).toLocaleDateString() : ''} />
            <Field label="End Date" value={item.end_date ? new Date(item.end_date).toLocaleDateString() : ''} />
            <Field label="Financial Assistance" value={item.financial_assistance} />
            <Field label="Amount Incurred" value={`₹${item.amount_incurred}`} />
            <Field label="Type of Approval" value={item.type_of_approval} />
            <Field label="Apex Approval No" value={item.apex_approval_no} />
            <Field label="Industry Website" value={item.industry_website} />
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-semibold mb-2">TRAINER 1</p>
              <Field label="Name" value={item.trainer1_name} />
              <Field label="Designation" value={item.trainer1_designation} />
              <Field label="Email" value={item.trainer1_email} />
              <Field label="Phone" value={item.trainer1_phone} />
            </div>
            {item.trainer2_applicable === 'yes' && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 font-semibold mb-2">TRAINER 2</p>
                <Field label="Name" value={item.trainer2_name} />
                <Field label="Designation" value={item.trainer2_designation} />
                <Field label="Email" value={item.trainer2_email} />
                <Field label="Phone" value={item.trainer2_phone} />
              </div>
            )}
            <Field label="Outcome" value={item.outcome} />
            <div className="flex flex-wrap gap-2 mt-4">
              <DocLink file={item.proof_document} label="Proof Document" />
            </div>
          </div>
        );
      case 'industryAdvisors':
        return (
          <div className="space-y-1">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
              <Field label="Expert Name" value={item.expert_name || item.ExpertName} />
              <Field label="Designation" value={item.designation || item.Designation} />
              <Field label="Experience (Years)" value={item.experience_years || item.ExperienceYears} />
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
              <p className="text-xs text-gray-600 font-semibold mb-3 uppercase">Industry Information</p>
              <Field label="Industry Name" value={item.industry_name || item.IndustryName} />
              <Field label="Industry Type" value={item.industry_type || item.IndustryType} />
              <Field label="Domain Area" value={item.domain_area || item.DomainArea} />
              <Field label="Industry Address" value={item.industry_address || item.IndustryAddress} />
              <Field label="Industry Website" value={item.industry_website || item.IndustryWebsite} />
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-4">
              <p className="text-xs text-gray-600 font-semibold mb-3 uppercase">Contact Details</p>
              <Field label="Email" value={item.email_id || item.EmailID} />
              <Field label="Phone" value={item.phone_number || item.PhoneNumber} />
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg mb-4">
              <p className="text-xs text-gray-600 font-semibold mb-3 uppercase">Expertise & Area of Focus</p>
              <Field label="Area of Expertise" value={item.area_of_expertise || item.AreaOfExpertise} />
              <Field label="Frequency of Interaction (months)" value={item.frequency_of_interaction || item.FrequencyOfInteraction} />
              <Field label="Date of Meeting" value={item.date_of_meeting ? new Date(item.date_of_meeting).toLocaleDateString() : ''} />
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4">
              <p className="text-xs text-gray-600 font-semibold mb-3 uppercase">Interaction Details</p>
              <Field label="Expense Incurred (Rs.)" value={item.expense_incurred ? `₹${item.expense_incurred}` : ''} />
              <Field label="Suggestions" value={item.suggestions || item.Suggestions} />
              <Field label="Collaborative Activities" value={item.collaborative_activities || item.CollaborativeActivities} />
            </div>

            <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-lg mb-4">
              <p className="text-xs text-gray-600 font-semibold mb-3 uppercase">Verification Status</p>
              <Field label="OWI Verification Status" value={item.owi_verification || item.OWIVerification} />
            </div>

            {(item.approval_document || item.ApprovalDocument) && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mt-4">
                <p className="text-xs text-gray-600 font-semibold mb-3 uppercase">Approval Documents</p>
                <MultiDocLink file={item.approval_document || item.ApprovalDocument} label="Approval Document" />
              </div>
            )}
          </div>
        );
      case 'laboratoryDevelopedByIndustry':
        return (
          <div className="space-y-1">
            <Field label="Laboratory Name" value={item.name_of_laboratory || item.NameOfLaboratory} />
            <Field label="Collaborative Industry" value={item.collaborative_industry || item.CollaborativeIndustry} />
            <Field label="Domain Area" value={item.domain_area_of_industry || item.DomainAreaOfIndustry} />
            <Field label="Laboratory Area (sqm)" value={item.laboratory_area || item.LaboratoryArea} />
            <Field label="Total Amount Incurred" value={`₹${item.total_amount_incurred || item.TotalAmountIncurred}`} />
            <Field label="BIT Contribution" value={`₹${item.bit_contribution || item.BITContribution}`} />
            <Field label="Industry Support" value={`₹${item.financial_support_from_industry || item.FinancialSupportFromIndustry}`} />
            <Field label="Equipment Sponsored" value={item.equipment_sponsored || item.EquipmentSponsored} />
            <Field label="Equipment Enhancement" value={item.equipment_enhancement || item.EquipmentEnhancement} />
            <Field label="Layout Design Enhancement" value={item.layout_design_enhancement || item.LayoutDesignEnhancement} />
            <Field label="Curriculum Mapping" value={item.curriculum_mapping || item.CurriculumMapping} />
            <Field label="Expected Outcomes" value={item.expected_outcomes || item.ExpectedOutcomes} />
            <div className="flex flex-wrap gap-2 mt-4">
              <DocLink file={item.proof_document || item.ProofDocument} label="Proof Document" />
            </div>
          </div>
        );
      case 'studentsIndustrialVisit':
        return (
          <div className="space-y-1">
            <Field label="Industry Name" value={item.industry_name || item.IndustryName} />
            <Field label="Industry Type" value={item.industry_type || item.IndustryType} />
            <Field label="Domain Area" value={item.domain_area || item.DomainArea} />
            <Field label="Location" value={item.industry_location || item.IndustryLocation} />
            <Field label="Industry Website" value={item.industry_website || item.IndustryWebsite} />
            <Field label="Contact Person" value={item.contact_person_name || item.ContactPersonName} />
            <Field label="Contact Designation" value={item.contact_person_designation || item.ContactPersonDesignation} />
            <Field label="Contact Email" value={item.contact_person_email || item.ContactPersonEmail} />
            <Field label="Contact Phone" value={item.contact_person_phone || item.ContactPersonPhone} />
            <Field label="Visit Start Date" value={item.visit_start_date ? new Date(item.visit_start_date).toLocaleDateString() : ''} />
            <Field label="Visit End Date" value={item.visit_end_date ? new Date(item.visit_end_date).toLocaleDateString() : ''} />
            <Field label="Programme" value={item.programme || item.Programme} />
            <Field label="Year of Study" value={item.year_of_study || item.YearOfStudy} />
            <Field label="Number of Students" value={item.number_of_students || item.NumberOfStudents} />
            <Field label="Male Students" value={item.male_students || item.MaleStudents} />
            <Field label="Female Students" value={item.female_students || item.FemaleStudents} />
            <Field label="Purpose of Visit" value={item.purpose_of_visit || item.PurposeOfVisit} />
            <Field label="Faculty 1" value={item.faculty1 || item.Faculty1} />
            <Field label="Faculty 2" value={item.faculty2 || item.Faculty2} />
            <Field label="Faculty 3" value={item.faculty3 || item.Faculty3} />
            <Field label="Source of Arrangement" value={item.source_of_arrangement || item.SourceOfArrangement} />
            <Field label="Curriculum Mapping" value={item.curriculum_mapping || item.CurriculumMapping} />
            <Field label="Outcome" value={item.outcome_of_visit || item.OutcomeOfVisit} />
            <div className="flex flex-wrap gap-2 mt-4">
              <DocLink file={item.proof_document || item.ProofDocument} label="Proof Document" />
            </div>
          </div>
        );
      case 'technicalSocieties':
        return (
          <div className="space-y-1">
            <Field label="Society Name" value={item.society || item.Society} />
            <Field label="Member Name" value={item.name || item.Name} />
            <Field label="Status" value={item.status || item.Status} />
          </div>
        );
      case 'trainingToIndustry':
        return (
          <div className="space-y-1">
            <Field label="Event Name" value={item.event_name || item.EventName} />
            <Field label="Industry Name" value={item.industry_name || item.IndustryName} />
            <Field label="Industry Address" value={item.industry_address || item.IndustryAddress} />
            <Field label="Domain Area" value={item.domain_area || item.DomainArea} />
            <Field label="Industry Type" value={item.industry_type || item.IndustryType} />
            <Field label="Mode of Training" value={item.mode_of_training || item.ModeOfTraining} />
            <Field label="Industry Website" value={item.industry_website || item.IndustryWebsite} />
            <Field label="Persons Trained" value={item.number_of_persons_trained || item.NumberOfPersonsTrained} />
            <Field label="Duration (Days)" value={item.duration_days || item.DurationDays} />
            <Field label="Start Date" value={item.start_date ? new Date(item.start_date).toLocaleDateString() : ''} />
            <Field label="End Date" value={item.end_date ? new Date(item.end_date).toLocaleDateString() : ''} />
            <Field label="Outcome" value={item.outcome_of_training || item.OutcomeOfTraining} />
            <Field label="Honorarium Received" value={item.honorarium_received ? `₹${item.honorarium_received}` : ''} />
            <div className="flex flex-wrap gap-2 mt-4">
              <DocLink file={item.communication_proof || item.CommunicationProof} label="Communication" />
              <DocLink file={item.approval_letter || item.ApprovalLetter} label="Approval" />
              <DocLink file={item.geotag_photos || item.GeotagPhotos} label="Photos" />
              <DocLink file={item.participants_attendance || item.ParticipantsAttendance} label="Attendance" />
              <DocLink file={item.payment_proofs || item.PaymentProofs} label="Payment" />
              <DocLink file={item.consolidated_document || item.ConsolidatedDocument} label="Consolidated" />
            </div>
          </div>
        );
      case 'professionalBodyMembership':
        return (
          <div className="space-y-1">
            <Field label="Professional Body" value={item.name_of_professional_body || item.NameOfProfessionalBody} />
            <Field label="Membership Category" value={item.membership_category || item.MembershipCategory} />
            <Field label="Membership Type" value={item.membership_type || item.MembershipType} />
            <Field label="Membership ID" value={item.membership_id || item.MembershipID} />
            <Field label="Grade/Level/Position" value={item.name_of_grade_level_position || item.NameOfGradeLevelPosition} />
            <Field label="Category" value={item.category || item.Category} />
            <Field label="Validity Type" value={item.validity_type || item.ValidityType} />
            <Field label="Amount" value={item.amount ? `₹${item.amount}` : ''} />
            <Field label="If Others" value={item.if_others || item.IfOthers} />
            <Field label="Amount (Others)" value={item.amount_if_others ? `₹${item.amount_if_others}` : ''} />
            <div className="flex flex-wrap gap-2 mt-4">
              <DocLink file={item.apex_document_proof || item.ApexDocumentProof} label="Apex Proof" />
              <DocLink file={item.document_proof || item.DocumentProof} label="Document Proof" />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-1">
            {Object.entries(item).map(([key, value]) => (
              <Field key={key} label={key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()} value={String(value)} />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white truncate pr-4">{getTitle()}</h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {renderContent()}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
