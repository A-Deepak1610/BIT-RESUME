import React from "react";
import Details from "./hero/Details";
import Graph1 from "./graphs/graph1/Graph1";
import Graph2 from "./graphs/grpah2/Graph2";
import Graph4 from "./graphs/mentor/graph4";
import Graph3 from "./graphs/ps/Graph3";
export default function Dashboard() {
  return (
    <div className="p-2.5 w-full flex flex-col justify-center mx-auto ">
      <div className="w-full  ">
        <Details />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div className="w-full ">
          <Graph1 />
        </div>
        <div className="w-full ">
          <Graph4 />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div className="w-full">
          <Graph2 />
        </div>
        <div className="w-full ">
          <Graph3/>
        </div>
      </div>
    </div>
  );
}
