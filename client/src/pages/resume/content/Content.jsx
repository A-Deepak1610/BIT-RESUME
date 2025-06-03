import React from "react";
import MentorMenteesGraph from "../../dashboard/graphs/mentor/MentorGraph";
import ActivenessGraph from "../../dashboard/graphs/graph1/ActivenessGraph";
import PsSkillGraph from "../../dashboard/graphs/ps/PsGraph";
import AchievementsGraph from "../../dashboard/graphs/grpah2/AchievementsGraph";
import Projects from "../projects/Projects";
import Certifications from "../certifications/Certifications";
import Hackathons from "../hackathons/Hackathons";

export default function Content() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1800px] flex flex-col">
        {/* Top Container */}
        <div className="flex flex-col lg:flex-row items-center justify-center">
          {/* Graph 1 */}
          <div className="p-2 md:p-2 bg-white shadow rounded-lg h-[32vh] w-full lg:w-[45%]">
            <ActivenessGraph />
          </div>
          
          {/* Card */}
          <div className="flex flex-row lg:flex-col w-full lg:w-[10%] justify-around h-auto lg:h-[32vh] mt-2  lg:my-0 lg:mx-2">
            <div className="h-16 shadow rounded-lg flex flex-col justify-center items-center bg-white w-1/3 lg:w-auto mx-1 lg:mx-0"></div>
            <div className="h-16 shadow rounded-lg flex flex-col justify-center items-center bg-white w-1/3 lg:w-auto mx-1 lg:mx-0"></div>
            <div className="h-16 shadow rounded-lg flex flex-col justify-center items-center bg-white w-1/3 lg:w-auto mx-1 lg:mx-0"></div>
          </div>
          
          {/* Graph 4 */}
          <div className="p-2 md:p-2 bg-white shadow rounded-lg h-[32vh] w-full lg:w-[45%] mt-2 lg:mt-0">
            <MentorMenteesGraph />
          </div>
        </div>
        
        {/* Middle Container */}
        <div className="mt-2 flex flex-col lg:flex-row items-center justify-center">
          {/* Graph 2 */}
          <div className="p-2 md:p-2 bg-white w-full lg:w-[50%] shadow rounded-lg h-[32vh] flex flex-col">
            <PsSkillGraph />
          </div>
          
          {/* Graph 3 */}
          <div className="p-2 md:p-2 mt-2 lg:mt-0 lg:ml-2 bg-white w-full lg:w-[50%] shadow rounded-lg h-[32vh]">
            <AchievementsGraph />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-center w-full mt-2 ">
          <div className="flex flex-col lg:flex-row w-full max-w-[1800px]">
            <div className="w-full lg:w-[49.75%] mb-2 lg:mb-0">
              <Projects />
            </div>
            <div className="w-full lg:w-[25%] mb-2 lg:mb-0 ">
              <Certifications />
            </div>
            <div className="w-full lg:w-[25%]">
              <Hackathons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}