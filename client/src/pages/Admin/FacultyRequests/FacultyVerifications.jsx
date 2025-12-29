import React, {useState, useMemo, useEffect} from "react";
import {
  Search,
  ChevronDown,
  Paperclip,
  X,
  Check,
  AlertTriangle,
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
  ExternalLink,
  Link2,
  Star,
  Briefcase,
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
  Star: () => (
    <Star className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  Briefcase: () => (
    <Briefcase className="w-4 h-4 mr-1.5 text-blue-600" strokeWidth={1.5} />
  ),
  Summary: () => (
    <FileText className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
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

// Dummy faculty verification data
const dummyFacultyVerifications = [
  {
    id: "VER001",
    facultyId: "FAC001",
    facultyName: "Dr. John Smith",
    department: "CSE",
    type: "newsletter",
    typeDisplay: "Newsletter",
    title: "Department Newsletter - Spring 2024",
    submissionDate: "2024-12-15",
    status: "Awaiting",
    details: {
      edition: "Volume 5, Issue 2",
      publish_date: "2024-03-15",
      contribution_type: "Author",
      pages: "12-15",
    },
    summary:
      "Featured article on AI in Education and department achievements covering recent faculty publications and student accomplishments.",
    attachments: [{name: "newsletter_spring2024.pdf", url: "#", type: "pdf"}],
  },
  {
    id: "VER002",
    facultyId: "FAC002",
    facultyName: "Dr. Sarah Johnson",
    department: "CSE",
    type: "econtent",
    typeDisplay: "E-Content",
    title: "Machine Learning Fundamentals Course",
    submissionDate: "2024-12-14",
    status: "Awaiting",
    details: {
      platform: "NPTEL",
      duration: "8 weeks",
      modules: "12",
      course_link: "https://nptel.ac.in/courses/ml-fundamentals",
    },
    summary:
      "Comprehensive course covering ML basics to advanced topics including supervised learning, unsupervised learning, and neural networks.",
    attachments: [
      {name: "course_completion.pdf", url: "#", type: "certificate"},
    ],
  },
  {
    id: "VER003",
    facultyId: "FAC003",
    facultyName: "Prof. Michael Brown",
    department: "ECE",
    type: "eventsAttended",
    typeDisplay: "Event Attended",
    title: "IEEE International Conference on Electronics",
    submissionDate: "2024-12-13",
    status: "Verified",
    details: {
      organised_by: "IEEE",
      location: "Singapore",
      start_date: "2024-11-18",
      end_date: "2024-11-20",
      event_type: "International Conference",
      participation_type: "Paper Presentation",
    },
    summary:
      "Presented paper on IoT security protocols and attended workshops on emerging technologies.",
    attachments: [
      {name: "conference_certificate.pdf", url: "#", type: "certificate"},
    ],
  },
  {
    id: "VER004",
    facultyId: "FAC004",
    facultyName: "Dr. Emily Davis",
    department: "IT",
    type: "eventsOrganized",
    typeDisplay: "Event Organized",
    title: "National Level Hackathon 2024",
    submissionDate: "2024-12-12",
    status: "Awaiting",
    details: {
      event_date: "2024-10-15",
      venue: "BIT Campus",
      participants: "500+",
      role: "Organizing Committee Chair",
      sponsors: "Google, Microsoft, Amazon",
    },
    summary:
      "Organized 48-hour hackathon with industry mentors, featuring 50+ teams and prize pool of Rs. 2 Lakhs.",
    attachments: [{name: "hackathon_report.pdf", url: "#", type: "report"}],
  },
  {
    id: "VER005",
    facultyId: "FAC005",
    facultyName: "Prof. Robert Wilson",
    department: "MECH",
    type: "examiner",
    typeDisplay: "External Examiner",
    title: "External Examiner - Anna University",
    submissionDate: "2024-12-11",
    status: "Rejected",
    details: {
      institution: "Anna University",
      exam_date: "2024-11-25",
      subject: "Thermodynamics",
      exam_type: "Practical Examination",
      students_evaluated: "45",
    },
    summary:
      "Conducted practical examinations for final year students in the Department of Mechanical Engineering.",
    attachments: [{name: "examiner_letter.pdf", url: "#", type: "letter"}],
  },
  {
    id: "VER006",
    facultyId: "FAC001",
    facultyName: "Dr. John Smith",
    department: "CSE",
    type: "reviewer",
    typeDisplay: "Journal Reviewer",
    title: "Journal of Computer Science - Paper Review",
    submissionDate: "2024-12-10",
    status: "Awaiting",
    details: {
      journal: "Journal of Computer Science",
      publisher: "Springer",
      papers_reviewed: "3",
      review_period: "Oct 2024 - Dec 2024",
    },
    summary:
      "Reviewed papers on cloud computing, distributed systems, and edge computing for Q1 journal.",
    attachments: [
      {name: "reviewer_certificate.pdf", url: "#", type: "certificate"},
    ],
  },
  {
    id: "VER007",
    facultyId: "FAC006",
    facultyName: "Dr. Jennifer Martinez",
    department: "EEE",
    type: "guestLecture",
    typeDisplay: "Guest Lecture",
    title: "Guest Lecture at IIT Madras",
    submissionDate: "2024-12-09",
    status: "Awaiting",
    details: {
      institution: "IIT Madras",
      lecture_date: "2024-11-18",
      topic: "Power Electronics in Electric Vehicles",
      audience: "PG Students",
      duration: "2 hours",
    },
    summary:
      "Delivered comprehensive guest lecture on power electronics applications in modern EVs covering inverters, converters, and battery management systems.",
    attachments: [
      {name: "guest_lecture_certificate.pdf", url: "#", type: "certificate"},
    ],
  },
  {
    id: "VER008",
    facultyId: "FAC007",
    facultyName: "Dr. David Lee",
    department: "CIVIL",
    type: "internationalVisit",
    typeDisplay: "International Visit",
    title: "Research Visit to MIT",
    submissionDate: "2024-12-08",
    status: "Verified",
    details: {
      institution: "Massachusetts Institute of Technology",
      country: "USA",
      visit_start: "2024-09-10",
      visit_end: "2024-09-24",
      purpose: "Research Collaboration",
      funding: "AICTE",
    },
    summary:
      "Collaborative research on sustainable construction materials with focus on carbon-neutral concrete alternatives.",
    attachments: [
      {name: "visit_report.pdf", url: "#", type: "report"},
      {name: "travel_certificate.pdf", url: "#", type: "certificate"},
    ],
  },
  {
    id: "VER009",
    facultyId: "FAC002",
    facultyName: "Dr. Sarah Johnson",
    department: "CSE",
    type: "awards",
    typeDisplay: "Award",
    title: "Best Researcher Award 2024",
    submissionDate: "2024-12-07",
    status: "Awaiting",
    details: {
      award_name: "Best Researcher Award",
      awarding_body: "Computer Society of India",
      award_date: "2024-12-01",
      category: "Research Excellence",
      prize: "Rs. 50,000 + Citation",
    },
    summary:
      "Recognized for outstanding contributions to AI and ML research with 15 publications in top-tier journals.",
    attachments: [
      {name: "award_certificate.pdf", url: "#", type: "certificate"},
    ],
  },
  {
    id: "VER010",
    facultyId: "FAC008",
    facultyName: "Prof. Amanda White",
    department: "AIDS",
    type: "onlineCourse",
    typeDisplay: "Online Course",
    title: "Coursera - Deep Learning Specialization",
    submissionDate: "2024-12-06",
    status: "Awaiting",
    details: {
      platform: "Coursera",
      course_name: "Deep Learning Specialization",
      completion_date: "2024-11-30",
      duration: "5 months",
      grade: "98%",
      course_link: "https://coursera.org/deep-learning",
    },
    summary:
      "Completed all 5 courses in the specialization covering CNNs, RNNs, sequence models, and practical applications.",
    attachments: [
      {name: "coursera_certificate.pdf", url: "#", type: "certificate"},
    ],
  },
  {
    id: "VER011",
    facultyId: "FAC003",
    facultyName: "Prof. Michael Brown",
    department: "ECE",
    type: "papers",
    typeDisplay: "Paper Publication",
    title: "IoT Security Framework - IEEE Journal",
    submissionDate: "2024-12-05",
    status: "Awaiting",
    details: {
      journal: "IEEE Transactions on IoT",
      publication_date: "2024-11-15",
      authors: "Michael Brown, et al.",
      impact_factor: "4.5",
      doi: "10.1109/JIOT.2024.123456",
      indexing: "SCI, Scopus",
    },
    summary:
      "Novel security framework for IoT devices addressing authentication, encryption, and intrusion detection.",
    attachments: [{name: "paper_publication.pdf", url: "#", type: "pdf"}],
  },
  {
    id: "VER012",
    facultyId: "FAC004",
    facultyName: "Dr. Emily Davis",
    department: "IT",
    type: "resourcePerson",
    typeDisplay: "Resource Person",
    title: "FDP on Web Technologies",
    submissionDate: "2024-12-04",
    status: "Verified",
    details: {
      event_name: "Faculty Development Program",
      institution: "VIT Chennai",
      event_date: "2024-10-20",
      topic: "Modern Web Development",
      duration: "5 days",
      participants: "50 faculty members",
    },
    summary:
      "Conducted hands-on sessions on React, Node.js, and cloud deployment covering full-stack development practices.",
    attachments: [
      {name: "resource_person_certificate.pdf", url: "#", type: "certificate"},
    ],
  },
];

// Helper functions
const getAttachmentUrl = (url) => {
  const backendUrl = import.meta.env.VITE_API_URL;
  if (!url || url === "#") return "#";
  return url.startsWith("http")
    ? url
    : `${backendUrl}/${url.replace(/\\/g, "/")}`;
};

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

// Reusable Components
const DetailItem = ({icon, label, value, isLink, isTag, isList}) => {
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
          className="text-sm text-indigo-600 hover:underline break-all"
        >
          {value}
        </a>
      ) : isTag ? (
        <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-md whitespace-pre-wrap">
          {value}
        </p>
      ) : isList ? (
        <div className="flex flex-wrap gap-2">
          {value.split(",").map((item) => (
            <span
              key={item}
              className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full"
            >
              {item.trim()}
            </span>
          ))}
        </div>
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
        placeholder="Search by faculty name or title..."
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
        <option value="Type">Type</option>
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

const AttachmentPill = ({fileUrl, fileName}) => {
  if (!fileUrl || !fileName) return null;
  return (
    <a
      href={getAttachmentUrl(fileUrl)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center bg-gray-100 text-gray-700 text-xs font-medium mr-2 mb-2 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-indigo-400"
    >
      <ICONS.Paperclip /> {fileName}
    </a>
  );
};

const ActionButtons = ({submission, onAction, children}) => (
  <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 sm:items-end mt-6">
    <div className="flex-grow mb-3 sm:mb-0">{children}</div>
    <div className="flex-grow-[2]">
      <label
        htmlFor={`feedback-${submission.id}`}
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        Feedback
      </label>
      <textarea
        id={`feedback-${submission.id}`}
        rows="2"
        className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        placeholder="Add optional feedback for the faculty..."
      ></textarea>
    </div>
    <div className="flex items-end space-x-3 mt-3 sm:mt-0">
      <button
        onClick={() => onAction(submission.id, "reject")}
        className="px-4 py-2 border border-red-500 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 flex items-center shadow-sm h-fit"
      >
        <ICONS.Reject /> Reject
      </button>
      <button
        onClick={() => onAction(submission.id, "verify")}
        className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 flex items-center shadow-sm h-fit"
      >
        <ICONS.Verify /> Verify
      </button>
    </div>
  </div>
);

const CardBase = ({submission, onToggleExpand, children}) => {
  const CategoryIcon = CATEGORY_ICONS[submission.type];

  return (
    <div className="bg-white shadow-lg rounded-lg mb-5 overflow-hidden border border-gray-200 transition-all duration-300">
      <div
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
        onClick={() => onToggleExpand(submission.id)}
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
              {submission.title}
            </h3>
            <div className="flex items-center mt-0.5 flex-wrap gap-1">
              <p className="text-xs text-gray-500">{submission.facultyName}</p>
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-300">
                {submission.typeDisplay}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full border border-purple-300">
                {submission.department}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 ml-2 flex-shrink-0">
          <p className="text-xs text-gray-500 hidden sm:block">
            {formatDate(submission.submissionDate)}
          </p>
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusClasses(
              submission.status
            )}`}
          >
            {submission.status}
          </span>
          <button
            aria-label={submission.isExpanded ? "Collapse" : "Expand"}
            className="text-gray-500 hover:text-gray-700"
          >
            <ICONS.Chevron expanded={submission.isExpanded} />
          </button>
        </div>
      </div>
      {submission.isExpanded && (
        <div className="p-5 bg-gray-50/50">{children}</div>
      )}
    </div>
  );
};

// Category-specific Cards
const NewsletterCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.FileText />}
        label="Edition"
        value={submission.details.edition}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Publish Date"
        value={formatDate(submission.details.publish_date)}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Contribution Type"
        value={submission.details.contribution_type}
      />
      <DetailItem
        icon={<ICONS.FileText />}
        label="Pages"
        value={submission.details.pages}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Summary"
      value={submission.summary}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      {submission.attachments?.map((att, idx) => (
        <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
      ))}
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const EContentCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Building />}
        label="Platform"
        value={submission.details.platform}
      />
      <DetailItem
        icon={<ICONS.Clock />}
        label="Duration"
        value={submission.details.duration}
      />
      <DetailItem
        icon={<ICONS.FileText />}
        label="Modules"
        value={submission.details.modules}
      />
      <DetailItem
        icon={<ICONS.Link2 />}
        label="Course Link"
        value={submission.details.course_link}
        isLink
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Summary"
      value={submission.summary}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      {submission.attachments?.map((att, idx) => (
        <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
      ))}
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const EventCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Building />}
        label="Organized By"
        value={submission.details.organised_by || submission.details.role}
      />
      <DetailItem
        icon={<ICONS.MapPin />}
        label="Location/Venue"
        value={submission.details.location || submission.details.venue}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Start Date"
        value={formatDate(
          submission.details.start_date || submission.details.event_date
        )}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="End Date"
        value={formatDate(submission.details.end_date)}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Event Type"
        value={submission.details.event_type}
      />
      <DetailItem
        icon={<ICONS.Users />}
        label="Participation"
        value={
          submission.details.participation_type ||
          submission.details.participants
        }
      />
      <DetailItem
        icon={<ICONS.Trophy />}
        label="Sponsors"
        value={submission.details.sponsors}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Summary"
      value={submission.summary}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      {submission.attachments?.map((att, idx) => (
        <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
      ))}
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const ExaminerCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Building />}
        label="Institution"
        value={submission.details.institution}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Exam Date"
        value={formatDate(submission.details.exam_date)}
      />
      <DetailItem
        icon={<ICONS.FileText />}
        label="Subject"
        value={submission.details.subject}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Exam Type"
        value={submission.details.exam_type}
      />
      <DetailItem
        icon={<ICONS.Users />}
        label="Students Evaluated"
        value={submission.details.students_evaluated}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Summary"
      value={submission.summary}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      {submission.attachments?.map((att, idx) => (
        <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
      ))}
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const ReviewerCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.FileText />}
        label="Journal"
        value={submission.details.journal}
      />
      <DetailItem
        icon={<ICONS.Building />}
        label="Publisher"
        value={submission.details.publisher}
      />
      <DetailItem
        icon={<ICONS.FileText />}
        label="Papers Reviewed"
        value={submission.details.papers_reviewed}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Review Period"
        value={submission.details.review_period}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Summary"
      value={submission.summary}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      {submission.attachments?.map((att, idx) => (
        <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
      ))}
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const GuestLectureCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Building />}
        label="Institution"
        value={submission.details.institution}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Lecture Date"
        value={formatDate(submission.details.lecture_date)}
      />
      <DetailItem
        icon={<ICONS.FileText />}
        label="Topic"
        value={submission.details.topic}
      />
      <DetailItem
        icon={<ICONS.Users />}
        label="Audience"
        value={submission.details.audience}
      />
      <DetailItem
        icon={<ICONS.Clock />}
        label="Duration"
        value={submission.details.duration}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Summary"
      value={submission.summary}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      {submission.attachments?.map((att, idx) => (
        <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
      ))}
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const InternationalVisitCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Building />}
        label="Institution"
        value={submission.details.institution}
      />
      <DetailItem
        icon={<ICONS.Globe />}
        label="Country"
        value={submission.details.country}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Visit Start"
        value={formatDate(submission.details.visit_start)}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Visit End"
        value={formatDate(submission.details.visit_end)}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Purpose"
        value={submission.details.purpose}
      />
      <DetailItem
        icon={<ICONS.Briefcase />}
        label="Funding"
        value={submission.details.funding}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Summary"
      value={submission.summary}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      {submission.attachments?.map((att, idx) => (
        <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
      ))}
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const AwardCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Trophy />}
        label="Award Name"
        value={submission.details.award_name}
      />
      <DetailItem
        icon={<ICONS.Building />}
        label="Awarding Body"
        value={submission.details.awarding_body}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Award Date"
        value={formatDate(submission.details.award_date)}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Category"
        value={submission.details.category}
      />
      <DetailItem
        icon={<ICONS.Award />}
        label="Prize"
        value={submission.details.prize}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Summary"
      value={submission.summary}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      {submission.attachments?.map((att, idx) => (
        <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
      ))}
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const OnlineCourseCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Building />}
        label="Platform"
        value={submission.details.platform}
      />
      <DetailItem
        icon={<ICONS.FileText />}
        label="Course Name"
        value={submission.details.course_name}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Completion Date"
        value={formatDate(submission.details.completion_date)}
      />
      <DetailItem
        icon={<ICONS.Clock />}
        label="Duration"
        value={submission.details.duration}
      />
      <DetailItem
        icon={<ICONS.Trophy />}
        label="Grade"
        value={submission.details.grade}
      />
      <DetailItem
        icon={<ICONS.Link2 />}
        label="Course Link"
        value={submission.details.course_link}
        isLink
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Summary"
      value={submission.summary}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      {submission.attachments?.map((att, idx) => (
        <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
      ))}
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const PaperCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.FileText />}
        label="Journal"
        value={submission.details.journal}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Publication Date"
        value={formatDate(submission.details.publication_date)}
      />
      <DetailItem
        icon={<ICONS.Users />}
        label="Authors"
        value={submission.details.authors}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Impact Factor"
        value={submission.details.impact_factor}
      />
      <DetailItem
        icon={<ICONS.Link2 />}
        label="DOI"
        value={submission.details.doi}
      />
      <DetailItem
        icon={<ICONS.FileText />}
        label="Indexing"
        value={submission.details.indexing}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Summary"
      value={submission.summary}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      {submission.attachments?.map((att, idx) => (
        <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
      ))}
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const ResourcePersonCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.FileText />}
        label="Event Name"
        value={submission.details.event_name}
      />
      <DetailItem
        icon={<ICONS.Building />}
        label="Institution"
        value={submission.details.institution}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Event Date"
        value={formatDate(submission.details.event_date)}
      />
      <DetailItem
        icon={<ICONS.FileText />}
        label="Topic"
        value={submission.details.topic}
      />
      <DetailItem
        icon={<ICONS.Clock />}
        label="Duration"
        value={submission.details.duration}
      />
      <DetailItem
        icon={<ICONS.Users />}
        label="Participants"
        value={submission.details.participants}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Summary"
      value={submission.summary}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      {submission.attachments?.map((att, idx) => (
        <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
      ))}
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

// Main Component
export default function FacultyVerifications() {
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Date");
  const [activeTab, setActiveTab] = useState("Awaiting");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with dummy data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAllSubmissions(
        dummyFacultyVerifications.map((v) => ({...v, isExpanded: false}))
      );
      setIsLoading(false);
    }, 500);
  }, []);

  const handleToggleExpand = (id) => {
    setAllSubmissions((prev) =>
      prev.map((s) => (s.id === id ? {...s, isExpanded: !s.isExpanded} : s))
    );
  };

  const handleAction = (id, actionType) => {
    const newStatus = actionType === "verify" ? "Verified" : "Rejected";
    setAllSubmissions((prev) =>
      prev.map((s) =>
        s.id === id ? {...s, status: newStatus, isExpanded: false} : s
      )
    );
    // In real implementation, call API here
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleSortChange = (event) => setSortBy(event.target.value);

  const {tabsConfig, processedSubmissions} = useMemo(() => {
    const counts = {All: 0, Awaiting: 0, Verified: 0, Rejected: 0};
    allSubmissions.forEach((sub) => {
      counts.All++;
      if (counts[sub.status] !== undefined) {
        counts[sub.status]++;
      }
    });

    const TABS_CONFIG = [
      {name: "All", count: counts.All},
      {name: "Awaiting", count: counts.Awaiting},
      {name: "Verified", count: counts.Verified},
      {name: "Rejected", count: counts.Rejected},
    ];

    const filtered = allSubmissions.filter((submission) => {
      const tabMatch = activeTab === "All" || submission.status === activeTab;
      if (!tabMatch) return false;
      const term = searchTerm.toLowerCase();
      return (
        !term ||
        submission.title.toLowerCase().includes(term) ||
        submission.facultyName.toLowerCase().includes(term) ||
        submission.department.toLowerCase().includes(term)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "Name":
          return a.facultyName.localeCompare(b.facultyName);
        case "Status":
          return a.status.localeCompare(b.status);
        case "Type":
          return a.type.localeCompare(b.type);
        case "Date":
        default:
          return new Date(b.submissionDate) - new Date(a.submissionDate);
      }
    });

    return {tabsConfig: TABS_CONFIG, processedSubmissions: sorted};
  }, [allSubmissions, activeTab, searchTerm, sortBy]);

  const renderCard = (submission) => {
    const cardProps = {submission, onAction: handleAction};
    switch (submission.type) {
      case "newsletter":
        return <NewsletterCard {...cardProps} />;
      case "econtent":
        return <EContentCard {...cardProps} />;
      case "eventsAttended":
      case "eventsOrganized":
        return <EventCard {...cardProps} />;
      case "examiner":
        return <ExaminerCard {...cardProps} />;
      case "reviewer":
        return <ReviewerCard {...cardProps} />;
      case "guestLecture":
        return <GuestLectureCard {...cardProps} />;
      case "internationalVisit":
        return <InternationalVisitCard {...cardProps} />;
      case "awards":
        return <AwardCard {...cardProps} />;
      case "onlineCourse":
        return <OnlineCourseCard {...cardProps} />;
      case "papers":
        return <PaperCard {...cardProps} />;
      case "resourcePerson":
        return <ResourcePersonCard {...cardProps} />;
      default:
        return (
          <div className="p-4 text-center">
            Unsupported submission type: {submission.type}
          </div>
        );
    }
  };

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="text-center py-12 text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          Loading submissions...
        </div>
      );
    if (error)
      return (
        <div className="text-center py-12 text-red-600 bg-red-50 p-6 rounded-lg">
          <AlertTriangle className="w-12 h-12 mb-4 mx-auto" />
          <h3 className="text-lg font-medium">An Error Occurred</h3>
          <p>{error}</p>
        </div>
      );
    if (processedSubmissions.length > 0) {
      return processedSubmissions.map((submission) => (
        <CardBase
          key={submission.id}
          submission={submission}
          onToggleExpand={handleToggleExpand}
        >
          {renderCard(submission)}
        </CardBase>
      ));
    }
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
        <FileText className="w-12 h-12 mb-4 mx-auto text-gray-300" />
        <h3 className="text-lg font-medium">No Submissions Found</h3>
        <p className="text-sm mt-1">
          {searchTerm
            ? `No submissions match "${searchTerm}" in the "${activeTab}" filter.`
            : `There are no submissions in the "${activeTab}" category.`}
        </p>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Faculty Verifications
          </h1>
          <p className="text-gray-600 mt-1">
            Review and verify faculty achievement submissions
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
          tabsConfig={tabsConfig}
        />
        <div>{renderContent()}</div>
      </div>
    </div>
  );
}
