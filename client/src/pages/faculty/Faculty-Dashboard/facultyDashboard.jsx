// import Faculty1 from "./Leaderboard/Faculty1";
import Faculty2 from "./Request pending/Faculty2";
import Faculty3 from "./Verification Pending/Faculty3";
import ProgressGraph from "./ProgressGraph/ProgressGraph";
import Leaderboard from "./Leaderboard/Leaderboard";

export default function FacultyDashboard() {
  return (
    <div
      className="p-4 w-full mx-auto overflow-hidden"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        {/* --- Left Column --- */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 h-full overflow-hidden">
          {/* Leaderboard takes 50% of left column */}
          <div className="overflow-hidden" style={{ height: "50%" }}>
            <Leaderboard />
          </div>

          {/* Progress Graph takes 45% of left column */}
          <div className="overflow-hidden" style={{ height: "45%" }}>
            <ProgressGraph />
          </div>
        </div>

        {/* --- Right Column --- */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 h-full overflow-hidden">
          {/* Pending Verifications takes 48% of right column */}
          <div className="overflow-hidden" style={{ height: "48%" }}>
            <Faculty2 />
          </div>
          {/* Approval Awaiting takes 48% of right column */}
          <div className="overflow-hidden" style={{ height: "48%" }}>
            <Faculty3 />
          </div>
        </div>
      </div>
    </div>
  );
}
