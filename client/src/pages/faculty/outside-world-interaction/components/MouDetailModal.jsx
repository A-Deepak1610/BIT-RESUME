import React from "react";
import { X, Download, Calendar, MapPin, Users, Briefcase, Globe, Mail, Phone, FileText, Building } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const StatusBadge = ({ status }) => {
  const statusLower = (status || "pending").toLowerCase();
  const statusConfig = {
    verified: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", label: "Verified" },
    approved: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", label: "Approved" },
    rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Rejected" },
    pending: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", label: "Pending" },
    initiated: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "Initiated" },
  };
  const config = statusConfig[statusLower] || statusConfig.pending;
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

const Section = ({ title, icon: Icon, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
      {Icon && <Icon className="h-4 w-4 mr-2 text-indigo-600" />}
      {title}
    </h3>
    <div className="bg-gray-50 rounded-lg p-4">{children}</div>
  </div>
);

const InfoRow = ({ label, value }) => {
  if (!value || value === "Choose an option") return null;
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-900 text-sm font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
};

export default function MouDetailModal({ mou, onClose }) {
  if (!mou) return null;

  const documents = [
    { file: mou.apex_proof, label: "Apex Proof" },
    { file: mou.email_proof, label: "Email Proof" },
    { file: mou.signed_mou, label: "Signed MoU" },
    { file: mou.party_rights, label: "Party Rights" },
    { file: mou.nondisclosure_affidavit, label: "Non-Disclosure Affidavit" },
    { file: mou.geotag_photos, label: "Geotag Photos" },
    { file: mou.all_documents, label: "All Documents" },
  ].filter((doc) => doc.file);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{mou.legal_name_of_industry}</h2>
              <p className="text-indigo-100 mt-1">
                {mou.type_of_mou} - {mou.mou_based_on || "General"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={mou.verification_status} />
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <Section title="MoU Classification" icon={FileText}>
                <InfoRow label="Type of MoU" value={mou.type_of_mou} />
                <InfoRow label="Type of Industry" value={mou.type_of_industry} />
                <InfoRow label="MoU Based On" value={mou.mou_based_on} />
                <InfoRow label="Domain Area" value={mou.domain_area} />
                <InfoRow label="Purpose" value={mou.purpose_of_mou} />
              </Section>

              <Section title="Timeline" icon={Calendar}>
                <InfoRow label="Date of Agreement" value={mou.date_of_agreement ? new Date(mou.date_of_agreement).toLocaleDateString() : null} />
                <InfoRow label="Duration" value={mou.duration} />
                <InfoRow label="Effect From" value={mou.mou_effect_from ? new Date(mou.mou_effect_from).toLocaleDateString() : null} />
                <InfoRow label="Effect Till" value={mou.mou_effect_till ? new Date(mou.mou_effect_till).toLocaleDateString() : null} />
              </Section>

              <Section title="Faculty Information" icon={Users}>
                <InfoRow label="Faculty" value={mou.faculty} />
                <InfoRow label="SIG Number" value={mou.sig_number} />
                <InfoRow label="Task ID" value={mou.task_id} />
                <InfoRow label="Special Labs Involved" value={mou.special_labs_involved} />
                <InfoRow label="Special Lab" value={mou.special_lab} />
                <InfoRow label="Claiming Department" value={mou.mou_claiming_department} />
                <InfoRow label="No. of Faculty" value={mou.no_of_faculty ? String(mou.no_of_faculty) : null} />
              </Section>
            </div>

            {/* Right Column */}
            <div>
              <Section title="Collaborator Details" icon={Building}>
                <InfoRow label="Industry Name" value={mou.legal_name_of_industry} />
                <InfoRow label="Location" value={mou.industry_location} />
                <InfoRow label="Address" value={mou.industry_address} />
                <InfoRow label="Website" value={mou.industry_website} />
                <InfoRow label="Contact" value={mou.industry_contact} />
                <InfoRow label="Email" value={mou.industry_email} />
              </Section>

              <Section title="SPOC Details" icon={Users}>
                <InfoRow label="Name" value={mou.spoc_name} />
                <InfoRow label="Designation" value={mou.spoc_designation} />
                <InfoRow label="Email" value={mou.spoc_email} />
                <InfoRow label="Phone" value={mou.spoc_phone} />
                <InfoRow label="MoU Signing Initiated Through" value={mou.mou_signing_initiated_through} />
              </Section>

              <Section title="Agreement Scope" icon={Briefcase}>
                <div className="space-y-3 text-sm">
                  {mou.scope_of_agreement && (
                    <div>
                      <p className="text-gray-500 mb-1">Scope of Agreement</p>
                      <p className="text-gray-900">{mou.scope_of_agreement}</p>
                    </div>
                  )}
                  {mou.objectives_and_goals && (
                    <div>
                      <p className="text-gray-500 mb-1">Objectives & Goals</p>
                      <p className="text-gray-900">{mou.objectives_and_goals}</p>
                    </div>
                  )}
                  {mou.boundaries_and_limitation && (
                    <div>
                      <p className="text-gray-500 mb-1">Boundaries & Limitations</p>
                      <p className="text-gray-900">{mou.boundaries_and_limitation}</p>
                    </div>
                  )}
                </div>
              </Section>
            </div>
          </div>

          {/* Roles & Responsibilities - Full Width */}
          {(mou.bit_roles_and_responsibilities || mou.collaborator_roles_and_responsibilities) && (
            <Section title="Roles & Responsibilities" icon={FileText}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {mou.bit_roles_and_responsibilities && (
                  <div>
                    <p className="text-gray-500 mb-1 font-medium">BIT Responsibilities</p>
                    <p className="text-gray-900">{mou.bit_roles_and_responsibilities}</p>
                  </div>
                )}
                {mou.collaborator_roles_and_responsibilities && (
                  <div>
                    <p className="text-gray-500 mb-1 font-medium">Collaborator Responsibilities</p>
                    <p className="text-gray-900">{mou.collaborator_roles_and_responsibilities}</p>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Documents Section */}
          {documents.length > 0 && (
            <Section title="Documents" icon={FileText}>
              <div className="flex flex-wrap gap-2">
                {documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href={`${API_URL}${doc.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {doc.label}
                  </a>
                ))}
              </div>
            </Section>
          )}

          {/* Remarks */}
          {mou.remarks && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-1">Admin Remarks</p>
              <p className="text-sm text-yellow-700">{mou.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
