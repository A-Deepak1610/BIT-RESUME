import React, {useState, useEffect} from "react";
import StudentPerformance from "./leftPanel";
import GraphVisual from "./rightPanel";
import {Search} from "lucide-react";
import useAuth from "../../../store/UseAuth";

export default function StudentDashboardPage() {
  const [mentees, setMentees] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const {rollno} = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleStudentsData = async () => {
    if (!rollno) return;
    try {
      const response = await fetch(`${API_URL}api/studentdata/fetchmentees`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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

  return (
    <div className="relative flex flex-col lg:flex-row h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden p-4 border-b border-gray-200 bg-white flex justify-between items-center sticky top-0 z-10">
        <div className="flex-1">
          <div className="text-xl font-bold text-gray-800 truncate">
            {studentName ? studentName : "Select a Student"}
          </div>
          {studentRoll && (
            <div className="text-sm text-gray-500">Roll: {studentRoll}</div>
          )}
        </div>
        <button
          onClick={() => setIsPanelOpen(true)}
          className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg"
          aria-label="Search students"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Left Panel (Student List) */}
      <div
        className={`
          transition-transform duration-300 ease-in-out
          lg:w-[35%] xl:w-[28%] lg:border-r lg:border-gray-200
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

        <div className="relative w-full max-w-lg lg:max-w-full h-full bg-gray-50">
          <StudentPerformance
            datas={mentees}
            selectedStudentName={studentName}
            onStudentSelect={handleStudentSelect}
            onClose={() => setIsPanelOpen(false)}
          />
        </div>
      </div>

      {/* Right Panel (Student Details) */}
      <div className="flex-1 lg:w-[65%] xl:w-[72%] overflow-y-auto">
        <GraphVisual name={studentName} roll={studentRoll} />
      </div>
    </div>
  );
}
