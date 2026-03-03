import React, { useState, useEffect } from "react";
import useAuth from "../../store/UseAuth";
import FormDataCard from "./forms/FormDataCard";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:6001";

const ConsultancyPrincipal = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    clientOrganization: "",
    projectTitle: "",
    workDescription: "",
    expectedCompletionDate: "",
    attachments: null,
  });

  const [submittedWorks, setSubmittedWorks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const res = await fetch("http://localhost:6001/api/principal/consultancyGet", {
          credentials: "include",
        });
        const result = await res.json();

        const mapped = (result.data || []).map((work) => ({
          id: work.id,
          projectTitle: work.project_title,
          clientOrganization: work.client_organization,
          workDescription: work.work_description,
          expectedCompletionDate: work.expected_completion_date,
          submittedAt: new Date(work.submitted_at).toLocaleDateString(),
          attachmentUrl: work.attachment_url ? `${BASE_URL}${work.attachment_url}` : null,
          iqacAssignment: work.iqac_assignment
            ? {
                assignedDepartment: work.iqac_assignment.department_name,
                iqacRemarks: work.iqac_assignment.iqac_remarks,
                assignedAt: work.iqac_assignment.assigned_at
                  ? new Date(work.iqac_assignment.assigned_at).toLocaleDateString()
                  : "",
              }
            : null,
          hodAssignment: work.hod_assignment
            ? {
                assignedFaculty: work.hod_assignment.faculty_name,
                hodRemarks: work.hod_assignment.hod_remarks,
                assignedAt: work.hod_assignment.assigned_at
                  ? new Date(work.hod_assignment.assigned_at).toLocaleDateString()
                  : "",
                targetCompletionDate: null,
              }
            : null,
          facultyResponse: work.faculty_response
            ? {
                response: work.faculty_response.response,
                facultyRemarks: work.faculty_response.faculty_remarks,
                responseDate: work.faculty_response.responded_at
                  ? new Date(work.faculty_response.responded_at).toLocaleDateString()
                  : "",
              }
            : null,
          formData: work.form_data || null,
          rawStatus: work.status,
          status: {
            iqac: {
              completed: ["pending_hod", "pending_faculty", "form_pending", "completed", "faculty_rejected"].includes(work.status),
              pending: work.status === "pending_iqac",
              label: "IQAC Review",
            },
            hod: {
              completed: ["pending_faculty", "form_pending", "completed", "faculty_rejected"].includes(work.status),
              pending: work.status === "pending_hod",
              label: "HOD Assignment",
            },
            faculty: {
              completed: ["completed"].includes(work.status),
              pending: ["pending_faculty", "form_pending"].includes(work.status),
              label: "Faculty Execution",
            },
          },
        }));

        setSubmittedWorks(mapped);
      } catch (err) {
        console.error("Failed to fetch consultancy works:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

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

      const res = await fetch("http://localhost:6001/api/principal/consultancyUpload", {
        method: "POST",
        credentials: "include",
        body: fileForm,
      });

      if (!res.ok) {
        const err = await res.json();
        alert("File upload failed: " + err.error);
        setFormData((prev) => ({ ...prev, attachments: null }));
        return;
      }

      const result = await res.json();
      setUploadedFile({ url: `${BASE_URL}${result.url}`, filename: result.filename });
    } catch (err) {
      console.error("File upload error:", err);
      alert("File upload failed. Please try again.");
      setFormData((prev) => ({ ...prev, attachments: null }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploading) {
      alert("Please wait for the file to finish uploading.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:6001/api/principal/consultancyPost", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_title: formData.projectTitle,
          client_organization: formData.clientOrganization,
          work_description: formData.workDescription,
          expected_completion_date: formData.expectedCompletionDate,
          attachment_url: uploadedFile?.url ?? "",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Submission failed: " + err.error);
        return;
      }

      const result = await res.json();
      const saved = result.data;

      const newWork = {
        id: saved.id,
        projectTitle: saved.project_title,
        clientOrganization: saved.client_organization,
        workDescription: saved.work_description,
        expectedCompletionDate: saved.expected_completion_date,
        submittedAt: new Date(saved.submitted_at).toLocaleDateString(),
        attachmentUrl: saved.attachment_url ? `${BASE_URL}${saved.attachment_url}` : null,
        iqacAssignment: null,
        hodAssignment: null,
        facultyResponse: null,
        rawStatus: "pending_iqac",
        status: {
          iqac: { completed: false, pending: true, label: "IQAC Review" },
          hod: { completed: false, pending: false, label: "HOD Assignment" },
          faculty: { completed: false, pending: false, label: "Faculty Execution" },
        },
      };

      setSubmittedWorks((prev) => [newWork, ...prev]);
      setFormData({
        clientOrganization: "",
        projectTitle: "",
        workDescription: "",
        expectedCompletionDate: "",
        attachments: null,
      });
      setUploadedFile(null);
      setShowForm(false);
    } catch (err) {
      console.error("Network error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewInitiative = () => {
    setUploadedFile(null);
    setFormData({
      clientOrganization: "",
      projectTitle: "",
      workDescription: "",
      expectedCompletionDate: "",
      attachments: null,
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Consultancy Works</h1>
        <button
          onClick={handleNewInitiative}
          className="text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center space-x-2"
          style={{ backgroundColor: "#0200e1" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0200e1")}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Initiative Work</span>
        </button>
      </div>

      <div className="flex gap-6">
        {/* Form Section */}
        {showForm && (
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="rounded-full p-1.5 mr-2" style={{ backgroundColor: "#0200e1" }}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-base font-semibold text-gray-800">Principal - Initiate New Work</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition duration-200 p-1 rounded-md hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 text-xs mb-4">
                Describe the external work request received by email. Submitting will create a consultancy
                record, send mail to IQAC, and display it in the portal.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Client Organization */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Client Organization</label>
                  <input
                    type="text"
                    name="clientOrganization"
                    value={formData.clientOrganization}
                    onChange={handleInputChange}
                    placeholder="e.g. City Municipal Corporation"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition duration-200"
                    onFocus={(e) => (e.target.style.borderColor = "#0200e1")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                    required
                  />
                </div>

                {/* Project Title */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Project Title</label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                    placeholder="Short descriptive title of the consultancy work"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition duration-200"
                    onFocus={(e) => (e.target.style.borderColor = "#0200e1")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                    required
                  />
                </div>

                {/* Work Description */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Work Description &amp; Requirements</label>
                  <textarea
                    name="workDescription"
                    value={formData.workDescription}
                    onChange={handleInputChange}
                    placeholder="Detailed description of the work, scope, deliverables, and timelines..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition duration-200 resize-vertical"
                    onFocus={(e) => (e.target.style.borderColor = "#0200e1")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                    required
                  />
                </div>

                {/* Expected Completion Date */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Expected Completion Date</label>
                  <input
                    type="date"
                    name="expectedCompletionDate"
                    value={formData.expectedCompletionDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition duration-200"
                    onFocus={(e) => (e.target.style.borderColor = "#0200e1")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                    required
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Attachments (Email / Terms of Reference)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="attachments"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                    />
                    <div
                      className={`border-2 border-dashed rounded-md p-3 text-center transition duration-200 ${
                        uploadedFile
                          ? "border-green-400 bg-green-50"
                          : uploading
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="mb-1">
                        {uploading ? (
                          <svg className="mx-auto h-6 w-6 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                        ) : uploadedFile ? (
                          <svg className="mx-auto h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="mx-auto h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        )}
                      </div>
                      <p
                        className={`text-sm font-medium ${
                          uploadedFile ? "text-green-700" : uploading ? "text-blue-600" : "text-gray-500"
                        }`}
                      >
                        {uploading
                          ? "Uploading..."
                          : uploadedFile
                          ? `✓ ${uploadedFile.filename}`
                          : "Click to upload PDF/Doc"}
                      </p>
                      {uploadedFile && (
                        <p className="text-xs text-green-600 mt-1">Upload successful — ready to submit</p>
                      )}
                    </div>
                  </div>

                  {/* View uploaded file link */}
                  {uploadedFile && (
                    <a
                      href={uploadedFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center text-xs text-blue-600 hover:underline"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.67 1.61-1.163 2.31" />
                      </svg>
                      Preview uploaded file
                    </a>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="w-full text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#0200e1" }}
                  onMouseEnter={(e) => {
                    if (!submitting && !uploading) e.currentTarget.style.backgroundColor = "#0056b3";
                  }}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0200e1")}
                >
                  {submitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Submit &amp; Notify IQAC</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Submitted Works Cards */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading consultancy works...</div>
          ) : submittedWorks.length > 0 ? (
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold text-gray-800">Submitted Consultancy Works</h3>
              {submittedWorks.map((work) => (
                <div key={work.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                  {work.rawStatus === "completed" && (
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-md text-gray-500">Workflow completed — Faculty accepted</span>
                    </div>
                  )}
                  {work.rawStatus === "faculty_rejected" && (
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      <span className="text-md text-gray-500">Workflow ended — Faculty rejected</span>
                    </div>
                  )}
                  {work.rawStatus === "form_pending" && (
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="text-md text-gray-500">Faculty accepted — awaiting form submission</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-base font-semibold text-gray-900">{work.projectTitle}</h4>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {work.submittedAt}
                    </span>
                  </div>

                  {work.facultyResponse ? (
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                        <h5 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">Principal Submission</h5>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Client Organization</span>
                          <p className="text-gray-800 mt-0.5">{work.clientOrganization}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Work Description</span>
                          <p className="text-gray-800 mt-0.5 leading-relaxed">{work.workDescription}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expected Completion</span>
                          <p className="text-gray-800 mt-0.5">
                            {new Date(work.expectedCompletionDate).toLocaleDateString()}
                          </p>
                        </div>
                        {work.attachmentUrl && (
                          <div className="pt-3 border-t border-gray-200">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Attachment</span>
                            <a
                              href={work.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-medium"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              View Attachment
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">IQAC Assignment</h5>
                          <span className="text-xs text-gray-400">{work.iqacAssignment?.assignedAt || ""}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned Department</span>
                          <p className="text-gray-800 font-semibold mt-0.5">{work.iqacAssignment?.assignedDepartment}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">IQAC Remarks</span>
                          <p className="text-gray-700 mt-0.5">{work.iqacAssignment?.iqacRemarks}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">HOD Assignment</h5>
                          <span className="text-xs text-gray-400">{work.hodAssignment?.assignedAt || ""}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned Faculty</span>
                          <p className="text-gray-800 font-semibold mt-0.5">{work.hodAssignment?.assignedFaculty}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target Completion</span>
                          <p className="text-gray-800 mt-0.5">
                            {work.hodAssignment?.targetCompletionDate
                              ? new Date(work.hodAssignment.targetCompletionDate).toLocaleDateString()
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">HOD Remarks</span>
                          <p className="text-gray-700 mt-0.5">{work.hodAssignment?.hodRemarks}</p>
                        </div>
                      </div>

                      <div
                        className={`rounded-lg p-4 space-y-3 text-sm ${
                          work.facultyResponse.response === "accepted" ? "bg-green-50" : "bg-red-50"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Faculty Response</h5>
                          <span className="text-xs text-gray-400">{work.facultyResponse.responseDate}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Decision</span>
                          <p
                            className={`font-semibold mt-0.5 ${
                              work.facultyResponse.response === "accepted" ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {work.facultyResponse.response === "accepted" ? "Accepted" : "Rejected"}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Response Date</span>
                          <p className="text-gray-800 mt-0.5">
                            {new Date(work.facultyResponse.responseDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Faculty Remarks</span>
                          <p className="text-gray-700 mt-0.5">{work.facultyResponse.facultyRemarks}</p>
                        </div>
                        <div
                          className={`flex items-center mt-4 pt-3 border-t ${
                            work.facultyResponse.response === "accepted" ? "border-green-200" : "border-red-200"
                          }`}
                        >
                          <svg
                            className={`w-4 h-4 mr-2 ${
                              work.facultyResponse.response === "accepted" ? "text-green-600" : "text-red-600"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span
                            className={`text-sm font-medium ${
                              work.facultyResponse.response === "accepted" ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {work.facultyResponse.response === "accepted"
                              ? "Response Sent to All Officials"
                              : "Rejection Notified to All Officials"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : work.iqacAssignment ? (
                    /* Three-column layout */
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                        <h5 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">Principal Submission</h5>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Client Organization</span>
                          <p className="text-gray-800 mt-0.5">{work.clientOrganization}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Work Description</span>
                          <p className="text-gray-800 mt-0.5 leading-relaxed">{work.workDescription}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expected Completion</span>
                          <p className="text-gray-800 mt-0.5">
                            {new Date(work.expectedCompletionDate).toLocaleDateString()}
                          </p>
                        </div>
                        {work.attachmentUrl && (
                          <div className="pt-3 border-t border-gray-200">
                            <a
                              href={work.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-medium"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              View Attachment
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">IQAC Assignment</h5>
                          <span className="text-xs text-gray-400">{work.iqacAssignment?.assignedAt || ""}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned Department</span>
                          <p className="text-gray-800 font-semibold mt-0.5">{work.iqacAssignment?.assignedDepartment}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">IQAC Remarks</span>
                          <p className="text-gray-700 mt-0.5">{work.iqacAssignment?.iqacRemarks}</p>
                        </div>
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-1.5 text-green-700">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-medium">Forwarded to HOD &amp; Mail Sent</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                        <h5 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">Progress Status</h5>
                        <StatusSteps status={work.status} />
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-1.5 text-amber-600">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-medium">Waiting for HOD Assignment</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Two-column layout */
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                        <h5 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">Principal Submission</h5>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Client Organization</span>
                          <p className="text-gray-800 mt-0.5">{work.clientOrganization}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Work Description</span>
                          <p className="text-gray-800 mt-0.5 leading-relaxed">{work.workDescription}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expected Completion</span>
                          <p className="text-gray-800 mt-0.5">
                            {new Date(work.expectedCompletionDate).toLocaleDateString()}
                          </p>
                        </div>
                        {work.attachmentUrl && (
                          <div className="pt-3 border-t border-gray-200">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Attachment</span>
                            <a
                              href={work.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-medium"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              View Attachment
                            </a>

                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                        <h5 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">Progress Status</h5>
                        <StatusSteps status={work.status} />
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-1.5 text-amber-600">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-medium">Waiting for IQAC Review</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <FormDataCard formData={work.formData} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No consultancy works yet</h3>
              <p className="mt-2 text-gray-500">
                Click "New Initiative Work" to start describing your first external work request.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* Reusable Status Steps */
const StatusSteps = ({ status }) => {
  const steps = [
    { key: "iqac", ...status.iqac },
    { key: "hod", ...status.hod },
    { key: "faculty", ...status.faculty },
  ];

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div key={step.key} className="flex items-center space-x-3">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
              step.completed ? "bg-green-500" : step.pending ? "bg-yellow-500" : "bg-gray-300"
            }`}
          >
            {step.completed && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {step.pending && !step.completed && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </div>
          <div className="flex-1">
            <span className="font-medium text-gray-700">{step.label}</span>
            <div className="text-xs text-gray-500">
              {step.completed ? "Completed" : step.pending ? "In Progress" : "Pending"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConsultancyPrincipal; 