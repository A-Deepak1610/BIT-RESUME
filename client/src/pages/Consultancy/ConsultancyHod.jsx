import React, { useState, useEffect } from "react";
import useAuth from "../../store/UseAuth";
import FormDataCard from "./forms/FormDataCard";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const inferWorkTypeFromText = (text) => {
  const normalized = (text || "").toLowerCase();
  if (!normalized) return "";
  if (normalized.includes("drone")) return "Drone";
  if (normalized.includes("industrial training") || normalized.includes("training"))
    return "Industrial Training Project";
  if (normalized.includes("software")) return "Software Project";
  return "";
};

const StatusBadge = ({ status }) => {
  const map = {
    pending_hod:      { label: "Pending Faculty Assignment",     cls: "bg-yellow-100 text-yellow-800 border border-yellow-300" },
    pending_faculty:  { label: "Awaiting Faculty Response",       cls: "bg-blue-100 text-blue-800 border border-blue-300"   },
    form_pending:     { label: "Awaiting Faculty Form Submission", cls: "bg-orange-100 text-orange-800 border border-orange-300" },
    completed:        { label: "Completed",                        cls: "bg-green-100 text-green-800 border border-green-300" },
    faculty_rejected: { label: "Rejected by Faculty",             cls: "bg-red-100 text-red-800 border border-red-300"     },
  };
  const { label, cls } = map[status] || { label: status, cls: "bg-gray-100 text-gray-700 border border-gray-300" };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
};

const InfoRow = ({ label, value }) => (
  <div>
    <span className="font-medium text-gray-600 text-xs">{label}:</span>
    <p className="text-gray-800 mt-0.5 text-sm">{value || "-"}</p>
  </div>
);

const PrincipalCard = ({ work }) => (
  <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
    <div className="flex justify-between items-center mb-3">
      <h5 className="font-semibold text-gray-700 text-base">Principal Submission</h5>
      <span className="text-xs text-gray-500">
        {work.submitted_at ? new Date(work.submitted_at).toLocaleDateString() : ""}
      </span>
    </div>
    <InfoRow label="Client Organization" value={work.client_organization} />
    <InfoRow label="Work Description"    value={work.work_description}    />
    <InfoRow
      label="Expected Completion"
      value={work.expected_completion_date ? new Date(work.expected_completion_date).toLocaleDateString() : "-"}
    />
  </div>
);

const IQACCard = ({ ia, status }) => {
  const done = status !== "pending_hod";
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-semibold text-gray-700 text-base">IQAC Assignment</h5>
        <span className="text-xs text-gray-500">
          {ia.assigned_at ? new Date(ia.assigned_at).toLocaleDateString() : ""}
        </span>
      </div>
      <InfoRow label="Assigned Department" value={ia.department_name} />
      <InfoRow
        label="Consultancy Work Type"
        value={ia.consultancy_work_type || inferWorkTypeFromText(ia.iqac_remarks) || "-"}
      />
      <InfoRow label="IQAC Remarks" value={ia.iqac_remarks} />
      <div className="flex items-center pt-2 border-t border-gray-200">
        {done ? (
          <>
            <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-green-700">HOD Assigned</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-yellow-700">Pending HOD Action</span>
          </>
        )}
      </div>
    </div>
  );
};

const HODCard = ({ ha, status }) => {
  const done = status === "completed" || status === "faculty_rejected";
  return (
    <div className="bg-blue-50 rounded-lg p-4 space-y-3 text-sm">
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-semibold text-gray-700 text-base">HOD Assignment</h5>
        <span className="text-xs text-gray-500">
          {ha.assigned_at ? new Date(ha.assigned_at).toLocaleDateString() : ""}
        </span>
      </div>
      <InfoRow label="Assigned Faculty" value={ha.faculty_name} />
      <InfoRow label="HOD Remarks"      value={ha.hod_remarks}  />
      <div className="flex items-center pt-2 border-t border-blue-200">
        {done ? (
          <>
            <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-green-700">Faculty Responded</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-yellow-700">Waiting for Faculty Response</span>
          </>
        )}
      </div>
    </div>
  );
};

