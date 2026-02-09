import React, { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import axios from "axios";

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
        placeholder="Search by student name or title..."
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

const ActionButtons = ({ submission, onAction, children }) => (
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
        placeholder="Add optional feedback for the student..."
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

const CardBase = ({ submission, onToggleExpand, children }) => (
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
            <p className="text-xs text-gray-500">{submission.studentName}</p>
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

// --- Specific Card Components ---

const CertificateCard = ({ submission, onAction }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Building />}
        label="Platform"
        value={submission.details.platform}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Issue Date"
        value={formatDate(submission.details.issue_date)}
      />
      <div className="md:col-span-2">
        {" "}
        <DetailItem
          icon={<ICONS.Link2 />}
          label="Course Link"
          value={submission.details.course_link}
          isLink
        />{" "}
      </div>
      <DetailItem
        icon={<ICONS.Star />}
        label="Activity Type"
        value={submission.details.activity_type}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Duration"
        value={submission.details.duration}
      />
      <DetailItem
        icon={<ICONS.MapPin />}
        label="Location"
        value={submission.details.location}
      />
      <DetailItem
        icon={<ICONS.Users />}
        label="Participation"
        value={submission.details.participation_type}
      />
      <DetailItem
        icon={<ICONS.Trophy />}
        label="Result"
        value={submission.details.winning_status}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Summary"
      value={submission.details.summary}
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

const ProjectCard = ({ submission, onAction }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Start Date"
        value={formatDate(submission.details.start_time)}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="End Date"
        value={formatDate(submission.details.end_time)}
      />
      <DetailItem
        icon={<ICONS.Users />}
        label="Team Members"
        value={submission.details.member_name}
      />
      <DetailItem
        icon={<ICONS.Code />}
        label="Technologies Used"
        value={submission.details.tech_names}
        isList
      />
      <DetailItem
        icon={<ICONS.GitBranch />}
        label="GitHub Link"
        value={submission.details.github_link}
        isLink
      />
      <DetailItem
        icon={<ICONS.Award />}
        label="Awards Won"
        value={submission.details.awards_won}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Problem Statement"
      value={submission.details.problem_statement}
      isTag
    />
    <DetailItem
      icon={<ICONS.Summary />}
      label="Summary"
      value={submission.details.summary}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      <AttachmentPill
        fileName={submission.attachments.find((a) => a.type === "report")?.name}
        fileUrl={submission.attachments.find((a) => a.type === "report")?.url}
      />
      <AttachmentPill
        fileName={submission.attachments.find((a) => a.type === "demo")?.name}
        fileUrl={submission.attachments.find((a) => a.type === "demo")?.url}
      />
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction}>
        <div>
          <label
            htmlFor={`complexity-${submission.id}`}
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Complexity Rating
          </label>
          <select
            id={`complexity-${submission.id}`}
            className="border border-gray-300 rounded-md py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white shadow-sm w-full sm:w-auto"
          >
            <option value="">Select Tier</option>
            <option value="T1">T1</option>
            <option value="T2">T2</option>
            <option value="T3">T3</option>
          </select>
        </div>
      </ActionButtons>
    )}
  </div>
);

const WorkshopCard = ({ submission, onAction }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Building />}
        label="Organized By"
        value={submission.details.organised_by}
      />
      <DetailItem
        icon={<ICONS.MapPin />}
        label="Location"
        value={submission.details.location}
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
        icon={<ICONS.Star />}
        label="Event Type"
        value={submission.details.event_type}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Mode"
        value={submission.details.mode_of_delivary}
      />
      <DetailItem
        icon={<ICONS.Users />}
        label="Participation"
        value={submission.details.participation_type}
      />
    </div>
    <DetailItem
      icon={<ICONS.Code />}
      label="Skills Gained"
      value={submission.details.skills_gained}
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

