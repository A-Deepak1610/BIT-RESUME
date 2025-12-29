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
  Download,
  ExternalLink,
  Building,
  MapPin,
  Clock,
  Award,
  Globe,
  BookOpen,
  GraduationCap,
} from "lucide-react";

// Dummy faculty data
const dummyFacultyList = [
  {
    faculty_id: "FAC001",
    name: "Dr. John Smith",
    department: "CSE",
    designation: "Professor",
    email: "john.smith@bit.edu",
    total_achievements: 45,
  },
  {
    faculty_id: "FAC002",
    name: "Dr. Sarah Johnson",
    department: "CSE",
    designation: "Associate Professor",
    email: "sarah.johnson@bit.edu",
    total_achievements: 38,
  },
  {
    faculty_id: "FAC003",
    name: "Prof. Michael Brown",
    department: "ECE",
    designation: "Professor",
    email: "michael.brown@bit.edu",
    total_achievements: 52,
  },
  {
    faculty_id: "FAC004",
    name: "Dr. Emily Davis",
    department: "IT",
    designation: "Assistant Professor",
    email: "emily.davis@bit.edu",
    total_achievements: 28,
  },
  {
    faculty_id: "FAC005",
    name: "Prof. Robert Wilson",
    department: "MECH",
    designation: "Professor",
    email: "robert.wilson@bit.edu",
    total_achievements: 41,
  },
  {
    faculty_id: "FAC006",
    name: "Dr. Jennifer Martinez",
    department: "EEE",
    designation: "Associate Professor",
    email: "jennifer.martinez@bit.edu",
    total_achievements: 35,
  },
  {
    faculty_id: "FAC007",
    name: "Dr. David Lee",
    department: "CIVIL",
    designation: "Professor",
    email: "david.lee@bit.edu",
    total_achievements: 47,
  },
  {
    faculty_id: "FAC008",
    name: "Prof. Amanda White",
    department: "AIDS",
    designation: "Assistant Professor",
    email: "amanda.white@bit.edu",
    total_achievements: 22,
  },
];

