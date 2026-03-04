import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Trophy,
  Award,
  Briefcase,
  BookOpen,
  Users,
  Calendar,
  ExternalLink,
  Search,
  TrendingUp,
  FileText,
  Clock,
  MapPin,
  Building,
  GraduationCap,
  Download,
  Plus,
  Loader2,
  Globe,
  Mic,
  Newspaper,
  Monitor,
  ClipboardCheck,
  UserCheck,
  Plane,
  Star,
  Video,
  PenTool,
} from "lucide-react";
import useAuth from "../../../store/UseAuth";
const API_URL = import.meta.env.VITE_API_URL;

// Helper component for status badge
const StatusBadge = ({ status }) => {
  const statusLower = (status || "pending").toLowerCase();
  const statusConfig = {
    verified: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      label: "Verified",
    },
    approved: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      label: "Approved",
    },
    rejected: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "Rejected",
    },
    pending: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      label: "Pending",
    },
  };
  const config = statusConfig[statusLower] || statusConfig.pending;
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {config.label}
    </span>
  );
};

// Helper component for remarks
const RemarksBox = ({ remarks }) => {
  if (!remarks) return null;
  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-xs text-gray-500 font-medium mb-1">Admin Remarks:</p>
      <p className="text-sm text-gray-700">{remarks}</p>
    </div>
  );
};

