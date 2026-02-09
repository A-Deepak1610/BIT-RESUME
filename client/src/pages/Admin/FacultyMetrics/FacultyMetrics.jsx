import React, {useState, useEffect} from "react";
import {
  Search,
  UserX,
  X,
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
  FileText,
  UserCheck,
  ExternalLink,
  Globe,
  Award,
  Loader2,
} from "lucide-react";

// API base URL
// API base URL - remove trailing slash if present
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// Get default empty achievements structure
const getDefaultAchievements = () => ({
  newsletterArchive: [],
  eContentDeveloped: [],
  eventsAttended: [],
  eventsOrganized: [],
  externalExaminer: [],
  journalReviewer: [],
  guestLectures: [],
  internationalVisits: [],
  notableAchievements: [],
  onlineCourses: [],
  paperPresentations: [],
  resourcePerson: [],
});

// Tabs configuration (no overview - like student metrics)
const tabs = [
  {id: "newsletter", label: "Newsletter", icon: Newspaper},
  {id: "econtent", label: "E-Content", icon: Monitor},
  {id: "eventsAttended", label: "Events Attended", icon: Users},
  {id: "eventsOrganized", label: "Events Organized", icon: Calendar},
  {id: "examiner", label: "External Examiner", icon: ClipboardCheck},
  {id: "reviewer", label: "Journal Reviewer", icon: PenTool},
  {id: "guestLecture", label: "Guest Lectures", icon: Mic},
  {id: "internationalVisit", label: "Int'l Visits", icon: Plane},
  {id: "awards", label: "Awards", icon: Trophy},
  {id: "onlineCourse", label: "Online Courses", icon: Video},
  {id: "papers", label: "Papers", icon: FileText},
  {id: "resourcePerson", label: "Resource Person", icon: UserCheck},
];

