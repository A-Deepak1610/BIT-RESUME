import React, { useEffect, useState } from "react";
import useAuth from "../../../store/UseAuth";

// A small, reusable component for displaying a single project.
const ProjectItem = React.memo(({ project }) => (
  <div className="text-sm break-inside-avoid">
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-semibold text-gray-800">
        {project.title}
      </h3>
      {project.github && (
        <a 
          href={project.github} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-xs underline ml-2 flex-shrink-0"
        >
          GitHub
        </a>
      )}
    </div>
    <p className="text-gray-600 text-xs leading-relaxed mb-1.5">
      {project.description}
    </p>
    {project.stack && project.stack.length > 0 && (
      <div className="flex items-center flex-wrap gap-1.5">
        {project.stack.map((tech, idx) => (
          <span
            key={idx}
            className="bg-gray-200 text-gray-800 text-[10px] font-medium px-2 py-0.5 rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>
    )}
  </div>
));

ProjectItem.displayName = 'ProjectItem';

export default function ProjectsForResume(props) {
  const Student_rollno = props.rollno || "-";
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { rollno } = useAuth();
const API_URL = import.meta.env.VITE_API_URL
  useEffect(() => {
    if (!rollno) {
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}api/resume/getprojects/${Student_rollno }`, {
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

  if (loading) {
    return <p className="text-xs text-gray-500">Loading projects...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500">Error: {error}</p>;
  }

  if (projects.length === 0) {
    return <p className="text-xs text-gray-500">No projects available.</p>;
  }

  if (projects.length === 1) {
    return <ProjectItem project={projects[0]} />;
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      {projects.map((project, index) => (
        <ProjectItem key={project.title || index} project={project} />
      ))}
    </div>
  );
}