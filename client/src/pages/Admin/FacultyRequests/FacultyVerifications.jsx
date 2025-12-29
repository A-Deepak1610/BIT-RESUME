import React, { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
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

const API_URL = import.meta.env.VITE_API_URL;

// Icons object
const ICONS = {
  Search: () => <Search className="w-5 h-5" strokeWidth={1.5} />,
  DocumentGeneric: () => (
    <FileText className="w-6 h-6 text-indigo-500" strokeWidth={1.5} />
  ),
  Chevron: ({ expanded }) => (
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

// Helper functions
const getAttachmentUrl = (url) => {
  if (!url || url === "#" || url === "") return null;
  return url.startsWith("http") ? url : `${API_URL}${url.replace(/\\/g, "/")}`;
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
const DetailItem = ({ icon, label, value, isLink, isTag, isList }) => {
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

const FilterTabs = ({ activeTab, setActiveTab, tabsConfig }) => (
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

const AttachmentPill = ({ fileUrl, fileName }) => {
  const url = getAttachmentUrl(fileUrl);
  if (!url || !fileName) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center bg-gray-100 text-gray-700 text-xs font-medium mr-2 mb-2 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-indigo-400"
    >
      <ICONS.Paperclip /> {fileName}
    </a>
  );
};

const ActionButtons = ({ submission, onAction, feedbackRef }) => (
  <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 sm:items-end mt-6">
    <div className="flex-grow-[2]">
      <label
        htmlFor={`feedback-${submission.id}`}
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        Feedback/Remarks
      </label>
      <textarea
        id={`feedback-${submission.id}`}
        ref={feedbackRef}
        rows="2"
        className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        placeholder="Add optional feedback for the faculty..."
        defaultValue={submission.remarks || ""}
      ></textarea>
    </div>
    <div className="flex items-end space-x-3 mt-3 sm:mt-0">
      <button
        onClick={() =>
          onAction(submission.id, submission.type, "rejected", feedbackRef)
        }
        className="px-4 py-2 border border-red-500 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 flex items-center shadow-sm h-fit"
      >
        <ICONS.Reject /> Reject
      </button>
      <button
        onClick={() =>
          onAction(submission.id, submission.type, "verified", feedbackRef)
        }
        className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 flex items-center shadow-sm h-fit"
      >
        <ICONS.Verify /> Verify
      </button>
    </div>
  </div>
);

const CardBase = ({ submission, onToggleExpand, children }) => {
  const CategoryIcon = CATEGORY_ICONS[submission.type];

  return (
    <div className="bg-white shadow-lg rounded-lg mb-5 overflow-hidden border border-gray-200 transition-all duration-300">
      <div
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
        onClick={() => onToggleExpand(submission.id, submission.type)}
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
              {submission.department && (
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full border border-purple-300">
                  {submission.department}
                </span>
              )}
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
const NewsletterCard = ({ submission, onAction }) => {
  const feedbackRef = useRef(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <DetailItem
          icon={<ICONS.FileText />}
          label="Newsletter Category"
          value={submission.details?.newsletter_category}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="Date of Publication"
          value={formatDate(submission.details?.date_of_publication)}
        />
        <DetailItem
          icon={<ICONS.FileText />}
          label="Volume Number"
          value={submission.details?.volume_number}
        />
        <DetailItem
          icon={<ICONS.FileText />}
          label="Issue Number"
          value={submission.details?.issue_number}
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="Issue Month"
          value={submission.details?.issue_month}
        />
        <DetailItem
          icon={<ICONS.Users />}
          label="Faculty Editors"
          value={submission.details?.faculty_editor_count}
        />
        <DetailItem
          icon={<ICONS.Users />}
          label="Student Editors"
          value={submission.details?.student_editor_count}
        />
        <DetailItem
          icon={<ICONS.Building />}
          label="Academic Year"
          value={submission.details?.academic_year}
        />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Attachments
        </h4>
        {submission.attachments?.map((att, idx) => (
          <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
        ))}
      </div>
      {submission.status === "Awaiting" && (
        <ActionButtons
          submission={submission}
          onAction={onAction}
          feedbackRef={feedbackRef}
        />
      )}
    </div>
  );
};

const EContentCard = ({ submission, onAction }) => {
  const feedbackRef = useRef(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <DetailItem
          icon={<ICONS.FileText />}
          label="Task ID"
          value={submission.details?.task_id}
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="E-Content Type"
          value={submission.details?.e_content_type}
        />
        <DetailItem
          icon={<ICONS.Building />}
          label="Publisher Name"
          value={submission.details?.publisher_name}
        />
        <DetailItem
          icon={<ICONS.MapPin />}
          label="Publisher Address"
          value={submission.details?.publisher_address}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="Date of Publication"
          value={formatDate(submission.details?.date_of_publication)}
        />
        <DetailItem
          icon={<ICONS.Link2 />}
          label="URL"
          value={submission.details?.url_of_content}
          isLink
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="Claimed For"
          value={submission.details?.claimed_for}
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="Special Labs"
          value={submission.details?.special_labs}
        />
        <DetailItem
          icon={<ICONS.FileText />}
          label="Contact Number"
          value={submission.details?.contact_no}
        />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Attachments
        </h4>
        {submission.attachments?.map((att, idx) => (
          <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
        ))}
      </div>
      {submission.status === "Awaiting" && (
        <ActionButtons
          submission={submission}
          onAction={onAction}
          feedbackRef={feedbackRef}
        />
      )}
    </div>
  );
};

const EventCard = ({ submission, onAction }) => {
  const feedbackRef = useRef(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <DetailItem
          icon={<ICONS.FileText />}
          label="Task ID"
          value={submission.details?.task_id}
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="Event Type"
          value={submission.details?.event_type}
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="Event Level"
          value={submission.details?.event_level}
        />
        <DetailItem
          icon={<ICONS.Building />}
          label="Event Organizer"
          value={submission.details?.event_organizer}
        />
        <DetailItem
          icon={<ICONS.MapPin />}
          label="Organization Sector"
          value={submission.details?.organization_sector}
        />
        <DetailItem
          icon={<ICONS.Globe />}
          label="Event Mode"
          value={submission.details?.event_mode}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="Start Date"
          value={formatDate(submission.details?.start_date)}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="End Date"
          value={formatDate(submission.details?.end_date)}
        />
        <DetailItem
          icon={<ICONS.Clock />}
          label="Duration (Days)"
          value={submission.details?.duration_days}
        />
        <DetailItem
          icon={<ICONS.Briefcase />}
          label="Sponsorship Type"
          value={submission.details?.sponsorship_type}
        />
        <DetailItem
          icon={<ICONS.Award />}
          label="Outcome"
          value={submission.details?.outcome}
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="Claimed For"
          value={submission.details?.claimed_for}
        />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Attachments
        </h4>
        {submission.attachments?.map((att, idx) => (
          <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
        ))}
      </div>
      {submission.status === "Awaiting" && (
        <ActionButtons
          submission={submission}
          onAction={onAction}
          feedbackRef={feedbackRef}
        />
      )}
    </div>
  );
};

const ExaminerCard = ({ submission, onAction }) => {
  const feedbackRef = useRef(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <DetailItem
          icon={<ICONS.FileText />}
          label="Task ID"
          value={submission.details?.task_id}
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="Examiner Type"
          value={submission.details?.examiner_type}
        />
        <DetailItem
          icon={<ICONS.Building />}
          label="Organization Name"
          value={submission.details?.organization_name}
        />
        <DetailItem
          icon={<ICONS.MapPin />}
          label="Organization Address"
          value={submission.details?.organization_address}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="From Date"
          value={formatDate(submission.details?.from_date)}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="To Date"
          value={formatDate(submission.details?.to_date)}
        />
        <DetailItem
          icon={<ICONS.Clock />}
          label="Number of Days"
          value={submission.details?.number_of_days}
        />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Attachments
        </h4>
        {submission.attachments?.map((att, idx) => (
          <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
        ))}
      </div>
      {submission.status === "Awaiting" && (
        <ActionButtons
          submission={submission}
          onAction={onAction}
          feedbackRef={feedbackRef}
        />
      )}
    </div>
  );
};

const ReviewerCard = ({ submission, onAction }) => {
  const feedbackRef = useRef(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <DetailItem
          icon={<ICONS.FileText />}
          label="Task ID"
          value={submission.details?.task_id}
        />
        <DetailItem
          icon={<ICONS.FileText />}
          label="Journal Name"
          value={submission.details?.journal_name}
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="Journal Type"
          value={submission.details?.journal_type}
        />
        <DetailItem
          icon={<ICONS.FileText />}
          label="ISSN/ISBN"
          value={submission.details?.issn_isbn}
        />
        <DetailItem
          icon={<ICONS.Building />}
          label="Publisher Name"
          value={submission.details?.publisher_name}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="Year of Publication"
          value={submission.details?.year_of_publication}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="From Date"
          value={formatDate(submission.details?.from_date)}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="To Date"
          value={formatDate(submission.details?.to_date)}
        />
        <DetailItem
          icon={<ICONS.Clock />}
          label="Number of Days"
          value={submission.details?.number_of_days}
        />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Attachments
        </h4>
        {submission.attachments?.map((att, idx) => (
          <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
        ))}
      </div>
      {submission.status === "Awaiting" && (
        <ActionButtons
          submission={submission}
          onAction={onAction}
          feedbackRef={feedbackRef}
        />
      )}
    </div>
  );
};

const GuestLectureCard = ({ submission, onAction }) => {
  const feedbackRef = useRef(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <DetailItem
          icon={<ICONS.FileText />}
          label="Task ID"
          value={submission.details?.task_id}
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="Lecture Type"
          value={submission.details?.lecture_type}
        />
        <DetailItem
          icon={<ICONS.Building />}
          label="Organization Name"
          value={submission.details?.organization_name}
        />
        <DetailItem
          icon={<ICONS.MapPin />}
          label="Organization Address"
          value={submission.details?.organization_address}
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="Organization Type"
          value={submission.details?.organization_type}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="From Date"
          value={formatDate(submission.details?.from_date)}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="To Date"
          value={formatDate(submission.details?.to_date)}
        />
        <DetailItem
          icon={<ICONS.Clock />}
          label="Number of Days"
          value={submission.details?.number_of_days}
        />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Attachments
        </h4>
        {submission.attachments?.map((att, idx) => (
          <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
        ))}
      </div>
      {submission.status === "Awaiting" && (
        <ActionButtons
          submission={submission}
          onAction={onAction}
          feedbackRef={feedbackRef}
        />
      )}
    </div>
  );
};

const InternationalVisitCard = ({ submission, onAction }) => {
  const feedbackRef = useRef(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <DetailItem
          icon={<ICONS.FileText />}
          label="Task ID"
          value={submission.details?.task_id}
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="Visit Type"
          value={submission.details?.visit_type}
        />
        <DetailItem
          icon={<ICONS.Globe />}
          label="Country"
          value={submission.details?.country}
        />
        <DetailItem
          icon={<ICONS.Building />}
          label="Organization Name"
          value={submission.details?.organization_name}
        />
        <DetailItem
          icon={<ICONS.MapPin />}
          label="Organization Address"
          value={submission.details?.organization_address}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="From Date"
          value={formatDate(submission.details?.from_date)}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="To Date"
          value={formatDate(submission.details?.to_date)}
        />
        <DetailItem
          icon={<ICONS.Clock />}
          label="Number of Days"
          value={submission.details?.number_of_days}
        />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Attachments
        </h4>
        {submission.attachments?.map((att, idx) => (
          <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
        ))}
      </div>
      {submission.status === "Awaiting" && (
        <ActionButtons
          submission={submission}
          onAction={onAction}
          feedbackRef={feedbackRef}
        />
      )}
    </div>
  );
};

const AwardCard = ({ submission, onAction }) => {
  const feedbackRef = useRef(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <DetailItem
          icon={<ICONS.FileText />}
          label="Task ID"
          value={submission.details?.task_id}
        />
        <DetailItem
          icon={<ICONS.Trophy />}
          label="Award Type"
          value={submission.details?.award_type}
        />
        <DetailItem
          icon={<ICONS.Building />}
          label="Awarding Body"
          value={submission.details?.awarding_body}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="Award Date"
          value={formatDate(submission.details?.award_date)}
        />
      </div>
      <DetailItem
        icon={<ICONS.Summary />}
        label="Description"
        value={submission.details?.award_description}
        isTag
      />
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Attachments
        </h4>
        {submission.attachments?.map((att, idx) => (
          <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
        ))}
      </div>
      {submission.status === "Awaiting" && (
        <ActionButtons
          submission={submission}
          onAction={onAction}
          feedbackRef={feedbackRef}
        />
      )}
    </div>
  );
};

const OnlineCourseCard = ({ submission, onAction }) => {
  const feedbackRef = useRef(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <DetailItem
          icon={<ICONS.FileText />}
          label="Task ID"
          value={submission.details?.task_id}
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="Course Type"
          value={submission.details?.course_type}
        />
        <DetailItem
          icon={<ICONS.Building />}
          label="Platform"
          value={submission.details?.platform_name}
        />
        <DetailItem
          icon={<ICONS.Clock />}
          label="Duration"
          value={submission.details?.course_duration}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="Completion Date"
          value={formatDate(submission.details?.completion_date)}
        />
        <DetailItem
          icon={<ICONS.Link2 />}
          label="Certificate URL"
          value={submission.details?.certificate_url}
          isLink
        />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Attachments
        </h4>
        {submission.attachments?.map((att, idx) => (
          <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
        ))}
      </div>
      {submission.status === "Awaiting" && (
        <ActionButtons
          submission={submission}
          onAction={onAction}
          feedbackRef={feedbackRef}
        />
      )}
    </div>
  );
};

const PaperCard = ({ submission, onAction }) => {
  const feedbackRef = useRef(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <DetailItem
          icon={<ICONS.FileText />}
          label="Task ID"
          value={submission.details?.task_id}
        />
        <DetailItem
          icon={<ICONS.FileText />}
          label="Conference Name"
          value={submission.details?.conference_name}
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="Event Level"
          value={submission.details?.event_level}
        />
        <DetailItem
          icon={<ICONS.Globe />}
          label="Event Mode"
          value={submission.details?.event_mode}
        />
        <DetailItem
          icon={<ICONS.Building />}
          label="Event Organizer"
          value={submission.details?.event_organizer}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="Start Date"
          value={formatDate(submission.details?.start_date)}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="End Date"
          value={formatDate(submission.details?.end_date)}
        />
        <DetailItem
          icon={<ICONS.Clock />}
          label="Duration (Days)"
          value={submission.details?.duration_days}
        />
        <DetailItem
          icon={<ICONS.Briefcase />}
          label="Sponsorship"
          value={submission.details?.sponsorship}
        />
        <DetailItem
          icon={<ICONS.Award />}
          label="Award/Prize"
          value={submission.details?.award_prize}
        />
        <DetailItem
          icon={<ICONS.Users />}
          label="Other BIT Authors"
          value={submission.details?.other_authors_bit}
        />
        <DetailItem
          icon={<ICONS.Globe />}
          label="International Collaboration"
          value={submission.details?.international_collaboration}
        />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Attachments
        </h4>
        {submission.attachments?.map((att, idx) => (
          <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
        ))}
      </div>
      {submission.status === "Awaiting" && (
        <ActionButtons
          submission={submission}
          onAction={onAction}
          feedbackRef={feedbackRef}
        />
      )}
    </div>
  );
};

const ResourcePersonCard = ({ submission, onAction }) => {
  const feedbackRef = useRef(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <DetailItem
          icon={<ICONS.FileText />}
          label="Task ID"
          value={submission.details?.task_id}
        />
        <DetailItem
          icon={<ICONS.Star />}
          label="Category"
          value={submission.details?.resource_person_category}
        />
        <DetailItem
          icon={<ICONS.Building />}
          label="Organization Type"
          value={submission.details?.type_of_organisation}
        />
        <DetailItem
          icon={<ICONS.MapPin />}
          label="Organization Name & Address"
          value={submission.details?.organisation_name_address}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="From Date"
          value={formatDate(submission.details?.from_date)}
        />
        <DetailItem
          icon={<ICONS.Calendar />}
          label="To Date"
          value={formatDate(submission.details?.to_date)}
        />
        <DetailItem
          icon={<ICONS.Clock />}
          label="Number of Days"
          value={submission.details?.number_of_days}
        />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Attachments
        </h4>
        {submission.attachments?.map((att, idx) => (
          <AttachmentPill key={idx} fileName={att.name} fileUrl={att.url} />
        ))}
      </div>
      {submission.status === "Awaiting" && (
        <ActionButtons
          submission={submission}
          onAction={onAction}
          feedbackRef={feedbackRef}
        />
      )}
    </div>
  );
};

// Main Component
export default function FacultyVerifications() {
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Date");
  const [activeTab, setActiveTab] = useState("Awaiting");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data from API
  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_URL}api/admin/faculty-verifications`,
        { withCredentials: true }
      );
      console.log("API Response:", response.data);
      const submissions = response.data.submissions || [];
      console.log("Submissions:", submissions);
      setAllSubmissions(
        submissions.map((v, idx) => ({
          ...v,
          id: v.id || idx,
          isExpanded: false,
        }))
      );
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError("Failed to fetch faculty submissions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleToggleExpand = (id, type) => {
    setAllSubmissions((prev) =>
      prev.map((s) =>
        s.id === id && s.type === type ? { ...s, isExpanded: !s.isExpanded } : s
      )
    );
  };

  const handleAction = async (id, type, status, feedbackRef) => {
    const remarks = feedbackRef?.current?.value || "";

    try {
      await axios.put(
        `${API_URL}api/admin/faculty-verifications/update-status`,
        {
          id: id,
          type: type,
          status: status,
          remarks: remarks,
        },
        { withCredentials: true }
      );

      // Update local state
      const newStatus = status === "verified" ? "Verified" : "Rejected";
      setAllSubmissions((prev) =>
        prev.map((s) =>
          s.id === id && s.type === type
            ? { ...s, status: newStatus, remarks: remarks, isExpanded: false }
            : s
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleSortChange = (event) => setSortBy(event.target.value);

  const { tabsConfig, processedSubmissions } = useMemo(() => {
    console.log("All submissions:", allSubmissions);
    console.log("Active tab:", activeTab);
    const counts = { All: 0, Awaiting: 0, Verified: 0, Rejected: 0 };
    allSubmissions.forEach((sub) => {
      counts.All++;
      if (counts[sub.status] !== undefined) {
        counts[sub.status]++;
      }
    });
    console.log("Counts:", counts);

    const TABS_CONFIG = [
      { name: "All", count: counts.All },
      { name: "Awaiting", count: counts.Awaiting },
      { name: "Verified", count: counts.Verified },
      { name: "Rejected", count: counts.Rejected },
    ];

    const filtered = allSubmissions.filter((submission) => {
      const tabMatch = activeTab === "All" || submission.status === activeTab;
      if (!tabMatch) return false;
      const term = searchTerm.toLowerCase();
      return (
        !term ||
        (submission.title && submission.title.toLowerCase().includes(term)) ||
        (submission.facultyName &&
          submission.facultyName.toLowerCase().includes(term)) ||
        (submission.department &&
          submission.department.toLowerCase().includes(term))
      );
    });
    console.log("Filtered submissions:", filtered);

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "Name":
          return (a.facultyName || "").localeCompare(b.facultyName || "");
        case "Status":
          return (a.status || "").localeCompare(b.status || "");
        case "Type":
          return (a.type || "").localeCompare(b.type || "");
        case "Date":
        default:
          return (
            new Date(b.submissionDate || 0) - new Date(a.submissionDate || 0)
          );
      }
    });

    return { tabsConfig: TABS_CONFIG, processedSubmissions: sorted };
  }, [allSubmissions, activeTab, searchTerm, sortBy]);

  const renderCard = (submission) => {
    const cardProps = { submission, onAction: handleAction };
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
          <button
            onClick={fetchSubmissions}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      );
    if (processedSubmissions.length > 0) {
      return processedSubmissions.map((submission) => (
        <CardBase
          key={`${submission.type}-${submission.id}`}
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Faculty Verifications
            </h1>
            <p className="text-gray-600 mt-1">
              Review and verify faculty achievement submissions
            </p>
          </div>
          <button
            onClick={fetchSubmissions}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
          >
            Refresh
          </button>
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
