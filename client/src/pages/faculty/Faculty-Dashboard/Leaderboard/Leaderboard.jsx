import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFolderOpen,
  FaBriefcase,
  FaCertificate,
  FaFileAlt,
  FaLightbulb,
  FaChartBar,
} from "react-icons/fa";
import useAuth from "../../../../store/UseAuth";

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
        const response = await fetch(
          `http://localhost:6001/api/dashboard/leardeardborad/${rollno}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await response.json();
        console.log("leaderboard", data);

        // Check if the response contains the leaderboard array
        if (data && Array.isArray(data.leaderboard)) {
          // Data is already sorted by total_uploads from backend
          setLeaderboardData(data.leaderboard);
        } else {
          setLeaderboardData([]);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Could not load leaderboard data.");
      } finally {
        setLoading(false);
      }
    };

    handleLeaderboard();
  }, [rollno]); // Re-fetch if the rollno changes

  return (
    <div className="p-4 rounded-lg flex flex-col h-full bg-white shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
          Student Uploads
        </h2>
        <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs text-gray-600 items-center">
          <div className="flex items-center gap-1">
            <FaChartBar className="text-purple-600" /> Total
          </div>
          <div className="flex items-center gap-1">
            <FaFolderOpen className="text-blue-600" /> Projects
          </div>
          <div className="flex items-center gap-1">
            <FaBriefcase className="text-green-600" /> Internships
          </div>
          <div className="flex items-center gap-1">
            <FaCertificate className="text-yellow-500" /> Certificates
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <p className="text-center text-gray-500">Loading data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : leaderboardData.length === 0 ? (
          <p className="text-center text-gray-500">No students found.</p>
        ) : (
          leaderboardData.map((learner) => (
            <div
              key={learner.rollno}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  {learner.user_name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {learner.department}
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm mt-2 sm:mt-0">
                {/* Total uploads */}
                <div className="flex items-center gap-1 text-purple-600 font-semibold bg-purple-100 px-2 py-1 rounded">
                  <FaChartBar /> {learner.total_uploads}
                </div>
                {/* Projects */}
                <div
                  className="flex items-center gap-1 text-blue-600 font-medium"
                  title="Projects"
                >
                  <FaFolderOpen /> {learner.project_count}
                </div>
                {/* Internships */}
                <div
                  className="flex items-center gap-1 text-green-600 font-medium"
                  title="Internships"
                >
                  <FaBriefcase /> {learner.internship_count}
                </div>
                {/* Certificates */}
                <div
                  className="flex items-center gap-1 text-yellow-600 font-medium"
                  title="Certificates"
                >
                  <FaCertificate /> {learner.certificate_count}
                </div>
                {/* Papers */}
                <div
                  className="flex items-center gap-1 text-orange-600 font-medium"
                  title="Papers"
                >
                  <FaFileAlt /> {learner.paper_count}
                </div>
                {/* Patents */}
                <div
                  className="flex items-center gap-1 text-red-600 font-medium"
                  title="Patents"
                >
                  <FaLightbulb /> {learner.patent_count}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate("/faculty-studentperformance")}
          className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span>View All Performers</span>
        </button>
      </div>
    </div>
  );
}
