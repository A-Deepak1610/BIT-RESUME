import React from "react";
import useAuth from "../../store/UseAuth";

const ConsultancyHod = () => {
  const { user } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Consultancy - HOD Panel</h1>
      <p>Welcome, HOD! Here you can manage your department's consultancy activities, approve requests, and view department-specific reports.</p>
      <ul className="list-disc ml-6 mt-4">
        <li>View and approve department consultancy projects</li>
        <li>Monitor department consultancy progress</li>
        <li>Generate department consultancy reports</li>
      </ul>
    </div>
  );
};

export default ConsultancyHod;
