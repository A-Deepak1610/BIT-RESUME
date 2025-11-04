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

const AccomplishmentsForResume = (props) => {
  const { rollno } = useAuth();
  console.log("AccomplishmentsForResume rollno from auth:", props.rollno);
  const student_rollno = props.rollno || '-'
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

    const fetchAllAccomplishments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Create fetch requests
        const fetchInternships = fetch(`${API_URL}/api/resume/getinternshipdata/${student_rollno}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
        });

        const fetchCertifications = fetch(`${API_URL}/api/resume/getcertificates/${student_rollno}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
        });

        const fetchHackathons = fetch(`${API_URL}/api/resume/gethackathondata/${student_rollno}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
        });

        // Execute all requests in parallel
        const [internshipsResponse, certificationsResponse, hackathonsResponse] = await Promise.all([
          fetchInternships,
          fetchCertifications,
          fetchHackathons
        ]);

        // Check if all responses are ok
        if (!internshipsResponse.ok) {
          throw new Error(`Failed to fetch internships. Status: ${internshipsResponse.status}`);
        }
        if (!certificationsResponse.ok) {
          throw new Error(`Failed to fetch certifications. Status: ${certificationsResponse.status}`);
        }
        if (!hackathonsResponse.ok) {
          throw new Error(`Failed to fetch hackathons. Status: ${hackathonsResponse.status}`);
        }
        
        // Parse all JSON responses in parallel
        const [internshipsData, certificationsData, hackathonsData] = await Promise.all([
          internshipsResponse.json(),
          certificationsResponse.json(),
          hackathonsResponse.json()
        ]);
        
        // Set all state at once
        setInternships(internshipsData || []);
        setCertifications(certificationsData || []);
        setHackathons(hackathonsData || []);

      } catch (err) {
        console.error("Error fetching accomplishments data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAccomplishments();
  }, [rollno]);

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
        {internships.map((item, index) => (
          <li key={index}>
            <span className="font-medium">{item.company_name}</span>
            {item.domain && <span className="text-gray-500"> - {item.domain}</span>}
          </li>
        ))}
      </SubSection>
    );
  }

  if (certifications.length > 0) {
    accomplishmentSections.push(
      <SubSection key="certifications" title="Certifications" icon={<ShieldCheck className="h-4 w-4 text-blue-800" />}>
        {certifications.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </SubSection>
    );
  }

  if (hackathons.length > 0) {
    accomplishmentSections.push(
      <SubSection key="hackathons" title="Hackathon Wins" icon={<Award className="h-4 w-4 text-blue-800" />}>
        {hackathons.map((item, index) => (
          <li key={index}>
            <span className="font-medium">{item.event_name}</span> {/* Changed from item.title */}
            {item.did_you_win && <span className="text-gray-500"> - {item.did_you_win}</span>} {/* Changed from item.place */}
          </li>
        ))}
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