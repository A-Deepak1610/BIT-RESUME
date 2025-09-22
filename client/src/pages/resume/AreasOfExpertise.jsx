
import React from 'react';

const AreasOfExpertise = () => {
  // Data is structured into categories for a more professional look.
  const expertise = {
    "Programming Languages": ["Python", "JavaScript", "Go", "Java"],
    "Frameworks & Libraries": ["React", "Node.js", "PyTorch", "Express.js", "Tailwind CSS"],
    "Web & Database": ["HTML5", "CSS3", "SQL (PostgreSQL)", "MongoDB"],
    "Tools & Platforms": ["Git", "Docker", "AWS", "Vercel", "Figma"],
  };
  return (
    <div className="space-y-1">
      {Object.entries(expertise).map(([category, skills]) => (
        <div key={category} className="flex flex-col sm:flex-row text-xs">
          {/* Use a fixed-width for category for better alignment */}
          <p className="w-full sm:w-40 font-semibold text-gray-700 shrink-0">{category}:</p>
          <p className="text-gray-600">{skills.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default AreasOfExpertise;
