// ResumeDraft.js
import React, { use, useState } from 'react';
import studData from '../../../dummydatas/resumeDraft.json'; // Adjust path if necessary
import { ChevronDown, ChevronUp, User, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const formatYearKey = (yearKey) => {
    if (!yearKey.startsWith('year-')) return yearKey;
    return `Year ${yearKey.split('-')[1]}`;
};

export default function ResumeDraft() {
  const Navigate = useNavigate()
    const yearData = studData[0] || {};
    const years = Object.keys(yearData);

    // State to manage which year sections are expanded
    const [expandedYears, setExpandedYears] = useState(() => {
        // Optionally, expand all years by default
        const initialExpanded = {};
        years.forEach(year => initialExpanded[year] = true);
        return initialExpanded;
    });

    const toggleYearExpansion = (yearKey) => {
        setExpandedYears(prev => ({
            ...prev,
            [yearKey]: !prev[yearKey]
        }));
    };

    const handleStudentClick = (student) => {
        console.log(`Student Name: ${student.name}, Roll No: ${student.rollNo}`);
        Navigate('/student-resume')
    };

    if (years.length === 0) {
        return (
            <div className="p-4 sm:p-6 md:p-8 text-center text-gray-500">
                No student data available to display.
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-slate-50 min-h-screen">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center sm:text-left">
                Student Resume Drafts
            </h1>

            <div className="space-y-6">
                {years.map((yearKey) => (
                    <div key={yearKey} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        {/* Year Header - Clickable to expand/collapse */}
                        <button
                            onClick={() => toggleYearExpansion(yearKey)}
                            className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-100 hover:bg-slate-200 transition-colors duration-150 focus:outline-none"
                            aria-expanded={expandedYears[yearKey]}
                            aria-controls={`student-list-${yearKey}`}
                        >
                            <h2 className="text-lg sm:text-xl font-semibold text-indigo-700">
                                {formatYearKey(yearKey)}
                            </h2>
                            {expandedYears[yearKey] ? (
                                <ChevronUp size={24} className="text-indigo-600" />
                            ) : (
                                <ChevronDown size={24} className="text-indigo-600" />
                            )}
                        </button>

                        {/* Student List - Collapsible Content */}
                        {expandedYears[yearKey] && (
                            <div id={`student-list-${yearKey}`} className="p-4 sm:p-6">
                                {yearData[yearKey] && yearData[yearKey].length > 0 ? (
                                    <ul className="space-y-3">
                                        {yearData[yearKey].map((student, index) => (
                                            <li
                                                key={student.rollNo || index} // Prefer rollNo as key if unique
                                                onClick={() => handleStudentClick(student)}
                                                className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-indigo-300 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                tabIndex={0} // Make it focusable
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        handleStudentClick(student);
                                                    }
                                                }}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex items-center mb-1 sm:mb-0">
                                                        <User size={18} className="text-indigo-500 mr-2.5 flex-shrink-0" />
                                                        <span className="font-medium text-gray-700">{student.name}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Hash size={16} className="text-gray-400 mr-1.5 flex-shrink-0" />
                                                        <span>Roll No: {student.rollNo || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">No students listed for this year.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}