import React, { useState } from "react";
import useAuth from "../../store/UseAuth";
import ProjectDeclarationForm from "./forms/projectdeclarationform";
import DroneForm from "./forms/droneform";
import IndustrialProjectForm from "./forms/industrialprojectform";

const inferWorkTypeFromText = (text) => {
  const normalized = (text || "").toLowerCase();
  if (!normalized) return "";
  if (normalized.includes("drone")) return "Drone";
  if (normalized.includes("industrial training") || normalized.includes("training")) {
    return "Industrial Training Project";
  }
  if (normalized.includes("software")) return "Software Project";
  return "";
};

const ConsultancyFaculty = () => {
  useAuth();
  
  // Mock data for consultancy works assigned to faculty
  const [assignedWorks, setAssignedWorks] = useState([
    {
      id: 1,
      projectTitle: "Smart City IoT Infrastructure Audit",
      workType: "Drone",
      clientOrganization: "City Municipal Corporation",
      workDescription: "Comprehensive audit and assessment of existing IoT infrastructure for smart city initiatives. This includes evaluation of current systems, security analysis, and recommendations for improvements.",
      expectedCompletionDate: "2026-06-15",
      submittedAt: "2026-02-15",
      submittedBy: "Principal",
      assignedDepartment: "Computer Science & Engineering",
      iqacRemarks: "This project requires expertise in IoT systems and network security. The department has strong faculty in these areas.",
      assignedAt: "2026-02-16",
      assignedFaculty: "Prof. R. Gupta (IoT & Networks)",
      hodRemarks: "Prof. Gupta has extensive experience in IoT infrastructure projects and security audits.",
      targetCompletionDate: "2026-06-10",
      facultyAssignedAt: "2026-02-17",
      status: "Accepted by Faculty",
      facultyResponse: "accepted",
      facultyRemarks: "I have the required expertise in drone technology and IoT systems. Ready to start the project.",
      responseDate: "2026-02-18",
      declarationSubmitted: false,
      declarationData: null
    },
    {
      id: 2,
      projectTitle: "Digital Transformation Strategy",
      workType: "Software Project",
      clientOrganization: "Regional Development Authority", 
      workDescription: "Development of comprehensive digital transformation roadmap for government services modernization including process optimization and technology integration.",
      expectedCompletionDate: "2026-08-30",
      submittedAt: "2026-02-10",
      submittedBy: "Principal",
      assignedDepartment: "Computer Science & Engineering",
      iqacRemarks: "Requires expertise in digital systems and process automation. Strategic planning capabilities essential.",
      assignedAt: "2026-02-16",
      assignedFaculty: "Prof. R. Gupta (IoT & Networks)",
      hodRemarks: "Prof. Gupta's background in system analysis makes him suitable for this strategic project.",
      targetCompletionDate: "2026-08-15",
      facultyAssignedAt: "2026-02-16",
      status: "Accepted by Faculty",
      facultyResponse: "accepted",
      facultyRemarks: "I am interested in this project and have the required expertise. I can commit to the timeline and deliver quality results.",
      responseDate: "2026-02-17",
      declarationSubmitted: false,
      declarationData: null
    },
    {
      id: 3,
      projectTitle: "Industrial Skills Development Program",
      workType: "Industrial Training Project",
      clientOrganization: "State Industrial Training Institute",
      workDescription: "Comprehensive industrial training program for engineering students covering manufacturing processes, quality control, and industry best practices.",
      expectedCompletionDate: "2026-09-30",
      submittedAt: "2026-02-18",
      submittedBy: "Principal",
      assignedDepartment: "Mechanical Engineering",
      iqacRemarks: "Industrial training program requires faculty with strong industry connections and practical experience in manufacturing.",
      assignedAt: "2026-02-19",
      assignedFaculty: "Prof. R. Gupta (IoT & Networks)",
      hodRemarks: "Prof. Gupta has conducted similar training programs before and has excellent industry contacts.",
      targetCompletionDate: "2026-09-15",
      facultyAssignedAt: "2026-02-20",
      status: "Accepted by Faculty",
      facultyResponse: "accepted",
      facultyRemarks: "I have experience conducting industrial training programs and can leverage my industry contacts for this project.",
      responseDate: "2026-02-21",
      declarationSubmitted: false,
      declarationData: null
    }
  ]);

  const [showResponseForm, setShowResponseForm] = useState(false);
  const [showFullPageDeclaration, setShowFullPageDeclaration] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [response, setResponse] = useState({
    workId: "",
    action: "",
    remarks: ""
  });

  const handleResponseAction = (work, action) => {
    setSelectedWork(work);
    setResponse({
      workId: work.id.toString(),
      action: action,
      remarks: ""
    });
    setShowResponseForm(true);
  };

  const handleDeclarationSubmission = (work) => {
    setSelectedWork(work);
    setShowFullPageDeclaration(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponse(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmitResponse = (e) => {
    e.preventDefault();
    
    const newStatus = response.action === "accept" ? "Accepted by Faculty" : "Rejected by Faculty";
    
    // Update the work with faculty response
    setAssignedWorks(prev => 
      prev.map(work => 
        work.id.toString() === response.workId 
          ? {
              ...work,
              facultyResponse: response.action,
              facultyRemarks: response.remarks,
              status: newStatus,
              responseDate: new Date().toISOString().split('T')[0]
            }
          : work
      )
    );

    // Reset form and close
    setShowResponseForm(false);
    setSelectedWork(null);
    setResponse({
      workId: "",
      action: "",
      remarks: ""
    });
  };

  const handleSubmitDeclaration = (submittedDeclarationData) => {
    // Update the work with declaration submission
    setAssignedWorks(prev => 
      prev.map(work => 
        work.id === selectedWork.id 
          ? {
              ...work,
              declarationSubmitted: true,
              declarationData: submittedDeclarationData,
              status: "Declaration Submitted"
            }
          : work
      )
    );

    // Reset form and close
    setShowFullPageDeclaration(false);
    setSelectedWork(null);
  };

  const closeForm = () => {
    setShowResponseForm(false);
    setShowFullPageDeclaration(false);
    setSelectedWork(null);
    setResponse({
      workId: "",
      action: "",
      remarks: ""
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending Faculty Response":
        return { bg: "#9b9aff", border: "#9b9aff" };
      case "Accepted by Faculty":
        return { bg: "#10B981", border: "#10B981" };
      case "Rejected by Faculty":
        return { bg: "#EF4444", border: "#EF4444" };
      case "Declaration Submitted":
        return { bg: "#3B82F6", border: "#3B82F6" };
      default:
        return { bg: "#6B7280", border: "#6B7280" };
    }
  };

  // Determine which form to render based on workType
  const renderDeclarationForm = () => {
    const workType = selectedWork?.workType ||
      inferWorkTypeFromText(selectedWork?.iqacRemarks) ||
      inferWorkTypeFromText(selectedWork?.workDescription) ||
      "";

    const formProps = {
      key: selectedWork?.id,
      selectedWork: selectedWork,
      onBack: () => setShowFullPageDeclaration(false),
      onSubmit: handleSubmitDeclaration,
    };

    switch (workType) {
      case "Drone":
        return <DroneForm {...formProps} />;
      case "Industrial Training Project":
        return <IndustrialProjectForm {...formProps} />;
      case "Software Project":
      default:
        return <ProjectDeclarationForm {...formProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showFullPageDeclaration ? (
        renderDeclarationForm()
      ) : (
        <div className="p-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Faculty - Consultancy Works</h1>
            <p className="text-gray-600">Review assigned consultancy works and provide your response</p>
          </div>

          {/* Main Content Layout */}
          <div className="flex gap-6">
            {/* Assigned Works */}
            <div className={`${showResponseForm ? "w-2/3" : "w-full"} transition-all duration-300`}>
              <div className="space-y-6">
                {assignedWorks.map((work) => {
                  const statusColor = getStatusColor(work.status);
                  return (
                    <div key={work.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">{work.projectTitle}</h3>
                          <div className="flex items-center space-x-4 mb-3">
                            <span className="text-sm text-gray-500">Assigned to you: {work.facultyAssignedAt}</span>
                            <span
                              className="text-xs px-2 py-1 rounded-full text-white border"
                              style={{
                                backgroundColor: statusColor.bg,
                                borderColor: statusColor.border
                              }}
                            >
                              {work.status}
                            </span>
                          </div>
                        </div>

                        {work.status === "Pending Faculty Response" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleResponseAction(work, "reject")}
                              className="text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                              style={{ backgroundColor: "#EF4444" }}
                              onMouseEnter={(e) => (e.target.style.backgroundColor = "#DC2626")}
                              onMouseLeave={(e) => (e.target.style.backgroundColor = "#EF4444")}
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleResponseAction(work, "accept")}
                              className="text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                              style={{ backgroundColor: "#10B981" }}
                              onMouseEnter={(e) => (e.target.style.backgroundColor = "#059669")}
                              onMouseLeave={(e) => (e.target.style.backgroundColor = "#10B981")}
                            >
                              Accept
                            </button>
                          </div>
                        )}

                        {work.status === "Accepted by Faculty" && !work.declarationSubmitted && (
                          <button
                            onClick={() => handleDeclarationSubmission(work)}
                            className="text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                            style={{ backgroundColor: "#3B82F6" }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563EB")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#3B82F6")}
                          >
                            Submit Declaration
                          </button>
                        )}
                      </div>

                      {/* Four-Column Layout */}
                      <div className="grid grid-cols-4 gap-6">
                        {/* Principal's Submission */}
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-gray-700 text-base">Principal Submission</h4>
                            <span className="text-xs text-gray-500">{work.submittedAt}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Client Organization:</span>
                            <p className="text-gray-800 mt-1">{work.clientOrganization}</p>
                          </div>

                          <div>
                            <span className="font-medium text-gray-600">Work Description:</span>
                            <p className="text-gray-800 mt-1">{work.workDescription}</p>
                          </div>

                          <div>
                            <span className="font-medium text-gray-600">Expected Completion:</span>
                            <p className="text-gray-800 mt-1">{new Date(work.expectedCompletionDate).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {/* IQAC Assignment */}
                        <div className="relative">
                          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
                          <div className="pl-6 space-y-3 text-sm">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-semibold text-gray-700 text-base">IQAC Assignment</h4>
                              <span className="text-xs text-gray-500">{work.assignedAt}</span>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                              <div className="space-y-3">
                                <div>
                                  <span className="font-medium text-gray-600">Assigned Department:</span>
                                  <p className="text-gray-800 font-semibold mt-1">{work.assignedDepartment}</p>
                                </div>

                                <div>
                                  <span className="font-medium text-gray-600">Consultancy Work:</span>
                                  <p className="text-gray-800 mt-1">
                                    {work.workType ||
                                      inferWorkTypeFromText(work.iqacRemarks) ||
                                      inferWorkTypeFromText(work.workDescription) ||
                                      "-"}
                                  </p>
                                </div>

                                <div>
                                  <span className="font-medium text-gray-600">IQAC Remarks:</span>
                                  <p className="text-gray-700 mt-1">{work.iqacRemarks}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* HOD Assignment */}
                        <div className="relative">
                          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
                          <div className="pl-6 space-y-3 text-sm">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-semibold text-gray-700 text-base">HOD Assignment</h4>
                              <span className="text-xs text-gray-500">{work.facultyAssignedAt}</span>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="space-y-3">
                                <div>
                                  <span className="font-medium text-gray-600">Assigned Faculty:</span>
                                  <p className="text-gray-800 font-semibold mt-1">{work.assignedFaculty}</p>
                                </div>

                                <div>
                                  <span className="font-medium text-gray-600">Target Completion:</span>
                                  <p className="text-gray-800 mt-1">{new Date(work.targetCompletionDate).toLocaleDateString()}</p>
                                </div>

                                <div>
                                  <span className="font-medium text-gray-600">HOD Remarks:</span>
                                  <p className="text-gray-700 mt-1">{work.hodRemarks}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Faculty Response */}
                        <div className="relative">
                          {work.facultyResponse && (
                            <>
                              <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
                              <div className="pl-6 space-y-3 text-sm">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-semibold text-gray-700 text-base">Faculty Response</h4>
                                  <span className="text-xs text-gray-500">{work.responseDate}</span>
                                </div>
                                <div
                                  className={`border rounded-lg p-4 ${
                                    work.facultyResponse === "accepted"
                                      ? "bg-green-50 border-green-200"
                                      : "bg-red-50 border-red-200"
                                  }`}
                                >
                                  <div className="space-y-3">
                                    <div>
                                      <span className="font-medium text-gray-600">Response:</span>
                                      <p
                                        className={`font-semibold mt-1 ${
                                          work.facultyResponse === "accepted" ? "text-green-700" : "text-red-700"
                                        }`}
                                      >
                                        {work.facultyResponse === "accepted" ? "Accepted" : "Rejected"}
                                      </p>
                                    </div>

                                    <div>
                                      <span className="font-medium text-gray-600">Response Date:</span>
                                      <p className="text-gray-800 mt-1">{new Date(work.responseDate).toLocaleDateString()}</p>
                                    </div>

                                    <div>
                                      <span className="font-medium text-gray-600">Faculty Remarks:</span>
                                      <p className="text-gray-700 mt-1">{work.facultyRemarks}</p>
                                    </div>

                                    <div
                                      className={`flex items-center mt-4 pt-3 border-t ${
                                        work.facultyResponse === "accepted" ? "border-green-200" : "border-red-200"
                                      }`}
                                    >
                                      <svg
                                        className={`w-4 h-4 mr-2 ${
                                          work.facultyResponse === "accepted" ? "text-green-600" : "text-red-600"
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      <span
                                        className={`text-sm font-medium ${
                                          work.facultyResponse === "accepted" ? "text-green-700" : "text-red-700"
                                        }`}
                                      >
                                        {work.facultyResponse === "accepted"
                                          ? "Response Sent to All Officials"
                                          : "Rejection Notified to All Officials"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Response Form - Right Side */}
            {showResponseForm && (
              <div className="w-1/3">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sticky top-4">
                  <div className="flex items-center mb-4">
                    <div
                      className="rounded-full p-2 mr-3"
                      style={{ backgroundColor: response.action === "accept" ? "#10B981" : "#EF4444" }}
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        {response.action === "accept" ? (
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        ) : (
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        )}
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 flex-1">
                      {response.action === "accept" ? "Accept Consultancy Work" : "Reject Consultancy Work"}
                    </h2>
                    <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">Your response will be sent to Principal, IQAC, and HOD</p>

                  <p className="text-gray-700 text-sm mb-6">
                    {response.action === "accept"
                      ? "Please confirm your acceptance and add any relevant comments about your approach or requirements."
                      : "Please provide a detailed reason for rejection to help officials understand your constraints."}
                  </p>

                  <form onSubmit={handleSubmitResponse} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">Selected Work</label>
                      <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50">
                        {selectedWork?.projectTitle}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">Action</label>
                      <div
                        className={`w-full px-3 py-2 text-sm border rounded-md font-medium ${
                          response.action === "accept"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {response.action === "accept" ? "Accept Work" : "Reject Work"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        {response.action === "accept" ? "Acceptance Remarks" : "Rejection Reason"} *
                      </label>
                      <textarea
                        name="remarks"
                        value={response.remarks}
                        onChange={handleInputChange}
                        placeholder={
                          response.action === "accept"
                            ? "Your approach, timeline confirmation, requirements, or additional comments..."
                            : "Detailed reason for rejection (workload, expertise gap, time constraints, etc.)..."
                        }
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:border-opacity-50 outline-none resize-vertical"
                        style={{ "--tw-ring-color": "#9b9aff", "--tw-ring-opacity": "0.5" }}
                        onFocus={(e) => (e.target.style.borderColor = "#0200e1")}
                        onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center space-x-2"
                      style={{ backgroundColor: response.action === "accept" ? "#10B981" : "#EF4444" }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = response.action === "accept" ? "#059669" : "#DC2626";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = response.action === "accept" ? "#10B981" : "#EF4444";
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>{response.action === "accept" ? "Confirm Acceptance" : "Submit Rejection"}</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultancyFaculty;