const FacultyAchievements = () => {
  const [activeTab, setActiveTab] = useState("newsletter");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState({
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

  const { user, rollno } = useAuth();

  // Mock data for demonstration - replace with actual API calls
  const mockAchievements = {
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
  };
  const fetchNewsletters = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/faculty/newsLetterFormsGet`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.newsletters || [];
    } catch (error) {
      console.error("Error fetching newsletters:", error);
      return [];
    }
  };

  const fetchEContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/faculty/eContentGet`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.eContent || [];
    } catch (error) {
      console.error("Error fetching E-Content:", error);
      return [];
    }
  };

  const fetchEventsAttended = async () => {
    try {
      const response = await fetch(`${API_URL}/api/faculty/eventsAttendedGet`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.eventsAttended || [];
    } catch (error) {
      console.error("Error fetching Events Attended:", error);
      return [];
    }
  };

  const fetchEventsOrganized = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/faculty/eventsOrganizedGet`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.eventsOrganized || [];
    } catch (error) {
      console.error("Error fetching Events Organized:", error);
      return [];
    }
  };

  const fetchExternalExaminer = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/faculty/externalExaminerGet`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.externalExaminer || [];
    } catch (error) {
      console.error("Error fetching External Examiner:", error);
      return [];
    }
  };

  const fetchJournalReviewer = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/faculty/journalReviewerGet`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.journalReviewer || [];
    } catch (error) {
      console.error("Error fetching Journal Reviewer:", error);
      return [];
    }
  };

  const fetchGuestLectures = async () => {
    try {
      const response = await fetch(`${API_URL}/api/faculty/guestLectureGet`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.guestLecture || [];
    } catch (error) {
      console.error("Error fetching Guest Lectures:", error);
      return [];
    }
  };

  const fetchInternationalVisits = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/faculty/internationalVisitGet`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.internationalVisit || [];
    } catch (error) {
      console.error("Error fetching International Visits:", error);
      return [];
    }
  };

  const fetchAwards = async () => {
    try {
      const response = await fetch(`${API_URL}/api/faculty/awardGet`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.awards || [];
    } catch (error) {
      console.error("Error fetching Awards:", error);
      return [];
    }
  };

  const fetchOnlineCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/faculty/onlineCourseGet`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.onlineCourses || [];
    } catch (error) {
      console.error("Error fetching Online Courses:", error);
      return [];
    }
  };

  const fetchPaperPresentations = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/faculty/paperPresentationGet`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.paperPresentations || [];
    } catch (error) {
      console.error("Error fetching Paper Presentations:", error);
      return [];
    }
  };

  const fetchResourcePerson = async () => {
    try {
      const response = await fetch(`${API_URL}/api/faculty/resourcePersonGet`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.resourcePerson || [];
    } catch (error) {
      console.error("Error fetching Resource Person:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [
          newsletters,
          eContent,
          eventsAttended,
          eventsOrganized,
          externalExaminer,
          journalReviewer,
          guestLectures,
          internationalVisits,
          awards,
          onlineCourses,
          paperPresentations,
          resourcePerson,
        ] = await Promise.all([
          fetchNewsletters(),
          fetchEContent(),
          fetchEventsAttended(),
          fetchEventsOrganized(),
          fetchExternalExaminer(),
          fetchJournalReviewer(),
          fetchGuestLectures(),
          fetchInternationalVisits(),
          fetchAwards(),
          fetchOnlineCourses(),
          fetchPaperPresentations(),
          fetchResourcePerson(),
        ]);

        setAchievements({
          newsletterArchive: newsletters,
          eContentDeveloped: eContent,
          eventsAttended: eventsAttended,
          eventsOrganized: eventsOrganized,
          externalExaminer: externalExaminer,
          journalReviewer: journalReviewer,
          guestLectures: guestLectures,
          internationalVisits: internationalVisits,
          notableAchievements: awards,
          onlineCourses: onlineCourses,
          paperPresentations: paperPresentations,
          resourcePerson: resourcePerson,
        });
      } catch (error) {
        console.error("Error loading data:", error);
      }
      setLoading(false);
    };
    loadData();
  }, [rollno]);

  const tabs = [
    { id: "newsletter", label: "Newsletter", icon: Newspaper },
    { id: "econtent", label: "E-Content", icon: Monitor },
    { id: "eventsAttended", label: "Events Attended", icon: Users },
    { id: "eventsOrganized", label: "Events Organized", icon: Calendar },
    { id: "examiner", label: "External Examiner", icon: ClipboardCheck },
    { id: "reviewer", label: "Journal Reviewer", icon: PenTool },
    { id: "guestLecture", label: "Guest Lectures", icon: Mic },
    { id: "internationalVisit", label: "Int'l Visits", icon: Plane },
    { id: "awards", label: "Awards", icon: Trophy },
    { id: "onlineCourse", label: "Online Courses", icon: Video },
    { id: "papers", label: "Papers", icon: FileText },
    { id: "resourcePerson", label: "Resource Person", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Faculty Achievements
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Track your professional accomplishments and contributions
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => {
                  const routeMap = {
                    newsletter: "/faculty/achievements/newsletter",
                    econtent: "/faculty/achievements/e-content",
                    eventsAttended: "/faculty/achievements/events-attended",
                    eventsOrganized: "/faculty/achievements/events-organized",
                    examiner: "/faculty/achievements/external-examiner",
                    reviewer: "/faculty/achievements/journal-reviewer",
                    guestLecture: "/faculty/achievements/guest-lectures",
                    internationalVisit:
                      "/faculty/achievements/international-visits",
                    awards: "/faculty/achievements/awards",
                    onlineCourse: "/faculty/achievements/online-courses",
                    papers: "/faculty/achievements/papers",
                    resourcePerson: "/faculty/achievements/resource-person",
                  };
                  if (routeMap[activeTab]) {
                    navigate(routeMap[activeTab]);
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center sm:justify-start"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Achievement
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center sm:justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Scrollable */}
        <div className="mb-8">
          <nav className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex cursor-pointer items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-1.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Recent Activity Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Papers
                </h3>
                <div className="space-y-4">
                  {achievements.paperPresentations.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No paper presentations yet
                    </p>
                  ) : (
                    achievements.paperPresentations
                      .slice(0, 3)
                      .map((paper, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {paper.paper_title || "Untitled Paper"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {paper.conference_name} •{" "}
                              {paper.event_start_date &&
                                new Date(
                                  paper.event_start_date,
                                ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Awards
                </h3>
                <div className="space-y-4">
                  {achievements.notableAchievements
                    .slice(0, 3)
                    .map((award, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-4 mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {award.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {award.awardedBy} •{" "}
                            {new Date(award.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Archive Tab */}
        {activeTab === "newsletter" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Newsletter Archive
              </h2>
              {loading && <Loader2 className="animate-spin text-blue-600" />}
            </div>

            {achievements.newsletterArchive.length === 0 && !loading ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                <Newspaper className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No newsletter records found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {achievements.newsletterArchive.map((newsletter) => (
                  <div
                    key={newsletter.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {newsletter.department
                            ? `${newsletter.department} Department Newsletter`
                            : "Institution Newsletter"}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          Vol. {newsletter.volume_number}, Issue{" "}
                          {newsletter.issue_number} ({newsletter.issue_month})
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                          {newsletter.newsletter_category.replace(/-/g, " ")}
                        </span>
                        <StatusBadge status={newsletter.status} />
                      </div>
                    </div>
                    {newsletter.academic_year && (
                      <p className="text-gray-600 text-sm mb-2">
                        <strong>Academic Year:</strong>{" "}
                        {newsletter.academic_year}
                      </p>
                    )}
                    <div className="text-gray-500 text-sm mb-4 space-y-1">
                      {newsletter.faculty_editor_count && (
                        <p>
                          Faculty Editors: {newsletter.faculty_editor_count}
                        </p>
                      )}
                      {newsletter.student_editor_count && (
                        <p>
                          Student Editors: {newsletter.student_editor_count}
                        </p>
                      )}
                    </div>
                    <RemarksBox remarks={newsletter.remarks} />
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                      <span className="text-sm text-gray-500">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Published:{" "}
                        {new Date(
                          newsletter.date_of_publication,
                        ).toLocaleDateString()}
                      </span>
                      {newsletter.proof_document && (
                        <a
                          href={`${API_URL}${newsletter.proof_document}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                        >
                          <Download className="h-4 w-4 mr-1" /> View/Download
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* E-Content Developed Tab */}
        {activeTab === "econtent" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                E-Content Developed
              </h2>
              {loading && <Loader2 className="animate-spin text-blue-600" />}
            </div>

            {achievements.eContentDeveloped.length === 0 && !loading ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                <Monitor className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No E-Content records found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {achievements.eContentDeveloped.map((content) => (
                  <div
                    key={content.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {content.topic_name || "Untitled Topic"}
                        </h3>
                        {content.publisher_name && (
                          <p className="text-blue-600 font-medium text-sm">
                            {content.publisher_name}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                          {content.e_content_type}
                        </span>
                        <StatusBadge status={content.status} />
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p>
                        <strong>Claimed For:</strong> {content.claimed_for}
                      </p>
                      {content.task_id && (
                        <p>
                          <strong>Task ID:</strong> {content.task_id}
                        </p>
                      )}
                      {content.url_of_content && (
                        <p className="truncate flex items-center">
                          <strong>URL:</strong>
                          <a
                            href={content.url_of_content}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-1 text-indigo-600 hover:underline flex items-center"
                          >
                            Link <ExternalLink className="h-3 w-3 ml-0.5" />
                          </a>
                        </p>
                      )}
                    </div>
                    <RemarksBox remarks={content.remarks} />
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500 mt-4">
                      <span>
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {content.date_of_publication
                          ? new Date(
                              content.date_of_publication,
                            ).toLocaleDateString()
                          : "Date N/A"}
                      </span>
                      {content.proof_document && (
                        <a
                          href={`${API_URL}${content.proof_document}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                        >
                          <Download className="h-4 w-4 mr-1" /> View/Download
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Events Attended Tab */}
        {activeTab === "eventsAttended" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Events Attended
              </h2>
              {loading && <Loader2 className="animate-spin text-blue-600" />}
            </div>
            {achievements.eventsAttended.length === 0 && !loading ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No events attended records found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {achievements.eventsAttended.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {event.event_title ||
                            event.eventName ||
                            "Untitled Event"}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {event.event_organizer || event.organizer}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {event.event_type ||
                            event.participationType ||
                            "Event"}
                        </span>
                        <StatusBadge status={event.status} />
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.start_date
                          ? new Date(event.start_date).toLocaleDateString()
                          : "N/A"}{" "}
                        -{" "}
                        {event.end_date
                          ? new Date(event.end_date).toLocaleDateString()
                          : "N/A"}
                      </div>
                      {event.event_level && (
                        <p>
                          <strong>Level:</strong> {event.event_level}
                        </p>
                      )}
                      {event.event_mode && (
                        <p>
                          <strong>Mode:</strong> {event.event_mode}
                        </p>
                      )}
                      {event.outcome && (
                        <p>
                          <strong>Outcome:</strong> {event.outcome}
                        </p>
                      )}
                    </div>
                    <RemarksBox remarks={event.remarks} />
                    {(event.certificate_proof || event.geotag_photos) && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                        {event.certificate_proof && (
                          <a
                            href={`${API_URL}${event.certificate_proof}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            <Download className="h-4 w-4 mr-1" /> Certificate
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Events Organized Tab */}
        {activeTab === "eventsOrganized" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Events Organized
              </h2>
              {loading && <Loader2 className="animate-spin text-blue-600" />}
            </div>
            {achievements.eventsOrganized.length === 0 && !loading ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No events organized records found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {achievements.eventsOrganized.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {event.event_name ||
                            event.eventName ||
                            "Untitled Event"}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {event.program_type || event.eventType}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {event.event_type || "Event"}
                        </span>
                        <StatusBadge status={event.status} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium">
                          {event.start_date
                            ? new Date(event.start_date).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Level</p>
                        <p className="font-medium">
                          {event.event_level || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Mode</p>
                        <p className="font-medium">
                          {event.event_mode || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p className="font-medium">
                          {event.event_duration || "N/A"} days
                        </p>
                      </div>
                    </div>
                    {(event.internal_students_count ||
                      event.external_students_count) && (
                      <div className="mt-4 text-sm text-gray-600">
                        <p>
                          <strong>Internal Students:</strong>{" "}
                          {event.internal_students_count || 0} |{" "}
                          <strong>External:</strong>{" "}
                          {event.external_students_count || 0}
                        </p>
                      </div>
                    )}
                    <RemarksBox remarks={event.remarks} />
                    {event.proof_file && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={`${API_URL}${event.proof_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" /> View Proof
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* External Examiner Tab */}
        {activeTab === "examiner" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                External Examiner
              </h2>
              {loading && <Loader2 className="animate-spin text-blue-600" />}
            </div>
            {achievements.externalExaminer.length === 0 && !loading ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                <ClipboardCheck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No external examiner records found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {achievements.externalExaminer.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {exam.college_name ||
                            exam.institution ||
                            "Institution"}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {exam.purpose_of_visit || exam.examType}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          External Examiner
                        </span>
                        <StatusBadge status={exam.status} />
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {exam.institute_address && (
                        <p>
                          <strong>Address:</strong> {exam.institute_address}
                        </p>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {exam.from_date
                          ? new Date(exam.from_date).toLocaleDateString()
                          : "N/A"}{" "}
                        -{" "}
                        {exam.to_date
                          ? new Date(exam.to_date).toLocaleDateString()
                          : "N/A"}
                      </div>
                      {exam.number_of_days && (
                        <p>
                          <strong>Duration:</strong> {exam.number_of_days} days
                        </p>
                      )}
                    </div>
                    <RemarksBox remarks={exam.remarks} />
                    {exam.document_proof && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={`${API_URL}${exam.document_proof}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" /> View Document
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Journal Reviewer Tab */}
        {activeTab === "reviewer" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Faculty Journal Reviewer
              </h2>
              {loading && <Loader2 className="animate-spin text-blue-600" />}
            </div>
            {achievements.journalReviewer.length === 0 && !loading ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                <PenTool className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No journal reviewer records found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {achievements.journalReviewer.map((journal) => (
                  <div
                    key={journal.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {journal.journal_name ||
                            journal.journalName ||
                            "Journal"}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {journal.journal_indexing || journal.publisher}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {journal.recognition_type || "Reviewer"}
                        </span>
                        <StatusBadge status={journal.status} />
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {journal.issn_no && (
                        <p>
                          <strong>ISSN:</strong> {journal.issn_no}
                        </p>
                      )}
                      {journal.impact_factor && (
                        <p>
                          <strong>Impact Factor:</strong>{" "}
                          {journal.impact_factor}
                        </p>
                      )}
                      {journal.number_of_papers_reviewed && (
                        <p>
                          <strong>Papers Reviewed:</strong>{" "}
                          {journal.number_of_papers_reviewed}
                        </p>
                      )}
                      {journal.review_date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(journal.review_date).toLocaleDateString()}
                        </div>
                      )}
                      {journal.journal_homepage_url && (
                        <a
                          href={journal.journal_homepage_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline flex items-center"
                        >
                          Journal Homepage{" "}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </div>
                    <RemarksBox remarks={journal.remarks} />
                    {journal.document_proof && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={`${API_URL}${journal.document_proof}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" /> View Document
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Guest Lectures Tab */}
        {activeTab === "guestLecture" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Guest Lectures Delivered
              </h2>
              {loading && <Loader2 className="animate-spin text-blue-600" />}
            </div>
            {achievements.guestLectures.length === 0 && !loading ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                <Mic className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No guest lecture records found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {achievements.guestLectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {lecture.event_name ||
                            lecture.topic ||
                            "Untitled Lecture"}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {lecture.organization_name || lecture.institution}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {lecture.event_type ||
                            lecture.mode_of_conduct ||
                            "Lecture"}
                        </span>
                        <StatusBadge status={lecture.status} />
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {lecture.topic && (
                        <p>
                          <strong>Topic:</strong> {lecture.topic}
                        </p>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {lecture.from_date
                          ? new Date(lecture.from_date).toLocaleDateString()
                          : "N/A"}{" "}
                        -{" "}
                        {lecture.to_date
                          ? new Date(lecture.to_date).toLocaleDateString()
                          : "N/A"}
                      </div>
                      {lecture.number_of_participants && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          {lecture.number_of_participants} participants
                        </div>
                      )}
                      {lecture.type_of_audience && (
                        <p>
                          <strong>Audience:</strong> {lecture.type_of_audience}
                        </p>
                      )}
                      {lecture.event_level && (
                        <p>
                          <strong>Level:</strong> {lecture.event_level}
                        </p>
                      )}
                    </div>
                    <RemarksBox remarks={lecture.remarks} />
                    {(lecture.apex_proof || lecture.sample_photographs) && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                        {lecture.apex_proof && (
                          <a
                            href={`${API_URL}${lecture.apex_proof}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            <Download className="h-4 w-4 mr-1" /> APEX Proof
                          </a>
                        )}
                        {lecture.sample_photographs && (
                          <a
                            href={`${API_URL}${lecture.sample_photographs}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            <Download className="h-4 w-4 mr-1" /> Photos
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* International Visits Tab */}
        {activeTab === "internationalVisit" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                International Visits
              </h2>
              {loading && <Loader2 className="animate-spin text-blue-600" />}
            </div>
            {achievements.internationalVisits.length === 0 && !loading ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                <Plane className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No international visit records found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {achievements.internationalVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {visit.country_visited ||
                            visit.country ||
                            "International Visit"}
                        </h3>
                        <p className="text-blue-600 font-medium flex items-center">
                          <Globe className="h-4 w-4 mr-1" />{" "}
                          {visit.purpose_of_visit || visit.purpose}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {visit.fund_type || "Visit"}
                        </span>
                        <StatusBadge status={visit.status} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p className="font-medium">
                          {visit.number_of_days || visit.duration} days
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Period</p>
                        <p className="font-medium">
                          {visit.from_date
                            ? new Date(visit.from_date).toLocaleDateString()
                            : "N/A"}{" "}
                          -{" "}
                          {visit.to_date
                            ? new Date(visit.to_date).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <RemarksBox remarks={visit.remarks} />
                    {visit.document_proof && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={`${API_URL}${visit.document_proof}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" /> View Document
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notable Achievements/Awards Tab */}
        {activeTab === "awards" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Notable Achievements & Awards
              </h2>
              {loading && <Loader2 className="animate-spin text-blue-600" />}
            </div>
            {achievements.notableAchievements.length === 0 && !loading ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No awards records found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {achievements.notableAchievements.map((award) => (
                  <div
                    key={award.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                      <div className="flex items-start">
                        <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                          <Trophy className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {award.award_name || award.title || "Award"}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {award.awarding_agency || award.awardedBy}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          {award.type_of_recognition ||
                            award.category ||
                            "Award"}
                        </span>
                        <StatusBadge status={award.status} />
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {award.technical_society && (
                        <p>
                          <strong>Technical Society:</strong>{" "}
                          {award.technical_society}
                        </p>
                      )}
                      {award.level && (
                        <p>
                          <strong>Level:</strong> {award.level}
                        </p>
                      )}
                      {award.organization_type && (
                        <p>
                          <strong>Organization Type:</strong>{" "}
                          {award.organization_type}
                        </p>
                      )}
                      {award.nature_of_recognition && (
                        <p>
                          <strong>Nature:</strong> {award.nature_of_recognition}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm mt-4">
                      <span className="text-gray-500">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {award.received_date
                          ? new Date(award.received_date).toLocaleDateString()
                          : award.date
                            ? new Date(award.date).toLocaleDateString()
                            : "N/A"}
                      </span>
                    </div>
                    <RemarksBox remarks={award.remarks} />
                    {award.photo_proofs && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={`${API_URL}${award.photo_proofs}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" /> View Proof
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Online Courses Tab */}
        {activeTab === "onlineCourse" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Online Courses Completed
              </h2>
              {loading && <Loader2 className="animate-spin text-blue-600" />}
            </div>
            {achievements.onlineCourses.length === 0 && !loading ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                <Video className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No online course records found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {achievements.onlineCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {course.course_name ||
                            course.courseName ||
                            "Untitled Course"}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {course.organization_name || course.platform}{" "}
                          {course.provider ? `• ${course.provider}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {course.grade_obtained || course.grade || "Completed"}
                        </span>
                        <StatusBadge status={course.status} />
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {course.mode_of_course && (
                        <p>
                          <strong>Mode:</strong> {course.mode_of_course}
                        </p>
                      )}
                      {course.type_of_organizer && (
                        <p>
                          <strong>Organizer Type:</strong>{" "}
                          {course.type_of_organizer}
                        </p>
                      )}
                      {course.level_of_event && (
                        <p>
                          <strong>Level:</strong> {course.level_of_event}
                        </p>
                      )}
                      {course.duration && (
                        <p>
                          <strong>Duration:</strong> {course.duration}
                        </p>
                      )}
                      {course.course_category && (
                        <p>
                          <strong>Category:</strong> {course.course_category}
                        </p>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {course.start_date
                          ? new Date(course.start_date).toLocaleDateString()
                          : "N/A"}{" "}
                        -{" "}
                        {course.end_date
                          ? new Date(course.end_date).toLocaleDateString()
                          : "N/A"}
                      </div>
                      {course.outcome && (
                        <p>
                          <strong>Outcome:</strong> {course.outcome}
                        </p>
                      )}
                    </div>
                    <RemarksBox remarks={course.remarks} />
                    {course.certificate_file && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={`${API_URL}${course.certificate_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" /> View Certificate
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Paper Presentations Tab */}
        {activeTab === "papers" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Paper Presentations
              </h2>
              {loading && <Loader2 className="animate-spin text-blue-600" />}
            </div>
            {achievements.paperPresentations.length === 0 && !loading ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No paper presentation records found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {achievements.paperPresentations.map((paper) => (
                  <div
                    key={paper.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {paper.paper_title || paper.title || "Untitled Paper"}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {paper.conference_name || paper.conference}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {paper.event_level || "Paper"}
                        </span>
                        <StatusBadge status={paper.status} />
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {paper.event_organizer && (
                        <p>
                          <strong>Organizer:</strong> {paper.event_organizer}
                        </p>
                      )}
                      {paper.event_mode && (
                        <p>
                          <strong>Mode:</strong> {paper.event_mode}
                        </p>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {paper.event_start_date
                          ? new Date(
                              paper.event_start_date,
                            ).toLocaleDateString()
                          : "N/A"}{" "}
                        -{" "}
                        {paper.event_end_date
                          ? new Date(paper.event_end_date).toLocaleDateString()
                          : "N/A"}
                      </div>
                      {paper.event_duration_days && (
                        <p>
                          <strong>Duration:</strong> {paper.event_duration_days}{" "}
                          days
                        </p>
                      )}
                      {paper.published_in_proceedings && (
                        <p>
                          <strong>Published in Proceedings:</strong>{" "}
                          {paper.published_in_proceedings}
                        </p>
                      )}
                      {paper.type_of_sponsorship && (
                        <p>
                          <strong>Sponsorship:</strong>{" "}
                          {paper.type_of_sponsorship}
                        </p>
                      )}
                      {paper.students_involved && (
                        <p>
                          <strong>Students Involved:</strong>{" "}
                          {paper.students_involved}
                        </p>
                      )}
                    </div>
                    <RemarksBox remarks={paper.remarks} />
                    {paper.document_proof && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={`${API_URL}${paper.document_proof}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" /> View Document
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resource Person Tab */}
        {activeTab === "resourcePerson" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Resource Person
              </h2>
              {loading && <Loader2 className="animate-spin text-blue-600" />}
            </div>
            {achievements.resourcePerson.length === 0 && !loading ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
                <UserCheck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No resource person records found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {achievements.resourcePerson.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {resource.resource_person_category ||
                            resource.eventName ||
                            "Resource Person"}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {resource.organisation_name_and_address ||
                            resource.organizer}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {resource.type_of_organisation ||
                            resource.type ||
                            "Resource Person"}
                        </span>
                        <StatusBadge status={resource.status} />
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {resource.from_date
                          ? new Date(resource.from_date).toLocaleDateString()
                          : "N/A"}{" "}
                        -{" "}
                        {resource.to_date
                          ? new Date(resource.to_date).toLocaleDateString()
                          : "N/A"}
                      </div>
                      {resource.number_of_days && (
                        <p>
                          <strong>Duration:</strong> {resource.number_of_days}{" "}
                          days
                        </p>
                      )}
                    </div>
                    <RemarksBox remarks={resource.remarks} />
                    {resource.document_proof && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={`${API_URL}${resource.document_proof}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" /> View Document
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyAchievements;
