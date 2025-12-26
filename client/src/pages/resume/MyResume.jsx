import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import logo from "../../assets/logo_bit.jpg";
import { Phone, Mail, Linkedin, Github, MapPin, Download } from "lucide-react";
import ProjectsForResume from "./projects/ProjectsForResume";
import PsDataForResume from "./PsDataForResume";
import MentorMenteeForResume from "./MentorMenteeForResume";
import AreasOfExpertise from "./AreasOfExpertise";
import AccomplishmentsForResume from "./AccomplishmentsForResume";
import PaperPresentationsForResume from "./PaperPresentationsForResume";
import PatentsForResume from "./PatentsForResume";
import ActivenessGraphForResume from "../dashboard/graphs/graph1/ActivenessGraphForResume";
import AchievementsGraphForResume from "../dashboard/graphs/grpah2/AchievementsGraphForResume";
import A4Page from "./A4Page";
import QRCode from "react-qr-code";
import useAuth from "../../store/UseAuth";
const Section = ({ title, children, className }) => (
  <section className={`mb-3 ${className || ""}`}>
    {title && (
      <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-2">
        {title}
      </h2>
    )}
    {children}
  </section>
);

const ResumeContent = ({ rollno, name, email, info }) => (
  <div className="resume-flow">
    <A4Page className="h-auto min-h-0">
      <header className="flex items-start justify-between w-full mb-3">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
          <p className="text-base font-medium text-blue-800">
            {info.department || "Computer Science & Engineering"} Student
          </p>
          <div className="flex items-center text-xs text-gray-600 mt-1.5 space-x-4 flex-wrap">
            <div className="flex items-center">
              <Mail size={12} className="mr-1.5" />
              <span>{email}</span>
            </div>
            <div className="flex items-center">
              <Phone size={12} className="mr-1.5" />
              <span>+91 {info.phone || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={12} className="mr-1.5" />
              <span>{info.location || "N/A"}</span>
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-600 mt-1 space-x-4 flex-wrap">
            <a
              href={info.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover-text-blue-600"
            >
              <Github size={12} className="mr-1.5" />
              <span>{info.github || "github.com"}</span>
            </a>
            <a
              href={info.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover-text-blue-600"
            >
              <Linkedin size={12} className="mr-1.5" />
              <span>{info.linkedin || "linkedin.com"}</span>
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center ml-4">
          <img
            src={logo}
            alt="profile"
            className="rounded-full w-20 h-20 object-cover border-2 border-gray-300"
          />
        </div>
      </header>

      <Section title="Education">
        <div className="flex justify-between items-start text-sm">
          <div>
            <div className="flex items-center space-x-2 mb-0.5">
              <p className="font-semibold text-gray-800">
                Bannari Amman Institute of Technology
              </p>
            </div>
            <p className="text-gray-600">
              Bachelor of Engineering - Computer Science
            </p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="font-semibold text-gray-700">2024 - 2028</p>
            <p className="text-gray-600">CGPA: 8.5 / 10.0</p>
          </div>
        </div>
      </Section>
      <Section title="Areas of Expertise">
        <AreasOfExpertise rollno={rollno} />
      </Section>
      <Section title="Personal Skills">
        <PsDataForResume rollno={rollno} />
      </Section>
      <Section title="Accomplishments">
        <AccomplishmentsForResume rollno={rollno} />
      </Section>
      <Section title="Leadership & Mentorship">
        <MentorMenteeForResume rollno={rollno} />
      </Section>
      <Section title="Projects">
        <ProjectsForResume rollno={rollno} />
      </Section>
      <Section title="Paper Presentations">
        <PaperPresentationsForResume rollno={rollno} />
      </Section>
      <Section title="Patents">
        <PatentsForResume rollno={rollno} />
      </Section>
    </A4Page>
  </div>
);

export default function PrintableResumeView(props) {
  const [isReady, setIsReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const Student_rollno = props.rollno || "-";
  const resumeRef = useRef(null);
  console.log("PrintableResumeView rollno:", Student_rollno);

  const { rollno, name } = useAuth();
  const [info, setInfo] = useState({
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    user_email: "",
    user_name: "",
    department: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getInfo = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/header/getprofile/${Student_rollno}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!res.ok) console.error("Response not ok for info");
      const data = await res.json();
      // API returns { data: { phone, location, github, linkedin, user_email, user_name, ... } }
      if (data && data.data) {
        setInfo(data.data);
      }
      console.log("data from info", data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInfo();
  }, [rollno]);

  const handleDownload = async () => {
    if (!resumeRef.current || isDownloading) return;

    setIsDownloading(true);

    try {
      const element = resumeRef.current;
      const page = element.querySelector(".a4-page");

      if (!page) {
        throw new Error("Resume content not found");
      }

      // A4 dimensions in mm
      const a4Width = 210;
      const a4Height = 297;
      const a4WidthPx = 794;
      const a4HeightPx = 1123;

      // Generate canvas from the entire content
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        windowWidth: a4WidthPx,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const imgWidth = a4Width;
      const imgHeight = (canvas.height * a4Width) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // Calculate how many pages we need
      let heightLeft = imgHeight;
      let position = 0;
      let pageNum = 0;

      while (heightLeft > 0) {
        if (pageNum > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imgData,
          "JPEG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );

        heightLeft -= a4Height;
        position -= a4Height;
        pageNum++;
      }

      // Save the PDF
      const filename = `${info.user_name || name || "Resume"}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Fixed Download Button in Top Right */}
      <div className="fixed top-4 right-4 z-50 print-hide">
        <button
          onClick={handleDownload}
          disabled={!isReady || isDownloading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Download
            className={`mr-2 h-4 w-4 ${isDownloading ? "animate-bounce" : ""}`}
          />
          {isDownloading
            ? "Generating PDF..."
            : isReady
            ? "Download PDF"
            : "Loading..."}
        </button>
      </div>

      {/* Resume Content */}
      <div ref={resumeRef} id="resume-content-to-print">
        <ResumeContent
          rollno={Student_rollno}
          name={info.user_name || name}
          email={info.user_email || ""}
          info={info}
        />
      </div>
    </div>
  );
}
