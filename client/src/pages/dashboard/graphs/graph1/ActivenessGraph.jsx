import React, { useEffect, useState, useMemo, useRef, use } from "react";
import Plot from "react-plotly.js";
import useAuth from "../../../../store/UseAuth";
// import activenessData from "../../../../dummydatas/activenessNew.json";

const ActivenessGraph = (props) => {
  const [viewMode, setViewMode] = useState("year");
  const [currentSemester, setCurrentSemester] = useState("sem-1");
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isSemDropdownOpen, setIsSemDropdownOpen] = useState(false);
  const viewDropdownRef = useRef(null);
  const semDropdownRef = useRef(null);
  const {fetchUser,rollno}=useAuth();
  const student_rollno=props.rollno||rollno;
  console.log("Student Roll No:", student_rollno);
  useEffect(() => {
    fetchUser();
  }, []);
  const [activenessData, setActivenessData] = useState([]);
  const API_URL=import.meta.env.VITE_API_URL
  useEffect(() => {
    handlePoints();handleSemDays();
  }, [student_rollno]);
  const sendData = async (payload) =>{
    try {
      const response = await fetch(`${API_URL}api/points_logs/ps/attempts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
  
      // console.log("Sent:", payload);
    } catch (error) {
      console.error("Error sending data:", error.message);
    }
  };
  const handlePoints = async () => {
    try {
      const res = await fetch(
        `${API_URL}api/activity_graph/fetchData/${student_rollno}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      const data = await res.json();
      console.log("Data fetched  successfully for activeness graph:", data);
      setActivenessData(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        viewDropdownRef.current &&
        !viewDropdownRef.current.contains(event.target)
      ) {
        setIsViewDropdownOpen(false);
      }
      if (
        semDropdownRef.current &&
        !semDropdownRef.current.contains(event.target)
      ) {
        setIsSemDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [semDayLimits, setSemDayLimits] = useState({});
  const handleSemDays=async()=>{
    try {
      const res = await fetch(`${API_URL}api/sem_wise_totaldays`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      const data = await res.json();
      const semMap = {};
      data.forEach(item => {
        semMap[`sem-${item.sem}`] = item.sem_count;
      });
      setSemDayLimits(semMap);
      console.log("total sem by days:", data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
  const { points, ticks, semesters } = useMemo(() => {
    let processedPoints = [];
    let processedTicks = [];
    const semestersMap = {};
  
    (activenessData || []).forEach((item) => {
      if (
        !item ||
        typeof item.sem === "undefined" ||
        typeof item.currdate === "undefined" ||
        typeof item.current_point === "undefined"
      ) {
        return;
      }
      const semKey = `sem-${item.sem}`;
      if (!semestersMap[semKey]) {
        semestersMap[semKey] = [];
      }
      semestersMap[semKey].push({
        date: new Date(item.currdate),
        value: item.current_point,
      });
    });
  
    const semesterKeys = Object.keys(semestersMap).sort();
  
    if (semesterKeys.length > 0 && !semesterKeys.includes(currentSemester)) {
      setCurrentSemester(semesterKeys[0]);
    }
  
    semesterKeys.forEach((sem) => {
      const dateEntries = semestersMap[sem];
      const maxDays = semDayLimits[sem] || 75; // fallback to 75 if not available
  
      const semPoints = dateEntries
        .map((entry) => ({ ...entry, semester: sem }))
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, maxDays);
  
      semPoints.forEach((p, i) => {
        p.gain =
          i === 0
            ? 0
            : parseFloat((p.value - semPoints[i - 1].value).toFixed(2));
      });
  
      if (semPoints.length) {
        processedPoints.push(...semPoints);
        const midIndex = Math.floor(semPoints.length / 2);
        if (
          semPoints[midIndex] &&
          semPoints[midIndex].date instanceof Date &&
          !isNaN(semPoints[midIndex].date)
        ) {
          processedTicks.push({
            val: semPoints[midIndex].date,
            label: sem.toUpperCase().replace("-", " "),
          });
        }
      }
    });
  
    processedPoints.sort((a, b) => a.date.getTime() - b.date.getTime());
    processedTicks.sort((a, b) => a.val.getTime() - b.val.getTime());
  
    return {
      points: processedPoints,
      ticks: processedTicks,
      semesters: semesterKeys,
    };
  }, [activenessData, semDayLimits]);
  // `currentSemester` was removed from dependency array as it's now set within the memo

  useEffect(() => {
    if (semesters.length > 0 && !semesters.includes(currentSemester)) {
      setCurrentSemester(semesters[0]);
    } else if (semesters.length === 0) {
      setCurrentSemester(""); // Or some other default state if no semesters
    }
  }, [semesters, currentSemester]);

  const filtered = useMemo(
    () =>
      viewMode === "sem"
        ? points.filter((p) => p.semester === currentSemester)
        : points,
    [viewMode, currentSemester, points]
  );

  const x = filtered.map((p) => p.date);
  const y = filtered.map((p) => p.value);
  const gains = filtered.map((p) => p.gain);
  const last = y.length > 0 ? y[y.length - 1] : 0;

  const color = last >= 90 ? "#22C55E" : last >= 80 ? "#FFD700" : "#DC2626";
  const fill =
    last >= 90
      ? "rgba(34, 197, 94, 0.15)"
      : last >= 80
      ? "rgba(255, 215, 0, 0.15)"
      : "rgba(220, 38, 38, 0.15)";

  // Calculate y-axis range for color zones
  const yMin = y.length > 0 ? Math.min(70, ...y, last - 5) : 70;
  const yMax = y.length > 0 ? Math.max(100, ...y, last + 5) : 100;
  const xMin = x.length > 0 ? x[0] : new Date();
  const xMax = x.length > 0 ? x[x.length - 1] : new Date();

  // Create background color zones data
  const createColorZones = () => {
    if (x.length === 0) return [];

    return [
      // Red zone (below 80)
      {
        type: "scatter",
        mode: "none",
        x: [xMin, xMax, xMax, xMin, xMin],
        y: [yMin, yMin, 80, 80, yMin],
        fill: "toself",
        fillcolor: "rgba(220, 38, 38, 0.08)",
        line: { width: 0 },
        showlegend: false,
        hoverinfo: "none",
      },
      // Yellow zone (80-90)
      {
        type: "scatter",
        mode: "none",
        x: [xMin, xMax, xMax, xMin, xMin],
        y: [80, 80, 90, 90, 80],
        fill: "toself",
        fillcolor: "rgba(255, 215, 0, 0.08)",
        line: { width: 0 },
        showlegend: false,
        hoverinfo: "none",
      },
      // Green zone (90-100)
      {
        type: "scatter",
        mode: "none",
        x: [xMin, xMax, xMax, xMin, xMin],
        y: [90, 90, yMax, yMax, 90],
        fill: "toself",
        fillcolor: "rgba(34, 197, 94, 0.08)",
        line: { width: 0 },
        showlegend: false,
        hoverinfo: "none",
      }
    ];
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setIsViewDropdownOpen(false);
  };

  const handleSemesterChange = (sem) => {
    setCurrentSemester(sem);
    setIsSemDropdownOpen(false);
  };

  const renderDesktopControls = () => (
    <div className="hidden sm:flex items-center space-x-2">
      <button
        onClick={() => handleViewModeChange("year")}
        className={`px-4 py-1 w-20 text-sm font-semibold outline-primary transition-all duration-200 rounded-lg ${
          viewMode === "year"
            ? "bg-[#2D4BFF] text-white"
            : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
        }`}
        style={{ cursor: "pointer" }}
      >
        Year
      </button>

      <div className="relative" ref={semDropdownRef}>
        <button
          onClick={() => setIsSemDropdownOpen(!isSemDropdownOpen)}
          disabled={semesters.length === 0}
          className={`flex outline-primary items-center justify-between px-4 py-1 w-28 text-sm font-semibold transition-all duration-200 rounded-lg ${
            viewMode === "sem"
              ? "bg-[#2D4BFF] text-white"
              : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
          } ${semesters.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{ cursor: semesters.length > 0 ? "pointer" : "not-allowed" }}
        >
          <span
            onClick={(e) => {
              if (semesters.length === 0) return;
              e.stopPropagation();
              handleViewModeChange("sem");
            }}
          >
            {semesters.length > 0 && semesters.includes(currentSemester)
              ? currentSemester.toUpperCase().replace("-", " ")
              : semesters.length > 0
              ? "Semester"
              : "N/A"}
          </span>
          {semesters.length > 0 && (
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </button>

        {isSemDropdownOpen && semesters.length > 0 && (
          <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
            {semesters.map((sem) => (
              <button
                key={sem}
                onClick={() => {
                  handleViewModeChange("sem");
                  handleSemesterChange(sem);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  viewMode === "sem" && currentSemester === sem
                    ? "font-bold text-[#2D4BFF]"
                    : "text-gray-700"
                } hover:bg-gray-100`}
              >
                {sem.toUpperCase().replace("-", " ")}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderMobileControls = () => (
    <div className="sm:hidden relative" ref={viewDropdownRef}>
      <button
        onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
        disabled={semesters.length === 0 && viewMode === "sem"} // Disable if no semesters and trying to select semester view
        className={`flex items-center space-x-1 px-3 py-1 bg-[#2D4BFF] text-white border border-transparent rounded-md shadow-sm ${
          semesters.length === 0 && viewMode === "sem"
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        <span className="text-sm font-medium">
          {viewMode === "sem"
            ? `${
                semesters.length > 0 && semesters.includes(currentSemester)
                  ? currentSemester.toUpperCase().replace("-", " ")
                  : semesters.length > 0
                  ? "Semester"
                  : "N/A"
              }`
            : "Year"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isViewDropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isViewDropdownOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
          <button
            onClick={() => handleViewModeChange("year")}
            className={`block w-full text-left px-4 py-2 text-sm ${
              viewMode === "year" ? "font-bold text-[#2D4BFF]" : "text-gray-700"
            } hover:bg-gray-100`}
          >
            Year
          </button>

          {semesters.length > 0 && (
            <div className="border-t border-gray-100 mt-1 pt-1">
              <div className="px-4 py-1 text-xs font-medium text-gray-500">
                SEMESTER VIEW
              </div>
              {semesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => {
                    handleViewModeChange("sem");
                    handleSemesterChange(sem);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    viewMode === "sem" && currentSemester === sem
                      ? "font-bold text-[#2D4BFF]"
                      : "text-gray-700"
                  } hover:bg-gray-100`}
                >
                  {sem.toUpperCase().replace("-", " ")}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex absolute mt-[-20px] gap-2">
      </div>
      <div className="flex justify-between items-center mb-3">
        <h1 onClick={handlePoints} className="text-lg md:text-xl font-medium text-gray-800">
          Activeness Graph
        </h1>
        {renderDesktopControls()}
        {renderMobileControls()}
      </div>

      <div className="flex-grow min-h-0">
        {points.length > 0 ? (
          <Plot
            data={[
              // Background color zones first (so they appear behind the line)
              // ...createColorZones(),
              // Main data line
              {
                x,
                y,
                customdata: gains,
                type: "scatter",
                mode: "lines",
                line: {
                  color,
                  width: 3,
                  shape: "spline",
                  smoothing: 1.2,
                },
                marker: { size: 4, color },
                fill: "tozeroy",
                fillcolor: fill,
                showlegend: false,
                hovertemplate:
                  "<b>Date</b>: %{x|%b %d, %Y}<br>" +
                  "<b>Score</b>: %{y}<br>" +
                  "<b>Gained</b>: %{customdata}<extra></extra>",
              },
            ]}
            layout={{
              autosize: true,
              margin: { l: 30, r: 20, t: 10, b: 30 },
              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "rgba(0,0,0,0)",
              dragmode: true,
              xaxis: {
                type: "date",
                tickvals:
                  viewMode === "year" && ticks.length > 0
                    ? ticks.map((t) => t.val)
                    : undefined,
                ticktext:
                  viewMode === "year" && ticks.length > 0
                    ? ticks.map((t) => t.label)
                    : undefined,
                tickmode:
                  viewMode === "year" && ticks.length > 0 ? "array" : "auto",
                showgrid: false,
                zeroline: false,
                title: "",
                tickfont: {
                  family: "Inter, sans-serif",
                  size: 10,
                  color: "#64748b",
                },
              },
              yaxis: {
                range: [yMin, yMax],
                showgrid: true,
                gridcolor: "#eee",
                zeroline: false,
                tickfont: {
                  family: "Inter, sans-serif",
                  size: 10,
                  color: "#64748b",
                },
                // Add horizontal lines at 80 and 90 for clearer zone boundaries
                shapes: [
                  {
                    type: "line",
                    x0: 0,
                    x1: 1,
                    xref: "paper",
                    y0: 80,
                    y1: 80,
                    line: {
                      color: "rgba(255, 215, 0, 0.3)",
                      width: 1,
                      dash: "dot"
                    }
                  },
                  {
                    type: "line",
                    x0: 0,
                    x1: 1,
                    xref: "paper",
                    y0: 90,
                    y1: 90,
                    line: {
                      color: "rgba(34, 197, 94, 0.3)",
                      width: 1,
                      dash: "dot"
                    }
                  }
                ]
              },
              hovermode: "x unified",
              hoverlabel: {
                bgcolor: "#ffffff",
                bordercolor: color,
                font: {
                  family: "Inter, sans-serif",
                  size: 12,
                },
              },
            }}
            config={{
              responsive: true,
              displayModeBar: false,
            }}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler={true}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available to display the graph.
          </div>
        )}
      </div>

      <div className="px-1 sm:px-4 py-2 sm:py-3 border-t border-gray-200 text-sm text-slate-600 w-full">
        <div className="flex flex-row items-center justify-center gap-x-3 sm:gap-x-2 text-center">
          <span className="hidden sm:inline font-medium text-gray-500">
            Performance Level:
          </span>

          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>
            <span className="font-medium">Titanium</span>
            <span className="hidden sm:inline text-xs text-gray-500">
              (90–100)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#FFD700]"></span>
            <span className="font-medium">Gold</span>
            <span className="hidden sm:inline text-xs text-gray-500">
              (80–90)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#DC2626]"></span>
            <span className="font-medium">Silver</span>
            <span className="hidden sm:inline text-xs text-gray-500">(70-80)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivenessGraph;

// import React, { useEffect, useState, useMemo, useRef, use } from "react";
// import Plot from "react-plotly.js";
// import useAuth from "../../../../store/UseAuth";
// import activenessData from "../../../../dummydatas/activenessNew.json";
// const ActivenessGraph = (props) => {
//   const [viewMode, setViewMode] = useState("year");
//   const [currentSemester, setCurrentSemester] = useState("sem-1");
//   const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
//   const [isSemDropdownOpen, setIsSemDropdownOpen] = useState(false);
//   const viewDropdownRef = useRef(null);
//   const semDropdownRef = useRef(null);
//   const {fetchUser,rollno}=useAuth();
//   const student_rollno=props.rollno||rollno;
//   console.log("Student Roll No:", student_rollno);
//   useEffect(() => {
//     fetchUser();
//   }, []);
//   const [activenessData, setActivenessData] = useState([]);
//   const API_URL=import.meta.env.VITE_API_URL
//   useEffect(() => {
//     handlePoints();handleSemDays();
//   }, [student_rollno]);
//   const sendData = async (payload) =>{
//     try {
//       const response = await fetch(`${API_URL}api/points_logs/ps/attempts`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });
  
//       if (!response.ok) {
//         throw new Error(`Server responded with status: ${response.status}`);
//       }
  
//       // console.log("Sent:", payload);
//     } catch (error) {
//       console.error("Error sending data:", error.message);
//     }
//   };
//   const handlePoints = async () => {
//     try {
//       const res = await fetch(
//         `${API_URL}api/activity_graph/fetchData/${student_rollno}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         }
//       );
//       if (!res.ok) {
//         throw new Error(`HTTP Error: ${res.status}`);
//       }
//       const data = await res.json();
//       console.log("Data fetched  successfully for activeness graph:", data);
//       setActivenessData(data);
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }
//   };
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         viewDropdownRef.current &&
//         !viewDropdownRef.current.contains(event.target)
//       ) {
//         setIsViewDropdownOpen(false);
//       }
//       if (
//         semDropdownRef.current &&
//         !semDropdownRef.current.contains(event.target)
//       ) {
//         setIsSemDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
//   const [semDayLimits, setSemDayLimits] = useState({});
//   const handleSemDays=async()=>{
//     try {
//       const res = await fetch(`${API_URL}api/sem_wise_totaldays`,{
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         }
//       );
//       if (!res.ok) {
//         throw new Error(`HTTP Error: ${res.status}`);
//       }
//       const data = await res.json();
//       const semMap = {};
//       data.forEach(item => {
//         semMap[`sem-${item.sem}`] = item.sem_count;
//       });
//       setSemDayLimits(semMap);
//       console.log("total sem by days:", data);
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }
//   }
//   const { points, ticks, semesters } = useMemo(() => {
//     let processedPoints = [];
//     let processedTicks = [];
//     const semestersMap = {};
  
//     (activenessData || []).forEach((item) => {
//       if (
//         !item ||
//         typeof item.sem === "undefined" ||
//         typeof item.currdate === "undefined" ||
//         typeof item.current_point === "undefined"
//       ) {
//         return;
//       }
//       const semKey = `sem-${item.sem}`;
//       if (!semestersMap[semKey]) {
//         semestersMap[semKey] = [];
//       }
//       semestersMap[semKey].push({
//         date: new Date(item.currdate),
//         value: item.current_point,
//       });
//     });
  
//     const semesterKeys = Object.keys(semestersMap).sort();
  
//     if (semesterKeys.length > 0 && !semesterKeys.includes(currentSemester)) {
//       setCurrentSemester(semesterKeys[0]);
//     }
  
//     semesterKeys.forEach((sem) => {
//       const dateEntries = semestersMap[sem];
//       const maxDays = semDayLimits[sem] || 75; // fallback to 75 if not available
  
//       const semPoints = dateEntries
//         .map((entry) => ({ ...entry, semester: sem }))
//         .sort((a, b) => a.date.getTime() - b.date.getTime())
//         .slice(0, maxDays);
  
//       semPoints.forEach((p, i) => {
//         p.gain =
//           i === 0
//             ? 0
//             : parseFloat((p.value - semPoints[i - 1].value).toFixed(2));
//       });
  
//       if (semPoints.length) {
//         processedPoints.push(...semPoints);
//         const midIndex = Math.floor(semPoints.length / 2);
//         if (
//           semPoints[midIndex] &&
//           semPoints[midIndex].date instanceof Date &&
//           !isNaN(semPoints[midIndex].date)
//         ) {
//           processedTicks.push({
//             val: semPoints[midIndex].date,
//             label: sem.toUpperCase().replace("-", " "),
//           });
//         }
//       }
//     });
  
//     processedPoints.sort((a, b) => a.date.getTime() - b.date.getTime());
//     processedTicks.sort((a, b) => a.val.getTime() - b.val.getTime());
  
//     return {
//       points: processedPoints,
//       ticks: processedTicks,
//       semesters: semesterKeys,
//     };
//   }, [activenessData, semDayLimits]);
//   // `currentSemester` was removed from dependency array as it's now set within the memo

//   useEffect(() => {
//     if (semesters.length > 0 && !semesters.includes(currentSemester)) {
//       setCurrentSemester(semesters[0]);
//     } else if (semesters.length === 0) {
//       setCurrentSemester(""); // Or some other default state if no semesters
//     }
//   }, [semesters, currentSemester]);

//   const filtered = useMemo(
//     () =>
//       viewMode === "sem"
//         ? points.filter((p) => p.semester === currentSemester)
//         : points,
//     [viewMode, currentSemester, points]
//   );

//   const x = filtered.map((p) => p.date);
//   const y = filtered.map((p) => p.value);
//   const gains = filtered.map((p) => p.gain);
//   const last = y.length > 0 ? y[y.length - 1] : 0;

//   const color = last >= 90 ? "#22C55E" : last >= 80 ? "#FFD700" : "#DC2626";
//   const fill =
//     last >= 90
//       ? "rgba(34, 197, 94, 0.15)"
//       : last >= 80
//       ? "rgba(255, 215, 0, 0.15)"
//       : "rgba(220, 38, 38, 0.15)";

//   // Calculate y-axis range for color zones
//   const yMin = y.length > 0 ? Math.min(70, ...y, last - 5) : 70;
//   const yMax = y.length > 0 ? Math.max(100, ...y, last + 5) : 100;
//   const xMin = x.length > 0 ? x[0] : new Date();
//   const xMax = x.length > 0 ? x[x.length - 1] : new Date();

//   // Create background color zones data
//   const createColorZones = () => {
//     if (x.length === 0) return [];

//     return [
//       // Red zone (below 80)
//       {
//         type: "scatter",
//         mode: "none",
//         x: [xMin, xMax, xMax, xMin, xMin],
//         y: [yMin, yMin, 80, 80, yMin],
//         fill: "toself",
//         fillcolor: "rgba(220, 38, 38, 0.15)",
//         line: { width: 0 },
//         showlegend: false,
//         hoverinfo: "none",
//       },
//       // Yellow zone (80-90)
//       {
//         type: "scatter",
//         mode: "none",
//         x: [xMin, xMax, xMax, xMin, xMin],
//         y: [80, 80, 90, 90, 80],
//         fill: "toself",
//         fillcolor: "rgba(255, 215, 0, 0.15)",
//         line: { width: 0 },
//         showlegend: false,
//         hoverinfo: "none",
//       },
//       // Green zone (90-100)
//       {
//         type: "scatter",
//         mode: "none",
//         x: [xMin, xMax, xMax, xMin, xMin],
//         y: [90, 90, yMax, yMax, 90],
//         fill: "toself",
//         fillcolor: "rgba(34, 197, 94, 0.15)",
//         line: { width: 0 },
//         showlegend: false,
//         hoverinfo: "none",
//       }
//     ];
//   };

//   const handleViewModeChange = (mode) => {
//     setViewMode(mode);
//     setIsViewDropdownOpen(false);
//   };

//   const handleSemesterChange = (sem) => {
//     setCurrentSemester(sem);
//     setIsSemDropdownOpen(false);
//   };

//   const renderDesktopControls = () => (
//     <div className="hidden sm:flex items-center space-x-2">
//       <button
//         onClick={() => handleViewModeChange("year")}
//         className={`px-4 py-1 w-20 text-sm font-semibold outline-primary transition-all duration-200 rounded-lg ${
//           viewMode === "year"
//             ? "bg-[#2D4BFF] text-white"
//             : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
//         }`}
//         style={{ cursor: "pointer" }}
//       >
//         Year
//       </button>

//       <div className="relative" ref={semDropdownRef}>
//         <button
//           onClick={() => setIsSemDropdownOpen(!isSemDropdownOpen)}
//           disabled={semesters.length === 0}
//           className={`flex outline-primary items-center justify-between px-4 py-1 w-28 text-sm font-semibold transition-all duration-200 rounded-lg ${
//             viewMode === "sem"
//               ? "bg-[#2D4BFF] text-white"
//               : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
//           } ${semesters.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
//           style={{ cursor: semesters.length > 0 ? "pointer" : "not-allowed" }}
//         >
//           <span
//             onClick={(e) => {
//               if (semesters.length === 0) return;
//               e.stopPropagation();
//               handleViewModeChange("sem");
//             }}
//           >
//             {semesters.length > 0 && semesters.includes(currentSemester)
//               ? currentSemester.toUpperCase().replace("-", " ")
//               : semesters.length > 0
//               ? "Semester"
//               : "N/A"}
//           </span>
//           {semesters.length > 0 && (
//             <svg
//               className="w-4 h-4 ml-1"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M19 9l-7 7-7-7"
//               />
//             </svg>
//           )}
//         </button>

//         {isSemDropdownOpen && semesters.length > 0 && (
//           <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
//             {semesters.map((sem) => (
//               <button
//                 key={sem}
//                 onClick={() => {
//                   handleViewModeChange("sem");
//                   handleSemesterChange(sem);
//                 }}
//                 className={`block w-full text-left px-4 py-2 text-sm ${
//                   viewMode === "sem" && currentSemester === sem
//                     ? "font-bold text-[#2D4BFF]"
//                     : "text-gray-700"
//                 } hover:bg-gray-100`}
//               >
//                 {sem.toUpperCase().replace("-", " ")}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderMobileControls = () => (
//     <div className="sm:hidden relative" ref={viewDropdownRef}>
//       <button
//         onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
//         disabled={semesters.length === 0 && viewMode === "sem"} // Disable if no semesters and trying to select semester view
//         className={`flex items-center space-x-1 px-3 py-1 bg-[#2D4BFF] text-white border border-transparent rounded-md shadow-sm ${
//           semesters.length === 0 && viewMode === "sem"
//             ? "opacity-50 cursor-not-allowed"
//             : ""
//         }`}
//       >
//         <span className="text-sm font-medium">
//           {viewMode === "sem"
//             ? `${
//                 semesters.length > 0 && semesters.includes(currentSemester)
//                   ? currentSemester.toUpperCase().replace("-", " ")
//                   : semesters.length > 0
//                   ? "Semester"
//                   : "N/A"
//               }`
//             : "Year"}
//         </span>
//         <svg
//           className={`w-4 h-4 transition-transform duration-200 ${
//             isViewDropdownOpen ? "rotate-180" : ""
//           }`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </button>

//       {isViewDropdownOpen && (
//         <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
//           <button
//             onClick={() => handleViewModeChange("year")}
//             className={`block w-full text-left px-4 py-2 text-sm ${
//               viewMode === "year" ? "font-bold text-[#2D4BFF]" : "text-gray-700"
//             } hover:bg-gray-100`}
//           >
//             Year
//           </button>

//           {semesters.length > 0 && (
//             <div className="border-t border-gray-100 mt-1 pt-1">
//               <div className="px-4 py-1 text-xs font-medium text-gray-500">
//                 SEMESTER VIEW
//               </div>
//               {semesters.map((sem) => (
//                 <button
//                   key={sem}
//                   onClick={() => {
//                     handleViewModeChange("sem");
//                     handleSemesterChange(sem);
//                   }}
//                   className={`block w-full text-left px-4 py-2 text-sm ${
//                     viewMode === "sem" && currentSemester === sem
//                       ? "font-bold text-[#2D4BFF]"
//                       : "text-gray-700"
//                   } hover:bg-gray-100`}
//                 >
//                   {sem.toUpperCase().replace("-", " ")}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex absolute mt-[-20px] gap-2">
//       </div>
//       <div className="flex justify-between items-center mb-3">
//         <h1 onClick={handlePoints} className="text-lg md:text-xl font-medium text-gray-800">
//           Activeness Graph
//         </h1>
//         {renderDesktopControls()}
//         {renderMobileControls()}
//       </div>

//       <div className="flex-grow min-h-0">
//         {points.length > 0 ? (
//           <Plot
//             data={[
//               // Background color zones first (so they appear behind the line)
//               ...createColorZones(),
//               // Main data line
//               {
//                 x,
//                 y,
//                 customdata: gains,
//                 type: "scatter",
//                 mode: "lines",
//                 line: {
//                   color,
//                   width: 3,
//                   shape: "spline",
//                   smoothing: 1.2,
//                 },
//                 marker: { size: 4, color },
//                 showlegend: false,
//                 hovertemplate:
//                   "<b>Date</b>: %{x|%b %d, %Y}<br>" +
//                   "<b>Score</b>: %{y}<br>" +
//                   "<b>Gained</b>: %{customdata}<extra></extra>",
//               },
//             ]}
//             layout={{
//               autosize: true,
//               margin: { l: 30, r: 20, t: 10, b: 30 },
//               paper_bgcolor: "rgba(0,0,0,0)",
//               plot_bgcolor: "rgba(0,0,0,0)",
//               dragmode: true,//make false if needed 
//               xaxis: {
//                 type: "date",
//                 tickvals:
//                   viewMode === "year" && ticks.length > 0
//                     ? ticks.map((t) => t.val)
//                     : undefined,
//                 ticktext:
//                   viewMode === "year" && ticks.length > 0
//                     ? ticks.map((t) => t.label)
//                     : undefined,
//                 tickmode:
//                   viewMode === "year" && ticks.length > 0 ? "array" : "auto",
//                 showgrid: false,
//                 zeroline: false,
//                 title: "",
//                 tickfont: {
//                   family: "Inter, sans-serif",
//                   size: 10,
//                   color: "#64748b",
//                 },
//               },
//               yaxis: {
//                 range: [yMin, yMax],
//                 showgrid: true,
//                 gridcolor: "#eee",
//                 zeroline: false,
//                 tickfont: {
//                   family: "Inter, sans-serif",
//                   size: 10,
//                   color: "#64748b",
//                 },
//                 // Add horizontal lines at 80 and 90 for clearer zone boundaries
//                 shapes: [
//                   {
//                     type: "line",
//                     x0: 0,
//                     x1: 1,
//                     xref: "paper",
//                     y0: 80,
//                     y1: 80,
//                     line: {
//                       color: "rgba(255, 215, 0, 0.3)",
//                       width: 1,
//                       dash: "dot"
//                     }
//                   },
//                   {
//                     type: "line",
//                     x0: 0,
//                     x1: 1,
//                     xref: "paper",
//                     y0: 90,
//                     y1: 90,
//                     line: {
//                       color: "rgba(34, 197, 94, 0.3)",
//                       width: 1,
//                       dash: "dot"
//                     }
//                   }
//                 ]
//               },
//               hovermode: "x unified",
//               hoverlabel: {
//                 bgcolor: "#ffffff",
//                 bordercolor: color,
//                 font: {
//                   family: "Inter, sans-serif",
//                   size: 12,
//                 },
//               },
//             }}
//             config={{
//               responsive: true,
//               displayModeBar: false,
//             }}
//             style={{ width: "100%", height: "100%" }}
//             useResizeHandler={true}
//           />
//         ) : (
//           <div className="flex items-center justify-center h-full text-gray-500">
//             No data available to display the graph.
//           </div>
//         )}
//       </div>

//       <div className="px-1 sm:px-4 py-2 sm:py-3 border-t border-gray-200 text-sm text-slate-600 w-full">
//         <div className="flex flex-row items-center justify-center gap-x-3 sm:gap-x-2 text-center">
//           <span className="hidden sm:inline font-medium text-gray-500">
//             Performance Level:
//           </span>

//           <div className="flex items-center gap-1">
//             <span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>
//             <span className="font-medium">Titanium</span>
//             <span className="hidden sm:inline text-xs text-gray-500">
//               (90–100)
//             </span>
//           </div>

//           <div className="flex items-center gap-1">
//             <span className="w-3 h-3 rounded-full bg-[#FFD700]"></span>
//             <span className="font-medium">Gold</span>
//             <span className="hidden sm:inline text-xs text-gray-500">
//               (80–90)
//             </span>
//           </div>

//           <div className="flex items-center gap-1">
//             <span className="w-3 h-3 rounded-full bg-[#DC2626]"></span>
//             <span className="font-medium">Silver</span>
//             <span className="hidden sm:inline text-xs text-gray-500">(70-80)</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ActivenessGraph;