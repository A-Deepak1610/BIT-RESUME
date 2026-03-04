import React, { useState, useEffect } from "react";
import useAuth from "../../store/UseAuth";
import FormDataCard from "./forms/FormDataCard";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:6001";

/* ─── helpers ────────────────────────────────────────────────────── */
const fmtDate = (d) => {
  try { return new Date(d).toLocaleDateString("en-IN"); } catch { return "—"; }
};

const StatusBadge = ({ rawStatus }) => {
  const map = {
    pending_iqac:      { label: "Awaiting IQAC",    cls: "bg-amber-50 text-amber-700 border-amber-200" },
    pending_hod:       { label: "Awaiting HOD",      cls: "bg-blue-50 text-blue-700 border-blue-200" },
    pending_faculty:   { label: "Awaiting Faculty",  cls: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    form_pending:      { label: "Form Pending",       cls: "bg-orange-50 text-orange-700 border-orange-200" },
    completed:         { label: "Completed",          cls: "bg-green-50 text-green-700 border-green-200" },
    faculty_rejected:  { label: "Rejected",           cls: "bg-red-50 text-red-700 border-red-200" },
  };
  const cfg = map[rawStatus] || { label: rawStatus, cls: "bg-gray-50 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
};

const Field = ({ label, value, mono }) => (
  <div>
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-base text-gray-800 leading-relaxed ${mono ? "font-mono" : ""}`}>{value || "—"}</p>
  </div>
);

const AttachLink = ({ url }) =>
  url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
      View attachment
    </a>
  ) : null;

/* ─── section panel ──────────────────────────────────────────────── */
const Panel = ({ title, date, children, accent }) => (
  <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
      <span className={`text-sm font-bold uppercase tracking-widest ${accent || "text-slate-500"}`}>{title}</span>
      {date && <span className="text-sm text-gray-400">{date}</span>}
    </div>
    {children}
  </div>
);

/* ─── workflow stepper ───────────────────────────────────────────── */
const WorkflowStepper = ({ status }) => {
  const steps = [
    { key: "iqac",    label: "IQAC Review",      ...status.iqac },
    { key: "hod",     label: "HOD Assignment",   ...status.hod },
    { key: "faculty", label: "Faculty Execution",...status.faculty },
  ];
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <React.Fragment key={step.key}>
          <div className="flex flex-col items-center gap-1 min-w-[80px]">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors
                ${step.completed
                  ? "bg-blue-600 border-blue-600"
                  : step.pending
                  ? "bg-white border-amber-400"
                  : "bg-white border-gray-300"}`}
            >
              {step.completed ? (
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : step.pending ? (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-300" />
              )}
            </div>
            <span className={`text-sm text-center leading-tight ${step.completed ? "text-blue-600 font-semibold" : step.pending ? "text-amber-600 font-semibold" : "text-gray-400"}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mb-4 mx-1 ${steps[i + 1]?.completed || steps[i + 1]?.pending ? "bg-blue-400" : "bg-gray-200"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ─── main component ─────────────────────────────────────────────── */
const ConsultancyPrincipal = () => {
  const { user } = useAuth();

  const emptyForm = {
    clientOrganization: "",
    projectTitle: "",
    workDescription: "",
    expectedCompletionDate: "",
    attachments: null,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [submittedWorks, setSubmittedWorks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/principal/consultancyGet`, { credentials: "include" });
        const result = await res.json();
        const mapped = (result.data || []).map(mapWork);
        setSubmittedWorks(mapped);
      } catch (err) {
        console.error("Failed to fetch consultancy works:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
  }, []);

  const mapWork = (work) => ({
    id: work.id,
    projectTitle: work.project_title,
    clientOrganization: work.client_organization,
    workDescription: work.work_description,
    expectedCompletionDate: work.expected_completion_date,
    submittedAt: fmtDate(work.submitted_at),
    attachmentUrl: work.attachment_url ? `${BASE_URL}${work.attachment_url}` : null,
    iqacAssignment: work.iqac_assignment ? {
      assignedDepartment: work.iqac_assignment.department_name,
      iqacRemarks: work.iqac_assignment.iqac_remarks,
      assignedAt: work.iqac_assignment.assigned_at ? fmtDate(work.iqac_assignment.assigned_at) : "",
    } : null,
    hodAssignment: work.hod_assignment ? {
      assignedFaculty: work.hod_assignment.faculty_name,
      hodRemarks: work.hod_assignment.hod_remarks,
      assignedAt: work.hod_assignment.assigned_at ? fmtDate(work.hod_assignment.assigned_at) : "",
      targetCompletionDate: null,
    } : null,
    facultyResponse: work.faculty_response ? {
      response: work.faculty_response.response,
      facultyRemarks: work.faculty_response.faculty_remarks,
      responseDate: work.faculty_response.responded_at ? fmtDate(work.faculty_response.responded_at) : "",
    } : null,
    formData: work.form_data || null,
    rawStatus: work.status,
    status: {
      iqac: {
        completed: ["pending_hod","pending_faculty","form_pending","completed","faculty_rejected"].includes(work.status),
        pending: work.status === "pending_iqac",
        label: "IQAC Review",
      },
      hod: {
        completed: ["pending_faculty","form_pending","completed","faculty_rejected"].includes(work.status),
        pending: work.status === "pending_hod",
        label: "HOD Assignment",
      },
      faculty: {
        completed: ["completed"].includes(work.status),
        pending: ["pending_faculty","form_pending"].includes(work.status),
        label: "Faculty Execution",
      },
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, attachments: file }));
    setUploadedFile(null);
    setUploading(true);
    try {
      const fileForm = new FormData();
      fileForm.append("file", file);
      const res = await fetch(`${BASE_URL}/api/principal/consultancyUpload`, {
        method: "POST", credentials: "include", body: fileForm,
      });
      if (!res.ok) { const err = await res.json(); alert("Upload failed: " + err.error); setFormData((p) => ({ ...p, attachments: null })); return; }
      const result = await res.json();
      setUploadedFile({ url: `${BASE_URL}${result.url}`, filename: result.filename });
    } catch (err) {
      alert("File upload failed. Please try again.");
      setFormData((p) => ({ ...p, attachments: null }));
    } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) { alert("Please wait for the file to finish uploading."); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/principal/consultancyPost`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_title: formData.projectTitle,
          client_organization: formData.clientOrganization,
          work_description: formData.workDescription,
          expected_completion_date: formData.expectedCompletionDate,
          attachment_url: uploadedFile?.url ?? "",
        }),
      });
      if (!res.ok) { const err = await res.json(); alert("Submission failed: " + err.error); return; }
      const result = await res.json();
      const newWork = mapWork({ ...result.data, status: "pending_iqac" });
      setSubmittedWorks((prev) => [newWork, ...prev]);
      setFormData(emptyForm);
      setUploadedFile(null);
      setShowForm(false);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally { setSubmitting(false); }
  };

  const handleNewInitiative = () => {
    setUploadedFile(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const inputCls = "w-full px-3 py-2.5 text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Consultancy Works</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track all external consultancy initiatives</p>
          </div>
          <button
            onClick={handleNewInitiative}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-base font-medium rounded transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Initiative
          </button>
        </div>
      </div>

      <div className="p-6 flex gap-6 items-start">
        {/* ── Submission Form ── */}
        {showForm && (
          <div className="w-72 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-800">Initiate New Work</h2>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed">
                  Describe the external work request. IQAC will be notified upon submission.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Client Organization</label>
                  <input type="text" name="clientOrganization" value={formData.clientOrganization}
                    onChange={handleInputChange} placeholder="e.g. City Municipal Corporation"
                    className={inputCls} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Project Title</label>
                  <input type="text" name="projectTitle" value={formData.projectTitle}
                    onChange={handleInputChange} placeholder="Short descriptive title"
                    className={inputCls} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Work Description &amp; Requirements</label>
                  <textarea name="workDescription" value={formData.workDescription}
                    onChange={handleInputChange}
                    placeholder="Scope, deliverables, and timelines..."
                    rows={3} className={`${inputCls} resize-vertical`} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Expected Completion Date</label>
                  <input type="date" name="expectedCompletionDate" value={formData.expectedCompletionDate}
                    onChange={handleInputChange} className={inputCls} required />
                </div>

                {/* File upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Attachment <span className="text-gray-400 font-normal">(PDF / DOC)</span>
                  </label>
                  <div className="relative">
                    <input type="file" name="attachments" onChange={handleFileChange}
                      accept=".pdf,.doc,.docx" disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" />
                    <div className={`border rounded px-3 py-2.5 text-center text-sm transition-colors
                      ${uploadedFile ? "border-green-300 bg-green-50 text-green-700"
                        : uploading ? "border-slate-300 bg-slate-50 text-slate-500"
                        : "border-dashed border-gray-300 hover:border-gray-400 text-gray-500"}`}>
                      {uploading ? "Uploading…"
                        : uploadedFile ? `✓ ${uploadedFile.filename}`
                        : "Click to choose file"}
                    </div>
                  </div>
                  {uploadedFile && (
                    <AttachLink url={uploadedFile.url} />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-base font-medium rounded transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Submitting…
                    </>
                  ) : "Submit & Notify IQAC"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Works list ── */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <p className="text-base text-gray-500 py-10 text-center">Loading…</p>
          ) : submittedWorks.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg className="mx-auto h-10 w-10 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-base font-medium text-gray-500">No consultancy works yet</p>
              <p className="text-sm mt-1">Click "New Initiative" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submittedWorks.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── work card ──────────────────────────────────────────────────── */
const WorkCard = ({ work }) => (
  <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
    {/* Card header */}
    <div className="flex items-start justify-between px-5 py-3.5 border-b border-gray-100">
      <div className="min-w-0">
        <h4 className="text-base font-semibold text-gray-900 truncate">{work.projectTitle}</h4>
        <p className="text-sm text-gray-500 mt-0.5">{work.clientOrganization}</p>
      </div>
      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        <span className="text-sm text-gray-400">{work.submittedAt}</span>
        <StatusBadge rawStatus={work.rawStatus} />
      </div>
    </div>

    {/* Workflow stepper */}
    <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
      <WorkflowStepper status={work.status} />
    </div>

    {/* Detail panels */}
    <div className="p-4">
      {work.facultyResponse ? (
        <div className="grid grid-cols-4 gap-3">
          <SubmissionPanel work={work} />
          <IqacPanel assignment={work.iqacAssignment} />
          <HodPanel assignment={work.hodAssignment} />
          <FacultyPanel response={work.facultyResponse} />
        </div>
      ) : work.iqacAssignment ? (
        <div className="grid grid-cols-3 gap-3">
          <SubmissionPanel work={work} />
          <IqacPanel assignment={work.iqacAssignment} />
          <Panel title="Progress" accent="text-slate-500">
            <p className="text-sm text-amber-600 font-medium">Waiting for HOD assignment</p>
          </Panel>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <SubmissionPanel work={work} />
          <Panel title="Progress" accent="text-slate-500">
            <p className="text-sm text-amber-600 font-medium">Waiting for IQAC review</p>
          </Panel>
        </div>
      )}
    </div>

    {work.formData && (
      <div className="border-t border-gray-100 p-4">
        <FormDataCard formData={work.formData} />
      </div>
    )}
  </div>
);

const SubmissionPanel = ({ work }) => (
  <Panel title="Submission Details" accent="text-slate-500">
    <Field label="Client Organization" value={work.clientOrganization} />
    <Field label="Work Description" value={work.workDescription} />
    <Field label="Expected Completion" value={fmtDate(work.expectedCompletionDate)} />
    {work.attachmentUrl && <AttachLink url={work.attachmentUrl} />}
  </Panel>
);

const IqacPanel = ({ assignment }) => (
  <Panel title="IQAC Assignment" accent="text-slate-500" date={assignment?.assignedAt}>
    <Field label="Assigned Department" value={assignment?.assignedDepartment} />
    <Field label="Remarks" value={assignment?.iqacRemarks} />
    <p className="text-sm text-green-700 font-medium pt-1">Forwarded to HOD</p>
  </Panel>
);

const HodPanel = ({ assignment }) => (
  <Panel title="HOD Assignment" accent="text-slate-500" date={assignment?.assignedAt}>
    <Field label="Assigned Faculty" value={assignment?.assignedFaculty} />
    <Field label="Target Completion"
      value={assignment?.targetCompletionDate ? fmtDate(assignment.targetCompletionDate) : "—"} />
    <Field label="Remarks" value={assignment?.hodRemarks} />
  </Panel>
);

const FacultyPanel = ({ response }) => {
  const accepted = response?.response === "accepted";
  return (
    <Panel
      title="Faculty Response"
      accent={accepted ? "text-green-700" : "text-red-600"}
      date={response?.responseDate}
    >
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Decision</p>
        <span className={`inline-block text-base font-semibold ${accepted ? "text-green-700" : "text-red-600"}`}>
          {accepted ? "Accepted" : "Rejected"}
        </span>
      </div>
      <Field label="Remarks" value={response?.facultyRemarks} />
      <p className={`text-sm font-medium pt-1 ${accepted ? "text-green-700" : "text-red-600"}`}>
        {accepted ? "All officials notified" : "Rejection communicated"}
      </p>
    </Panel>
  );
};

export default ConsultancyPrincipal;