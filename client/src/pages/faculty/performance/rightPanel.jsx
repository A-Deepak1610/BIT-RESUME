import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Users,
  FolderOpen,
  Briefcase,
  Award,
  FileText,
  Lightbulb,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import PsSkillGraph from "../../dashboard/graphs/ps/PsGraph";
import MentorMenteesGraph from "../../dashboard/graphs/mentor/MentorGraph";

// All tabs in one row - upload categories + graphs
const allTabs = [
  { id: "projects", label: "Projects", icon: FolderOpen, type: "upload" },
  {
    id: "certifications",
    label: "Certifications",
    icon: GraduationCap,
    type: "upload",
  },
  { id: "hackathons", label: "Hackathons", icon: Award, type: "upload" },
  { id: "internships", label: "Internships", icon: Briefcase, type: "upload" },
  { id: "papers", label: "Papers", icon: FileText, type: "upload" },
  { id: "patents", label: "Patents", icon: Lightbulb, type: "upload" },
  { id: "psgraph", label: "PS Graph", icon: CalendarDays, type: "graph" },
  { id: "mentograph", label: "MentoGraph", icon: Users, type: "graph" },
];

// Project Detail Component
const ProjectDetail = ({ project }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-semibold text-gray-800">{project.title}</h4>
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
        >
          <ExternalLink size={12} /> GitHub
        </a>
      )}
    </div>
    <p className="text-gray-600 text-sm mb-2">{project.description}</p>
    {project.stack && project.stack.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {project.stack.map((tech, idx) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>
    )}
  </div>
);

