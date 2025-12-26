import React, { useState, useEffect } from "react";
import StudentPerformance from "./leftPanel";
import GraphVisual from "./rightPanel";
import { Search } from "lucide-react";
import useAuth from "../../../store/UseAuth";

export default function StudentDashboardPage() {
  const [mentees, setMentees] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { rollno ,role} = useAuth(); //this is mentor rollno
  console.log(role)
  const API_URL = import.meta.env.VITE_API_URL;
  const handleStudentsData = async () => {
    if (!rollno) return;
    try {
      const response = await fetch(`${API_URL}api/studentdata/fetchmentees`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json" ,
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setMentees(result.mentees || []);
    } catch (error) {
      console.error("Error fetching students data:", error);
    }
  };

  useEffect(() => {
    handleStudentsData();
  }, [rollno]);

  useEffect(() => {
    if (!isMobile && mentees.length > 0) {
      setStudentName(mentees[0].user_name);
      setStudentRoll(mentees[0].rollno);
    }
  }, [isMobile, mentees]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleStudentSelect = (student) => {
    setStudentName(student.user_name);
    setStudentRoll(student.rollno);
    setIsPanelOpen(false);
  };

  const filteredMentees = mentees.filter(
    (mentee) =>
      mentee.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentee.rollno.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <input
            type="text"
            placeholder="Search by name or rollno"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <StudentPerformance
            datas={filteredMentees}
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