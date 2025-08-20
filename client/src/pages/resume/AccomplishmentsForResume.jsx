import React, { useState, useEffect } from 'react';
import useAuth from '../../store/UseAuth';
import { Award, Briefcase, ShieldCheck } from 'lucide-react';

// The SubSection helper component remains the same
const SubSection = ({ title, icon, children }) => (
  <div className="break-inside-avoid">
    <div className="flex items-center gap-2 mb-1.5">
      {icon}
      <h4 className="font-semibold text-gray-700 text-sm">{title}</h4>
    </div>
    <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 ml-1">
      {children}
    </ul>
  </div>
);


const AccomplishmentsForResume = () => {
  const { rollno } = useAuth();
  const API_URL = "http://localhost:6001";
  
  // State for each data type
  const [internships, setInternships] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  
  // States for loading and error handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rollno) {
      setIsLoading(false);
      return;
    }

    const fetchAccomplishments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Define endpoints based on your Go backend routes
        const endpoints = {
          internships: `getinternshipdata`,
          certificates: `getcertificates`,
          hackathons: `gethackathondata`,
        };
        
        // Create an array of fetch promises to run in parallel
        const responses = await Promise.all([
          fetch(`${API_URL}/api/resume/${endpoints.internships}/${rollno}` , {
            credentials: 'include',
          }),
          fetch(`${API_URL}/api/resume/${endpoints.certificates}/${rollno}` , {
            credentials:'include'
          }),
          fetch(`${API_URL}/api/resume/${endpoints.hackathons}/${rollno}` , {
            credentials:'include'
          }),
        ]);

        // Check if any of the network responses are not ok
        for (const response of responses) {
          if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
          }
        }
        
        // Parse the JSON from each response
        const [internshipData, certificateData, hackathonData] = await Promise.all(
          responses.map(res => res.json())
        );
        
        // Set the state with the fetched data
        setInternships(internshipData || []);
        setCertifications(certificateData || []);
        setHackathons(hackathonData || []);

      } catch (err) {
        console.error("Error fetching accomplishments data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccomplishments();
  }, [rollno]); // API_URL is a constant, so it's not needed in the dependency array

  // Render loading state
  if (isLoading) {
    return <div className="text-xs text-gray-500">Loading accomplishments...</div>;
  }
  
  // Render error state
  if (error) {
    return <div className="text-xs text-red-500">Error: {error}</div>;
  }

  // Build an array of sections that have data
  const accomplishmentSections = [];

  if (internships.length > 0) {
    accomplishmentSections.push(
      <SubSection key="internships" title="Internship Experience" icon={<Briefcase className="h-4 w-4 text-blue-800" />}>
        {internships.map((item, index) => <li key={index}>{item.company_name}</li>)}
      </SubSection>
    );
  }
  if (certifications.length > 0) {
    accomplishmentSections.push(
      <SubSection key="certifications" title="Certifications" icon={<ShieldCheck className="h-4 w-4 text-blue-800" />}>
        {certifications.map((item, index) => <li key={index}>{item.title}</li>)}
      </SubSection>
    );
  }
  if (hackathons.length > 0) {
    accomplishmentSections.push(
      <SubSection key="hackathons" title="Hackathon Wins" icon={<Award className="h-4 w-4 text-blue-800" />}>
        {hackathons.map((item, index) => <li key={index}>{item.title}</li>)}
      </SubSection>
    );
  }

  // Render a message if no data is available after loading
  if (accomplishmentSections.length === 0) {
    return <div className="text-xs text-gray-500">No accomplishments data available.</div>;
  }

  // Render a single section without the grid layout if only one has data
  if (accomplishmentSections.length === 1) {
    return accomplishmentSections[0];
  }
  
  // Render all available sections in a grid
  return (
    <div className="grid grid-cols-3 gap-x-6 gap-y-4">
      {accomplishmentSections.map((section) => section)}
    </div>
  );
};

export default AccomplishmentsForResume;