// Certification Detail Component
const CertificationDetail = ({ cert }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-gray-800">{cert.title}</h4>
        <p className="text-sm text-gray-600">
          {cert.platform} {cert.issue_date && `• ${cert.issue_date}`}
        </p>
      </div>
      {cert.linkedin_link && (
        <a
          href={cert.linkedin_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
        >
          <ExternalLink size={12} /> LinkedIn
        </a>
      )}
    </div>
  </div>
);

// Hackathon Detail Component
const HackathonDetail = ({ hackathon }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
    <h4 className="font-semibold text-gray-800">{hackathon.event_name}</h4>
    <p className="text-sm text-gray-600">
      {hackathon.did_you_win && `Result: ${hackathon.did_you_win}`}
    </p>
    {hackathon.summary && (
      <p className="text-sm text-gray-500 mt-1">{hackathon.summary}</p>
    )}
  </div>
);

// Internship Detail Component
const InternshipDetail = ({ internship }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
    <h4 className="font-semibold text-gray-800">{internship.company_name}</h4>
    <p className="text-sm text-gray-600">
      {internship.domain} {internship.role && `• ${internship.role}`}
    </p>
    {internship.duration && (
      <p className="text-sm text-gray-500">Duration: {internship.duration}</p>
    )}
  </div>
);

// Paper Detail Component
const PaperDetail = ({ paper }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
    <h4 className="font-semibold text-gray-800">
      {paper.title || paper.paper_title}
    </h4>
    <p className="text-sm text-gray-600">
      {paper.journal_name || paper.conference}{" "}
      {paper.published_date && `• ${paper.published_date}`}
    </p>
  </div>
);

// Patent Detail Component
const PatentDetail = ({ patent }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
    <h4 className="font-semibold text-gray-800">
      {patent.title || patent.patent_title}
    </h4>
    <p className="text-sm text-gray-600">
      Patent No: {patent.patent_number || patent.application_number || "N/A"}
    </p>
    {patent.status && (
      <p className="text-sm text-gray-500">Status: {patent.status}</p>
    )}
  </div>
);

export default function GraphVisual({ name, roll }) {
  const [activeTab, setActiveTab] = useState("projects");
  const [uploadData, setUploadData] = useState({
    projects: [],
    certifications: [],
    hackathons: [],
    internships: [],
    papers: [],
    patents: [],
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL
  // Reset when student changes
  useEffect(() => {
    setActiveTab("projects");
  }, [roll]);

  // Fetch upload data for the selected student
  useEffect(() => {
    const fetchUploadData = async () => {
      if (!roll) return;
      setLoadingStats(true);
      try {
        const [
          projectsRes,
          certificatesRes,
          hackathonsRes,
          internshipsRes,
          papersRes,
          patentsRes,
        ] = await Promise.all([
          fetch(`${API_URL}api/resume/getprojects/${roll}`, {
            credentials: "include",
          }),
          fetch(`${API_URL}api/resume/getcertificates/${roll}`, {
            credentials: "include",
          }),
          fetch(`${API_URL}api/resume/gethackathondata/${roll}`, {
            credentials: "include",
          }),
          fetch(`${API_URL}api/resume/getinternshipdata/${roll}`, {
            credentials: "include",
          }),
          fetch(`${API_URL}api/resume/getpapers/${roll}`, {
            credentials: "include",
          }),
          fetch(`${API_URL}api/resume/getpatents/${roll}`, {
            credentials: "include",
          }),
        ]);

        const projectsData = projectsRes.ok ? await projectsRes.json() : [];
        const certificatesData = certificatesRes.ok
          ? await certificatesRes.json()
          : [];
        const hackathonsData = hackathonsRes.ok
          ? await hackathonsRes.json()
          : [];
        const internshipsData = internshipsRes.ok
          ? await internshipsRes.json()
          : [];
        const papersData = papersRes.ok ? await papersRes.json() : [];
        const patentsData = patentsRes.ok ? await patentsRes.json() : [];

        setUploadData({
          projects: Array.isArray(projectsData) ? projectsData : [],
          certifications: Array.isArray(certificatesData)
            ? certificatesData
            : [],
          hackathons: Array.isArray(hackathonsData) ? hackathonsData : [],
          internships: Array.isArray(internshipsData) ? internshipsData : [],
          papers: Array.isArray(papersData) ? papersData : [],
          patents: Array.isArray(patentsData) ? patentsData : [],
        });
      } catch (error) {
        console.error("Error fetching upload data:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchUploadData();
  }, [roll]);

  const handleResumeClick = () => {
    navigate("/resume", { state: { rollno: roll } });
  };

  // Render content based on active tab
  const renderContent = () => {
    if (loadingStats) {
      return <div className="text-center text-gray-500 py-8">Loading...</div>;
    }

    // Upload category content
    const uploadConfig = {
      projects: {
        data: uploadData.projects,
        Component: ProjectDetail,
        propName: "project",
      },
      certifications: {
        data: uploadData.certifications,
        Component: CertificationDetail,
        propName: "cert",
      },
      hackathons: {
        data: uploadData.hackathons,
        Component: HackathonDetail,
        propName: "hackathon",
      },
      internships: {
        data: uploadData.internships,
        Component: InternshipDetail,
        propName: "internship",
      },
      papers: {
        data: uploadData.papers,
        Component: PaperDetail,
        propName: "paper",
      },
      patents: {
        data: uploadData.patents,
        Component: PatentDetail,
        propName: "patent",
      },
    };

    if (uploadConfig[activeTab]) {
      const config = uploadConfig[activeTab];
      if (config.data.length === 0) {
        return (
          <p className="text-gray-500 text-center py-8">
            No {activeTab} found.
          </p>
        );
      }
      return (
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
          {config.data.map((item, index) => (
            <config.Component key={index} {...{ [config.propName]: item }} />
          ))}
        </div>
      );
    }

    // Graph content
    if (activeTab === "psgraph") {
      return (
        <div className="h-[50vh]">
          <PsSkillGraph rollno={roll} />
        </div>
      );
    }
    if (activeTab === "mentograph") {
      return (
        <div className="h-[50vh]">
          <MentorMenteesGraph rollno={roll} />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      <div className="mb-6">
        <div className="text-2xl md:text-3xl font-bold text-gray-800">
          {name ? `${name}'s Performance` : "Performance Overview"}
        </div>
        {roll && (
          <div className="text-sm text-gray-600 mt-1">Roll No: {roll}</div>
        )}
        {!name && !roll && (
          <div className="text-sm text-gray-500 mt-1">
            Select a student to view detailed performance metrics.
          </div>
        )}
      </div>

      {name && roll && (
        <>
          {/* All tabs in one row */}
          <div className="bg-slate-100 p-1.5 rounded-xl flex flex-wrap items-center gap-1 mb-6 shadow-sm">
            {allTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                                        flex items-center justify-center gap-1.5 py-2 px-3
                                        rounded-lg transition-all duration-200 ease-in-out
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
                    className={`${
                      isActive ? "text-indigo-600" : "text-gray-500"
                    }`}
                  />
                  <span>{tab.label}</span>
                </div>
              );
            })}
          </div>

          {/* Content Box */}
          <div
            key={roll}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-md mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4 capitalize">
              {allTabs.find((t) => t.id === activeTab)?.label}
              {uploadData[activeTab] && ` (${uploadData[activeTab].length})`}
            </h3>
            {renderContent()}
          </div>

          {/* View Resume Button */}
          <div className="text-center">
            <button
              onClick={handleResumeClick}
              className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-all duration-300"
            >
              View Resume
            </button>
          </div>
        </>
      )}
    </div>
  );
}
