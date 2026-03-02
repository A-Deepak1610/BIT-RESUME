import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Download,
  Calendar,
  User,
  Users,
  Briefcase,
  FileText,
  Building2,
  CheckCircle,
  DollarSign,
  Globe,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Clock,
  Loader2,
  AlertCircle,
  Shield,
  Award,
  Target,
  Factory,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusLower = (status || "initiated").toLowerCase();
  const statusConfig = {
    verified: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300", label: "Verified" },
    approved: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300", label: "Approved" },
    rejected: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300", label: "Rejected" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300", label: "Pending" },
    initiated: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300", label: "Initiated" },
  };
  const config = statusConfig[statusLower] || statusConfig.initiated;
  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

// Info Row Component
const InfoRow = ({ icon: Icon, label, value, iconColor = "text-gray-500" }) => {
  if (!value) return null;
  const displayValue = value === null || value === undefined || value === "" ? "—" : String(value);
  if (displayValue === "—") return null;

  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className={`p-2 rounded-lg bg-gray-50 ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</p>
        <p className="text-base text-gray-900 mt-1 font-medium">{displayValue}</p>
      </div>
    </div>
  );
};

// Section Component
const Section = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
      {Icon && (
        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Document Card Component
const DocumentCard = ({ files, label, icon: Icon = FileText }) => {
  if (!files) return null;

  const fileArray = typeof files === "string"
    ? files.split(",").map((f) => f.trim()).filter((f) => f && f.includes("/"))
    : [];

  if (fileArray.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5 text-indigo-600" />
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      {fileArray.map((file, idx) => (
        <a
          key={idx}
          href={`${API_URL}${file}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg hover:shadow-md hover:border-indigo-200 transition-all group"
        >
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 group-hover:bg-indigo-200 transition-colors">
            <Download className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate text-sm">{file.split("/").pop()}</p>
            <p className="text-xs text-gray-500">Click to download</p>
          </div>
          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
        </a>
      ))}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase">{label}</p>
        <p className="font-semibold text-gray-900 truncate">{value || "N/A"}</p>
      </div>
    </div>
  </div>
);

export default function IndustryAdvisorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching from:", `${API_URL}api/owi/industryAdvisor`);
        const response = await axios.get(`${API_URL}api/owi/industryAdvisor`, {
          withCredentials: true,
        });

        console.log("Full Response:", response);
        console.log("Response Data:", response.data);

        const records = response.data.data || response.data || [];
        console.log("Records array:", records);
        console.log("Looking for ID:", id, "Type:", typeof id);

        let record = null;
        if (Array.isArray(records)) {
          record = records.find((r) => String(r.id) === String(id));
        } else {
          record = records;
        }

        console.log("Found record:", record);

        if (record) {
          setData(record);
          setError(null);
        } else {
          if (Array.isArray(records)) {
            setError(`Record not found. IDs available: ${records.map((r) => r.id).join(", ")}`);
          } else {
            setError("No records found or invalid response format");
          }
        }
      } catch (err) {
        console.error("Error fetching details:", err);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id && API_URL) {
      fetchDetails();
    }
  }, [id, API_URL]);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading industry advisor details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "Record not found"}</p>
          <button
            onClick={() => navigate("/faculty/outside-world-interaction")}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
          >
            Back to OWI Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/faculty/outside-world-interaction")}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Outside World Interaction</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{data.expert_name || "Industry Advisor"}</h1>
              <p className="text-indigo-200 mt-1 text-lg">
                {data.industry_name || "Expert Interaction"} • {data.designation || "Professional"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={data.owi_verification || data.OWIVerification || "Initiated"} />
              {data.faculty && (
                <span className="px-3 py-1.5 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                  Faculty: {data.faculty}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={User} label="Expert Name" value={data.expert_name || data.ExpertName} />
            <StatCard icon={Building2} label="Industry" value={data.industry_name || data.IndustryName} />
            <StatCard icon={Calendar} label="Interaction Date" value={formatDate(data.date_of_meeting)?.split(" ").slice(1).join(" ")} />
            <StatCard icon={DollarSign} label="Expense" value={data.expense_incurred ? `₹${parseFloat(data.expense_incurred).toFixed(0)}` : "—"} />
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expert Information */}
          {data && (
            <Section title="Expert Information" icon={User}>
              <InfoRow icon={User} label="Expert Name" value={data.expert_name || data.ExpertName} iconColor="text-blue-600" />
              <InfoRow icon={Briefcase} label="Designation" value={data.designation || data.Designation} iconColor="text-indigo-600" />
              <InfoRow icon={Clock} label="Experience (Years)" value={data.experience_years || data.ExperienceYears} iconColor="text-purple-600" />
              <InfoRow icon={Target} label="Area of Expertise" value={data.area_of_expertise || data.AreaOfExpertise} iconColor="text-green-600" />
            </Section>
          )}

          {/* Contact Information */}
          {data && (
            <Section title="Contact Information" icon={Mail}>
              <InfoRow icon={Mail} label="Email Address" value={data.email_id || data.EmailID} iconColor="text-red-600" />
              <InfoRow icon={Phone} label="Phone Number" value={data.phone_number || data.PhoneNumber} iconColor="text-green-600" />
            </Section>
          )}

          {/* Industry Information */}
          {data && (
            <Section title="Industry Information" icon={Building2}>
              <InfoRow icon={Building2} label="Industry Name" value={data.industry_name || data.IndustryName} iconColor="text-blue-600" />
              <InfoRow icon={Factory} label="Industry Type" value={data.industry_type || data.IndustryType} iconColor="text-purple-600" />
              <InfoRow icon={Target} label="Domain Area" value={data.domain_area || data.DomainArea} iconColor="text-indigo-600" />
              <InfoRow icon={MapPin} label="Address" value={data.industry_address || data.IndustryAddress} iconColor="text-red-600" />
              <InfoRow
                icon={Globe}
                label="Website"
                value={
                  (data.industry_website || data.IndustryWebsite) && (
                    <a
                      href={data.industry_website || data.IndustryWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {data.industry_website || data.IndustryWebsite}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )
                }
                iconColor="text-green-600"
              />
            </Section>
          )}

          {/* Interaction Details */}
          {data && (
            <Section title="Interaction Details" icon={Calendar}>
              <InfoRow icon={Calendar} label="Frequency (months)" value={data.frequency_of_interaction || data.FrequencyOfInteraction} iconColor="text-blue-600" />
              <InfoRow icon={Calendar} label="Date of Meeting" value={formatDate(data.date_of_meeting)} iconColor="text-green-600" />
              <InfoRow icon={DollarSign} label="Expense Incurred (Rs.)" value={data.expense_incurred ? `₹${parseFloat(data.expense_incurred).toFixed(2)}` : "—"} iconColor="text-orange-600" />
            </Section>
          )}

          {/* Additional Information */}
          {data && (data.suggestions || data.Suggestions || data.collaborative_activities || data.CollaborativeActivities) && (
            <Section title="Additional Information" icon={Briefcase}>
              {(data.suggestions || data.Suggestions) && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Suggestions for Improvements</p>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">{data.suggestions || data.Suggestions}</p>
                </div>
              )}
              {(data.collaborative_activities || data.CollaborativeActivities) && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Collaborative Activities</p>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">{data.collaborative_activities || data.CollaborativeActivities}</p>
                </div>
              )}
            </Section>
          )}
        </div>

        {/* Documents Section */}
        {data && (data.approval_document || data.ApprovalDocument) && (
          <Section title="Documents & Attachments" icon={FileText} className="mb-8">
            <DocumentCard files={data.approval_document || data.ApprovalDocument} label="Approval Documents" icon={Download} />
          </Section>
        )}

        {/* Metadata */}
        {data && (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Record Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Record ID</p>
                <p className="font-medium text-gray-900">{data.id}</p>
              </div>
              {data.created_at && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Created</p>
                  <p className="font-medium text-gray-900">{formatDate(data.created_at)}</p>
                </div>
              )}
              {data.updated_at && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Last Updated</p>
                  <p className="font-medium text-gray-900">{formatDate(data.updated_at)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Debug Section */}
        <details className="bg-gray-100 rounded-lg border border-gray-300 p-4">
          <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">Debug Info</summary>
          <pre className="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-xs max-h-48">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
