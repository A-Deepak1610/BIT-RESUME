import React, { useState, useEffect } from "react"; // Added useEffect for a small improvement
import { useNavigate } from "react-router-dom";
import { TrendingUp, Puzzle, CalendarDays, Users } from 'lucide-react';
import PsSkillGraph from "../../dashboard/graphs/ps/PsGraph";
import MentorMenteesGraph from "../../dashboard/graphs/mentor/MentorGraph";
import AchievementsGraph from "../../dashboard/graphs/grpah2/AchievementsGraph";
import ActivenessGraph from "../../dashboard/graphs/graph1/ActivenessGraph";

const tabsData = [
    { id: 'activeness', label: 'Activeness', icon: TrendingUp },
    { id: 'achievement', label: 'Achievement', icon: Puzzle },
    { id: 'psgraph', label: 'PS Graph', icon: CalendarDays },
    { id: 'mentograph', label: 'MentoGraph', icon: Users }
];

export default function GraphVisual({ name, roll }) {
    const [activeTab, setActiveTab] = useState(tabsData[0].id);
    const navigate = useNavigate();

    // --- IMPROVEMENT ---
    // Reset to the first tab whenever the student changes.
    // This provides a more consistent user experience.
    useEffect(() => {
        setActiveTab(tabsData[0].id);
    }, [roll]); // This effect runs every time the `roll` prop changes.

    const handleResumeClick = () => {
        navigate('/resume', { state: { rollno: roll } });
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50">
            <div className="mb-6">
                <div className="text-2xl md:text-3xl font-bold text-gray-800">
                    {name ? `${name}'s Performance` : "Performance Overview"}
                </div>
                {roll && (
                    <div className="text-sm text-gray-600 mt-1">
                        Roll No: {roll}
                    </div>
                )}
                {!name && !roll && (
                    <div className="text-sm text-gray-500 mt-1">
                        Select a student to view detailed performance metrics.
                    </div>
                )}
            </div>

            {name && roll && ( // Ensure both name and roll exist before rendering graphs
                <>
                    <div className="bg-slate-100 p-1.5 rounded-xl flex flex-wrap items-center space-x-1.5 mb-8 shadow-sm">
                        {tabsData.map((tab) => {
                            const IconComponent = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <div
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setActiveTab(tab.id);
                                        }
                                    }}
                                    className={`
                                        group flex-1 flex items-center justify-center space-x-2 py-2 px-2 sm:px-4
                                        rounded-lg transition-all duration-200 ease-in-out
                                        focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50
                                        text-xs sm:text-sm
                                        cursor-pointer
                                        ${isActive
                                            ? 'bg-white text-indigo-700 font-semibold shadow-sm'
                                            : 'text-gray-600 hover:bg-slate-200 hover:text-indigo-600'
                                        }
                                    `}
                                    role="button"
                                    tabIndex={0}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <IconComponent
                                        size={16}
                                        className={`transition-colors duration-200 ${isActive ? "text-indigo-600" : "text-gray-500 group-hover:text-indigo-500"}`}
                                    />
                                    <span>{tab.label}</span>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* --- THE FIX IS HERE --- */}
                    {/* By adding `key={roll}` to this container, any time the `roll` prop changes,
                        React will destroy the old component inside and create a brand new one.
                        This forces the graph component to re-mount and re-run its data fetching logic. */}
                    <div key={roll} className="mb-8">
                        {activeTab === 'activeness' && <div className="border border-gray-200 p-2 md:p-4 bg-white w-full rounded-xl shadow-md h-[50vh]"><ActivenessGraph rollno={roll} /></div>}
                        {activeTab === 'achievement' && <div className="border border-gray-200 p-2 md:p-4 bg-white w-full rounded-xl shadow-md h-[50vh]"><AchievementsGraph rollno={roll} /></div>}
                        {activeTab === 'psgraph' && <div className="border border-gray-200 p-2 md:p-4 bg-white w-full rounded-xl shadow-md h-[50vh]"><PsSkillGraph rollno={roll} /></div>}
                        {activeTab === 'mentograph' && <div className="border border-gray-200 p-2 md:p-4 bg-white w-full rounded-xl shadow-md h-[50vh]"><MentorMenteesGraph rollno={roll} /></div>}
                    </div>
                    
                    {/* View Resume Button */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleResumeClick}
                            className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-all duration-300"
                        >
                            View Resume
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}