// Faculty List Panel Component
function FacultyListPanel({
  facultyList,
  selectedFaculty,
  onFacultySelect,
  onClose,
  searchTerm,
  setSearchTerm,
}) {
  const filteredFaculty = facultyList.filter((faculty) => {
    const matchesSearch =
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.faculty_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-4 bg-white h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold text-lg text-gray-800">Faculty</h1>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          aria-label="Close panel"
        >
          <X size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={16} />
        </div>
        <input
          type="text"
          className="block w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm placeholder-gray-400"
          placeholder="Search faculty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Faculty Cards */}
      {filteredFaculty.length > 0 ? (
        <div className="space-y-2">
          {filteredFaculty.map((faculty) => (
            <div
              key={faculty.faculty_id}
              className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                selectedFaculty?.faculty_id === faculty.faculty_id
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => onFacultySelect(faculty)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 text-sm">
                    {faculty.name}
                  </h3>
                  <p className="text-xs text-gray-500">{faculty.faculty_id}</p>
                </div>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                  {faculty.total_achievements}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <UserX size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 text-sm">
            {searchTerm ? "No results found" : "No faculty available"}
          </p>
        </div>
      )}
    </div>
  );
}

// Card Components for different achievement types
const NewsletterCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">
          {item.newsletter_category} Newsletter
        </h4>
        <p className="text-indigo-600 text-sm font-medium">
          Vol. {item.volume_number}, Issue {item.issue_number}
        </p>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          item.status === "approved"
            ? "bg-green-100 text-green-700"
            : item.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {item.status}
      </span>
    </div>
    <div className="text-gray-600 text-sm space-y-1 mb-3">
      <p>
        <strong>Department:</strong> {item.department}
      </p>
      <p>
        <strong>Academic Year:</strong> {item.academic_year}
      </p>
      <p>
        <strong>Issue Month:</strong> {item.issue_month}
      </p>
      <p>
        <strong>Faculty Editors:</strong> {item.faculty_editor_count} |{" "}
        <strong>Student Editors:</strong> {item.student_editor_count}
      </p>
    </div>
    <div className="flex items-center justify-between text-gray-500 text-xs">
      <span className="flex items-center">
        <Calendar size={14} className="mr-1" />
        Published: {item.date_of_publication}
      </span>
      {item.proof_document && (
        <a
          href={item.proof_document}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center"
        >
          <ExternalLink size={12} className="mr-1" /> View Proof
        </a>
      )}
    </div>
    {item.remarks && (
      <p className="text-gray-500 text-xs mt-2 italic">
        Remarks: {item.remarks}
      </p>
    )}
  </div>
);

const EContentCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.topic_name}</h4>
        <p className="text-indigo-600 text-sm font-medium">
          {item.e_content_type}
        </p>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          item.status === "approved"
            ? "bg-green-100 text-green-700"
            : item.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {item.status}
      </span>
    </div>
    <div className="text-gray-600 text-sm space-y-1 mb-3">
      <p>
        <strong>Publisher:</strong> {item.publisher_name}
      </p>
      <p>
        <strong>Date Published:</strong> {item.date_of_publication}
      </p>
    </div>
    {item.url_of_content && (
      <a
        href={item.url_of_content}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs flex items-center gap-1"
      >
        <ExternalLink size={12} /> View Content
      </a>
    )}
    {item.remarks && (
      <p className="text-gray-500 text-xs mt-2 italic">
        Remarks: {item.remarks}
      </p>
    )}
  </div>
);

const EventAttendedCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-semibold text-gray-800 flex-1">{item.event_title}</h4>
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          item.status === "approved"
            ? "bg-green-100 text-green-700"
            : item.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {item.status}
      </span>
    </div>
    <div className="text-gray-600 text-sm space-y-1 mb-3">
      <p>
        <strong>Task ID:</strong> {item.task_id}
      </p>
      <p>
        <strong>Organizer:</strong> {item.event_organizer}
      </p>
      <p>
        <strong>Type:</strong> {item.event_type} | <strong>Level:</strong>{" "}
        {item.event_level}
      </p>
      <p>
        <strong>Mode:</strong> {item.event_mode} |{" "}
        <strong>Organizer Type:</strong> {item.organizer_type}
      </p>
      <p>
        <strong>Organization Sector:</strong> {item.organization_sector}
      </p>
      <p>
        <strong>Duration:</strong> {item.event_duration} (
        {item.duration_in_days} days)
      </p>
      <p>
        <strong>Date:</strong> {item.start_date} to {item.end_date}
      </p>
      <p>
        <strong>Sponsorship:</strong> {item.sponsorship_type}
      </p>
      <p>
        <strong>Outcome:</strong> {item.outcome}
      </p>
      <p>
        <strong>Claimed For:</strong> {item.claimed_for}
      </p>
      {item.special_labs_involved && (
        <p>
          <strong>Special Labs:</strong> {item.special_labs_involved}
        </p>
      )}
      {item.other_organizer_name && (
        <p>
          <strong>Other Organizer:</strong> {item.other_organizer_name}
        </p>
      )}
    </div>
    <div className="flex gap-2">
      {item.certificate_proof && (
        <a
          href={item.certificate_proof}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-xs flex items-center gap-1"
        >
          <ExternalLink size={12} /> Certificate
        </a>
      )}
      {item.geotag_photos && (
        <a
          href={item.geotag_photos}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-xs flex items-center gap-1"
        >
          <ExternalLink size={12} /> Photos
        </a>
      )}
    </div>
    {item.remarks && (
      <p className="text-gray-500 text-xs mt-2 italic">
        Remarks: {item.remarks}
      </p>
    )}
  </div>
);

const EventOrganizedCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.event_name}</h4>
        <p className="text-indigo-600 text-sm font-medium">
          {item.program_type}
        </p>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          item.status === "approved"
            ? "bg-green-100 text-green-700"
            : item.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-purple-100 text-purple-700"
        }`}
      >
        {item.status}
      </span>
    </div>
    <div className="text-gray-600 text-sm space-y-1 mb-3">
      <p>
        <strong>Type:</strong> {item.event_type} | <strong>Level:</strong>{" "}
        {item.event_level}
      </p>
      <p>
        <strong>Mode:</strong> {item.event_mode}
      </p>
      <p>
        <strong>Date:</strong> {item.start_date} to {item.end_date}
      </p>
      <p>
        <strong>Duration:</strong> {item.event_duration} days
      </p>
      <p>
        <strong>Internal Students:</strong> {item.internal_students_count} |{" "}
        <strong>Faculty:</strong> {item.internal_faculty_count}
      </p>
      <p>
        <strong>External Students:</strong> {item.external_students_count} |{" "}
        <strong>Faculty:</strong> {item.external_faculty_count}
      </p>
      {item.total_revenue > 0 && (
        <p>
          <strong>Total Revenue:</strong> ₹{item.total_revenue}
        </p>
      )}
    </div>
    {item.proof_file && (
      <a
        href={item.proof_file}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs flex items-center gap-1"
      >
        <ExternalLink size={12} /> View Proof
      </a>
    )}
    {item.remarks && (
      <p className="text-gray-500 text-xs mt-2 italic">
        Remarks: {item.remarks}
      </p>
    )}
  </div>
);

const ExaminerCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-semibold text-gray-800 flex-1">
        {item.college_name}
      </h4>
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          item.status === "approved"
            ? "bg-green-100 text-green-700"
            : item.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {item.status}
      </span>
    </div>
    <div className="text-gray-600 text-sm space-y-1 mb-3">
      <p>
        <strong>Task ID:</strong> {item.task_id}
      </p>
      <p>
        <strong>Address:</strong> {item.institute_address}
      </p>
      <p>
        <strong>Purpose:</strong> {item.purpose_of_visit}
      </p>
      <p>
        <strong>Duration:</strong> {item.number_of_days} days
      </p>
      <p>
        <strong>Date:</strong> {item.from_date} to {item.to_date}
      </p>
      {item.special_labs_involved && (
        <p>
          <strong>Special Labs:</strong> {item.special_labs_involved}
        </p>
      )}
    </div>
    {item.document_proof && (
      <a
        href={item.document_proof}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs flex items-center gap-1"
      >
        <ExternalLink size={12} /> View Document
      </a>
    )}
    {item.remarks && (
      <p className="text-gray-500 text-xs mt-2 italic">
        Remarks: {item.remarks}
      </p>
    )}
  </div>
);

const ReviewerCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.journal_name}</h4>
        <p className="text-indigo-600 text-sm font-medium">
          {item.publisher_name}
        </p>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          item.status === "approved"
            ? "bg-green-100 text-green-700"
            : item.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {item.status}
      </span>
    </div>
    <div className="text-gray-600 text-sm space-y-1 mb-3">
      <p>
        <strong>Task ID:</strong> {item.task_id}
      </p>
      <p>
        <strong>Indexing:</strong> {item.journal_indexing}{" "}
        {item.other_journal_indexing && `(${item.other_journal_indexing})`}
      </p>
      <p>
        <strong>ISSN:</strong> {item.issn_no}
      </p>
      <p>
        <strong>Impact Factor:</strong> {item.impact_factor}
      </p>
      <p>
        <strong>Recognition Type:</strong> {item.recognition_type}{" "}
        {item.other_recognition_type && `(${item.other_recognition_type})`}
      </p>
      <p>
        <strong>Papers Reviewed:</strong> {item.number_of_papers_reviewed}
      </p>
      <p>
        <strong>Review Date:</strong> {item.review_date}
      </p>
      {item.special_labs_involved && (
        <p>
          <strong>Special Labs:</strong> {item.special_labs_involved}
        </p>
      )}
    </div>
    {item.journal_homepage_url && (
      <a
        href={item.journal_homepage_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs flex items-center gap-1 mb-2"
      >
        <ExternalLink size={12} /> Journal Homepage
      </a>
    )}
    {item.document_proof && (
      <a
        href={item.document_proof}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs flex items-center gap-1"
      >
        <ExternalLink size={12} /> View Document
      </a>
    )}
    {item.remarks && (
      <p className="text-gray-500 text-xs mt-2 italic">
        Remarks: {item.remarks}
      </p>
    )}
  </div>
);

const GuestLectureCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-semibold text-gray-800 flex-1">{item.topic}</h4>
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          item.status === "approved"
            ? "bg-green-100 text-green-700"
            : item.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {item.status}
      </span>
    </div>
    <div className="text-gray-600 text-sm space-y-1 mb-3">
      <p>
        <strong>Task ID:</strong> {item.task_id}
      </p>
      <p>
        <strong>Event Name:</strong> {item.event_name}
      </p>
      <p>
        <strong>Event Type:</strong> {item.event_type} | <strong>Level:</strong>{" "}
        {item.event_level}
      </p>
      <p>
        <strong>Mode:</strong> {item.mode_of_conduct}
      </p>
      <p>
        <strong>Organization Type:</strong> {item.type_of_organization}
      </p>
      <p>
        <strong>Date:</strong> {item.from_date} to {item.to_date}
      </p>
      <p>
        <strong>Participants:</strong> {item.number_of_participants}
      </p>
      <p>
        <strong>Audience Type:</strong> {item.type_of_audience}
      </p>
      {item.special_labs_involved && (
        <p>
          <strong>Special Labs:</strong> {item.special_labs_involved}
        </p>
      )}
    </div>
    <div className="flex flex-wrap gap-2">
      {item.document_proof && (
        <a
          href={item.document_proof}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-xs flex items-center gap-1"
        >
          <ExternalLink size={12} /> Document
        </a>
      )}
      {item.apex_proof && (
        <a
          href={item.apex_proof}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-xs flex items-center gap-1"
        >
          <ExternalLink size={12} /> Apex Proof
        </a>
      )}
      {item.sample_photographs && (
        <a
          href={item.sample_photographs}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-xs flex items-center gap-1"
        >
          <ExternalLink size={12} /> Photos
        </a>
      )}
    </div>
    {item.remarks && (
      <p className="text-gray-500 text-xs mt-2 italic">
        Remarks: {item.remarks}
      </p>
    )}
  </div>
);

const InternationalVisitCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-start gap-3">
        <Globe className="text-indigo-500 mt-1" size={20} />
        <div>
          <h4 className="font-semibold text-gray-800">
            {item.country_visited}
          </h4>
          <p className="text-indigo-600 text-sm font-medium">
            {item.purpose_of_visit}
          </p>
        </div>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          item.status === "approved"
            ? "bg-green-100 text-green-700"
            : item.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {item.status}
      </span>
    </div>
    <div className="text-gray-600 text-sm space-y-1 mb-3">
      <p>
        <strong>Task ID:</strong> {item.task_id}
      </p>
      <p>
        <strong>Date:</strong> {item.from_date} to {item.to_date}
      </p>
      <p>
        <strong>Funding:</strong> {item.fund_type}
      </p>
    </div>
    {item.document_proof && (
      <a
        href={item.document_proof}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs flex items-center gap-1"
      >
        <ExternalLink size={12} /> View Document
      </a>
    )}
    {item.remarks && (
      <p className="text-gray-500 text-xs mt-2 italic">
        Remarks: {item.remarks}
      </p>
    )}
  </div>
);

const AwardCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-start gap-3 flex-1">
        <Trophy className="text-yellow-500 mt-1" size={24} />
        <div>
          <h4 className="font-semibold text-gray-800">{item.award_name}</h4>
          <p className="text-indigo-600 text-sm font-medium">
            {item.awarding_agency}
          </p>
        </div>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          item.status === "approved"
            ? "bg-green-100 text-green-700"
            : item.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {item.status}
      </span>
    </div>
    <div className="text-gray-600 text-sm space-y-1 mb-3">
      <p>
        <strong>Task ID:</strong> {item.task_id}
      </p>
      <p>
        <strong>Recognition Type:</strong> {item.type_of_recognition}{" "}
        {item.other_type_of_recognition &&
          `(${item.other_type_of_recognition})`}
      </p>
      <p>
        <strong>Organization Type:</strong> {item.organization_type}{" "}
        {item.other_organization_type && `(${item.other_organization_type})`}
      </p>
      <p>
        <strong>Level:</strong> {item.level}
      </p>
      <p>
        <strong>Date Received:</strong> {item.received_date}
      </p>
      <p>
        <strong>Nature:</strong> {item.nature_of_recognition}{" "}
        {item.other_nature_of_recognition &&
          `(${item.other_nature_of_recognition})`}
      </p>
      {item.technical_society && (
        <p>
          <strong>Technical Society:</strong> {item.technical_society}
        </p>
      )}
      {item.special_labs_involved && (
        <p>
          <strong>Special Labs:</strong> {item.special_labs_involved}
        </p>
      )}
    </div>
    <div className="flex flex-wrap gap-2">
      {item.photo_proofs && (
        <a
          href={item.photo_proofs}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-xs flex items-center gap-1"
        >
          <ExternalLink size={12} /> Photos
        </a>
      )}
      {item.document_proof && (
        <a
          href={item.document_proof}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-xs flex items-center gap-1"
        >
          <ExternalLink size={12} /> Document
        </a>
      )}
    </div>
    {item.remarks && (
      <p className="text-gray-500 text-xs mt-2 italic">
        Remarks: {item.remarks}
      </p>
    )}
  </div>
);

const OnlineCourseCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.course_name}</h4>
        <p className="text-indigo-600 text-sm font-medium">
          {item.organization_name}
        </p>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          item.status === "approved"
            ? "bg-green-100 text-green-700"
            : item.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {item.status}
      </span>
    </div>
    <div className="text-gray-600 text-sm space-y-1 mb-3">
      <p>
        <strong>Task ID:</strong> {item.task_id}
      </p>
      <p>
        <strong>Mode:</strong> {item.mode_of_course}
      </p>
      <p>
        <strong>Course Type:</strong> {item.course_type}{" "}
        {item.other_course_type && `(${item.other_course_type})`}
      </p>
      <p>
        <strong>Organizer Type:</strong> {item.type_of_organizer}{" "}
        {item.other_type_of_organizer && `(${item.other_type_of_organizer})`}
      </p>
      <p>
        <strong>Organization Address:</strong> {item.organization_address}
      </p>
      <p>
        <strong>Level:</strong> {item.level_of_event}
      </p>
      <p>
        <strong>Duration:</strong> {item.duration}{" "}
        {item.other_duration && `(${item.other_duration})`}
      </p>
      <p>
        <strong>Date:</strong> {item.start_date} to {item.end_date}
      </p>
      <p>
        <strong>Category:</strong> {item.course_category}{" "}
        {item.other_course_category && `(${item.other_course_category})`}
      </p>
      <p>
        <strong>Grade:</strong> {item.grade_obtained}
      </p>
      <p>
        <strong>Sponsorship:</strong> {item.type_of_sponsorship}{" "}
        {item.other_type_of_sponsorship &&
          `(${item.other_type_of_sponsorship})`}
      </p>
      <p>
        <strong>Claimed For:</strong> {item.claimed_for}{" "}
        {item.other_claimed_for && `(${item.other_claimed_for})`}
      </p>
      {item.special_labs_involved && (
        <p>
          <strong>Special Labs:</strong> {item.special_labs_involved}
        </p>
      )}
    </div>
    {item.document_proof && (
      <a
        href={item.document_proof}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs flex items-center gap-1"
      >
        <ExternalLink size={12} /> View Certificate
      </a>
    )}
    {item.remarks && (
      <p className="text-gray-500 text-xs mt-2 italic">
        Remarks: {item.remarks}
      </p>
    )}
  </div>
);

const PaperCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.paper_title}</h4>
        <p className="text-indigo-600 text-sm font-medium">
          {item.conference_name}
        </p>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          item.status === "approved"
            ? "bg-green-100 text-green-700"
            : item.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {item.status}
      </span>
    </div>
    <div className="text-gray-600 text-sm space-y-1 mb-3">
      <p>
        <strong>Task ID:</strong> {item.task_id}
      </p>
      <p>
        <strong>Event Mode:</strong> {item.event_mode} | <strong>Level:</strong>{" "}
        {item.event_level}
      </p>
      <p>
        <strong>Organizer:</strong> {item.event_organizer}{" "}
        {item.other_event_organizer && `(${item.other_event_organizer})`}
      </p>
      <p>
        <strong>Date:</strong> {item.event_start_date} to {item.event_end_date}
      </p>
      <p>
        <strong>Duration:</strong> {item.event_duration_days} days
      </p>
      <p>
        <strong>Published in Proceedings:</strong>{" "}
        {item.published_in_proceedings}
      </p>
      <p>
        <strong>Sponsorship:</strong> {item.type_of_sponsorship}{" "}
        {item.other_type_of_sponsorship &&
          `(${item.other_type_of_sponsorship})`}
      </p>
      {item.other_authors_bit && (
        <p>
          <strong>Other BIT Authors:</strong> {item.other_authors_bit}
        </p>
      )}
      {item.faculty_other_institute && (
        <p>
          <strong>Faculty from Other Institute:</strong>{" "}
          {item.faculty_other_institute}
        </p>
      )}
      {item.industrial_person_involved && (
        <p>
          <strong>Industrial Person:</strong> {item.industrial_person_involved}
        </p>
      )}
      {item.international_collaboration && (
        <p>
          <strong>International Collaboration:</strong>{" "}
          {item.international_collaboration}
        </p>
      )}
      {item.students_involved && (
        <p>
          <strong>Students Involved:</strong> {item.students_involved}
        </p>
      )}
      {item.registration_amount && (
        <p>
          <strong>Registration Amount:</strong> {item.registration_amount}
        </p>
      )}
      {item.award_cash_prize_receiver && (
        <p>
          <strong>Award/Prize:</strong> {item.award_cash_prize_receiver}
        </p>
      )}
      {item.special_labs_involved && (
        <p>
          <strong>Special Labs:</strong> {item.special_labs_involved}
        </p>
      )}
    </div>
    {item.document_proof && (
      <a
        href={item.document_proof}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs flex items-center gap-1"
      >
        <ExternalLink size={12} /> View Document
      </a>
    )}
    {item.remarks && (
      <p className="text-gray-500 text-xs mt-2 italic">
        Remarks: {item.remarks}
      </p>
    )}
  </div>
);

const ResourcePersonCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-semibold text-gray-800 flex-1">
        {item.resource_person_category}
      </h4>
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          item.status === "approved"
            ? "bg-green-100 text-green-700"
            : item.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {item.status}
      </span>
    </div>
    <div className="text-gray-600 text-sm space-y-1 mb-3">
      <p>
        <strong>Task ID:</strong> {item.task_id}
      </p>
      <p>
        <strong>Organization Type:</strong> {item.type_of_organisation}{" "}
        {item.other_type_of_organisation &&
          `(${item.other_type_of_organisation})`}
      </p>
      <p>
        <strong>Organization:</strong> {item.organisation_name_and_address}
      </p>
      <p>
        <strong>Duration:</strong> {item.number_of_days} days
      </p>
      <p>
        <strong>Date:</strong> {item.from_date} to {item.to_date}
      </p>
      {item.special_labs_involved && (
        <p>
          <strong>Special Labs:</strong> {item.special_labs_involved}
        </p>
      )}
    </div>
    {item.document_proof && (
      <a
        href={item.document_proof}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs flex items-center gap-1"
      >
        <ExternalLink size={12} /> View Document
      </a>
    )}
    {item.remarks && (
      <p className="text-gray-500 text-xs mt-2 italic">
        Remarks: {item.remarks}
      </p>
    )}
  </div>
);

// Empty State Component
const EmptyState = ({icon: Icon, message}) => (
  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
    <Icon size={48} className="mx-auto text-gray-300 mb-4" />
    <p className="text-gray-500 font-medium">{message}</p>
    <p className="text-gray-400 text-sm mt-1">
      No records found in this category
    </p>
  </div>
);

// Faculty Detail Panel Component
function FacultyDetailPanel({faculty, achievements, loading}) {
  const [activeTab, setActiveTab] = useState("newsletter");

  if (!faculty) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <Users size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            Select a faculty member
          </p>
          <p className="text-gray-400 text-sm">
            Choose from the list to view their achievements
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <Loader2
            size={48}
            className="mx-auto text-indigo-600 animate-spin mb-4"
          />
          <p className="text-gray-600 font-medium">Loading achievements...</p>
        </div>
      </div>
    );
  }

  // Get count for active tab
  const getTabCount = (tabId) => {
    const countMap = {
      newsletter: achievements.newsletterArchive?.length || 0,
      econtent: achievements.eContentDeveloped?.length || 0,
      eventsAttended: achievements.eventsAttended?.length || 0,
      eventsOrganized: achievements.eventsOrganized?.length || 0,
      examiner: achievements.externalExaminer?.length || 0,
      reviewer: achievements.journalReviewer?.length || 0,
      guestLecture: achievements.guestLectures?.length || 0,
      internationalVisit: achievements.internationalVisits?.length || 0,
      awards: achievements.notableAchievements?.length || 0,
      onlineCourse: achievements.onlineCourses?.length || 0,
      papers: achievements.paperPresentations?.length || 0,
      resourcePerson: achievements.resourcePerson?.length || 0,
    };
    return countMap[tabId] || 0;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "newsletter":
        return achievements.newsletterArchive?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {achievements.newsletterArchive.map((item) => (
              <NewsletterCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Newspaper} message="No newsletters found" />
        );

      case "econtent":
        return achievements.eContentDeveloped?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {achievements.eContentDeveloped.map((item) => (
              <EContentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Monitor} message="No e-content found" />
        );

      case "eventsAttended":
        return achievements.eventsAttended?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {achievements.eventsAttended.map((item) => (
              <EventAttendedCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Users} message="No events attended" />
        );

      case "eventsOrganized":
        return achievements.eventsOrganized?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {achievements.eventsOrganized.map((item) => (
              <EventOrganizedCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Calendar} message="No events organized" />
        );

      case "examiner":
        return achievements.externalExaminer?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {achievements.externalExaminer.map((item) => (
              <ExaminerCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ClipboardCheck}
            message="No external examiner records"
          />
        );

      case "reviewer":
        return achievements.journalReviewer?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {achievements.journalReviewer.map((item) => (
              <ReviewerCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState icon={PenTool} message="No journal reviewer records" />
        );

      case "guestLecture":
        return achievements.guestLectures?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {achievements.guestLectures.map((item) => (
              <GuestLectureCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Mic} message="No guest lectures found" />
        );

      case "internationalVisit":
        return achievements.internationalVisits?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {achievements.internationalVisits.map((item) => (
              <InternationalVisitCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Plane} message="No international visits found" />
        );

      case "awards":
        return achievements.notableAchievements?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {achievements.notableAchievements.map((item) => (
              <AwardCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Trophy} message="No awards found" />
        );

      case "onlineCourse":
        return achievements.onlineCourses?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {achievements.onlineCourses.map((item) => (
              <OnlineCourseCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Video} message="No online courses found" />
        );

      case "papers":
        return achievements.paperPresentations?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {achievements.paperPresentations.map((item) => (
              <PaperCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState icon={FileText} message="No papers found" />
        );

      case "resourcePerson":
        return achievements.resourcePerson?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {achievements.resourcePerson.map((item) => (
              <ResourcePersonCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState icon={UserCheck} message="No resource person records" />
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-800">{faculty.name}</h2>
        <p className="text-sm text-gray-500 mt-1">{faculty.faculty_id}</p>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 p-1 rounded-lg mb-4">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            const count = getTabCount(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-1.5 py-1.5 px-3
                  rounded-md transition-all duration-150
                  text-xs font-medium
                  ${
                    isActive
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:bg-white/50"
                  }
                `}
              >
                <IconComponent size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-700">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h3>
          <span className="text-sm text-gray-500">
            {getTabCount(activeTab)} records
          </span>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

