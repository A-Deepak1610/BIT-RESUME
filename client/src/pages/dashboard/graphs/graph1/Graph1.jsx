import React from "react";
import ActivenessGraph from "./ActivenessGraph";
export default function Graph1() {
  return (
    <div>
      <div 
        className="p-2 md:p-4 bg-white w-full shadow rounded-lg h-[38.5vh]"
      >
        <ActivenessGraph/>
      </div>
    </div>
  );
}