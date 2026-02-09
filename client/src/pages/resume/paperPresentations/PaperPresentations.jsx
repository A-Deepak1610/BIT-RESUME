import React, { useEffect, useState } from "react";
import { Presentation, Loader2 } from "lucide-react";
import useAuth from "../../../store/UseAuth";

export default function PaperPresentations(props) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { rollno } = useAuth();
  const student_rollno = props.rollno || "-";

  useEffect(() => {
    if (!rollno) {
      return;
    }

    const fetchPapers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}api/resume/getpapers/${student_rollno}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch papers. Status: ${response.status}`);
        }

        const data = await response.json();
        setPapers(data || []);
      } catch (err) {
        console.error("Error fetching paper data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [rollno, student_rollno]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-teal-600" />
          <span className="ml-2">Loading Paper Presentations...</span>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500 p-4 text-center">{error}</div>;
    }

    if (!papers || papers.length === 0) {
      return (
        <p className="text-gray-500 text-sm p-4 text-center">
          No paper presentations found.
        </p>
      );
    }

    return papers.map((paper, index) => (
      <div
        key={index}
        className="relative border mb-2 rounded border-[#e5e5e5] p-2"
      >
        <div className="flex justify-between items-start">
          <h3 className="text-gray-900 text-[14px] font-semibold">
            {paper.title}
          </h3>
          <div className="flex items-center space-x-3">
            {paper.conference && (
              <span className="px-2 py-[2px] rounded-2xl bg-teal-50 text-teal-600 text-xs font-medium truncate max-w-[120px]">
                {paper.conference}
              </span>
            )}
            {paper.award && (
              <span className="px-2 py-[2px] rounded-2xl bg-amber-50 text-amber-600 text-xs font-medium">
                {paper.award}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center mt-2 text-xs text-gray-500">
          {paper.presented_date && (
            <span>Presented: {paper.presented_date}</span>
          )}
          {paper.location && (
            <span className="ml-3">Location: {paper.location}</span>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="p-2 bg-white shadow rounded-lg h-[31vh] flex flex-col">
      <div className="flex items-center text-gray-800 font-medium flex-shrink-0">
        <Presentation className="text-teal-600" />
        <span className="ml-1">Paper Presentations</span>
      </div>

      <div className="mt-2 overflow-y-auto space-y-3 pr-1 flex-1">
        {renderContent()}
      </div>
    </div>
  );
}
