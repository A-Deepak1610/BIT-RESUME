import React, { useState, useMemo } from "react";
import { Search, FileText, ChevronDown, Paperclip, Pencil, X, Check } from 'lucide-react';
import initialSubmissionsData from "../../../dummydatas/approval.json"

// const initialSubmissionsData = [
//   {
//     "id": 1,
//     "studentName": "Miguel Rodriguez",
//     "submissionDate": "2025-05-01", // Standardized date format for easier sorting/parsing
//     "status": "Awaiting",
//     "eventTitle": "Urban Water Management Conference",
//     "eventType": "Seminar",
//     "reason": "To present a research paper on sustainable urban water management solutions.",
//     "remarks": "Paper already cited by three researchers; opportunity to represent the institution.",
//     "eventDate": "2025-04-25", // Standardized date format
//     "attachments": ["research_paper.pdf", "journal_acceptance.pdf"],
//     "isExpanded": false,
//     "approvalType": "OD"
//   },
//   {
//     "id": 2,
//     "studentName": "Zoe Williams",
//     "submissionDate": "2025-05-08",
//     "status": "Awaiting",
//     "eventTitle": "International Conference on Quantum Computing",
//     "eventType": "Conference",
//     "reason": "To present research on qubit stability and attend networking sessions.",
//     "remarks": "Received positive peer review and valuable feedback from leading experts.",
//     "eventDate": "2025-05-05",
//     "attachments": ["conference_submission.pdf", "presentation_slides.pptx", "research_poster.png"],
//     "isExpanded": false,
//     "approvalType": "OD"
//   },
//   {
//     "id": 3,
//     "studentName": "Aisha Khan",
//     "submissionDate": "2025-04-15",
//     "status": "Verified",
//     "eventTitle": "AI in Healthcare Diagnostics Workshop",
//     "eventType": "Workshop",
//     "reason": "To present AI model research and attend expert sessions on diagnostic AI tools.",
//     "remarks": "Research accepted in JMIR; model achieved 95% accuracy in trials.",
//     "eventDate": "2025-03-30",
//     "attachments": ["thesis_final_chapter.pdf", "publication_acceptance_letter.pdf"],
//     "isExpanded": false,
//     "approvalType": "OD"
//   },
//   {
//     "id": 4,
//     "studentName": "David Lee",
//     "submissionDate": "2025-03-20",
//     "status": "Rejected",
//     "eventTitle": "Energy Storage Tech Symposium",
//     "eventType": "Symposium",
//     "reason": "To present comparative research on battery technologies.",
//     "remarks": "Research scope too broad; further refinement needed before future participation.",
//     "eventDate": "2025-02-28",
//     "attachments": ["research_proposal_v2.pdf", "lab_notebook_summary.docx"],
//     "isExpanded": false,
//     "approvalType": "OD"
//   }
// ];


// --- Icon Components (using Lucide-React) ---
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


