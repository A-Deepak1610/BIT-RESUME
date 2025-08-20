import React, { useEffect, useState } from "react";
import useAuth from "../../../store/UseAuth";

// A small, reusable component for displaying a single project.
const ProjectItem = ({ project }) => (
  <div className="text-sm break-inside-avoid">
    <h3 className="font-semibold text-gray-800 mb-1">
      {project.title}
    </h3>
    <p className="text-gray-600 text-xs leading-relaxed mb-1.5">
      {project.description}
    </p>
    {(project.stack || []).length > 0 && (
      <div className="flex items-center flex-wrap gap-1.5">
        {(project.stack || []).map((tech, idx) => (
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
);

export default function ProjectsForResume() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { rollno } = useAuth();

  useEffect(() => {
    if (!rollno) {
      return;
    }

    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:6001/api/resume/getprojects/${rollno}`, {
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
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [rollno]);

  if (isLoading) {
    return <p className="text-xs text-gray-500">Loading projects...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500">{error}</p>;
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
        <ProjectItem key={index} project={project} />
      ))}
    </div>
  );
}