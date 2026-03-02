import React from "react";
import {
  X,
  Download,
  Calendar,
  MapPin,
  User,
  Users,
  Briefcase,
  FileText,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  Factory,
  Handshake,
  MessageSquare,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

// Helper component for status badge
const StatusBadge = ({ status }) => {
  const statusLower = (status || "pending").toLowerCase();
  const statusConfig = {
    verified: { bg: "bg-green-100", text: "text-green-700", label: "Verified" },
    approved: { bg: "bg-green-100", text: "text-green-700", label: "Approved" },
    rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
    initiated: { bg: "bg-blue-100", text: "text-blue-700", label: "Initiated" },
  };
  const config = statusConfig[statusLower] || statusConfig.pending;
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// Info row component
const InfoRow = ({ icon: Icon, label, value, iconColor = "text-gray-500" }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className={`h-5 w-5 mt-0.5 ${iconColor} flex-shrink-0`} />
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
};

// Section component
const Section = ({ title, icon: Icon, children }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
      {Icon && <Icon className="h-5 w-5 text-indigo-600" />}
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

// Document link component
const DocumentLink = ({ file, label }) => {
  if (!file) return null;
  return (
    <a
      href={`${API_URL}${file}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
    >
      <Download className="h-4 w-4" />
      {label}
    </a>
  );
};

export default function IrpVisitDetailModal({ irpVisit, onClose }) {
  if (!irpVisit) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between z-10">
            <div className="text-white">
              <h2 className="text-xl font-bold">IRP Visit Details</h2>
              <p className="text-amber-100 text-sm mt-0.5">
                {irpVisit.purpose_of_visit || "Industry Relationship Programme Visit"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Status and Key Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-gray-200">
              <StatusBadge status={irpVisit.verification_status} />
              {irpVisit.mode_of_interaction && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {irpVisit.mode_of_interaction}
                </span>
              )}
              {irpVisit.type_of_approval && irpVisit.type_of_approval !== "Choose an option" && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {irpVisit.type_of_approval} Approval
                </span>
              )}
              {irpVisit.task_id && (
                <span className="text-sm text-gray-500">Task ID: {irpVisit.task_id}</span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                {/* Faculty Information */}
                <Section title="Faculty Information" icon={User}>
                  <InfoRow icon={User} label="Faculty Name" value={irpVisit.faculty} iconColor="text-blue-500" />
                  <InfoRow icon={FileText} label="SIG Number" value={irpVisit.sig_number} iconColor="text-gray-500" />
                  <InfoRow icon={Users} label="No. of Faculty" value={irpVisit.number_of_faculty} iconColor="text-indigo-500" />
                  <InfoRow icon={Briefcase} label="Special Labs Involved" value={irpVisit.special_labs_involved} iconColor="text-purple-500" />
                  {irpVisit.special_labs_involved === "Yes" && (
                    <InfoRow icon={Briefcase} label="Special Lab" value={irpVisit.special_lab} iconColor="text-purple-500" />
                  )}
                </Section>

                {/* Claiming Details */}
                <Section title="Claiming Details" icon={Building2}>
                  <InfoRow icon={User} label="Claimed for Faculty" value={irpVisit.claimed_for_faculty} iconColor="text-blue-500" />
                  <InfoRow icon={Building2} label="Claimed for Department" value={irpVisit.claimed_for_department} iconColor="text-indigo-500" />
                </Section>

                {/* Visit Details */}
                <Section title="Visit Details" icon={Calendar}>
                  <InfoRow icon={Calendar} label="From Date" value={formatDate(irpVisit.from_date)} iconColor="text-green-500" />
                  <InfoRow icon={Calendar} label="To Date" value={formatDate(irpVisit.to_date)} iconColor="text-red-500" />
                  <InfoRow icon={MessageSquare} label="Mode of Interaction" value={irpVisit.mode_of_interaction} iconColor="text-blue-500" />
                  <InfoRow icon={Briefcase} label="Purpose of Visit" value={irpVisit.purpose_of_visit} iconColor="text-orange-500" />
                </Section>
              </div>

              {/* Right Column */}
              <div>
                {/* Approval & MoU Details */}
                <Section title="Approval & MoU Details" icon={Handshake}>
                  <InfoRow icon={CheckCircle} label="Type of Approval" value={irpVisit.type_of_approval} iconColor="text-green-500" />
                  <InfoRow icon={Handshake} label="Part of MoU" value={irpVisit.is_irp_visit_part_of_mou} iconColor="text-indigo-500" />
                  {irpVisit.is_irp_visit_part_of_mou === "Yes" && (
                    <>
                      <InfoRow icon={FileText} label="MoU Name" value={irpVisit.mou_name} iconColor="text-purple-500" />
                      <InfoRow icon={MessageSquare} label="Points Discussed" value={irpVisit.mou_points_discussed} iconColor="text-gray-500" />
                    </>
                  )}
                </Section>

                {/* Financial & Industry Info */}
                <Section title="Financial & Industry Info" icon={DollarSign}>
                  <InfoRow 
                    icon={DollarSign} 
                    label="Amount Incurred" 
                    value={irpVisit.amount_incurred ? `₹${irpVisit.amount_incurred}` : null} 
                    iconColor="text-green-600" 
                  />
                  <InfoRow icon={Factory} label="No. of Industries" value={irpVisit.number_of_industry} iconColor="text-blue-500" />
                </Section>
              </div>
            </div>

            {/* Documents */}
            {(irpVisit.apex_proof || irpVisit.geotag_photos || irpVisit.irp_form_signed || irpVisit.consolidated_document) && (
              <Section title="Documents" icon={FileText}>
                <div className="flex flex-wrap gap-3">
                  <DocumentLink file={irpVisit.apex_proof} label="Apex Proof" />
                  <DocumentLink file={irpVisit.geotag_photos} label="Geotag Photos" />
                  <DocumentLink file={irpVisit.irp_form_signed} label="IRP Form (Signed)" />
                  <DocumentLink file={irpVisit.consolidated_document} label="Consolidated Document" />
                </div>
              </Section>
            )}

            {/* Created At */}
            {irpVisit.created_at && (
              <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
                <CheckCircle className="inline h-4 w-4 mr-1 text-green-500" />
                Submitted on {formatDate(irpVisit.created_at)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