const PaperPresentationCard = ({ submission, onAction }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Building />}
        label="Conference Title"
        value={submission.details.conference_title}
      />
      <DetailItem
        icon={<ICONS.MapPin />}
        label="Location"
        value={submission.details.location}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Presentation Date"
        value={formatDate(submission.details.date_of_presentation)}
      />
      <DetailItem
        icon={<ICONS.Award />}
        label="Award"
        value={submission.details.award}
      />
    </div>
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      <AttachmentPill
        fileName={submission.attachments.find((a) => a.type === "pdf")?.name}
        fileUrl={submission.attachments.find((a) => a.type === "pdf")?.url}
      />
      <AttachmentPill
        fileName={
          submission.attachments.find((a) => a.type === "certificate")?.name
        }
        fileUrl={
          submission.attachments.find((a) => a.type === "certificate")?.url
        }
      />
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const InternshipCard = ({ submission, onAction }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.Building />}
        label="Company"
        value={submission.details.company_name}
      />
      <DetailItem
        icon={<ICONS.Briefcase />}
        label="Role"
        value={submission.details.roll}
      />
      <DetailItem
        icon={<ICONS.Code />}
        label="Domain"
        value={submission.details.domain}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Type"
        value={submission.details.internship_type}
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
        label="Faculty Consultant"
        value={submission.details.consulted_faculty_name}
      />
      <DetailItem
        icon={<ICONS.UserCheck />}
        label="Industry Mentor"
        value={submission.details.industry_mentor_name}
      />
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Outcomes"
      value={submission.details.outcomes}
      isTag
    />
    <DetailItem
      icon={<ICONS.Code />}
      label="Skills Gained"
      value={submission.details.skill_gained}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      <AttachmentPill
        fileName={
          submission.attachments.find((a) => a.type === "offer_letter")?.name
        }
        fileUrl={
          submission.attachments.find((a) => a.type === "offer_letter")?.url
        }
      />
      <AttachmentPill
        fileName={submission.attachments.find((a) => a.type === "report")?.name}
        fileUrl={submission.attachments.find((a) => a.type === "report")?.url}
      />
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const PatentCard = ({ submission, onAction }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <DetailItem
        icon={<ICONS.FileText />}
        label="Application No."
        value={submission.details.application_number}
      />
      <DetailItem
        icon={<ICONS.Calendar />}
        label="Filing Date"
        value={formatDate(submission.details.date_of_filing)}
      />
      <DetailItem
        icon={<ICONS.Star />}
        label="Patent Status"
        value={submission.details.patent_status}
      />
      <div className="md:col-span-2">
        <DetailItem
          icon={<ICONS.Link2 />}
          label="Patent Listing Link"
          value={submission.details.link_to_patent_listing}
          isLink
        />
      </div>
    </div>
    <DetailItem
      icon={<ICONS.Summary />}
      label="Summary"
      value={submission.details.summary}
      isTag
    />
    <DetailItem
      icon={<ICONS.Summary />}
      label="Use Case"
      value={submission.details.usecase_of_patent}
      isTag
    />
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
      <AttachmentPill
        fileName={
          submission.attachments.find((a) => a.type === "patent_docs")?.name
        }
        fileUrl={
          submission.attachments.find((a) => a.type === "patent_docs")?.url
        }
      />
      <AttachmentPill
        fileName={
          submission.attachments.find((a) => a.type === "supporting_files")
            ?.name
        }
        fileUrl={
          submission.attachments.find((a) => a.type === "supporting_files")?.url
        }
      />
    </div>
    {submission.status === "Awaiting" && (
      <ActionButtons submission={submission} onAction={onAction} />
    )}
  </div>
);

