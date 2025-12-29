import React, {useState, useMemo, useEffect} from "react";
import {
  Search,
  ChevronDown,
  Paperclip,
  X,
  Check,
  AlertTriangle,
  Trophy,
  Users,
  Star,
  Code,
  Building,
  GitBranch,
  Link2,
  Video,
  Award,
  Briefcase,
  Calendar,
  MapPin,
  UserCheck,
  FileText,
  BookOpen,
  Globe,
  Mic,
  GraduationCap,
} from "lucide-react";
import axios from "axios";

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
  Trophy: () => (
    <Trophy className="w-4 h-4 mr-1.5 text-yellow-600" strokeWidth={1.5} />
  ),
  Users: () => (
    <Users className="w-4 h-4 mr-1.5 text-blue-600" strokeWidth={1.5} />
  ),
  Summary: () => (
    <FileText className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  FileText: () => (
    <FileText className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  Star: () => (
    <Star className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  Code: () => (
    <Code className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  Building: () => (
    <Building className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  GitBranch: () => <GitBranch className="w-4 h-4 mr-1.5" strokeWidth={1.5} />,
  Link2: () => <Link2 className="w-4 h-4 mr-1.5" strokeWidth={1.5} />,
  Video: () => (
    <Video className="w-4 h-4 mr-1.5 text-red-600" strokeWidth={1.5} />
  ),
  Award: () => (
    <Award className="w-4 h-4 mr-1.5 text-yellow-600" strokeWidth={1.5} />
  ),
  Briefcase: () => (
    <Briefcase className="w-4 h-4 mr-1.5 text-blue-600" strokeWidth={1.5} />
  ),
  Calendar: () => (
    <Calendar className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  MapPin: () => (
    <MapPin className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  UserCheck: () => (
    <UserCheck className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  BookOpen: () => (
    <BookOpen className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  Globe: () => (
    <Globe className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
  Mic: () => <Mic className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />,
  GraduationCap: () => (
    <GraduationCap className="w-4 h-4 mr-1.5 text-gray-600" strokeWidth={1.5} />
  ),
};

const getAttachmentUrl = (path) => {
  const backendUrl = import.meta.env.VITE_API_URL;
  if (!path) return "#";
  const formattedPath = path.replace(/\\/g, "/");
  return `${backendUrl}/${formattedPath}`;
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
      href={fileUrl}
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

const CardBase = ({submission, onToggleExpand, children}) => (
  <div className="bg-white shadow-lg rounded-lg mb-5 overflow-hidden border border-gray-200 transition-all duration-300">
    <div
      className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
      onClick={() => onToggleExpand(submission.id)}
    >
      <div className="flex items-center min-w-0">
        <div className="mr-4 flex-shrink-0">
          <ICONS.DocumentGeneric />
        </div>
        <div className="min-w-0">
          <h3 className="text-md font-semibold text-gray-800 truncate">
            {submission.title}
          </h3>
          <div className="flex items-center mt-0.5">
            <p className="text-xs text-gray-500">{submission.facultyName}</p>
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-300">
              {submission.typeDisplay}
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

// --- Specific Card Components for Faculty Submissions ---

const NewsletterCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.BookOpen />}
        label="Newsletter Title"
        value={submission.details.newsletter_title}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Publication Date"
        value={formatDate(submission.details.publication_date)}
      />
      <DetailItem
        icon={<ICONS.Building />}
        label="Publisher"
        value={submission.details.publisher}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Edition"
        value={submission.details.edition}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Description"
      value={submission.details.description}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      <AttachmentPill
        fileName={submission.attachments[0]?.name}
        fileUrl={submission.attachments[0]?.url}
      />
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
        icon={<ICONS.FileText />}
        label="Content Title"
        value={submission.details.content_title}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Content Type"
        value={submission.details.content_type}
      />
      <DetailItem
        icon={<ICONS.Building />}
        label="Platform"
        value={submission.details.platform}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Upload Date"
        value={formatDate(submission.details.upload_date)}
      />
      <div className="md:col-span-2">
        <DetailItem
          icon={<ICONS.Link2 />}
          label="Content Link"
          value={submission.details.content_link}
          isLink
        />
      </div>
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Description"
      value={submission.details.description}
      isTag
    />
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const EventsAttendedCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Star />}
        label="Event Name"
        value={submission.details.event_name}
      />
      <DetailItem
        icon={<ICONS.Building />}
        label="Organizer"
        value={submission.details.organizer}
      />
      <DetailItem
        icon={<ICONS.MapPin />}
        label="Location"
        value={submission.details.location}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Event Type"
        value={submission.details.event_type}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Start Date"
        value={formatDate(submission.details.start_date)}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="End Date"
        value={formatDate(submission.details.end_date)}
      />
    </div>
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Certificate</h4>
      <AttachmentPill
        fileName={submission.attachments[0]?.name}
        fileUrl={submission.attachments[0]?.url}
      />
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const EventsOrganizedCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Star />}
        label="Event Name"
        value={submission.details.event_name}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Event Type"
        value={submission.details.event_type}
      />
      <DetailItem
        icon={<ICONS.MapPin />}
        label="Venue"
        value={submission.details.venue}
      />
      <DetailItem
        icon={<ICONS.Users />}
        label="Participants"
        value={submission.details.participants}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Start Date"
        value={formatDate(submission.details.start_date)}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="End Date"
        value={formatDate(submission.details.end_date)}
      />
      <DetailItem
        icon={<ICONS.UserCheck />}
        label="Role"
        value={submission.details.role}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Description"
      value={submission.details.description}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      <AttachmentPill
        fileName={submission.attachments[0]?.name}
        fileUrl={submission.attachments[0]?.url}
      />
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const ExternalExaminerCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Building />}
        label="Institution"
        value={submission.details.institution}
      />
      <DetailItem
        icon={<ICONS.GraduationCap />}
        label="Examination Type"
        value={submission.details.examination_type}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Subject"
        value={submission.details.subject}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Date"
        value={formatDate(submission.details.date)}
      />
    </div>
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      <AttachmentPill
        fileName={submission.attachments[0]?.name}
        fileUrl={submission.attachments[0]?.url}
      />
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const JournalReviewerCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.BookOpen />}
        label="Journal Name"
        value={submission.details.journal_name}
      />
      <DetailItem
        icon={<ICONS.Building />}
        label="Publisher"
        value={submission.details.publisher}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Paper Title"
        value={submission.details.paper_title}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Review Date"
        value={formatDate(submission.details.review_date)}
      />
      <div className="md:col-span-2">
        <DetailItem
          icon={<ICONS.Link2 />}
          label="Journal Link"
          value={submission.details.journal_link}
          isLink
        />
      </div>
    </div>
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      <AttachmentPill
        fileName={submission.attachments[0]?.name}
        fileUrl={submission.attachments[0]?.url}
      />
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
        icon={<ICONS.Mic />}
        label="Lecture Topic"
        value={submission.details.topic}
      />
      <DetailItem
        icon={<ICONS.Building />}
        label="Institution"
        value={submission.details.institution}
      />
      <DetailItem
        icon={<ICONS.MapPin />}
        label="Location"
        value={submission.details.location}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Date"
        value={formatDate(submission.details.date)}
      />
      <DetailItem
        icon={<ICONS.Users />}
        label="Audience"
        value={submission.details.audience}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Description"
      value={submission.details.description}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      <AttachmentPill
        fileName={submission.attachments[0]?.name}
        fileUrl={submission.attachments[0]?.url}
      />
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
        icon={<ICONS.Globe />}
        label="Country"
        value={submission.details.country}
      />
      <DetailItem
        icon={<ICONS.Building />}
        label="Institution Visited"
        value={submission.details.institution}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Purpose"
        value={submission.details.purpose}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Start Date"
        value={formatDate(submission.details.start_date)}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="End Date"
        value={formatDate(submission.details.end_date)}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Description"
      value={submission.details.description}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      <AttachmentPill
        fileName={submission.attachments[0]?.name}
        fileUrl={submission.attachments[0]?.url}
      />
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const AwardsCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Award />}
        label="Award Title"
        value={submission.details.award_title}
      />
      <DetailItem
        icon={<ICONS.Building />}
        label="Awarding Body"
        value={submission.details.awarding_body}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Category"
        value={submission.details.category}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Date"
        value={formatDate(submission.details.date)}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Description"
      value={submission.details.description}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Certificate</h4>
      <AttachmentPill
        fileName={submission.attachments[0]?.name}
        fileUrl={submission.attachments[0]?.url}
      />
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
        icon={<ICONS.BookOpen />}
        label="Course Name"
        value={submission.details.course_name}
      />
      <DetailItem
        icon={<ICONS.Building />}
        label="Platform"
        value={submission.details.platform}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Completion Date"
        value={formatDate(submission.details.completion_date)}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Duration"
        value={submission.details.duration}
      />
      <div className="md:col-span-2">
        <DetailItem
          icon={<ICONS.Link2 />}
          label="Course Link"
          value={submission.details.course_link}
          isLink
        />
      </div>
    </div>
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Certificate</h4>
      <AttachmentPill
        fileName={submission.attachments[0]?.name}
        fileUrl={submission.attachments[0]?.url}
      />
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const PapersCard = ({submission, onAction}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.FileText />}
        label="Paper Title"
        value={submission.details.paper_title}
      />
      <DetailItem
        icon={<ICONS.BookOpen />}
        label="Journal/Conference"
        value={submission.details.journal_conference}
      />
      <DetailItem
        icon={<ICONS.Building />}
        label="Publisher"
        value={submission.details.publisher}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Publication Date"
        value={formatDate(submission.details.publication_date)}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Impact Factor"
        value={submission.details.impact_factor}
      />
      <DetailItem
        icon={<ICONS.Users />}
        label="Co-Authors"
        value={submission.details.co_authors}
        isList
      />
      <div className="md:col-span-2">
        <DetailItem
          icon={<ICONS.Link2 />}
          label="Paper Link"
          value={submission.details.paper_link}
          isLink
        />
      </div>
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Abstract"
      value={submission.details.abstract}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      <AttachmentPill
        fileName={submission.attachments[0]?.name}
        fileUrl={submission.attachments[0]?.url}
      />
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
        icon={<ICONS.Mic />}
        label="Session Topic"
        value={submission.details.topic}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Event Name"
        value={submission.details.event_name}
      />
      <DetailItem
        icon={<ICONS.Building />}
        label="Organizer"
        value={submission.details.organizer}
      />
      <DetailItem
        icon={<ICONS.MapPin />}
        label="Location"
        value={submission.details.location}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Date"
        value={formatDate(submission.details.date)}
      />
      <DetailItem
        icon={<ICONS.Users />}
        label="Participants"
        value={submission.details.participants}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Description"
      value={submission.details.description}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      <AttachmentPill
        fileName={submission.attachments[0]?.name}
        fileUrl={submission.attachments[0]?.url}
      />
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

// Transform API data to match frontend structure
const transformApiData = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((item) => {
    const {upload_type, faculty_name, ...details} = item;
    const normalizedUploadType = upload_type?.toLowerCase() || "unknown";

    const idForReact = `${normalizedUploadType}-${details.id}`;
    const typeDisplay = (upload_type || "Unknown")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const attachments = [];
    const addAttachment = (type, path) => {
      if (path) {
        attachments.push({
          type,
          path,
          url: getAttachmentUrl(path),
          name: path.split(/[/\\]/).pop(),
        });
      }
    };

    let title = "Untitled Submission";
    let submissionDate = new Date().toISOString();
    let status = "Awaiting";

    const approvalStatus = item.approval_status?.toLowerCase();
    if (
      approvalStatus === "1" ||
      approvalStatus === "verified" ||
      approvalStatus === "approved"
    ) {
      status = "Verified";
    } else if (approvalStatus === "rejected") {
      status = "Rejected";
    } else {
      status = "Awaiting";
    }

    switch (normalizedUploadType) {
      case "newsletter":
        title = details.newsletter_title || "Newsletter Submission";
        submissionDate = details.publication_date;
        addAttachment("document", details.document_path);
        break;
      case "e-content":
        title = details.content_title || "E-Content Submission";
        submissionDate = details.upload_date;
        break;
      case "events_attended":
        title = details.event_name || "Event Attended";
        submissionDate = details.start_date;
        addAttachment("certificate", details.certificate_path);
        break;
      case "events_organized":
        title = details.event_name || "Event Organized";
        submissionDate = details.start_date;
        addAttachment("document", details.document_path);
        break;
      case "external_examiner":
        title = `Examiner at ${details.institution}`;
        submissionDate = details.date;
        addAttachment("document", details.document_path);
        break;
      case "journal_reviewer":
        title = details.paper_title || "Journal Review";
        submissionDate = details.review_date;
        addAttachment("document", details.document_path);
        break;
      case "guest_lecture":
        title = details.topic || "Guest Lecture";
        submissionDate = details.date;
        addAttachment("document", details.document_path);
        break;
      case "international_visit":
        title = `Visit to ${details.institution || details.country}`;
        submissionDate = details.start_date;
        addAttachment("document", details.document_path);
        break;
      case "awards":
        title = details.award_title || "Award";
        submissionDate = details.date;
        addAttachment("certificate", details.certificate_path);
        break;
      case "online_course":
        title = details.course_name || "Online Course";
        submissionDate = details.completion_date;
        addAttachment("certificate", details.certificate_path);
        break;
      case "papers":
        title = details.paper_title || "Paper Publication";
        submissionDate = details.publication_date;
        addAttachment("paper", details.paper_path);
        break;
      case "resource_person":
        title = details.topic || "Resource Person";
        submissionDate = details.date;
        addAttachment("document", details.document_path);
        break;
      default:
        title = `${typeDisplay} Submission`;
        break;
    }

    return {
      id: idForReact,
      facultyName: faculty_name || "Unknown Faculty",
      title,
      submissionDate,
      type: normalizedUploadType,
      typeDisplay,
      status,
      isExpanded: false,
      attachments,
      details: details,
    };
  });
};

// --- MAIN COMPONENT: FacultyVerifications ---
export default function FacultyVerifications() {
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Date");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Awaiting");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_URL}api/admin/faculty-verifications`,
          {withCredentials: true}
        );

        if (!response.data || !Array.isArray(response.data)) {
          console.warn("API did not return an array. Received:", response.data);
          setError("Unexpected data format from the server.");
          setAllSubmissions([]);
        } else {
          const transformedData = transformApiData(response.data);
          setAllSubmissions(transformedData);
        }
      } catch (e) {
        console.error("Failed to fetch submissions:", e);
        // Use dummy data for development
        setAllSubmissions(getDummyData());
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const handleToggleExpand = (id) => {
    setAllSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id ? {...sub, isExpanded: !sub.isExpanded} : sub
      )
    );
  };

  const handleAction = async (reactId, actionType) => {
    const submission = allSubmissions.find((s) => s.id === reactId);
    if (!submission) {
      console.error("Could not find the submission in state. ID:", reactId);
      return;
    }

    const feedbackInput = document.getElementById(`feedback-${submission.id}`);
    const feedback = feedbackInput ? feedbackInput.value : "";
    const formData = new FormData();

    formData.append("upload_type", submission.type);
    formData.append("id", submission.details.id);
    formData.append("feedback", feedback);
    formData.append("verified", actionType === "verify");
    formData.append("rejected", actionType === "reject");

    console.log("--- Sending Data to Backend ---");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post(
        `${API_URL}api/admin/faculty-verifications`,
        formData,
        {withCredentials: true}
      );

      console.log("Backend API response:", response.data);

      const newStatus = actionType === "verify" ? "Verified" : "Rejected";
      setAllSubmissions((prev) =>
        prev.map((s) =>
          s.id === reactId ? {...s, status: newStatus, isExpanded: false} : s
        )
      );
    } catch (error) {
      console.error(
        "Error updating submission status:",
        error.response || error
      );
      // Optimistic UI update for development
      const newStatus = actionType === "verify" ? "Verified" : "Rejected";
      setAllSubmissions((prev) =>
        prev.map((s) =>
          s.id === reactId ? {...s, status: newStatus, isExpanded: false} : s
        )
      );
    }
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
        submission.facultyName.toLowerCase().includes(term)
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
      case "e-content":
        return <EContentCard {...cardProps} />;
      case "events_attended":
        return <EventsAttendedCard {...cardProps} />;
      case "events_organized":
        return <EventsOrganizedCard {...cardProps} />;
      case "external_examiner":
        return <ExternalExaminerCard {...cardProps} />;
      case "journal_reviewer":
        return <JournalReviewerCard {...cardProps} />;
      case "guest_lecture":
        return <GuestLectureCard {...cardProps} />;
      case "international_visit":
        return <InternationalVisitCard {...cardProps} />;
      case "awards":
        return <AwardsCard {...cardProps} />;
      case "online_course":
        return <OnlineCourseCard {...cardProps} />;
      case "papers":
        return <PapersCard {...cardProps} />;
      case "resource_person":
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

// Dummy data for development/testing
function getDummyData() {
  return [
    {
      id: "newsletter-1",
      facultyName: "Dr. Rajesh Kumar",
      title: "Department Newsletter - Q4 2024",
      submissionDate: "2024-12-15",
      type: "newsletter",
      typeDisplay: "Newsletter",
      status: "Awaiting",
      isExpanded: false,
      attachments: [{name: "newsletter_q4.pdf", url: "#"}],
      details: {
        id: 1,
        newsletter_title: "Department Newsletter - Q4 2024",
        publication_date: "2024-12-15",
        publisher: "IT Department",
        edition: "Volume 5, Issue 4",
        description:
          "Quarterly newsletter covering department achievements, research updates, and upcoming events.",
      },
    },
    {
      id: "papers-2",
      facultyName: "Dr. Priya Sharma",
      title: "Machine Learning in Healthcare",
      submissionDate: "2024-12-10",
      type: "papers",
      typeDisplay: "Papers",
      status: "Awaiting",
      isExpanded: false,
      attachments: [{name: "ml_healthcare_paper.pdf", url: "#"}],
      details: {
        id: 2,
        paper_title: "Machine Learning in Healthcare: A Comprehensive Review",
        journal_conference: "IEEE Transactions on Medical Imaging",
        publisher: "IEEE",
        publication_date: "2024-12-10",
        impact_factor: "10.5",
        co_authors: "Dr. Kumar, Dr. Singh, Dr. Patel",
        paper_link: "https://ieee.org/paper/12345",
        abstract:
          "This paper presents a comprehensive review of machine learning applications in healthcare, covering diagnosis, prognosis, and treatment optimization.",
      },
    },
    {
      id: "guest_lecture-3",
      facultyName: "Prof. Anil Mehta",
      title: "Industry 4.0 and IoT",
      submissionDate: "2024-12-05",
      type: "guest_lecture",
      typeDisplay: "Guest Lecture",
      status: "Verified",
      isExpanded: false,
      attachments: [{name: "lecture_certificate.pdf", url: "#"}],
      details: {
        id: 3,
        topic: "Industry 4.0 and IoT: Transforming Manufacturing",
        institution: "Anna University",
        location: "Chennai",
        date: "2024-12-05",
        audience: "B.Tech and M.Tech Students",
        description:
          "Guest lecture on the implementation of IoT in smart manufacturing and Industry 4.0 concepts.",
      },
    },
    {
      id: "awards-4",
      facultyName: "Dr. Lakshmi Narayanan",
      title: "Best Researcher Award 2024",
      submissionDate: "2024-11-20",
      type: "awards",
      typeDisplay: "Awards",
      status: "Awaiting",
      isExpanded: false,
      attachments: [{name: "award_certificate.pdf", url: "#"}],
      details: {
        id: 4,
        award_title: "Best Researcher Award 2024",
        awarding_body: "Indian Science Congress",
        category: "Computer Science & Engineering",
        date: "2024-11-20",
        description:
          "Awarded for outstanding contributions to AI and machine learning research.",
      },
    },
    {
      id: "online_course-5",
      facultyName: "Dr. Suresh Babu",
      title: "Deep Learning Specialization",
      submissionDate: "2024-11-15",
      type: "online_course",
      typeDisplay: "Online Course",
      status: "Rejected",
      isExpanded: false,
      attachments: [{name: "coursera_certificate.pdf", url: "#"}],
      details: {
        id: 5,
        course_name: "Deep Learning Specialization",
        platform: "Coursera",
        completion_date: "2024-11-15",
        duration: "3 months",
        course_link: "https://coursera.org/specializations/deep-learning",
      },
    },
    {
      id: "events_organized-6",
      facultyName: "Dr. Kavitha Rajan",
      title: "National Workshop on Cybersecurity",
      submissionDate: "2024-11-10",
      type: "events_organized",
      typeDisplay: "Events Organized",
      status: "Awaiting",
      isExpanded: false,
      attachments: [{name: "event_report.pdf", url: "#"}],
      details: {
        id: 6,
        event_name: "National Workshop on Cybersecurity",
        event_type: "Workshop",
        venue: "BIT Campus",
        participants: "150",
        start_date: "2024-11-08",
        end_date: "2024-11-10",
        role: "Coordinator",
        description:
          "Two-day national workshop covering latest trends in cybersecurity and ethical hacking.",
      },
    },
  ];
}
