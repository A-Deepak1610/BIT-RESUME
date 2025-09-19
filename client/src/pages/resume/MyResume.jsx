import React, { useState, useEffect } from "react";
import logo from "../../assets/logo_bit.jpg";
import { Phone, Mail, Linkedin, Github, MapPin, Printer } from "lucide-react";
import ProjectsForResume from "./projects/ProjectsForResume";
import PsDataForResume from "./PsDataForResume";
import MentorMenteeForResume from "./MentorMenteeForResume";
import AreasOfExpertise from "./AreasOfExpertise";
import AccomplishmentsForResume from "./AccomplishmentsForResume";
import ActivenessGraphForResume from "../dashboard/graphs/graph1/ActivenessGraphForResume";
import AchievementsGraphForResume from "../dashboard/graphs/grpah2/AchievementsGraphForResume";
import A4Page from "./A4Page"; // Your A4Page component from above
import QRCode from "react-qr-code"; // <-- CORRECTED IMPORT for the new library
import bit_logo from '../../assets/bit_logo.png'
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

const ResumeContent = () => (
  <>
    <A4Page>
      <header className="flex items-start justify-between w-full mb-5">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-800">Selva</h1>
          <p className="text-lg font-medium text-blue-800">
            Computer Science & Engineering Student
          </p>
          <div className="flex items-center text-xs text-gray-600 mt-2 space-x-4 flex-wrap">
            <div className="flex items-center">
              <Mail size={12} className="mr-1.5" />
              <span>email@gmail.com</span>
            </div>
            <div className="flex items-center">
              <Phone size={12} className="mr-1.5" />
              <span>+91 6380899737</span>
            </div>
            <div className="flex items-center">
              <MapPin size={12} className="mr-1.5" />
              <span>Erode, Tamil Nadu</span>
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-600 mt-1.5 space-x-4 flex-wrap">
            <a
              href="https://github.com/selva"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover-text-blue-600"
            >
              <Github size={12} className="mr-1.5" />
              <span>github.com/selva</span>
            </a>
            <a
              href="https://linkedin.com/in/selva"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover-text-blue-600"
            >
              <Linkedin size={12} className="mr-1.5" />
              <span>linkedin.com/in/selva</span>
            </a>
          </div>
        </div>
        <div className="mt-2 p-1 bg-white"> 
            <QRCode
              value="https://myresume.com/resume/selva"
              size={80}
              viewBox={`0 0 256 256`} 
            />
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
          <ActivenessGraphForResume />
        </div>
        <div className="w-1/2">
          <AchievementsGraphForResume />
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
        <AreasOfExpertise />
      </Section>
      <Section title="Accomplishments">
        <AccomplishmentsForResume />
      </Section>
      <Section title="Leadership & Mentorship">
        <MentorMenteeForResume />
      </Section>
    </A4Page>

    <A4Page>
      <Section title="Projects">
        <ProjectsForResume />
      </Section>
      <Section title="Personal Skills">
        <PsDataForResume />
      </Section>
    </A4Page>
  </>
);

export default function PrintableResumeView() {
  const [isReady, setIsReady] = useState(false);
  const [isPrinting, setIsPrinting]=useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  const handlePrint = async () => {
    if (!isReady || isPrinting) return;

    setIsPrinting(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    window.print();
  };

  const getButtonState = () => {
    if (!isReady) {
      return {
        disabled: true,
        text: "Loading Preview...",
        className: "disabled:bg-gray-400",
      };
    }
    if (isPrinting) {
      return {
        disabled: true,
        text: "Printing...",
        className: "disabled:bg-gray-400",
      };
    }
    return {
      disabled: false,
      text: "Print or Save as PDF",
      className: "hover:bg-indigo-700",
    };
  };

  const buttonState = getButtonState();

  return (
    <>
      <div id="resume-content-to-print">
        <ResumeContent />
      </div>

       <div className="print-hide bg-gray-100 py-6 text-center">
        <button
          onClick={handlePrint}
          disabled={buttonState.disabled}
          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed transition-colors duration-200 ${buttonState.className}`}
        >
          <Printer className={`mr-3 -ml-1 h-5 w-5 ${isPrinting ? 'animate-pulse' : ''}`} />
          {buttonState.text}
        </button>
      </div>
    </>
  );
}