import React, { useState } from "react";
import useAuth from "../../store/UseAuth";

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

const ConsultancyIQAC = () => {
  useAuth();
  
  // Mock data for submitted consultancy works (in real app, this would come from API)
  const [consultancyWorks, setConsultancyWorks] = useState([
    {
      id: 1,
      projectTitle: "Smart City IoT Infrastructure Audit",
      clientOrganization: "City Municipal Corporation",
      workDescription: "Comprehensive audit and assessment of existing IoT infrastructure for smart city initiatives. This includes evaluation of current systems, security analysis, and recommendations for improvements.",
      expectedCompletionDate: "2026-06-15",
      submittedAt: "2026-02-15",
      submittedBy: "Principal",
      status: "Pending Assignment",
      assignedDepartment: null,
      iqacRemarks: null
    },
    {
      id: 2,
      projectTitle: "Digital Transformation Strategy",
      clientOrganization: "Regional Development Authority",
      workDescription: "Development of comprehensive digital transformation roadmap for government services modernization including process optimization and technology integration.",
      expectedCompletionDate: "2026-08-30",
      submittedAt: "2026-02-10",
      submittedBy: "Principal",
      status: "Assigned to Department",
      assignedDepartment: "Mechanical Engineering",
      iqacRemarks: "Work Description: Development of comprehensive digital transformation roadmap for government services modernization including process optimization and technology integration.",
      // Additional workflow data for demonstration
      hodAssignment: {
        assignedFaculty: "Prof. R. Gupta (IoT & Networks)",
        targetCompletionDate: "2026-08-15",
        hodRemarks: "Prof. Gupta's background in system analysis makes him suitable for this strategic project."
      },
      facultyResponse: {
        response: "accepted",
        responseDate: "2026-02-17",
        facultyRemarks: "I am interested in this project and have the required expertise. I can commit to the timeline and deliver quality results."
      }
    },
    {
      id: 3,
      projectTitle: "E-Governance Portal Development",
      clientOrganization: "District Collector Office",
      workDescription: "Design and development of citizen services portal with integrated payment gateway and document management system.",
      expectedCompletionDate: "2026-07-20",
      submittedAt: "2026-02-12",
      submittedBy: "Principal",
      status: "Assigned to Department",
      assignedDepartment: "Computer Science & Engineering",
      iqacRemarks: "CSE department has the necessary expertise in web development and database management for this project.",
      hodAssignment: {
        assignedFaculty: "Dr. A. Kumar (Web Technologies)",
        targetCompletionDate: "2026-07-15",
        hodRemarks: "Dr. Kumar has extensive experience in portal development and government projects."
      }
    }
  ]);

  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    selectedWorkId: "",
    workType: "",
    department: "",
    remarks: ""
  });

  const departments = [
    "Computer Science & Engineering",
    "Information Technology",
    "Electronics & Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Business Administration",
    "Management Studies"
  ];

  const handleAssignDepartment = (work) => {
    setAssignmentData({
      selectedWorkId: work.id.toString(),
      workType: inferWorkTypeFromText(work.workDescription),
      department: "",
      remarks: ""
    });
    setShowAssignForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "remarks" && !prev.workType) {
        next.workType = inferWorkTypeFromText(value);
      }
      return next;
    });
  };

  const handleSubmitAssignment = (e) => {
    e.preventDefault();
    
    // Update the consultancy work with department assignment
    setConsultancyWorks(prev => 
      prev.map(work => 
        work.id.toString() === assignmentData.selectedWorkId 
          ? {
              ...work,
              workType: assignmentData.workType,
              assignedDepartment: assignmentData.department,
              iqacRemarks: assignmentData.remarks,
              status: "Assigned to Department"
            }
          : work
      )
    );

    // Reset form and close modal
    setShowAssignForm(false);
    setAssignmentData({
      selectedWorkId: "",
      workType: "",
      department: "",
      remarks: ""
    });
  };

  const closeModal = () => {
    setShowAssignForm(false);
    setAssignmentData({
      selectedWorkId: "",
      workType: "",
      department: "",
      remarks: ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">IQAC - Consultancy Management</h1>
        <p className="text-gray-600">Review and assign consultancy works submitted by Principal to appropriate departments</p>
      </div>

      {/* Main Content Layout */}
      <div className="flex gap-6">
        {/* Consultancy Works Grid */}
        <div className={`${showAssignForm ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
          <div className="space-y-6">
            {consultancyWorks.map((work) => (
              <div key={work.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">{work.projectTitle}</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Submitted: {work.submittedAt}
                    </span>
                    {work.status === "Pending Assignment" && (
                      <button
                        onClick={() => handleAssignDepartment(work)}
                        className="text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                        style={{ backgroundColor: '#0200e1' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#0200e1'}
                      >
                        Assign Department
                      </button>
                    )}
                  </div>
                </div>

                {/* Dynamic Layout based on workflow completion */}
                {work.facultyResponse ? (
                  /* Four-column layout when all stages are complete */
                  <div className="grid grid-cols-4 gap-4">
                    {/* Principal Submission */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                      <h5 className="font-semibold text-gray-700 mb-3 text-base">Principal Submission</h5>
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
                        <p className="text-gray-800 mt-1">
                          {new Date(work.expectedCompletionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* IQAC Assignment */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                      <h5 className="font-semibold text-gray-700 mb-3 text-base">IQAC Assignment</h5>
                      <div>
                        <span className="font-medium text-gray-600">Assigned Department:</span>
                        <p className="text-gray-800 font-semibold mt-1">{work.assignedDepartment}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-600">IQAC Remarks:</span>
                        <p className="text-gray-700 mt-1">{work.iqacRemarks}</p>
                      </div>
                    </div>

                    {/* HOD Assignment */}
                    <div className="bg-blue-50 rounded-lg p-4 space-y-3 text-sm">
                      <h5 className="font-semibold text-gray-700 mb-3 text-base">HOD Assignment</h5>
                      <div>
                        <span className="font-medium text-gray-600">Assigned Faculty:</span>
                        <p className="text-gray-800 font-semibold mt-1">{work.hodAssignment.assignedFaculty}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-600">Target Completion:</span>
                        <p className="text-gray-800 mt-1">
                          {new Date(work.hodAssignment.targetCompletionDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <span className="font-medium text-gray-600">HOD Remarks:</span>
                        <p className="text-gray-700 mt-1">{work.hodAssignment.hodRemarks}</p>
                      </div>
                    </div>

                    {/* Faculty Response */}
                    <div className={`rounded-lg p-4 space-y-3 text-sm ${
                      work.facultyResponse.response === 'accepted' 
                        ? 'bg-green-50' 
                        : 'bg-red-50'
                    }`}>
                      <h5 className="font-semibold text-gray-700 mb-3 text-base">Faculty Response</h5>
                      <div>
                        <span className="font-medium text-gray-600">Response:</span>
                        <p className={`font-semibold mt-1 ${
                          work.facultyResponse.response === 'accepted' ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {work.facultyResponse.response === 'accepted' ? 'Accepted' : 'Rejected'}
                        </p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-600">Response Date:</span>
                        <p className="text-gray-800 mt-1">
                          {new Date(work.facultyResponse.responseDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <span className="font-medium text-gray-600">Faculty Remarks:</span>
                        <p className="text-gray-700 mt-1">{work.facultyResponse.facultyRemarks}</p>
                      </div>
                      
                      <div className={`flex items-center mt-4 pt-3 border-t ${
                        work.facultyResponse.response === 'accepted' ? 'border-green-200' : 'border-red-200'
                      }`}>
                        <svg className={`w-4 h-4 mr-2 ${
                          work.facultyResponse.response === 'accepted' ? 'text-green-600' : 'text-red-600'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className={`text-sm font-medium ${
                          work.facultyResponse.response === 'accepted' 
                            ? 'text-green-700' 
                            : 'text-red-700'
                        }`}>
                          {work.facultyResponse.response === 'accepted' 
                            ? 'Response Sent to All Officials' 
                            : 'Rejection Notified to All Officials'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : work.hodAssignment ? (
                  /* Three-column layout when HOD has assigned but faculty hasn't responded */
                  <div className="grid grid-cols-3 gap-4">
                    {/* Principal Submission */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                      <h5 className="font-semibold text-gray-700 mb-3 text-base">Principal Submission</h5>
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
                        <p className="text-gray-800 mt-1">
                          {new Date(work.expectedCompletionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* IQAC Assignment */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                      <h5 className="font-semibold text-gray-700 mb-3 text-base">IQAC Assignment</h5>
                      <div>
                        <span className="font-medium text-gray-600">Assigned Department:</span>
                        <p className="text-gray-800 font-semibold mt-1">{work.assignedDepartment}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-600">IQAC Remarks:</span>
                        <p className="text-gray-700 mt-1">{work.iqacRemarks}</p>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium text-green-700">Forwarded to HOD & Mail Sent</span>
                        </div>
                      </div>
                    </div>

                    {/* HOD Assignment */}
                    <div className="bg-blue-50 rounded-lg p-4 space-y-3 text-sm">
                      <h5 className="font-semibold text-gray-700 mb-3 text-base">HOD Assignment</h5>
                      <div>
                        <span className="font-medium text-gray-600">Assigned Faculty:</span>
                        <p className="text-gray-800 font-semibold mt-1">{work.hodAssignment.assignedFaculty}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-600">Target Completion:</span>
                        <p className="text-gray-800 mt-1">
                          {new Date(work.hodAssignment.targetCompletionDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <span className="font-medium text-gray-600">HOD Remarks:</span>
                        <p className="text-gray-700 mt-1">{work.hodAssignment.hodRemarks}</p>
                      </div>

                      <div className="pt-3 border-t border-blue-200">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium text-yellow-700">Waiting for Faculty Response</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : work.assignedDepartment ? (
                  /* Two-column layout when IQAC assigned but HOD hasn't assigned faculty */
                  <div className="grid grid-cols-2 gap-6">
                    {/* Principal Submission */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                      <h5 className="font-semibold text-gray-700 mb-3 text-base">Principal Submission</h5>
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
                        <p className="text-gray-800 mt-1">
                          {new Date(work.expectedCompletionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* IQAC Assignment */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                      <h5 className="font-semibold text-gray-700 mb-3 text-base">IQAC Assignment</h5>
                      <div>
                        <span className="font-medium text-gray-600">Assigned Department:</span>
                        <p className="text-gray-800 font-semibold mt-1">{work.assignedDepartment}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-600">IQAC Remarks:</span>
                        <p className="text-gray-700 mt-1">{work.iqacRemarks}</p>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium text-green-700">Forwarded to HOD & Mail Sent</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium text-yellow-700">Waiting for HOD Assignment</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Single column layout when no assignment yet */
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                    <h5 className="font-semibold text-gray-700 mb-3 text-base">Principal Submission</h5>
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
                      <p className="text-gray-800 mt-1">
                        {new Date(work.expectedCompletionDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-yellow-700">Pending IQAC Assignment</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Form - Right Side */}
        {showAssignForm && (
          <div className="w-1/3">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="rounded-full p-2 mr-3" style={{ backgroundColor: '#0200e1' }}>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">IQAC - Allot Department</h2>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition duration-200 p-1 rounded-md hover:bg-gray-100"
                  aria-label="Close form"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                After Principal submission
              </p>

              <p className="text-gray-700 text-sm mb-6">
                Select the most suitable department based on the nature of the work. On submit, the respective HOD will receive an email and see the work in their portal.
              </p>

              <form onSubmit={handleSubmitAssignment} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Select Consultancy Work
                  </label>
                  <select
                    name="workType"
                    value={assignmentData.workType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:border-opacity-50 outline-none"
                    style={{ '--tw-ring-color': '#9b9aff', '--tw-ring-opacity': '0.5' }}
                    onFocus={(e) => e.target.style.borderColor = '#0200e1'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    required
                  >
                    <option value="">Select Work Type</option>
                    <option value="Software Project">Software Project</option>
                    <option value="Industrial Training Project">Industrial Training Project</option>
                    <option value="Drone">Drone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Allot Department
                  </label>
                  <select
                    name="department"
                    value={assignmentData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:border-opacity-50 outline-none"
                    style={{ '--tw-ring-color': '#9b9aff', '--tw-ring-opacity': '0.5' }}
                    onFocus={(e) => e.target.style.borderColor = '#0200e1'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    IQAC Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={assignmentData.remarks}
                    onChange={handleInputChange}
                    placeholder="Justification for department selection, key expectations, and any special instructions..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:border-opacity-50 outline-none resize-vertical"
                    style={{ '--tw-ring-color': '#9b9aff', '--tw-ring-opacity': '0.5' }}
                    onFocus={(e) => e.target.style.borderColor = '#0200e1'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center space-x-2"
                  style={{ backgroundColor: '#0200e1' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#0200e1'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Forward to HOD & Send Mail</span>
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
