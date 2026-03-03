import { useState, useEffect } from "react";
import useAuth from "../../store/UseAuth";

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

function getStatusColor(status) {
  switch (status) {
    case "pending_faculty":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "faculty_rejected":
      return "bg-red-100 text-red-800";
    case "pending_hod":
      return "bg-blue-100 text-blue-800";
    case "pending_iqac":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "pending_faculty":
      return "Awaiting Your Response";
    case "completed":
      return "Accepted";
    case "faculty_rejected":
      return "Rejected";
    case "pending_hod":
      return "Pending HOD";
    case "pending_iqac":
      return "Pending IQAC";
    default:
      return status;
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading consultancy works...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          Error: {error}
          <button
            onClick={fetchWorks}
            className="ml-4 text-sm underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Consultancy Works</h1>
        <p className="text-gray-600 mt-1">
          Works assigned to you by your HOD. Accept or reject with remarks.
        </p>
      </div>

      {submitMsg && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${
            submitMsg.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {submitMsg.text}
          <button onClick={() => setSubmitMsg(null)} className="ml-2 font-bold">
            ×
          </button>
        </div>
      )}

      {works.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
          No consultancy works assigned to you yet.
        </div>
      ) : (
        <div className="space-y-6">
          {works.map((work) => (
            <div
              key={work.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              {/* Completed / Rejected Banner */}
              {(work.status === "completed" || work.status === "faculty_rejected") && (
                <div className={`flex items-center gap-2 px-6 py-2 text-sm font-medium ${
                  work.status === "completed"
                    ? "bg-green-100 text-green-800 border-b border-green-300"
                    : "bg-red-100 text-red-800 border-b border-red-300"
                }`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    {work.status === "completed"
                      ? <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      : <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />}
                  </svg>
                  {work.status === "completed" ? "✅ Workflow Completed — You have accepted this work" : "❌ Workflow Ended — You rejected this work"}
                </div>
              )}
              {/* Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {work.workType}
                  </h2>
                  <p className="text-sm text-gray-600">{work.clientOrganization}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    work.status
                  )}`}
                >
                  {getStatusLabel(work.status)}
                </span>
              </div>

              {/* 4-column workflow */}
              <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                {/* Column 1: Principal Submission */}
                <div className="p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Principal Submission
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">{work.workDescription}</p>
                    {work.expectedCompletionDate && (
                      <p className="text-gray-500">
                        <span className="font-medium">Due:</span>{" "}
                        {new Date(work.expectedCompletionDate).toLocaleDateString()}
                      </p>
                    )}
                    {work.submittedAt && (
                      <p className="text-gray-500">
                        <span className="font-medium">Submitted:</span>{" "}
                        {new Date(work.submittedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Column 2: IQAC Assignment */}
                <div className="p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    IQAC Assignment
                  </h3>
                  {work.iqacAssignment ? (
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium text-gray-700">Department:</span>{" "}
                        {work.iqacAssignment.assignedDepartment}
                      </p>
                      {work.iqacAssignment.iqacRemarks && (
                        <p>
                          <span className="font-medium text-gray-700">Remarks:</span>{" "}
                          <span className="text-gray-600">
                            {work.iqacAssignment.iqacRemarks}
                          </span>
                        </p>
                      )}
                      {work.iqacAssignment.assignedAt && (
                        <p className="text-gray-500">
                          {new Date(work.iqacAssignment.assignedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Not yet assigned</p>
                  )}
                </div>

                {/* Column 3: HOD Assignment */}
                <div className="p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    HOD Assignment
                  </h3>
                  {work.hodAssignment ? (
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium text-gray-700">Faculty:</span>{" "}
                        {work.hodAssignment.assignedFaculty}
                      </p>
                      {work.hodAssignment.hodRemarks && (
                        <p>
                          <span className="font-medium text-gray-700">Remarks:</span>{" "}
                          <span className="text-gray-600">
                            {work.hodAssignment.hodRemarks}
                          </span>
                        </p>
                      )}
                      {work.hodAssignment.assignedAt && (
                        <p className="text-gray-500">
                          {new Date(work.hodAssignment.assignedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Not yet assigned</p>
                  )}
                </div>

                {/* Column 4: Faculty Response */}
                <div className="p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Faculty Response
                  </h3>
                  {work.facultyResponse ? (
                    <div className="space-y-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          work.facultyResponse.response === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {work.facultyResponse.response === "accepted"
                          ? "Accepted"
                          : "Rejected"}
                      </span>
                      {work.facultyResponse.facultyRemarks && (
                        <p className="text-gray-600">
                          {work.facultyResponse.facultyRemarks}
                        </p>
                      )}
                      {work.facultyResponse.respondedAt && (
                        <p className="text-gray-500">
                          {new Date(work.facultyResponse.respondedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : work.status === "pending_faculty" ? (
                    <div className="space-y-2">
                      <p className="text-sm text-yellow-700 italic mb-2">
                        Awaiting your response
                      </p>
                      <button
                        onClick={() => {
                          setSelectedWork(work);
                          setResponseForm({ action: "accept", remarks: "" });
                          setSubmitMsg(null);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition"
                      >
                        Respond
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No response yet</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {selectedWork && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Respond to Consultancy Work
              </h2>
              <button
                onClick={() => {
                  setSelectedWork(null);
                  setSubmitMsg(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">{selectedWork.workType}</span>
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {selectedWork.clientOrganization}
              </p>

              {submitMsg && (
                <div
                  className={`mb-4 p-3 rounded-md text-sm ${
                    submitMsg.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {submitMsg.text}
                </div>
              )}

              <form onSubmit={handleSubmitResponse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Decision
                  </label>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        setResponseForm((f) => ({ ...f, action: "accept" }))
                      }
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium border transition ${
                        responseForm.action === "accept"
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                      }`}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setResponseForm((f) => ({ ...f, action: "reject" }))
                      }
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium border transition ${
                        responseForm.action === "reject"
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-red-400"
                      }`}
                    >
                      Reject
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks{" "}
                    {responseForm.action === "reject" && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <textarea
                    value={responseForm.remarks}
                    onChange={(e) =>
                      setResponseForm((f) => ({ ...f, remarks: e.target.value }))
                    }
                    required={responseForm.action === "reject"}
                    rows={4}
                    placeholder={
                      responseForm.action === "accept"
                        ? "Optional remarks..."
                        : "Please provide a reason for rejection..."
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWork(null);
                      setSubmitMsg(null);
                    }}
                    className="flex-1 py-2 px-4 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium text-white transition ${
                      responseForm.action === "accept"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    } disabled:opacity-50`}
                  >
                    {submitting
                      ? "Submitting..."
                      : responseForm.action === "accept"
                      ? "Confirm Accept"
                      : "Confirm Reject"}
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
