import React from "react";
import MentorMenteesGraph from "../../dashboard/graphs/mentor/MentorGraph";
import ActivenessGraph from "../../dashboard/graphs/graph1/ActivenessGraph";
import PsSkillGraph from "../../dashboard/graphs/ps/PsGraph";
import AchievementsGraph from "../../dashboard/graphs/grpah2/AchievementsGraph";
import Projects from "../projects/Projects";
import Accomplishments from "../Accomplishments"; 
import { GraduationCap, Trophy, CalendarCheck, TrendingUp } from "lucide-react";

export default function Content(props) {
  const rollno=props.rollno;
  console.log("Content rollno:", rollno);
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1800px] flex flex-col">
        {/* Top Container */}
        <div className="flex flex-col lg:flex-row items-center justify-center">
          {/* Graph 1 */}
          <div className="p-2 md:p-2 bg-white shadow rounded-lg h-[32vh] w-full lg:w-[45%]">
            <ActivenessGraph rollno={rollno}/>
          </div>

          {/* Card */}
          <div className="flex flex-row lg:flex-col w-full lg:w-[12%] justify-around h-auto lg:h-[32vh] mt-2 lg:my-0 lg:mx-2">
            <div className="h-20 shadow-md rounded-lg flex flex-col justify-center items-center bg-white w-1/3 lg:w-full mx-1 lg:mx-0 lg:mb-2 transition-transform">
              <div className="flex items-center">
                <GraduationCap className="text-indigo-500" size={20} />
                <h3 className="text-sm font-semibold text-gray-600 ml-2">
                  Overall CGPA
                </h3>
              </div>
              <p className="text-[20px] font-bold text-gray-800 mt-1">8.75</p>
            </div>
            <div className="h-20 shadow-md rounded-lg flex flex-col justify-center items-center bg-white w-1/3 lg:w-full mx-1 lg:mx-0 lg:mb-2 transition-transform">
              <div className="flex items-center">
                <Trophy className="text-amber-500" size={20} />
                <h3 className="text-sm font-semibold text-gray-600 ml-2">
                  Reward Points
                </h3>
              </div>
              <div className="flex items-baseline">
                <p className="text-[20px] font-bold text-gray-800 mt-1">1,250</p>
                <TrendingUp className="text-green-500 ml-1" size={16} />
              </div>
            </div>
            <div className="h-20 shadow-md rounded-lg flex flex-col justify-center items-center bg-white w-1/3 lg:w-full mx-1 lg:mx-0 transition-transform">
              <div className="flex items-center">
                <CalendarCheck className="text-sky-500" size={20} />
                <h3 className="text-sm font-semibold text-gray-600 ml-2">
                  Events Attended
                </h3>
              </div>
              <p className="text-[20px] font-bold text-gray-800 mt-1">12</p>
            </div>
          </div>
          {/* Graph 4 */}
          <div className="p-2 md:p-2 bg-white shadow rounded-lg h-[32vh] w-full lg:w-[45%] mt-2 lg:mt-0">
            <MentorMenteesGraph  rollno={rollno}/>
          </div>
        </div>

        {/* Middle Container */}
        <div className="mt-2 flex flex-col lg:flex-row items-center justify-center">
          {/* Graph 2 */}
          <div className="p-2 md:p-2 bg-white w-full lg:w-[50%] shadow rounded-lg h-[32vh] flex flex-col">
            <PsSkillGraph rollno={rollno} />
          </div>

          {/* Graph 3 */}
          <div className="p-2 md:p-2 mt-2 lg:mt-0 lg:ml-2 bg-white w-full lg:w-[50%] shadow rounded-lg h-[32vh]">
            <AchievementsGraph  rollno={rollno}/>
          </div>
        </div>

        {/* --- MODIFIED Footer --- */}
        <div className="flex justify-center w-full mt-2">
          <div className="flex flex-col lg:flex-row w-full max-w-[1800px]">
            <div className="w-full lg:w-[50%] mb-2 lg:mb-0 lg:mr-2">
              <Projects rollno={rollno}/>
            </div>
            
            {/* Accomplishments (takes up the remaining space) */}
            <div className="w-full lg:w-[50%] mb-2 lg:mb-0">
              <Accomplishments rollno={rollno}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}