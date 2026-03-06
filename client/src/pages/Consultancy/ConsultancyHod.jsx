import React, { useState, useEffect } from "react";
import useAuth from "../../store/UseAuth";
import FormDataCard from "./forms/FormDataCard";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:6001";

/* helpers */
const fmtDate = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return "—"; }
};

const inferWorkType = (text) => {
  const n = (text || "").toLowerCase();
  if (!n) return "";
  if (n.includes("drone")) return "Drone";
  if (n.includes("industrial training") || n.includes("training")) return "Industrial Training Project";
  if (n.includes("software")) return "Software Project";
  return "";
};

const STATUS_MAP = {
  pending_hod:      { label: "Pending Faculty Assignment",      bg: "bg-amber-50",  border: "border-amber-300",  text: "text-amber-700"  },
  pending_faculty:  { label: "Awaiting Faculty Response",        bg: "bg-blue-50",   border: "border-blue-300",   text: "text-blue-700"   },
  form_pending:     { label: "Awaiting Faculty Form Submission", bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-700" },
  completed:        { label: "Completed",                        bg: "bg-green-50",  border: "border-green-300",  text: "text-green-700"  },
  faculty_rejected: { label: "Rejected by Faculty",             bg: "bg-red-50",    border: "border-red-300",    text: "text-red-700"    },
};

const StatusBadge = ({ rawStatus }) => {
  const s = STATUS_MAP[rawStatus] || { label: rawStatus || "Unknown", bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600" };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${s.bg} ${s.border} ${s.text}`}>
      {s.label}
    </span>
  );
};

const Field = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-0.5">{label}</p>
    <p className="text-base text-gray-800">{value || "—"}</p>
  </div>
);

const AttachLink = ({ url }) =>
  url ? (
    <a href={url} target="_blank" rel="noreferrer"
       className="inline-flex items-center gap-1.5 text-base text-blue-600 hover:text-blue-800 font-medium">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
      View Attachment
    </a>
  ) : null;

const Panel = ({ title, date, children, accent }) => (
  <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
      <span className={`text-sm font-bold uppercase tracking-widest ${accent || "text-slate-500"}`}>{title}</span>
      {date && <span className="text-sm text-gray-400">{date}</span>}
    </div>
    {children}
  </div>
);

/* Workflow Stepper */
const STEPS = ["IQAC Review", "HOD Assignment", "Faculty Response"];

const stepIndex = (s) => {
  if (!s || s === "pending_hod") return 1;
  if (["pending_faculty", "form_pending", "completed", "faculty_rejected"].includes(s)) return 2;
  return 0;
};

