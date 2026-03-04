import React, { useState } from "react";

const fmt = (n) =>
  n ? `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : "—";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "—");

/** Inline filled value — mimics the dotted underline input from the actual forms */
const Val = ({ value, wide }) => (
  <span
    className={`inline-block align-bottom border-b-2 border-dotted border-gray-400 px-1 min-h-[1.6em] text-base font-medium text-gray-900 ${wide ? "min-w-[220px]" : "min-w-[160px]"}`}
  >
    {value || ""}
  </span>
);

/** Read-only checkbox */
const ROCheckbox = ({ checked, label }) => (
  <label className="flex items-center gap-2 whitespace-nowrap cursor-default select-none">
    <input type="checkbox" readOnly checked={!!checked} className="h-4 w-4 pointer-events-none" />
    <span className="text-base">{label}</span>
  </label>
);

const SPLIT_OPTIONS = [
  { code: "40-60", label: "40% Institute / 60% Faculty" },
  { code: "30-70", label: "30% Institute / 70% Faculty" },
  { code: "80-20", label: "80% Institute / 20% Faculty" },
  { code: "0-100", label: "100% Faculty" },
  { code: "ROI",   label: "ROI" },
];

const MembersTableView = ({ members }) => {
  if (!members || members.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 border-collapse text-base">
        <thead>
          <tr className="bg-gray-50">
            {["S.No.", "Name", "Designation", "Department", "Financial Split %", "Amount in Rupees"].map((h) => (
              <th key={h} className="border border-gray-300 px-4 py-3 text-left font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <tr key={i} className="even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-3">{m.s_no || i + 1}.</td>
              <td className="border border-gray-300 px-4 py-3 font-medium">{m.name || "—"}</td>
              <td className="border border-gray-300 px-4 py-3">{m.designation || "—"}</td>
              <td className="border border-gray-300 px-4 py-3">{m.department || "—"}</td>
              <td className="border border-gray-300 px-4 py-3">{m.financial_split || "—"}</td>
              <td className="border border-gray-300 px-4 py-3 font-medium">
                {m.amount ? Number(m.amount).toLocaleString("en-IN") : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Drone / Project Declaration read-only view ────────────────────────────────
const DroneDeclarationView = ({ f, isDrone }) => (
  <div className="space-y-7">
    <div className="flex items-start justify-between gap-6 pb-4 border-b-2 border-gray-200">
      <div className="text-xl font-bold text-gray-900 leading-snug">
        {isDrone
          ? "Annexure 3 (A): Principal Investigator Declaration on Plan of Action"
          : "Annexure — Project Declaration Form"}
      </div>
      <div className="whitespace-nowrap text-base font-semibold shrink-0 text-gray-700">
        OWI REF NO: <Val value={f.owi_ref_no} />
      </div>
    </div>

    <div className="space-y-4 text-base">
      <div className="leading-loose">
        <span className="font-bold">A.1</span> Project Duration (Planned): From{" "}
        <Val value={fmtDate(f.duration_from)} /> To <Val value={fmtDate(f.duration_to)} />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="whitespace-nowrap font-medium">Total Consultancy Amount in Rs. (With GST):</span>
        <Val value={fmt(f.total_amount_with_gst)} wide />
        <span className="whitespace-nowrap font-medium">(Without GST):</span>
        <Val value={fmt(f.total_amount_without_gst)} wide />
      </div>
      {f.quotation_file_url && (
        <div>
          <span className="font-semibold">Quotation Report: </span>
          <a href={f.quotation_file_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-base">
            View File
          </a>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
        <span className="font-bold whitespace-nowrap">Recommended Financial Split:</span>
        {SPLIT_OPTIONS.map((opt) => (
          <ROCheckbox key={opt.code} checked={f.financial_split === opt.code} label={opt.label} />
        ))}
      </div>
    </div>

    {f.members && f.members.length > 0 && (
      <div>
        <div className="font-bold text-base mb-3 text-gray-800">List of members involved:</div>
        <MembersTableView members={f.members} />
      </div>
    )}

    {f.equipment && f.equipment.length > 0 && (
      <div>
        <div className="font-bold text-lg text-gray-800 mb-1">A.2</div>
        <div className="font-semibold text-base mb-3">List of Equipment/Facility required and its accessibility status:</div>
        <div className="space-y-3 text-base">
          {f.equipment.map((eq, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3">
              <span className="w-6 font-semibold">{i + 1}.</span>
              <span className="inline-block border-b-2 border-dotted border-gray-400 px-2 min-w-[280px] text-base font-medium">{eq.item || "—"}</span>
              <ROCheckbox checked={eq.calibration_done_readily_available} label="Calibration Done & Readily Available" />
              <ROCheckbox checked={eq.requires_maintenance} label="Requires Maintenance" />
            </div>
          ))}
        </div>
      </div>
    )}

    {f.activities && f.activities.length > 0 && (
      <div>
        <div className="font-bold text-base mb-3 text-gray-800">Activity Plan:</div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 border-collapse text-base">
            <thead>
              <tr className="bg-gray-50">
                {["Proposed Activity", "Description & Resources", "Consumables Available", "Start Date", "End Date", "Responsible Person(s)"].map((h) => (
                  <th key={h} className="border border-gray-300 px-4 py-3 text-left font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {f.activities.map((a, i) => (
                <tr key={i} className="even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">{a.proposed_activity || "—"}</td>
                  <td className="border border-gray-300 px-4 py-3">{a.description || "—"}</td>
                  <td className="border border-gray-300 px-4 py-3">{a.availability || "—"}</td>
                  <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">{fmtDate(a.start_date)}</td>
                  <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">{fmtDate(a.end_date)}</td>
                  <td className="border border-gray-300 px-4 py-3">{a.responsible || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

// ─── Industrial Project read-only view ────────────────────────────────────────
const IndustrialProjectView = ({ f }) => (
  <div className="space-y-7">
    <div className="flex items-start justify-between gap-6 pb-4 border-b-2 border-gray-200">
      <div className="text-xl font-bold text-gray-900 leading-snug">Annexure — Industrial Training Project Form</div>
      <div className="whitespace-nowrap text-base font-semibold shrink-0 text-gray-700">
        OWI REF NO: <Val value={f.owi_ref_no} />
      </div>
    </div>

    <div className="space-y-4 text-base">
      <div className="leading-loose">
        <span className="font-bold">B.1</span> Training Duration (Planned): From{" "}
        <Val value={fmtDate(f.duration_from)} /> To <Val value={fmtDate(f.duration_to)} />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="whitespace-nowrap font-medium">Total Amount in Rs. (With GST):</span>
        <Val value={fmt(f.total_amount_with_gst)} wide />
        <span className="whitespace-nowrap font-medium">(Without GST):</span>
        <Val value={fmt(f.total_amount_without_gst)} wide />
      </div>
      {f.quotation_file_url && (
        <div>
          <span className="font-semibold">Quotation Report: </span>
          <a href={f.quotation_file_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-base">
            View File
          </a>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
        <span className="font-bold whitespace-nowrap">Recommended Financial Split:</span>
        {SPLIT_OPTIONS.map((opt) => (
          <ROCheckbox key={opt.code} checked={f.financial_split === opt.code} label={opt.label} />
        ))}
      </div>
    </div>

    {f.members && f.members.length > 0 && (
      <div>
        <div className="font-bold text-base mb-3 text-gray-800">List of members involved:</div>
        <MembersTableView members={f.members} />
      </div>
    )}

    {f.travel_plans && f.travel_plans.length > 0 && (
      <div>
        <div className="font-bold text-lg text-gray-800 mb-1">B.2</div>
        <div className="font-semibold text-base mb-3">On-duty and travel plan:</div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 border-collapse text-base">
            <thead>
              <tr className="bg-gray-50">
                {["Proposed Activity", "Required On-Duty Date", "Travel Required", "Travel Allowance (₹)", "Dearness Allowance (₹)", "Responsible Person(s)"].map((h) => (
                  <th key={h} className="border border-gray-300 px-4 py-3 text-left font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {f.travel_plans.map((p, i) => (
                <tr key={i} className="even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">{p.proposed_activity || "—"}</td>
                  <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">{fmtDate(p.required_on_duty_date)}</td>
                  <td className="border border-gray-300 px-4 py-3">{p.travel_required || "—"}</td>
                  <td className="border border-gray-300 px-4 py-3">{p.requested_travel_allowance ? Number(p.requested_travel_allowance).toLocaleString("en-IN") : "—"}</td>
                  <td className="border border-gray-300 px-4 py-3">{p.requested_dearness_allowance ? Number(p.requested_dearness_allowance).toLocaleString("en-IN") : "—"}</td>
                  <td className="border border-gray-300 px-4 py-3">{p.responsible_persons || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {f.additional_resources && f.additional_resources.length > 0 && (
      <div>
        <div className="font-bold text-lg text-gray-800 mb-1">B.3</div>
        <div className="font-semibold text-base mb-3">Additional Resources Required (If any):</div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 border-collapse text-base">
            <thead>
              <tr className="bg-gray-50">
                {["Proposed Activity", "Description & Resources", "Consumables Available", "Responsible Person(s)"].map((h) => (
                  <th key={h} className="border border-gray-300 px-4 py-3 text-left font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {f.additional_resources.map((r, i) => (
                <tr key={i} className="even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">{r.proposed_activity || "—"}</td>
                  <td className="border border-gray-300 px-4 py-3">{r.description || "—"}</td>
                  <td className="border border-gray-300 px-4 py-3">{r.availability_of_consumables || "—"}</td>
                  <td className="border border-gray-300 px-4 py-3">{r.responsible_persons || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

const formTypeLabel = {
  drone: "Drone Consultancy",
  industrial_project: "Industrial Training Project",
  project_declaration: "Project Declaration",
};

const FormDataCard = ({ formData }) => {
  const [open, setOpen] = useState(false);
  if (!formData) return null;

  const label = formTypeLabel[formData.form_type] || formData.form_type;
  const isDrone = formData.form_type === "drone";
  const isIndustrial = formData.form_type === "industrial_project";

  return (
    <>
      {/* Trigger row */}
      <div className="mt-3 flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 min-w-0">
          {/* document icon */}
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium text-gray-600 truncate">Faculty Submitted Form</span>
          <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full shrink-0">{label}</span>
          {formData.submitted_by && (
            <span className="text-xs text-gray-400 truncate">· {formData.submitted_by}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="ml-3 shrink-0 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Form
        </button>
      </div>

      {/* Full-screen modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-8 py-5 bg-white border-b-2 border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <svg className="w-7 h-7 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="text-lg font-bold text-gray-900">Faculty Submitted Form</div>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-0.5 rounded-full font-medium">{label}</span>
                  {formData.submitted_by && (
                    <span className="text-sm text-gray-500">Submitted by <span className="font-semibold text-gray-700">{formData.submitted_by}</span></span>
                  )}
                  {formData.submitted_at && (
                    <span className="text-sm text-gray-400">
                      · {new Date(formData.submitted_at).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-6 p-2 rounded-xl text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition"
              aria-label="Close"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="max-w-5xl mx-auto px-10 py-10 text-gray-900 leading-loose">
              {isIndustrial ? (
                <IndustrialProjectView f={formData} />
              ) : (
                <DroneDeclarationView f={formData} isDrone={isDrone} />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 flex justify-end items-center gap-4 px-8 py-4 bg-white border-t border-gray-200">
            <span className="text-sm text-gray-400">Press ESC or click Close to exit</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-6 py-2 text-base font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormDataCard;
