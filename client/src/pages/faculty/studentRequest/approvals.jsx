import React, { useState, useMemo, useEffect } from "react";
import { Search, FileText, ChevronDown, Paperclip, Pencil, X, Check } from 'lucide-react';

const SearchIcon = () => <Search className="w-5 h-5" strokeWidth={1.5} />;
const DocumentGenericIcon = () => <FileText className="w-6 h-6 text-indigo-500" strokeWidth={1.5} />;
const ChevronUpDownIcon = ({ expanded }) => (
  <ChevronDown 
    strokeWidth={2} 
    className={`w-5 h-5 transition-transform duration-200 ${expanded ? 'transform rotate-180' : ''}`} 
  />
);
const PaperclipIcon = () => <Paperclip className="w-4 h-4 mr-1.5 text-gray-500" strokeWidth={1.5} />;
const EditIcon = () => <Pencil className="w-4 h-4" strokeWidth={1.5} />;
const RejectIcon = () => <X className="w-4 h-4 mr-1.5" strokeWidth={2.5} />;
const VerifyIcon = () => <Check className="w-4 h-4 mr-1.5" strokeWidth={2.5} />;

// Data transformation function
const transformBackendDataToFrontend = (backendData) => {
  return backendData
    .filter(item => item.rollno && item.applicant_name) // Filter out null entries
    .map((item, index) => ({
      id: `${item.rollno}-${item.domain || 'nodomain'}-${index}`, // Unique ID
      studentName: item.applicant_name,
      submissionDate: item.submitted_date,
      status: item.verified === 'pending' ? 'Awaiting' : 
             item.verified === 'approved' ? 'Verified' : 
             item.verified === 'rejected' ? 'Rejected' : 'Awaiting',
      eventTitle: item.event_name,
      eventType: item.event_type,
      reason: item.problem_statement || `Applied for ${item.domain || 'general'} domain`,
      remarks: `Student ${item.applicant_name} (${item.rollno}) applied for ${item.event_name} in ${item.domain || 'general'} domain`,
      eventDate: item.event_start_date,
      isExpanded: false,
      approvalType: "Event",
      domain: item.domain,
      problemStatement: item.problem_statement,
      rollno: item.rollno,
      verified: item.verified
    }));
};

const SearchBarAndSort = ({ searchTerm, onSearchChange, sortBy, onSortChange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="relative w-full sm:flex-grow">
        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Search by student name or event title..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <div className="flex items-center flex-shrink-0">
        <span className="text-sm text-gray-600 mr-2">Sort by:</span>
        <select 
          className="border border-gray-300 rounded-md py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white shadow-sm"
          value={sortBy}
          onChange={onSortChange}
        >
          <option value="SubmissionDate">Submission Date</option>
          <option value="Name">Name</option>
          <option value="Status">Status</option>
          <option value="ApprovalType">Approval Type</option>
        </select>
      </div>
    </div>
  );
};