const FacultyCard = ({ fr }) => (
  <div className={`rounded-lg p-4 space-y-3 text-sm ${fr.response === "accepted" ? "bg-green-50" : "bg-red-50"}`}>
    <div className="flex justify-between items-center mb-3">
      <h5 className="font-semibold text-gray-700 text-base">Faculty Response</h5>
      <span className={`px-2 py-1 rounded text-xs font-semibold ${
        fr.response === "accepted" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}>
        {fr.response === "accepted" ? "Accepted" : "Rejected"}
      </span>
    </div>
    <InfoRow label="Faculty Remarks" value={fr.faculty_remarks} />
    {fr.responded_at && (
      <p className="text-xs text-gray-500">{new Date(fr.responded_at).toLocaleDateString()}</p>
    )}
  </div>
);

const ConsultancyHod = () => {
  useAuth();

  const [works, setWorks]             = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignTarget, setAssignTarget]     = useState(null);

  const [form, setForm] = useState({ faculty_id: "", hod_remarks: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [worksRes, facultyRes] = await Promise.all([
          fetch(`${BASE_URL}/api/hod/consultancyGet`, { credentials: "include" }),
          fetch(`${BASE_URL}/api/hod/facultyList`,    { credentials: "include" }),
        ]);
        if (!worksRes.ok) {
          const err = await worksRes.json().catch(() => ({}));
          throw new Error(err.error || `Failed to fetch works (${worksRes.status})`);
        }
        if (!facultyRes.ok) {
          const err = await facultyRes.json().catch(() => ({}));
          throw new Error(err.error || `Failed to fetch faculty (${facultyRes.status})`);
        }
        const worksData   = await worksRes.json();
        const facultyData = await facultyRes.json();
        setWorks(worksData.data   || []);
        setFacultyList(facultyData.data || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openAssignForm = (work) => {
    setAssignTarget({
      workId:           work.id,
      iqacAssignmentId: work.iqac_assignment?.id,
      title:            work.project_title,
    });
    setForm({ faculty_id: "", hod_remarks: "" });
    setFormError("");
    setShowAssignForm(true);
  };

  const closeForm = () => {
    setShowAssignForm(false);
    setAssignTarget(null);
    setForm({ faculty_id: "", hod_remarks: "" });
    setFormError("");
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
      const res = await fetch(`${BASE_URL}/api/hod/consultancyAssign`, {
        method:      "POST",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultancy_work_id: assignTarget.workId,
          iqac_assignment_id:  assignTarget.iqacAssignmentId,
          faculty_id:          parseInt(form.faculty_id, 10),
          hod_remarks:         form.hod_remarks,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);

      const worksRes  = await fetch(`${BASE_URL}/api/hod/consultancyGet`, { credentials: "include" });
      const worksData = await worksRes.json();
      setWorks(worksData.data || []);
      closeForm();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">HOD - Consultancy Management</h1>
        <p className="text-gray-600">Review IQAC assignments and assign faculty members to consultancy works</p>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
          <span className="ml-3 text-gray-600">Loading assignments...</span>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">{error}</div>
      )}

      {!loading && !error && works.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
          </svg>
          <p className="text-gray-500 font-medium">No consultancy works assigned to your department yet.</p>
        </div>
      )}

      {!loading && !error && works.length > 0 && (
        <div className="flex gap-6">
          {/* Works List */}
          <div className={`${showAssignForm ? "w-2/3" : "w-full"} transition-all duration-300`}>
            <div className="space-y-6">
              {works.map((work) => {
                const ia = work.iqac_assignment;
                const ha = work.hod_assignment;
                return (
                  <div key={work.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    {(work.status === "completed" || work.status === "faculty_rejected" || work.status === "form_pending") && (
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-4 text-sm font-medium ${
                        work.status === "completed"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : work.status === "form_pending"
                          ? "bg-orange-100 text-orange-800 border border-orange-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          {work.status === "completed" ? (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        ) : work.status === "form_pending" ? (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        )}
                        </svg>
                        {work.status === "completed" ? "✅ Workflow Completed — Faculty has accepted the work" : work.status === "form_pending" ? "⏳ Faculty Accepted — Awaiting Form Submission" : "❌ Workflow Ended — Faculty rejected the work"}
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{work.project_title}</h3>
                        <StatusBadge status={work.status} />
                      </div>
                      {work.status === "pending_hod" && (
                        <button
                          onClick={() => openAssignForm(work)}
                          className="text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                          style={{ backgroundColor: "#0200e1" }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = "#0200e1")}
                        >
                          Assign Faculty
                        </button>
                      )}
                    </div>

                    {ha ? (
                      work.faculty_response ? (
                        <div className="grid grid-cols-4 gap-4">
                          <PrincipalCard work={work} />
                          <IQACCard ia={ia} status={work.status} />
                          <HODCard ha={ha} status={work.status} />
                          <FacultyCard fr={work.faculty_response} />
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4">
                          <PrincipalCard work={work} />
                          <IQACCard ia={ia} status={work.status} />
                          <HODCard ha={ha} status={work.status} />
                        </div>
                      )
                    ) : (
                      <div className="grid grid-cols-2 gap-6">
                        <PrincipalCard work={work} />
                        <IQACCard ia={ia} status={work.status} />
                      </div>
                    )}
                    <FormDataCard formData={work.form_data} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Faculty Assignment Form - Right Panel */}
          {showAssignForm && assignTarget && (
            <div className="w-1/3">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="rounded-full p-2 mr-3" style={{ backgroundColor: "#0200e1" }}>
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">HOD - Allot Faculty</h2>
                  </div>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-500 text-xs mb-1 truncate">
                  Work: <span className="font-medium text-gray-700">{assignTarget.title}</span>
                </p>
                <p className="text-gray-600 text-sm mb-5">
                  Choose a faculty member from your department. The assignment will appear in the faculty portal.
                </p>
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">{formError}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                      Select Faculty <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.faculty_id}
                      onChange={(e) => setForm((p) => ({ ...p, faculty_id: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none"
                      onFocus={(e) => (e.target.style.borderColor = "#0200e1")}
                      onBlur={(e)  => (e.target.style.borderColor = "#d1d5db")}
                      required
                    >
                      <option value="">Select Faculty Member</option>
                      {facultyList.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                    {facultyList.length === 0 && (
                      <p className="text-xs text-yellow-600 mt-1">No faculty found in your department.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm">HOD Remarks</label>
                    <textarea
                      value={form.hod_remarks}
                      onChange={(e) => setForm((p) => ({ ...p, hod_remarks: e.target.value }))}
                      placeholder="Reason for faculty selection, workload considerations, milestones..."
                      rows={4}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none resize-vertical"
                      onFocus={(e) => (e.target.style.borderColor = "#0200e1")}
                      onBlur={(e)  => (e.target.style.borderColor = "#d1d5db")}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-60"
                    style={{ backgroundColor: "#0200e1" }}
                    onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = "#0056b3")}
                    onMouseLeave={(e) => !submitting && (e.currentTarget.style.backgroundColor = "#0200e1")}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Assigning...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Assign Faculty &amp; Notify</span>
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
