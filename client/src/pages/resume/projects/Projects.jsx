import React, { useEffect, useState } from "react";
import { Github, Flower } from "lucide-react";
import useAuth from "../../../store/UseAuth";

//======================================================================
// 1. ORIGINAL INTERACTIVE COMPONENT (FOR DASHBOARD)
//======================================================================
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const { rollno } = useAuth();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (!rollno) return;

    // NOTE: Make sure to use your actual API URL from environment variables in production
    fetch(`http://localhost:6001/api/resume/getprojects/${rollno}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response is not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error fetching project data:", error);
      });
  }, [rollno]);

  return (
    <div className="p-2 bg-white shadow rounded-lg h-[30vh] flex flex-col">
      <div className="flex items-center text-gray-800 font-medium flex-shrink-0">
        <Flower className="text-[#7371ff]" />
        <span className="ml-1">Project Achievements</span>
      </div>

      <div className="mt-2 overflow-y-auto space-y-3 pr-1 flex-1">
        {projects.length === 0 ? (
          <p className="text-gray-500 text-sm">No projects found</p>
        ) : (
          projects.map((project, index) => (
            <div
              key={index}
              className="relative border mb-2 rounded border-[#e5e5e5] p-2"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-gray-900 text-[14px] font-semibold">
                  {project.title}
                </h3>
                <div className="flex items-center space-x-3 relative">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center font-medium space-x-1 text-[#392d71] hover:underline"
                  >
                    <Github size={16} strokeWidth={2.5} />
                    <span>GitHub</span>
                  </a>

                  {/* Stack hover button */}
                  <div
                    className="px-3 py-[2px] rounded-2xl bg-[#fff9f1] text-[#f16623] text-sm font-medium cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    Stack
                    {/* Tooltip Modal */}
                    {hoveredIndex === index && (
                      <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-gray-300 rounded-lg shadow-md p-2 z-50">
                        <p className="text-xs font-semibold mb-1 text-gray-800">
                          Tech Stack:
                        </p>
                        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                          {(project.stack || []).map((tech, idx) => (
                            <li key={idx}>{tech}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-1">{project.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


//======================================================================
// 2. NEW SIMPLIFIED COMPONENT (FOR RESUME)
//======================================================================
export function ProjectsForResume() {
  const [projects, setProjects] = useState([]);
  const { rollno } = useAuth();

  useEffect(() => {
    if (!rollno) return;

    fetch(`http://localhost:6001/api/resume/getprojects/${rollno}`)
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching project data:", error));
  }, [rollno]);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-1 mb-4">
        Projects
      </h2>
      <div className="space-y-5">
        {projects.length === 0 ? (
          <p className="text-gray-600">No project information available.</p>
        ) : (
          projects.map((project, index) => (
            <div key={index}>
              {/* Project Header */}
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-semibold text-gray-900">
                  {project.title}
                </h3>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  <Github size={14} className="mr-1" />
                  <span>GitHub</span>
                </a>
              </div>

              {/* Project Description */}
              <p className="text-gray-700 mt-1 text-sm leading-relaxed">
                {project.description}
              </p>
              
              {/* Tech Stack Display */}
              <div className="mt-2 flex items-center flex-wrap gap-2">
                 <h4 className="text-sm font-semibold text-gray-800">Tech Stack:</h4>
                {(project.stack || []).map((tech, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}