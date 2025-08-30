// src/components/dashboard/graphs/graph1/ActivenessGraphForResume.jsx


import React, { useEffect, useState, useMemo } from "react";
import Plot from "react-plotly.js";
import useAuth from "../../../../store/UseAuth";


const ActivenessGraphForResume = () => {
  // ... (all your state and data fetching logic remains the same) ...
  const { fetchUser, rollno } = useAuth();
  const [activenessData, setActivenessData] = useState([]);
  const [semDayLimits, setSemDayLimits] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => { fetchUser(); }, [fetchUser]);
  useEffect(() => { if (rollno) { handlePoints(); handleSemDays(); } }, [rollno]);
  const handlePoints = async () => { try { const res = await fetch(`${API_URL}api/activity_graph/fetchData/${rollno}`, { method: "GET", headers: { "Content-Type": "application/json" }, credentials: "include", }); if (!res.ok) throw new Error(`HTTP Error: ${res.status}`); const data = await res.json(); setActivenessData(data); } catch (error) { console.error("Fetch error for activeness points:", error); } };
  const handleSemDays = async () => { try { const res = await fetch(`${API_URL}api/sem_wise_totaldays`, { method: "GET", headers: { "Content-Type": "application/json" }, credentials: "include", }); if (!res.ok) throw new Error(`HTTP Error: ${res.status}`); const data = await res.json(); const semMap = {}; data.forEach(item => { semMap[`sem-${item.sem}`] = item.sem_count; }); setSemDayLimits(semMap); } catch (error) { console.error("Fetch error for semester days:", error); } };
  const { points, ticks } = useMemo(() => { let processedPoints = []; let processedTicks = []; const semestersMap = {}; (activenessData || []).forEach((item) => { if (!item || typeof item.sem === "undefined" || !item.currdate) return; const semKey = `sem-${item.sem}`; if (!semestersMap[semKey]) { semestersMap[semKey] = []; } semestersMap[semKey].push({ date: new Date(item.currdate), value: item.current_point, }); }); Object.keys(semestersMap).sort().forEach((sem) => { const dateEntries = semestersMap[sem]; const maxDays = semDayLimits[sem] || 75; const semPoints = dateEntries .sort((a, b) => a.date.getTime() - b.date.getTime()) .slice(0, maxDays); if (semPoints.length) { processedPoints.push(...semPoints); const midIndex = Math.floor(semPoints.length / 2); if (semPoints[midIndex] && semPoints[midIndex].date instanceof Date && !isNaN(semPoints[midIndex].date)) { processedTicks.push({ val: semPoints[midIndex].date, label: sem.toUpperCase().replace("-", " "), }); } } }); processedPoints.sort((a, b) => a.date.getTime() - b.date.getTime()); processedTicks.sort((a, b) => a.val.getTime() - b.val.getTime()); return { points: processedPoints, ticks: processedTicks }; }, [activenessData, semDayLimits]);
  const x = points.map((p) => p.date);
  const y = points.map((p) => p.value);
  const last = y.length > 0 ? y[y.length - 1] : 0;
  const color = last >= 90 ? "#4CAF50" : last >= 80 ? "#FFC107" : "#F44336";
  const fill = last >= 90 ? "rgba(76, 175, 80, 0.1)" : last >= 80 ? "rgba(255, 193, 7, 0.1)" : "rgba(244, 67, 54, 0.1)";


  return (
    <div className="w-full flex flex-col border border-gray-200 p-2 rounded-md">
      <div className="mb-1">
        <h1 className="text-sm font-medium text-gray-800 text-center">
          Overall Activeness Trend
        </h1>
      </div>


      {/* FIXED SMALLER HEIGHT */}
      <div className="flex-grow h-[180px] w-full">
        {points.length > 0 ? (
          <Plot
            data={[
              {
                x, y, type: "scatter", mode: "lines",
                line: { color, width: 2, shape: "spline", smoothing: 1.3 },
                fill: "tozeroy", fillcolor: fill, hoverinfo: 'none',
              },
            ]}
            layout={{
              autosize: true,
              // REDUCED MARGINS
              margin: { l: 25, r: 10, t: 5, b: 30 },
              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "rgba(0,0,0,0)",
              dragmode: false,
              xaxis: {
                type: "date", tickvals: ticks.map((t) => t.val), ticktext: ticks.map((t) => t.label),
                tickmode: "array", showgrid: false, zeroline: false,
                // SMALLER FONT
                tickfont: { family: "Inter, sans-serif", size: 9, color: "#4a5568" },
              },
              yaxis: {
                range: [ Math.min(70, ...y, last - 5), Math.max(100, ...y, last + 5) ],
                showgrid: true, gridcolor: "#e2e8f0", zeroline: false,
                // SMALLER FONT
                tickfont: { family: "Inter, sans-serif", size: 9, color: "#64748b" },
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


export default ActivenessGraphForResume;
