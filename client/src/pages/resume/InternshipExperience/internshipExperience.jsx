import React, { useEffect, useState } from 'react';
import { Briefcase, DollarSign, Code, Loader2, Building, Globe } from 'lucide-react';
import useAuth from '../../../store/UseAuth'; // Assuming this is the correct path

export default function InternshipExperience() {
  const [internshipsData, setInternshipsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { rollno } = useAuth();

  useEffect(() => {
    // Don't fetch if rollno is not yet available
    if (!rollno) {
      return;
    }

    const fetchInternships = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:6001/api/resume/getinternshipdata`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch internships. Status: ${response.status}`);
        }

        const data = await response.json();
        setInternshipsData(data || []); // Ensure data is an array

      } catch (err) {
        console.error("Error fetching internships:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();

  }, [rollno]); // Dependency array ensures this runs when rollno changes

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading Internships...</span>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500 p-4 text-center">{error}</div>;
    }

    if (!internshipsData || internshipsData.length === 0) {
      return <div className="text-gray-500 p-4 text-center">No internship experience found.</div>;
    }

    // Map over the data from the API
    return internshipsData.map((internship, index) => (
      <div key={index} className="flex flex-col p-3 bg-gray-50 rounded-lg">
        {/* Top Row: Company Name and Duration */}
        <div className="flex justify-between items-center mb-2">
          {/* Use company_name from API */}
          <p className="text-gray-800 font-bold text-sm">{internship.company_name}</p>
          {/* Use duration from API */}
          <p className="text-gray-500 text-xs">{internship.duration}</p>
        </div>

        {/* Bottom Row: Badges for Details */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Paid/Unpaid Badge - use is_paid from API */}
          <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
              internship.is_paid
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <DollarSign size={12} className="mr-1" />
            {internship.is_paid ? 'Paid' : 'Unpaid'}
          </span>

          {/* Domain Badge - use domain from API */}
          <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
            <Code size={12} className="mr-1" />
            {internship.domain}
          </span>
          
          {/* The "type" badge has been removed as requested */}
        </div>
      </div>
    ));
  };


  return (
    <div className="p-2 bg-white shadow rounded-lg h-[30vh] flex flex-col">
      {/* --- Card Header --- */}
      <div className="flex items-center text-gray-800 font-medium flex-shrink-0">
        <Briefcase className="text-gray-500" />
        <h3 className="text-md font-semibold text-gray-700 ml-2">Internship Experience</h3>
      </div>

      {/* --- SCROLLABLE Internships List --- */}
      <div className="mt-2 space-y-3 pr-1 overflow-y-auto" style={{ maxHeight: '22vh' }}>
        {renderContent()}
      </div>
    </div>
  );
}