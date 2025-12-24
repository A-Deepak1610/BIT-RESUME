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
import ActivenessGraphForResume from "../dashboard/graphs/graph1/ActivenessGraphForResume";
import AchievementsGraphForResume from "../dashboard/graphs/grpah2/AchievementsGraphForResume";
import A4Page from "./A4Page";
import QRCode from "react-qr-code";
import useAuth from "../../store/UseAuth";
const Section = ({ title, children, className }) => (
  <section className={`mb-5 ${className || ""}`}>
    {title && (
      <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-4">
        {title}
      </h2>
    )}
    {children}
  </section>
);

const ResumeContent = ({ rollno, name, email, info }) => (
  <>
    <A4Page>
      <header className="flex items-start justify-between w-full mb-5">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-800">{name}</h1>
          <p className="text-lg font-medium text-blue-800">
            {info.department || "Computer Science & Engineering"} Student
          </p>
          <div className="flex items-center text-xs text-gray-600 mt-2 space-x-4 flex-wrap">
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
          <div className="flex items-center text-xs text-gray-600 mt-1.5 space-x-4 flex-wrap">
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
        <div className="mt-2 p-1 bg-white">
          {/* <QRCode
            value="https://myresume.com/resume/selva"
            size={80}
            viewBox={`0 0 256 256`}
          /> */}
        </div>
        <div className="flex flex-col items-center ml-4">
          <img
            src={logo}
            alt="profile"
            className="rounded-full w-24 h-24 object-cover border-2 border-gray-300"
          />
        </div>
      </header>

      <Section title="Education">
        <div className="flex justify-between items-start text-sm">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <p className="font-semibold text-gray-800">
                Bannari Amman Institute of Technology
              </p>
              {/* <img src={bit_logo} className="ml-70 mt-[35px] w-20 h-20 absolute" alt="BIT" /> */}
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
      <div className="flex justify-between items-start gap-6 mb-5">
        <div className="w-1/2">
          <ActivenessGraphForResume rollno={rollno} />
        </div>
        <div className="w-1/2">
          <AchievementsGraphForResume rollno={rollno} />
        </div>
      </div>
      <div className="text-sm text-gray-700 -mt-2 mb-5">
        <p>
          <span className="font-semibold">Activeness Graph</span> - Illustrates
          consistent engagement and participation across academic semesters.
        </p>
        <p>
          <span className="font-semibold">Achievement Graph</span> - Highlights
          personal growth compared to the institutional average over time.
        </p>
      </div>
      <Section title="Areas of Expertise">
        <AreasOfExpertise rollno={rollno} />
      </Section>
      <Section title="Accomplishments">
        <AccomplishmentsForResume rollno={rollno} />
      </Section>
      <Section title="Leadership & Mentorship">
        <MentorMenteeForResume rollno={rollno} />
      </Section>
    </A4Page>
    <A4Page>
      <Section title="Projects">
        <ProjectsForResume rollno={rollno} />
      </Section>
      <Section title="Personal Skills">
        <PsDataForResume rollno={rollno} />
      </Section>
    </A4Page>
  </>
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
        `http://localhost:6001/api/header/getprofile/${Student_rollno}`,
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
      const pages = element.querySelectorAll(".a4-page");

      // A4 dimensions in mm
      const a4Width = 210;
      const a4Height = 297;

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // Convert each page to canvas and add to PDF
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        // Generate canvas from the page
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          windowWidth: page.scrollWidth,
          windowHeight: page.scrollHeight,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.98);

        // Add new page for subsequent pages
        if (i > 0) {
          pdf.addPage();
        }

        // Add image to PDF
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0,
          a4Width,
          a4Height,
          undefined,
          "FAST"
        );
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
