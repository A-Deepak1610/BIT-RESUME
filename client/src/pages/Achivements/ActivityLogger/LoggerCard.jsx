// LoggerCard.js
import React from "react";
import { MapPin, Trophy, Users, Tag, CheckCircle2, Circle } from "lucide-react";

import defaultEventImage from "../../../assets/ActivityMaster/master.jpg";

const LoggerCard = ({ data, onCardClick }) => {
  if (!data) {
    return null; // Or some placeholder for missing data
  }
  const imgSrc = defaultEventImage;

  return (
    <div
      className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col"
      onClick={() => onCardClick && onCardClick(data)}
    >
      {/* Conditionally render the image only if imgSrc is truthy */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={data.eventName || "Event"}
          className="w-full h-[150px] object-cover flex-shrink-0" // Fixed height, object-cover is good
        />
      )}


      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-sm text-gray-500 font-medium">{data.eventDate}</span>
          {data.eventType && (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border
                ${
                  data.eventType.toLowerCase() === "offline"
                    ? "text-green-700 bg-green-100 border-green-300"
                    : "text-blue-700 bg-blue-100 border-blue-300"
                }`}
            >
              {data.eventType}
            </span>
          )}
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-2 leading-tight"> {/* text-lg is responsive enough */}
          {data.eventName}
        </h2>

        <div className="space-y-1 text-sm mb-4 flex-grow">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-600 truncate" title={data.location}>{data.location}</span> {/* Changed to text-xs */}
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-600"> {/* Changed to text-xs */}
              Prize Amount : {data.prizeAmount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-600"> {/* Changed to text-xs */}
              Event Code : {data.eventCode}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-600 truncate" title={data.teamMembers ? data.teamMembers.join(", ") : ""}> {/* Changed to text-xs */}
              Team Members : {data.teamMembers ? data.teamMembers.join(", ") : "N/A"}
            </span>
          </div>
        </div>

        {/* Button: flex-shrink-0 prevents it from shrinking */}
        <button
          className="w-full bg-[#0200e1] hover:bg-[#0100b3] text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-150 ease-in-out mb-4 cursor-pointer flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when button is clicked
            console.log("Apply button clicked for:", data.eventName);
            // Add your apply logic here
          }}
        >
          {data.applyButtonText}
        </button>

        {data.progressStatus && data.progressStatus.length > 0 && (
          <div className="mt-0 flex-shrink-0"> {/* Adjusted margin */}
            <div className="flex items-start justify-between">
              {data.progressStatus.map((stage, index) => (
                <React.Fragment key={stage.stageName}>
                  <div className="flex flex-col items-center text-center w-1/3 px-1"> {/* w-1/3 assumes 3 stages */}
                    {stage.isCompleted ? (
                      <CheckCircle2 size={20} className="text-green-500" />
                    ) : (
                      <Circle size={20} className="text-gray-300" />
                    )}
                    <span className="text-xs text-gray-500 mt-1 leading-tight"> {/* Changed to text-xs */}
                      {stage.stageName}
                    </span>
                  </div>
                  {index < data.progressStatus.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mt-[9px] ${ /* mt adjusted for icon centering */
                        stage.isCompleted
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoggerCard;