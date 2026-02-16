import React from "react";
import useAuth from "../../store/UseAuth";

const ConsultancyPrincipal = () => {
  const { user } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Consultancy - Principal Panel</h1>
      <p>Welcome, Principal! Here you can oversee all consultancy activities, approve high-level requests, and generate institution-wide reports.</p>
      <ul className="list-disc ml-6 mt-4">
        <li>View and approve all consultancy projects</li>
        <li>Access summary and analytics for all departments</li>
        <li>Generate institution consultancy reports</li>
      </ul>
    </div>
  );
};

export default ConsultancyPrincipal;
