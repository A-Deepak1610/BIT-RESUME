import React, { useEffect, useState } from "react";
import { Github, Flower, Loader2 } from "lucide-react";
import useAuth from "../../../store/UseAuth";


export default function Projects(props) {
  // 2. Initialize state with dummy data and set loading to false
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false); // Set to false since we are not fetching
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { rollno } = useAuth(); // Assuming useAuth provides a rollno, even if dummy, it won't trigger the fetch.
  const student_rollno = props.rollno || '-';
  // The useEffect for fetching data is commented out or removed for dummy data
  useEffect(() => {
    if (!rollno) {
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:6001/api/resume/getprojects/${student_rollno}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch projects. Status: ${response.status}`);
        }

        const data = await response.json();
        setProjects(data || []);

      } catch (err) {
        console.error("Error fetching project data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [rollno]);
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-[#7371ff]" />
          <span className="ml-2">Loading Projects...</span>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500 p-4 text-center">{error}</div>;
    }

    if (!projects || projects.length === 0) {
      return <p className="text-gray-500 text-sm p-4 text-center">No projects found.</p>;
    }

    return projects.map((project, index) => (
      <div
        key={index}
        className="relative border mb-2 rounded border-[#e5e5e5] p-2"
      >
        <div className="flex justify-between items-start">
          <h3 className="text-gray-900 text-[14px] font-semibold">
            {project.title}
          </h3>
          <div className="flex items-center space-x-3 relative">
            {project.github && (
               <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center font-medium space-x-1 text-[#392d71] hover:underline"
              >
                <Github size={16} strokeWidth={2.5} />
                <span>GitHub</span>
              </a>
            )}
            <div
              className="px-3 py-[2px] rounded-2xl bg-[#fff9f1] text-[#f16623] text-sm font-medium cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              Stack
              {hoveredIndex === index && (
                <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-gray-300 rounded-lg shadow-md p-2 z-50">
                  <p className="text-xs font-semibold mb-1 text-gray-800">
                    Tech Stack:
                  </p>
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                    {(project.stack && project.stack.length > 0) ? (
                        project.stack.map((tech, idx) => (
                            <li key={idx}>{tech}</li>
                        ))
                    ) : (
                        <li className="list-none text-gray-500">Not specified</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-700 mt-1">{project.description}</p>
      </div>
    ));
  };


  return (
    <div className="p-2 bg-white shadow rounded-lg h-[31vh] flex flex-col">
      <div className="flex items-center text-gray-800 font-medium flex-shrink-0">
        <Flower className="text-[#7371ff]" />
        <span className="ml-1">Project Achievements</span>
      </div>

      <div className="mt-2 overflow-y-auto space-y-3 pr-1 flex-1">
        {renderContent()}
      </div>
    </div>
  );
}