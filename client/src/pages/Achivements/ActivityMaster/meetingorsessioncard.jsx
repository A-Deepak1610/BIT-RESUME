import React from "react";
import { Clock, User, CalendarDays, ExternalLink, CheckCircle2, XCircle } from "lucide-react";

const MeetingOrSessionCard = ({ meeting }) => {
  if (!meeting) {
    return null;
  }

  // Adapted from SurveyCard's getStatusPill
  const getStatusPill = () => {
    switch (meeting.Status) {
      case "Pending":
        return (
          <span className="flex-shrink-0 flex items-center text-xs font-medium bg-amber-100 text-amber-700 px-2.5 sm:px-3 py-1 rounded-full">
            <Clock size={14} className="text-amber-500 mr-1 sm:mr-1.5" />
            Upcoming
          </span>
        );
      case "completed":
        return (
          <span className="flex-shrink-0 flex items-center text-xs font-medium bg-green-100 text-green-700 px-2.5 sm:px-3 py-1 rounded-full">
            <CheckCircle2 size={14} className="text-green-500 mr-1 sm:mr-1.5" />
            Completed
          </span>
        );
      case "Missed": // Assuming 'Missed' can be a status for meetings too
        return (
          <span className="flex-shrink-0 flex items-center text-xs font-medium bg-red-100 text-red-700 px-2.5 sm:px-3 py-1 rounded-full">
            <XCircle size={14} className="text-red-500 mr-1 sm:mr-1.5" />
            Missed
          </span>
        );
      default:
        return null;
    }
  };

  const isButtonDisabled = meeting.Status === "completed" || meeting.Status === "Missed";

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 w-full flex flex-col transition-transform overflow-hidden">
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight mr-2">
            {meeting.SurveyName} {/* Using SurveyName as Meeting Title */}
          </h2>
          {getStatusPill()}
        </div>

        {meeting.serveyType && (
          <span className="inline-block self-start text-xs text-gray-600 border border-gray-300 bg-white px-2.5 sm:px-3 py-1 rounded-full mb-4">
            {meeting.serveyType}
          </span>
        )}

        <div>
          <p className="text-xs sm:text-sm text-gray-500">Details</p>
          <p className="text-sm sm:text-base font-semibold text-blue-600 mt-0.5">
            {meeting.SurveyDescription} {/* Using SurveyDescription for details */}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-2 mt-4 sm:mt-5">
          <div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-0.5">
              <User size={16} className="mr-1 sm:mr-1.5 text-gray-400" />
              Host
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-900">
              {meeting.PublishedBy}
            </p>
          </div>
          <div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-0.5">
              <CalendarDays size={16} className="mr-1 sm:mr-1.5 text-gray-400" />
              Meeting Date
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-900">
              {meeting["Event Date"]}
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-5">
          <p className="text-xs sm:text-sm text-gray-500">Time</p>
          <p className="text-sm sm:text-base font-semibold text-blue-600 mt-0.5">
            {meeting.DeathLine}
          </p>
        </div>
      </div>
      <button
        className={`mt-5 sm:mt-6 w-full font-medium py-2.5 sm:py-3 px-4 rounded-lg flex items-center justify-center text-sm sm:text-base transition-colors duration-150
          ${
            isButtonDisabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        disabled={isButtonDisabled}
      >
        Join Meeting
        {!isButtonDisabled && <ExternalLink size={18} className="ml-2" />}
      </button>
    </div>
  );
};

export default MeetingOrSessionCard;