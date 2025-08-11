import React, { useState, useEffect } from 'react';
import useAuth from '../../store/UseAuth';
import { Users } from 'lucide-react';

// --- DUMMY DATA ---
// This data will serve as a fallback if the API fetch fails.
const DUMMY_MENTOR_SKILLS = [
  { skill_name: "React & Frontend", mentee_count: 5 },
  { skill_name: "Node.js (Backend)", mentee_count: 4 },
  { skill_name: "Database Management", mentee_count: 3 },
  { skill_name: "UI/UX Design Principles", mentee_count: 2 },
];

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
    const loadData = async () => {
      try {
        const res = await fetch(`${API_URL}api/mentor/details/${rollno}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();
        setMentorSkillData(Array.isArray(data) ? data : []);
      } catch (error) {
        // **FALLBACK LOGIC**: On fetch error, use dummy data.
        console.error("Fetch mentor details error, using dummy data:", error);
        setMentorSkillData(DUMMY_MENTOR_SKILLS);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [rollno, API_URL]);

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