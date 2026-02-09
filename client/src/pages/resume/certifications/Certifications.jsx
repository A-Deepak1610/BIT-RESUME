import React, { useEffect, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react"; // Re-add Loader2
import linkedin_icon from "../../../assets/linkedin.png";
import useAuth from "../../../store/UseAuth";

export default function Certifications(props) {
  const [certificationsData, setCertificationsData] = useState([]);
  const [loading, setLoading] = useState(true); // Best practice: add loading state
  const [error, setError] = useState(null); // Best practice: add error state
  const { rollno } = useAuth();

  useEffect(() => {
    if (!rollno) {
      return;
    }
    const student_rollno = props.rollno || "-";
    const fetchCertifications = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset errors

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}api/resume/getcertificates/${student_rollno}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          // Provide a more specific error based on the status
          throw new Error(
            `Failed to fetch certifications. Status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Certifications Data:", data); // This will be the array

        // THE FIX: Set state with the data array directly
        setCertificationsData(data);
      } catch (err) {
        console.error("Error fetching certifications:", err);
        setError(err.message); // Set the error state for the UI
      } finally {
        setLoading(false); // Stop loading in all cases (success or error)
      }
    };

    fetchCertifications();
  }, [rollno]);
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-[#7371ff]" />
          <span className="ml-2">Loading...</span>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500 p-4">{error}</div>;
    }

    if (!certificationsData || certificationsData.length === 0) {
      return <div className="text-gray-500 p-4">No certifications found.</div>;
    }

    return certificationsData.map((certification, index) => (
      <div key={index} className="mb-2 p-2">
        <div className="flex items-start">
          <div className="w-6 h-6 border flex items-center justify-center border-[#9b9aff] rounded-full flex-shrink-0">
            <img src={linkedin_icon} className="w-4 h-4 rounded" alt="icon" />
          </div>
          <div className="ml-2 flex-1">
            {certification.linkedin_link ? (
              <a
                href={certification.linkedin_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#01009E] text-[14px] font-semibold hover:underline cursor-pointer"
              >
                {certification.title}
              </a>
            ) : (
              <span className="text-[#01009E] text-[14px] font-semibold">
                {certification.title}
              </span>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {certification.platform && <span>{certification.platform}</span>}
              {certification.platform && certification.issue_date && (
                <span> • </span>
              )}
              {certification.issue_date && (
                <span>{certification.issue_date}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-2 lg:ml-2 bg-white shadow rounded-lg h-[30vh] flex flex-col">
      <div className="flex items-center text-gray-800 font-medium flex-shrink-0">
        <ShieldCheck className="text-[#7371ff]" />
        <span className="ml-1">Professional Certification</span>
      </div>

      <div className="mt-2 overflow-y-auto space-y-3 pr-1 flex-1">
        {renderContent()}
      </div>
    </div>
  );
}
