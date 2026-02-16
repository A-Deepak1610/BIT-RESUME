import React from "react";
import useAuth from "../../store/UseAuth";

const ConsultancyAdmin = () => {
  const { user } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Consultancy Admin Panel</h1>
      <p>Welcome, {user?.role}! Here you can manage and view all consultancy-related activities, reports, and requests for your department or institution.</p>
      <ul className="list-disc ml-6 mt-4">
        <li>View all faculty consultancy submissions</li>
        <li>Approve or reject consultancy requests</li>
        <li>Generate consultancy reports</li>
        <li>Monitor ongoing consultancy projects</li>
      </ul>
    </div>
  );
};

export default ConsultancyAdmin;
