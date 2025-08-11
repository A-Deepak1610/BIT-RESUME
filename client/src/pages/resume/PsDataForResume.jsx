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
        const res = await fetch(`${API_URL}api/ps/levels_status/${rollno}`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();
        setSkillCompletionData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch error for levels status:", error);
        setSkillCompletionData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPsCompletionData();
  }, [rollno, API_URL]);

  const visibleSkills = skillCompletionData.filter(skill => skill.skilllevel > 0);

  const groupedSkills = visibleSkills.reduce((acc, skill) => {
    if (!acc[skill.skilldomain]) acc[skill.skilldomain] = [];
    acc[skill.skilldomain].push(skill);
    return acc;
  }, {});

  const skillDomains = Object.entries(groupedSkills);

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