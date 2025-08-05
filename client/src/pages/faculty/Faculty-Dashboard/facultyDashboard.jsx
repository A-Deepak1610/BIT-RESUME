// import Faculty1 from "./Leaderboard/Faculty1";
import Faculty2 from "./Request pending/Faculty2";
import Faculty3 from "./Verification Pending/Faculty3";
import ProgressGraph from "./ProgressGraph/ProgressGraph";
import Leaderboard from "./Leaderboard/Leaderboard";

export default function FacultyDashboard() {
  return (
    <>
      <div className="p-4 w-full mx-auto" style={{ height: "calc(100vh - 4rem)" }}>
        <div className="flex flex-col lg:flex-row gap-4 h-full">
          {/* --- Left Column --- */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="w-full flex-1 min-h-0">
              <Leaderboard/>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-4 flex-1 min-h-0">
              <div className="w-full sm:w-1/2">
                <Faculty2 />
              </div>
              <div className="w-full sm:w-1/2">
                <Faculty3 />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="h-2/5 min-h-0">
              <ProgressGraph />
            </div>
            <div className="h-3/5 min-h-0">
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}