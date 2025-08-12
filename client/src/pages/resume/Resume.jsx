import React from "react";
import Info from "./info/Info";
import Content from "./content/Content";
import { useLocation } from "react-router-dom";

export default function Resume() {
  const { state } = useLocation();
  const rollno = state?.rollno;
  console.log("Resume rollno:", rollno);
  return (
    <div>
      <div className="flex flex-col lg:flex-row  w-full  bg-gray-100 h-full">
        <div>
          <Info rollno={rollno}/>
        </div>
        <div className="p-3 flex-1 ">
          <Content rollno={rollno}/>
        </div>
      </div>
    </div>
  );
}
