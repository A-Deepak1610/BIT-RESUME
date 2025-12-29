import React, {useState, useMemo, useEffect} from "react";
import {
  Search,
  FileText,
  ChevronDown,
  Paperclip,
  Pencil,
  X,
  Check,
} from "lucide-react";

// Icon components
const SearchIcon = () => <Search className="w-5 h-5" strokeWidth={1.5} />;
const DocumentGenericIcon = () => (
  <FileText className="w-6 h-6 text-indigo-500" strokeWidth={1.5} />
);
const ChevronUpDownIcon = ({expanded}) => (
  <ChevronDown
    strokeWidth={2}
    className={`w-5 h-5 transition-transform duration-200 ${
      expanded ? "transform rotate-180" : ""
    }`}
  />
);
const PaperclipIcon = () => (
  <Paperclip className="w-4 h-4 mr-1.5 text-gray-500" strokeWidth={1.5} />
);
const EditIcon = () => <Pencil className="w-4 h-4" strokeWidth={1.5} />;
const RejectIcon = () => <X className="w-4 h-4 mr-1.5" strokeWidth={2.5} />;
const VerifyIcon = () => <Check className="w-4 h-4 mr-1.5" strokeWidth={2.5} />;

// Dummy faculty approvals data (event registrations)
const dummyFacultyApprovals = [
  {
    id: "APP001",
    facultyId: "FAC001",
    facultyName: "Dr. John Smith",
    department: "CSE",
    submissionDate: "2024-12-15",
    status: "Awaiting",
    eventTitle: "International AI Conference 2025",
    eventCode: "IAC2025",
    eventType: "International Conference",
    eventDate: "2025-02-15",
    domain: "Artificial Intelligence",
    reason: "Paper presentation on novel deep learning architectures for NLP",
    remarks: "Requesting travel grant and registration fee support",
    verified: "pending",
  },
  {
    id: "APP002",
    facultyId: "FAC002",
    facultyName: "Dr. Sarah Johnson",
    department: "CSE",
    submissionDate: "2024-12-14",
    status: "Awaiting",
    eventTitle: "Faculty Development Program on Blockchain",
    eventCode: "FDP-BC-2025",
    eventType: "FDP",
    eventDate: "2025-01-20",
    domain: "Blockchain Technology",
    reason: "To gain knowledge on blockchain applications in supply chain",
    remarks: "5-day program at IIT Bombay",
    verified: "pending",
  },
  {
    id: "APP003",
    facultyId: "FAC003",
    facultyName: "Prof. Michael Brown",
    department: "ECE",
    submissionDate: "2024-12-13",
    status: "Verified",
    eventTitle: "IEEE Workshop on IoT Security",
    eventCode: "IEEE-IOT-SEC",
    eventType: "Workshop",
    eventDate: "2025-01-10",
    domain: "IoT Security",
    reason: "Workshop participation and networking with industry experts",
    remarks: "Approved for workshop attendance",
    verified: "accepted",
  },
  {
    id: "APP004",
    facultyId: "FAC004",
    facultyName: "Dr. Emily Davis",
    department: "IT",
    submissionDate: "2024-12-12",
    status: "Awaiting",
    eventTitle: "National Symposium on Cloud Computing",
    eventCode: "NSCC-2025",
    eventType: "National Conference",
    eventDate: "2025-03-05",
    domain: "Cloud Computing",
    reason: "Presenting research on serverless architecture optimization",
    remarks: "Co-authored paper with industry collaboration",
    verified: "pending",
  },
  {
    id: "APP005",
    facultyId: "FAC005",
    facultyName: "Prof. Robert Wilson",
    department: "MECH",
    submissionDate: "2024-12-11",
    status: "Rejected",
    eventTitle: "International Manufacturing Summit",
    eventCode: "IMS-2025",
    eventType: "Summit",
    eventDate: "2025-04-20",
    domain: "Manufacturing",
    reason: "Industry exposure and latest trends in smart manufacturing",
    remarks: "Rejected due to overlapping academic schedule",
    verified: "rejected",
  },
  {
    id: "APP006",
    facultyId: "FAC006",
    facultyName: "Dr. Jennifer Martinez",
    department: "EEE",
    submissionDate: "2024-12-10",
    status: "Awaiting",
    eventTitle: "Power Electronics Conference",
    eventCode: "PEC-2025",
    eventType: "International Conference",
    eventDate: "2025-02-28",
    domain: "Power Electronics",
    reason: "Keynote speaker invitation for EV power systems session",
    remarks: "Invited as session chair",
    verified: "pending",
  },
  {
    id: "APP007",
    facultyId: "FAC007",
    facultyName: "Dr. David Lee",
    department: "CIVIL",
    submissionDate: "2024-12-09",
    status: "Verified",
    eventTitle: "Sustainable Construction Workshop",
    eventCode: "SCW-2025",
    eventType: "Workshop",
    eventDate: "2025-01-25",
    domain: "Green Building",
    reason: "Hands-on training on sustainable construction materials",
    remarks: "Approved with travel allowance",
    verified: "accepted",
  },
  {
    id: "APP008",
    facultyId: "FAC008",
    facultyName: "Prof. Amanda White",
    department: "AIDS",
    submissionDate: "2024-12-08",
    status: "Awaiting",
    eventTitle: "Machine Learning Bootcamp",
    eventCode: "MLB-2025",
    eventType: "Bootcamp",
    eventDate: "2025-02-10",
    domain: "Machine Learning",
    reason: "Advanced ML techniques training for curriculum enhancement",
    remarks: "Week-long intensive program",
    verified: "pending",
  },
];

