// RequestCard.jsx
import React from "react";
import { MapPin, Trophy, Users, Tag, XCircle, CheckCircle2 } from "lucide-react";

import defaultEventImage from "../../../assets/ActivityMaster/master.jpg"; // Ensure this path is correct

const RequestCard = ({ data, onApprove, onReject }) => {
  if (!data) {
    return null; // Or some placeholder for missing data
  }

  const imgSrc = defaultEventImage;
  const requestedBy = data["Requested By"]; // Accessing field name with a space

  const handleApproveClick = (e) => {
    e.stopPropagation(); // Prevent card click if an onCardClick prop were added to the parent div
    if (onApprove) onApprove(data.id);
  };

  const handleRejectClick = (e) => {
    e.stopPropagation();
    if (onReject) onReject(data.id);
  };

  // Dynamically set status badge classes
  let statusBadgeClasses = "text-xs font-semibold px-2 py-0.5 rounded-md"; // Base classes
  if (data.status) {
    switch (data.status.toLowerCase()) {
      case "pending":
        statusBadgeClasses += " bg-yellow-200 text-yellow-800";
        break;
      case "approved":
        statusBadgeClasses += " bg-green-200 text-green-800";
        break;
      case "rejected":
        statusBadgeClasses += " bg-red-200 text-red-800";
        break;
      default:
        statusBadgeClasses += " bg-gray-200 text-gray-800"; // Fallback for unknown status
        break;
    }
  } else {
    statusBadgeClasses += " bg-gray-200 text-gray-800"; // If status is undefined/null
  }

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col max-w-md"> {/* max-w-md is fine for card in grid */}
      {/* Image Section */}
      <div className="relative">
        <img
          src={imgSrc}
          alt={data.eventName || "Event"}
          className="w-full h-[160px] object-cover" // Fixed height is common for cards, object-cover handles aspect ratio
        />
        {requestedBy && (
          <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md shadow">
            Requested by {requestedBy}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Date and Event Type */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 font-medium">{data.eventDate}</span>
          {data.eventType && (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border
                ${
                  data.eventType.toLowerCase() === "offline"
                    ? "text-purple-700 bg-purple-100 border-purple-300"
                    : "text-blue-700 bg-blue-100 border-blue-300"
                }`}
            >
              {data.eventType}
            </span>
          )}
        </div>

        {/* Event Name */}
        <h2 className="text-lg font-bold text-gray-800 mb-3 leading-tight">
          {data.eventName}
        </h2>

        {/* Details List - uses flex-grow to take available space */}
        <div className="space-y-1.5 text-sm mb-4 flex-grow">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} className="text-gray-400 flex-shrink-0" />
            <span className="truncate" title={data.location}>{data.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Trophy size={16} className="text-gray-400 flex-shrink-0" />
            <span>Prize Amount : {data.prizeAmount}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Tag size={16} className="text-gray-400 flex-shrink-0" />
            <span>Event Code : {data.eventCode}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={16} className="text-gray-400 flex-shrink-0" />
            <span className="truncate" title={data.teamMembers ? data.teamMembers.join(", ") : ""}>
              Team Members : {data.teamMembers ? data.teamMembers.join(", ") : "N/A"}
            </span>
          </div>
        </div>

        {/* Status and Action Buttons - pushed to bottom by flex-grow in details */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-200"> {/* Increased pt for more space */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status :</span>
            {data.status ? (
              <span className={statusBadgeClasses}>
                {data.status}
              </span>
            ) : (
              <span className={`${statusBadgeClasses} bg-gray-200 text-gray-800`}>
                N/A
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleRejectClick}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors duration-150"
              aria-label="Reject Request"
              title="Reject"
            >
              <XCircle size={22} />
            </button>
            <button
              onClick={handleApproveClick}
              className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-100 rounded-full transition-colors duration-150"
              aria-label="Approve Request"
              title="Approve"
            >
              <CheckCircle2 size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;