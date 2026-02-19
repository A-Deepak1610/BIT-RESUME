import React, { useEffect, useState } from "react";
import useAuth from "../../store/UseAuth";

const PaperItem = React.memo(({ paper }) => (
  <div className="text-sm break-inside-avoid mb-2">
    <div className="flex items-center justify-between mb-0.5">
      <h3 className="font-semibold text-gray-800">{paper.title}</h3>
      {paper.award && (
        <span className="text-xs text-amber-600 font-medium ml-2">
          🏆 {paper.award}
        </span>
      )}
    </div>
    <p className="text-gray-600 text-xs">
      <span className="font-medium">{paper.conference}</span>
      {paper.location && ` • ${paper.location}`}
      {paper.presented_date && ` • ${paper.presented_date}`}
    </p>
  </div>
));

PaperItem.displayName = "PaperItem";

export default function PaperPresentationsForResume(props) {
  const Student_rollno = props.rollno || "-";
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { rollno } = useAuth();

  useEffect(() => {
    if (!rollno) {
      return;
    }

    const fetchPapers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}api/resume/getpapers/${Student_rollno}`,
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
  }, [rollno, Student_rollno]);

  if (loading) {
    return <p className="text-xs text-gray-500">Loading papers...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500">{error}</p>;
  }

  if (!papers || papers.length === 0) {
    return (
      <p className="text-xs text-gray-500">No paper presentations available.</p>
    );
  }

  return (
    <div className="space-y-1">
      {papers.map((paper, index) => (
        <PaperItem key={paper.id || index} paper={paper} />
      ))}
    </div>
  );
}
