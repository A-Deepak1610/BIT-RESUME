import React from "react";
import useAuth from "../../store/UseAuth";

const ConsultancyIQAC = () => {
  const { user } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Consultancy - IQAC Panel</h1>
      <p>Welcome, IQAC! Here you can monitor consultancy quality, compliance, and generate quality assurance reports.</p>
      <ul className="list-disc ml-6 mt-4">
        <li>Review consultancy compliance and documentation</li>
        <li>Monitor quality metrics for consultancy projects</li>
        <li>Generate IQAC-specific consultancy reports</li>
      </ul>
    </div>
  );
};

export default ConsultancyIQAC;
