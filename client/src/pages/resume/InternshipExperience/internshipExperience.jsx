import React from 'react';
import { Briefcase, DollarSign, Globe, Building, Code } from 'lucide-react';

export default function InternshipExperience() {
  // Expanded data to ensure content overflows and scrolling is visible
  const attendedInternships = [
    {
      name: "Cryond",
      duration: "3 Months",
      isPaid: true,
      domain: "Full Stack",
      type: "Remote"
    },
    {
      name: "Kalif",
      duration: "6 Months",
      isPaid: false,
      domain: "AI/ML",
      type: "On-site"
    },
    {
      name: "ThecnoHacks",
      duration: "2 Months",
      isPaid: true,
      domain: "Cybersecurity",
      type: "Remote"
    },
    {
      name: "Innovate Inc.",
      duration: "4 Months",
      isPaid: true,
      domain: "Data Science",
      type: "On-site"
    },
    {
      name: "Dev Solutions",
      duration: "3 Months",
      isPaid: false,
      domain: "Backend Dev",
      type: "Remote"
    }
  ];

  return (
    <div className="p-2 bg-white shadow rounded-lg h-[30vh] flex flex-col">
      {/* --- Card Header --- */}
      <div className="flex items-center text-gray-800 font-medium flex-shrink-0">
        <Briefcase className="text-gray-500" />
        <h3 className="text-md font-semibold text-gray-700 ml-2">Internship Experience</h3>
      </div>

      {/* --- SCROLLABLE Internships List --- */}
      {/*
        Key changes for scrolling:
        1. overflow-y-auto: Adds a scrollbar only when content is too tall.
        2. maxHeight: Ensures the container doesn't grow past the available space.
        (Calculated as 30vh of the parent minus header height/padding)
      */}
      <div className="mt-2 space-y-3 pr-1 overflow-y-auto" style={{ maxHeight: '22vh' }}>
        {attendedInternships.map((internship, index) => (
          <div key={index} className="flex flex-col p-3 bg-gray-50 rounded-lg">
            {/* Top Row: Name and Duration */}
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-800 font-bold text-sm">{internship.name}</p>
              <p className="text-gray-500 text-xs">{internship.duration}</p>
            </div>

            {/* Bottom Row: Badges for Details */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Paid/Unpaid Badge */}
              <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                  internship.isPaid
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                <DollarSign size={12} className="mr-1" />
                {internship.isPaid ? 'Paid' : 'Unpaid'}
              </span>

              {/* Domain Badge */}
              <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                <Code size={12} className="mr-1" />
                {internship.domain}
              </span>

              {/* Type Badge (Remote/On-site) */}
              <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
                {internship.type === 'Remote' ? (
                  <Globe size={12} className="mr-1" />
                ) : (
                  <Building size={12} className="mr-1" />
                )}
                {internship.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}