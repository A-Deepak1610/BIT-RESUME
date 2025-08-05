import React, { useState, useEffect } from "react";
import StudentPerformance from "./leftPanel";
import data from "../../../dummydatas/faculty-mentees.json";
import GraphVisual from "./rightPanel";
import { Search } from "lucide-react";

export default function StudentDashboardPage() {
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile view on initial render and window resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Tailwind's 'lg' breakpoint
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Handler to set student and close the panel
  const handleStudentSelect = (student) => {
    setStudentName(student.name);
    setStudentRoll(student.rollNo);
    setIsPanelOpen(false);
  };

  // On large screens, select the first student by default for a better initial view
  useEffect(() => {
    if (!isMobile && data.length > 0) {
      setStudentName(data[0].name);
      setStudentRoll(data[0].rollNo);
    }
  }, [isMobile]);

  return (
    <div className="relative flex flex-col lg:flex-row h-screen bg-slate-50">
      {/* --- Mobile Header & Search Button --- */}
      <div className="lg:hidden p-4 border-b border-gray-300 bg-white flex justify-between items-center sticky top-0 z-10">
        <div className="text-xl font-bold text-gray-800 truncate">
          {studentName ? `${studentName}` : "Select a Student"}
        </div>
        <button
          onClick={() => setIsPanelOpen(true)}
          className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg"
          aria-label="Search students"
        >
          <Search size={20} />
        </button>
      </div>

      {/* --- Left Panel (Sidebar/Modal) --- */}
      <div
        className={`
          transition-transform duration-300 ease-in-out
          lg:w-[40%] xl:w-[30%] lg:border-r lg:border-gray-300
          ${isPanelOpen ? "block" : "hidden"}
          lg:block
          fixed inset-0 z-30 lg:static lg:z-auto
        `}
      >
        {/* Modal Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 lg:hidden" 
          onClick={() => setIsPanelOpen(false)}
        ></div>
        
        <div className="relative w-full max-w-lg lg:max-w-full h-full bg-slate-50">
          <StudentPerformance
            datas={data}
            selectedStudentName={studentName}
            onStudentSelect={handleStudentSelect}
            onClose={() => setIsPanelOpen(false)}
          />
        </div>
      </div>

      {/* --- Right Panel --- */}
      <div className="w-full lg:w-[60%] xl:w-[70%] p-4 overflow-y-auto">
        <GraphVisual name={studentName} roll={studentRoll} />
      </div>
    </div>
  );
}