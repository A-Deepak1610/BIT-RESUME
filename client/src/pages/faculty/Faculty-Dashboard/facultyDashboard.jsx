import Faculty1 from "./PriorityLearners/Faculty1";
import Faculty2 from "./Request pending/Faculty2";
import Faculty3 from "./Verification Pending/Faculty3";

export default function FacultyDashboard() {
  return (
    <>
      <div className="p-4 w-full mx-auto mt-3" style={{ height: 'calc(100vh - 4rem)' }}>
        <div className="flex flex-col md:flex-row gap-4 h-full">
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex-1 min-h-0">
              <Faculty1 />
            </div>

            <div className="w-full flex flex-row gap-4 flex-1 min-h-0">
              <div className="w-1/2">
                <Faculty2 />
              </div>
              <div className="w-1/2">
                <Faculty3 />
              </div>
            </div>
          </div>

          <div className="w-full h-full">
            hello world
          </div>
        </div>
      </div>
    </>
  );
}