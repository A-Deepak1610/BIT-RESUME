import React from "react";
import Info from "./info/Info";
import Content from "./content/Content";
import { useLocation } from "react-router-dom";

export default function Resume() {
  const { state } = useLocation();
  const rollno = state?.rollno;
  console.log("Resume rollno:", rollno);
  return (
    <div className="h-screen overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full bg-gray-100 h-full">
        <div className="lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-[280px] z-10">
          <Info rollno={rollno} />
        </div>
        <div className="p-2 flex-1 lg:ml-[280px] overflow-y-auto h-screen">
          <Content rollno={rollno} />
        </div>
      </div>
    </div>
  );
}
