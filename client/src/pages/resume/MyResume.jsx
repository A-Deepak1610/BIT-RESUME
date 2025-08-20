
import React, { useState, useLayoutEffect, useRef, Children } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../../assets/logo_bit.jpg';
import { Phone, Mail, Linkedin, Github, MapPin, Printer } from "lucide-react";
import ProjectsForResume from './projects/ProjectsForResume';
import PsDataForResume from './PsDataForResume';
import MentorMenteeForResume from './MentorMenteeForResume';
import AreasOfExpertise from './AreasOfExpertise';
import AccomplishmentsForResume from './AccomplishmentsForResume';
import ActivenessGraphForResume from '../dashboard/graphs/graph1/ActivenessGraphForResume';
import AchievementsGraphForResume from '../dashboard/graphs/grpah2/AchievementsGraphForResume';
import A4Page from './A4Page'; // Your existing A4Page component

/**
 * A simple wrapper to group content that should not be split across pages.
 */
const ContentBlock = ({ children, className }) => (
  // The 'break-inside-avoid' class is a hint for printing engines.
  <div className={`break-inside-avoid ${className || ''}`}>{children}</div>
);

/**
 * A standard section component for consistent styling.
 */
const Section = ({ title, children, className }) => (
  <section className={`mb-5 ${className || ''}`}>
    {title && (
      <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-4">
        {title}
      </h2>
    )}
    {children}
  </section>
);

/**
 * The ResumePaginator component that intelligently lays out content
 * onto A4 pages for a realistic on-screen preview.
 */
const ResumePaginator = ({ children, onReady }) => {
  const [pages, setPages] = useState(null);
  const measurementContainerRef = useRef(null);
  
  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      if (!measurementContainerRef.current) return;

      const childrenNodes = Array.from(measurementContainerRef.current.children);
      const heights = childrenNodes.map(node => node.offsetHeight);
      
      const MAX_USABLE_PAGE_HEIGHT = 1040; // A4 height (1123px) minus vertical padding
      
      const calculatedPages = [];
      let currentPage = [];
      let currentPageHeight = 0;

      Children.toArray(children).forEach((child, index) => {
        const childHeight = heights[index];
        
        if (currentPage.length > 0 && currentPageHeight + childHeight > MAX_USABLE_PAGE_HEIGHT) {
          calculatedPages.push(currentPage);
          currentPage = [];
          currentPageHeight = 0;
        }

        currentPage.push(child);
        currentPageHeight += childHeight;
      });

      if (currentPage.length > 0) {
        calculatedPages.push(currentPage);
      }
      
      setPages(calculatedPages);
      if (onReady) onReady(); // Signal that layout calculation is complete

    }, 200);

    return () => clearTimeout(timer);
  }, [children, onReady]);

  // Phase 1: Measure content off-screen
  if (!pages) {
    return (
      <div 
        ref={measurementContainerRef}
        style={{ position: 'absolute', top: '-9999px', left: '0px', width: '210mm' }}
      >
        {children}
      </div>
    );
  }

  // Phase 2: Display the paginated content
  return (
    <div id="resume-content-to-print">
      {pages.map((pageContent, i) => (
        <A4Page key={i}>
          {pageContent}
        </A4Page>
      ))}
    </div>
  );
};

// This component contains the actual content of your resume.
const ResumeContent = () => (
    <>
      <ContentBlock>
        <header className="flex items-center w-full mb-5">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800">Selva</h1>
            <p className="text-lg font-medium text-blue-800">Computer Science & Engineering Student</p>
            <div className="flex items-center text-xs text-gray-600 mt-2 space-x-4 flex-wrap">
              <div className="flex items-center"><Mail size={12} className="mr-1.5" /><span>email@gmail.com</span></div>
              <div className="flex items-center"><Phone size={12} className="mr-1.5" /><span>+91 6380899737</span></div>
              <div className="flex items-center"><MapPin size={12} className="mr-1.5" /><span>Erode, Tamil Nadu</span></div>
            </div>
            <div className="flex items-center text-xs text-gray-600 mt-1.5 space-x-4 flex-wrap">
              <a href="https://github.com/selva" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-600"><Github size={12} className="mr-1.5" /><span>github.com/selva</span></a>
              <a href="https://linkedin.com/in/selva" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-600"><Linkedin size={12} className="mr-1.5" /><span>linkedin.com/in/selva</span></a>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img src={logo} alt="profile" className="rounded-full w-24 h-24 object-cover border-2 border-gray-300" />
          </div>
        </header>
      </ContentBlock>
      
      <ContentBlock><Section title="Education"><div className="flex justify-between items-start text-sm"><div><p className="font-semibold text-gray-800">Bannari Amman Institute of Technology</p><p className="text-gray-600">Bachelor of Engineering - Computer Science</p></div><div className="text-right flex-shrink-0 ml-4"><p className="font-semibold text-gray-700">2024 - 2028</p><p className="text-gray-600">CGPA: 8.5 / 10.0</p></div></div></Section></ContentBlock>
      <ContentBlock><Section title="Areas of Expertise"><AreasOfExpertise /></Section></ContentBlock>
      <ContentBlock><Section title="Projects"><ProjectsForResume /></Section></ContentBlock>
      <ContentBlock><Section title="Accomplishments"><AccomplishmentsForResume /></Section></ContentBlock>
      <ContentBlock><Section title="Personal Skills"><PsDataForResume /></Section></ContentBlock>
      <ContentBlock><Section title="Leadership & Mentorship"><MentorMenteeForResume /></Section></ContentBlock>

      <ContentBlock className="mt-8">
        <Section title="">
          <ActivenessGraphForResume/>
          <div className="mt-3 text-base"><p className="font-semibold text-gray-800 leading-relaxed">This graph illustrates a consistent and high level of engagement within the tech community.</p></div>
        </Section>
      </ContentBlock>

      <ContentBlock className="mt-8">
        <Section title="">
          <AchievementsGraphForResume/>
          <div className="mt-3 text-base"><p className="font-semibold text-gray-800 leading-relaxed">This chart highlights key milestones and recognitions, reflecting a journey of impactful accomplishments.</p></div>
        </Section>
      </ContentBlock>
    </>
);


/**
 * The main component that wraps everything and provides the print functionality.
 */
export default function PrintableResumeView() {
  const [isReady, setIsReady] = useState(false);

  // This function is called when the button is clicked.
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="print-hide bg-gray-100 py-6 text-center">
        <button
          onClick={handlePrint}
          disabled={!isReady}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Printer className="mr-3 -ml-1 h-5 w-5" />
          {isReady ? 'Print or Save as PDF' : 'Loading Preview...'}
        </button>
      </div>
      <ResumePaginator onReady={() => setIsReady(true)}>
        <ResumeContent />
      </ResumePaginator>
    </>
  );
}
