import React, { useEffect, useState } from "react";
import useAuth from "../../store/UseAuth";

const PatentItem = React.memo(({ patent }) => (
  <div className="text-sm break-inside-avoid mb-2">
    <div className="flex items-center justify-between mb-0.5">
      <h3 className="font-semibold text-gray-800">{patent.title}</h3>
      {patent.link && (
        <a
          href={patent.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-xs underline ml-2 flex-shrink-0"
        >
          View Patent
        </a>
      )}
    </div>
    <p className="text-gray-600 text-xs mb-1">
      {patent.patent_number && (
        <span className="font-medium">App. No: {patent.patent_number}</span>
      )}
      {patent.filed_date && ` • Filed: ${patent.filed_date}`}
      {patent.status && (
        <span
          className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium ${
            patent.status === "Published"
              ? "bg-green-100 text-green-700"
              : patent.status === "Filed"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {patent.status}
        </span>
      )}
    </p>
    {patent.description && (
      <p className="text-gray-600 text-xs leading-relaxed">
        {patent.description}
      </p>
    )}
  </div>
));

PatentItem.displayName = "PatentItem";

export default function PatentsForResume(props) {
  const Student_rollno = props.rollno || "-";
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { rollno } = useAuth();

  useEffect(() => {
    if (!rollno) {
      return;
    }

    const fetchPatents = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}api/resume/getpatents/${Student_rollno}`,
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
  }, [rollno, Student_rollno]);

  if (loading) {
    return <p className="text-xs text-gray-500">Loading patents...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500">{error}</p>;
  }

  if (!patents || patents.length === 0) {
    return <p className="text-xs text-gray-500">No patents available.</p>;
  }

  return (
    <div className="space-y-1">
      {patents.map((patent, index) => (
        <PatentItem key={patent.id || index} patent={patent} />
      ))}
    </div>
  );
}