const FilterTabs = ({ activeTab, setActiveTab, tabsConfig }) => {
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex space-x-1 -mb-px overflow-x-auto pb-px">
        {tabsConfig.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`py-3 px-4 sm:px-5 font-medium text-sm leading-5 rounded-t-md focus:outline-none transition-colors duration-150 whitespace-nowrap
                        ${
                          activeTab === tab.name
                            ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                        }`}
          >
            {tab.name}
            {tab.count !== null && (
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-xs font-semibold
                                ${
                                  activeTab === tab.name
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

const AttachmentPill = ({ fileName }) => {
    return (
        <button className="inline-flex items-center bg-gray-100 text-gray-700 text-xs font-medium mr-2 mb-2 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-indigo-400">
            <PaperclipIcon />
            {fileName}
        </button>
    );
};

const SubmissionCard = ({ submission, onToggleExpand, onAction }) => {
  const getStatusClasses = (status) => {
    switch (status.toLowerCase()) {
      case "awaiting":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "verified":
        return "bg-green-100 text-green-700 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try parsing "Month D, YYYY" format
        const parts = dateString.match(/(\w+) (\d+), (\d+)/);
        if (parts) {
          const monthNames = ["January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"];
          const monthIndex = monthNames.findIndex(m => m.startsWith(parts[1]));
          if (monthIndex !== -1) {
            const newDate = new Date(Date.UTC(parseInt(parts[3]), monthIndex, parseInt(parts[2])));
            if (!isNaN(newDate.getTime())) {
              return newDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
            }
          }
        }
        return dateString;
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg mb-5 overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-150" 
        onClick={() => onToggleExpand(submission.id)}
      >
        <div className="flex items-center min-w-0">
          <div className="mr-3 flex-shrink-0">
            <DocumentGenericIcon />
          </div>
          <div className="min-w-0">
            <h3 className="text-md font-semibold text-gray-800 truncate">{submission.eventTitle || "N/A"}</h3>
            <div className="flex items-center mt-0.5">
                <p className="text-xs text-gray-500">{submission.studentName}</p>
                {submission.domain && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full border border-purple-300">
                        {submission.domain}
                    </span>
                )}
                {submission.approvalType && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full border border-blue-300">
                        {submission.approvalType}
                    </span>
                )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 ml-2 flex-shrink-0">
          <p className="text-xs text-gray-500 hidden sm:block whitespace-nowrap">{formatDate(submission.submissionDate)}</p>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusClasses(submission.status)} whitespace-nowrap`}>
            {submission.status}
          </span>
          <button aria-label={submission.isExpanded ? "Collapse section" : "Expand section"} className="text-gray-500 hover:text-gray-700">
            <ChevronUpDownIcon expanded={submission.isExpanded} />
          </button>
        </div>
      </div>

      {submission.isExpanded && (
        <div className="p-5">
          {[ 
            { label: "Student Name", value: submission.studentName },
            { label: "Roll Number", value: submission.rollno },
            { label: "Event Title", value: submission.eventTitle },
            { label: "Event Type", value: submission.eventType },
            { label: "Domain", value: submission.domain },
            { label: "Event Date", value: formatDate(submission.eventDate) },
            { label: "Problem Statement", value: submission.problemStatement },
            { label: "Submission Date", value: formatDate(submission.submissionDate) },
            { label: "Current Status", value: submission.verified },
          ].map(detail => (
            detail.value && detail.value !== 'N/A' && detail.value !== null &&
            <div key={detail.label} className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">{detail.label}</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{detail.value}</p>
            </div>
          ))}
          
          <div className="mb-5">
            <label htmlFor={`feedback-${submission.id}`} className="block text-sm font-semibold text-gray-700 mb-1">
              Feedback (Optional)
            </label>
            <div className="relative">
                <textarea
                id={`feedback-${submission.id}`}
                rows="3"
                className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm resize-none"
                placeholder="Add optional feedback or notes about this submission..."
                ></textarea>
                <button className="absolute bottom-2 right-2 text-gray-400 hover:text-gray-600 p-1" title="Formatting options">
                    <EditIcon />
                </button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
                onClick={() => onAction(submission.id, submission.rollno, "reject")}
                className="px-4 py-2 border border-red-500 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors duration-150 flex items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
            >
                <RejectIcon />
                Reject
            </button>
            <button 
                onClick={() => onAction(submission.id, submission.rollno, "verify")}
                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors duration-150 flex items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400"
            >
                <VerifyIcon />
                Verify
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Approvals() {
  const [activeTab, setActiveTab] = useState("Awaiting");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("SubmissionDate"); 

  const KNOWN_STATUSES = ["Awaiting", "Verified", "Rejected"];

  const handleEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("http://localhost:6001/api/manageactivities/approvels", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      // console.log("Approvals events data:", data);
      
      // Transform backend data to frontend format
      const transformedData = transformBackendDataToFrontend(data);
      setSubmissions(transformedData);
      
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load approvals data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleEvents();
  }, []);

  const handleToggleExpand = (id) => {
    setSubmissions(prevSubmissions => 
        prevSubmissions.map(sub => 
            sub.id === id ? { ...sub, isExpanded: !sub.isExpanded } : sub
        )
    );
  };

  const handleAction = async (id, rollno, actionType) => {
    console.log(`Approval for ${id} (rollno: ${rollno}) action: ${actionType}`);
    
    // Find the submission to get necessary data for API call
    const submission = submissions.find(s => s.id === id);
    if (!submission) return;

    try {
      // Here you would make the API call to approve/reject
      // For now, just update the local state
      setSubmissions(prev => prev.map(s => {
        if (s.id === id) {
          return { 
            ...s, 
            status: actionType === 'verify' ? 'Verified' : 'Rejected',
            verified: actionType === 'verify' ? 'approved' : 'rejected',
            isExpanded: false 
          };
        }
        return s;
      }));
      
      // You can add the actual API call here:
      // await updateApprovalStatus(rollno, actionType);
      
    } catch (error) {
      console.error("Error updating approval status:", error);
      // Handle error (show toast notification, etc.)
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const tabData = useMemo(() => {
    const counts = {
        All: submissions.length,
        Awaiting: 0,
        Verified: 0,
        Rejected: 0,
    };
    const domainCounts = {};

    submissions.forEach(sub => {
        if (KNOWN_STATUSES.includes(sub.status)) {
            counts[sub.status]++;
        }
        if (sub.domain) {
            // Handle multiple domains separated by commas
            const domains = sub.domain.split(',').map(d => d.trim());
            domains.forEach(domain => {
                domainCounts[domain] = (domainCounts[domain] || 0) + 1;
            });
        }
    });
    
    const domainTabs = Object.entries(domainCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([domainName, domainCount]) => ({
            name: domainName,
            count: domainCount,
        }));

    return {
        statusCounts: counts,
        domainTabs: domainTabs,
    };
  }, [submissions]);

  const TABS_CONFIG = [
    { name: "All", count: tabData.statusCounts.All },
    { name: "Awaiting", count: tabData.statusCounts.Awaiting },
    { name: "Verified", count: tabData.statusCounts.Verified },
    { name: "Rejected", count: tabData.statusCounts.Rejected },
    // ...tabData.domainTabs,
  ];

  const processedSubmissions = useMemo(() => {
    return submissions
    .filter(submission => {
      let tabMatch = false;
      if (activeTab === "All") {
        tabMatch = true;
      } else if (KNOWN_STATUSES.includes(activeTab)) {
        tabMatch = submission.status === activeTab;
      } else { 
        tabMatch = submission.domain && submission.domain.includes(activeTab);
      }

      if (!tabMatch) return false;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          (submission.eventTitle || "").toLowerCase().includes(term) ||
          (submission.studentName || "").toLowerCase().includes(term) ||
          (submission.rollno || "").toLowerCase().includes(term) ||
          (submission.domain || "").toLowerCase().includes(term)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Name":
          return (a.studentName || "").localeCompare(b.studentName || "");
        case "Status":
          return (a.status || "").localeCompare(b.status || "");
        case "ApprovalType":
          return (a.approvalType || "").localeCompare(b.approvalType || "");
        case "SubmissionDate": 
        default:
          return new Date(b.submissionDate) - new Date(a.submissionDate);
      }
    });
  }, [submissions, activeTab, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading approvals...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12 text-red-500 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium">Error Loading Data</h3>
            <p className="text-sm mt-2">{error}</p>
            <button 
              onClick={handleEvents}
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-5xl mx-auto">
        <SearchBarAndSort 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
        <FilterTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          tabsConfig={TABS_CONFIG}
        />
        
        {processedSubmissions.length > 0 ? (
            processedSubmissions.map((submission) => (
              <SubmissionCard 
                key={submission.id} 
                submission={submission} 
                onToggleExpand={handleToggleExpand}
                onAction={handleAction}
              />
            ))
        ) : (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-medium">No submissions found</h3>
                <p className="text-sm">
                  {searchTerm 
                    ? `No submissions match your search for "${searchTerm}" under the "${activeTab}" filter.`
                    : `There are no submissions to display for the "${activeTab}" filter.`
                  }
                </p>
            </div>
        )}
      </div>
    </div>
  );
}