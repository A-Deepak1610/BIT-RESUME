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

export default function IrpVisitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [irpVisit, setIrpVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIrpVisit = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}api/faculty/irpVisitGet`, {
          withCredentials: true,
        });
        const visits = response.data.irpVisits || response.data.data || [];
        const visit = visits.find((v) => String(v.id) === String(id));
        if (visit) {
          setIrpVisit(visit);
        } else {
          setError("IRP Visit not found");
        }
      } catch (err) {
        console.error("Error fetching IRP Visit:", err);
        setError("Failed to load IRP Visit details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIrpVisit();
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
          <p className="mt-4 text-gray-600">Loading IRP Visit details...</p>
        </div>
      </div>
    );
  }

  if (error || !irpVisit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "IRP Visit not found"}</p>
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
              <h1 className="text-3xl font-bold text-white">IRP Visit Details</h1>
              <p className="text-indigo-200 mt-1 text-lg">
                {irpVisit.purpose_of_visit || "Industry Relationship Programme Visit"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={irpVisit.verification_status} />
              {irpVisit.task_id && (
                <span className="px-3 py-1.5 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                  Task ID: {irpVisit.task_id}
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
                <p className="text-xs text-gray-500 uppercase">Duration</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(irpVisit.from_date)?.split(" ")[1]} - {formatDate(irpVisit.to_date)?.split(" ")[1]}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Amount</p>
                <p className="font-semibold text-gray-900">
                  {irpVisit.amount_incurred ? `₹${irpVisit.amount_incurred}` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Faculty</p>
                <p className="font-semibold text-gray-900">{irpVisit.number_of_faculty || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <Factory className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Industries</p>
                <p className="font-semibold text-gray-900">{irpVisit.number_of_industry || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Faculty Information */}
          <Section title="Faculty Information" icon={User}>
            <InfoRow icon={User} label="Faculty Name" value={irpVisit.faculty} iconColor="text-blue-600" />
            <InfoRow icon={FileText} label="SIG Number" value={irpVisit.sig_number} iconColor="text-gray-600" />
            <InfoRow icon={Users} label="Number of Faculty" value={irpVisit.number_of_faculty} iconColor="text-indigo-600" />
            <InfoRow icon={Briefcase} label="Special Labs Involved" value={irpVisit.special_labs_involved} iconColor="text-purple-600" />
            {irpVisit.special_labs_involved === "Yes" && (
              <InfoRow icon={Building2} label="Special Lab" value={irpVisit.special_lab} iconColor="text-purple-600" />
            )}
          </Section>

          {/* Claiming Details */}
          <Section title="Claiming Details" icon={Building2}>
            <InfoRow icon={User} label="Claimed for Faculty" value={irpVisit.claimed_for_faculty} iconColor="text-blue-600" />
            <InfoRow icon={Building2} label="Claimed for Department" value={irpVisit.claimed_for_department} iconColor="text-indigo-600" />
            <InfoRow icon={CheckCircle} label="Type of Approval" value={irpVisit.type_of_approval} iconColor="text-green-600" />
          </Section>

          {/* Visit Details */}
          <Section title="Visit Details" icon={Calendar}>
            <InfoRow icon={Calendar} label="From Date" value={formatDate(irpVisit.from_date)} iconColor="text-green-600" />
            <InfoRow icon={Calendar} label="To Date" value={formatDate(irpVisit.to_date)} iconColor="text-red-600" />
            <InfoRow icon={MessageSquare} label="Mode of Interaction" value={irpVisit.mode_of_interaction} iconColor="text-blue-600" />
            <InfoRow icon={Briefcase} label="Purpose of Visit" value={irpVisit.purpose_of_visit} iconColor="text-orange-600" />
          </Section>

          {/* MoU Details */}
          <Section title="MoU & Financial Details" icon={Handshake}>
            <InfoRow icon={Handshake} label="Part of MoU" value={irpVisit.is_irp_visit_part_of_mou} iconColor="text-indigo-600" />
            {irpVisit.is_irp_visit_part_of_mou === "Yes" && (
              <>
                <InfoRow icon={FileText} label="MoU Name" value={irpVisit.mou_name} iconColor="text-purple-600" />
                <InfoRow icon={MessageSquare} label="Points Discussed" value={irpVisit.mou_points_discussed} iconColor="text-gray-600" />
              </>
            )}
            <InfoRow
              icon={DollarSign}
              label="Amount Incurred"
              value={irpVisit.amount_incurred ? `₹${irpVisit.amount_incurred}` : null}
              iconColor="text-green-600"
            />
            <InfoRow icon={Factory} label="Number of Industries" value={irpVisit.number_of_industry} iconColor="text-blue-600" />
          </Section>
        </div>

        {/* Documents Section */}
        {(irpVisit.apex_proof || irpVisit.geotag_photos || irpVisit.irp_form_signed || irpVisit.consolidated_document) && (
          <Section title="Documents & Attachments" icon={FileText} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocumentCard file={irpVisit.apex_proof} label="Apex Proof" icon={FileText} />
              <DocumentCard file={irpVisit.geotag_photos} label="Geotag Photos" icon={MapPin} />
              <DocumentCard file={irpVisit.irp_form_signed} label="IRP Form (Signed)" icon={FileText} />
              <DocumentCard file={irpVisit.consolidated_document} label="Consolidated Document" icon={FileText} />
            </div>
          </Section>
        )}

        {/* Footer Info */}
        {irpVisit.created_at && (
          <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            Submitted on {formatDate(irpVisit.created_at)}
          </div>
        )}
      </div>
    </div>
  );
}
