import React, { useEffect, useState, useMemo } from "react";
import Plot from "react-plotly.js";
import useAuth from "../../../../store/UseAuth";

/**
 * A non-interactive version of the AchievementsGraph, designed for static display
 * in a resume. It shows the student's achievement growth compared to the
 * institute average across all available semesters.
 */
const AchievementsGraphForResume = () => {
  const [primaryColor] = useState("#2D4BFF");
  const [secondaryColor] = useState("#FFA500");
  const [achivementsPointsData, setAchivementsPointsData] = useState([]);
  const [achivementPointsStudentData, setAchivementPointsStudentData] = useState([]);
  const { rollno } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch student and institute data when the component mounts or rollno changes
  useEffect(() => {
    const handlePoints = async () => {
      if (!rollno) return;
      try {
        const res = await fetch(`${API_URL}api/achievement_graph/fetchData/${rollno}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();
        setAchivementPointsStudentData(data);
      } catch (error) {
        console.error("Fetch error (Student Achievements):", error);
      }
    };

    const handleInstituteAvg = async () => {
      try {
        const res = await fetch(`${API_URL}api/achievement_graph/institute_avg/fetchData`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();
        setAchivementsPointsData(data);
      } catch (error) {
        console.error("Fetch error (Institute Average):", error);
      }
    };

    handleInstituteAvg();
    handlePoints();
  }, [rollno, API_URL]);


  // Memoized function to process raw data into a format Plotly can use
  const processData = (rawData) => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return { points: [], ticks: [] };
    }

    const points = rawData
      .map(item => {
        if (!item || typeof item.currdate === 'undefined' || typeof item.cummulative_points === 'undefined' || typeof item.sem === 'undefined') {
          return null;
        }
        return {
          date: new Date(item.currdate),
          value: item.cummulative_points,
          semester: `sem-${item.sem}`
        };
      })
      .filter(p => p !== null)
      .sort((a, b) => a.date - b.date);

    const ticks = [];
    if (points.length > 0) {
      const pointsBySemester = points.reduce((acc, p) => {
        acc[p.semester] = acc[p.semester] || [];
        acc[p.semester].push(p);
        return acc;
      }, {});

      Object.entries(pointsBySemester).forEach(([semesterKey, semesterPoints]) => {
        if (semesterPoints.length > 0) {
          const midIdx = Math.floor(semesterPoints.length / 2);
          ticks.push({
            val: semesterPoints[midIdx].date,
            label: semesterKey.toUpperCase().replace("-", " "),
          });
        }
      });
      ticks.sort((a, b) => a.val - b.val);
    }
    return { points, ticks };
  };

  const { points: averagePoints, ticks: semesterTicks } = useMemo(
    () => processData(achivementsPointsData),
    [achivementsPointsData]
  );

  const { points: studentPoints } = useMemo(
    () => processData(achivementPointsStudentData),
    [achivementPointsStudentData]
  );

  const yAxisRange = useMemo(() => {
    const allValues = [
      ...averagePoints.map(p => p.value),
      ...studentPoints.map(p => p.value)
    ];
    if (allValues.length === 0) return [0, 10];
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const padding = (maxVal - minVal) * 0.1 || 5;
    return [Math.max(0, minVal - padding), maxVal + padding];
  }, [averagePoints, studentPoints]);

  return (
    <div className="h-[200] w-full flex flex-col">
      <div className="mb-2">
        <h1 className="text-lg font-medium text-gray-800 text-center">
          Achievement graph
        </h1>
      </div>

      <div className="flex-grow min-h-0 w-full">
        {(averagePoints.length > 0 || studentPoints.length > 0) ? (
            <Plot
              data={[
                {
                  x: studentPoints.map((p) => p.date),
                  y: studentPoints.map((p) => p.value),
                  type: "scatter",
                  mode: "lines",
                  name: "Your Points",
                  line: { color: secondaryColor, width: 2.5 },
                  hoverinfo: 'none', // Disable hover text
                },
                {
                  x: averagePoints.map((p) => p.date),
                  y: averagePoints.map((p) => p.value),
                  type: "scatter",
                  mode: "lines",
                  name: "Average Points",
                  line: { color: primaryColor, width: 2.5 },
                  hoverinfo: 'none', // Disable hover text
                }
              ]}
              layout={{
                autosize: true,
                margin: { l: 40, r: 20, t: 10, b: 40 },
                dragmode: false,
                showlegend: true,
                xaxis: {
                  type: "date",
                  tickvals: semesterTicks.map((t) => t.val),
                  ticktext: semesterTicks.map((t) => t.label),
                  tickmode: "array",
                  showgrid: false,
                  zeroline: false,
                },
                yaxis: {
                  range: yAxisRange,
                  showgrid: true,
                  gridcolor: "#eee",
                  zeroline: true,
                  zerolinecolor: "#ccc",
                  title: { text: "Cumulative Points", font: { size: 12 } },
                },
                legend: {
                  x: 0.5,
                  xanchor: 'center',
                  y: -0.3, // Position legend below the x-axis
                  orientation: 'h',
                },
              }}
              config={{
                responsive: true,
                displayModeBar: false, // Hide the Plotly mode bar
              }}
              style={{ width: "100%", height: "100%" }}
              useResizeHandler={true}
            />
        ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
                Loading achievement data...
            </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsGraphForResume;