import React, { useState } from "react";
import { TrendingUp, Puzzle, CalendarDays, Users, BarChart3, CheckCircle } from 'lucide-react';
import PsSkillGraph from "../../dashboard/graphs/ps/PsGraph";
import MentorMenteesGraph from "../../dashboard/graphs/mentor/MentorGraph"
import AchievementsGraph from "../../dashboard/graphs/grpah2/AchievementsGraph"
import ActivenessGraph from "../../dashboard/graphs/graph1/ActivenessGraph"

const tabsData = [
    {id: 'activeness', label: 'Activeness', icon: TrendingUp,},
    {id: 'achivement', label: 'Achivment', icon: Puzzle,}, // Note: 'Achivment' might be a typo for 'Achievement'
    {id: 'psgraph', label: 'PS Graph', icon: CalendarDays,},
    {id: 'mentograph' , label: 'MentoGraph' , icon: Users }
];

const statsCardsData = [
    {
        id: 1,
        title: "Overall Score",
        value: "85%",
        change: "+5% MoM",
        changeType: "positive",
        icon: BarChart3,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600"
    },
    {
        id: 2,
        title: "Projects Completed",
        value: "12",
        change: "2 pending",
        changeType: "neutral",
        icon: CheckCircle,
        iconBgColor: "bg-blue-100",
        iconTextColor: "text-blue-600"
    },
    {
        id: 3,
        title: "Mentorship Hours",
        value: "48",
        change: "-2 hours WoW",
        changeType: "negative",
        icon: Users,
        iconBgColor: "bg-purple-100",
        iconTextColor: "text-purple-600"
    }
];


export default function GraphVisual({ name, roll }) {
    const [activeTab, setActiveTab] = useState(tabsData[0].id);

    return (
        // The main container div now renders unconditionally
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Student Information Header - this section handles name/roll presence */}
            <div className="mb-6">
                <div className="text-2xl md:text-3xl font-bold text-gray-800">
                    {name ? `${name}'s Performance` : "Performance Overview"}
                </div>
                {roll && (
                    <div className="text-sm text-gray-600 mt-1">
                        Roll No: {roll}
                    </div>
                )}
                {/* This message will now correctly display if name and roll are not provided */}
                {!name && !roll && (
                     <div className="text-sm text-gray-500 mt-1">
                        Select a student to view detailed performance metrics.
                    </div>
                )}
            </div>

            {/* Conditionally render the tabs, graph, and stats cards only if 'name' is provided */}
            {name && (
                <>
                    {/* Tab Navigation Bar */}
                    <div className="bg-slate-100 p-1.5 rounded-xl flex items-center space-x-1.5 mb-8 shadow-sm">
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
                                        text-sm sm:text-base
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
                                        size={18}
                                        className={`transition-colors duration-200 ${isActive ? "text-indigo-600" : "text-gray-500 group-hover:text-indigo-500"}`}
                                    />
                                    <span>{tab.label}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Graph Content Area */}
                    <div className="mb-8">
                      {activeTab === 'activeness' && <div className="border border-gray-200 p-2 md:p-4 bg-white w-full rounded-xl shadow-md h-[50vh]"><ActivenessGraph/></div>}
                      {activeTab === 'achivement' && <div className="border border-gray-200 p-2 md:p-4 bg-white w-full rounded-xl shadow-md h-[50vh] "><AchievementsGraph/></div>}
                      {activeTab === 'psgraph' && <div className="border border-gray-200 p-2 md:p-4 bg-white w-full rounded-xl shadow-md h-[50vh]"><PsSkillGraph/></div> }
                      {activeTab === 'mentograph' && <div className="border border-gray-200 p-2 md:p-4 bg-white w-full rounded-xl shadow-md h-[50vh]"><MentorMenteesGraph/></div> }
                    </div>


                    {/* Stats Cards Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {statsCardsData.map(card => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={card.id}
                                    className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                                {card.title}
                                            </h3>
                                            <div className={`p-2 rounded-full ${card.iconBgColor}`}>
                                                <Icon size={20} className={card.iconTextColor} />
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-800">
                                            {card.value}
                                        </p>
                                    </div>
                                    <p className={`text-xs mt-2 ${
                                        card.changeType === 'positive' ? 'text-green-500' :
                                        card.changeType === 'negative' ? 'text-red-500' :
                                        'text-gray-400'
                                    }`}>
                                        {card.change}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}