// Main Component
export default function FacultyMetrics() {
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [achievements, setAchievements] = useState(getDefaultAchievements());
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [achievementsLoading, setAchievementsLoading] = useState(false);

  // Fetch faculty list on mount
  useEffect(() => {
    const fetchFacultyList = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE}/api/admin/faculty-metrics/list`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFacultyList(data.faculty || []);
        } else {
          console.error("Failed to fetch faculty list");
          setFacultyList([]);
        }
      } catch (error) {
        console.error("Error fetching faculty list:", error);
        setFacultyList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFacultyList();
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    // Auto-select first faculty on desktop
    if (!isMobile && facultyList.length > 0 && !selectedFaculty) {
      handleFacultySelect(facultyList[0]);
    }
  }, [isMobile, facultyList]);

  const handleFacultySelect = async (faculty) => {
    setSelectedFaculty(faculty);
    setIsPanelOpen(false);

    // Fetch achievements for selected faculty from API
    try {
      setAchievementsLoading(true);
      const response = await fetch(
        `${API_BASE}/api/admin/faculty-metrics/achievements/${faculty.faculty_id}`,
        {credentials: "include"}
      );
      if (response.ok) {
        const data = await response.json();
        setAchievements(data.achievements || getDefaultAchievements());
      } else {
        console.error("Failed to fetch achievements");
        setAchievements(getDefaultAchievements());
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      setAchievements(getDefaultAchievements());
    } finally {
      setAchievementsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <Loader2
            size={48}
            className="mx-auto text-indigo-600 animate-spin mb-4"
          />
          <p className="text-gray-600 font-medium">Loading faculty data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden p-3 border-b border-gray-200 bg-white flex justify-between items-center sticky top-0 z-10">
        <div className="flex-1">
          <p className="font-medium text-gray-800 truncate">
            {selectedFaculty ? selectedFaculty.name : "Faculty Metrics"}
          </p>
        </div>
        <button
          onClick={() => setIsPanelOpen(true)}
          className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          aria-label="Search faculty"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Left Panel (Faculty List) */}
      <div
        className={`
          transition-transform duration-300 ease-in-out
          lg:w-72 xl:w-80 lg:border-r lg:border-gray-200
          ${isPanelOpen ? "block" : "hidden"}
          lg:block
          fixed inset-0 z-30 lg:static lg:z-auto
        `}
      >
        {/* Modal Backdrop for Mobile */}
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          onClick={() => setIsPanelOpen(false)}
        ></div>

        <div className="relative w-full max-w-sm lg:max-w-full h-full bg-white">
          <FacultyListPanel
            facultyList={facultyList}
            selectedFaculty={selectedFaculty}
            onFacultySelect={handleFacultySelect}
            onClose={() => setIsPanelOpen(false)}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </div>

      {/* Right Panel (Faculty Details) */}
      <div className="flex-1 overflow-hidden">
        <FacultyDetailPanel
          faculty={selectedFaculty}
          achievements={achievements}
          loading={achievementsLoading}
        />
      </div>
    </div>
  );
}