const SearchBarAndSort = ({ searchTerm, onSearchChange, sortBy, onSortChange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="relative w-full sm:flex-grow">
        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Search by student name or event title..." // Updated placeholder
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
          <option value="ApprovalType">Approval Type</option> {/* Updated */}
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
    // Assuming dateString is in "YYYY-MM-DD" or "Month D, YYYY" format
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { // Check if date is valid
        // Try parsing "Month D, YYYY" if initial parsing failed (e.g. "May 1, 2025")
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
        return dateString; // Return original if parsing fails
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
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
            <h3 className="text-md font-semibold text-gray-800 truncate">{submission.eventTitle || "N/A"}</h3> {/* Updated */}
            <div className="flex items-center mt-0.5">
                <p className="text-xs text-gray-500">{submission.studentName}</p>
                {submission.approvalType && ( // Updated
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
            { label: "Approval Type", value: submission.approvalType || 'N/A' },
            { label: "Event Title", value: submission.eventTitle || 'N/A' },
            { label: "Event Type", value: submission.eventType || 'N/A' }, // Added
            { label: "Event Date", value: formatDate(submission.eventDate) },
            { label: "Reason", value: submission.reason || 'N/A' }, // Updated
            { label: "Remarks", value: submission.remarks || 'N/A' }, // Updated
            { label: "Submission Date", value: formatDate(submission.submissionDate) },
          ].map(detail => (
            detail.value && detail.value !== 'N/A' && 
            <div key={detail.label} className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">{detail.label}</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{detail.value}</p>
            </div>
          ))}
          
          {submission.attachments && submission.attachments.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
              <div className="flex flex-wrap">
                {submission.attachments.map((file, index) => (
                  <AttachmentPill key={index} fileName={file} />
                ))}
              </div>
            </div>
          )}
          
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
                onClick={() => onAction(submission.id, "reject")}
                className="px-4 py-2 border border-red-500 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors duration-150 flex items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
            >
                <RejectIcon />
                Reject
            </button>
            <button 
                onClick={() => onAction(submission.id, "verify")}
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
  const [submissions, setSubmissions] = useState(
    initialSubmissionsData.map(sub => ({...sub, submissionDate: new Date(sub.submissionDate).toISOString(), eventDate: new Date(sub.eventDate).toISOString()}))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("SubmissionDate"); 

  const KNOWN_STATUSES = ["Awaiting", "Verified", "Rejected"];

  const handleToggleExpand = (id) => {
    setSubmissions(prevSubmissions => 
        prevSubmissions.map(sub => 
            sub.id === id ? { ...sub, isExpanded: !sub.isExpanded } : sub
        )
    );
  };

  const handleAction = (id, actionType) => {
    console.log(`Approval for ${id} action: ${actionType}`);
    setSubmissions(prev => prev.map(s => {
        if (s.id === id) {
            return { ...s, status: actionType === 'verify' ? 'Verified' : 'Rejected', isExpanded: false };
        }
        return s;
    }));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const tabData = useMemo(() => {
    const counts = {
        All: initialSubmissionsData.length, // Use original data for counts to remain static
        Awaiting: 0,
        Verified: 0,
        Rejected: 0,
    };
    const approvalTypeCounts = {};

    initialSubmissionsData.forEach(sub => { // Use original data for counts
        if (KNOWN_STATUSES.includes(sub.status)) {
            counts[sub.status]++;
        }
        if (sub.approvalType) { // Updated
            approvalTypeCounts[sub.approvalType] = (approvalTypeCounts[sub.approvalType] || 0) + 1;
        }
    });
    
    const approvalTypeTabs = Object.entries(approvalTypeCounts) // Updated
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([typeName, typeCount]) => ({
            name: typeName,
            count: typeCount,
        }));

    return {
        statusCounts: counts,
        approvalTypeTabs: approvalTypeTabs, // Updated
    };
  }, []); // Removed initialSubmissionsData from dependency array if it's static

  const TABS_CONFIG = [
    { name: "All", count: tabData.statusCounts.All },
    { name: "Awaiting", count: tabData.statusCounts.Awaiting },
    { name: "Verified", count: tabData.statusCounts.Verified },
    { name: "Rejected", count: tabData.statusCounts.Rejected },
    ...tabData.approvalTypeTabs, // Updated
  ];

  const processedSubmissions = useMemo(() => {
    return submissions // Use the stateful submissions for dynamic list
    .filter(submission => {
      let tabMatch = false;
      if (activeTab === "All") {
        tabMatch = true;
      } else if (KNOWN_STATUSES.includes(activeTab)) {
        tabMatch = submission.status === activeTab;
      } else { 
        tabMatch = submission.approvalType === activeTab; // Updated
      }

      if (!tabMatch) return false;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          (submission.eventTitle || "").toLowerCase().includes(term) || // Updated
          (submission.studentName || "").toLowerCase().includes(term)
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
        case "ApprovalType": // Updated
          return (a.approvalType || "").localeCompare(b.approvalType || "");
        case "SubmissionDate": 
        default:
          return new Date(b.submissionDate) - new Date(a.submissionDate);
      }
    });
  }, [submissions, activeTab, searchTerm, sortBy]);


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
                <h3 className="text-lg font-medium">No submissions found</h3> {/* Updated text */}
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