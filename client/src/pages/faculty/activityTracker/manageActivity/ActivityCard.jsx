import { Clock, CalendarDays, Users, UserSquare } from 'lucide-react';

const isCurrentlyOngoing = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return false;
    try {
        const now = new Date();
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59, 999);
        return now >= startDate && now <= endDate;
    } catch (error) {
        console.error("Error parsing dates for 'isCurrentlyOngoing':", error, { startDateStr, endDateStr });
        return false;
    }
};

export default function ActivityCard({ activity }) {
    if (!activity) {
        return null;
    }

    const {
        activity_title,
        description,
        start_date,
        end_date,
        date_of_meeting,
        activity_type,
        host,
        all_students,
        target_dept,
        TargetYear,
        specific_rollno
    } = activity;
    console.log(activity)

    const ongoing = isCurrentlyOngoing(start_date, end_date);

    let visibilityText = "";
    if (all_students === 1 || all_students === true || TargetYear === "All Years") {
        visibilityText = "All Students";
    } else {
        const targetInfo = [];
        if (target_dept && target_dept !== "All Departments") targetInfo.push(target_dept);
        if (TargetYear && TargetYear !== "All Years") targetInfo.push(TargetYear);

        if (targetInfo.length > 0) {
            visibilityText = `Targeted: ${targetInfo.join(', ')}`;
            if (specific_rollno && specific_rollno.trim() !== "") {
                visibilityText += " (plus specific roll numbers)";
            }
        } else if (specific_rollno && specific_rollno.trim() !== "") {
            visibilityText = "Specific Roll Numbers Only";
        } else {
            visibilityText = "Audience Not Specified";
        }
    }

    const hostActivityTypes = ["Workshop", "Meeting", "Sessions"];

    return (
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg w-full border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
            <div>
                {/* Tags Section */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    {ongoing && (
                        <span className="flex items-center bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                            <Clock size={14} className="mr-1.5 flex-shrink-0" />
                            Ongoing
                        </span>
                    )}
                    {activity_type && (
                        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                            {activity_type}
                        </span>
                    )}
                </div>

                {/* Event Name */}
                {activity_title && (
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                        {activity_title}
                    </h2>
                )}

                {/* Description */}
                {description && (
                    <p className="text-sm text-gray-600 mb-4 break-words">
                        {description}
                    </p>
                )}
            </div>

            {/* Details Section */}
            <div className="space-y-2 text-sm text-gray-700 mt-auto pt-4 border-t border-gray-100">
                {/* Host Display */}
                {host && hostActivityTypes.includes(activity_type) && host !== 'N/A' && (
                    <div className="flex items-center">
                        <UserSquare size={16} className="mr-2.5 text-gray-500 flex-shrink-0" />
                        <span>
                           <span className="font-semibold">{activity_type === 'Sessions' ? 'Session with:' : 'Host:'}</span> {host}
                        </span>
                    </div>
                )}

                {/* Date Display Logic */}
                {(start_date || date_of_meeting) && (
                     <div className="flex items-center">
                        <CalendarDays size={16} className="mr-2.5 text-gray-500 flex-shrink-0" />
                        <span>
                            {(() => {
                                if (activity_type === 'Session' || activity_type === 'Meeting') {
                                    const dateToShow = date_of_meeting;
                                    const formattedDate = new Date(dateToShow).toLocaleDateString();
                                    return `Date: ${formattedDate}`;
                                }

                                const startDateFormatted = new Date(start_date).toLocaleDateString();
                                if (end_date && new Date(start_date).toDateString() !== new Date(end_date).toDateString()) {
                                    const endDateFormatted = new Date(end_date).toLocaleDateString();
                                    return `${startDateFormatted} - ${endDateFormatted}`;
                                } else {
                                    return `Date: ${startDateFormatted}`;
                                }
                            })()}
                        </span>
                    </div>
                )}

                {/* MODIFIED: Always render the visibility info if it exists */}
                {visibilityText && (
                    <div className="flex items-center">
                        <Users size={16} className="mr-2.5 text-gray-500 flex-shrink-0" />
                        <span>{visibilityText}</span>
                    </div>
                )}
            </div>
        </div>
    );
}