// Dummy achievements data for each faculty
const dummyAchievementsData = {
  FAC001: {
    newsletterArchive: [
      {
        id: 1,
        title: "Department Newsletter - Spring 2024",
        publishDate: "2024-03-15",
        edition: "Vol. 5, Issue 1",
        description:
          "Featured article on AI in Education and department achievements",
        category: "Department",
      },
      {
        id: 2,
        title: "Research Highlights Newsletter",
        publishDate: "2024-01-10",
        edition: "Vol. 4, Issue 4",
        description: "Summary of faculty research publications and grants",
        category: "Research",
      },
    ],
    eContentDeveloped: [
      {
        id: 1,
        title: "Machine Learning Fundamentals",
        type: "Video Course",
        platform: "NPTEL/Swayam",
        duration: "12 weeks",
        developedDate: "2024-02-01",
        status: "Published",
        viewCount: 15000,
        description:
          "Comprehensive course covering ML algorithms and applications",
      },
      {
        id: 2,
        title: "Data Structures E-Book",
        type: "E-Book",
        platform: "College LMS",
        developedDate: "2023-08-15",
        status: "Published",
        downloads: 5000,
        description:
          "Interactive e-book with coding exercises and visualizations",
      },
    ],
    eventsAttended: [
      {
        id: 1,
        eventName: "IEEE International Conference on AI",
        organizer: "IEEE Computer Society",
        startDate: "2024-03-10",
        endDate: "2024-03-12",
        location: "Singapore",
        participationType: "Delegate",
        topics: ["Deep Learning", "Computer Vision", "NLP"],
      },
      {
        id: 2,
        eventName: "National Workshop on Blockchain",
        organizer: "IIT Madras",
        startDate: "2024-01-20",
        endDate: "2024-01-22",
        location: "Chennai",
        participationType: "Participant",
        topics: ["Smart Contracts", "DeFi", "Web3"],
      },
    ],
    eventsOrganized: [
      {
        id: 1,
        eventName: "National Level Technical Symposium - TechFusion 2024",
        eventType: "Symposium",
        role: "Convener",
        startDate: "2024-02-15",
        endDate: "2024-02-17",
        venue: "BIT Campus",
        participants: 500,
        sponsors: ["TCS", "Infosys", "Wipro"],
        budget: "₹5,00,000",
      },
    ],
    externalExaminer: [
      {
        id: 1,
        institution: "Anna University",
        examType: "PhD Viva Voce",
        subject: "Computer Science",
        candidateName: "Research Scholar",
        examDate: "2024-03-20",
        role: "External Examiner",
        thesisTitle: "Deep Learning Approaches for Medical Image Analysis",
      },
    ],
    journalReviewer: [
      {
        id: 1,
        journalName: "IEEE Transactions on Neural Networks",
        publisher: "IEEE",
        impactFactor: 14.255,
        reviewsCompleted: 8,
        status: "Active",
        startDate: "2022-06-01",
        expertise: ["Deep Learning", "Neural Networks", "Computer Vision"],
      },
    ],
    guestLectures: [
      {
        id: 1,
        topic: "Introduction to Generative AI",
        institution: "PSG College of Technology",
        date: "2024-03-05",
        duration: "2 hours",
        audience: "UG/PG Students",
        attendees: 200,
        feedback: "Excellent",
      },
      {
        id: 2,
        topic: "Career Opportunities in Data Science",
        institution: "Government Arts College, Coimbatore",
        date: "2024-02-20",
        duration: "1.5 hours",
        audience: "Final Year Students",
        attendees: 150,
        feedback: "Very Good",
      },
    ],
    internationalVisits: [
      {
        id: 1,
        institution: "Stanford University",
        country: "USA",
        purpose: "Research Collaboration",
        startDate: "2024-01-15",
        endDate: "2024-01-30",
        duration: "15 days",
        sponsor: "AICTE",
        outcomes: "Initiated joint research project on AI in Healthcare",
      },
    ],
    notableAchievements: [
      {
        id: 1,
        title: "Best Researcher Award 2024",
        awardedBy: "Indian Society for Technical Education",
        date: "2024-02-28",
        category: "Research Excellence",
        description: "Recognized for outstanding contributions in AI research",
        prize: "₹1,00,000",
      },
      {
        id: 2,
        title: "Patent Grant - Smart Healthcare System",
        awardedBy: "Indian Patent Office",
        date: "2024-01-15",
        category: "Innovation",
        patentNo: "IN-2024-00123",
        description:
          "IoT-based patient monitoring system with AI-powered diagnostics",
      },
    ],
    onlineCourses: [
      {
        id: 1,
        courseName: "Deep Learning Specialization",
        platform: "Coursera",
        provider: "DeepLearning.AI",
        completionDate: "2024-02-10",
        duration: "5 months",
        grade: "98%",
        credentialId: "COURSERA-DL-2024",
        skills: ["TensorFlow", "Keras", "CNN", "RNN", "Transformers"],
      },
    ],
    paperPresentations: [
      {
        id: 1,
        title: "Transformer-based Approach for Code Generation",
        conference: "ACM SIGSOFT FSE 2024",
        location: "San Francisco, USA",
        date: "2024-03-18",
        authors: ["Dr. John Smith", "Dr. Johnson"],
        status: "Presented",
        award: "Best Paper Award",
        doi: "10.1145/xxxxx",
      },
      {
        id: 2,
        title: "Federated Learning for Healthcare Applications",
        conference: "IEEE EMBC 2024",
        location: "Orlando, USA",
        date: "2024-02-25",
        authors: ["Dr. John Smith", "Research Team"],
        status: "Presented",
        doi: "10.1109/xxxxx",
      },
    ],
    resourcePerson: [
      {
        id: 1,
        eventName: "AICTE Sponsored STTP on Machine Learning",
        organizer: "Amrita University",
        topic: "Advanced Neural Network Architectures",
        startDate: "2024-03-01",
        endDate: "2024-03-05",
        duration: "5 days",
        participants: 100,
        honorarium: "₹25,000",
      },
    ],
  },
  FAC002: {
    newsletterArchive: [
      {
        id: 1,
        title: "Women in Tech Newsletter",
        publishDate: "2024-02-28",
        edition: "Special Edition",
        description: "Celebrating women's contributions in technology",
        category: "Special",
      },
    ],
    eContentDeveloped: [
      {
        id: 1,
        title: "Python for Data Science",
        type: "Video Course",
        platform: "YouTube",
        duration: "8 weeks",
        developedDate: "2024-01-15",
        status: "Published",
        viewCount: 25000,
        description: "Complete Python programming for data analysis",
      },
    ],
    eventsAttended: [
      {
        id: 1,
        eventName: "Grace Hopper Celebration",
        organizer: "AnitaB.org",
        startDate: "2024-09-24",
        endDate: "2024-09-27",
        location: "Orlando, USA",
        participationType: "Speaker",
        topics: ["Women in Tech", "AI Ethics"],
      },
    ],
    eventsOrganized: [
      {
        id: 1,
        eventName: "Women in Computing Workshop",
        eventType: "Workshop",
        role: "Organizer",
        startDate: "2024-03-08",
        endDate: "2024-03-08",
        venue: "BIT Campus",
        participants: 200,
        sponsors: ["Google", "Microsoft"],
        budget: "₹2,00,000",
      },
    ],
    externalExaminer: [],
    journalReviewer: [
      {
        id: 1,
        journalName: "Journal of Computer Science Education",
        publisher: "Taylor & Francis",
        impactFactor: 4.5,
        reviewsCompleted: 12,
        status: "Active",
        startDate: "2021-09-01",
        expertise: ["CS Education", "Pedagogy", "E-Learning"],
      },
    ],
    guestLectures: [
      {
        id: 1,
        topic: "Breaking Barriers in Tech",
        institution: "Women's Engineering College",
        date: "2024-03-08",
        duration: "2 hours",
        audience: "Students",
        attendees: 300,
        feedback: "Inspiring",
      },
    ],
    internationalVisits: [],
    notableAchievements: [
      {
        id: 1,
        title: "Outstanding Educator Award",
        awardedBy: "Computer Society of India",
        date: "2024-01-26",
        category: "Teaching Excellence",
        description: "For innovative teaching methodologies",
        prize: "₹50,000",
      },
    ],
    onlineCourses: [
      {
        id: 1,
        courseName: "Google Cloud Professional Data Engineer",
        platform: "Google Cloud",
        provider: "Google",
        completionDate: "2024-03-01",
        duration: "3 months",
        grade: "Certified",
        credentialId: "GCP-DE-2024",
        skills: ["BigQuery", "Dataflow", "Cloud Storage"],
      },
    ],
    paperPresentations: [
      {
        id: 1,
        title: "Gamification in Computer Science Education",
        conference: "ACM SIGCSE 2024",
        location: "Portland, USA",
        date: "2024-03-20",
        authors: ["Dr. Sarah Johnson"],
        status: "Presented",
        doi: "10.1145/xxxxx",
      },
    ],
    resourcePerson: [],
  },
};

