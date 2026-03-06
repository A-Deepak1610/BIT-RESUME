import React, { useState, useEffect } from "react";
import useAuth from "../../store/UseAuth";
import FormDataCard from "./forms/FormDataCard";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:6001";

/* ─── IQAC REVIEW COMPONENT — replaces the incorrectly copied Principal file ─── */

/* ─── helpers ────────────────────────────────────────────────────── */
const fmtDate = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return "—"; }
};

const STATUS_MAP = {
  pending_iqac:     { label: "Awaiting IQAC Review",  bg: "bg-amber-50",  border: "border-amber-300",  text: "text-amber-700"  },
  pending_hod:      { label: "Forwarded to HOD",       bg: "bg-blue-50",   border: "border-blue-300",   text: "text-blue-700"   },
  pending_faculty:  { label: "Awaiting Faculty",        bg: "bg-indigo-50", border: "border-indigo-300", text: "text-indigo-700" },
  form_pending:     { label: "Faculty Form Pending",    bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-700" },
  completed:        { label: "Completed",               bg: "bg-green-50",  border: "border-green-300",  text: "text-green-700"  },
  faculty_rejected: { label: "Rejected by Faculty",    bg: "bg-red-50",    border: "border-red-300",    text: "text-red-700"    },
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
       className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium">
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

/* ─── Workflow stepper ───────────────────────────────────────────── */
const STEPS = ["IQAC Review", "HOD Assignment", "Faculty Response"];

const stepIndex = (s) => {
  if (!s || s === "pending_iqac") return 0;
  if (s === "pending_hod") return 1;
  return 2;
};

const WorkflowStepper = ({ status }) => {
  const done = stepIndex(status);
  return (
    <div className="flex items-center gap-0">
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

/* ─── Panel sub-components ───────────────────────────────────────── */
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
    <Field label="Department" value={ia.department_name} />
    <Field label="Work Type"  value={ia.consultancy_work_type} />
    <Field label="Remarks"    value={ia.iqac_remarks} />
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

/* ─── Work Card ──────────────────────────────────────────────────── */
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
          {work.status === "pending_iqac" && (
            <button onClick={() => onAssign(work)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded transition-colors">
              Review &amp; Assign
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
        <WorkflowStepper status={work.status} />
      </div>

      <div className="p-4">
        {fr ? (
          <div className="grid grid-cols-4 gap-3">
            <SubmissionPanel work={work} />
            {ia && <IqacPanel ia={ia} />}
            {ha && <HodPanel ha={ha} />}
            <FacultyPanel fr={fr} />
          </div>
        ) : ha ? (
          <div className="grid grid-cols-3 gap-3">
            <SubmissionPanel work={work} />
            {ia && <IqacPanel ia={ia} />}
            <HodPanel ha={ha} />
          </div>
        ) : ia ? (
          <div className="grid grid-cols-2 gap-3">
            <SubmissionPanel work={work} />
            <IqacPanel ia={ia} />
          </div>
        ) : (
          <SubmissionPanel work={work} />
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

/* ─── Main component ─────────────────────────────────────────────── */
const inputCls = "w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition";
const TAB_PENDING  = "pending";
const TAB_ALL      = "all";

const WORK_TYPES = [
  { value: "drone",               label: "Drone" },
  { value: "industrial_project",  label: "Industrial Training Project" },
  { value: "project_declaration", label: "Project Declaration" },
];

const ConsultancyIQAC = () => {
  useAuth();

  const [works, setWorks]               = useState([]);
  const [departments, setDepts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [showForm, setShowForm]         = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);
  const [form, setForm]                 = useState({ department_id: "", consultancy_work_type: "", iqac_remarks: "" });
  const [submitting, setSubmitting]     = useState(false);
  const [formError, setFormError]       = useState("");
  const [activeTab, setActiveTab]       = useState(TAB_PENDING);   // default = pending

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [wRes, dRes] = await Promise.all([
        fetch(`${BASE_URL}/api/iqac/consultancyGet`, { credentials: "include" }),
        fetch(`${BASE_URL}/api/departments`,         { credentials: "include" }),
      ]);
      if (!wRes.ok) throw new Error((await wRes.json().catch(() => ({}))).error || "Failed to fetch works");
      const wJson = await wRes.json();
      setWorks(wJson.data || []);
      if (dRes.ok) {
        const dJson = await dRes.json();
        setDepts(dJson.departments || []);
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAssign = (work) => {
    setAssignTarget({ workId: work.id, title: work.project_title });
    setForm({ department_id: "", consultancy_work_type: "", iqac_remarks: "" });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false); setAssignTarget(null);
    setForm({ department_id: "", consultancy_work_type: "", iqac_remarks: "" });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.department_id) { setFormError("Please select a department."); return; }
    if (!form.consultancy_work_type) { setFormError("Please select a work type."); return; }
    setSubmitting(true); setFormError("");
    try {
      const res = await fetch(`${BASE_URL}/api/iqac/consultancyAssign`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultancy_work_id:   assignTarget.workId,
          department_id:         parseInt(form.department_id, 10),
          consultancy_work_type: form.consultancy_work_type,
          iqac_remarks:          form.iqac_remarks,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      await load();
      closeForm();
    } catch (e) { setFormError(e.message); }
    finally { setSubmitting(false); }
  };

  const pendingCount  = works.filter((w) => w.status === "pending_iqac").length;
  const displayWorks  = activeTab === TAB_PENDING
    ? works.filter((w) => w.status === "pending_iqac")
    : works;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500 text-base">Loading consultancy works…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">IQAC — Consultancy Review</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review principal-submitted consultancy works, assign department &amp; work type.
            </p>
          </div>
          {pendingCount > 0 && (
            <span className="px-3 py-1 rounded text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-300 animate-pulse">
              {pendingCount} action{pendingCount > 1 ? "s" : ""} required
            </span>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mt-4 border-b border-gray-200 -mb-px">
          <button
            onClick={() => setActiveTab(TAB_PENDING)}
            className={`px-4 py-2 text-sm font-medium rounded-t border-b-2 transition-colors ${
              activeTab === TAB_PENDING
                ? "border-amber-500 text-amber-700 bg-amber-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            Pending Review
            {pendingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-white">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab(TAB_ALL)}
            className={`px-4 py-2 text-sm font-medium rounded-t border-b-2 transition-colors ${
              activeTab === TAB_ALL
                ? "border-slate-700 text-slate-900 bg-slate-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Works
            <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-gray-200 text-gray-600">
              {works.length}
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
      )}

      {/* ── Pending-tab empty state ── */}
      {!error && activeTab === TAB_PENDING && displayWorks.length === 0 && (
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 mb-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold text-gray-600">All caught up!</p>
          <p className="text-sm text-gray-400 mt-1">No consultancy works are waiting for your review.</p>
          <button onClick={() => setActiveTab(TAB_ALL)}
            className="mt-4 text-sm text-slate-600 underline hover:text-slate-900">
            View all works
          </button>
        </div>
      )}

      {/* ── All-tab empty state ── */}
      {!error && activeTab === TAB_ALL && displayWorks.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <svg className="mx-auto h-10 w-10 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-base font-medium text-gray-500">No consultancy works submitted yet.</p>
        </div>
      )}

      {!error && displayWorks.length > 0 && (
        <div className="flex gap-6 p-6">
          <div className={`${showForm ? "w-2/3" : "w-full"} space-y-4 transition-all duration-300`}>
            {/* ── Pending-tab action banner ── */}
            {activeTab === TAB_PENDING && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">{displayWorks.length} work{displayWorks.length > 1 ? "s" : ""}</span> submitted by the Principal
                  {displayWorks.length > 1 ? " are" : " is"} awaiting your review. Click <strong>Review &amp; Assign</strong> to forward to the relevant HOD.
                </p>
              </div>
            )}

            {displayWorks.map((work) => (
              <WorkCard key={work.id} work={work} onAssign={openAssign} />
            ))}
          </div>

          {showForm && assignTarget && (
            <div className="w-1/3 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded shadow-sm sticky top-6">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-800">IQAC — Assign Department</h2>
                  <button onClick={closeForm}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Assign <span className="font-medium text-gray-700">{assignTarget.title}</span> to a
                    department and select the consultancy work type. The HOD will be notified by email.
                  </p>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{formError}</div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select value={form.department_id}
                      onChange={(e) => setForm((p) => ({ ...p, department_id: e.target.value }))}
                      className={inputCls} required>
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.department_name}</option>
                      ))}
                    </select>
                    {departments.length === 0 && (
                      <p className="text-sm text-amber-600 mt-1">No departments found.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Consultancy Work Type <span className="text-red-500">*</span>
                    </label>
                    <select value={form.consultancy_work_type}
                      onChange={(e) => setForm((p) => ({ ...p, consultancy_work_type: e.target.value }))}
                      className={inputCls} required>
                      <option value="">Select Work Type</option>
                      {WORK_TYPES.map((wt) => (
                        <option key={wt.value} value={wt.value}>{wt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">IQAC Remarks</label>
                    <textarea value={form.iqac_remarks}
                      onChange={(e) => setForm((p) => ({ ...p, iqac_remarks: e.target.value }))}
                      placeholder="Review notes, special instructions…"
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
                        <span>Assign &amp; Notify HOD</span>
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

export default ConsultancyIQAC;