const transformApiData = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((item) => {
    const { upload_type, user_name, ...details } = item;

    // --- FIX IS HERE ---
    // Normalize the upload_type to lowercase to ensure consistency
    const normalizedUploadType = upload_type.toLowerCase();

    const idForReact = `${normalizedUploadType}-${details.id}`;
    const typeDisplay = upload_type
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

    // Use the normalized type for checking status as well
    if (normalizedUploadType === "patents") {
      const patentStatus = item.patent_status?.toLowerCase();
      if (patentStatus === "approved") {
        status = "Verified";
      } else if (
        patentStatus === "rejected" ||
        patentStatus === "notapproved"
      ) {
        status = "Rejected";
      } else {
        status = "Awaiting";
      }
    } else {
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
    }

    // Use the normalized type in the switch statement
    switch (normalizedUploadType) {
      case "certificate":
        title =
          details.event_name ||
          details.platform ||
          details.activity_type ||
          "Certificate";
        submissionDate = details.issue_date;
        addAttachment("certificate", details.certificate_pdf);
        break;
      case "project":
        title = details.title_idea || "Project Submission";
        submissionDate = details.start_time;
        addAttachment("report", details.report_pdf);
        addAttachment("demo", details.demo_video);
        break;
      case "workshop":
        title = `Workshop: ${details.topic_covered || details.event_nature}`;
        submissionDate = details.start_date;
        addAttachment("certificate", details.certificate_pdf);
        break;
      case "paperpresentation":
        title = details.paper_title;
        submissionDate = details.date_of_presentation;
        addAttachment("pdf", details.pdf);
        addAttachment("certificate", details.certificate);
        break;
      case "internship":
        title = `${details.internship_type} at ${details.company_name}`;
        submissionDate = details.start_date;
        addAttachment("offer_letter", details.offer_letter);
        addAttachment("report", details.report);
        break;
      case "patents":
        title = `Patent: ${details.application_number}`;
        submissionDate = details.date_of_filing;
        addAttachment("patent_docs", details.patent_docs);
        addAttachment("supporting_files", details.supporting_files);
        break;
      default:
        title = `${typeDisplay} Submission`;
        break;
    }

    return {
      id: idForReact,
      studentName: user_name,
      title,
      submissionDate,
      type: normalizedUploadType, // Store the normalized type
      typeDisplay,
      status,
      isExpanded: false,
      attachments,
      details: details,
    };
  });
};

// --- MAIN COMPONENT: Verification ---
export default function Verification() {
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
          `${API_URL}api/studentrequests/varifications`,
          { withCredentials: true }
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
        setError("Could not load verification requests. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const handleToggleExpand = (id) => {
    setAllSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, isExpanded: !sub.isExpanded } : sub
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

    if (submission.type === "project") {
      const complexityInput = document.getElementById(
        `complexity-${submission.id}`
      );
      const tierValue = complexityInput ? complexityInput.value : null;
      if (tierValue) {
        formData.append("tier", tierValue);
      }
    }

    console.log("--- Sending Data to Backend ---");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      const response = await axios.post(
        `${API_URL}/api/studentrequests/varifications`,
        formData,
        { withCredentials: true }
      );

      console.log("Backend API response:", response.data);

      const newStatus = actionType === "verify" ? "Verified" : "Rejected";
      setAllSubmissions((prev) =>
        prev.map((s) =>
          s.id === reactId ? { ...s, status: newStatus, isExpanded: false } : s
        )
      );
    } catch (error) {
      console.error(
        "Error updating submission status:",
        error.response || error
      );
      alert(
        `Failed to ${actionType} the submission. Check the console for details.`
      );
    }
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleSortChange = (event) => setSortBy(event.target.value);

  const { tabsConfig, processedSubmissions } = useMemo(() => {
    const counts = { All: 0, Awaiting: 0, Verified: 0, Rejected: 0 };
    allSubmissions.forEach((sub) => {
      counts.All++;
      if (counts[sub.status] !== undefined) {
        counts[sub.status]++;
      }
    });

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
        submission.title.toLowerCase().includes(term) ||
        submission.studentName.toLowerCase().includes(term)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "Name":
          return a.studentName.localeCompare(b.studentName);
        case "Status":
          return a.status.localeCompare(b.status);
        case "Type":
          return a.type.localeCompare(b.type);
        case "Date":
        default:
          return new Date(b.submissionDate) - new Date(a.submissionDate);
      }
    });

    return { tabsConfig: TABS_CONFIG, processedSubmissions: sorted };
  }, [allSubmissions, activeTab, searchTerm, sortBy]);

  const renderCard = (submission) => {
    const cardProps = { submission, onAction: handleAction };
    switch (submission.type) {
      case "certificate":
        return <CertificateCard {...cardProps} />;
      case "project":
        return <ProjectCard {...cardProps} />;
      case "workshop":
        return <WorkshopCard {...cardProps} />;
      case "paperpresentation":
        return <PaperPresentationCard {...cardProps} />;
      case "internship":
        return <InternshipCard {...cardProps} />;
      case "patents":
        return <PatentCard {...cardProps} />;
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
