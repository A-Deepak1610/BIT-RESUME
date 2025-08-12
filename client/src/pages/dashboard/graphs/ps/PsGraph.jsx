
import React, { useState, useRef, useEffect } from "react";
import SkillCard from "./SkillCard";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import useAuth from "../../../../store/UseAuth";

const FIXED_DOMAINS_ORDER = ["CS", "Electrical", "Soft Skills", "Non-Technical"];

const PsSkillGraph = (props) => {
  const [activeTab, setActiveTab] = useState(FIXED_DOMAINS_ORDER[0]);
  const [isMobileDomainPopoverOpen, setIsMobileDomainPopoverOpen] =
    useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredSkillInfo, setHoveredSkillInfo] = useState(null);
  const mobileDomainPopoverRef = useRef(null);
  const popoverAttemptsRef = useRef(null);
  const containerRef = useRef(null);
  const { fetchUser, rollno } = useAuth();
  const student_rollno = props.rollno || rollno; // Use rollno from props or auth context
  useEffect(() => {
    fetchUser();
  }, []);
  const [skillCompletionData, setSkillCompletionData] = useState([]);
  const [skillAttemptsData, setSkillAttemptsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchPsAttempts = async () => {
    try {
      const res = await fetch(`${API_URL}api/ps/attempts/${student_rollno}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`HTTP Error for attempts: ${res.status}`);
      }
      const data = await res.json();
      setSkillAttemptsData(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      console.error("Fetch error for attempts:", error);
      setSkillAttemptsData([]);
      return [];
    }
  };

  const fetchPsCompletionData = async () => {
    try {
      const res = await fetch(`${API_URL}api/ps/levels_status/${student_rollno}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`HTTP Error for levels status: ${res.status}`);
      }
      const data = await res.json();
      setSkillCompletionData(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      console.error("Fetch error for levels status:", error);
      setSkillCompletionData([]);
      return [];
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchPsCompletionData(), fetchPsAttempts()])
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [student_rollno]); 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileDomainPopoverRef.current &&
        !mobileDomainPopoverRef.current.contains(event.target)
      ) {
        setIsMobileDomainPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (
      hoveredSkillInfo &&
      !hoveredSkillInfo.hasBeenPositioned &&
      popoverAttemptsRef.current
    ) {
      const popoverElement = popoverAttemptsRef.current;
      const popoverRect = popoverElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const { cursorX, cursorY } = hoveredSkillInfo;
      const offset = 15;
      const margin = 10;

      let newFinalX = cursorX + offset;
      let newFinalY = cursorY + offset;

      if (newFinalX + popoverRect.width + margin > viewportWidth) {
        newFinalX = cursorX - popoverRect.width - offset;
      }
      newFinalX = Math.max(
        margin,
        Math.min(newFinalX, viewportWidth - popoverRect.width - margin)
      );

      if (newFinalY + popoverRect.height + margin > viewportHeight) {
        newFinalY = cursorY - popoverRect.height - offset;
      }
      newFinalY = Math.max(
        margin,
        Math.min(newFinalY, viewportHeight - popoverRect.height - margin)
      );

      setHoveredSkillInfo((prev) => ({
        ...prev,
        finalX: newFinalX,
        finalY: newFinalY,
        hasBeenPositioned: true,
      }));
    }
  }, [hoveredSkillInfo]);

  const filteredSkills = skillCompletionData.filter(
    (skill) => skill.skilldomain === activeTab
  );

  const domains = FIXED_DOMAINS_ORDER;

  const handleTabChange = (domain) => {
    setActiveTab(domain);
    setIsMobileDomainPopoverOpen(false);
  };

  const handleSkillCardMouseEnter = (skillData, event) => {
    const relevantAttemptsEntries = skillAttemptsData.filter(
      (attempt) =>
        attempt.skilldomain === skillData.skilldomain &&
        attempt.skillname === skillData.skillname
    );

    const formattedAttempts = {};
    if (relevantAttemptsEntries.length > 0) {
      relevantAttemptsEntries.forEach((attemptEntry) => {
        formattedAttempts[`level-${attemptEntry.skilllevel}`] =
          attemptEntry.attempts;
      });
    }
    const allLevelsAttempts = {};
    for (let i = 1; i <= skillData.totallevels; i++) {
      allLevelsAttempts[`level-${i}`] = formattedAttempts[`level-${i}`] || 0;
    }

    setHoveredSkillInfo({
      skillName: skillData.skillname,
      domain: skillData.skilldomain,
      attempts: allLevelsAttempts,
      cursorX: event.clientX,
      cursorY: event.clientY,
      finalX: event.clientX + 15,
      finalY: event.clientY + 15,
      hasBeenPositioned: false,
    });
  };

  const handleSkillCardMouseLeave = () => {
    setHoveredSkillInfo(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading skills...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-xl font-[500] text-gray-800">
          Skill Completion Status
        </h1>
        {isMobile && (
          <div
            className="relative"
            ref={mobileDomainPopoverRef}
            onMouseEnter={() => setIsMobileDomainPopoverOpen(true)} // Consider onClick for touch devices
            onMouseLeave={() => setIsMobileDomainPopoverOpen(false)} // Consider managing with click
          >
            <button
              onClick={() => setIsMobileDomainPopoverOpen(prev => !prev)} // Toggle on click for mobile
              className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#2d4bff] text-white hover:bg-gray-200 transition-colors"
              aria-haspopup="true"
              aria-expanded={isMobileDomainPopoverOpen}
            >
              <span className="text-sm font-medium">{activeTab}</span>
              <KeyboardArrowDownIcon
                className={`transition-transform ${
                  isMobileDomainPopoverOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isMobileDomainPopoverOpen && (
              <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-md shadow-lg py-2 w-48 border border-gray-200">
                {domains.map((domain) => (
                  <button
                    key={domain}
                    onClick={() => handleTabChange(domain)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-100 ${
                      activeTab === domain
                        ? "font-bold text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`flex-wrap gap-3 mt-1 ${isMobile ? "hidden" : "flex"}`}>
        {domains.map((domain) => (
          <button
            key={domain}
            onClick={() => handleTabChange(domain)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === domain
                ? "bg-[#0200E1] text-white shadow-md"
                : "bg-[#ffffff] text-[#000000] border-2 border-[#ECE7E7]"
            } outline-[#0200E1] cursor-pointer hover:shadow-lg transition-all duration-250`}
          >
            {domain}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        className="mt-4 overflow-y-auto flex-grow"
        style={{
          minHeight: "150px", 
          maxHeight: "calc(2 * (105px + 1rem))", 
        }}
      >
        {filteredSkills.length > 0 ? (
          <div className="grid lg:grid-cols-3 xl:grid-cols-5 grid-cols-2 gap-4 justify-items-center">
            {filteredSkills.map((skillItem) => (
              <SkillCard
                key={`${skillItem.skilldomain}-${skillItem.skillname}`}
                skillName={skillItem.skillname}
                completed={parseInt(skillItem.skilllevel, 10) || 0}
                totalLevels={skillItem.totallevels}
                onMouseEnter={(e) => handleSkillCardMouseEnter(skillItem, e)}
                onMouseLeave={handleSkillCardMouseLeave}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No skills to display for this domain.
          </div>
        )}
      </div>

      {hoveredSkillInfo && (
        <div
          ref={popoverAttemptsRef}
          className="fixed z-30 p-5 bg-white text-black border border-gray-300 rounded-md shadow-xl text-xs"
          style={{
            top: `${hoveredSkillInfo.finalY}px`,
            left: `${hoveredSkillInfo.finalX}px`,
            pointerEvents: "none",
            opacity: hoveredSkillInfo.hasBeenPositioned ? 1 : 0,
            transition: "opacity 0.1s ease-in-out",
          }}
        >
          <h4 className="font-semibold mb-1">
            {hoveredSkillInfo.skillName} ({hoveredSkillInfo.domain}) - Attempts
          </h4>
          {hoveredSkillInfo.attempts &&
          Object.keys(hoveredSkillInfo.attempts).length > 0 ? (
            <ul>
              {Object.entries(hoveredSkillInfo.attempts)
                .sort(
                  ([levelA], [levelB]) =>
                    parseInt(levelA.split("-")[1]) -
                    parseInt(levelB.split("-")[1])
                )
                .map(([level, count]) => (
                  <li key={level}>
                    {level.replace("-", " ")} : {count}
                  </li>
                ))}
            </ul>
          ) : (
            <p>No attempt data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PsSkillGraph;
