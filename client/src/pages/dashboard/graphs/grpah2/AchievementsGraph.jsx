import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Plot from "react-plotly.js";
import achivementsPointsDataFromFile from "../../../../dummydatas/achivementPoints.json";
import achivementPointsStudentDataFromFile from "../../../../dummydatas/achivementPointsStudent.json";
import useAuth from "../../../../store/UseAuth";

const AchievementsGraph = React.memo((props) => {
  const [primaryColor, setPrimaryColor] = useState("#2D4BFF");
  const [secondaryColor] = useState("#FFA500");
  const [viewMode, setViewMode] = useState("year");
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [currentSemester, setCurrentSemester] = useState("sem-1");
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isSemDropdownOpen, setIsSemDropdownOpen] = useState(false);
  const [achivementsPointsData, setAchivementsPointsData] = useState(achivementsPointsDataFromFile);
  const [achivementPointsStudentData, setAchivementPointsStudentData] = useState(achivementPointsStudentDataFromFile);
  const [isLoading, setIsLoading] = useState(false);
  const [dataStable, setDataStable] = useState(false);
  
  const viewDropdownRef = useRef(null);
  const semDropdownRef = useRef(null);
  const dataFetchedRef = useRef({ student: false, institute: false });
  const { fetchUser, rollno } = useAuth();
  const student_rollno = props.rollno || '-';

  const API_URL = import.meta.env.VITE_API_URL;

  // Memoize API call functions with proper error handling and state management
  const handlePoints = useCallback(async () => {
    if (!student_rollno || dataFetchedRef.current.student) return;
    
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}api/achievement_graph/fetchData/${student_rollno}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      const data = await res.json();
      console.log("Student data fetched:", data);
      setAchivementPointsStudentData(data);
      dataFetchedRef.current.student = true;
    } catch (error) {
      console.error("Student data fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [student_rollno, API_URL]);

  const handleInstituteAvg = useCallback(async () => {
    if (dataFetchedRef.current.institute) return;
    
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}api/achievement_graph/institute_avg/fetchData/${student_rollno}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      const data = await res.json();
      console.log("Institute data fetched:", data);
      setAchivementsPointsData(data);
      dataFetchedRef.current.institute = true;
    } catch (error) {
      console.error("Institute data fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  // Fetch data only once when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (student_rollno) {
        await Promise.all([handleInstituteAvg(), handlePoints()]);
        setDataStable(true);
      }
    };
    
    fetchData();
  }, [student_rollno, handleInstituteAvg, handlePoints]);

  // Handle click outside - memoized
  const handleClickOutside = useCallback((event) => {
    if (viewDropdownRef.current && !viewDropdownRef.current.contains(event.target)) {
      setIsViewDropdownOpen(false);
    }
    if (semDropdownRef.current && !semDropdownRef.current.contains(event.target)) {
      setIsSemDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Set primary color only once
  useEffect(() => {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary-color")
      .trim();
    if (color && color !== primaryColor) {
      setPrimaryColor(color);
    }
  }, []);

  // Updated data processing function to handle both data formats
  const processData = useCallback((rawData, isStudentData = false) => {
    console.log("Processing data:", { rawData: rawData?.length, isStudentData });
    
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return { points: [], ticks: [] };
    }

    let points = rawData
      .map(item => {
        if (!item || typeof item.currdate === 'undefined' || 
            typeof item.cummulative_points === 'undefined' || 
            typeof item.sem === 'undefined') {
          console.warn("Skipping invalid item:", item);
          return null; 
        }
        
        return {
          date: new Date(item.currdate),
          value: item.cummulative_points,
          semester: `sem-${item.sem}`,
          // Include additional info for debugging
          originalData: item
        };
      })
      .filter(p => p !== null);

    points.sort((a, b) => a.date - b.date);

    let ticks = [];
    if (points.length > 0) {
      const pointsBySemester = points.reduce((acc, p) => {
        if (!acc[p.semester]) {
          acc[p.semester] = [];
        }
        acc[p.semester].push(p);
        return acc;
      }, {});

      Object.entries(pointsBySemester).forEach(([semesterKey, semesterPointsArray]) => {
        if (semesterPointsArray.length > 0) {
          const midIdx = Math.floor(semesterPointsArray.length / 2);
          ticks.push({
            val: semesterPointsArray[midIdx].date,
            label: semesterKey.toUpperCase().replace("-", " "),
          });
        }
      });
      ticks.sort((a, b) => a.val - b.val);
    }

    console.log(`Processed ${points.length} points from ${rawData.length} raw items (${isStudentData ? 'student' : 'institute'})`);
    return { points, ticks };
  }, []);

  // Memoize processed data with stability check
  const { points: averagePoints, ticks: semesterTicks } = useMemo(() => {
    if (!dataStable) return { points: [], ticks: [] };
    return processData(achivementsPointsData, false);
  }, [achivementsPointsData, processData, dataStable]);

  const { points: studentPoints } = useMemo(() => {
    if (!dataStable) return { points: [] };
    return processData(achivementPointsStudentData, true);
  }, [achivementPointsStudentData, processData, dataStable]);

  // Update available semesters only when data is stable and actually changes
  useEffect(() => {
    if (!dataStable || (!averagePoints.length && !studentPoints.length)) return;
    
    const allSemsFromData = new Set();
    
    [...averagePoints, ...studentPoints].forEach(point => {
      if (point && point.semester) {
        allSemsFromData.add(point.semester);
      }
    });
    
    const sortedSems = Array.from(allSemsFromData).sort((a, b) => 
      parseInt(a.split('-')[1]) - parseInt(b.split('-')[1])
    );

    // Only update if semesters actually changed
    setAvailableSemesters(prev => {
      const prevString = JSON.stringify(prev);
      const newString = JSON.stringify(sortedSems);
      if (prevString !== newString) {
        console.log("Updating available semesters:", sortedSems);
        return sortedSems;
      }
      return prev;
    });
    
    // Update current semester if needed
    if (sortedSems.length > 0) {
      setCurrentSemester(prev => {
        if (!sortedSems.includes(prev)) {
          console.log("Updating current semester to:", sortedSems[0]);
          return sortedSems[0];
        }
        return prev;
      });
    }
  }, [averagePoints, studentPoints, dataStable]);

  // Memoize filtered data
  const filteredAveragePoints = useMemo(
    () => viewMode === "sem" 
      ? averagePoints.filter((p) => p.semester === currentSemester)
      : averagePoints,
    [viewMode, currentSemester, averagePoints]
  );

  const filteredStudentPoints = useMemo(
    () => viewMode === "sem"
      ? studentPoints.filter((p) => p.semester === currentSemester)
      : studentPoints,
    [viewMode, currentSemester, studentPoints]
  );

  // Memoize y-axis range
  const yAxisRange = useMemo(() => {
    const allValues = [
      ...filteredAveragePoints.map(p => p.value),
      ...filteredStudentPoints.map(p => p.value)
    ];
    
    if (allValues.length === 0) return [0, 10];
    
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const padding = (maxVal - minVal) * 0.1 || 5;
    
    return [Math.max(0, minVal - padding), maxVal + padding];
  }, [filteredAveragePoints, filteredStudentPoints]);

  // Memoize event handlers
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    setIsViewDropdownOpen(false);
    if (mode === "year") {
      setIsSemDropdownOpen(false);
    }
  }, []);

  const handleSemesterChange = useCallback((sem) => {
    setCurrentSemester(sem);
    setIsSemDropdownOpen(false);
  }, []);

  // Memoize plot data to prevent recreation on every render
  const plotData = useMemo(() => {
    console.log("Creating plot data:", {
      averagePointsCount: filteredAveragePoints.length,
      studentPointsCount: filteredStudentPoints.length,
      dataStable
    });

    return [
      {
        x: filteredAveragePoints.map((p) => p.date),
        y: filteredAveragePoints.map((p) => p.value),
        type: "scatter",
        mode: "lines",
        name: "Institute Average",
        line: { color: primaryColor, width: 2.5 },
        hovertemplate: `<b>Institute Average</b><br>Date: %{x|%b %d, %Y}<br>Points: %{y}<extra></extra>`,
        visible: filteredAveragePoints.length > 0 ? true : 'legendonly'
      },
      {
        x: filteredStudentPoints.map((p) => p.date),
        y: filteredStudentPoints.map((p) => p.value),
        type: "scatter",
        mode: "lines",
        name: "Your Points",
        line: { color: secondaryColor, width: 2.5 },
        hovertemplate: `<b>You</b><br>Date: %{x|%b %d, %Y}<br>Points: %{y}<extra></extra>`,
        visible: filteredStudentPoints.length > 0 ? true : 'legendonly'
      }
    ].filter(trace => trace.x.length > 0 || trace.y.length > 0);
  }, [filteredAveragePoints, filteredStudentPoints, primaryColor, secondaryColor, dataStable]);

  // Memoize plot layout
  const plotLayout = useMemo(() => ({
    autosize: true,
    margin: { l: 50, r: 20, t: 10, b: viewMode === "year" ? 50 : 40 },
    dragmode: true,
    showlegend: true,
    xaxis: {
      type: "date",
      tickvals: viewMode === "year" && semesterTicks.length > 0 ? semesterTicks.map((t) => t.val) : undefined,
      ticktext: viewMode === "year" && semesterTicks.length > 0 ? semesterTicks.map((t) => t.label) : undefined,
      tickmode: viewMode === "year" && semesterTicks.length > 0 ? "array" : "auto",
      showgrid: false,
      zeroline: false,
      title: "",
      tickformat: viewMode === "sem" ? "%b %d" : (semesterTicks.length === 0 ? "%b %Y" : undefined),
      nticks: viewMode === "sem" ? 5 : undefined,
    },
    yaxis: {
      range: yAxisRange,
      showgrid: true,
      gridcolor: "#eee",
      zeroline: true,
      zerolinecolor: "#ccc",
      fixedrange: false,
      title: "Cumulative Points"
    },
    hovermode: "x unified",
    legend: {
      x: 0.5,
      xanchor: 'center',
      y: 1.15,
      yanchor: 'bottom',
      orientation: 'h',
      bgcolor: "rgba(255,255,255,0)",
      bordercolor: "rgba(0,0,0,0)",
      borderwidth: 0
    },
  }), [viewMode, semesterTicks, yAxisRange]);

  const renderDesktopControls = useCallback(() => (
    <div className="hidden sm:flex items-center space-x-2">
      <button
        onClick={() => handleViewModeChange("year")}
        className={`px-4 py-1 w-20 text-sm font-semibold outline-primary transition-all duration-200 ${
          viewMode === "year"
            ? "bg-[#2D4BFF] text-white"
            : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
        }`}
        style={{ cursor: "pointer", borderRadius: "10px" }}
      >
        Year
      </button>
      
      <div className="relative" ref={semDropdownRef}>
        <button
          disabled={availableSemesters.length === 0}
          onClick={() => availableSemesters.length > 0 && setIsSemDropdownOpen(!isSemDropdownOpen)}
          className={`flex items-center cursor-pointer justify-between px-4 py-1 w-28 text-sm font-semibold outline-primary transition-all duration-200 rounded-lg ${
            viewMode === "sem"
              ? "bg-[#2D4BFF] text-white"
              : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
          } ${availableSemesters.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{ borderRadius: "10px" }}
        >
          <span onClick={(e) => {
            e.stopPropagation();
            if (availableSemesters.length > 0) {
              handleViewModeChange("sem");
            }
          }}>
            {availableSemesters.length > 0 && currentSemester ? currentSemester.toUpperCase().replace("-", " ") : "Sem"}
          </span>
          {availableSemesters.length > 0 && (
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
        
        {isSemDropdownOpen && availableSemesters.length > 0 && (
          <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 py-1">
            {availableSemesters.map(sem => (
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
                style={{ cursor: "pointer" }}
              >
                {sem.toUpperCase().replace("-", " ")}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  ), [viewMode, availableSemesters, currentSemester, isSemDropdownOpen, handleViewModeChange, handleSemesterChange]);

  const renderMobileControls = useCallback(() => (
    <div className="sm:hidden relative" ref={viewDropdownRef}>
      <button
        disabled={availableSemesters.length === 0 && viewMode !== 'year'}
        onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
        className={`flex items-center space-x-1 px-3 py-1 bg-[#2D4BFF] text-white border border-gray-200 rounded-md shadow-sm
                    ${(availableSemesters.length === 0 && viewMode !== 'year') ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="text-sm font-medium">
          {viewMode === "sem" && availableSemesters.length > 0 && currentSemester
            ? `${currentSemester.toUpperCase().replace("-", " ")}`
            : "Year"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isViewDropdownOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isViewDropdownOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 py-1">
          <button
            onClick={() => handleViewModeChange("year")}
            className={`block w-full text-left px-4 py-2 text-sm ${
              viewMode === "year" ? "font-bold text-[#2D4BFF]" : "text-gray-700"
            } hover:bg-gray-100`}
          >
            Year
          </button>
          
          {availableSemesters.length > 0 && (
            <div className="border-t border-gray-100 mt-1 pt-1">
              <div className="px-4 py-1 text-xs font-medium text-gray-500">
                SEMESTER VIEW
              </div>
              {availableSemesters.map(sem => (
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
  ), [viewMode, availableSemesters, currentSemester, isViewDropdownOpen, handleViewModeChange, handleSemesterChange]);

  // Debug information
  const debugInfo = useMemo(() => ({
    dataStable,
    isLoading,
    instituteDataLength: achivementsPointsData?.length || 0,
    studentDataLength: achivementPointsStudentData?.length || 0,
    processedInstitutePoints: averagePoints?.length || 0,
    processedStudentPoints: studentPoints?.length || 0,
    filteredInstitutePoints: filteredAveragePoints?.length || 0,
    filteredStudentPoints: filteredStudentPoints?.length || 0,
    availableSemesters: availableSemesters?.length || 0,
    currentSemester,
    viewMode
  }), [
    dataStable, isLoading, achivementsPointsData, achivementPointsStudentData,
    averagePoints, studentPoints, filteredAveragePoints, filteredStudentPoints,
    availableSemesters, currentSemester, viewMode
  ]);

  console.log("Component render debug:", debugInfo);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg md:text-xl font-medium text-gray-800">Achievement Graph</h1>
        {renderDesktopControls()}
        {renderMobileControls()}
      </div>

      <div className="flex-grow">
        {dataStable && (filteredAveragePoints.length > 0 || filteredStudentPoints.length > 0) ? (
          <Plot
            data={plotData}
            layout={plotLayout}
            config={{
              responsive: true,
              displayModeBar: false,
            }}
            style={{ width: "100%", height: "100%" }}
            key={`plot-${dataStable}-${viewMode}-${currentSemester}`} // Force re-render when data stabilizes
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            {isLoading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D4BFF] mx-auto mb-2"></div>
                Loading achievement data...
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-2">No achievement data available.</div>
                <div className="text-xs space-y-1">
                  <div>Institute Avg: {debugInfo.instituteDataLength} raw → {debugInfo.processedInstitutePoints} processed</div>
                  <div>Student: {debugInfo.studentDataLength} raw → {debugInfo.processedStudentPoints} processed</div>
                  <div>Data Stable: {debugInfo.dataStable ? 'Yes' : 'No'}</div>
                  <div>Loading: {debugInfo.isLoading ? 'Yes' : 'No'}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

AchievementsGraph.displayName = 'AchievementsGraph';

export default AchievementsGraph;