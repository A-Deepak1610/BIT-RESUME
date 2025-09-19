import React, { useEffect, useState } from 'react';
import { Award, Loader2 } from "lucide-react";
import useAuth from '../../../store/UseAuth';

export default function Hackathons() {
  const [hackathonsData, setHackathonsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { rollno } = useAuth();

  useEffect(() => {
    if (!rollno) {
      return;
    }

    const fetchHackathons = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:6001/api/resume/gethackathondata`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch hackathons. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Hackathons Data:", data);

        setHackathonsData(data);

      } catch (err) {
        console.error("Error fetching hackathons:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();

  }, [rollno]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-[#7371ff]" />
          <span className="ml-2">Loading...</span>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500 p-4">{error}</div>;
    }

    if (!hackathonsData || hackathonsData.length === 0) {
      return <div className="text-gray-500 p-4">No hackathon wins found.</div>;
    }

    return hackathonsData.map((hackathon, index) => (
      <div key={index} className="mb-2 p-2">
        <div className="flex items-start">
          <div className="w-6 h-6 border flex items-center justify-center border-[#9b9aff] rounded-full flex-shrink-0 overflow-hidden bg-white">
            {hackathon.img_url ? (
              <img
                src={`http://localhost:6001/${hackathon.img_url}`} // Add base URL for image
                alt={hackathon.event_name} // Changed from hackathon.title
                className="w-6 h-6 object-cover rounded-full"
                onError={(e) => {
                  // Fallback to Award icon if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : (
              <Award className="w-4 h-4 text-[#7371ff]" />
            )}
            <Award className="w-4 h-4 text-[#7371ff]" style={{ display: 'none' }} />
          </div>
          <div className="ml-2">
            <p className="text-[#01009E] text-[14px] font-semibold">
              {hackathon.event_name} {/* Changed from hackathon.title */}
            </p>
            <p className="text-gray-500 text-[12px]">
              {hackathon.did_you_win} {/* Changed from hackathon.place */}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-2 lg:ml-2 bg-white shadow rounded-lg h-[30vh] flex flex-col">
      <div className="flex items-center text-gray-800 font-medium flex-shrink-0">
        <Award className="text-[#7371ff]" />
        <span className="ml-1">Hackathon Wins</span>
      </div>

      <div className="mt-2 overflow-y-auto space-y-3 pr-1 flex-grow">
        {renderContent()}
      </div>
    </div>
  );
}