const WorkflowStepper = ({ status }) => {
  const done = stepIndex(status);
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((label, i) => {
        const completed = i < done;
        const active    = i === done;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center min-w-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-colors
                ${completed ? "bg-blue-600 border-blue-600 text-white"
                  : active   ? "bg-white border-amber-400 text-amber-500"
                  :            "bg-white border-gray-300 text-gray-400"}`}>
                {completed ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={`mt-1.5 text-sm font-semibold whitespace-nowrap
                ${completed ? "text-blue-600" : active ? "text-amber-600" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mb-4 mx-1 ${completed ? "bg-blue-400" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* Panel sub-components */
const SubmissionPanel = ({ work }) => (
  <Panel title="Principal Submission" date={fmtDate(work.submitted_at)} accent="text-slate-500">
    <Field label="Project Title"       value={work.project_title} />
    <Field label="Client Organisation" value={work.client_organization} />
    <Field label="Work Description"    value={work.work_description} />
    <Field label="Expected Completion" value={fmtDate(work.expected_completion_date)} />
    <AttachLink url={work.attachment_url ? BASE_URL + work.attachment_url : null} />
  </Panel>
);

const IqacPanel = ({ ia }) => (
  <Panel title="IQAC Assignment" date={fmtDate(ia.assigned_at)} accent="text-blue-600">
    <Field label="Department"   value={ia.department_name} />
    <Field label="Work Type"    value={ia.consultancy_work_type || inferWorkType(ia.iqac_remarks)} />
    <Field label="IQAC Remarks" value={ia.iqac_remarks} />
  </Panel>
);

const HodPanel = ({ ha }) => (
  <Panel title="HOD Assignment" date={fmtDate(ha.assigned_at)} accent="text-indigo-600">
    <Field label="Assigned Faculty" value={ha.faculty_name} />
    <Field label="HOD Remarks"      value={ha.hod_remarks} />
  </Panel>
);

const FacultyPanel = ({ fr }) => {
  const accepted = fr.response === "accepted";
  return (
    <Panel title="Faculty Response" date={fmtDate(fr.responded_at)}
           accent={accepted ? "text-green-700" : "text-red-600"}>
      <Field label="Decision"        value={accepted ? "✔ Accepted" : "✘ Rejected"} />
      <Field label="Faculty Remarks" value={fr.faculty_remarks} />
    </Panel>
  );
};

/* Work Card */
const WorkCard = ({ work, onAssign }) => {
  const ia = work.iqac_assignment;
  const ha = work.hod_assignment;
  const fr = work.faculty_response;
  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
      <div className="flex items-start justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="min-w-0">
          <h4 className="text-base font-semibold text-gray-900 truncate">{work.project_title}</h4>
          <p className="text-sm text-gray-500 mt-0.5">{work.client_organization}</p>
        </div>
        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
          <span className="text-sm text-gray-400">{fmtDate(work.submitted_at)}</span>
          <StatusBadge rawStatus={work.status} />
          {work.status === "pending_hod" && (
            <button onClick={() => onAssign(work)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded transition-colors">
              Assign Faculty
            </button>
          )}
          {work.status === "faculty_rejected" && (
            <button onClick={() => onAssign(work, true)}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors">
              Reassign Faculty
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
        <WorkflowStepper status={work.status} />
      </div>

      {work.status === "faculty_rejected" && fr && (
        <div className="px-5 py-3 bg-red-50 border-b border-red-100 flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-red-700">
            <span className="font-semibold">Faculty rejected:</span>{" "}
            {fr.faculty_remarks || "No reason provided."}{" "}
            <span className="text-red-500 font-medium ml-1">— {ha?.faculty_name}</span>
          </div>
        </div>
      )}

      <div className="p-4">
        {fr ? (
          <div className="grid grid-cols-4 gap-3">
            <SubmissionPanel work={work} />
            <IqacPanel ia={ia} />
            <HodPanel  ha={ha} />
            <FacultyPanel fr={fr} />
          </div>
        ) : ha ? (
          <div className="grid grid-cols-3 gap-3">
            <SubmissionPanel work={work} />
            <IqacPanel ia={ia} />
            <HodPanel  ha={ha} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <SubmissionPanel work={work} />
            {ia && <IqacPanel ia={ia} />}
          </div>
        )}
      </div>

      {work.form_data && (
        <div className="border-t border-gray-100 p-4">
          <FormDataCard formData={work.form_data} />
        </div>
      )}
    </div>
  );
};

/* Main Component */
const inputCls = "w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition";

const ConsultancyHod = () => {
  useAuth();

  const [works, setWorks]             = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [myDept, setMyDept]           = useState({ department_id: null, department_name: "" });
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [showForm, setShowForm]       = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);
  const [form, setForm]               = useState({ faculty_id: "", hod_remarks: "" });
  const [submitting, setSubmitting]   = useState(false);
  const [formError, setFormError]     = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError("");
      try {
        const [wRes, fRes, dRes] = await Promise.all([
          fetch(`${BASE_URL}/api/hod/consultancyGet`, { credentials: "include" }),
          fetch(`${BASE_URL}/api/hod/facultyList`,    { credentials: "include" }),
          fetch(`${BASE_URL}/api/hod/myDepartment`,   { credentials: "include" }),
        ]);
        if (!wRes.ok) throw new Error((await wRes.json().catch(() => ({}))).error || "Failed to fetch works");
        if (!fRes.ok) throw new Error((await fRes.json().catch(() => ({}))).error || "Failed to fetch faculty");
        const wJson = await wRes.json();
        const fJson = await fRes.json();
        setWorks(wJson.data || []);
        setFacultyList(fJson.data || []);
        if (dRes.ok) setMyDept(await dRes.json());
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const openAssign = (work, isReassign = false) => {
    setAssignTarget({ workId: work.id, iqacAssignmentId: work.iqac_assignment?.id, title: work.project_title, isReassign });
    setForm({ faculty_id: "", hod_remarks: "" });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false); setAssignTarget(null);
    setForm({ faculty_id: "", hod_remarks: "" }); setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.faculty_id) {
      setFormError("Please select a faculty member.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const endpoint = assignTarget.isReassign
        ? `${BASE_URL}/api/hod/consultancyReassign`
        : `${BASE_URL}/api/hod/consultancyAssign`;
      const res = await fetch(endpoint, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultancy_work_id: assignTarget.workId,
          iqac_assignment_id:  assignTarget.iqacAssignmentId,
          faculty_id:          parseInt(form.faculty_id, 10),
          hod_remarks:         form.hod_remarks,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      const wRes  = await fetch(`${BASE_URL}/api/hod/consultancyGet`, { credentials: "include" });
      const wJson = await wRes.json();
      setWorks(wJson.data || []);
      closeForm();
    } catch (e) { setFormError(e.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500 text-base">Loading assignments…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">HOD — Consultancy Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {myDept.department_name
                ? `Consultancy works assigned to ${myDept.department_name}. Assign faculty from your department.`
                : "Review IQAC-assigned works and assign faculty members."}
            </p>
          </div>
          {myDept.department_name && (
            <span className="px-3 py-1 rounded text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {myDept.department_name}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
      )}

      {!error && works.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <svg className="mx-auto h-10 w-10 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-base font-medium text-gray-500">
            {myDept.department_id
              ? `No consultancy works assigned to ${myDept.department_name} yet.`
              : "Your account is not mapped to any department. Contact IQAC admin."}
          </p>
        </div>
      )}

      {!error && works.length > 0 && (
        <div className="flex gap-6 p-6">
          <div className={`${showForm ? "w-2/3" : "w-full"} space-y-4 transition-all duration-300`}>
            {works.map((work) => (
              <WorkCard key={work.id} work={work} onAssign={openAssign} />
            ))}
          </div>

          {showForm && assignTarget && (
            <div className="w-1/3 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded shadow-sm sticky top-6">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-800">
                    {assignTarget.isReassign ? "HOD — Reassign Faculty" : "HOD — Allot Faculty"}
                  </h2>
                  <button onClick={closeForm}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {assignTarget.isReassign
                      ? <>The previous faculty rejected this work. Reassign to another faculty member for <span className="font-medium text-gray-700">{assignTarget.title}</span>.</>
                      : <>Assign a faculty member to{" "}<span className="font-medium text-gray-700">{assignTarget.title}</span>.{" "}The assignment will appear in the faculty portal.</>
                    }
                  </p>
                  {formError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{formError}</div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Select Faculty <span className="text-red-500">*</span>
                    </label>
                    <select value={form.faculty_id}
                      onChange={(e) => setForm((p) => ({ ...p, faculty_id: e.target.value }))}
                      className={inputCls} required>
                      <option value="">Select Faculty Member</option>
                      {facultyList.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                    {facultyList.length === 0 && (
                      <p className="text-sm text-amber-600 mt-1">No faculty found in your department.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      HOD Remarks
                    </label>
                    <textarea value={form.hod_remarks}
                      onChange={(e) => setForm((p) => ({ ...p, hod_remarks: e.target.value }))}
                      placeholder="Reason for faculty selection, workload considerations, milestones…"
                      rows={4} className={`${inputCls} resize-vertical`} />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-base font-medium py-2.5 rounded transition-colors flex items-center justify-center gap-2">
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Assigning…</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>{assignTarget.isReassign ? "Reassign Faculty & Notify" : "Assign Faculty & Notify"}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultancyHod;
