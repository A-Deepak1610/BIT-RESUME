import React from "react";
import { Clock, Building, CalendarDays, ExternalLink, XCircle, Info } from "lucide-react";

const SurveyCard = ({ survey }) => {
  if (!survey) {
    return null;
  }

  const getStatusPill = () => {
    switch (survey.status) {
      case "Pending":
        return (
          <span className="flex-shrink-0 flex items-center text-xs font-medium bg-amber-100 text-amber-700 px-2.5 sm:px-3 py-1 rounded-full">
            <Clock size={14} className="text-amber-500 mr-1 sm:mr-1.5" />
            Pending
          </span>
        );
      case "Missed":
        return (
          <span className="flex-shrink-0 flex items-center text-xs font-medium bg-red-100 text-red-700 px-2.5 sm:px-3 py-1 rounded-full">
            <XCircle size={14} className="text-red-500 mr-1 sm:mr-1.5" />
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  const isButtonDisabled = survey.status === "Missed";

  const formattedStartDate = new Date(survey.startDate).toLocaleDateString('en-GB');
  const formattedEndDate = new Date(survey.endDate).toLocaleDateString('en-GB');

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 w-full flex flex-col transition-transform overflow-hidden">
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight mr-2 break-words">
            {survey.title}
          </h2>
          {getStatusPill()}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-0.5">
              <Building size={16} className="mr-1 sm:mr-1.5 text-gray-400" />
              Published By
            </div>
            <p className="text-sm sm:text-base font-semibold text-gray-900">
              {survey.publishedBy}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4">
            <div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-0.5">
                <CalendarDays size={16} className="mr-1 sm:mr-1.5 text-gray-400" />
                Start Date
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                {formattedStartDate}
              </p>
            </div>
            <div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-0.5">
                <CalendarDays size={16} className="mr-1 sm:mr-1.5 text-gray-400" />
                End Date
              </div>
              <p className="text-xs sm:text-sm font-semibold text-red-600">
                {formattedEndDate}
              </p>
            </div>
          </div>
          
           <div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-0.5">
              <Info size={16} className="mr-1 sm:mr-1.5 text-gray-400" />
              Location / Link
            </div>
            <p className="text-sm sm:text-base font-semibold text-blue-600 mt-0.5 break-all">
              {survey.link}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => !isButtonDisabled && survey.link && window.open(survey.link, '_blank')}
        className={`mt-6 w-full font-medium py-2.5 sm:py-3 px-4 rounded-lg flex items-center justify-center text-sm sm:text-base transition-colors duration-150 ${
          isButtonDisabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        disabled={isButtonDisabled}
      >
        Open Survey
        {!isButtonDisabled && <ExternalLink size={18} className="ml-2" />}
      </button>
    </div>
  );
};

export default SurveyCard;