import React, { useState } from "react";
import { MapPin, Trophy, Users, Tag, XCircle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import defaultEventImage from "../../../assets/ActivityMaster/master.jpg";
import useAuth from "../../../store/UseAuth";

const RequestCard = ({ data, onApprove, onReject }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(data?.status || "Pending");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  
  const {rollno} = useAuth();
  // const rollno = '7376242AD137';

  if (!data) {
    return null;
  }

  console.log("RequestCard data:", data);

  const imgSrc = data.imageUrl 
    ? `http://localhost:6001/${data.imageUrl}` 
    : defaultEventImage;
  const requestedBy = data["Requested By"];

  // API function to update registration status
  const updateRegistrationStatus = async (rollno, eventCode, teamCode, action, reason = "") => {
    try {
      setIsUpdating(true);
      
      console.log("Sending request:", {
        rollno,
        eventCode,
        teamCode,
        action,
        reason,
        url: `http://localhost:6001/api/events/registered_events/approve_reject/${rollno}`
      });

      const requestBody = {
        rollno: rollno,
        event_code: eventCode,
        team_code: teamCode,
        action: action,
      };

      // Add reason if it's a reject action
      if (action === "reject" && reason) {
        requestBody.reason = reason;
      }

      const response = await fetch(
        `http://localhost:6001/api/events/registered_events/approve_reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        }
      );

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } catch {
          throw new Error(responseText || `Server error: ${response.status}`);
        }
      }

      try {
        const result = JSON.parse(responseText);
        return result;
      } catch {
        return { message: responseText };
      }

    } catch (error) {
      console.error(`Error ${action}ing registration:`, error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleApproveClick = async (e) => {
    e.stopPropagation();

    if (isUpdating || isProcessed) return;

    try {
      const rollnoToUpdate = rollno;
      const eventCode = data.eventCode || data.event_code;
      const teamCode = data.teamCode || data.team_code;
      
      console.log("Approving with data:", {
        rollno: rollnoToUpdate,
        eventCode: eventCode,
        teamCode: teamCode
      });

      if (!rollnoToUpdate || !eventCode || !teamCode) {
        throw new Error("Missing required data: rollno, eventCode, or teamCode");
      }

      const result = await updateRegistrationStatus(
        rollnoToUpdate,
        eventCode,
        teamCode,
        "approve"
      );

      console.log("Registration approved:", result);
      
      setIsProcessed(true);
      setCurrentStatus("Approved");
      
      alert("Registration approved successfully!");

      if (onApprove) {
        onApprove(data.id);
      }
    } catch (error) {
      console.error("Failed to approve registration:", error);
      alert(`Failed to approve registration: ${error.message}`);
    }
  };

  const handleRejectClick = (e) => {
    e.stopPropagation();
    if (isUpdating || isProcessed) return;
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    try {
      const rollnoToUpdate = data.rollno || data.leader_rollno || data.eventCode;
      const eventCode = data.eventCode || data.event_code;
      const teamCode = data.teamCode || data.team_code;
      
      console.log("Rejecting with data:", {
        rollno: rollnoToUpdate,
        eventCode: eventCode,
        teamCode: teamCode,
        reason: rejectReason
      });

      if (!rollnoToUpdate || !eventCode || !teamCode) {
        throw new Error("Missing required data: rollno, eventCode, or teamCode");
      }

      const result = await updateRegistrationStatus(
        rollnoToUpdate,
        eventCode,
        teamCode,
        "reject",
        rejectReason
      );

      console.log("Registration rejected:", result);
      
      setIsProcessed(true);
      setCurrentStatus("Rejected");
      setRejectModalOpen(false);
      setRejectReason("");
      
      alert("Registration rejected successfully!");

      if (onReject) {
        onReject(data.id);
      }
    } catch (error) {
      console.error("Failed to reject registration:", error);
      alert(`Failed to reject registration: ${error.message}`);
    }
  };

  const handleRejectCancel = () => {
    setRejectModalOpen(false);
    setRejectReason("");
  };

  // Determine if buttons should be shown
  const shouldShowButtons = !isProcessed && 
    currentStatus.toLowerCase() === "pending" && 
    !["approved", "accepted", "rejected"].includes(currentStatus.toLowerCase());

  let statusBadgeClasses = "text-xs font-semibold px-2 py-0.5 rounded-md";
  const statusToCheck = currentStatus.toLowerCase();
  switch (statusToCheck) {
    case "pending":
      statusBadgeClasses += " bg-yellow-200 text-yellow-800";
      break;
    case "approved":
    case "accepted":
      statusBadgeClasses += " bg-green-200 text-green-800";
      break;
    case "rejected":
      statusBadgeClasses += " bg-red-200 text-red-800";
      break;
    default:
      statusBadgeClasses += " bg-gray-200 text-gray-800";
      break;
  }

  return (
    <>
      <div className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col max-w-sm mx-auto h-full">
        {/* Image Section */}
        <div className="relative">
          <img
            src={imgSrc}
            alt={data.eventName || "Event"}
            className="w-full h-[160px] object-cover"
            onError={(e) => {
              e.target.src = defaultEventImage;
            }}
          />
          {requestedBy && (
            <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md shadow">
              Requested by {requestedBy}
            </div>
          )}
          {/* Loading indicator */}
          {isUpdating && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-sm">Updating...</div>
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
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  data.eventType.toLowerCase() === "offline"
                    ? "text-purple-700 bg-purple-100 border-purple-300"
                    : data.eventType.toLowerCase() === "online"
                    ? "text-blue-700 bg-blue-100 border-blue-300"
                    : "text-green-700 bg-green-100 border-green-300"
                }`}
              >
                {data.eventType}
              </span>
            )}
          </div>

          {/* Event Name */}
          <h2 className="text-lg font-bold text-gray-800 mb-3 leading-tight min-h-[40px]">
            {data.eventName}
          </h2>

          {/* Details List */}
          <div className="space-y-2 text-sm mb-4 flex-grow">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate" title={data.location}>{data.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Trophy size={16} className="text-gray-400 flex-shrink-0" />
              <span>Prize: {data.prizeAmount}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Tag size={16} className="text-gray-400 flex-shrink-0" />
              <span>Code: {data.eventCode}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate" title={data.teamMembers ? data.teamMembers.join(", ") : ""}>
                Team: {data.teamMembers && data.teamMembers.length > 0 ? data.teamMembers.join(", ") : "N/A"}
              </span>
            </div>
          </div>

          {/* Status and Action Buttons */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={statusBadgeClasses}>
                {currentStatus}
              </span>
            </div>
            
            {/* Conditionally render action buttons */}
            {shouldShowButtons ? (
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleRejectClick}
                  disabled={isUpdating}
                  className={`p-1.5 rounded-full transition-colors ${
                    isUpdating
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-red-500 hover:text-red-700 hover:bg-red-100"
                  }`}
                  aria-label="Reject Request"
                  title="Reject"
                >
                  <XCircle size={22} />
                </button>
                <button
                  onClick={handleApproveClick}
                  disabled={isUpdating}
                  className={`p-1.5 rounded-full transition-colors ${
                    isUpdating
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-green-500 hover:text-green-700 hover:bg-green-100"
                  }`}
                  aria-label="Approve Request"
                  title="Approve"
                >
                  <CheckCircle2 size={22} />
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">
                {isProcessed ? "Action completed" : "No actions available"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Confirmation Modal */}
      <Dialog 
        open={rejectModalOpen} 
        onClose={handleRejectCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            padding: 1
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="div" sx={{ color: '#0200e1', fontWeight: 600 }}>
              Reject Registration
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleRejectCancel}
              sx={{ color: 'grey.500' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Are you sure you want to reject the registration for <strong>{data.eventName}</strong>?
            </Typography>            
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
              This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleRejectCancel} 
            variant="outlined"
            sx={{ 
              minWidth: 100,
              textTransform: 'none',
              borderColor: 'grey.300',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'grey.400',
                backgroundColor: 'grey.50'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRejectConfirm}
            variant="contained"
            disabled={isUpdating}
            sx={{ 
              minWidth: 100,
              textTransform: 'none',
              backgroundColor: '#d32f2f',
              '&:hover': {
                backgroundColor: '#b71c1c'
              },
              '&:disabled': {
                backgroundColor: 'grey.300'
              }
            }}
          >
            {isUpdating ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RequestCard;