import React, { useEffect, useState, useMemo, useRef } from "react";
import Plot from "react-plotly.js";
import achivementsPointsDataFromFile from "../../../../dummydatas/achivementPoints.json";
import achivementPointsStudentDataFromFile from "../../../../dummydatas/achivementPointsStudent.json";
import useAuth from "../../../../store/UseAuth";

const AchievementsGraph = (props) => {
  const [primaryColor, setPrimaryColor] = useState("#2D4BFF");
  const [secondaryColor, setSecondaryColor] = useState("#FFA500"); // Default, can be overridden
  const [viewMode, setViewMode] = useState("year");
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [currentSemester, setCurrentSemester] = useState("sem-1");
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isSemDropdownOpen, setIsSemDropdownOpen] = useState(false);
  const [achivementsPointsData, setAchivementsPointsData] = useState(achivementsPointsDataFromFile);
  const [achivementPointsStudentData, setAchivementPointsStudentData] = useState(achivementPointsStudentDataFromFile);
  const viewDropdownRef = useRef(null);
  const semDropdownRef = useRef(null);
  const {fetchUser,rollno}=useAuth();
  const student_rollno= props.rollno || rollno;
  // useEffect(() => {
  //   fetchUser();
  // }, []);
  const API_URL=import.meta.env.VITE_API_URL
  const handlePoints = async () => {
    try {
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
      setAchivementPointsStudentData(data);
      // console.log("Data fetched successfully:", data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  const handleInstituteAvg=async () => {
    try {
      const res = await fetch(`${API_URL}api/achievement_graph/institute_avg/fetchData`, {
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
      setAchivementsPointsData(data);
      // console.log("Institute Average fetched successfully:", data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
  useEffect(()=>{
    handleInstituteAvg();handlePoints();
  },[student_rollno])
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(event.target)) {
        setIsViewDropdownOpen(false);
      }
      if (semDropdownRef.current && !semDropdownRef.current.contains(event.target)) {
        setIsSemDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary-color")
      .trim();
    if (color) setPrimaryColor(color);
    // const secondary = getComputedStyle(document.documentElement) // Example for secondary if needed
    //   .getPropertyValue("--secondary-color")
    //   .trim();
    // if (secondary) setSecondaryColor(secondary);


    const allValidDataItems = [];
    const dataSources = [achivementsPointsData, achivementPointsStudentData]; // Use current state

    dataSources.forEach(dataSource => {
      if (Array.isArray(dataSource)) {
        dataSource.forEach(item => {
          if (item && typeof item === 'object' && typeof item.sem !== 'undefined') {
            allValidDataItems.push(item);
          }
        });
      }
    });

    if (allValidDataItems.length > 0) {
      const sems = Array.from(new Set(allValidDataItems.map(item => `sem-${item.sem}`)))
        .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));
      
      setAvailableSemesters(sems);

      if (sems.length > 0 && !sems.includes(currentSemester)) {
        setCurrentSemester(sems[0]);
      } else if (sems.length === 0) {
        setCurrentSemester("sem-1"); // Default if no valid semesters found
      }
    } else {
      setAvailableSemesters([]);
      setCurrentSemester("sem-1"); // Default if no data items
    }
  }, []);
  useEffect(() => {
    const allSemsFromData = new Set();
    const dataSources = [achivementsPointsData, achivementPointsStudentData];
    dataSources.forEach(dataSource => {
        if (Array.isArray(dataSource)) {
            dataSource.forEach(item => {
                if (item && typeof item === 'object' && typeof item.sem !== 'undefined') {
                    allSemsFromData.add(`sem-${item.sem}`);
                }
            });
        }
    });
    
    const sortedSems = Array.from(allSemsFromData).sort((a, b) => 
        parseInt(a.split('-')[1]) - parseInt(b.split('-')[1])
    );

    setAvailableSemesters(sortedSems);

    if (sortedSems.length > 0) {
        if (!sortedSems.includes(currentSemester)) {
            setCurrentSemester(sortedSems[0]);
        }
    } else {
        setCurrentSemester("sem-1"); // Default if no semesters derived from current data
    }
  }, [achivementsPointsData, achivementPointsStudentData, currentSemester]);


  const processData = (rawData) => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return { points: [], ticks: [] };
    }

    let points = rawData
      .map(item => {
        if (!item || typeof item.currdate === 'undefined' || 
            typeof item.cummulative_points === 'undefined' || typeof item.sem === 'undefined') {
          // console.warn("Skipping invalid item in processData:", item);
          return null; 
        }
        return {
          date: new Date(item.currdate),
          value: item.cummulative_points,
          semester: `sem-${item.sem}`
        };
      })
      .filter(p => p !== null); // Filter out any nulls from invalid items

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
  
  const filteredAveragePoints = useMemo(
    () =>
      viewMode === "sem"
        ? averagePoints.filter((p) => p.semester === currentSemester)
        : averagePoints,
    [viewMode, currentSemester, averagePoints]
  );

  const filteredStudentPoints = useMemo(
    () =>
      viewMode === "sem"
        ? studentPoints.filter((p) => p.semester === currentSemester)
        : studentPoints,
    [viewMode, currentSemester, studentPoints]
  );

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

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setIsViewDropdownOpen(false); // Close mobile dropdown if open
    if (mode === "year") { // If switching to year, close semester dropdown too
        setIsSemDropdownOpen(false);
    }
  };

  const handleSemesterChange = (sem) => {
    setCurrentSemester(sem);
    setIsSemDropdownOpen(false);
  };

  const renderDesktopControls = () => (
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
              ?"bg-[#2D4BFF] text-white"
              : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
          } ${availableSemesters.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{ borderRadius: "10px" }}
        >
          <span onClick={(e) => {
            e.stopPropagation(); // Prevent button's main onClick if only text is clicked
            if (availableSemesters.length > 0) {
                handleViewModeChange("sem");
                // Optionally, open dropdown if not already open when text is clicked
                // if (!isSemDropdownOpen) setIsSemDropdownOpen(true); 
            }
          }}>
            {availableSemesters.length > 0 && currentSemester ? currentSemester.toUpperCase().replace("-", " ") : "Sem"}
          </span>
          {availableSemesters.length > 0 && (
            <svg
              className="w-4 h-4 ml-1" // Added ml-1 for spacing
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
                  handleViewModeChange("sem"); // Ensure view mode is semester
                  handleSemesterChange(sem);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  viewMode === "sem" && currentSemester === sem // Check viewMode too for active state
                    ? "font-bold text-[#2D4BFF]"
                    : "text-gray-700"
                } hover:bg-gray-100`}
                style={{cursor:"pointer"}}
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
  );

  return (
    <div className="h-full flex flex-col ">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg md:text-xl font-medium text-gray-800">Achievement Graph</h1>
        {renderDesktopControls()}
        {renderMobileControls()}
      </div>

      <div className="flex-grow">
        {(filteredAveragePoints.length > 0 || filteredStudentPoints.length > 0) ? (
            <Plot
            data={[
                
                {
                x: filteredStudentPoints.map((p) => p.date),
                y: filteredStudentPoints.map((p) => p.value),
                type: "scatter",
                mode: "lines",
                name: "Your Points",
                line: { color: secondaryColor, width: 2.5 },
                hovertemplate: `<b>You</b><br>Date: %{x|%b %d, %Y}<br>Points: %{y}<extra></extra>`
                },
                {
                  x: filteredAveragePoints.map((p) => p.date),
                  y: filteredAveragePoints.map((p) => p.value),
                type: "scatter",
                mode: "lines",
                name: "Average Points",
                line: { color: primaryColor, width: 2.5 },
                hovertemplate: `<b>Average</b><br>Date: %{x|%b %d, %Y}<br>Points: %{y}<extra></extra>`
                }
            ]}
            layout={{
                autosize : true,
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
                fixedrange: false, // Allow Y-axis zoom/pan
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
            }}
            config={{
                responsive: true,
                displayModeBar: false,
            }}
            style={{ width: "100%" , height:"100%"}}
            />
        ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
                No achievement data available.
            </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsGraph;