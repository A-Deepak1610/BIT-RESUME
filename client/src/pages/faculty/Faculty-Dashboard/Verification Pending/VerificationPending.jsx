import {FileText , ChevronRight } from 'lucide-react';
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import initialSubmissionsData from '../../../../dummydatas/verification.json';

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

  const awaitingSubmissions = useMemo(() => {
    return initialSubmissionsData
      .filter(sub => sub.status === 'Awaiting')
      .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
  }, []);

  const handleSelectSubmission = () => {
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
        {awaitingSubmissions.length > 0 ? (
          awaitingSubmissions.map((submission) => (
            <DashboardVerificationItem
              key={submission.id}
              submission={submission}
              onSelect={handleSelectSubmission}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500 bg-gray-50 rounded-md">
            <div>
              <h3 className="text-md font-medium">All Verified!</h3>
              <p className="text-sm mt-1">There are no submissions awaiting verification.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}