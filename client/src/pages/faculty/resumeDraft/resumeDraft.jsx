import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, User, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../store/UseAuth';

export default function ResumeDraft() {
    const { rollno } = useAuth(); // Mentor's rollno
    const navigate = useNavigate();

    const [menteesByYear, setMenteesByYear] = useState({});
    const [expandedYears, setExpandedYears] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const handleStudentsData = async () => {
            if (!rollno) return;
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:6001/api/studentdata/fetchmentees/${rollno}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const result = await response.json();
                
                // Group the flat array of mentees by their 'year' property
                const groupedData = (result.mentees || []).reduce((acc, student) => {
                    const yearKey = `Year ${student.year}`;
                    if (!acc[yearKey]) {
                        acc[yearKey] = [];
                    }
                    acc[yearKey].push(student);
                    return acc;
                }, {});

                setMenteesByYear(groupedData);

                // Automatically expand all year sections when data is loaded
                const initialExpanded = {};
                Object.keys(groupedData).forEach(year => {
                    initialExpanded[year] = true;
                });
                setExpandedYears(initialExpanded);

            } catch (error) {
                console.error("Error fetching students data:", error);
                setError("Failed to fetch student data.");
            } finally {
                setLoading(false);
            }
        };

        handleStudentsData();
    }, [rollno]);

    const toggleYearExpansion = (yearKey) => {
        setExpandedYears(prev => ({
            ...prev,
            [yearKey]: !prev[yearKey]
        }));
    };

    // Updated to navigate with the student's roll number
    const handleStudentClick = (student) => {
        console.log(`Navigating to resume for: ${student.user_name}, Roll No: ${student.rollno}`);
        navigate('/resume', { state: { rollno: student.rollno } });
    };

    const yearKeys = Object.keys(menteesByYear);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading student data...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }
    
    if (yearKeys.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
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
                {yearKeys.sort().map((yearKey) => (
                    <div key={yearKey} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => toggleYearExpansion(yearKey)}
                            className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-100 hover:bg-slate-200 transition-colors duration-150 focus:outline-none"
                            aria-expanded={expandedYears[yearKey]}
                            aria-controls={`student-list-${yearKey}`}
                        >
                            <h2 className="text-lg sm:text-xl font-semibold text-indigo-700">
                                {yearKey}
                            </h2>
                            {expandedYears[yearKey] ? (
                                <ChevronUp size={24} className="text-indigo-600" />
                            ) : (
                                <ChevronDown size={24} className="text-indigo-600" />
                            )}
                        </button>

                        {expandedYears[yearKey] && (
                            <div id={`student-list-${yearKey}`} className="p-4 sm:p-6">
                                {menteesByYear[yearKey] && menteesByYear[yearKey].length > 0 ? (
                                    <ul className="space-y-3">
                                        {menteesByYear[yearKey].map((student) => (
                                            <li
                                                key={student.rollno}
                                                onClick={() => handleStudentClick(student)}
                                                className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-indigo-300 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        handleStudentClick(student);
                                                    }
                                                }}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex items-center mb-1 sm:mb-0">
                                                        <User size={18} className="text-indigo-500 mr-2.5 flex-shrink-0" />
                                                        <span className="font-medium text-gray-700">{student.user_name}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Hash size={16} className="text-gray-400 mr-1.5 flex-shrink-0" />
                                                        <span>Roll No: {student.rollno}</span>
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