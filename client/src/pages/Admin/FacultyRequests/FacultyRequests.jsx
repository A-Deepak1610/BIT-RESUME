import React, {useState, useMemo} from "react";
import {
  Search,
  ChevronDown,
  Paperclip,
  X,
  Check,
  FileText,
  Newspaper,
  Monitor,
  Users,
  Calendar,
  ClipboardCheck,
  PenTool,
  Mic,
  Plane,
  Trophy,
  Video,
  UserCheck,
  Building,
  MapPin,
  Clock,
  Award,
  Globe,
  BookOpen,
  GraduationCap,
  ExternalLink,
  Link2,
} from "lucide-react";

// Icons object
const ICONS = {
  Search: () => <Search className="w-5 h-5" strokeWidth={1.5} />,
  DocumentGeneric: () => (
    <FileText className="w-6 h-6 text-indigo-500" strokeWidth={1.5} />
  ),
  Chevron: ({expanded}) => (
    <ChevronDown
      strokeWidth={2}
      className={`w-5 h-5 transition-transform duration-200 ${
        expanded ? "transform rotate-180" : ""
      }`}
    />
  ),
  Paperclip: () => (
    <Paperclip className="w-4 h-4 mr-1.5 text-gray-500" strokeWidth={1.5} />
  ),
  Reject: () => <X className="w-4 h-4 mr-1.5" strokeWidth={2.5} />,
  Verify: () => <Check className="w-4 h-4 mr-1.5" strokeWidth={2.5} />,
  Calendar: () => (
    <Calendar className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  MapPin: () => (
    <MapPin className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  Building: () => (
    <Building className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  Users: () => (
    <Users className="w-4 h-4 mr-1.5 text-blue-600" strokeWidth={1.5} />
  ),
  Trophy: () => (
    <Trophy className="w-4 h-4 mr-1.5 text-yellow-600" strokeWidth={1.5} />
  ),
  Link2: () => <Link2 className="w-4 h-4 mr-1.5" strokeWidth={1.5} />,
  FileText: () => (
    <FileText className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  Globe: () => (
    <Globe className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  Clock: () => (
    <Clock className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  Award: () => (
    <Award className="w-4 h-4 mr-1.5 text-yellow-600" strokeWidth={1.5} />
  ),
};

// Category icons mapping
const CATEGORY_ICONS = {
  newsletter: Newspaper,
  econtent: Monitor,
  eventsAttended: Users,
  eventsOrganized: Calendar,
  examiner: ClipboardCheck,
  reviewer: PenTool,
  guestLecture: Mic,
  internationalVisit: Plane,
  awards: Trophy,
  onlineCourse: Video,
  papers: FileText,
  resourcePerson: UserCheck,
};

// Dummy faculty requests data
const dummyFacultyRequests = [
  {
    id: "REQ001",
    facultyId: "FAC001",
    facultyName: "Dr. John Smith",
    department: "CSE",
    category: "newsletter",
    title: "Department Newsletter - Spring 2024",
    submissionDate: "2024-12-15",
    status: "Awaiting",
    details: {
      edition: "Volume 5, Issue 2",
      publishDate: "2024-03-15",
      description:
        "Featured article on AI in Education and department achievements",
      contributionType: "Author",
      pages: "12-15",
    },
    attachment: "newsletter_spring2024.pdf",
  },
  {
    id: "REQ002",
    facultyId: "FAC002",
    facultyName: "Dr. Sarah Johnson",
    department: "CSE",
    category: "econtent",
    title: "Machine Learning Fundamentals Course",
    submissionDate: "2024-12-14",
    status: "Awaiting",
    details: {
      platform: "NPTEL",
      duration: "8 weeks",
      modules: "12",
      description: "Comprehensive course covering ML basics to advanced topics",
      url: "https://nptel.ac.in/courses/ml-fundamentals",
    },
    attachment: "ml_course_certificate.pdf",
  },
  {
    id: "REQ003",
    facultyId: "FAC003",
    facultyName: "Prof. Michael Brown",
    department: "ECE",
    category: "eventsAttended",
    title: "IEEE International Conference on Electronics",
    submissionDate: "2024-12-13",
    status: "Verified",
    details: {
      eventDate: "2024-11-20",
      location: "Singapore",
      organizer: "IEEE",
      participationType: "Paper Presentation",
      description: "Presented paper on IoT security protocols",
    },
    attachment: "conference_certificate.pdf",
  },
  {
    id: "REQ004",
    facultyId: "FAC004",
    facultyName: "Dr. Emily Davis",
    department: "IT",
    category: "eventsOrganized",
    title: "National Level Hackathon 2024",
    submissionDate: "2024-12-12",
    status: "Awaiting",
    details: {
      eventDate: "2024-10-15",
      venue: "BIT Campus",
      participants: "500+",
      role: "Organizing Committee Chair",
      description: "Organized 48-hour hackathon with industry mentors",
    },
    attachment: "hackathon_report.pdf",
  },
  {
    id: "REQ005",
    facultyId: "FAC005",
    facultyName: "Prof. Robert Wilson",
    department: "MECH",
    category: "examiner",
    title: "External Examiner - Anna University",
    submissionDate: "2024-12-11",
    status: "Rejected",
    details: {
      institution: "Anna University",
      examDate: "2024-11-25",
      subject: "Thermodynamics",
      role: "External Examiner",
      description: "Conducted practical examinations for final year students",
    },
    attachment: "examiner_letter.pdf",
  },
  {
    id: "REQ006",
    facultyId: "FAC001",
    facultyName: "Dr. John Smith",
    department: "CSE",
    category: "reviewer",
    title: "Journal of Computer Science - Paper Review",
    submissionDate: "2024-12-10",
    status: "Awaiting",
    details: {
      journal: "Journal of Computer Science",
      publisher: "Springer",
      papersReviewed: "3",
      description: "Reviewed papers on cloud computing and distributed systems",
    },
    attachment: "reviewer_certificate.pdf",
  },
  {
    id: "REQ007",
    facultyId: "FAC006",
    facultyName: "Dr. Jennifer Martinez",
    department: "EEE",
    category: "guestLecture",
    title: "Guest Lecture at IIT Madras",
    submissionDate: "2024-12-09",
    status: "Awaiting",
    details: {
      institution: "IIT Madras",
      lectureDate: "2024-11-18",
      topic: "Power Electronics in EV",
      audience: "PG Students",
      duration: "2 hours",
      description: "Delivered guest lecture on power electronics applications",
    },
    attachment: "guest_lecture_certificate.pdf",
  },
  {
    id: "REQ008",
    facultyId: "FAC007",
    facultyName: "Dr. David Lee",
    department: "CIVIL",
    category: "internationalVisit",
    title: "Research Visit to MIT",
    submissionDate: "2024-12-08",
    status: "Verified",
    details: {
      institution: "Massachusetts Institute of Technology",
      country: "USA",
      visitDate: "2024-09-10",
      duration: "2 weeks",
      purpose: "Research Collaboration",
      description:
        "Collaborative research on sustainable construction materials",
    },
    attachment: "visit_report.pdf",
  },
  {
    id: "REQ009",
    facultyId: "FAC002",
    facultyName: "Dr. Sarah Johnson",
    department: "CSE",
    category: "awards",
    title: "Best Researcher Award 2024",
    submissionDate: "2024-12-07",
    status: "Awaiting",
    details: {
      awardName: "Best Researcher Award",
      awardingBody: "Computer Society of India",
      awardDate: "2024-12-01",
      category: "Research Excellence",
      description: "Recognized for contributions to AI and ML research",
    },
    attachment: "award_certificate.pdf",
  },
  {
    id: "REQ010",
    facultyId: "FAC008",
    facultyName: "Prof. Amanda White",
    department: "AIDS",
    category: "onlineCourse",
    title: "Coursera - Deep Learning Specialization",
    submissionDate: "2024-12-06",
    status: "Awaiting",
    details: {
      platform: "Coursera",
      courseName: "Deep Learning Specialization",
      completionDate: "2024-11-30",
      duration: "5 months",
      grade: "98%",
      description: "Completed all 5 courses in the specialization",
      url: "https://coursera.org/deep-learning",
    },
    attachment: "coursera_certificate.pdf",
  },
  {
    id: "REQ011",
    facultyId: "FAC003",
    facultyName: "Prof. Michael Brown",
    department: "ECE",
    category: "papers",
    title: "IoT Security Framework - IEEE Journal",
    submissionDate: "2024-12-05",
    status: "Awaiting",
    details: {
      journal: "IEEE Transactions on IoT",
      publicationDate: "2024-11-15",
      authors: "Michael Brown, et al.",
      impactFactor: "4.5",
      doi: "10.1109/JIOT.2024.123456",
      description: "Novel security framework for IoT devices",
    },
    attachment: "paper_publication.pdf",
  },
  {
    id: "REQ012",
    facultyId: "FAC004",
    facultyName: "Dr. Emily Davis",
    department: "IT",
    category: "resourcePerson",
    title: "FDP on Web Technologies",
    submissionDate: "2024-12-04",
    status: "Verified",
    details: {
      eventName: "Faculty Development Program",
      institution: "VIT Chennai",
      eventDate: "2024-10-20",
      topic: "Modern Web Development",
      duration: "5 days",
      description: "Conducted sessions on React, Node.js, and cloud deployment",
    },
    attachment: "resource_person_certificate.pdf",
  },
];

// Helper functions
const getStatusClasses = (status) => {
  switch (status?.toLowerCase()) {
    case "awaiting":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "verified":
      return "bg-green-100 text-green-800 border-green-300";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString() : "N/A";

const getCategoryLabel = (category) => {
  const labels = {
    newsletter: "Newsletter",
    econtent: "E-Content",
    eventsAttended: "Events Attended",
    eventsOrganized: "Events Organized",
    examiner: "External Examiner",
    reviewer: "Journal Reviewer",
    guestLecture: "Guest Lecture",
    internationalVisit: "International Visit",
    awards: "Awards",
    onlineCourse: "Online Course",
    papers: "Papers",
    resourcePerson: "Resource Person",
  };
  return labels[category] || category;
};

// Components
const DetailItem = ({icon, label, value, isLink, isTag}) => {
  if (!value && value !== 0) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
        {icon} {label}
      </h4>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 hover:underline break-all flex items-center gap-1"
        >
          <ExternalLink size={12} /> {value}
        </a>
      ) : isTag ? (
        <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-md whitespace-pre-wrap">
          {value}
        </p>
      ) : (
        <p className="text-sm text-gray-600">{value}</p>
      )}
    </div>
  );
};

const SearchBarAndSort = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
    <div className="relative w-full sm:flex-grow">
      <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
        <ICONS.Search />
      </span>
      <input
        type="text"
        placeholder="Search by faculty name, title, or department..."
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
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
        <option value="Date">Date</option>
        <option value="Name">Name</option>
        <option value="Status">Status</option>
        <option value="Category">Category</option>
      </select>
    </div>
  </div>
);

const FilterTabs = ({activeTab, setActiveTab, tabsConfig}) => (
  <div className="mb-6 border-b border-gray-200">
    <nav className="flex space-x-1 -mb-px overflow-x-auto pb-px">
      {tabsConfig.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`py-3 px-4 sm:px-5 font-medium text-sm rounded-t-md focus:outline-none transition-colors duration-150 whitespace-nowrap ${
            activeTab === tab.name
              ? "border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          {tab.name}
          {tab.count !== null && (
            <span
              className={`ml-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
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

const CategoryTabs = ({activeCategory, setActiveCategory, categories}) => (
  <div className="mb-6">
    <div className="bg-slate-100 p-1.5 rounded-xl shadow-sm">
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-150 ${
            activeCategory === "all"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-gray-600 hover:bg-slate-200"
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat.id];
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-150 ${
                activeCategory === cat.id
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:bg-slate-200"
              }`}
            >
              {IconComponent && <IconComponent size={14} />}
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

const AttachmentPill = ({fileName}) => {
  if (!fileName) return null;
  return (
    <span className="inline-flex items-center bg-gray-100 text-gray-700 text-xs font-medium mr-2 mb-2 px-3 py-1.5 rounded-full">
      <ICONS.Paperclip /> {fileName}
    </span>
  );
};

const ActionButtons = ({request, onAction}) => (
  <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 sm:items-end mt-6">
    <div className="flex-grow">
      <label
        htmlFor={`feedback-${request.id}`}
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        Feedback
      </label>
      <textarea
        id={`feedback-${request.id}`}
        rows="2"
        className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        placeholder="Add optional feedback for the faculty..."
      ></textarea>
    </div>
    <div className="flex items-end space-x-3 mt-3 sm:mt-0">
      <button
        onClick={() => onAction(request.id, "reject")}
        className="px-4 py-2 border border-red-500 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 flex items-center shadow-sm h-fit"
      >
        <ICONS.Reject /> Reject
      </button>
      <button
        onClick={() => onAction(request.id, "verify")}
        className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 flex items-center shadow-sm h-fit"
      >
        <ICONS.Verify /> Verify
      </button>
    </div>
  </div>
);

const RequestCard = ({request, onToggleExpand, onAction}) => {
  const CategoryIcon = CATEGORY_ICONS[request.category];

  return (
    <div className="bg-white shadow-lg rounded-lg mb-5 overflow-hidden border border-gray-200 transition-all duration-300">
      {/* Card Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
        onClick={() => onToggleExpand(request.id)}
      >
        <div className="flex items-center min-w-0">
          <div className="mr-4 flex-shrink-0">
            {CategoryIcon ? (
              <CategoryIcon className="w-6 h-6 text-indigo-500" />
            ) : (
              <ICONS.DocumentGeneric />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-md font-semibold text-gray-800 truncate">
              {request.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-xs text-gray-500">{request.facultyName}</p>
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-300">
                {request.department}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full border border-purple-300">
                {getCategoryLabel(request.category)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 ml-2 flex-shrink-0">
          <p className="text-xs text-gray-500 hidden sm:block">
            {formatDate(request.submissionDate)}
          </p>
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusClasses(
              request.status
            )}`}
          >
            {request.status}
          </span>
          <button
            aria-label={request.isExpanded ? "Collapse" : "Expand"}
            className="text-gray-500 hover:text-gray-700"
          >
            <ICONS.Chevron expanded={request.isExpanded} />
          </button>
        </div>
      </div>

      {/* Card Content */}
      {request.isExpanded && (
        <div className="p-5 bg-gray-50/50">
          <div className="space-y-4">
            {/* Dynamic Details based on category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(request.details).map(([key, value]) => {
                if (key === "description" || key === "url") return null;
                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());
                return (
                  <DetailItem
                    key={key}
                    icon={<ICONS.FileText />}
                    label={label}
                    value={value}
                  />
                );
              })}
            </div>

            {/* URL if exists */}
            {request.details.url && (
              <DetailItem
                icon={<ICONS.Link2 />}
                label="URL"
                value={request.details.url}
                isLink
              />
            )}

            {/* Description */}
            {request.details.description && (
              <DetailItem
                icon={<ICONS.FileText />}
                label="Description"
                value={request.details.description}
                isTag
              />
            )}

            {/* Attachment */}
            {request.attachment && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Attachment
                </h4>
                <AttachmentPill fileName={request.attachment} />
              </div>
            )}

            {/* Action Buttons for Awaiting status */}
            {request.status === "Awaiting" && (
              <ActionButtons request={request} onAction={onAction} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const EmptyState = ({message}) => (
  <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
    <FileText size={48} className="mx-auto text-gray-300 mb-4" />
    <p className="text-gray-500 text-lg">{message}</p>
  </div>
);

// Main Component
export default function FacultyRequests() {
  const [requests, setRequests] = useState(
    dummyFacultyRequests.map((r) => ({...r, isExpanded: false}))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Date");
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategory, setActiveCategory] = useState("all");

  // Categories for filter
  const categories = [
    {id: "newsletter", label: "Newsletter"},
    {id: "econtent", label: "E-Content"},
    {id: "eventsAttended", label: "Events"},
    {id: "eventsOrganized", label: "Organized"},
    {id: "examiner", label: "Examiner"},
    {id: "reviewer", label: "Reviewer"},
    {id: "guestLecture", label: "Guest Lecture"},
    {id: "internationalVisit", label: "Int'l Visit"},
    {id: "awards", label: "Awards"},
    {id: "onlineCourse", label: "Online Course"},
    {id: "papers", label: "Papers"},
    {id: "resourcePerson", label: "Resource Person"},
  ];

  // Counts for tabs
  const counts = useMemo(() => {
    const all = requests.length;
    const awaiting = requests.filter((r) => r.status === "Awaiting").length;
    const verified = requests.filter((r) => r.status === "Verified").length;
    const rejected = requests.filter((r) => r.status === "Rejected").length;
    return {all, awaiting, verified, rejected};
  }, [requests]);

  const tabsConfig = [
    {name: "All", count: counts.all},
    {name: "Awaiting", count: counts.awaiting},
    {name: "Verified", count: counts.verified},
    {name: "Rejected", count: counts.rejected},
  ];

  // Filter and sort logic
  const filteredAndSortedRequests = useMemo(() => {
    let filtered = requests;

    // Filter by status tab
    if (activeTab !== "All") {
      filtered = filtered.filter((r) => r.status === activeTab);
    }

    // Filter by category
    if (activeCategory !== "all") {
      if (activeCategory === "eventsAttended") {
        filtered = filtered.filter(
          (r) =>
            r.category === "eventsAttended" || r.category === "eventsOrganized"
        );
      } else {
        filtered = filtered.filter((r) => r.category === activeCategory);
      }
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.facultyName.toLowerCase().includes(term) ||
          r.title.toLowerCase().includes(term) ||
          r.department.toLowerCase().includes(term) ||
          r.facultyId.toLowerCase().includes(term)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "Date":
          return new Date(b.submissionDate) - new Date(a.submissionDate);
        case "Name":
          return a.facultyName.localeCompare(b.facultyName);
        case "Status":
          return a.status.localeCompare(b.status);
        case "Category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return sorted;
  }, [requests, activeTab, activeCategory, searchTerm, sortBy]);

  // Handlers
  const handleToggleExpand = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? {...r, isExpanded: !r.isExpanded} : r))
    );
  };

  const handleAction = (id, action) => {
    const newStatus = action === "verify" ? "Verified" : "Rejected";
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? {...r, status: newStatus, isExpanded: false} : r
      )
    );
    // In real implementation, call API here
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Faculty Requests
          </h1>
          <p className="text-gray-600 mt-1">
            Review and manage faculty achievement submissions
          </p>
        </div>

        {/* Search and Sort */}
        <SearchBarAndSort
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          sortBy={sortBy}
          onSortChange={(e) => setSortBy(e.target.value)}
        />

        {/* Status Tabs */}
        <FilterTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabsConfig={tabsConfig}
        />

        {/* Category Filter */}
        <CategoryTabs
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categories}
        />

        {/* Request Cards */}
        {filteredAndSortedRequests.length > 0 ? (
          filteredAndSortedRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onToggleExpand={handleToggleExpand}
              onAction={handleAction}
            />
          ))
        ) : (
          <EmptyState message="No faculty requests found" />
        )}
      </div>
    </div>
  );
}
