import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Import Lucide icons, adding CheckCircle for the empty state
import {
  AlertTriangle,
  User,
  Trophy,
  Award,
  ShieldAlert,
  CheckCircle, // Import the CheckCircle icon
} from "lucide-react";
import useAuth from "../../../../store/UseAuth";

// Helper functions (no changes needed here)
const getPriorityInfo = (rank) => {
    // Return a default for null or undefined ranks to prevent errors
    const safeRank = rank || 'default'; 
    switch (safeRank.toLowerCase()) {
      case "silver":
        return { priority: "High", status: "At Risk" };
      case "gold":
        return { priority: "Medium", status: "Warning" };
      default:
        return { priority: "Low", status: "Monitoring" };
    }
};

const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-100";
      case "Medium": return "text-orange-600 bg-orange-100";
      default: return "text-yellow-600 bg-yellow-100";
    }
};

const getStatusColor = (status) => {
    switch (status) {
      case "At Risk": return "text-red-700 bg-red-100 border-red-200";
      case "Warning": return "text-orange-700 bg-orange-100 border-orange-200";
      default: return "text-yellow-700 bg-yellow-100 border-yellow-200";
    }
};


export default function PriorityLearners() {
  const navigate = useNavigate();
  const { rollno } = useAuth();

  const [priorityLearners, setPriorityLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rollno) {
        setLoading(false);
        return;
    };

    const handleFetchPriorityLearners = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:6001/api/dashboard/prioritylearners/${rollno}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch priority learners data");
        }
        const data = await response.json();
        console.log("API response for priority learners:", data);
        if (data && Array.isArray(data.prioritylearners)) {
          setPriorityLearners(data.prioritylearners);
        } else {
          setPriorityLearners([]);
          console.log("No priority learners data found or response format is incorrect.");
        }
      } catch (error) {
        setPriorityLearners([]);
      } finally {
        setLoading(false);
      }
    };

    handleFetchPriorityLearners();
  }, [rollno]);

  return (
    <div className="p-4 rounded-lg flex flex-col h-full bg-white shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <ShieldAlert className="text-red-500" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">
            Priority Learners
          </h2>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600 items-center">
          <div className="flex items-center gap-1">
            <AlertTriangle className="text-red-500" size={14} />
            <span>Needs Attention</span>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0">
        {loading ? (
          <p className="text-center text-gray-500 pt-8">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 pt-8">{error}</p>
        ) : priorityLearners.length === 0 ? (
          // --- ENHANCED EMPTY STATE START ---
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 bg-gray-50 rounded-md p-4">
            <CheckCircle className="w-12 h-12 text-green-400 mb-2" />
            <h3 className="text-md font-semibold text-gray-700">No Priority Learners</h3>
            <p className="text-sm mt-1">
              All students are currently meeting expectations.
            </p>
          </div>
          // --- ENHANCED EMPTY STATE END ---
        ) : (
          priorityLearners.map((learner) => {
            // Handle cases where learner object might be null or undefined
            if (!learner) return null; 
            const { priority, status } = getPriorityInfo(learner.current_rank);
            return (
              <div
                key={learner.rollno}
                className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors duration-150"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex-grow min-w-0 mb-2 sm:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="text-gray-500 flex-shrink-0" size={14} />
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {learner.user_name || "Unknown User"}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          priority
                        )}`}
                      >
                        {priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {learner.department || "No department specified"}
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      Issue: Low Performance
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Trophy className="text-yellow-500" size={14} /> {learner.current_point || 0}
                      </span>
                      <span className="flex items-center gap-1 capitalize">
                        <Award className="text-blue-500" size={14} /> {learner.current_rank || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate("/faculty-studentperformance")}
          className="w-full flex items-center justify-center space-x-2 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <AlertTriangle size={16} />
          <span>View All Priority Cases</span>
        </button>
      </div>
    </div>
  );
}