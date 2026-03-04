import React, { useState, useEffect } from "react";
import useAuth from "../../store/UseAuth";
import DroneForm from "./forms/droneform";
import IndustrialProjectForm from "./forms/industrialprojectform";
import ProjectDeclarationForm from "./forms/projectdeclarationform";

const BASE_URL = import.meta.env.VITE_API_URL || "";

function mapWork(w) {
  return {
    id: w.id,
    workType: w.project_title || w.work_type,
    clientOrganization: w.client_organization,
    workDescription: w.work_description,
    expectedCompletionDate: w.expected_completion_date,
    submittedAt: w.submitted_at,
    status: w.status,
    iqacAssignment: w.iqac_assignment
      ? {
          assignedDepartment: w.iqac_assignment.department_name,
          iqacRemarks: w.iqac_assignment.iqac_remarks,
          assignedAt: w.iqac_assignment.assigned_at,
          workType: w.iqac_assignment.consultancy_work_type || "",
        }
      : null,
    hodAssignment: w.hod_assignment
      ? {
          id: w.hod_assignment.id,
          assignedFaculty: w.hod_assignment.faculty_name,
          hodRemarks: w.hod_assignment.hod_remarks,
          assignedAt: w.hod_assignment.assigned_at,
        }
      : null,
    facultyResponse: w.faculty_response
      ? {
          response: w.faculty_response.response,
          facultyRemarks: w.faculty_response.faculty_remarks,
          respondedAt: w.faculty_response.responded_at,
        }
      : null,
  };
}

/* ─── helpers ────────────────────────────────────────────────────── */
const fmtDate = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return "—"; }
};

