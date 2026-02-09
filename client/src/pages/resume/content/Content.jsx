import React from "react";
import MentorMenteesGraph from "../../dashboard/graphs/mentor/MentorGraph";
import PsSkillGraph from "../../dashboard/graphs/ps/PsGraph";
import Projects from "../projects/Projects";
import Certifications from "../certifications/Certifications";
import InternshipExperience from "../InternshipExperience/internshipExperience";
import Hackathons from "../hackathons/Hackathons";
import Patents from "../patents/Patents";
import PaperPresentations from "../paperPresentations/PaperPresentations";

export default function Content(props) {
  const rollno = props.rollno;
  console.log("Content rollno:", rollno);
  return (
    <div className="w-full flex flex-col items-center ">
      <div className="w-full max-w-[1800px] flex flex-col">
        {/* Top Container */}
        <div className="flex flex-col lg:flex-row items-center justify-center">
          {/* Skill Completion Status (was ActivenessGraph) */}
          <div className="p-2 md:p-2 bg-white shadow rounded-lg h-[32vh] w-full lg:w-[50%]">
            <PsSkillGraph rollno={rollno} />
          </div>

          {/* Mentor Mentees Graph */}
          <div className="p-2 md:p-2 bg-white shadow rounded-lg h-[32vh] w-full lg:w-[50%] mt-2 lg:mt-0 lg:ml-2">
            <MentorMenteesGraph rollno={rollno} />
          </div>
        </div>

        {/* Middle Container */}
        <div className="mt-2 flex flex-col lg:flex-row items-center justify-center">
          {/* Internship Experience */}
          <div className="p-2 md:p-2 bg-white w-full lg:w-[50%] shadow rounded-lg min-h-[32vh] flex flex-col">
            <InternshipExperience rollno={rollno} />
          </div>
          {/* Certifications */}
          <div className="p-2 md:p-2 mt-2 lg:mt-0 lg:ml-2 bg-white w-full lg:w-[50%] shadow rounded-lg min-h-[32vh]">
            <Certifications rollno={rollno} />
          </div>
        </div>

        {/* Projects & Hackathons Row */}
        <div className="flex justify-center w-full mt-2">
          <div className="flex flex-col lg:flex-row w-full max-w-[1800px]">
            <div className="w-full lg:w-[50%] mb-2 lg:mb-0 lg:mr-2">
              <Projects rollno={rollno} />
            </div>
            <div className="w-full lg:w-[50%] mb-2 lg:mb-0">
              <Hackathons rollno={rollno} />
            </div>
          </div>
        </div>

        {/* Patents & Paper Presentations Row */}
        <div className="flex justify-center w-full mt-2">
          <div className="flex flex-col lg:flex-row w-full max-w-[1800px]">
            <div className="w-full lg:w-[50%] mb-2 lg:mb-0 lg:mr-2">
              <Patents rollno={rollno} />
            </div>
            <div className="w-full lg:w-[50%] mb-2 lg:mb-0">
              <PaperPresentations rollno={rollno} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
