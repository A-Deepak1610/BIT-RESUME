import React, { useState } from "react";

const formTypeLabel = {
  drone: "Drone Consultancy",
  industrial_project: "Industrial Training Project",
  project_declaration: "Project Declaration",
};

const SectionHeader = ({ title }) => (
  <h6 className="text-xs font-bold uppercase tracking-wide text-gray-500 border-b border-gray-200 pb-1 mb-2">
    {title}
  </h6>
);

const Field = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-800 break-words">{value || "—"}</span>
  </div>
);

const BoolBadge = ({ val }) => (
  <span
    className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
      val ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
  >
    {val ? "Yes" : "No"}
  </span>
);

const fmt = (n) => (n ? `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : "—");

const MembersTable = ({ members }) => {
  if (!members || members.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-2 py-1 text-left">#</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Name</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Designation</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Department</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Split</th>
            <th className="border border-gray-200 px-2 py-1 text-right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <tr key={i} className="even:bg-gray-50">
              <td className="border border-gray-200 px-2 py-1">{m.s_no || i + 1}</td>
              <td className="border border-gray-200 px-2 py-1">{m.name || "—"}</td>
              <td className="border border-gray-200 px-2 py-1">{m.designation || "—"}</td>
              <td className="border border-gray-200 px-2 py-1">{m.department || "—"}</td>
              <td className="border border-gray-200 px-2 py-1">{m.financial_split || "—"}</td>
              <td className="border border-gray-200 px-2 py-1 text-right">{m.amount ? Number(m.amount).toLocaleString("en-IN") : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const EquipmentTable = ({ equipment }) => {
  if (!equipment || equipment.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-2 py-1 text-left">Item</th>
            <th className="border border-gray-200 px-2 py-1 text-center">Calibrated / Available</th>
            <th className="border border-gray-200 px-2 py-1 text-center">Needs Maintenance</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((eq, i) => (
            <tr key={i} className="even:bg-gray-50">
              <td className="border border-gray-200 px-2 py-1">{eq.item || "—"}</td>
              <td className="border border-gray-200 px-2 py-1 text-center">
                <BoolBadge val={eq.calibration_done_readily_available} />
              </td>
              <td className="border border-gray-200 px-2 py-1 text-center">
                <BoolBadge val={eq.requires_maintenance} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ActivitiesTable = ({ activities }) => {
  if (!activities || activities.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-2 py-1 text-left">Activity</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Description</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Availability</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Start</th>
            <th className="border border-gray-200 px-2 py-1 text-left">End</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Responsible</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((a, i) => (
            <tr key={i} className="even:bg-gray-50">
              <td className="border border-gray-200 px-2 py-1">{a.proposed_activity || "—"}</td>
              <td className="border border-gray-200 px-2 py-1">{a.description || "—"}</td>
              <td className="border border-gray-200 px-2 py-1">{a.availability || "—"}</td>
              <td className="border border-gray-200 px-2 py-1">{a.start_date ? new Date(a.start_date).toLocaleDateString() : "—"}</td>
              <td className="border border-gray-200 px-2 py-1">{a.end_date ? new Date(a.end_date).toLocaleDateString() : "—"}</td>
              <td className="border border-gray-200 px-2 py-1">{a.responsible || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TravelPlansTable = ({ plans }) => {
  if (!plans || plans.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-2 py-1 text-left">Activity</th>
            <th className="border border-gray-200 px-2 py-1 text-left">On-Duty Date</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Travel</th>
            <th className="border border-gray-200 px-2 py-1 text-right">TA (₹)</th>
            <th className="border border-gray-200 px-2 py-1 text-right">DA (₹)</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Responsible</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((p, i) => (
            <tr key={i} className="even:bg-gray-50">
              <td className="border border-gray-200 px-2 py-1">{p.proposed_activity || "—"}</td>
              <td className="border border-gray-200 px-2 py-1">{p.required_on_duty_date ? new Date(p.required_on_duty_date).toLocaleDateString() : "—"}</td>
              <td className="border border-gray-200 px-2 py-1">{p.travel_required || "—"}</td>
              <td className="border border-gray-200 px-2 py-1 text-right">{p.requested_travel_allowance ? Number(p.requested_travel_allowance).toLocaleString("en-IN") : "—"}</td>
              <td className="border border-gray-200 px-2 py-1 text-right">{p.requested_dearness_allowance ? Number(p.requested_dearness_allowance).toLocaleString("en-IN") : "—"}</td>
              <td className="border border-gray-200 px-2 py-1">{p.responsible_persons || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdditionalResourcesTable = ({ resources }) => {
  if (!resources || resources.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-2 py-1 text-left">Activity</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Description</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Consumables Available</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Responsible</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((r, i) => (
            <tr key={i} className="even:bg-gray-50">
              <td className="border border-gray-200 px-2 py-1">{r.proposed_activity || "—"}</td>
              <td className="border border-gray-200 px-2 py-1">{r.description || "—"}</td>
              <td className="border border-gray-200 px-2 py-1">{r.availability_of_consumables || "—"}</td>
              <td className="border border-gray-200 px-2 py-1">{r.responsible_persons || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * FormDataCard — displays the faculty-submitted form data for HOD / IQAC / Principal views.
 * Props:
 *   formData: the `form_data` object from the API response (or null)
 */
const FormDataCard = ({ formData }) => {
  const [expanded, setExpanded] = useState(false);
  if (!formData) return null;

  const label = formTypeLabel[formData.form_type] || formData.form_type;
  const isDrone = formData.form_type === "drone";
  const isIndustrial = formData.form_type === "industrial_project";
  const isDeclaration = formData.form_type === "project_declaration";

  return (
    <div className="mt-4 border border-indigo-200 rounded-lg bg-indigo-50 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-indigo-100 transition"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold text-indigo-800">Faculty Submitted Form</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-200 text-indigo-800">
            {label}
          </span>
          {formData.submitted_by && (
            <span className="text-xs text-indigo-600">by {formData.submitted_by}</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-indigo-600 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Summary row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <Field label="OWI Ref No" value={formData.owi_ref_no} />
            <Field
              label="Duration"
              value={
                formData.duration_from || formData.duration_to
                  ? `${formData.duration_from ? new Date(formData.duration_from).toLocaleDateString() : "?"} → ${formData.duration_to ? new Date(formData.duration_to).toLocaleDateString() : "?"}`
                  : null
              }
            />
            <Field label="Amount (with GST)" value={fmt(formData.total_amount_with_gst)} />
            <Field label="Amount (without GST)" value={fmt(formData.total_amount_without_gst)} />
          </div>

          {formData.financial_split && (
            <div>
              <Field label="Financial Split" value={formData.financial_split} />
            </div>
          )}

          {formData.quotation_file_url && (
            <div>
              <a
                href={formData.quotation_file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-700 underline hover:text-indigo-900"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                </svg>
                View Quotation File
              </a>
            </div>
          )}

          {/* Members */}
          {formData.members && formData.members.length > 0 && (
            <div>
              <SectionHeader title="Team Members" />
              <MembersTable members={formData.members} />
            </div>
          )}

          {/* Equipment (drone + declaration) */}
          {(isDrone || isDeclaration) && formData.equipment && formData.equipment.length > 0 && (
            <div>
              <SectionHeader title="Equipment" />
              <EquipmentTable equipment={formData.equipment} />
            </div>
          )}

          {/* Activities (drone + declaration) */}
          {(isDrone || isDeclaration) && formData.activities && formData.activities.length > 0 && (
            <div>
              <SectionHeader title="Proposed Activities" />
              <ActivitiesTable activities={formData.activities} />
            </div>
          )}

          {/* Travel plans (industrial) */}
          {isIndustrial && formData.travel_plans && formData.travel_plans.length > 0 && (
            <div>
              <SectionHeader title="Travel Plans" />
              <TravelPlansTable plans={formData.travel_plans} />
            </div>
          )}

          {/* Additional resources (industrial) */}
          {isIndustrial && formData.additional_resources && formData.additional_resources.length > 0 && (
            <div>
              <SectionHeader title="Additional Resources" />
              <AdditionalResourcesTable resources={formData.additional_resources} />
            </div>
          )}

          {formData.submitted_at && (
            <p className="text-xs text-gray-400 text-right">
              Submitted at: {new Date(formData.submitted_at).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FormDataCard;