const STATUS_MAP = {
  pending_faculty:  { label: "Awaiting Your Response", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  form_pending:     { label: "Form Pending",            cls: "bg-orange-50 text-orange-700 border-orange-200" },
  completed:        { label: "Completed",               cls: "bg-green-50 text-green-700 border-green-200" },
  faculty_rejected: { label: "Rejected",                cls: "bg-red-50 text-red-700 border-red-200" },
  pending_hod:      { label: "Pending HOD",             cls: "bg-blue-50 text-blue-700 border-blue-200" },
  pending_iqac:     { label: "Pending IQAC",            cls: "bg-purple-50 text-purple-700 border-purple-200" },
};

const StatusBadge = ({ rawStatus }) => {
  const cfg = STATUS_MAP[rawStatus] || { label: rawStatus || "Unknown", cls: "bg-gray-50 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
};

const Field = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-base text-gray-800 leading-relaxed">{value || "—"}</p>
  </div>
);

const Panel = ({ title, date, children, accent }) => (
  <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
      <span className={`text-sm font-bold uppercase tracking-widest ${accent || "text-slate-500"}`}>{title}</span>
      {date && <span className="text-sm text-gray-400">{date}</span>}
    </div>
    {children}
  </div>
);

const STEPS = ["IQAC Review", "HOD Assignment", "Faculty Response"];
const stepIdx = (s) => {
  if (!s || s === "pending_iqac") return 0;
  if (s === "pending_hod") return 1;
  if (s === "pending_faculty") return 2;
  return 3;
};

const WorkflowStepper = ({ status }) => {
  const done = stepIdx(status);
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((label, i) => {
        const completed = i < done;
        const active    = i === done;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center min-w-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors
                ${completed ? "bg-blue-600 border-blue-600 text-white"
                  : active   ? "bg-white border-amber-400 text-amber-500"
                  :            "bg-white border-gray-300 text-gray-400"}`}>
                {completed ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              <span className={`mt-1 text-sm text-center leading-tight whitespace-nowrap
                ${completed ? "text-blue-600 font-semibold" : active ? "text-amber-600 font-semibold" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mb-4 mx-1 ${completed ? "bg-blue-400" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

function normalizeWorkType(workType) {
  if (!workType) return "";
  const map = {
    "drone": "drone",
    "Drone": "drone",
    "industrial_project": "industrial_project",
    "Industrial Training Project": "industrial_project",
    "Industrial Project": "industrial_project",
    "project_declaration": "project_declaration",
    "Project Declaration": "project_declaration",
    "Software Project": "project_declaration",
  };
  return map[workType] ?? workType.toLowerCase().replace(/\s+/g, "_");
}

function getFormTypeLabel(workType) {
  switch (normalizeWorkType(workType)) {
    case "drone": return "Drone Form";
    case "industrial_project": return "Industrial Project Form";
    case "project_declaration": return "Project Declaration Form";
    default: return workType || "Form";
  }
}

const ConsultancyFaculty = () => {
  const { user } = useAuth();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [responseForm, setResponseForm] = useState({
    action: "accept",
    remarks: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  // Form submission state
  const [activeFormWork, setActiveFormWork] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitMsg, setFormSubmitMsg] = useState(null);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/api/faculty/consultancyWorkGet`, {
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch consultancy works");
      }
      const data = await res.json();
      setWorks((data.data || data.works || []).map(mapWork));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!selectedWork) return;
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const body = {
        consultancy_work_id: selectedWork.id,
        hod_assignment_id: selectedWork.hodAssignment?.id || 0,
        response: responseForm.action === "accept" ? "accepted" : "rejected",
        faculty_remarks: responseForm.remarks,
      };
      const res = await fetch(`${BASE_URL}/api/faculty/consultancyWorkRespond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }
      setSubmitMsg({
        type: "success",
        text: data.message || "Response submitted successfully",
      });
      setSelectedWork(null);
      setResponseForm({ action: "accept", remarks: "" });
      await fetchWorks();
    } catch (err) {
      setSubmitMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form submission (after faculty accepts and fills the IQAC-assigned form)
  const handleFormSubmit = async (formData) => {
    if (!activeFormWork) return;
    setFormSubmitting(true);
    setFormSubmitMsg(null);
    try {
      const workType = normalizeWorkType(activeFormWork.iqacAssignment?.workType);

      // Upload file if present
      let fileUrl = "";
      const fileObj =
        formData.quotationFile ||
        formData.quotationReportFile ||
        null;
      if (fileObj instanceof File) {
        const uploadFD = new FormData();
        uploadFD.append("file", fileObj);
        const upRes = await fetch(`${BASE_URL}/api/principal/consultancyUpload`, {
          method: "POST",
          credentials: "include",
          body: uploadFD,
        });
        if (!upRes.ok) {
          const upErr = await upRes.json();
          throw new Error("File upload failed: " + (upErr.error || "Unknown error"));
        }
        const upData = await upRes.json();
        fileUrl = upData.url || "";
      }

      // Build common payload
      const payload = {
        consultancy_work_id: activeFormWork.id,
        form_type: workType,
        owi_ref_no: formData.owiRefNo || "BITCPP",
        quotation_file_url: fileUrl,
        financial_split: formData.financialSplit || "",
        members: (formData.members || []).map((m, i) => ({
          s_no: i + 1,
          name: m.name || "",
          designation: m.designation || "",
          department: m.department || "",
          financial_split: m.financialSplit || "",
          amount: String(m.amount || "0"),
        })),
      };

      if (workType === "drone") {
        Object.assign(payload, {
          duration_from: formData.projectDurationFrom || "",
          duration_to: formData.projectDurationTo || "",
          total_amount_with_gst: parseFloat(formData.totalAmountWithGST) || 0,
          total_amount_without_gst: parseFloat(formData.totalAmountWithoutGST) || 0,
          equipment: (formData.equipment || []).map((eq) => ({
            item: eq.item || "",
            calibration_done_readily_available: !!eq.calibrationDoneReadilyAvailable,
            requires_maintenance: !!eq.requiresMaintenance,
          })),
          activities: (formData.activities || []).map((act) => ({
            proposed_activity: act.proposedActivity || "",
            description: act.description || "",
            availability: act.availability || "",
            start_date: act.startDate || "",
            end_date: act.endDate || "",
            responsible: act.responsible || "",
          })),
        });
      } else if (workType === "industrial_project") {
        Object.assign(payload, {
          duration_from: formData.trainingDurationFrom || "",
          duration_to: formData.trainingDurationTo || "",
          total_amount_with_gst: parseFloat(formData.totalAmountWithGst) || 0,
          total_amount_without_gst: parseFloat(formData.totalAmountWithoutGst) || 0,
          travel_plans: (formData.travelPlans || []).map((tp) => ({
            proposed_activity: tp.proposedActivity || "",
            required_on_duty_date: tp.requiredOnDutyDate || "",
            travel_required: tp.travelRequired || "",
            requested_travel_allowance: parseFloat(tp.requestedTravelAllowance) || 0,
            requested_dearness_allowance: parseFloat(tp.requestedDearnessAllowance) || 0,
            responsible_persons: tp.responsiblePersons || "",
          })),
          additional_resources: (formData.additionalResources || []).map((ar) => ({
            proposed_activity: ar.proposedActivity || "",
            description: ar.description || "",
            availability_of_consumables: ar.availabilityOfConsumables || "",
            responsible_persons: ar.responsiblePersons || "",
          })),
        });
      } else if (workType === "project_declaration") {
        Object.assign(payload, {
          duration_from: formData.projectDurationFrom || "",
          duration_to: formData.projectDurationTo || "",
          total_amount_with_gst: parseFloat(formData.totalAmountWithGst) || 0,
          total_amount_without_gst: parseFloat(formData.totalAmountWithoutGst) || 0,
          equipment: (formData.equipment || []).map((eq) => ({
            item: eq.item || "",
            calibration_done_readily_available: !!eq.calibrationDoneReadilyAvailable,
            requires_maintenance: !!eq.requiresMaintenance,
          })),
          activities: (formData.activities || []).map((act) => ({
            proposed_activity: act.proposedActivity || "",
            description: act.description || "",
            availability: act.availability || "",
            start_date: act.startDate || "",
            end_date: act.endDate || "",
            responsible: act.responsible || "",
          })),
        });
      }

      const res = await fetch(`${BASE_URL}/api/faculty/consultancyFormSubmit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Form submission failed");

      setFormSubmitMsg({ type: "success", text: "Form submitted successfully! Work marked as completed." });
      setActiveFormWork(null);
      await fetchWorks();
    } catch (err) {
      setFormSubmitMsg({ type: "error", text: err.message });
    } finally {
      setFormSubmitting(false);
    }
  };

  const inputCls = "w-full px-3 py-2.5 text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition";

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500 text-base">Loading consultancy works…</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 text-sm">
        {error}
        <button onClick={fetchWorks} className="ml-4 underline hover:no-underline">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Consultancy Works</h1>
        <p className="text-sm text-gray-500 mt-1">Works assigned to you by your HOD. Accept or reject with remarks.</p>
      </div>

      <div className="p-6">
        {submitMsg && (
          <div className={`mb-4 p-3 rounded text-sm border ${
            submitMsg.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}>
            {submitMsg.text}
            <button onClick={() => setSubmitMsg(null)} className="ml-2 font-bold">×</button>
          </div>
        )}

        {works.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <svg className="mx-auto h-10 w-10 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-base font-medium text-gray-500">No consultancy works assigned to you yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {works.map((work) => {
              const ia = work.iqacAssignment;
              const ha = work.hodAssignment;
              const fr = work.facultyResponse;
              return (
                <div key={work.id} className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                  {/* Card header */}
                  <div className="flex items-start justify-between px-5 py-3.5 border-b border-gray-100">
                    <div className="min-w-0">
                      <h4 className="text-base font-semibold text-gray-900 truncate">{work.workType}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">{work.clientOrganization}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                      <span className="text-sm text-gray-400">{fmtDate(work.submittedAt)}</span>
                      <StatusBadge rawStatus={work.status} />
                      {work.status === "pending_faculty" && (
                        <button
                          onClick={() => { setSelectedWork(work); setResponseForm({ action: "accept", remarks: "" }); setSubmitMsg(null); }}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded transition-colors">
                          Respond
                        </button>
                      )}
                      {work.status === "form_pending" && (
                        <button
                          onClick={() => { setFormSubmitMsg(null); setActiveFormWork(work); }}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded transition-colors">
                          Fill {getFormTypeLabel(ia?.workType)}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stepper */}
                  <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                    <WorkflowStepper status={work.status} />
                  </div>

                  {/* Panels */}
                  <div className="p-4">
                    {fr ? (
                      <div className="grid grid-cols-4 gap-3">
                        <Panel title="Principal Submission" date={fmtDate(work.submittedAt)} accent="text-slate-500">
                          <Field label="Work Description"    value={work.workDescription} />
                          <Field label="Expected Completion" value={fmtDate(work.expectedCompletionDate)} />
                        </Panel>
                        {ia && (
                          <Panel title="IQAC Assignment" date={fmtDate(ia.assignedAt)} accent="text-blue-600">
                            <Field label="Department" value={ia.assignedDepartment} />
                            <Field label="Work Type"  value={ia.workType} />
                            <Field label="Remarks"    value={ia.iqacRemarks} />
                          </Panel>
                        )}
                        {ha && (
                          <Panel title="HOD Assignment" date={fmtDate(ha.assignedAt)} accent="text-indigo-600">
                            <Field label="Faculty" value={ha.assignedFaculty} />
                            <Field label="Remarks" value={ha.hodRemarks} />
                          </Panel>
                        )}
                        <Panel title="Faculty Response" date={fmtDate(fr.respondedAt)}
                               accent={fr.response === "accepted" ? "text-green-700" : "text-red-600"}>
                          <Field label="Decision" value={fr.response === "accepted" ? "✔ Accepted" : "✘ Rejected"} />
                          <Field label="Remarks"  value={fr.facultyRemarks} />
                        </Panel>
                      </div>
                    ) : ha ? (
                      <div className="grid grid-cols-3 gap-3">
                        <Panel title="Principal Submission" date={fmtDate(work.submittedAt)} accent="text-slate-500">
                          <Field label="Work Description"    value={work.workDescription} />
                          <Field label="Expected Completion" value={fmtDate(work.expectedCompletionDate)} />
                        </Panel>
                        {ia && (
                          <Panel title="IQAC Assignment" date={fmtDate(ia.assignedAt)} accent="text-blue-600">
                            <Field label="Department" value={ia.assignedDepartment} />
                            <Field label="Work Type"  value={ia.workType} />
                            <Field label="Remarks"    value={ia.iqacRemarks} />
                          </Panel>
                        )}
                        <Panel title="HOD Assignment" date={fmtDate(ha.assignedAt)} accent="text-indigo-600">
                          <Field label="Faculty" value={ha.assignedFaculty} />
                          <Field label="Remarks" value={ha.hodRemarks} />
                        </Panel>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Panel title="Principal Submission" date={fmtDate(work.submittedAt)} accent="text-slate-500">
                          <Field label="Work Description"    value={work.workDescription} />
                          <Field label="Expected Completion" value={fmtDate(work.expectedCompletionDate)} />
                        </Panel>
                        {ia && (
                          <Panel title="IQAC Assignment" date={fmtDate(ia.assignedAt)} accent="text-blue-600">
                            <Field label="Department" value={ia.assignedDepartment} />
                            <Field label="Work Type"  value={ia.workType} />
                            <Field label="Remarks"    value={ia.iqacRemarks} />
                          </Panel>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Submission Message Toast */}
      {formSubmitMsg && !activeFormWork && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded shadow-xl text-sm font-medium max-w-sm border ${
          formSubmitMsg.type === "success"
            ? "bg-green-50 text-green-800 border-green-200"
            : "bg-red-50 text-red-800 border-red-200"
        }`}>
          {formSubmitMsg.text}
          <button onClick={() => setFormSubmitMsg(null)} className="ml-3 font-bold text-lg leading-none">×</button>
        </div>
      )}

      {/* Full-Screen Form Overlay */}
      {activeFormWork && (() => {
      const wt = normalizeWorkType(activeFormWork.iqacAssignment?.workType);
        const commonProps = {
          selectedWork: activeFormWork,
          onBack: () => setActiveFormWork(null),
          onSubmit: handleFormSubmit,
        };
        return (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
            {/* Header bar */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">{getFormTypeLabel(wt)}</h2>
                <p className="text-sm text-gray-500">{activeFormWork.workType} — {activeFormWork.clientOrganization}</p>
              </div>
              <button
                onClick={() => setActiveFormWork(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            {/* Error message inside overlay */}
            {formSubmitMsg?.type === "error" && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {formSubmitMsg.text}
                <button onClick={() => setFormSubmitMsg(null)} className="ml-3 font-bold">×</button>
              </div>
            )}

            {formSubmitting && (
              <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Submitting form...
              </div>
            )}

            <div className="px-4 py-4">
              {wt === "drone" && <DroneForm {...commonProps} />}
              {wt === "industrial_project" && <IndustrialProjectForm {...commonProps} />}
              {wt === "project_declaration" && <ProjectDeclarationForm {...commonProps} />}
              {!wt && (
                <div className="p-8 text-center text-gray-500">
                  No form type has been assigned by IQAC for this work.
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Response Modal */}
      {selectedWork && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Respond to Consultancy Work</h2>
                <p className="text-sm text-gray-500 mt-0.5">{selectedWork.workType} — {selectedWork.clientOrganization}</p>
              </div>
              <button
                onClick={() => { setSelectedWork(null); setSubmitMsg(null); }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              {submitMsg && (
                <div className={`p-3 rounded text-sm border ${
                  submitMsg.type === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {submitMsg.text}
                </div>
              )}

              <form onSubmit={handleSubmitResponse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Your Decision</label>
                  <div className="flex gap-3">
                    <button type="button"
                      onClick={() => setResponseForm((f) => ({ ...f, action: "accept" }))}
                      className={`flex-1 py-2 px-4 rounded text-sm font-medium border transition ${
                        responseForm.action === "accept"
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                      }`}>
                      Accept
                    </button>
                    <button type="button"
                      onClick={() => setResponseForm((f) => ({ ...f, action: "reject" }))}
                      className={`flex-1 py-2 px-4 rounded text-sm font-medium border transition ${
                        responseForm.action === "reject"
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-red-400"
                      }`}>
                      Reject
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Remarks {responseForm.action === "reject" && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    value={responseForm.remarks}
                    onChange={(e) => setResponseForm((f) => ({ ...f, remarks: e.target.value }))}
                    required={responseForm.action === "reject"}
                    rows={4}
                    placeholder={responseForm.action === "accept" ? "Optional remarks…" : "Please provide a reason for rejection…"}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition resize-vertical"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button"
                    onClick={() => { setSelectedWork(null); setSubmitMsg(null); }}
                    className="flex-1 py-2.5 px-4 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className={`flex-1 py-2.5 px-4 rounded text-sm font-medium text-white transition disabled:opacity-50 ${
                      responseForm.action === "accept" ? "bg-slate-800 hover:bg-slate-700" : "bg-red-600 hover:bg-red-700"
                    }`}>
                    {submitting ? "Submitting…" : responseForm.action === "accept" ? "Confirm Accept" : "Confirm Reject"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultancyFaculty;
