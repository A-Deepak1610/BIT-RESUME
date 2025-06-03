// StudentDashboardPage.js
import React, { useState } from "react"; // Removed unused 'use' import
import StudentPerformance from "./leftPanel";
import studentJsonData from "../../../dummydatas/faculty-mentees.json";
import GraphVisual from "./rightPanel"; // Corrected import name

export default function StudentDashboardPage() {
  const [studentName, setStudentName] = useState(""); // Renamed setter for convention (optional)
  const [studentRoll, setStudentRoll] = useState(""); // Renamed setter for convention (optional)

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="w-[40%] border-r border-gray-300">
        <StudentPerformance
          datas={studentJsonData}
          name={studentName}
          setName={setStudentName}
          roll={studentRoll}
          setRoll={setStudentRoll}
        />
      </div>
      <div className="w-[60%] p-4"> 
        <GraphVisual name={studentName} roll={studentRoll} />
      </div>
    </div>
  );
}