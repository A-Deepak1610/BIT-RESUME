import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const AreasOfExpertise = ({ rollno }) => {
  const [expertise, setExpertise] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpertise = async () => {
      if (!rollno) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}api/aresofexpertise/${rollno}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Areas of expertise API response:", result);

          // Convert array response to object format for display
          if (result.data && Array.isArray(result.data)) {
            const expertiseObj = {};
            result.data.forEach((item) => {
              if (item.category && item.skills && item.skills.length > 0) {
                expertiseObj[item.category] = item.skills;
              }
            });
            setExpertise(expertiseObj);
          }
        }
      } catch (error) {
        console.error("Error fetching areas of expertise:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpertise();
  }, [rollno]);

  if (isLoading) {
    return <div className="text-xs text-gray-500">Loading expertise...</div>;
  }

  if (Object.keys(expertise).length === 0) {
    return (
      <div className="text-xs text-gray-500">No areas of expertise found</div>
    );
  }

  return (
    <div className="space-y-1">
      {Object.entries(expertise).map(([category, skills]) => (
        <div key={category} className="flex flex-col sm:flex-row text-xs">
          {/* Use a fixed-width for category for better alignment */}
          <p className="w-full sm:w-40 font-semibold text-gray-700 shrink-0">
            {category}:
          </p>
          <p className="text-gray-600">{skills.join(", ")}</p>
        </div>
      ))}
    </div>
  );
};

export default AreasOfExpertise;
