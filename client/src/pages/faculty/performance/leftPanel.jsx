
import React, { useState } from "react";
import { Search, UserX, X } from "lucide-react";

// This helper function should only be defined once.
const getRankBadgeColor = (rank) => {
    switch (rank?.toLowerCase()) {
        case "top performer":
            return "bg-blue-100 text-blue-700 border border-blue-300";
        case "low performer":
            return "bg-red-100 text-red-700 border border-red-300";
        default:
            return "bg-indigo-100 text-indigo-700 border border-indigo-300";
    }
};

// The component should only be defined and exported once.
export default function StudentPerformance({
    datas = [],
    selectedStudentName,
    onStudentSelect,
    onClose
}) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredStudents = datas.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleClickOnLeft = (student) => {
        if (onStudentSelect) {
            onStudentSelect(student);
        }
    };

    return (
        <div className="p-4 bg-gray-100 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="font-bold text-xl sm:text-2xl text-gray-800">
                    Student Performance
                </h1>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-200"
                    aria-label="Close panel"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 mb-5">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-gray-400" size={18} />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                           text-sm placeholder-gray-500 shadow-sm"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredStudents.length > 0 ? (
                <div className="space-y-4">
                    {filteredStudents.map((item, index) => (
                        <div
                            key={item.id || item.name + index}
                            className={`bg-white border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer
                                        ${selectedStudentName === item.name ? 'ring-2 ring-indigo-500 border-indigo-500' : ''} `}
                            onClick={() => handleClickOnLeft(item)}
                        >
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-3">
                                <h3 className="text-lg font-semibold text-indigo-700 mb-1 sm:mb-0">
                                    {item.name}
                                </h3>
                                <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getRankBadgeColor(
                                        item.performance
                                    )}`}
                                >
                                    {item.performance}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <div className="bg-indigo-50 p-3 rounded-lg shadow-inner w-full">
                                    <p className="text-xs text-indigo-500 font-medium mb-0.5">
                                        Cumulative Points
                                    </p>
                                    <p className="text-xl font-bold text-indigo-600">
                                        {item.cumulativePoints}
                                    </p>
                                </div>
                                {item.rank && (
                                    <div className="bg-green-50 p-3 rounded-lg shadow-inner w-full">
                                        <p className="text-xs text-green-500 font-medium mb-0.5">
                                            Rank
                                        </p>
                                        <p className="text-md font-semibold text-green-700">
                                            {item.rank}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-white rounded-xl shadow-md">
                    <UserX
                        size={40}
                        className="mx-auto text-gray-400 mb-3"
                    />
                    <p className="text-gray-600 text-md font-medium mb-1">
                        No Students Found
                    </p>
                    <p className="text-gray-500 text-xs">
                        Try adjusting your search term.
                    </p>
                </div>
            )}
        </div>
    );
}

// DO NOT ADD ANOTHER COPY OF THE CODE HERE. THE FILE SHOULD END.