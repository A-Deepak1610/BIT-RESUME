import React from "react";
import { Clock, User, Calendar, ExternalLink, CheckCircle, MapPin, Building, Tag } from "lucide-react";

const MeetingOrSessionCard = ({ meeting }) => {
  if (!meeting) {
    return null;
  }

  const getStatusPill = () => {
    switch (meeting.status) {
      case "Upcoming":
        return (
          <span className="flex-shrink-0 flex items-center text-xs font-medium bg-amber-100 text-amber-700 px-2.5 sm:px-3 py-1 rounded-full">
            <Clock size={14} className="text-amber-500 mr-1 sm:mr-1.5" />
            Upcoming
          </span>
        );
      case "Completed":
        return (
          <span className="flex-shrink-0 flex items-center text-xs font-medium bg-green-100 text-green-700 px-2.5 sm:px-3 py-1 rounded-full">
            <CheckCircle size={14} className="text-green-500 mr-1 sm:mr-1.5" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const isButtonDisabled = meeting.status === "Completed";

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hour, minute] = timeString.split(':');
    const date = new Date(0, 0, 0, hour, minute);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  const formattedDate = new Date(meeting.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 w-full flex flex-col transition-transform overflow-hidden">
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight mr-2 break-words">
            {meeting.title}
          </h2>
          {getStatusPill()}
        </div>
        
        <span className="inline-block self-start text-xs text-indigo-700 bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 rounded-full mb-3">
            {meeting.type}
        </span>

        <div className="space-y-4">
           <div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-0.5">
              <Building size={16} className="mr-1 sm:mr-1.5 text-gray-400" />
              Department
            </div>
            <p className="text-sm sm:text-base font-semibold text-gray-900">
              {meeting.department}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4">
            <div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-0.5">
                <User size={16} className="mr-1 sm:mr-1.5 text-gray-400" />
                Host
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                {meeting.host}
              </p>
            </div>
            <div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-0.5">
                <Calendar size={16} className="mr-1 sm:mr-1.5 text-gray-400" />
                Date
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                {formattedDate}
              </p>
            </div>
          </div>
          
          <div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-0.5">
              <Clock size={16} className="mr-1 sm:mr-1.5 text-gray-400" />
              Time
            </div>
            <p className="text-sm sm:text-base font-semibold text-blue-600 mt-0.5">
              {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
            </p>
          </div>

          <div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-0.5">
              <MapPin size={16} className="mr-1 sm:mr-1.5 text-gray-400" />
              Location / Link
            </div>
            <p className="text-sm sm:text-base font-semibold text-blue-600 mt-0.5 break-all">
              {meeting.location}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => !isButtonDisabled && meeting.location && window.open(meeting.location, '_blank')}
        className={`mt-6 w-full font-medium py-2.5 sm:py-3 px-4 rounded-lg flex items-center justify-center text-sm sm:text-base transition-colors duration-150 ${
          isButtonDisabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        disabled={isButtonDisabled}
      >
        View Details
        {!isButtonDisabled && <ExternalLink size={18} className="ml-2" />}
      </button>
    </div>
  );
};

export default MeetingOrSessionCard;