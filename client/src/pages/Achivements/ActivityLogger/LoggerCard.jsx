import React, { useState } from "react";
import {
  MapPin,
  Trophy,
  Users,
  CheckCircle2,
  Circle,
  XCircle,
  Clock,
  Tag,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
} from "@mui/material";

// This component renders a single stage in the progress tracker
const ProgressStage = ({ stage, status }) => {
  const getIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={20} className="text-green-500" />;
      case "pending":
        return <Clock size={20} className="text-orange-500" />;
      case "rejected":
        return <XCircle size={20} className="text-red-500" />;
      default:
        return <Circle size={20} className="text-gray-300" />;
    }
  };

  return (
    <div className="flex flex-col items-center text-center w-1/3 px-1">
      <div className="relative">{getIcon()}</div>
      <span className="text-xs text-gray-500 mt-1 leading-tight">{stage}</span>
    </div>
  );
};

// Minimal Team Details Modal Component
const TeamDetailsModal = ({ open, onClose, data }) => {
  if (!data) return null;

  const leader = data.leaderRollno || data.leader_rollno;
  const teammates = data.teamMembers || data.teammates?.split(",") || [];
  const otherMembers = teammates.filter((member) => member !== leader);

  const getStatusLabel = (state, verified) => {
    if (verified === "rejected") return "Rejected";
    if (verified === "accepted") return "On Duty";
    if (state === "faculty") return "Pending";
    return "Submitted";
  };

  const getStatusColor = (state, verified) => {
    if (verified === "rejected") return "error";
    if (verified === "accepted") return "success";
    if (state === "faculty") return "warning";
    return "default";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ color: "blue" }}>
          {data.eventName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.eventCode}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Status */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Status
            </Typography>
            <Chip
              label={getStatusLabel(data.state, data.verified)}
              color={getStatusColor(data.state, data.verified)}
              size="small"
            />
          </Box>

          {/* Team Members */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Team Members ({teammates.length})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Leader:</strong> {leader}
            </Typography>
            {otherMembers.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                <strong>Members:</strong> {otherMembers.join(", ")}
              </Typography>
            )}
          </Box>

          {/* Faculty Comments */}
          {data.facultyComments && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Faculty Comments
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  p: 1.5,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  fontStyle: "italic",
                }}
              >
                "{data.facultyComments}"
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const LoggerCard = ({ data, onCardClick }) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!data) {
    return null;
  }

  // Simplified progress logic based on state and verified
  let facultyStatus = "pending";
  let onDutyStatus = "pending";

  if (data.verified === "rejected") {
    facultyStatus = "rejected";
    onDutyStatus = "rejected";
  } else if (data.verified === "accepted") {
    facultyStatus = "completed";
    onDutyStatus = "completed";
  } else if (data.state === "faculty") {
    facultyStatus = "pending";
    onDutyStatus = "pending";
  }

  const handleButtonClick = (e) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  const handleCardClick = (e) => {
    if (onCardClick) {
      onCardClick(data);
    } else {
      setModalOpen(true);
    }
  };

  const progressStages = [
    { name: "Faculty", status: facultyStatus },
    { name: "On Duty", status: onDutyStatus },
  ];

  return (
    <>
      <div
        className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col w-full max-w-md h-[453px] cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="relative h-[165px] flex-shrink-0">
          {data.imageUrl && (
            <img
              src={`http://localhost:6001/${data.imageUrl}`}
              alt={data.eventName || "Event"}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Content Section - Fixed height calculation */}
        <div className="p-4 flex flex-col flex-1" style={{ height: 'calc(453px - 165px)' }}>
          {/* Date and Event Type */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500 font-medium">
              {data.eventDate}
            </span>
            {data.eventType && (
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border
                  ${
                    data.eventType.toLowerCase() === "offline"
                      ? "text-green-700 bg-green-100 border-green-300"
                      : data.eventType.toLowerCase() === "online"
                      ? "text-blue-700 bg-blue-100 border-blue-300"
                      : "text-purple-700 bg-purple-100 border-purple-300"
                  }`}
              >
                {data.eventType}
              </span>
            )}
          </div>

          {/* Event Name */}
          <h2 className="text-base font-bold text-gray-800 mb-2 leading-tight line-clamp-2">
            {data.eventName}
          </h2>

          {/* Event Details */}
          <div className="space-y-1 text-sm mb-3 flex-grow">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-gray-400 flex-shrink-0" />
              <span
                className="text-xs text-gray-600 truncate"
                title={data.location}
              >
                {data.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-600">
                Prize: {data.prizeAmount || data.finalPrize1}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-600">
                Code: {data.eventCode}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-600 truncate">
                Members: {data.teamMembers ? data.teamMembers.join(", ") : "N/A"}
              </span>
            </div>
          </div>

          {/* View Details Button */}
          <button
            className="w-full bg-[#0200e1] hover:bg-[#0100b3] outline-none text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-150 ease-in-out mb-3"
            onClick={handleButtonClick}
          >
            View Details
          </button>

          {/* Progress Tracker */}
          <div className="flex-shrink-0">
            <div className="flex items-start justify-between">
              {progressStages.map((stage, index) => (
                <React.Fragment key={stage.name}>
                  <ProgressStage stage={stage.name} status={stage.status} />
                  {index < progressStages.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mt-[9px] ${
                        progressStages[index].status === "completed"
                          ? "bg-green-500"
                          : progressStages[index].status === "rejected"
                          ? "bg-red-500"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Team Details Modal */}
      <TeamDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
      />
    </>
  );
};

export default LoggerCard;