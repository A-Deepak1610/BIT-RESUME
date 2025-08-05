import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaClipboardCheck, FaRankingStar } from 'react-icons/fa6';

const learnersData = [
  { name: 'Sarah Johnson', department: 'Computer Science', rank: 'Titanium', points: 3200, projects: 10 },
  { name: 'Michael Chen', department: 'Information Technology', rank: 'Gold', points: 2800, projects: 8 },
  { name: 'Emma Davis', department: 'Software Engineering', rank: 'Silver', points: 2500, projects: 7 },
  { name: 'Liam Neeson', department: 'Cybersecurity', rank: 'Bronze', points: 2200, projects: 6 },
  { name: 'Olivia Pope', department: 'Data Science', rank: 'Bronze', points: 2150, projects: 5 },
];

export default function Leaderboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 rounded-lg flex flex-col h-full bg-white shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">Leaderboard</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 items-center">
          <div className="flex items-center gap-1"><FaRankingStar className="text-blue-600" /> Rank</div>
          <div className="flex items-center gap-1"><FaTrophy className="text-yellow-500" /> Reward points</div>
          <div className="flex items-center gap-1"><FaClipboardCheck className="text-green-600" /> Projects completed</div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {learnersData.map((learner, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200"
          >
            <div>
              <p className="font-semibold text-gray-900">{learner.name}</p>
              <p className="text-xs sm:text-sm text-gray-500">{learner.department}</p>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm mt-2 sm:mt-0">
              <div className="flex items-center gap-1 text-blue-600 font-medium">
                <FaRankingStar /> {learner.rank}
              </div>
              <div className="flex items-center gap-1 text-yellow-600 font-medium">
                <FaTrophy /> {learner.points}
              </div>
              <div className="flex items-center gap-1 text-green-600 font-medium">
                <FaClipboardCheck /> {learner.projects}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate('/faculty-studentperformance')}
          className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span>View All Performers</span>
        </button>
      </div>
    </div>
  );
}