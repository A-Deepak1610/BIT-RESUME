import React, { useState, useEffect } from 'react';
import useAuth from '../../store/UseAuth';
import { Award, Briefcase, ShieldCheck } from 'lucide-react';

// The SubSection helper remains the same
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

// --- DUMMY DATA ---
// This data will be used as a fallback if the API fetch fails.
const DUMMY_INTERNSHIPS = [
  { name: "Tech Solutions Inc. - Software Engineer Intern" },
  { name: "Innovate AI - Machine Learning Fellow" },
];
const DUMMY_CERTIFICATIONS = [
  { title: "Certified Cloud Practitioner" },
  { title: "React Professional Developer" },
  { title: "Advanced Python for Data Science" },
];
const DUMMY_HACKATHONS = [
  { title: "InnovateFest 2024 - 1st Place" },
  { title: "Code for Change - Finalist" },
];


const AccomplishmentsForResume = () => {
  const { rollno } = useAuth();
  const API_URL = "http://localhost:6001";
  
  const [internships, setInternships] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!rollno) {
      setIsLoading(false);
      return;
    }

    // This function now accepts dummyData as a third argument for fallback purposes.
    const fetchData = async (endpoint, setter, dummyData) => {
      try {
        const response = await fetch(`${API_URL}/api/resume/${endpoint}/${rollno}`);
        // If the response is OK, use the real data from the API.
        // If the response is not OK (e.g., a 404 error), it means the user has no data, so we set an empty array.
        setter(response.ok ? (await response.json()) : []);
      } catch (error) {
        // **FALLBACK LOGIC**: If the fetch itself fails (e.g., network error),
        // we log the error and use the provided dummy data.
        console.error(`API fetch error for ${endpoint}. Using dummy data as a fallback.`, error);
        setter(dummyData);
      }
    };

    // We pass the dummy data arrays when calling fetchData for each section.
    Promise.all([
      fetchData('getinternships', setInternships, DUMMY_INTERNSHIPS),
      fetchData('getcertificates', setCertifications, DUMMY_CERTIFICATIONS),
      fetchData('gethackathons', setHackathons, DUMMY_HACKATHONS),
    ]).finally(() => setIsLoading(false));

  }, [rollno, API_URL]);

  // The rest of the component logic remains the same.
  // It will now render with real data if available, or dummy data on error.

  const accomplishmentSections = [];

  if (internships.length > 0) {
    accomplishmentSections.push(
      <SubSection key="internships" title="Internship Experience" icon={<Briefcase className="h-4 w-4 text-blue-800" />}>
        {internships.map((item, index) => <li key={index}>{item.name}</li>)}
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

  if (isLoading) {
    return <div className="text-xs text-gray-500">Loading accomplishments...</div>;
  }
  
  if (accomplishmentSections.length === 0) {
    return <div className="text-xs text-gray-500">No accomplishments data available.</div>;
  }

  if (accomplishmentSections.length === 1) {
    return accomplishmentSections[0];
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      {accomplishmentSections.map((section) => section)}
    </div>
  );
};

export default AccomplishmentsForResume;