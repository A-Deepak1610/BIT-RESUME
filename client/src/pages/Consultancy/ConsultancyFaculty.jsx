import React from "react";
import useAuth from "../../store/UseAuth";

const ConsultancyFaculty = () => {
  const { user } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Consultancy</h1>
      <p>Welcome, Faculty! Here you can submit and track your consultancy work and requests.</p>
    </div>
  );
};

export default ConsultancyFaculty;
