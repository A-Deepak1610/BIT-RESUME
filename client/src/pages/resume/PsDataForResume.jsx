import React, { useState, useEffect } from 'react';
import useAuth from '../../store/UseAuth';

// Helper component for a single skill domain block
const SkillDomainBlock = ({ domain, skills }) => (
    <div className="break-inside-avoid">
      <h4 className="font-semibold text-gray-700 text-sm">{domain}</h4>
      <ul className="list-disc list-inside text-xs text-gray-600 mt-1 space-y-1 ml-1">
        {skills.map((skill) => {
          const completionRate = ((skill.skilllevel / skill.totallevels) * 100).toFixed(0);
          return (
            <li key={skill.skillname}>
              {skill.skillname}:{' '}
              <span className="font-medium text-gray-700">
                Level {skill.skilllevel}/{skill.totallevels} ({completionRate}%)
              </span>
            </li>
          );
        })}
      </ul>
    </div>
);

const PsDataForResume = () => {
  const [skillCompletionData, setSkillCompletionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { rollno } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!rollno) {
      setIsLoading(false);
      return;
    }
    
    const fetchPsCompletionData = async () => {
      try {
        const res = await fetch(`${API_URL}api/ps/levels_status`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const responseData = await res.json();
        
        // Extract data from the nested structure and map to expected format
        if (responseData && Array.isArray(responseData.data)) {
          const mappedData = mapPsDataToSkillFormat(responseData.data);
          setSkillCompletionData(mappedData);
        } else {
          console.error("API response is not in the expected format.", responseData);
          setSkillCompletionData([]);
        }
      } catch (error) {
        console.error("Fetch error for levels status:", error);
        setSkillCompletionData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPsCompletionData();
  }, [rollno, API_URL]);

  // Helper function to map PS data to the format expected by UI
  const mapPsDataToSkillFormat = (psData) => {
    // Group by skill_name and find the highest completed level for each skill
    const skillMap = {};
    
    psData.forEach((record) => {
      const skillName = record.skill_name;
      const skillLevel = parseInt(record.skill_level);
      const totalLevels = parseInt(record.total_levels);
      const status = record.status;
      
      if (!skillMap[skillName]) {
        skillMap[skillName] = {
          skillname: skillName,
          skilldomain: categorizeSkilDomain(skillName), // Categorize skills
          skilllevel: 0,
          totallevels: totalLevels
        };
      }
      // Update to highest completed level (only count completed levels)
      if (status === "completed" && skillLevel > skillMap[skillName].skilllevel) {
        skillMap[skillName].skilllevel = skillLevel;
      }
    });
    
    return Object.values(skillMap);
  };
  const categorizeSkilDomain = (skillName) => {
    const SKILL_CATEGORIZATION = {
      // CS Domain
      "c programming": "CS",
      "python programming": "CS",
      "java": "CS",
      "javascript": "CS",
      "DBMS": "CS",
      "data structures": "CS",
      "algorithms": "CS",
      "web development": "CS",
      "machine learning": "CS",
      "artificial intelligence": "CS",
      
      // Electrical Domain
      "circuit analysis": "Electrical",
      "digital electronics": "Electrical",
      "power systems": "Electrical",
      "control systems": "Electrical",
      "electronics": "Electrical",
      "electrical machines": "Electrical",
      
      // Soft Skills Domain
      "communication": "Soft Skills",
      "leadership": "Soft Skills",
      "teamwork": "Soft Skills",
      "presentation": "Soft Skills",
      "time management": "Soft Skills",
      "problem solving": "Soft Skills",
      
      // Non-Technical Domain
      "algebra": "Non-Technical",
      "calculus": "Non-Technical",
      "statistics": "Non-Technical",
      "physics": "Non-Technical",
      "chemistry": "Non-Technical",
      "mathematics": "Non-Technical",
      "geometry": "Non-Technical"
    };
    const normalizedSkillName = skillName.toLowerCase().trim();
    return SKILL_CATEGORIZATION[normalizedSkillName] || "General";
  };
  const visibleSkills = skillCompletionData.filter(skill => skill.skilllevel > 0);
  const groupedSkills = visibleSkills.reduce((acc, skill) => {
    if (!acc[skill.skilldomain]) acc[skill.skilldomain] = [];
    acc[skill.skilldomain].push(skill);
    return acc;
  }, {});

  const domainOrder = ["CS", "Non-Technical", "Soft Skills", "Electrical", "General"];  
  const skillDomains = domainOrder
    .filter(domain => groupedSkills[domain]) // Only include domains that have skills
    .map(domain => [domain, groupedSkills[domain]]);

  if (isLoading) {
    return <div className="text-xs text-gray-500">Loading skills data...</div>;
  }

  if (skillDomains.length === 0) {
    return <div className="text-xs text-gray-500">No problem solving data available.</div>;
  }
  
  if (skillDomains.length === 1) {
    const [domain, skills] = skillDomains[0];
    return <SkillDomainBlock domain={domain} skills={skills} />;
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
      {skillDomains.map(([domain, skills]) => (
        <SkillDomainBlock key={domain} domain={domain} skills={skills} />
      ))}
    </div>
  );
};

export default PsDataForResume;