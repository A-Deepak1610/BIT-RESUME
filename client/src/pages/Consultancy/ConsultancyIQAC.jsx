import React, { useState, useEffect } from "react";
import useAuth from "../../store/UseAuth";
import FormDataCard from "./forms/FormDataCard";

// â”€â”€ Helper sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const InfoRow = ({ label, value }) => (
  <div>
    <span className="font-medium text-gray-600">{label}:</span>
    <p className="text-gray-800 mt-1">{value || "-"}</p>
  </div>
);

const StatusBadge = ({ icon, color, label }) => {
  const colorMap = { yellow: "text-yellow-600", green: "text-green-600" };
  const clockPath =
    "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z";
  const checkPath =
    "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z";
  return (
    <div className="flex items-center">
      <svg className={`w-4 h-4 mr-2 ${colorMap[color]}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d={icon === "clock" ? clockPath : checkPath} clipRule="evenodd" />
      </svg>
      <span className={`text-sm font-medium ${colorMap[color].replace("600", "700")}`}>{label}</span>
    </div>
  );
};

const PrincipalCard = ({ work }) => (
  <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
    <div className="flex justify-between items-center mb-3">
      <h5 className="font-semibold text-gray-700 text-base">Principal Submission</h5>
      <span className="text-xs text-gray-500">{work.submittedAt}</span>
    </div>
    <InfoRow label="Client Organization" value={work.clientOrganization} />
    <InfoRow label="Work Description" value={work.workDescription} />
    <InfoRow
      label="Expected Completion"
      value={work.expectedCompletionDate ? new Date(work.expectedCompletionDate).toLocaleDateString() : "-"}
    />
  </div>
);

const IQACCard = ({ work, showForwarded, showHodPending }) => (
  <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
    <div className="flex justify-between items-center mb-3">
      <h5 className="font-semibold text-gray-700 text-base">IQAC Assignment</h5>
      <span className="text-xs text-gray-500">{work.assignedAt || ""}</span>
    </div>
    <InfoRow label="Assigned Department" value={work.assignedDepartment} />
    <InfoRow label="Work Type" value={work.workType} />
    <InfoRow label="IQAC Remarks" value={work.iqacRemarks} />
    {showForwarded && (
      <div className="pt-3 border-t border-gray-200">
        <StatusBadge icon="check" color="green" label="Forwarded to HOD & Mail Sent" />
      </div>
    )}
    {showHodPending && (
      <div className="mt-2">
        <StatusBadge icon="clock" color="yellow" label="Waiting for HOD Assignment" />
      </div>
    )}
  </div>
);

const HODCard = ({ work, pending }) => (
  <div className="bg-blue-50 rounded-lg p-4 space-y-3 text-sm">
    <div className="flex justify-between items-center mb-3">
      <h5 className="font-semibold text-gray-700 text-base">HOD Assignment</h5>
      <span className="text-xs text-gray-500">{work.hodAssignment?.assignedAt || ""}</span>
    </div>
    <InfoRow label="Assigned Faculty" value={work.hodAssignment?.assignedFaculty} />
    <InfoRow
      label="Target Completion"
      value={work.hodAssignment?.targetCompletionDate ? new Date(work.hodAssignment.targetCompletionDate).toLocaleDateString() : "-"}
    />
    <InfoRow label="HOD Remarks" value={work.hodAssignment?.hodRemarks} />
    {pending && (
      <div className="pt-3 border-t border-blue-200">
        <StatusBadge icon="clock" color="yellow" label="Waiting for Faculty Response" />
      </div>
    )}
  </div>
);

const FacultyCard = ({ work }) => {
  const accepted = work.facultyResponse?.response === "accepted";
  return (
    <div className={`rounded-lg p-4 space-y-3 text-sm ${accepted ? "bg-green-50" : "bg-red-50"}`}>
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-semibold text-gray-700 text-base">Faculty Response</h5>
        <span className="text-xs text-gray-500">{work.facultyResponse?.responseDate || ""}</span>
      </div>
      <div>
        <span className="font-medium text-gray-600">Response:</span>
        <p className={`font-semibold mt-1 ${accepted ? "text-green-700" : "text-red-700"}`}>
          {accepted ? "Accepted" : "Rejected"}
        </p>
      </div>
      <InfoRow label="Faculty Remarks" value={work.facultyResponse?.facultyRemarks} />
      <div className={`flex items-center mt-4 pt-3 border-t ${accepted ? "border-green-200" : "border-red-200"}`}>
        <svg className={`w-4 h-4 mr-2 ${accepted ? "text-green-600" : "text-red-600"}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className={`text-sm font-medium ${accepted ? "text-green-700" : "text-red-700"}`}>
          {accepted ? "Response Sent to All Officials" : "Rejection Notified to All Officials"}
        </span>
      </div>
    </div>
  );
};

// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const ConsultancyIQAC = () => {
  useAuth();

  const [consultancyWorks, setConsultancyWorks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    selectedWorkId: "",
    workType: "",
    departmentId: "",
    remarks: "",
  });

  // â”€â”€ Fetch works + departments on mount â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [worksRes, deptsRes] = await Promise.all([
          fetch("http://localhost:6001/api/iqac/consultancyGet", { credentials: "include" }),
          fetch("http://localhost:6001/api/departments", { credentials: "include" }),
        ]);
        const worksJson = await worksRes.json();
        const deptsJson = await deptsRes.json();

        setDepartments(deptsJson.departments || []);

        const mapped = (worksJson.data || []).map((w) => {
          const ia = w.iqac_assignment;
          return {
            id: w.id,
            projectTitle: w.project_title,
            clientOrganization: w.client_organization,
            workDescription: w.work_description,
            expectedCompletionDate: w.expected_completion_date || "",
            submittedAt: w.submitted_at ? new Date(w.submitted_at).toLocaleDateString() : "",
            status: ia ? "Assigned to Department" : "Pending Assignment",
            rawStatus: w.status,
            attachmentUrl: `${import.meta.env.VITE_API_URL}${w.attachment_url}` || null,
            assignedDepartment: ia ? ia.department_name : null,
            assignedAt: ia ? new Date(ia.assigned_at).toLocaleDateString() : null,
            iqacRemarks: ia ? ia.iqac_remarks : null,
            workType: ia ? ia.consultancy_work_type : null,
            hodAssignment: w.hod_assignment
              ? {
                  assignedFaculty: w.hod_assignment.faculty_name,
                  hodRemarks: w.hod_assignment.hod_remarks,
                  assignedAt: w.hod_assignment.assigned_at
                    ? new Date(w.hod_assignment.assigned_at).toLocaleDateString()
                    : null,
                }
              : null,
            facultyResponse: w.faculty_response
              ? {
                  response: w.faculty_response.response,
                  facultyRemarks: w.faculty_response.faculty_remarks,
                  responseDate: w.faculty_response.responded_at
                    ? new Date(w.faculty_response.responded_at).toLocaleDateString()
                    : null,
                }
              : null,
            formData: w.form_data || null,
          };
        });

        setConsultancyWorks(mapped);
      } catch (err) {
        console.error("Failed to fetch IQAC data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssignDepartment = (work) => {
    setAssignmentData({ selectedWorkId: work.id.toString(), workType: "", departmentId: "", remarks: "" });
    setShowAssignForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:6001/api/iqac/consultancyAssign", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultancy_work_id: parseInt(assignmentData.selectedWorkId),
          consultancy_work_type: assignmentData.workType,
          department_id: parseInt(assignmentData.departmentId),
          iqac_remarks: assignmentData.remarks,
        }),
      });
      const result = await res.json();
      if (!res.ok) { alert("Assignment failed: " + result.error); return; }

      const dept = departments.find((d) => d.id === parseInt(assignmentData.departmentId));
      setConsultancyWorks((prev) =>
        prev.map((work) =>
          work.id.toString() === assignmentData.selectedWorkId
            ? {
                ...work,
                status: "Assigned to Department",
                workType: assignmentData.workType,
                assignedDepartment: dept ? dept.department_name : "",
                assignedAt: new Date().toLocaleDateString(),
                iqacRemarks: assignmentData.remarks,
              }
            : work
        )
      );
      closeModal();
    } catch (err) {
      console.error("Assignment error:", err);
      alert("Assignment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const closeModal = () => {
    setShowAssignForm(false);
    setAssignmentData({ selectedWorkId: "", workType: "", departmentId: "", remarks: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading consultancy works...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">IQAC - Consultancy Management</h1>
        <p className="text-gray-600">Review and assign consultancy works submitted by Principal to appropriate departments</p>
      </div>

      <div className="flex gap-6">
        {/* Works list */}
        <div className={`${showAssignForm ? "w-2/3" : "w-full"} transition-all duration-300`}>
          {consultancyWorks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-10 text-center text-gray-500">
              No consultancy works submitted yet.
            </div>
          ) : (
            <div className="space-y-6">
              {consultancyWorks.map((work) => (
                <div key={work.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  {(work.rawStatus === "completed" || work.rawStatus === "faculty_rejected") && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-4 text-sm font-medium ${
                      work.rawStatus === "completed"
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-red-100 text-red-800 border border-red-300"
                    }`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        {work.rawStatus === "completed"
                          ? <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          : <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />}
                      </svg>
                      {work.rawStatus === "completed" ? "✅ Workflow Completed — Faculty has accepted the work" : "❌ Workflow Ended — Faculty rejected the work"}
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">{work.projectTitle}</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">Submitted: {work.submittedAt}</span>
                      {work.status === "Pending Assignment" && (
                        <button
                          onClick={() => handleAssignDepartment(work)}
                          className="text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                          style={{ backgroundColor: "#0200e1" }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = "#0200e1")}
                        >
                          Assign Department
                        </button>
                      )}
                    </div>
                  </div>

                  {work.facultyResponse ? (
                    <div className="grid grid-cols-4 gap-4">
                      <PrincipalCard work={work} />
                      <IQACCard work={work} />
                      <HODCard work={work} />
                      <FacultyCard work={work} />
                    </div>
                  ) : work.hodAssignment ? (
                    <div className="grid grid-cols-3 gap-4">
                      <PrincipalCard work={work} />
                      <IQACCard work={work} showForwarded />
                      <HODCard work={work} pending />
                    </div>
                  ) : work.assignedDepartment ? (
                    <div className="grid grid-cols-2 gap-6">
                      <PrincipalCard work={work} />
                      <IQACCard work={work} showForwarded showHodPending />
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-semibold text-gray-700 text-base">Principal Submission</h5>
                        <span className="text-xs text-gray-500">{work.submittedAt}</span>
                      </div>
                      <InfoRow label="Client Organization" value={work.clientOrganization} />
                      <InfoRow label="Work Description" value={work.workDescription} />
                      <InfoRow
                        label="Expected Completion"
                        value={work.expectedCompletionDate ? new Date(work.expectedCompletionDate).toLocaleDateString() : "-"}
                      />
                      <div className="pt-3 border-t border-gray-200">
                        <StatusBadge icon="clock" color="yellow" label="Pending IQAC Assignment" />
                      </div>
                    </div>
                  )}
                  <FormDataCard formData={work.formData} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assignment Form - Right Side */}
        {showAssignForm && (
          <div className="w-1/3">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="rounded-full p-2 mr-3" style={{ backgroundColor: "#0200e1" }}>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">IQAC - Allot Department</h2>
                </div>
                <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-700 text-sm mb-6">
                Select the most suitable department. On submit, the respective HOD will see the work in their portal.
              </p>

              <form onSubmit={handleSubmitAssignment} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Work Type</label>
                  <select
                    name="workType"
                    value={assignmentData.workType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none"
                    onFocus={(e) => (e.target.style.borderColor = "#0200e1")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  >
                    <option value="">Select Work Type</option>
                    <option value="Software Project">Software Project</option>
                    <option value="Industrial Training Project">Industrial Training Project</option>
                    <option value="Drone">Drone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Allot Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="departmentId"
                    value={assignmentData.departmentId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none"
                    onFocus={(e) => (e.target.style.borderColor = "#0200e1")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">IQAC Remarks</label>
                  <textarea
                    name="remarks"
                    value={assignmentData.remarks}
                    onChange={handleInputChange}
                    placeholder="Justification for department selection, key expectations..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none resize-vertical"
                    onFocus={(e) => (e.target.style.borderColor = "#0200e1")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-60"
                  style={{ backgroundColor: "#0200e1" }}
                  onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = "#0056b3"; }}
                  onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = "#0200e1"; }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>{submitting ? "Assigning..." : "Forward to HOD"}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultancyIQAC;
