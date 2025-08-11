import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ChevronRight } from 'lucide-react';
import axios from 'axios'; // Using axios for consistency

// --- Data Transformation Utility ---
// This function maps the raw API data to a consistent format for the UI.
const transformApiData = (apiData) => {
    if (!Array.isArray(apiData)) return [];

    return apiData.map((item) => {
        const { upload_type, user_name, approval_status, ...details } = item;

        // Create a unique ID for the key prop
        const id = `${upload_type}-${item.id || item.certificate_id}-${Math.random()}`;
        
        let title = 'Untitled Submission';
        let submissionDate = new Date().toISOString();

        // Determine the title and date based on the upload type
        switch (upload_type) {
            case 'certificate':
                title = details.event_name || details.platform || details.activity_type || 'Certificate';
                submissionDate = details.issue_date;
                break;
            case 'project':
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
                title = `${upload_type.replace(/_/g, ' ')} Submission`;
                break;
        }

        // Normalize the status
        const status = (approval_status === "Pending" || approval_status === "0" || approval_status === null) 
            ? "Awaiting" 
            : "Processed"; // Grouping verified/rejected as not awaiting

        return {
            id,
            studentName: user_name,
            title,
            submissionDate,
            status,
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const response = await axios.get('http://localhost:6001/api/studentrequests/varifications', {
          withCredentials: true,
        });
        
        if (response.data && Array.isArray(response.data)) {
          const transformedData = transformApiData(response.data);
          setSubmissions(transformedData);
          console.log('Verification data fetched and transformed successfully:', transformedData);
        } else {
           throw new Error('Fetched data is not an array');
        }

      } catch (error) {
        console.error('Error fetching verification data:', error);
        setError('Failed to fetch verification data. Please try again.');
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
    // Navigate to the main verification page when any item is clicked
    navigate(`/faculty-verification`);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Pending Verifications</h2>
          <div className="flex items-center space-x-2">
            <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-1 rounded-full">
              {awaitingSubmissions.length} items
            </span>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto flex-grow pr-1">
        {error && <div className="text-red-500 text-center p-4">{error}</div>}
        {!error && awaitingSubmissions.length > 0 ? (
          awaitingSubmissions.map((submission) => (
            <DashboardVerificationItem
              key={submission.id}
              submission={submission}
              onSelect={handleSelectSubmission}
            />
          ))
        ) : (
          !error && (
            <div className="flex items-center justify-center h-full text-center text-gray-500 bg-gray-50 rounded-md">
              <div>
                <h3 className="text-md font-medium">All Verified!</h3>
                <p className="text-sm mt-1">There are no submissions awaiting verification.</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}