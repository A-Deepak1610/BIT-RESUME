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
  Factory,
  Handshake,
  MessageSquare,
  Loader2,
  Clock,
  MapPin,
  ExternalLink,
  Globe,
  Phone,
  Mail,
  Target,
  Shield,
  Award,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

// Helper component for status badge
const StatusBadge = ({ status }) => {
  const statusLower = (status || "pending").toLowerCase();
  const statusConfig = {
    verified: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300", label: "Verified" },
    approved: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300", label: "Approved" },
    rejected: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300", label: "Rejected" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300", label: "Pending" },
    initiated: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300", label: "Initiated" },
  };
  const config = statusConfig[statusLower] || statusConfig.pending;
  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

// Info row component
const InfoRow = ({ icon: Icon, label, value, iconColor = "text-gray-500" }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className={`p-2 rounded-lg bg-gray-50 ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</p>
        <p className="text-base text-gray-900 mt-1 font-medium">{value}</p>
      </div>
    </div>
  );
};

// Section component
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

// Document card component
const DocumentCard = ({ file, label, icon: Icon = FileText }) => {
  if (!file) return null;
  return (
    <a
      href={`${API_URL}${file}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl hover:shadow-md hover:border-indigo-200 transition-all group"
    >
      <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 group-hover:bg-indigo-200 transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">Click to view document</p>
      </div>
      <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
    </a>
  );
};

