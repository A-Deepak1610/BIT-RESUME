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
  Camera,
  Tag,
  GraduationCap,
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
        <div className="p-2 rounded-lg bg-teal-100 text-teal-600">
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
      className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 rounded-xl hover:shadow-md hover:border-teal-200 transition-all group"
    >
      <div className="p-3 bg-teal-100 rounded-lg text-teal-600 group-hover:bg-teal-200 transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">Click to view document</p>
      </div>
      <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
    </a>
  );
};

export default function ExternalVipVisitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}api/faculty/externalVipVisitGet`, {
          withCredentials: true,
        });
        const visits = response.data.externalVipVisits || [];
        const foundVisit = visits.find((v) => v.id === parseInt(id));
        if (foundVisit) {
          setVisit(foundVisit);
        } else {
          setError("External VIP Visit not found");
        }
      } catch (err) {
        console.error("Error fetching External VIP Visit:", err);
        setError("Failed to load External VIP Visit details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVisit();
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
          <Loader2 className="h-12 w-12 animate-spin text-teal-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading External VIP Visit details...</p>
        </div>
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "External VIP Visit not found"}</p>
          <button
            onClick={() => navigate("/faculty/outside-world-interaction")}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
          >
            Back to Outside World Interaction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-600 shadow-lg">
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
              <h1 className="text-3xl font-bold text-white">{visit.event_name || "External VIP Visit"}</h1>
              <p className="text-teal-200 mt-1 text-lg">
                {visit.designation} - {visit.organization_name}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={visit.verification_status} />
              {visit.task_id && (
                <span className="px-3 py-1.5 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                  Task ID: {visit.task_id}
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
              <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Visit Date</p>
                <p className="font-semibold text-gray-900">{formatDate(visit.start_date)?.split(" ").slice(1).join(" ") || "N/A"}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Category</p>
                <p className="font-semibold text-gray-900">{visit.category || "N/A"}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Factory className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Industry Guest</p>
                <p className="font-semibold text-gray-900">{visit.guest_belongs_to_industry || "N/A"}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">BIT Alumni</p>
                <p className="font-semibold text-gray-900">{visit.is_bit_alumni || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Event Information */}
          <Section title="Event Information" icon={Calendar}>
            <InfoRow icon={Briefcase} label="Event Name" value={visit.event_name} iconColor="text-teal-600" />
            <InfoRow icon={Tag} label="Event Type" value={visit.event_type} iconColor="text-cyan-600" />
            <InfoRow icon={Award} label="Category" value={visit.category} iconColor="text-purple-600" />
            <InfoRow icon={Calendar} label="Start Date" value={formatDate(visit.start_date)} iconColor="text-blue-600" />
            <InfoRow icon={Calendar} label="End Date" value={formatDate(visit.end_date)} iconColor="text-red-600" />
          </Section>

          {/* Guest Information */}
          <Section title="Guest Information" icon={User}>
            <InfoRow icon={User} label="Designation" value={visit.designation} iconColor="text-teal-600" />
            <InfoRow icon={Building2} label="Organization Name" value={visit.organization_name} iconColor="text-indigo-600" />
            <InfoRow icon={MapPin} label="Organization Address" value={visit.organization_address} iconColor="text-red-600" />
            <InfoRow icon={Phone} label="Mobile Number" value={visit.mobile_number} iconColor="text-green-600" />
            <InfoRow icon={Mail} label="Guest Email" value={visit.guest_email} iconColor="text-blue-600" />
          </Section>

          {/* Visit Details */}
          <Section title="Visit Details" icon={Target}>
            <InfoRow icon={Building2} label="Department Visit" value={visit.department_visit} iconColor="text-purple-600" />
            <InfoRow icon={MessageSquare} label="Topic Presented" value={visit.topic_presented} iconColor="text-teal-600" />
            <InfoRow icon={Target} label="Purpose of Visit" value={visit.purpose_of_visit} iconColor="text-indigo-600" />
          </Section>

          {/* Classification */}
          <Section title="Classification" icon={Factory}>
            <InfoRow icon={Factory} label="Guest Belongs to Industry" value={visit.guest_belongs_to_industry} iconColor="text-purple-600" />
            <InfoRow icon={GraduationCap} label="Is BIT Alumni" value={visit.is_bit_alumni} iconColor="text-amber-600" />
            <InfoRow icon={Briefcase} label="Special Labs Involved" value={visit.special_labs_involved} iconColor="text-teal-600" />
            {visit.special_labs_involved === "Yes" && (
              <InfoRow icon={Briefcase} label="Special Lab" value={visit.special_lab} iconColor="text-cyan-600" />
            )}
          </Section>

          {/* Faculty Information */}
          <Section title="Faculty Information" icon={Users}>
            <InfoRow icon={User} label="Faculty" value={visit.faculty} iconColor="text-blue-600" />
            <InfoRow icon={FileText} label="Task ID" value={visit.task_id} iconColor="text-gray-600" />
          </Section>
        </div>

        {/* Documents Section */}
        {(visit.formal_photo || visit.photo_proof || visit.approval_letter) && (
          <Section title="Documents & Attachments" icon={FileText} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DocumentCard file={visit.formal_photo} label="Formal Photo" icon={Camera} />
              <DocumentCard file={visit.photo_proof} label="Photo Proof" icon={Camera} />
              <DocumentCard file={visit.approval_letter} label="Approval Letter" icon={FileText} />
            </div>
          </Section>
        )}

        {/* Footer Info */}
        {visit.created_at && (
          <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            Submitted on {formatDate(visit.created_at)}
          </div>
        )}
      </div>
    </div>
  );
}
