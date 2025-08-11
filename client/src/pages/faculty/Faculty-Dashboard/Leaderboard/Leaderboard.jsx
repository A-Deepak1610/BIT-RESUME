import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaClipboardCheck, FaRankingStar } from 'react-icons/fa6';
import useAuth from '../../../../store/UseAuth';

// The static learnersData has been removed.

export default function Leaderboard() {
  const { rollno } = useAuth();
  const navigate = useNavigate();

  // State for storing data, loading status, and any errors
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:6001/api/dashboard/leardeardborad/${rollno}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();
        console.log("leaderboard", data);

        // Check if the response contains the leaderboard array
        if (data && Array.isArray(data.leaderboard)) {
          // Sort the data by points in descending order
          const sortedData = data.leaderboard.sort((a, b) => b.current_point - a.current_point);
          setLeaderboardData(sortedData);
        } else {
          setLeaderboardData([]);
        }

      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Could not load leaderboard data.');
      } finally {
        setLoading(false);
      }
    };

    handleLeaderboard();
  }, [rollno]); // Re-fetch if the rollno changes

  return (
    <div className="p-4 rounded-lg flex flex-col h-full bg-white shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">Leaderboard</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 items-center">
          <div className="flex items-center gap-1"><FaRankingStar className="text-blue-600" /> Rank</div>
          <div className="flex items-center gap-1"><FaTrophy className="text-yellow-500" /> Activity  points</div>
          <div className="flex items-center gap-1"><FaClipboardCheck className="text-green-600" /> Projects completed</div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <p className="text-center text-gray-500">Loading leaderboard...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          leaderboardData.map((learner) => (
            <div
              key={learner.rollno} // Use the unique rollno as the key
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200"
            >
              <div>
                {/* Mapped user_name from backend data */}
                <p className="font-semibold text-gray-900">{learner.user_name}</p>
                {/* Mapped department from backend data */}
                <p className="text-xs sm:text-sm text-gray-500">{learner.department}</p>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm mt-2 sm:mt-0">
                {/* Mapped current_rank */}
                <div className="flex items-center gap-1 text-blue-600 font-medium capitalize">
                  <FaRankingStar /> {learner.current_rank}
                </div>
                {/* Mapped current_point */}
                <div className="flex items-center gap-1 text-yellow-600 font-medium">
                  <FaTrophy /> {learner.current_point}
                </div>
                {/* Mapped project_count */}
                <div className="flex items-center gap-1 text-green-600 font-medium">
                  <FaClipboardCheck /> {learner.project_count}
                </div>
              </div>
            </div>
          ))
        )}
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