import { Clock, CalendarDays, Users } from 'lucide-react';

const isCurrentlyOngoing = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return false;
    try {
        const now = new Date();
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59, 999); // Make end date inclusive of the whole day
        return now >= startDate && now <= endDate;
    } catch (error) {
        console.error("Error parsing dates for 'isCurrentlyOngoing':", error, { startDateStr, endDateStr });
        return false;
    }
};

export default function ActivityCard({ activity }) {
    if (!activity) {
        return null; // Or a placeholder for missing data
    }

    // Use actual field names from your API data
    const {
        activity_title, // Was event_name
        description,    // Was Description (note case change)
        start_date,     // Was Start_date (note case change)
        end_date,       // Was End_date (note case change)
        activity_type,  // Was Event_type (note case change)
        all_students,   // For visibility logic
        target_dept,    // For visibility logic
        year_type,      // For visibility logic
        specific_rollno // For visibility logic
    } = activity;

    // Pass the correct date fields to isCurrentlyOngoing
    const ongoing = isCurrentlyOngoing(start_date, end_date);

    // Construct visibility text based on available data
    let visibilityText = "";
    if (all_students === "1" || all_students === true) { // Assuming "1" means all, "0" means targeted
        visibilityText = "All Students";
    } else {
        const targetInfo = [];
        if (target_dept) targetInfo.push(target_dept);
        if (year_type) targetInfo.push(year_type);
        
        if (targetInfo.length > 0) {
            visibilityText = `Targeted: ${targetInfo.join(', ')}`;
            if (specific_rollno && specific_rollno.trim() !== "") {
                visibilityText += " (plus specific roll numbers)";
            }
        } else if (specific_rollno && specific_rollno.trim() !== "") {
            visibilityText = "Specific Roll Numbers Only";
        } else {
            visibilityText = "Audience Not Specified"; // Fallback if no targeting info
        }
    }

    return (
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg max-w-md w-full border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            {/* Tags Section */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                {ongoing && (
                    <span className="flex items-center bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                        <Clock size={14} className="mr-1.5 flex-shrink-0" />
                        Ongoing
                    </span>
                )}
                {activity_type && ( // Use activity_type
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                        {activity_type} {/* Display activity_type */}
                    </span>
                )}
            </div>

            {/* Event Name (using activity_title) */}
            {activity_title && (
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                    {activity_title}
                </h2>
            )}

            {/* Description (using description) */}
            {description && (
                <p className="text-sm text-gray-600 mb-4 break-words"> {/* Added break-words for long descriptions */}
                    {description}
                </p>
            )}

            {/* Details Section */}
            <div className="space-y-2.5 text-sm text-gray-700">
                {(start_date || end_date) && ( // Use start_date and end_date
                     <div className="flex items-center">
                        <CalendarDays size={16} className="mr-2.5 text-gray-500 flex-shrink-0" />
                        <span>
                            {start_date ? new Date(start_date).toLocaleDateString() : 'N/A'} - {end_date ? new Date(end_date).toLocaleDateString() : 'N/A'} {/* Format dates for readability */}
                        </span>
                    </div>
                )}
                {/* Display constructed visibilityText if it's meaningful */}
                {visibilityText && visibilityText !== "Audience Not Specified" && (
                    <div className="flex items-center">
                        <Users size={16} className="mr-2.5 text-gray-500 flex-shrink-0" />
                        <span>{visibilityText}</span>
                    </div>
                )}
            </div>
        </div>
    );
}