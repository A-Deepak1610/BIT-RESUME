import React from "react";
import { Github, Flower } from "lucide-react";

export default function Projects() {
  const projectsData = [
    {
      title: "Code Sync",
      description:
        "Lorem ipsum dolor sit amet consectetur. Habitasse ultrices massa sem tincidunt cursus. Erat tristique turpis nec amet mauris sed purus quam.",
      stack: "MERN",
      gitHubLink: "https://github.com/A-Deepak1610/CodeSync",
    },
    {
      title: "Fitness Tracking",
      description:
        "Sed dapibus est ac nisl tincidunt, ac congue tellus dignissim. Nulla facilisi. Nullam sit amet porta sapien. Duis eget elementum magna.",
      stack: "FLUTTER",
      gitHubLink: "https://github.com/example/fitness-tracking",
    },
  ];

  return (
    <div className="p-2  bg-white shadow rounded-lg h-[30vh] flex flex-col">
      <div className="flex items-center text-gray-800 font-medium flex-shrink-0">
        <Flower className="text-[#7371ff]" />
        <span className="ml-1">Project Achievements</span>
      </div>
      <div className="mt-2 overflow-y-auto space-y-3 pr-1 flex-1">
        {projectsData.map((project, index) => (
          <div key={index} className="border mb-2 rounded border-[#e5e5e5] p-2">
            <div className="flex justify-between items-start">
              <h3 className="text-gray-900 text-[14px] font-semibold">{project.title}</h3>
              <div className="flex items-center space-x-3">
                <a
                  href={project.gitHubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center font-medium space-x-1 text-[#392d71] hover:underline"
                >
                  <Github size={16} strokeWidth={2.5} />
                  <span>GitHub</span>
                </a>
                <div className="px-3 py-[2px] rounded-2xl bg-[#fff9f1] text-[#f16623] text-sm font-medium">
                  Stack: {project.stack}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-1">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
