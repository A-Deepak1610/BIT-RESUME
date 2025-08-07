// import Faculty1 from "./Leaderboard/Faculty1";
import Faculty2 from "./Request pending/Faculty2";
import Faculty3 from "./Verification Pending/Faculty3";
import ProgressGraph from "./ProgressGraph/ProgressGraph";
import Leaderboard from "./Leaderboard/Leaderboard";
import PriorityLearners from "./priorityLearners/PrirorityLearners";

export default function FacultyDashboard() {
  return (
    <div className="p-4 w-full mx-auto overflow-hidden" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        {/* --- Left Column --- */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 h-full overflow-hidden">
          {/* Leaderboard takes 60% of left column */}
          <div className="overflow-hidden" style={{ height: "60%" }}>
            <Leaderboard />
          </div>

          {/* Bottom row with Faculty2 and Faculty3 takes 35% */}
          <div className="flex flex-col sm:flex-row gap-2 overflow-hidden" style={{ height: "35%" }}>
            <div className="w-full sm:w-1/2 h-full overflow-hidden">
              <Faculty2 />
            </div>
            <div className="w-full sm:w-1/2 h-full overflow-hidden">
              <Faculty3 />
            </div>
          </div>
        </div>

        {/* --- Right Column --- */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 h-full overflow-hidden">
          {/* Progress Graph takes 40% of right column */}
          <div className="overflow-hidden" style={{ height: "40%" }}>
            <ProgressGraph />
          </div>
          {/* Priority Learners takes 55% of right column */}
          <div className="overflow-hidden" style={{ height: "55%" }}>
            <PriorityLearners />
          </div>
        </div>
      </div>
    </div>
  );
}