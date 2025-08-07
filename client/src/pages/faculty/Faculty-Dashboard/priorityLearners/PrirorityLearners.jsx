import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaUser, FaClock, FaGraduationCap } from 'react-icons/fa';
import { MdPriorityHigh } from 'react-icons/md';

const priorityLearnersData = [
  { 
    id: 1,
    name: 'Alex Rodriguez', 
    department: 'Computer Science', 
    issue: 'Low Performance', 
    priority: 'High',
    daysOverdue: 5,
    lastActivity: '3 days ago',
    pendingTasks: 4,
    status: 'At Risk'
  },
  { 
    id: 2,
    name: 'Jessica Wang', 
    department: 'Information Technology', 
    issue: 'Missing Submissions', 
    priority: 'Critical',
    daysOverdue: 8,
    lastActivity: '1 week ago',
    pendingTasks: 7,
    status: 'Critical'
  },
  { 
    id: 3,
    name: 'David Kumar', 
    department: 'Software Engineering', 
    issue: 'Attendance Issues', 
    priority: 'Medium',
    daysOverdue: 2,
    lastActivity: '2 days ago',
    pendingTasks: 2,
    status: 'Warning'
  },
  { 
    id: 4,
    name: 'Maria Santos', 
    department: 'Data Science', 
    issue: 'Project Delays', 
    priority: 'High',
    daysOverdue: 6,
    lastActivity: '4 days ago',
    pendingTasks: 5,
    status: 'At Risk'
  },
  { 
    id: 5,
    name: 'James Wilson', 
    department: 'Cybersecurity', 
    issue: 'Grade Recovery', 
    priority: 'Medium',
    daysOverdue: 3,
    lastActivity: '1 day ago',
    pendingTasks: 3,
    status: 'Warning'
  },
  { 
    id: 6,
    name: 'Sophie Chen', 
    department: 'Computer Science', 
    issue: 'Incomplete Projects', 
    priority: 'Critical',
    daysOverdue: 10,
    lastActivity: '5 days ago',
    pendingTasks: 8,
    status: 'Critical'
  }
];

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Critical': return 'text-red-600 bg-red-100';
    case 'High': return 'text-orange-600 bg-orange-100';
    case 'Medium': return 'text-yellow-600 bg-yellow-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Critical': return 'text-red-700 bg-red-100 border-red-200';
    case 'At Risk': return 'text-orange-700 bg-orange-100 border-orange-200';
    case 'Warning': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    default: return 'text-gray-700 bg-gray-100 border-gray-200';
  }
};

export default function PriorityLearners() {
  const navigate = useNavigate();

  const sortedLearners = priorityLearnersData
    .sort((a, b) => {
      const priorityOrder = { 'Critical': 3, 'High': 2, 'Medium': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  return (
    <div className="p-4 rounded-lg flex flex-col h-full bg-white shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <MdPriorityHigh className="text-red-500 text-xl" />
          <h2 className="text-lg font-semibold text-gray-800">Priority Learners</h2>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600 items-center">
          <div className="flex items-center gap-1">
            <FaExclamationTriangle className="text-red-500" /> 
            <span>Needs Attention</span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock className="text-orange-500" /> 
            <span>Overdue</span>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0">
        {sortedLearners.map((learner) => (
          <div
            key={learner.id}
            className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors duration-150"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex-grow min-w-0 mb-2 sm:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <FaUser className="text-gray-500 text-sm flex-shrink-0" />
                  <p className="font-semibold text-gray-900 text-sm truncate">{learner.name}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(learner.priority)}`}>
                    {learner.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{learner.department}</p>
                <p className="text-xs text-gray-600 font-medium">{learner.issue}</p>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(learner.status)}`}>
                  {learner.status}
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaClock /> {learner.daysOverdue}d
                  </span>
                  <span className="flex items-center gap-1">
                    <FaGraduationCap /> {learner.pendingTasks}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{learner.lastActivity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate('/faculty-priority-learners')}
          className="w-full flex items-center justify-center space-x-2 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <FaExclamationTriangle />
          <span>View All Priority Cases</span>
        </button>
      </div>
    </div>
  );
}