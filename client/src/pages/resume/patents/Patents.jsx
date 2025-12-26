import React, { useEffect, useState } from "react";
import { FileText, ExternalLink, Loader2 } from "lucide-react";
import useAuth from "../../../store/UseAuth";

export default function Patents(props) {
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { rollno } = useAuth();
  const student_rollno = props.rollno || "-";
const API_URL = import.meta.env.VITE_API_URL
  useEffect(() => {
    if (!rollno) {
      return;
    }

    const fetchPatents = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}api/resume/getpatents/${student_rollno}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch patents. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setPatents(data || []);
      } catch (err) {
        console.error("Error fetching patent data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatents();
  }, [rollno, student_rollno]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-purple-600" />
          <span className="ml-2">Loading Patents...</span>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500 p-4 text-center">{error}</div>;
    }

    if (!patents || patents.length === 0) {
      return (
        <p className="text-gray-500 text-sm p-4 text-center">
          No patents found.
        </p>
      );
    }

    return patents.map((patent, index) => (
      <div
        key={index}
        className="relative border mb-2 rounded border-[#e5e5e5] p-2"
      >
        <div className="flex justify-between items-start">
          <h3 className="text-gray-900 text-[14px] font-semibold">
            {patent.title}
          </h3>
          <div className="flex items-center space-x-3">
            {patent.patent_number && (
              <span className="px-2 py-[2px] rounded-2xl bg-purple-50 text-purple-600 text-xs font-medium">
                {patent.patent_number}
              </span>
            )}
            {patent.link && (
              <a
                href={patent.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center font-medium space-x-1 text-purple-600 hover:underline"
              >
                <ExternalLink size={14} strokeWidth={2.5} />
                <span className="text-sm">View</span>
              </a>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-700 mt-1">{patent.description}</p>
        <div className="flex items-center mt-2 text-xs text-gray-500">
          {patent.filed_date && <span>Filed: {patent.filed_date}</span>}
        </div>
      </div>
    ));
  };

  return (
    <div className="p-2 bg-white shadow rounded-lg h-[31vh] flex flex-col">
      <div className="flex items-center text-gray-800 font-medium flex-shrink-0">
        <FileText className="text-purple-600" />
        <span className="ml-1">Patents</span>
      </div>

      <div className="mt-2 overflow-y-auto space-y-3 pr-1 flex-1">
        {renderContent()}
      </div>
    </div>
  );
}
