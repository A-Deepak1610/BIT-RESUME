import React, { useState } from "react";
import useAuth from "../../store/UseAuth";

const ConsultancyPrincipal = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    clientOrganization: "",
    projectTitle: "",
    workDescription: "",
    expectedCompletionDate: "",
    attachments: null
  });

  const [submittedWorks, setSubmittedWorks] = useState([
    {
      id: 1,
      clientOrganization: "Regional Development Authority",
      projectTitle: "Digital Transformation Strategy",
      workDescription: "Development of comprehensive digital transformation roadmap for government services modernization including process optimization and technology integration.",
      expectedCompletionDate: "2026-08-30",
      submittedAt: "2026-02-10",
      iqacAssignment: {
        assignedDepartment: "Computer Science & Engineering",
        iqacRemarks: "Requires expertise in digital systems and process automation. Strategic planning capabilities essential.",
        assignedAt: "2026-02-11",
        forwardedToHOD: true
      },
      hodAssignment: {
        assignedFaculty: "Prof. R. Gupta (IoT & Networks)", 
        hodRemarks: "Prof. Gupta's background in system analysis makes him suitable for this strategic project.",
        targetCompletionDate: "2026-08-15",
        assignedAt: "2026-02-12"
      },
      facultyResponse: {
        response: "accepted",
        facultyRemarks: "I am interested in this project and have the required expertise. I can commit to the timeline and deliver quality results.",
        responseDate: "2026-02-17"
      },
      status: {
        iqac: { completed: true, pending: false, label: "IQAC Review" },
        hod: { completed: true, pending: false, label: "HOD Assignment" },
        faculty: { completed: true, pending: false, label: "Faculty Response" }
      }
    }
  ]);
  const [showForm, setShowForm] = useState(true);

  // Simulate IQAC assignment updates (in real app, this would come from API)
  const simulateIQACAssignment = () => {
    setTimeout(() => {
      setSubmittedWorks(prev => 
        prev.map(work => 
          work.id === prev[0]?.id ? {
            ...work,
            iqacAssignment: {
              assignedDepartment: "Mechanical Engineering",
              iqacRemarks: "Work Description: Development of comprehensive digital transformation roadmap for government services modernization including process optimization and technology integration.",
              assignedAt: new Date().toLocaleDateString(),
              forwardedToHOD: true
            },
            status: {
              iqac: { completed: true, pending: false, label: "IQAC Review" },
              hod: { completed: false, pending: true, label: "HOD Assignment" },
              faculty: { completed: false, pending: false, label: "Faculty Execution" }
            }
          } : work
        )
      );
    }, 5000); // Simulate IQAC assignment after 5 seconds
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      attachments: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add the form data to submitted works with current timestamp
    const newWork = {
      ...formData,
      id: Date.now(),
      submittedAt: new Date().toLocaleDateString(),
      status: {
        iqac: { completed: false, pending: true, label: "IQAC Review" },
        hod: { completed: false, pending: false, label: "HOD Assignment" },
        faculty: { completed: false, pending: false, label: "Faculty Execution" }
      }
    };
    setSubmittedWorks(prev => [...prev, newWork]);
    
    // Reset form and hide it
    setFormData({
      clientOrganization: "",
      projectTitle: "",
      workDescription: "",
      expectedCompletionDate: "",
      attachments: null
    });
    setShowForm(false);
    
    // Simulate IQAC assignment for demonstration
    simulateIQACAssignment();
  };

  const handleNewInitiative = () => {
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header with New Initiative Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Consultancy Works</h1>
        <button
          onClick={handleNewInitiative}
          className="text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center space-x-2"
          style={{ backgroundColor: '#0200e1' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#0200e1'}
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
          <div className="max-w-sm">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="rounded-full p-1.5 mr-2" style={{ backgroundColor: '#0200e1' }}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Principal - Initiate New Work</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition duration-200 p-1 rounded-md hover:bg-gray-100"
                  aria-label="Close form"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 text-xs mb-4">
                Describe the external work request received by email. Submitting will create a consultancy record, send mail to IQAC, and display it in the portal.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Client Organization
                  </label>
                  <input
                    type="text"
                    name="clientOrganization"
                    value={formData.clientOrganization}
                    onChange={handleInputChange}
                    placeholder="e.g. City Municipal Corporation"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Project Title
                  </label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                    placeholder="Short descriptive title of the consultancy work"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:border-opacity-50 outline-none transition duration-200"
                    style={{ '--tw-ring-color': '#9b9aff', '--tw-ring-opacity': '0.5' }}
                    onFocus={(e) => e.target.style.borderColor = '#0200e1'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Work Description & Requirements
                  </label>
                  <textarea
                    name="workDescription"
                    value={formData.workDescription}
                    onChange={handleInputChange}
                    placeholder="Detailed description of the work, scope, deliverables, and timelines..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:border-opacity-50 outline-none transition duration-200 resize-vertical"
                    style={{ '--tw-ring-color': '#9b9aff', '--tw-ring-opacity': '0.5' }}
                    onFocus={(e) => e.target.style.borderColor = '#0200e1'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Expected Completion Date
                  </label>
                  <input
                    type="date"
                    name="expectedCompletionDate"
                    value={formData.expectedCompletionDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:border-opacity-50 outline-none transition duration-200"
                    style={{ '--tw-ring-color': '#9b9aff', '--tw-ring-opacity': '0.5' }}
                    onFocus={(e) => e.target.style.borderColor = '#0200e1'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    required
                  />
                </div>

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
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-3 text-center hover:border-gray-400 transition duration-200">
                      <div className="mb-1">
                        <svg className="mx-auto h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {formData.attachments ? formData.attachments.name : "Click to upload PDF/Doc"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center space-x-2 text-sm"
                  style={{ backgroundColor: '#0200e1' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#0200e1'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Submit & Notify IQAC</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Submitted Works Cards Section */}
        <div className="flex-1">
          {submittedWorks.length > 0 ? (
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold text-gray-800">Submitted Consultancy Works</h3>
              {submittedWorks.map((work) => (
                <div key={work.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">{work.projectTitle}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Submitted: {work.submittedAt}
                    </span>
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
                          <p className="text-gray-800 font-semibold mt-1">{work.iqacAssignment.assignedDepartment}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-600">IQAC Remarks:</span>
                          <p className="text-gray-700 mt-1">{work.iqacAssignment.iqacRemarks}</p>
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
                  ) : work.iqacAssignment ? (
                    /* Three-column layout when IQAC has assigned but faculty hasn't responded */
                    <div className="grid grid-cols-3 gap-4">
                      {/* Left - Work Details */}
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
                        
                        {work.attachments && (
                          <div>
                            <span className="font-medium text-gray-600">Attachment:</span>
                            <p className="text-gray-800 mt-1">{work.attachments.name}</p>
                          </div>
                        )}
                      </div>

                      {/* Middle - IQAC Assignment */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                        <h5 className="font-semibold text-gray-700 mb-3 text-base">IQAC Assignment</h5>
                        <div>
                          <span className="font-medium text-gray-600">Assigned Department:</span>
                          <p className="text-gray-800 font-semibold mt-1">{work.iqacAssignment.assignedDepartment}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-600">IQAC Remarks:</span>
                          <p className="text-gray-700 mt-1">{work.iqacAssignment.iqacRemarks}</p>
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

                      {/* Right - Progress Status */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                        <h5 className="font-semibold text-gray-700 mb-3 text-base">Progress Status</h5>
                        <div className="space-y-4">
                            {/* IQAC Status */}
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                work.status.iqac.completed 
                                  ? 'bg-green-500' 
                                  : work.status.iqac.pending 
                                  ? 'bg-yellow-500' 
                                  : 'bg-gray-300'
                              }`}>
                                {work.status.iqac.completed && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {work.status.iqac.pending && !work.status.iqac.completed && (
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <span className="font-medium text-gray-700">{work.status.iqac.label}</span>
                                <div className="text-xs text-gray-500">
                                  {work.status.iqac.completed 
                                    ? 'Completed' 
                                    : work.status.iqac.pending 
                                    ? 'In Progress' 
                                    : 'Pending'
                                  }
                                </div>
                              </div>
                            </div>

                            {/* HOD Status */}
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                work.status.hod.completed 
                                  ? 'bg-green-500' 
                                  : work.status.hod.pending 
                                  ? 'bg-yellow-500' 
                                  : 'bg-gray-300'
                              }`}>
                                {work.status.hod.completed && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {work.status.hod.pending && !work.status.hod.completed && (
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <span className="font-medium text-gray-700">{work.status.hod.label}</span>
                                <div className="text-xs text-gray-500">
                                  {work.status.hod.completed 
                                    ? 'Completed' 
                                    : work.status.hod.pending 
                                    ? 'In Progress' 
                                    : 'Pending'
                                  }
                                </div>
                              </div>
                            </div>

                            {/* Faculty Status */}
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                work.status.faculty.completed 
                                  ? 'bg-green-500' 
                                  : work.status.faculty.pending 
                                  ? 'bg-yellow-500' 
                                  : 'bg-gray-300'
                              }`}>
                                {work.status.faculty.completed && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {work.status.faculty.pending && !work.status.faculty.completed && (
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <span className="font-medium text-gray-700">{work.status.faculty.label}</span>
                                <div className="text-xs text-gray-500">
                                  {work.status.faculty.completed 
                                    ? 'Completed' 
                                    : work.status.faculty.pending 
                                    ? 'In Progress' 
                                    : 'Pending'
                                  }
                                </div>
                              </div>
                            </div>
                          </div>

                        {/* Overall Status */}
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 text-yellow-600">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm font-medium">Waiting for HOD Assignment</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Two-column layout when IQAC hasn't assigned yet */
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left Side - Work Description */}
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
                        
                        {work.attachments && (
                          <div>
                            <span className="font-medium text-gray-600">Attachment:</span>
                            <p className="text-gray-800 mt-1">{work.attachments.name}</p>
                          </div>
                        )}
                      </div>

                      {/* Right Side - Status Tracking */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                        <h5 className="font-semibold text-gray-700 mb-3 text-base">Progress Status</h5>
                        <div className="space-y-4">
                            {/* IQAC Status */}
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                work.status.iqac.completed 
                                  ? 'bg-green-500' 
                                  : work.status.iqac.pending 
                                  ? 'bg-yellow-500' 
                                  : 'bg-gray-300'
                              }`}>
                                {work.status.iqac.completed && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {work.status.iqac.pending && !work.status.iqac.completed && (
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <span className="font-medium text-gray-700">{work.status.iqac.label}</span>
                                <div className="text-xs text-gray-500">
                                  {work.status.iqac.completed 
                                    ? 'Completed' 
                                    : work.status.iqac.pending 
                                    ? 'In Progress' 
                                    : 'Pending'
                                  }
                                </div>
                              </div>
                            </div>

                            {/* HOD Status */}
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                work.status.hod.completed 
                                  ? 'bg-green-500' 
                                  : work.status.hod.pending 
                                  ? 'bg-yellow-500' 
                                  : 'bg-gray-300'
                              }`}>
                                {work.status.hod.completed && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {work.status.hod.pending && !work.status.hod.completed && (
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <span className="font-medium text-gray-700">{work.status.hod.label}</span>
                                <div className="text-xs text-gray-500">
                                  {work.status.hod.completed 
                                    ? 'Completed' 
                                    : work.status.hod.pending 
                                    ? 'In Progress' 
                                    : 'Pending'
                                  }
                                </div>
                              </div>
                            </div>

                            {/* Faculty Status */}
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                work.status.faculty.completed 
                                  ? 'bg-green-500' 
                                  : work.status.faculty.pending 
                                  ? 'bg-yellow-500' 
                                  : 'bg-gray-300'
                              }`}>
                                {work.status.faculty.completed && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {work.status.faculty.pending && !work.status.faculty.completed && (
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <span className="font-medium text-gray-700">{work.status.faculty.label}</span>
                                <div className="text-xs text-gray-500">
                                  {work.status.faculty.completed 
                                    ? 'Completed' 
                                    : work.status.faculty.pending 
                                    ? 'In Progress' 
                                    : 'Pending'
                                  }
                                </div>
                              </div>
                            </div>
                          </div>

                        {/* Overall Status */}
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 text-yellow-600">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm font-medium">Waiting for IQAC Review</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No consultancy works yet</h3>
              <p className="mt-2 text-gray-500">Click "New Initiative Work" to start describing your first external work request.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultancyPrincipal;