// Generate default empty achievements for other faculty
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
  "CSBS",
];

// Faculty List Panel Component
function FacultyListPanel({
  facultyList,
  selectedFaculty,
  onFacultySelect,
  onClose,
  searchTerm,
  setSearchTerm,
  selectedDepartment,
  setSelectedDepartment,
}) {
  const filteredFaculty = facultyList.filter((faculty) => {
    const matchesSearch =
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.faculty_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || faculty.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="p-4 bg-gray-100 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-bold text-xl sm:text-2xl text-gray-800">
          Faculty List
        </h1>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-200"
          aria-label="Close panel"
        >
          <X size={24} />
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-5 space-y-3">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-500 shadow-sm"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full p-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept === "All" ? "All Departments" : dept}
            </option>
          ))}
        </select>
      </div>

      {/* Faculty Cards */}
      {filteredFaculty.length > 0 ? (
        <div className="space-y-4">
          {filteredFaculty.map((faculty) => (
            <div
              key={faculty.faculty_id}
              className={`bg-white border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer ${
                selectedFaculty?.faculty_id === faculty.faculty_id
                  ? "ring-2 ring-indigo-500 border-indigo-500"
                  : ""
              }`}
              onClick={() => onFacultySelect(faculty)}
            >
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-indigo-700 mb-1">
                  {faculty.name}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {faculty.faculty_id}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {faculty.department}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {faculty.designation}
                  </span>
                </div>
                <div className="mt-3 flex items-center text-sm text-gray-600">
                  <Award size={14} className="mr-1 text-yellow-500" />
                  <span>{faculty.total_achievements} achievements</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-xl shadow-md">
          <UserX size={40} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 text-md font-medium mb-1">
            No Faculty Found
          </p>
          <p className="text-gray-500 text-xs">
            {searchTerm
              ? "Try adjusting your search term."
              : "No faculty available."}
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
        <h4 className="font-semibold text-gray-800">{item.title}</h4>
        <p className="text-indigo-600 text-sm font-medium">{item.edition}</p>
      </div>
      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
        {item.category}
      </span>
    </div>
    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
    <div className="flex items-center text-gray-500 text-xs">
      <Calendar size={14} className="mr-1" />
      {new Date(item.publishDate).toLocaleDateString()}
    </div>
  </div>
);

const EContentCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.title}</h4>
        <p className="text-indigo-600 text-sm font-medium">{item.platform}</p>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          item.status === "Published"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {item.status}
      </span>
    </div>
    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
    <div className="flex flex-wrap gap-3 text-gray-500 text-xs">
      <span className="flex items-center">
        <BookOpen size={14} className="mr-1" />
        {item.type}
      </span>
      <span className="flex items-center">
        <Clock size={14} className="mr-1" />
        {item.duration}
      </span>
      {item.viewCount && (
        <span className="flex items-center">
          <Users size={14} className="mr-1" />
          {item.viewCount.toLocaleString()} views
        </span>
      )}
    </div>
  </div>
);

const EventAttendedCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <h4 className="font-semibold text-gray-800 mb-2">{item.eventName}</h4>
    <p className="text-indigo-600 text-sm font-medium mb-2">{item.organizer}</p>
    <div className="flex flex-wrap gap-3 text-gray-500 text-sm mb-3">
      <span className="flex items-center">
        <MapPin size={14} className="mr-1" />
        {item.location}
      </span>
      <span className="flex items-center">
        <Calendar size={14} className="mr-1" />
        {item.startDate} to {item.endDate}
      </span>
    </div>
    <div className="flex flex-wrap gap-1">
      {item.topics?.map((topic, idx) => (
        <span
          key={idx}
          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
        >
          {topic}
        </span>
      ))}
    </div>
  </div>
);

const EventOrganizedCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.eventName}</h4>
        <p className="text-indigo-600 text-sm font-medium">Role: {item.role}</p>
      </div>
      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
        {item.eventType}
      </span>
    </div>
    <div className="flex flex-wrap gap-3 text-gray-500 text-sm mb-3">
      <span className="flex items-center">
        <MapPin size={14} className="mr-1" />
        {item.venue}
      </span>
      <span className="flex items-center">
        <Users size={14} className="mr-1" />
        {item.participants} participants
      </span>
    </div>
    {item.sponsors && (
      <div className="flex flex-wrap gap-1">
        {item.sponsors.map((sponsor, idx) => (
          <span
            key={idx}
            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
          >
            {sponsor}
          </span>
        ))}
      </div>
    )}
  </div>
);

const ExaminerCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <h4 className="font-semibold text-gray-800 mb-2">{item.institution}</h4>
    <p className="text-indigo-600 text-sm font-medium mb-2">{item.examType}</p>
    <div className="text-gray-600 text-sm space-y-1">
      <p>
        <strong>Subject:</strong> {item.subject}
      </p>
      {item.thesisTitle && (
        <p>
          <strong>Thesis:</strong> {item.thesisTitle}
        </p>
      )}
      <p className="flex items-center text-gray-500 text-xs mt-2">
        <Calendar size={14} className="mr-1" />
        {new Date(item.examDate).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const ReviewerCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.journalName}</h4>
        <p className="text-indigo-600 text-sm font-medium">{item.publisher}</p>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          item.status === "Active"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {item.status}
      </span>
    </div>
    <div className="flex flex-wrap gap-3 text-gray-500 text-sm mb-3">
      <span>
        Impact Factor: <strong>{item.impactFactor}</strong>
      </span>
      <span>
        Reviews: <strong>{item.reviewsCompleted}</strong>
      </span>
    </div>
    <div className="flex flex-wrap gap-1">
      {item.expertise?.map((exp, idx) => (
        <span
          key={idx}
          className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full"
        >
          {exp}
        </span>
      ))}
    </div>
  </div>
);

const GuestLectureCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <h4 className="font-semibold text-gray-800 mb-2">{item.topic}</h4>
    <p className="text-indigo-600 text-sm font-medium mb-2">
      {item.institution}
    </p>
    <div className="flex flex-wrap gap-3 text-gray-500 text-sm mb-3">
      <span className="flex items-center">
        <Calendar size={14} className="mr-1" />
        {new Date(item.date).toLocaleDateString()}
      </span>
      <span className="flex items-center">
        <Clock size={14} className="mr-1" />
        {item.duration}
      </span>
      <span className="flex items-center">
        <Users size={14} className="mr-1" />
        {item.attendees} attendees
      </span>
    </div>
    {item.feedback && (
      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
        Feedback: {item.feedback}
      </span>
    )}
  </div>
);

const InternationalVisitCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3 mb-3">
      <Globe className="text-indigo-500 mt-1" size={20} />
      <div>
        <h4 className="font-semibold text-gray-800">{item.institution}</h4>
        <p className="text-indigo-600 text-sm font-medium">{item.country}</p>
      </div>
    </div>
    <p className="text-gray-600 text-sm mb-3">
      <strong>Purpose:</strong> {item.purpose}
    </p>
    <div className="flex flex-wrap gap-3 text-gray-500 text-sm mb-3">
      <span className="flex items-center">
        <Calendar size={14} className="mr-1" />
        {item.duration}
      </span>
      <span className="flex items-center">
        <Building size={14} className="mr-1" />
        Sponsor: {item.sponsor}
      </span>
    </div>
    {item.outcomes && (
      <p className="text-gray-600 text-sm">
        <strong>Outcomes:</strong> {item.outcomes}
      </p>
    )}
  </div>
);

const AwardCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3 mb-3">
      <Trophy className="text-yellow-500 mt-1" size={24} />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.title}</h4>
        <p className="text-indigo-600 text-sm font-medium">{item.awardedBy}</p>
      </div>
      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
        {item.category}
      </span>
    </div>
    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
    <div className="flex flex-wrap gap-3 text-gray-500 text-sm">
      <span className="flex items-center">
        <Calendar size={14} className="mr-1" />
        {new Date(item.date).toLocaleDateString()}
      </span>
      {item.prize && (
        <span className="text-green-600 font-medium">{item.prize}</span>
      )}
    </div>
  </div>
);

const OnlineCourseCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.courseName}</h4>
        <p className="text-indigo-600 text-sm font-medium">
          {item.platform} • {item.provider}
        </p>
      </div>
      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
        {item.grade}
      </span>
    </div>
    <div className="flex flex-wrap gap-3 text-gray-500 text-sm mb-3">
      <span className="flex items-center">
        <Clock size={14} className="mr-1" />
        {item.duration}
      </span>
      <span className="flex items-center">
        <GraduationCap size={14} className="mr-1" />
        {item.credentialId}
      </span>
    </div>
    {item.skills && (
      <div className="flex flex-wrap gap-1">
        {item.skills.map((skill, idx) => (
          <span
            key={idx}
            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
    )}
  </div>
);

const PaperCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.title}</h4>
        <p className="text-indigo-600 text-sm font-medium">{item.conference}</p>
      </div>
      {item.award && (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
          <Trophy size={12} />
          {item.award}
        </span>
      )}
    </div>
    <div className="flex flex-wrap gap-3 text-gray-500 text-sm mb-3">
      <span className="flex items-center">
        <MapPin size={14} className="mr-1" />
        {item.location}
      </span>
      <span className="flex items-center">
        <Calendar size={14} className="mr-1" />
        {new Date(item.date).toLocaleDateString()}
      </span>
    </div>
    <p className="text-gray-600 text-sm">
      <strong>Authors:</strong> {item.authors?.join(", ")}
    </p>
    {item.doi && (
      <a
        href={`https://doi.org/${item.doi}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs flex items-center gap-1 mt-2"
      >
        <ExternalLink size={12} />
        DOI: {item.doi}
      </a>
    )}
  </div>
);

const ResourcePersonCard = ({item}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <h4 className="font-semibold text-gray-800 mb-2">{item.eventName}</h4>
    <p className="text-indigo-600 text-sm font-medium mb-2">{item.organizer}</p>
    <p className="text-gray-600 text-sm mb-3">
      <strong>Topic:</strong> {item.topic}
    </p>
    <div className="flex flex-wrap gap-3 text-gray-500 text-sm mb-3">
      <span className="flex items-center">
        <Clock size={14} className="mr-1" />
        {item.duration}
      </span>
      <span className="flex items-center">
        <Users size={14} className="mr-1" />
        {item.participants} participants
      </span>
    </div>
    {item.honorarium && (
      <span className="text-green-600 font-medium text-sm">
        Honorarium: {item.honorarium}
      </span>
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
function FacultyDetailPanel({faculty, achievements}) {
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
      <div className="mb-6">
        <div className="text-2xl md:text-3xl font-bold text-gray-800">
          {faculty.name}'s Achievements
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
          <span>
            <span className="font-medium text-gray-700">ID:</span>{" "}
            {faculty.faculty_id}
          </span>
          <span>
            <span className="font-medium text-gray-700">Department:</span>{" "}
            {faculty.department}
          </span>
        </div>
      </div>

      {/* Tabs - Student Metrics Style */}
      <div className="bg-slate-100 p-1.5 rounded-xl mb-6 shadow-sm space-y-1">
        {/* First Row - 6 tabs */}
        <div className="flex gap-1">
          {tabs.slice(0, 6).map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 py-2 px-2
                  rounded-lg transition-colors duration-150
                  text-xs cursor-pointer whitespace-nowrap
                  ${
                    isActive
                      ? "bg-white text-indigo-700 font-semibold shadow-sm"
                      : "text-gray-600 hover:bg-slate-200 hover:text-indigo-600"
                  }
                `}
              >
                <IconComponent
                  size={14}
                  className={isActive ? "text-indigo-600" : "text-gray-500"}
                />
                <span>{tab.label}</span>
              </div>
            );
          })}
        </div>
        {/* Second Row - 6 tabs */}
        <div className="flex gap-1">
          {tabs.slice(6, 12).map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 py-2 px-2
                  rounded-lg transition-colors duration-150
                  text-xs cursor-pointer whitespace-nowrap
                  ${
                    isActive
                      ? "bg-white text-indigo-700 font-semibold shadow-sm"
                      : "text-gray-600 hover:bg-slate-200 hover:text-indigo-600"
                  }
                `}
              >
                <IconComponent
                  size={14}
                  className={isActive ? "text-indigo-600" : "text-gray-500"}
                />
                <span>{tab.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Box */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 capitalize">
          {tabs.find((t) => t.id === activeTab)?.label} (
          {getTabCount(activeTab)})
        </h3>
        {renderContent()}
      </div>

      {/* Export Button */}
      <div className="text-center">
        <button className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-all duration-300 flex items-center gap-2 mx-auto">
          <Download size={18} />
          Export Report
        </button>
      </div>
    </div>
  );
}

// Main Component
export default function FacultyMetrics() {
  const [facultyList, setFacultyList] = useState(dummyFacultyList);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [achievements, setAchievements] = useState(getDefaultAchievements());
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

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

  const handleFacultySelect = (faculty) => {
    setSelectedFaculty(faculty);
    // Get achievements for selected faculty (use dummy data or default empty)
    const facultyAchievements =
      dummyAchievementsData[faculty.faculty_id] || getDefaultAchievements();
    setAchievements(facultyAchievements);
    setIsPanelOpen(false);
  };

  return (
    <div className="relative flex flex-col lg:flex-row h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden p-4 border-b border-gray-300 bg-white flex justify-between items-center sticky top-0 z-10">
        <div className="flex-1">
          <div className="text-xl font-bold text-gray-800 truncate">
            {selectedFaculty ? selectedFaculty.name : "Select Faculty"}
          </div>
          {selectedFaculty && (
            <div className="text-sm text-gray-500">
              {selectedFaculty.department} • {selectedFaculty.designation}
            </div>
          )}
        </div>
        <button
          onClick={() => setIsPanelOpen(true)}
          className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg"
          aria-label="Search faculty"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Left Panel (Faculty List) */}
      <div
        className={`
          transition-transform duration-300 ease-in-out
          lg:w-[35%] xl:w-[28%] lg:border-r lg:border-gray-300
          ${isPanelOpen ? "block" : "hidden"}
          lg:block
          fixed inset-0 z-30 lg:static lg:z-auto
        `}
      >
        {/* Modal Backdrop for Mobile */}
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 lg:hidden"
          onClick={() => setIsPanelOpen(false)}
        ></div>

        <div className="relative w-full max-w-lg lg:max-w-full h-full bg-slate-50">
          <FacultyListPanel
            facultyList={facultyList}
            selectedFaculty={selectedFaculty}
            onFacultySelect={handleFacultySelect}
            onClose={() => setIsPanelOpen(false)}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
          />
        </div>
      </div>

      {/* Right Panel (Faculty Details) */}
      <div className="flex-1 lg:w-[65%] xl:w-[72%] overflow-hidden">
        <FacultyDetailPanel
          faculty={selectedFaculty}
          achievements={achievements}
        />
      </div>
    </div>
  );
}