export default function MouDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mou, setMou] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMou = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}api/faculty/mouGet`, {
          withCredentials: true,
        });
        const mous = response.data.mous || [];
        const foundMou = mous.find((m) => m.id === parseInt(id));
        if (foundMou) {
          setMou(foundMou);
        } else {
          setError("MoU not found");
        }
      } catch (err) {
        console.error("Error fetching MoU:", err);
        setError("Failed to load MoU details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMou();
    }
  }, [id]);

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
          <p className="mt-4 text-gray-600">Loading MoU details...</p>
        </div>
      </div>
    );
  }

  if (error || !mou) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "MoU not found"}</p>
          <button
            onClick={() => navigate("/faculty/outside-world-interaction")}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
          >
            Back to Outside World Interaction
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
              <h1 className="text-3xl font-bold text-white">{mou.legal_name_of_industry}</h1>
              <p className="text-indigo-200 mt-1 text-lg">
                {mou.type_of_mou} - {mou.mou_based_on || "General MoU"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={mou.verification_status} />
              {mou.task_id && (
                <span className="px-3 py-1.5 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                  Task ID: {mou.task_id}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Agreement Date</p>
                <p className="font-semibold text-gray-900">{formatDate(mou.date_of_agreement)?.split(" ").slice(1).join(" ")}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Duration</p>
                <p className="font-semibold text-gray-900">{mou.duration || "N/A"}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Location</p>
                <p className="font-semibold text-gray-900 truncate">{mou.industry_location || "N/A"}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <Factory className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Industry Type</p>
                <p className="font-semibold text-gray-900">{mou.type_of_industry || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Faculty Information */}
          <Section title="Faculty Information" icon={User}>
            <InfoRow icon={User} label="Faculty Name" value={mou.faculty} iconColor="text-blue-600" />
            <InfoRow icon={FileText} label="SIG Number" value={mou.sig_number} iconColor="text-gray-600" />
            <InfoRow icon={Building2} label="Claimed for Faculty" value={mou.claimed_for_faculty} iconColor="text-indigo-600" />
            <InfoRow icon={Building2} label="Claimed for Department" value={mou.claimed_for_department} iconColor="text-purple-600" />
          </Section>

          {/* MoU Classification */}
          <Section title="MoU Classification" icon={Target}>
            <InfoRow icon={Handshake} label="Type of MoU" value={mou.type_of_mou} iconColor="text-indigo-600" />
            <InfoRow icon={Target} label="MoU Based On" value={mou.mou_based_on} iconColor="text-blue-600" />
            <InfoRow icon={Briefcase} label="Domain Area" value={mou.domain_area} iconColor="text-purple-600" />
            <InfoRow icon={Award} label="Purpose of MoU" value={mou.purpose_of_mou} iconColor="text-green-600" />
            <InfoRow icon={Shield} label="Type of Approval" value={mou.type_of_approval} iconColor="text-orange-600" />
          </Section>

          {/* Timeline & Duration */}
          <Section title="Timeline & Duration" icon={Calendar}>
            <InfoRow icon={Calendar} label="Date of Agreement" value={formatDate(mou.date_of_agreement)} iconColor="text-green-600" />
            <InfoRow icon={Calendar} label="Start Date" value={formatDate(mou.start_date)} iconColor="text-blue-600" />
            <InfoRow icon={Calendar} label="End Date" value={formatDate(mou.end_date)} iconColor="text-red-600" />
            <InfoRow icon={Clock} label="Duration" value={mou.duration} iconColor="text-purple-600" />
          </Section>

          {/* Industry/Collaborator Details */}
          <Section title="Collaborator Details" icon={Building2}>
            <InfoRow icon={Building2} label="Legal Name" value={mou.legal_name_of_industry} iconColor="text-indigo-600" />
            <InfoRow icon={Factory} label="Industry Type" value={mou.type_of_industry} iconColor="text-blue-600" />
            <InfoRow icon={MapPin} label="Location" value={mou.industry_location} iconColor="text-red-600" />
            <InfoRow icon={Globe} label="Website" value={mou.website} iconColor="text-green-600" />
            <InfoRow icon={Briefcase} label="Special Lab Involved" value={mou.special_labs_involved} iconColor="text-purple-600" />
            {mou.special_labs_involved === "Yes" && (
              <InfoRow icon={Briefcase} label="Special Lab" value={mou.special_lab} iconColor="text-purple-600" />
            )}
          </Section>

          {/* SPOC Details */}
          <Section title="SPOC (Single Point of Contact)" icon={Users}>
            <InfoRow icon={User} label="SPOC Name" value={mou.spoc_name} iconColor="text-blue-600" />
            <InfoRow icon={Briefcase} label="Designation" value={mou.spoc_designation} iconColor="text-indigo-600" />
            <InfoRow icon={Phone} label="Mobile" value={mou.spoc_mobile} iconColor="text-green-600" />
            <InfoRow icon={Mail} label="Email" value={mou.spoc_email} iconColor="text-purple-600" />
          </Section>

          {/* Scope of MoU */}
          <Section title="Scope of MoU" icon={Target}>
            <InfoRow icon={CheckCircle} label="Internships" value={mou.scope_internships} iconColor="text-blue-600" />
            <InfoRow icon={CheckCircle} label="Placements" value={mou.scope_placements} iconColor="text-green-600" />
            <InfoRow icon={CheckCircle} label="Guest Lectures" value={mou.scope_guest_lectures} iconColor="text-purple-600" />
            <InfoRow icon={CheckCircle} label="Industry Visits" value={mou.scope_industry_visits} iconColor="text-orange-600" />
            <InfoRow icon={CheckCircle} label="Research Collaboration" value={mou.scope_research_collaboration} iconColor="text-indigo-600" />
            <InfoRow icon={CheckCircle} label="Faculty Training" value={mou.scope_faculty_training} iconColor="text-red-600" />
            <InfoRow icon={CheckCircle} label="Consultancy" value={mou.scope_consultancy} iconColor="text-teal-600" />
            <InfoRow icon={CheckCircle} label="Equipment Support" value={mou.scope_equipment_support} iconColor="text-amber-600" />
          </Section>

          {/* Responsibilities */}
          <Section title="Responsibilities" icon={Shield}>
            <div className="space-y-4">
              {mou.bit_responsibilities && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-600 uppercase font-semibold mb-2">BIT Responsibilities</p>
                  <p className="text-gray-700">{mou.bit_responsibilities}</p>
                </div>
              )}
              {mou.industry_responsibilities && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-xs text-purple-600 uppercase font-semibold mb-2">Industry Responsibilities</p>
                  <p className="text-gray-700">{mou.industry_responsibilities}</p>
                </div>
              )}
            </div>
          </Section>
        </div>

        {/* Documents Section */}
        {(mou.signed_mou || mou.apex_proof || mou.geotag_photos || mou.consolidated_document || mou.annexure1 || mou.annexure2) && (
          <Section title="Documents & Attachments" icon={FileText} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DocumentCard file={mou.signed_mou} label="Signed MoU" icon={FileText} />
              <DocumentCard file={mou.apex_proof} label="Apex Proof" icon={Shield} />
              <DocumentCard file={mou.geotag_photos} label="Geotag Photos" icon={MapPin} />
              <DocumentCard file={mou.consolidated_document} label="Consolidated Document" icon={FileText} />
              <DocumentCard file={mou.annexure1} label="Annexure 1" icon={FileText} />
              <DocumentCard file={mou.annexure2} label="Annexure 2" icon={FileText} />
            </div>
          </Section>
        )}

        {/* Footer Info */}
        {mou.created_at && (
          <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            Submitted on {formatDate(mou.created_at)}
          </div>
        )}
      </div>
    </div>
  );
}
