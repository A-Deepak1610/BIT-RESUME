import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import initialSubmissionsData from "../../../../dummydatas/approval.json";
import { FileText, ChevronRight } from 'lucide-react';
import useAuth from "../../../../store/UseAuth";

const DashboardApprovalItem = ({ submission, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(submission.id)}
      className="flex items-center justify-between p-3 mb-2 bg-gray-50 hover:bg-indigo-50 border border-gray-200 rounded-lg cursor-pointer transition-colors duration-150"
    >
      <div className="flex items-center min-w-0">
        <FileText className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" strokeWidth={1.5}/>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{submission.studentName}</p>
          <p className="text-xs text-gray-500 truncate">{submission.eventTitle}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
    </div>
  );
};

// Map backend data into the UI's expected shape without changing the UI component structure
function mapBackendToUI(item, index) {
  return {
    // UI expects an id for React keys and onSelect parameter – compose a stable id
    id: `${item.rollno || "NA"}-${item.event_code || "NA"}-${index}`,

    // UI fields
    studentName: (item.applicant_name || "").trim(),
    eventTitle: (item.event_name || "").trim(),

    // Status mapping: backend "pending" -> UI "Awaiting"; "accepted" -> "Approved"
    status:
      item.verified === "pending"
        ? "Awaiting"
        : item.verified === "accepted"
        ? "Approved"
        : (item.verified || "Unknown"),

    // Dates
    submissionDate: item.submitted_date || null,
    eventStartDate: item.event_start_date || null,

    // Extra fields (not rendered in current UI but useful to keep)
    domain: item.domain || "",
    problemStatement: item.problem_statement || "",
    rollno: item.rollno || "",
    eventType: item.event_type || "",
    eventCode: item.event_code || "",
  };
}

export function AwaitingApprovals() {
  const navigate = useNavigate();
  const { rollno } = useAuth();

  const [loading, setLoading] = useState(false); // kept for internal control; no UI change
  const [error, setError] = useState(null); // kept for internal control; no UI change
  const [submissions, setSubmissions] = useState([]);

  const handleEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:6001/api/manageactivities/approvels/${rollno}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log("Raw backend data:", data); // Debug log
      const mapped = Array.isArray(data) ? data.map(mapBackendToUI) : [];
      console.log("Mapped for UI:", mapped);
      setSubmissions(mapped);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load approvals data");
      // Fallback to empty; UI will still show from dummy if desired
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prefer backend data when present; otherwise fallback to existing dummy data.
  const awaitingSubmissions = useMemo(() => {
    const source = submissions.length ? submissions : initialSubmissionsData;
    return source
      .filter(sub => sub.status === 'Awaiting')
      .sort((a, b) => new Date(b.submissionDate || 0) - new Date(a.submissionDate || 0));
  }, [submissions]);

  const handleSelectSubmission = () => {
    navigate(`/faculty-approval`);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Approval Awaiting</h2>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
              {awaitingSubmissions.length} students
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto flex-grow pr-1">
        {awaitingSubmissions.length > 0 ? (
          awaitingSubmissions.map((submission) => (
            <DashboardApprovalItem
              key={submission.id}
              submission={submission}
              onSelect={handleSelectSubmission}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500 bg-gray-50 rounded-md">
            <div>
              <h3 className="text-md font-medium">All Caught Up!</h3>
              <p className="text-sm mt-1">There are no pending submissions.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}