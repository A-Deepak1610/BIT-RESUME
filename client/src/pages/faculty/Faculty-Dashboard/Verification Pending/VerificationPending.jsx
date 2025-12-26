import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ChevronRight, CheckCircle } from 'lucide-react'; // Added CheckCircle for empty state
import axios from 'axios';

// --- Data Transformation Utility ---
// This function maps the raw API data to a consistent format for the UI.
const transformApiData = (apiData) => {
    if (!Array.isArray(apiData)) return [];

    return apiData.map((item) => {
        // --- FIX STARTS HERE ---
        // 1. Get the status from EITHER `approval_status` OR `patent_status`.
        // The `||` operator elegantly handles cases where one of the fields is missing.
        const rawStatus = item.approval_status || item.patent_status;
        
        // 2. Normalize the status based on the `rawStatus` we just found.
        const status = (rawStatus === "Pending" || rawStatus === "0" || rawStatus === null) 
            ? "Awaiting" 
            : "Processed"; // Groups "Verified", "Rejected", "Approved" etc., as not awaiting.
        // --- FIX ENDS HERE ---
            
        const { upload_type, user_name, ...details } = item;

        const id = `${upload_type}-${item.id || item.certificate_id}-${Math.random()}`;
        
        let title = 'Untitled Submission';
        let submissionDate = new Date().toISOString();

        switch (upload_type) {
            case 'certificate':
                title = details.event_name || details.platform || details.activity_type || 'Certificate';
                submissionDate = details.issue_date;
                break;
            case 'Project': // Case sensitivity fix
                title = details.title_idea;
                submissionDate = details.start_time;
                break;
            case 'workshop':
                title = `Workshop: ${details.topic_covered || details.event_nature}`;
                submissionDate = details.start_date;
                break;
            case 'paperpresentation':
                title = details.paper_title;
                submissionDate = details.date_of_presentation;
                break;
            case 'internship':
                title = `${details.internship_type} at ${details.company_name}`;
                submissionDate = details.start_date;
                break;
            case 'patents':
                title = `Patent: ${details.application_number}`;
                submissionDate = details.date_of_filing;
                break;
            default:
                // Fallback for any other type, converting snake_case to Title Case
                title = `${(upload_type || 'submission').replace(/_/g, ' ')}`.replace(/\b\w/g, l => l.toUpperCase());
                break;
        }

        return {
            id,
            studentName: user_name || 'Unknown Student', // Added fallback
            title,
            submissionDate,
            status, // Use the correctly determined status
        };
    });
};


const DashboardVerificationItem = ({ submission, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(submission.id)}
      className="flex items-center justify-between p-3 mb-2 bg-gray-50 hover:bg-indigo-50 border border-gray-200 rounded-lg cursor-pointer transition-colors duration-150"
    >
      <div className="flex items-center min-w-0">
        <FileText className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" strokeWidth={1.5}/>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{submission.studentName}</p>
          <p className="text-xs text-gray-500 truncate">{submission.title}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
    </div>
  );
};

export function AwaitingVerification() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading to true
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL
  useEffect(() => {
    const handleVerification = async () => {
      setLoading(true); // Start loading
      setError(null);
      try {
        const response = await axios.get(`${API_URL}api/studentrequests/varifications`, {
          withCredentials: true,
        });
        
        if (response.data && Array.isArray(response.data)) {
          const transformedData = transformApiData(response.data);
          setSubmissions(transformedData);
        } else {
           throw new Error('Fetched data is not in the expected format');
        }

      } catch (error) {
        console.error('Error fetching verification data:', error);
        setError('Failed to fetch verification data. Please try again.');
      } finally {
        setLoading(false); // Stop loading in all cases
      }
    };
    
    handleVerification();
  }, []); // Empty dependency array ensures this runs once on mount

  const awaitingSubmissions = useMemo(() => {
    return submissions
      .filter(sub => sub.status === 'Awaiting')
      .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
  }, [submissions]); // Recalculate only when submissions state changes

  const handleSelectSubmission = () => {
    navigate(`/faculty-verification`);
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-500 p-4">Loading...</p>;
    }
    if (error) {
      return <div className="text-red-500 text-center p-4">{error}</div>;
    }
    if (awaitingSubmissions.length > 0) {
      return awaitingSubmissions.map((submission) => (
        <DashboardVerificationItem
          key={submission.id}
          submission={submission}
          onSelect={handleSelectSubmission}
        />
      ));
    }
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 bg-gray-50 rounded-md p-4">
        <CheckCircle className="w-12 h-12 text-green-400 mb-2" />
        <h3 className="text-md font-medium">All Verified!</h3>
        <p className="text-sm mt-1">There are no submissions awaiting verification.</p>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-md rounded-lg p-4">
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Pending Verifications</h2>
          <div className="flex items-center space-x-2">
            <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-1 rounded-full">
              {awaitingSubmissions.length} items
            </span>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto flex-grow pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {renderContent()}
      </div>
    </div>
  );
}