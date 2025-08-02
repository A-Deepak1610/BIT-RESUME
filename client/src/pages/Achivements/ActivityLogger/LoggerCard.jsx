import React from "react";
import { MapPin, Trophy, Users, CheckCircle2, Circle, XCircle, Clock } from "lucide-react";

// This component renders a single stage in the progress tracker
const ProgressStage = ({ stage, status }) => {
  const getIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={20} className="text-green-500" />;
      case 'pending':
        return <Clock size={20} className="text-gray-400" />;
      case 'rejected':
        return <XCircle size={20} className="text-red-500" />;
      default:
        return <Circle size={20} className="text-gray-300" />;
    }
  };

  return (
    <div className="flex flex-col items-center text-center w-1/4 px-1">
      <div className="relative">
        {getIcon()}
      </div>
      <span className="text-xs text-gray-500 mt-1 leading-tight">
        {stage}
      </span>
    </div>
  );
};


const LoggerCard = ({ data, onCardClick }) => {
  if (!data) {
    return null;
  }

  // --- Logic to determine the status of each stage ---
  let facultyStatus = 'pending'; // Default to pending
  if (data.state === 'faculty' && data.verified === 'accepted') {
    facultyStatus = 'completed';
  } else if (data.state === 'faculty' && data.verified === 'rejected') {
    facultyStatus = 'rejected';
  }

  // On Duty is completed if faculty is
  const onDutyStatus = facultyStatus === 'completed' ? 'completed' : 'pending';

  // Completed stage status
  let completedStatus = 'pending';
  if (data.state === 'completed' && data.verified === 'accepted') {
    completedStatus = 'completed';
  }

  // --- Logic to determine button text based on progress ---
  const getButtonText = () => {
    if (onDutyStatus === 'completed' && completedStatus !== 'completed') {
      return "Update Status";
    }
    if (completedStatus === 'completed') {
      return "View Proof"; // Or "Completed"
    }
    // Default text for all other states
    return "View Details";
  };
  
  const handleButtonClick = (e) => {
    e.stopPropagation();
    console.log(`Button "${getButtonText()}" clicked for: ${data.eventName}`);
  };

  const progressStages = [
    { name: 'Faculty', status: facultyStatus },
    { name: 'On Duty', status: onDutyStatus },
    { name: 'Completed', status: completedStatus }
  ];

  return (
    <div
      className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col max-w-xs m-2 cursor-pointer"
      onClick={() => onCardClick && onCardClick(data)}
    >
      {data.imageUrl && (
        <img
          src={`http://localhost:6001/${data.imageUrl}`}
          alt={data.eventName || "Event"}
          className="w-full h-[150px] object-cover flex-shrink-0"
        />
      )}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
          {data.eventName}
        </h2>

        {/* --- Event Details --- */}
        <div className="space-y-1 text-sm mb-4 flex-grow">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-600 truncate" title={data.location}>
              {data.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-600">
              Prize: {data.finalPrize1}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-600 truncate">
              Team Members: {data.teamMembers ? data.teamMembers.join(", ") : "N/A"}
            </span>
          </div>
        </div>

        {/* --- Dynamic Button --- */}
        <button
          className="w-full bg-[#0200e1] hover:bg-[#0100b3] text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-150 ease-in-out mb-4"
          onClick={handleButtonClick}
        >
          {getButtonText()}
        </button>

        {/* --- Progress Tracker --- */}
        <div className="mt-0 flex-shrink-0">
          <div className="flex items-start justify-between">
            {progressStages.map((stage, index) => (
              <React.Fragment key={stage.name}>
                <ProgressStage stage={stage.name} status={stage.status} />
                {index < progressStages.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mt-[9px] ${
                      progressStages[index].status === 'completed' ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoggerCard;