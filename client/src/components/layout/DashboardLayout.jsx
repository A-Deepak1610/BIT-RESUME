import React from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen dark:bg-gray-900 dark:text-white">
      <NavBar />
      <div className="   flex flex-1 overflow-hidden">
        <SideBar />
        <main className="flex-1 bg-gray-100 overflow-y-auto ">
            <Outlet />
        </main>
      </div>
    </div>
  );
}
