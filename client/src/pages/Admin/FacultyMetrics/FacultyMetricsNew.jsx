import React, { useState, useEffect } from "react";
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
  Download,
  Building,
  Clock,
  Award,
  Globe,
  BookOpen,
  GraduationCap,
  Loader2,
  ExternalLink,
  MapPin,
} from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Tabs configuration
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

// Departments list
const departments = [
  "All",
  "CSE",
  "ECE",
  "EEE",
  "MECH",
  "CIVIL",
  "IT",
  "AIDS",
  "AIML",
  "MBA",
  "MCA",
];

// Get default achievements structure
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

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    approved: { bg: "bg-green-100", text: "text-green-700", label: "Approved" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
    rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
  };
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

// Remarks Box Component
const RemarksBox = ({ remarks }) => {
  if (!remarks) return null;
  return (
    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
      <span className="font-medium text-gray-600">Remarks: </span>
      <span className="text-gray-700">{remarks}</span>
    </div>
  );
};

// Faculty List Panel Component
const FacultyListPanel = ({
  facultyList,
  searchTerm,
  setSearchTerm,
  selectedDept,
  setSelectedDept,
  selectedFaculty,
  setSelectedFaculty,
  loading,
}) => {
  const filteredFaculty = facultyList.filter((faculty) => {
    const matchesSearch =
      faculty.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.faculty_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDept === "All" || faculty.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Faculty List
        </h2>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <UserX className="w-8 h-8 mb-2" />
            <p className="text-sm">No faculty found</p>
          </div>
        ) : (
          filteredFaculty.map((faculty) => (
            <div
              key={faculty.faculty_id}
              onClick={() => setSelectedFaculty(faculty)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedFaculty?.faculty_id === faculty.faculty_id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{faculty.name}</h3>
                  <p className="text-xs text-gray-500">{faculty.faculty_id}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {faculty.department}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {faculty.total_achievements || 0} items
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Card Components
const NewsletterCard = ({ item }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-800">
        {item.name_of_the_newsletter || item.newsletter_name || "Newsletter"}
      </h4>
      <StatusBadge status={item.status} />
    </div>
    <div className="space-y-1 text-sm text-gray-600">
      <p>
        <span className="font-medium">Publisher:</span>{" "}
        {item.publisher || "N/A"}
      </p>
      <p>
        <span className="font-medium">Published On:</span>{" "}
        {item.published_on || item.date || "N/A"}
      </p>
      <p>
        <span className="font-medium">Volume:</span> {item.volume_no || "N/A"}
      </p>
    </div>
    <RemarksBox remarks={item.remarks} />
  </div>
);

const EContentCard = ({ item }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-800">
        {item.module_name || item.title || "E-Content"}
      </h4>
      <StatusBadge status={item.status} />
    </div>
    <div className="space-y-1 text-sm text-gray-600">
      <p>
        <span className="font-medium">Platform:</span> {item.platform || "N/A"}
      </p>
      <p>
        <span className="font-medium">Document Type:</span>{" "}
        {item.document_type || "N/A"}
      </p>
      <p>
        <span className="font-medium">Date:</span>{" "}
        {item.date_of_launch || item.date || "N/A"}
      </p>
    </div>
    <RemarksBox remarks={item.remarks} />
  </div>
);

const EventsAttendedCard = ({ item }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-800">
        {item.event_name || item.title || "Event"}
      </h4>
      <StatusBadge status={item.status} />
    </div>
    <div className="space-y-1 text-sm text-gray-600">
      <p>
        <span className="font-medium">Type:</span> {item.event_type || "N/A"}
      </p>
      <p>
        <span className="font-medium">Organizer:</span>{" "}
        {item.organizer || item.organized_by || "N/A"}
      </p>
      <p>
        <span className="font-medium">Location:</span>{" "}
        {item.location || item.venue || "N/A"}
      </p>
      <p>
        <span className="font-medium">Date:</span>{" "}
        {item.from_date || item.date || "N/A"}{" "}
        {item.to_date ? `- ${item.to_date}` : ""}
      </p>
    </div>
    <RemarksBox remarks={item.remarks} />
  </div>
);

const EventsOrganizedCard = ({ item }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-800">
        {item.event_name || item.title || "Event"}
      </h4>
      <StatusBadge status={item.status} />
    </div>
    <div className="space-y-1 text-sm text-gray-600">
      <p>
        <span className="font-medium">Type:</span> {item.event_type || "N/A"}
      </p>
      <p>
        <span className="font-medium">Role:</span> {item.role || "N/A"}
      </p>
      <p>
        <span className="font-medium">Participants:</span>{" "}
        {item.no_of_participants || "N/A"}
      </p>
      <p>
        <span className="font-medium">Date:</span>{" "}
        {item.from_date || item.date || "N/A"}{" "}
        {item.to_date ? `- ${item.to_date}` : ""}
      </p>
    </div>
    <RemarksBox remarks={item.remarks} />
  </div>
);

const ExternalExaminerCard = ({ item }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-800">
        {item.institution_name || item.university || "Institution"}
      </h4>
      <StatusBadge status={item.status} />
    </div>
    <div className="space-y-1 text-sm text-gray-600">
      <p>
        <span className="font-medium">Exam Type:</span>{" "}
        {item.exam_type || item.type || "N/A"}
      </p>
      <p>
        <span className="font-medium">Subject:</span> {item.subject || "N/A"}
      </p>
      <p>
        <span className="font-medium">Date:</span>{" "}
        {item.exam_date || item.date || "N/A"}
      </p>
    </div>
    <RemarksBox remarks={item.remarks} />
  </div>
);

const JournalReviewerCard = ({ item }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-800">
        {item.journal_name || item.title || "Journal"}
      </h4>
      <StatusBadge status={item.status} />
    </div>
    <div className="space-y-1 text-sm text-gray-600">
      <p>
        <span className="font-medium">Publisher:</span>{" "}
        {item.publisher || "N/A"}
      </p>
      <p>
        <span className="font-medium">ISSN:</span> {item.issn || "N/A"}
      </p>
      <p>
        <span className="font-medium">Year:</span> {item.year || "N/A"}
      </p>
    </div>
    <RemarksBox remarks={item.remarks} />
  </div>
);

const GuestLectureCard = ({ item }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-800">
        {item.topic || item.title || "Guest Lecture"}
      </h4>
      <StatusBadge status={item.status} />
    </div>
    <div className="space-y-1 text-sm text-gray-600">
      <p>
        <span className="font-medium">Institution:</span>{" "}
        {item.institution || item.organization || "N/A"}
      </p>
      <p>
        <span className="font-medium">Audience:</span>{" "}
        {item.audience || item.target_audience || "N/A"}
      </p>
      <p>
        <span className="font-medium">Date:</span> {item.date || "N/A"}
      </p>
    </div>
    <RemarksBox remarks={item.remarks} />
  </div>
);

const InternationalVisitCard = ({ item }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-800">
        {item.institution_visited || item.place || "Visit"}
      </h4>
      <StatusBadge status={item.status} />
    </div>
    <div className="space-y-1 text-sm text-gray-600">
      <p>
        <span className="font-medium">Country:</span> {item.country || "N/A"}
      </p>
      <p>
        <span className="font-medium">Purpose:</span> {item.purpose || "N/A"}
      </p>
      <p>
        <span className="font-medium">Duration:</span> {item.from_date || "N/A"}{" "}
        {item.to_date ? `- ${item.to_date}` : ""}
      </p>
    </div>
    <RemarksBox remarks={item.remarks} />
  </div>
);

const AwardCard = ({ item }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-800">
        {item.award_name || item.title || "Award"}
      </h4>
      <StatusBadge status={item.status} />
    </div>
    <div className="space-y-1 text-sm text-gray-600">
      <p>
        <span className="font-medium">Category:</span> {item.category || "N/A"}
      </p>
      <p>
        <span className="font-medium">Awarded By:</span>{" "}
        {item.awarding_body || item.awarded_by || "N/A"}
      </p>
      <p>
        <span className="font-medium">Date:</span>{" "}
        {item.date || item.year || "N/A"}
      </p>
    </div>
    <RemarksBox remarks={item.remarks} />
  </div>
);

const OnlineCourseCard = ({ item }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-800">
        {item.course_name || item.title || "Course"}
      </h4>
      <StatusBadge status={item.status} />
    </div>
    <div className="space-y-1 text-sm text-gray-600">
      <p>
        <span className="font-medium">Platform:</span> {item.platform || "N/A"}
      </p>
      <p>
        <span className="font-medium">Duration:</span> {item.duration || "N/A"}
      </p>
      <p>
        <span className="font-medium">Completed:</span>{" "}
        {item.completion_date || item.date || "N/A"}
      </p>
    </div>
    <RemarksBox remarks={item.remarks} />
  </div>
);

const PaperPresentationCard = ({ item }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-800">
        {item.paper_title || item.title || "Paper"}
      </h4>
      <StatusBadge status={item.status} />
    </div>
    <div className="space-y-1 text-sm text-gray-600">
      <p>
        <span className="font-medium">Conference:</span>{" "}
        {item.conference_name || item.venue || "N/A"}
      </p>
      <p>
        <span className="font-medium">Location:</span> {item.location || "N/A"}
      </p>
      <p>
        <span className="font-medium">Date:</span> {item.date || "N/A"}
      </p>
    </div>
    <RemarksBox remarks={item.remarks} />
  </div>
);

const ResourcePersonCard = ({ item }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-800">
        {item.event_name || item.program || "Program"}
      </h4>
      <StatusBadge status={item.status} />
    </div>
    <div className="space-y-1 text-sm text-gray-600">
      <p>
        <span className="font-medium">Topic:</span> {item.topic || "N/A"}
      </p>
      <p>
        <span className="font-medium">Organizer:</span>{" "}
        {item.organizer || item.organized_by || "N/A"}
      </p>
      <p>
        <span className="font-medium">Date:</span> {item.date || "N/A"}
      </p>
    </div>
    <RemarksBox remarks={item.remarks} />
  </div>
);

// Empty State Component
const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-48 text-gray-500">
    <FileText className="w-12 h-12 mb-3 text-gray-300" />
    <p className="text-sm">{message}</p>
  </div>
);

// Faculty Detail Panel Component
const FacultyDetailPanel = ({
  selectedFaculty,
  achievements,
  activeTab,
  setActiveTab,
  loading,
}) => {
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      );
    }

    const contentMap = {
      newsletter: {
        data: achievements.newsletterArchive,
        Card: NewsletterCard,
      },
      econtent: { data: achievements.eContentDeveloped, Card: EContentCard },
      eventsAttended: {
        data: achievements.eventsAttended,
        Card: EventsAttendedCard,
      },
      eventsOrganized: {
        data: achievements.eventsOrganized,
        Card: EventsOrganizedCard,
      },
      examiner: {
        data: achievements.externalExaminer,
        Card: ExternalExaminerCard,
      },
      reviewer: {
        data: achievements.journalReviewer,
        Card: JournalReviewerCard,
      },
      guestLecture: {
        data: achievements.guestLectures,
        Card: GuestLectureCard,
      },
      internationalVisit: {
        data: achievements.internationalVisits,
        Card: InternationalVisitCard,
      },
      awards: { data: achievements.notableAchievements, Card: AwardCard },
      onlineCourse: {
        data: achievements.onlineCourses,
        Card: OnlineCourseCard,
      },
      papers: {
        data: achievements.paperPresentations,
        Card: PaperPresentationCard,
      },
      resourcePerson: {
        data: achievements.resourcePerson,
        Card: ResourcePersonCard,
      },
    };

    const { data, Card } = contentMap[activeTab] || { data: [], Card: null };

    if (!data || data.length === 0) {
      return <EmptyState message="No records found for this category" />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <Card key={item.id || index} item={item} />
        ))}
      </div>
    );
  };

  if (!selectedFaculty) {
    return (
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium">Select a Faculty Member</h3>
          <p className="text-sm">
            Choose a faculty from the list to view their achievements
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Faculty Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {selectedFaculty.name}
            </h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {selectedFaculty.department}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                {selectedFaculty.designation || "Faculty"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{selectedFaculty.email}</p>
            <p className="text-xs text-gray-400">
              {selectedFaculty.faculty_id}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">{renderTabContent()}</div>
    </div>
  );
};

// Main Component
const FacultyMetrics = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [achievements, setAchievements] = useState(getDefaultAchievements());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [activeTab, setActiveTab] = useState("newsletter");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingAchievements, setLoadingAchievements] = useState(false);

  // Fetch faculty list
  const fetchFacultyList = async () => {
    setLoadingList(true);
    try {
      const response = await axios.get(
        `${API_URL}api/admin/faculty-metrics/list`,
        {
          withCredentials: true,
        }
      );
      if (response.data && response.data.facultyList) {
        setFacultyList(response.data.facultyList);
      }
    } catch (error) {
      console.error("Error fetching faculty list:", error);
    } finally {
      setLoadingList(false);
    }
  };

  // Fetch faculty achievements
  const fetchFacultyAchievements = async (facultyId) => {
    setLoadingAchievements(true);
    try {
      const response = await axios.get(
        `${API_URL}api/admin/faculty-metrics/${facultyId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data && response.data.achievements) {
        setAchievements({
          newsletterArchive: response.data.achievements.newsletterArchive || [],
          eContentDeveloped: response.data.achievements.eContentDeveloped || [],
          eventsAttended: response.data.achievements.eventsAttended || [],
          eventsOrganized: response.data.achievements.eventsOrganized || [],
          externalExaminer: response.data.achievements.externalExaminer || [],
          journalReviewer: response.data.achievements.journalReviewer || [],
          guestLectures: response.data.achievements.guestLectures || [],
          internationalVisits:
            response.data.achievements.internationalVisits || [],
          notableAchievements:
            response.data.achievements.notableAchievements || [],
          onlineCourses: response.data.achievements.onlineCourses || [],
          paperPresentations:
            response.data.achievements.paperPresentations || [],
          resourcePerson: response.data.achievements.resourcePerson || [],
        });
      }
    } catch (error) {
      console.error("Error fetching faculty achievements:", error);
      setAchievements(getDefaultAchievements());
    } finally {
      setLoadingAchievements(false);
    }
  };

  // Load faculty list on mount
  useEffect(() => {
    fetchFacultyList();
  }, []);

  // Load achievements when faculty is selected
  useEffect(() => {
    if (selectedFaculty) {
      fetchFacultyAchievements(selectedFaculty.faculty_id);
    } else {
      setAchievements(getDefaultAchievements());
    }
  }, [selectedFaculty]);

  return (
    <div className="h-screen bg-gray-100 p-4 flex gap-4">
      <FacultyListPanel
        facultyList={facultyList}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        selectedFaculty={selectedFaculty}
        setSelectedFaculty={setSelectedFaculty}
        loading={loadingList}
      />
      <FacultyDetailPanel
        selectedFaculty={selectedFaculty}
        achievements={achievements}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loading={loadingAchievements}
      />
    </div>
  );
};

export default FacultyMetrics;
