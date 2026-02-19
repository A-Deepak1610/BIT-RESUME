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
  LayoutDashboard,
  Calendar,
  ExternalLink,
  MapPin,
  X,
  Phone,
  Mail,
  Globe,
  Building2,
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
  const [activeTab, setActiveTab] = useState("overview");
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

  const fetchData = async (endpoint, key) => {
    try {
      const response = await axios.get(`${API_URL}api/faculty/${endpoint}`, {
        withCredentials: true,
      });
      return response.data[key] || [];
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
        ]);

        console.log("Fetched Data Debug:", {
          mou,
          irpVisit,
          consultancy,
          externalVipVisit,
          facultyIndustryProjects,
          coe,
          facultyTrainedByIndustry,
          industryAdvisors,
          laboratoryDevelopedByIndustry,
        });

        setInteractions((prev) => ({
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
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
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
          <CardWrapper
            title={item.legal_name_of_industry}
            subtitle={`${item.type_of_mou} - ${item.mou_based_on || "General"}`}
            status={item.verification_status}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="font-medium">Agreement:</span>&nbsp;
                  {new Date(item.date_of_agreement).toLocaleDateString()}
                  {item.duration && (
                    <span className="text-gray-500 ml-1">
                      ({item.duration})
                    </span>
                  )}
                </p>
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-red-500" />{" "}
                  {item.industry_location}
                </p>
                {item.domain_area && (
                  <p className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-500" />{" "}
                    {item.domain_area}
                  </p>
                )}
                {item.spoc_name && (
                  <p className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" /> SPOC:{" "}
                    {item.spoc_name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                {item.task_id && (
                  <p className="text-xs text-gray-500">
                    Task ID: {item.task_id}
                  </p>
                )}
                {item.type_of_industry && (
                  <p>
                    <span className="font-medium">Industry Type:</span>{" "}
                    {item.type_of_industry}
                  </p>
                )}
                {item.special_lab && (
                  <p>
                    <span className="font-medium">Special Lab:</span>{" "}
                    {item.special_lab}
                  </p>
                )}
              </div>
            </div>

            {(item.scopy_of_agreement ||
              item.bit_roles_and_responsibilities) && (
              <div className="mt-3 text-xs bg-gray-50 p-3 rounded space-y-2">
                {item.scope_of_agreement && (
                  <p>
                    <strong>Scope:</strong> {item.scope_of_agreement}
                  </p>
                )}
                {item.bit_roles_and_responsibilities && (
                  <p>
                    <strong>BIT Roles:</strong>{" "}
                    {item.bit_roles_and_responsibilities}
                  </p>
                )}
              </div>
            )}

            {/* Documents Section for MoU */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
              {[
                { file: item.signed_mou, label: "Signed MoU" },
                { file: item.apex_proof, label: "Apex Proof" },
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
          </CardWrapper>
        );
      case "irpVisit":
        return (
          <CardWrapper
            title={item.mou_name || item.purpose_of_visit || "IRP Visit"}
            subtitle={item.mode_of_interaction}
            status={item.verification_status}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  {new Date(item.from_date).toLocaleDateString()} -{" "}
                  {new Date(item.to_date).toLocaleDateString()}
                </p>
                {item.amount_incurred > 0 && (
                  <p className="font-semibold text-green-700">
                    Amount: ₹{item.amount_incurred}
                  </p>
                )}
                {item.number_of_industry && (
                  <p>Industries Visited: {item.number_of_industry}</p>
                )}
                {item.number_of_faculty && (
                  <p>Faculty Count: {item.number_of_faculty}</p>
                )}
              </div>
              <div className="space-y-2">
                {item.claimed_for_department && (
                  <p>
                    <strong>Dept:</strong> {item.claimed_for_department}
                  </p>
                )}
                {item.type_of_approval && (
                  <p>
                    <strong>Approval:</strong> {item.type_of_approval}
                  </p>
                )}
                {item.special_lab && (
                  <p>
                    <strong>Lab:</strong> {item.special_lab}
                  </p>
                )}
              </div>
            </div>

            {item.purpose_of_visit && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                <strong>Purpose:</strong> {item.purpose_of_visit}
              </div>
            )}

            {/* Documents Section for IRP */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
              {[
                { file: item.apex_proof, label: "Apex Proof" },
                { file: item.irp_form_signed, label: "Signed Form" },
                { file: item.consolidated_document, label: "Consolidated Doc" },
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
          </CardWrapper>
        );
      case "consultancy":
        return (
          <CardWrapper
            title={item.consultancy_project_title}
            subtitle={item.organization_name}
            status={item.verification_status}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-semibold text-green-700">
                  Amount: ₹{item.consultancy_amount}
                </p>
                <p className="text-xs text-gray-500">
                  (After GST: ₹{item.amount_after_gst})
                </p>
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  {new Date(item.from_date).toLocaleDateString()}
                  <span className="text-gray-500 ml-1">
                    ({item.duration_year}Y {item.duration_month}M)
                  </span>
                </p>
                <p>
                  <strong>PI:</strong> {item.faculty}
                </p>
                {item.faculty2 && (
                  <p>
                    <strong>Co-PI 1:</strong> {item.faculty2}
                  </p>
                )}
                {item.faculty3 && (
                  <p>
                    <strong>Co-PI 2:</strong> {item.faculty3}
                  </p>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Type:</strong> {item.type_of_consultant}
                </p>
                <p>
                  <strong>Sector:</strong> {item.sector_of_consultant}
                </p>
                <p>
                  <strong>Share:</strong> Fac ({item.faculty_share_percentage}%)
                  / Inst ({item.institute_share_percentage}%)
                </p>
                {item.is_part_of_mou === "Yes" && (
                  <p className="text-green-600 text-xs">
                    Linked to MoU: {item.mou_name}
                  </p>
                )}
              </div>
            </div>

            {/* Documents Section for Consultancy - Extensive list */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
              {[
                { file: item.consultancy_agreement, label: "Agreement" },
                { file: item.invoice_receipt, label: "Invoice" },
                { file: item.consultancy_report, label: "Report" },
                { file: item.transaction_proof, label: "Tx Proof" },
                { file: item.communication_proof, label: "Comm. Proof" },
                { file: item.geotag_photos, label: "Photos" },
                { file: item.work_logs, label: "Logs" },
                { file: item.audit_documents, label: "Audit" },
                { file: item.partnership_deed, label: "Deed" },
                { file: item.noc_premises, label: "NOC" },
                { file: item.non_disclosure_agreement, label: "NDA" },
                { file: item.consolidated_document, label: "Consolidated" },
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
          </CardWrapper>
        );
      case "externalVipVisit":
        return (
          <CardWrapper
            title={item.event_name}
            subtitle={`${item.designation} - ${item.organization_name}`}
            status={item.verification_status}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />{" "}
                  {new Date(item.start_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Category:</strong> {item.category}
                </p>
                <p>
                  <strong>Event Type:</strong> {item.event_type}
                </p>
                {item.mobile_number && (
                  <p className="text-xs text-gray-500">
                    Contact: {item.mobile_number}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                {item.guest_belongs_to_industry === "Yes" && (
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold">
                    Industry Guest
                  </span>
                )}
                {item.is_bit_alumni === "Yes" && (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold ml-2">
                    Alumni
                  </span>
                )}
              </div>
            </div>

            {item.purpose_of_visit && (
              <div className="mt-3 bg-gray-50 p-2 rounded text-sm">
                <strong>Purpose:</strong> {item.purpose_of_visit}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
              {[
                { file: item.formal_photo, label: "Photo" },
                { file: item.photo_proof, label: "Proof" },
                { file: item.approval_letter, label: "Approval" },
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
          </CardWrapper>
        );
      case "facultyIndustryProjects":
        return (
          <CardWrapper
            title={item.project_title}
            subtitle={item.industry_name}
            status={item.verification_status}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />{" "}
                  {new Date(item.start_date).toLocaleDateString()} (
                  {item.duration_months} mo)
                </p>
                <p>
                  <strong>Type:</strong> {item.type_of_industry}
                </p>
                <p>
                  <strong>Students:</strong> {item.number_of_students}
                </p>
                <p>
                  <strong>Faculty:</strong> {item.number_of_faculty}
                </p>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <p className="font-semibold text-gray-800">Team:</p>
                <p>
                  {item.faculty} {item.faculty2 && `, ${item.faculty2}`}{" "}
                  {item.faculty3 && `, ${item.faculty3}`}
                </p>
                <p>
                  {item.student1} {item.student2 && `, ${item.student2}`}{" "}
                  {item.student3 && `, ${item.student3}`}
                </p>
              </div>
            </div>

            {item.outcome && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                <strong>Outcome:</strong> {item.outcome}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
              {[{ file: item.industry_project_proof, label: "Proof" }].map(
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
          </CardWrapper>
        );
      case "coe":
        return (
          <CardWrapper
            title={item.coe_name}
            subtitle={item.domain}
            status={item.verification_status}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p>
                  <strong>Type:</strong> {item.type_of_coe}
                </p>
                <p>
                  <strong>Industry:</strong> {item.collaborative_industry1}
                </p>
                <p>
                  <strong>In-Charge:</strong> {item.faculty_incharge}
                </p>
                <p className="text-xs">Area: {item.area_in_sqm} sqm</p>
              </div>
              <div className="space-y-2 border-l pl-4 border-gray-100">
                <p className="text-xs text-gray-500">Financials:</p>
                <p>Total: ₹{item.total_amount_incurred}</p>
                <p>Industry: ₹{item.industry_contribution_with_gst}</p>
                <p>BIT: ₹{item.bit_contribution}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
              {[
                { file: item.syllabus_document, label: "Syllabus" },
                { file: item.lab_photo, label: "Photo" },
                { file: item.communication_proof, label: "Comm. Proof" },
                { file: item.apex_document, label: "Apex" },
                { file: item.facilities_report, label: "Facilities" },
                { file: item.utilization_report, label: "Utilization" },
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
          </CardWrapper>
        );
      case "facultyTrainedByIndustry":
        return (
          <CardWrapper
            title={item.training_program_name}
            subtitle={item.industry_name}
            status={item.verification_status}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />{" "}
                  {new Date(item.start_date).toLocaleDateString()} (
                  {item.duration_in_days} days)
                </p>
                <p>
                  <strong>Mode:</strong> {item.mode_of_training}
                </p>
                <p>
                  <strong>Domain:</strong> {item.domain_area}
                </p>
              </div>
              <div>
                <p>
                  <strong>Trainer:</strong> {item.trainer1_name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.trainer1_designation}
                </p>
                <p>
                  <strong>Financial:</strong> {item.financial_assistance} (₹
                  {item.amount_incurred})
                </p>
              </div>
            </div>

            {item.outcome && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                <strong>Outcome:</strong> {item.outcome}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
              {[
                { file: item.proof_document, label: "Proof" },
                { file: item.apex_approval_no, label: "Apex" }, // Assuming this might be a doc link or just text, but treating as potentially linkable if structured that way. Actually apex_approval_no is usually text.
              ]
                .filter((d) => d.file && d.file.includes("/"))
                .map(
                  (
                    doc,
                    idx, // Improved logical check if it's a path
                  ) => (
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
          </CardWrapper>
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

    if (activeTab === "overview") {
      return (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Handshake className="h-5 w-5 mr-2 text-indigo-600" /> Latest
                MoUs
              </h3>
              <div className="space-y-4">
                {interactions.mou.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 truncate w-48">
                        {item.legal_name_of_industry}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.date_of_agreement).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={item.verification_status} />
                  </div>
                ))}
                {interactions.mou.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    No MoUs recorded yet.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-indigo-600" /> Recent
                Consultancy
              </h3>
              <div className="space-y-4">
                {interactions.consultancy.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 truncate w-48">
                        {item.consultancy_project_title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.organization_name}
                      </p>
                    </div>
                    <StatusBadge status={item.verification_status} />
                  </div>
                ))}
                {interactions.consultancy.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    No consultancy records found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    const currentData = interactions[activeTab] || [];

    // Check if category is supported/implemented
    const implementedCategories = [
      "mou",
      "irpVisit",
      "consultancy",
      "externalVipVisit",
      "facultyIndustryProjects",
      "coe",
      "facultyTrainedByIndustry",
      "industryAdvisors",
      "laboratoryDevelopedByIndustry",
    ];
    if (!implementedCategories.includes(activeTab)) {
      return (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 border-dashed">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
            <LayoutDashboard className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Module Under Development
          </h3>
          <p className="text-gray-500">This section is coming soon.</p>
        </div>
      );
    }

    const filteredData = currentData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );

    if (filteredData.length === 0) {
      return (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
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
          <React.Fragment key={index}>
            {renderCard(item, activeTab)}
          </React.Fragment>
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
                    consultancy: "/faculty/outside-world/consultancy",
                    externalVipVisit:
                      "/faculty/outside-world/external-vip-visit",
                    facultyIndustryProjects:
                      "/faculty/outside-world/faculty-industry-projects",
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

        {/* Navigation Tabs - Scrollable */}
        <div className="mb-8">
          <nav className="flex flex-wrap gap-2 p-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex cursor-pointer items-center px-4 py-2.5 text-sm font-medium rounded-full transition-all whitespace-nowrap border ${
                    activeTab === tab.id
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

      {/* Industry Advisor Detail Modal */}
      {showAdvisorModal && selectedAdvisor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedAdvisor.expertName}
                  </h2>
                  <p className="text-blue-100 mt-1">
                    {selectedAdvisor.designation}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAdvisorModal(false);
                    setSelectedAdvisor(null);
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Industry Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-indigo-600" />
                  Industry Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Industry Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedAdvisor.industryName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Domain Area</p>
                    <p className="font-medium text-gray-900">
                      {selectedAdvisor.domainArea || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Industry Type</p>
                    <p className="font-medium text-gray-900">
                      {selectedAdvisor.industryType === "Others"
                        ? selectedAdvisor.industryTypeOther
                        : selectedAdvisor.industryType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Website</p>
                    {selectedAdvisor.industryWebsite ? (
                      <a
                        href={
                          selectedAdvisor.industryWebsite.startsWith("http")
                            ? selectedAdvisor.industryWebsite
                            : `https://${selectedAdvisor.industryWebsite}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline flex items-center"
                      >
                        <Globe className="h-3 w-3 mr-1" /> Visit Website
                      </a>
                    ) : (
                      <p className="font-medium text-gray-900">N/A</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">
                      {selectedAdvisor.industryAddress || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expert Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-green-600" />
                  Expert Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a
                      href={`mailto:${selectedAdvisor.emailId}`}
                      className="font-medium text-blue-600 hover:underline flex items-center"
                    >
                      <Mail className="h-3 w-3 mr-1" />{" "}
                      {selectedAdvisor.emailId || "N/A"}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <a
                      href={`tel:${selectedAdvisor.phoneNumber}`}
                      className="font-medium text-blue-600 hover:underline flex items-center"
                    >
                      <Phone className="h-3 w-3 mr-1" />{" "}
                      {selectedAdvisor.phoneNumber || "N/A"}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="font-medium text-gray-900">
                      {selectedAdvisor.experienceYears
                        ? `${selectedAdvisor.experienceYears} Years`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Area of Expertise</p>
                    <p className="font-medium text-gray-900">
                      {selectedAdvisor.areaOfExpertise || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interaction Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                  Interaction Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">
                      Frequency of Interaction
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedAdvisor.frequencyOfInteraction
                        ? `${selectedAdvisor.frequencyOfInteraction} times/year`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date of Meeting</p>
                    <p className="font-medium text-gray-900">
                      {selectedAdvisor.dateOfMeeting
                        ? new Date(
                            selectedAdvisor.dateOfMeeting,
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expense Incurred</p>
                    <p className="font-medium text-gray-900">
                      {selectedAdvisor.expenseIncurred
                        ? `₹${selectedAdvisor.expenseIncurred}`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Verification Status</p>
                    <StatusBadge status={selectedAdvisor.owiVerification} />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(selectedAdvisor.suggestions ||
                selectedAdvisor.collaborativeActivities) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-600" />
                    Additional Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    {selectedAdvisor.suggestions && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Suggestions
                        </p>
                        <p className="text-gray-700">
                          {selectedAdvisor.suggestions}
                        </p>
                      </div>
                    )}
                    {selectedAdvisor.collaborativeActivities && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Collaborative Activities
                        </p>
                        <p className="text-gray-700">
                          {selectedAdvisor.collaborativeActivities}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Document */}
              {selectedAdvisor.approvalDocument && (
                <div className="pt-4 border-t border-gray-200">
                  <a
                    href={`${API_URL}${selectedAdvisor.approvalDocument}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" /> View Approval Document
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
              <button
                onClick={() => {
                  setShowAdvisorModal(false);
                  setSelectedAdvisor(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Laboratory by Industry Detail Modal */}
      {showLaboratoryModal && selectedLaboratory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedLaboratory.nameOfLaboratory}
                  </h2>
                  <p className="text-purple-100 mt-1">
                    {selectedLaboratory.collaborativeIndustry}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowLaboratoryModal(false);
                    setSelectedLaboratory(null);
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Laboratory Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Microscope className="h-5 w-5 mr-2 text-purple-600" />
                  Laboratory Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Domain Area</p>
                    <p className="font-medium text-gray-900">
                      {selectedLaboratory.domainAreaOfIndustry || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Laboratory Area</p>
                    <p className="font-medium text-gray-900">
                      {selectedLaboratory.laboratoryArea
                        ? `${selectedLaboratory.laboratoryArea} sq.m`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Task ID</p>
                    <p className="font-medium text-gray-900">
                      {selectedLaboratory.taskId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">SIG Number</p>
                    <p className="font-medium text-gray-900">
                      {selectedLaboratory.sigNumber || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  Financial Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500">
                      Total Amount Incurred
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      ₹{selectedLaboratory.totalAmountIncurred || 0}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500">BIT Contribution</p>
                    <p className="text-xl font-bold text-blue-600">
                      ₹{selectedLaboratory.bitContribution || 0}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500">Industry Support</p>
                    <p className="text-xl font-bold text-indigo-600">
                      ₹{selectedLaboratory.financialSupportFromIndustry || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Equipment & Enhancement Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-orange-600" />
                  Equipment & Enhancements
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  {selectedLaboratory.equipmentSponsored && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Equipment Sponsored
                      </p>
                      <p className="text-gray-700">
                        {selectedLaboratory.equipmentSponsored}
                      </p>
                    </div>
                  )}
                  {selectedLaboratory.equipmentEnhancement && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Equipment Enhancement
                      </p>
                      <p className="text-gray-700">
                        {selectedLaboratory.equipmentEnhancement}
                      </p>
                    </div>
                  )}
                  {selectedLaboratory.layoutDesignEnhancement && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Layout Design Enhancement
                      </p>
                      <p className="text-gray-700">
                        {selectedLaboratory.layoutDesignEnhancement}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Curriculum & Outcomes */}
              {(selectedLaboratory.curriculumMapping ||
                selectedLaboratory.expectedOutcomes) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                    Curriculum & Outcomes
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    {selectedLaboratory.curriculumMapping && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Curriculum Mapping
                        </p>
                        <p className="text-gray-700">
                          {selectedLaboratory.curriculumMapping}
                        </p>
                      </div>
                    )}
                    {selectedLaboratory.expectedOutcomes && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Expected Outcomes
                        </p>
                        <p className="text-gray-700">
                          {selectedLaboratory.expectedOutcomes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Verification Status */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Verification Status</p>
                  <StatusBadge status={selectedLaboratory.owiVerification} />
                </div>
              </div>

              {/* Document */}
              {selectedLaboratory.proofDocument && (
                <div className="pt-4 border-t border-gray-200">
                  <a
                    href={`${API_URL}${selectedLaboratory.proofDocument}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" /> View Proof Document
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
              <button
                onClick={() => {
                  setShowLaboratoryModal(false);
                  setSelectedLaboratory(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
