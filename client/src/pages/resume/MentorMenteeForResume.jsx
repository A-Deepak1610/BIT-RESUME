import React, { useState, useEffect } from 'react';
import useAuth from '../../store/UseAuth';
const MentorMenteeForResume = () => {
  const [mentorSkillData, setMentorSkillData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { rollno } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!rollno) {
      setIsLoading(false);
      return;
    }
    
    const fetchMentorshipData = async () => {
      try {
        const res = await fetch(`${API_URL}api/ps/metorships`, {
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
        console.log("API Response Data:", data);
        if (data && Array.isArray(data.mentorships)) {
          const cleanedData = cleanMentorshipData(data.mentorships);
          setMentorSkillData(cleanedData);
        } else {
          console.error("API response is not in the expected format.", data);
          setMentorSkillData([]);
        }
      } catch (error) {
        console.error("Failed to fetch mentorship data, using dummy data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentorshipData();
  }, [rollno, API_URL]);

  // Helper function to filter out institute_avg and keep only needed properties
  const cleanMentorshipData = (mentorships) => {
    return mentorships.map(({ mentor_rollno, institute_avg, ...cleanData }) => cleanData);
  };
  const totalMentees = mentorSkillData.reduce((total, skill) => total + skill.mentee_count, 0);
  const skillCount = mentorSkillData.length;
  if (isLoading) {
    return <div className="text-xs text-gray-500">Loading mentorship data...</div>;
  }
  if (skillCount === 0) {
    return <div className="text-xs text-gray-500">No mentorship data available.</div>;
  }
  return (
    <div className="text-sm space-y-2">
      {/* The summary paragraph remains at full-width */}
      <p className="text-xs text-gray-600 leading-relaxed">
        Actively mentored a total of{' '}
        <span className="font-bold text-gray-800">{totalMentees} peers</span> across{' '}
        <span className="font-bold text-gray-800">{skillCount} technical skills</span>, 
        contributing to a collaborative learning environment.
      </p>

      {/* The list of skills will now use a grid for multiple items */}
      <ul 
        className={`list-disc list-inside text-xs text-gray-600 ${
          skillCount > 1 ? 'grid grid-cols-2 gap-x-6 gap-y-1' : 'space-y-1'
        }`}
      >
        {mentorSkillData.map((skill, index) => (
          <li key={index} className="break-inside-avoid">
            <span className="font-semibold">{skill.skill_name}:</span> Guided {skill.mentee_count} mentees.
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MentorMenteeForResume;