// Components
const SearchBarAndSort = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="relative w-full sm:flex-grow">
        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Search by faculty name, event title, or event code..."
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
          <option value="EventType">Event Type</option>
        </select>
      </div>
    </div>
  );
};

const FilterTabs = ({activeTab, setActiveTab, tabsConfig}) => {
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

const SubmissionCard = ({submission, onToggleExpand, onAction}) => {
  const [adminRemarks, setAdminRemarks] = useState("");

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
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
    } catch (error) {
      return dateString;
    }
  };

  const showActionButtons = submission.status === "Awaiting";

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
            <h3 className="text-md font-semibold text-gray-800 truncate">
              {submission.eventTitle || "N/A"}
            </h3>
            <div className="flex items-center mt-0.5 flex-wrap gap-1">
              <p className="text-xs text-gray-500">{submission.facultyName}</p>
              {submission.eventCode && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-300">
                  {submission.eventCode}
                </span>
              )}
              {submission.domain && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full border border-purple-300">
                  {submission.domain}
                </span>
              )}
              {submission.department && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full border border-blue-300">
                  {submission.department}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 ml-2 flex-shrink-0">
          <p className="text-xs text-gray-500 hidden sm:block whitespace-nowrap">
            {formatDate(submission.submissionDate)}
          </p>
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusClasses(
              submission.status
            )} whitespace-nowrap`}
          >
            {submission.status}
          </span>
          <button
            aria-label={
              submission.isExpanded ? "Collapse section" : "Expand section"
            }
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronUpDownIcon expanded={submission.isExpanded} />
          </button>
        </div>
      </div>

      {submission.isExpanded && (
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[
              {label: "Faculty Name", value: submission.facultyName},
              {label: "Faculty ID", value: submission.facultyId},
              {label: "Department", value: submission.department},
              {label: "Event Title", value: submission.eventTitle},
              {label: "Event Code", value: submission.eventCode},
              {label: "Event Type", value: submission.eventType},
              {label: "Domain", value: submission.domain},
              {label: "Event Date", value: formatDate(submission.eventDate)},
              {
                label: "Submission Date",
                value: formatDate(submission.submissionDate),
              },
            ].map(
              (detail) =>
                detail.value && (
                  <div key={detail.label}>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">
                      {detail.label}
                    </h4>
                    <p className="text-sm text-gray-600">{detail.value}</p>
                  </div>
                )
            )}
          </div>

          {submission.reason && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Reason for Attending
              </h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {submission.reason}
              </p>
            </div>
          )}

          {submission.remarks && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Faculty Remarks
              </h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {submission.remarks}
              </p>
            </div>
          )}

          {showActionButtons && (
            <>
              <div className="mb-5">
                <label
                  htmlFor={`feedback-${submission.id}`}
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Admin Feedback (Optional)
                </label>
                <div className="relative">
                  <textarea
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    value={adminRemarks}
                    id={`feedback-${submission.id}`}
                    rows="3"
                    className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm resize-none"
                    placeholder="Add optional feedback or notes..."
                  ></textarea>
                  <button
                    className="absolute bottom-2 right-2 text-gray-400 hover:text-gray-600 p-1"
                    title="Formatting options"
                  >
                    <EditIcon />
                  </button>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() =>
                    onAction(submission.id, "reject", adminRemarks)
                  }
                  className="px-4 py-2 border border-red-500 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors duration-150 flex items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
                >
                  <RejectIcon />
                  Reject
                </button>
                <button
                  onClick={() =>
                    onAction(submission.id, "verify", adminRemarks)
                  }
                  className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors duration-150 flex items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400"
                >
                  <VerifyIcon />
                  Approve
                </button>
              </div>
            </>
          )}

          {!showActionButtons && (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">
                This request has already been {submission.status.toLowerCase()}.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main Component
export default function FacultyApprovals() {
  const [activeTab, setActiveTab] = useState("Awaiting");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("SubmissionDate");

  const KNOWN_STATUSES = ["Awaiting", "Verified", "Rejected"];

  // Load dummy data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubmissions(
        dummyFacultyApprovals.map((a) => ({...a, isExpanded: false}))
      );
      setLoading(false);
    }, 500);
  }, []);

  const handleToggleExpand = (id) => {
    setSubmissions((prevSubmissions) =>
      prevSubmissions.map((sub) =>
        sub.id === id ? {...sub, isExpanded: !sub.isExpanded} : sub
      )
    );
  };

  const handleAction = (id, actionType, adminRemarks) => {
    const newStatusLabel = actionType === "verify" ? "Verified" : "Rejected";
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {...s, status: newStatusLabel, isExpanded: false};
        }
        return s;
      })
    );
    // In real implementation, call API here
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleSortChange = (event) => setSortBy(event.target.value);

  const tabData = useMemo(() => {
    const counts = {
      All: submissions.length,
      Awaiting: 0,
      Verified: 0,
      Rejected: 0,
    };
    submissions.forEach((sub) => {
      if (KNOWN_STATUSES.includes(sub.status)) {
        counts[sub.status]++;
      }
    });
    return {statusCounts: counts};
  }, [submissions]);

  const TABS_CONFIG = [
    {name: "All", count: tabData.statusCounts.All},
    {name: "Awaiting", count: tabData.statusCounts.Awaiting},
    {name: "Verified", count: tabData.statusCounts.Verified},
    {name: "Rejected", count: tabData.statusCounts.Rejected},
  ];

  const processedSubmissions = useMemo(() => {
    return submissions
      .filter((submission) => {
        const tabMatch = activeTab === "All" || submission.status === activeTab;
        if (!tabMatch) return false;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          return (
            (submission.eventTitle || "").toLowerCase().includes(term) ||
            (submission.facultyName || "").toLowerCase().includes(term) ||
            (submission.facultyId || "").toLowerCase().includes(term) ||
            (submission.eventCode || "").toLowerCase().includes(term) ||
            (submission.domain || "").toLowerCase().includes(term) ||
            (submission.department || "").toLowerCase().includes(term)
          );
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "Name":
            return (a.facultyName || "").localeCompare(b.facultyName || "");
          case "Status":
            return (a.status || "").localeCompare(b.status || "");
          case "EventType":
            return (a.eventType || "").localeCompare(b.eventType || "");
          default:
            return new Date(b.submissionDate) - new Date(a.submissionDate);
        }
      });
  }, [submissions, activeTab, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading approvals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-medium">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Faculty Approvals
          </h1>
          <p className="text-gray-600 mt-1">
            Review and approve faculty event registration requests
          </p>
        </div>

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
            <FileText className="w-12 h-12 mb-4 mx-auto text-gray-300" />
            <h3 className="text-lg font-medium">No requests found</h3>
            <p className="text-sm">
              {searchTerm
                ? `No results for "${searchTerm}" in "${activeTab}".`
                : `No requests in "${activeTab}".`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
