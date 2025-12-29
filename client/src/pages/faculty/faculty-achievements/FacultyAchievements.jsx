import React, { useState, useEffect } from "react";
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
import UploadModel from "./UploadModel";

const API_URL = import.meta.env.VITE_API_URL;

const FacultyAchievements = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
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
        link: "https://nptel.ac.in/courses/ml-fundamentals",
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
        certificate: "ieee_conf_2024.pdf",
        topics: ["Deep Learning", "Computer Vision", "NLP"],
        keyTakeaways: "Latest advancements in transformer architectures",
      },
      {
        id: 2,
        eventName: "National Workshop on Blockchain",
        organizer: "IIT Madras",
        startDate: "2024-01-20",
        endDate: "2024-01-22",
        location: "Chennai",
        participationType: "Participant",
        certificate: "blockchain_workshop.pdf",
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
        description:
          "Three-day technical symposium featuring hackathon, workshops, and paper presentations",
      },
      {
        id: 2,
        eventName: "Faculty Development Program on AI/ML",
        eventType: "FDP",
        role: "Coordinator",
        startDate: "2024-01-08",
        endDate: "2024-01-14",
        venue: "Online",
        participants: 150,
        description:
          "Week-long FDP covering practical aspects of AI/ML implementation",
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
      {
        id: 2,
        institution: "VIT University",
        examType: "Project Evaluation",
        subject: "M.Tech Final Year Projects",
        examDate: "2024-02-28",
        role: "External Evaluator",
        projectCount: 12,
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
      {
        id: 2,
        journalName: "Expert Systems with Applications",
        publisher: "Elsevier",
        impactFactor: 8.665,
        reviewsCompleted: 15,
        status: "Active",
        startDate: "2021-03-15",
        expertise: ["Machine Learning", "Expert Systems", "AI Applications"],
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
        certificate: "guest_lecture_psg.pdf",
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
        collaborators: ["Prof. Andrew Ng", "Prof. Fei-Fei Li"],
      },
      {
        id: 2,
        institution: "National University of Singapore",
        country: "Singapore",
        purpose: "Faculty Exchange Program",
        startDate: "2023-06-01",
        endDate: "2023-06-15",
        duration: "15 days",
        sponsor: "Institution",
        outcomes: "MoU signed for student exchange program",
      },
    ],
    notableAchievements: [
      {
        id: 1,
        title: "Best Researcher Award 2024",
        awardedBy: "Indian Society for Technical Education",
        date: "2024-02-28",
        category: "Research Excellence",
        description:
          "Recognized for outstanding contributions in AI research with 50+ publications",
        prize: "₹1,00,000",
        certificate: "best_researcher_2024.pdf",
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
      {
        id: 2,
        courseName: "AWS Solutions Architect Professional",
        platform: "AWS Training",
        provider: "Amazon",
        completionDate: "2024-01-05",
        duration: "3 months",
        grade: "Passed",
        credentialId: "AWS-SAP-2024-001",
        expiryDate: "2027-01-05",
      },
    ],
    paperPresentations: [
      {
        id: 1,
        title: "Transformer-based Approach for Code Generation",
        conference: "ACM SIGSOFT FSE 2024",
        location: "San Francisco, USA",
        date: "2024-03-18",
        authors: ["Dr. Smith", "Dr. Johnson"],
        abstract:
          "Novel approach using GPT-4 fine-tuning for automated code generation",
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
        authors: ["Dr. Smith", "Research Team"],
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
        certificate: "sttp_amrita.pdf",
      },
      {
        id: 2,
        eventName: "Industry-Academia Conclave",
        organizer: "CII Tamil Nadu",
        topic: "AI Trends and Industry Applications",
        date: "2024-02-10",
        duration: "3 hours",
        participants: 250,
        type: "Panel Discussion",
      },
    ],
  };
  const fetchNewsletters = async () => {
    try {
      const response = await fetch(`${API_URL}api/faculty/newsLetterFormsGet`, {
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
      return data.newsletters || [];
    } catch (error) {
      console.error("Error fetching newsletters:", error);
      return [];
    }
  };

  const fetchEContent = async () => {
    try {
      const response = await fetch(`${API_URL}api/faculty/eContentGet`, {
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const newsletters = await fetchNewsletters();
      const eContent = await fetchEContent();
      setAchievements({
        ...mockAchievements,
        newsletterArchive: newsletters,
        eContentDeveloped: eContent,
      });
      setLoading(false);
    };
    loadData();
  }, [rollno]);

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
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
                onClick={() => setOpenModal(true)}
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
                  {achievements.paperPresentations
                    .slice(0, 3)
                    .map((paper, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {paper.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {paper.conference} •{" "}
                            {new Date(paper.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
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
                            {newsletter.department ? `${newsletter.department} Department Newsletter` : "Institution Newsletter"}
                        </h3>
                        <p className="text-blue-600 font-medium">
                            Vol. {newsletter.volume_number}, Issue {newsletter.issue_number} ({newsletter.issue_month})
                        </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                                {newsletter.newsletter_category.replace(/-/g, ' ')}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                newsletter.status === 'verified' ? 'bg-green-50 text-green-700 border-green-200' :
                                newsletter.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}>
                                {newsletter.status.charAt(0).toUpperCase() + newsletter.status.slice(1)}
                            </span>
                        </div>
                    </div>
                    {newsletter.academic_year && (
                        <p className="text-gray-600 text-sm mb-2">
                            <strong>Academic Year:</strong> {newsletter.academic_year}
                        </p>
                    )}
                     <div className="text-gray-500 text-sm mb-4 space-y-1">
                        {newsletter.faculty_editor_count && <p>Faculty Editors: {newsletter.faculty_editor_count}</p>}
                        {newsletter.student_editor_count && <p>Student Editors: {newsletter.student_editor_count}</p>}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Published: {new Date(newsletter.date_of_publication).toLocaleDateString()}
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
                             <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                content.status === 'verified' ? 'bg-green-50 text-green-700 border-green-200' :
                                content.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}>
                                {content.status ? (content.status.charAt(0).toUpperCase() + content.status.slice(1)) : 'Pending'}
                            </span>
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
                            <a href={content.url_of_content} target="_blank" rel="noreferrer" className="ml-1 text-indigo-600 hover:underline flex items-center">
                                Link <ExternalLink className="h-3 w-3 ml-0.5" />
                            </a>
                           </p>
                        )}
                         {content.remarks && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700 border border-gray-200">
                                <strong>Remarks:</strong> {content.remarks}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500">
                        <span>
                         <Calendar className="h-4 w-4 inline mr-1" />
                        {content.date_of_publication ? new Date(content.date_of_publication).toLocaleDateString() : "Date N/A"}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Events Attended
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {achievements.eventsAttended.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {event.eventName}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {event.organizer}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {event.participationType}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.startDate).toLocaleDateString()} -{" "}
                      {new Date(event.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                  {event.topics && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                  {event.keyTakeaways && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {event.keyTakeaways}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Organized Tab */}
        {activeTab === "eventsOrganized" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Events Organized
            </h2>
            <div className="space-y-6">
              {achievements.eventsOrganized.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {event.eventName}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        Role: {event.role}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {event.eventType}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {event.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Venue</p>
                      <p className="font-medium">{event.venue}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Participants</p>
                      <p className="font-medium">{event.participants}</p>
                    </div>
                    {event.budget && (
                      <div>
                        <p className="text-gray-500">Budget</p>
                        <p className="font-medium">{event.budget}</p>
                      </div>
                    )}
                  </div>
                  {event.sponsors && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Sponsors: {event.sponsors.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* External Examiner Tab */}
        {activeTab === "examiner" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              External Examiner
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {achievements.externalExaminer.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {exam.institution}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {exam.examType}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {exam.role}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Subject:</strong> {exam.subject}
                    </p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(exam.examDate).toLocaleDateString()}
                    </div>
                    {exam.thesisTitle && (
                      <p>
                        <strong>Thesis:</strong> {exam.thesisTitle}
                      </p>
                    )}
                    {exam.projectCount && (
                      <p>
                        <strong>Projects Evaluated:</strong> {exam.projectCount}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Journal Reviewer Tab */}
        {activeTab === "reviewer" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Faculty Journal Reviewer
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {achievements.journalReviewer.map((journal) => (
                <div
                  key={journal.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {journal.journalName}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {journal.publisher}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        journal.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {journal.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Impact Factor:</strong> {journal.impactFactor}
                    </p>
                    <p>
                      <strong>Reviews Completed:</strong>{" "}
                      {journal.reviewsCompleted}
                    </p>
                    <p>
                      <strong>Since:</strong>{" "}
                      {new Date(journal.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  {journal.expertise && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {journal.expertise.map((exp, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guest Lectures Tab */}
        {activeTab === "guestLecture" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Guest Lectures Delivered
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {achievements.guestLectures.map((lecture) => (
                <div
                  key={lecture.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {lecture.topic}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {lecture.institution}
                      </p>
                    </div>
                    {lecture.feedback && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          lecture.feedback === "Excellent"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {lecture.feedback}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(lecture.date).toLocaleDateString()} •{" "}
                      {lecture.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {lecture.audience} • {lecture.attendees} attendees
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* International Visits Tab */}
        {activeTab === "internationalVisit" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              International Visits
            </h2>
            <div className="space-y-6">
              {achievements.internationalVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {visit.institution}
                      </h3>
                      <p className="text-blue-600 font-medium flex items-center">
                        <Globe className="h-4 w-4 mr-1" /> {visit.country}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {visit.purpose}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium">{visit.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Period</p>
                      <p className="font-medium">
                        {new Date(visit.startDate).toLocaleDateString()} -{" "}
                        {new Date(visit.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Sponsor</p>
                      <p className="font-medium">{visit.sponsor}</p>
                    </div>
                  </div>
                  {visit.outcomes && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Outcomes:</strong> {visit.outcomes}
                      </p>
                    </div>
                  )}
                  {visit.collaborators && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        <strong>Collaborators:</strong>{" "}
                        {visit.collaborators.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notable Achievements/Awards Tab */}
        {activeTab === "awards" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Notable Achievements & Awards
            </h2>
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
                          {award.title}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {award.awardedBy}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {award.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {award.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {new Date(award.date).toLocaleDateString()}
                    </span>
                    {award.prize && (
                      <span className="text-green-600 font-medium">
                        {award.prize}
                      </span>
                    )}
                    {award.patentNo && (
                      <span className="text-blue-600">
                        Patent: {award.patentNo}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Online Courses Tab */}
        {activeTab === "onlineCourse" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Online Courses Completed
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {achievements.onlineCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {course.courseName}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {course.platform} • {course.provider}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {course.grade}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Duration:</strong> {course.duration}
                    </p>
                    <p>
                      <strong>Completed:</strong>{" "}
                      {new Date(course.completionDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Credential ID:</strong> {course.credentialId}
                    </p>
                    {course.expiryDate && (
                      <p>
                        <strong>Valid Until:</strong>{" "}
                        {new Date(course.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {course.skills && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {course.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paper Presentations Tab */}
        {activeTab === "papers" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Paper Presentations
            </h2>
            <div className="space-y-6">
              {achievements.paperPresentations.map((paper) => (
                <div
                  key={paper.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {paper.title}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {paper.conference}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          paper.status === "Presented"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {paper.status}
                      </span>
                      {paper.award && (
                        <p className="text-sm text-yellow-600 mt-1">
                          🏆 {paper.award}
                        </p>
                      )}
                    </div>
                  </div>
                  {paper.abstract && (
                    <p className="text-gray-600 text-sm mb-4">
                      {paper.abstract}
                    </p>
                  )}
                  <div className="flex items-center text-sm text-gray-500 space-x-6">
                    <span>
                      <Calendar className="h-4 w-4 inline mr-1" />{" "}
                      {new Date(paper.date).toLocaleDateString()}
                    </span>
                    <span>
                      <MapPin className="h-4 w-4 inline mr-1" />{" "}
                      {paper.location}
                    </span>
                    {paper.doi && (
                      <span>
                        <ExternalLink className="h-4 w-4 inline mr-1" /> DOI:{" "}
                        {paper.doi}
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      <strong>Authors:</strong> {paper.authors.join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resource Person Tab */}
        {activeTab === "resourcePerson" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Resource Person
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {achievements.resourcePerson.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {resource.eventName}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {resource.organizer}
                      </p>
                    </div>
                    {resource.type && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {resource.type}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Topic:</strong> {resource.topic}
                    </p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {resource.startDate
                        ? `${new Date(
                            resource.startDate
                          ).toLocaleDateString()} - ${new Date(
                            resource.endDate
                          ).toLocaleDateString()}`
                        : new Date(resource.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {resource.participants} participants • {resource.duration}
                    </div>
                    {resource.honorarium && (
                      <p>
                        <strong>Honorarium:</strong> {resource.honorarium}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <UploadModel open={openModal} handleClose={() => setOpenModal(false)} />
    </div>
  );
};

export default FacultyAchievements;
