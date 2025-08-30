// src/components/dashboard/graphs/grpah2/AchievementsGraphForResume.jsx


import React, { useEffect, useState, useMemo } from "react";
import Plot from "react-plotly.js";
import useAuth from "../../../../store/UseAuth";


const AchievementsGraphForResume = () => {
  // ... (all your state and data fetching logic remains the same) ...
  const [primaryColor] = useState("#2D4BFF");
  const [secondaryColor] = useState("#FFA500");
  const [achivementsPointsData, setAchivementsPointsData] = useState([]);
  const [achivementPointsStudentData, setAchivementPointsStudentData] = useState([]);
  const { rollno } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => { const handlePoints = async () => { if (!rollno) return; try { const res = await fetch(`${API_URL}api/achievement_graph/fetchData/${rollno}`, { method: "GET", headers: { "Content-Type": "application/json" }, credentials: "include", }); if (!res.ok) throw new Error(`HTTP Error: ${res.status}`); const data = await res.json(); setAchivementPointsStudentData(data); } catch (error) { console.error("Fetch error (Student Achievements):", error); } }; const handleInstituteAvg = async () => { try { const res = await fetch(`${API_URL}api/achievement_graph/institute_avg/fetchData`, { method: "GET", headers: { "Content-Type": "application/json" }, credentials: "include", }); if (!res.ok) throw new Error(`HTTP Error: ${res.status}`); const data = await res.json(); setAchivementsPointsData(data); } catch (error) { console.error("Fetch error (Institute Average):", error); } }; handleInstituteAvg(); handlePoints(); }, [rollno, API_URL]);
  const processData = (rawData) => { if (!Array.isArray(rawData) || rawData.length === 0) { return { points: [], ticks: [] }; } const points = rawData .map(item => { if (!item || typeof item.currdate === 'undefined' || typeof item.cummulative_points === 'undefined' || typeof item.sem === 'undefined') { return null; } return { date: new Date(item.currdate), value: item.cummulative_points, semester: `sem-${item.sem}` }; }) .filter(p => p !== null) .sort((a, b) => a.date - b.date); const ticks = []; if (points.length > 0) { const pointsBySemester = points.reduce((acc, p) => { acc[p.semester] = acc[p.semester] || []; acc[p.semester].push(p); return acc; }, {}); Object.entries(pointsBySemester).forEach(([semesterKey, semesterPoints]) => { if (semesterPoints.length > 0) { const midIdx = Math.floor(semesterPoints.length / 2); ticks.push({ val: semesterPoints[midIdx].date, label: semesterKey.toUpperCase().replace("-", " "), }); } }); ticks.sort((a, b) => a.val - b.val); } return { points, ticks }; };
  const { points: averagePoints, ticks: semesterTicks } = useMemo( () => processData(achivementsPointsData), [achivementsPointsData] );
  const { points: studentPoints } = useMemo( () => processData(achivementPointsStudentData), [achivementPointsStudentData] );
  const yAxisRange = useMemo(() => { const allValues = [ ...averagePoints.map(p => p.value), ...studentPoints.map(p => p.value) ]; if (allValues.length === 0) return [0, 10]; const minVal = Math.min(...allValues); const maxVal = Math.max(...allValues); const padding = (maxVal - minVal) * 0.1 || 5; return [Math.max(0, minVal - padding), maxVal + padding]; }, [averagePoints, studentPoints]);


  return (
    <div className="w-full flex flex-col border border-gray-200 p-2 rounded-md">
      <div className="mb-1">
        <h1 className="text-sm font-medium text-gray-800 text-center">
          Achievement Growth
        </h1>
      </div>


      {/* FIXED SMALLER HEIGHT TO MATCH THE OTHER GRAPH */}
      <div className="flex-grow min-h-0 w-full h-[180px]">
        {(averagePoints.length > 0 || studentPoints.length > 0) ? (
            <Plot
              data={[
                { x: studentPoints.map((p) => p.date), y: studentPoints.map((p) => p.value), type: "scatter", mode: "lines", name: "Your Points", line: { color: secondaryColor, width: 2 }, hoverinfo: 'none' },
                { x: averagePoints.map((p) => p.date), y: averagePoints.map((p) => p.value), type: "scatter", mode: "lines", name: "Average", line: { color: primaryColor, width: 2 }, hoverinfo: 'none' }
              ]}
              layout={{
                autosize: true,
                // REDUCED MARGINS
                margin: { l: 35, r: 10, t: 5, b: 30 },
                dragmode: false,
                xaxis: {
                  type: "date", tickvals: semesterTicks.map((t) => t.val), ticktext: semesterTicks.map((t) => t.label),
                  tickmode: "array", showgrid: false, zeroline: false,
                  // SMALLER FONT
                  tickfont: { size: 9 },
                },
                yaxis: {
                  range: yAxisRange, showgrid: true, gridcolor: "#eee", zeroline: false,
                  // SMALLER FONT
                  title: { text: "Points", font: { size: 10 } },
                  tickfont: { size: 9 },
                },
                legend: {
                  x: 0.5, xanchor: 'center', y: 1.15, orientation: 'h', font: { size: 10 }
                },
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: "100%", height: "100%" }}
              useResizeHandler={true}
            />
        ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                Loading...
            </div>
        )}
      </div>
    </div>
  );
};


export default AchievementsGraphForResume;

