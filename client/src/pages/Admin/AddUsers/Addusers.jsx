import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, User, GraduationCap, Hash } from 'lucide-react';
import SelectedDetail from './selectedDetail';
import AddUsersModal from './AddUsersModal'; // <-- Import the new modal component

export default function Addusers() {
  const [activeTab, setActiveTab] = useState("mentor");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- State for modal visibility
  const [expandedSections, setExpandedSections] = useState({
    'Active': true,
    'Inactive': true
  });

  // Dummy data for demonstration
  const mentorData = [
    { id: 1, name: "Dr. John Smith", email: "john.smith@bit.edu", department: "Computer Science", status: "Active", type: "Faculty", phone: "+1-555-0123", experience: "15 years", specialization: "Machine Learning" },
    { id: 2, name: "Prof. Sarah Johnson", email: "sarah.johnson@bit.edu", department: "Electrical Engineering", status: "Active", type: "Faculty", phone: "+1-555-0124", experience: "12 years", specialization: "Power Systems" },
    { id: 3, name: "Dr. Michael Brown", email: "michael.brown@bit.edu", department: "Mechanical Engineering", status: "Inactive", type: "Faculty", phone: "+1-555-0125", experience: "8 years", specialization: "Robotics" },
  ];

  const studentData = [
    { id: 1, name: "Alice Johnson", email: "alice.johnson@bit.edu", rollno: "BIT2021001", department: "Computer Science", status: "Active", type: "Undergraduate", phone: "+1-555-0126", year: "3rd Year", cgpa: "8.5" },
    { id: 2, name: "Bob Wilson", email: "bob.wilson@bit.edu", rollno: "BIT2021002", department: "Electrical Engineering", status: "Active", type: "Undergraduate", phone: "+1-555-0127", year: "2nd Year", cgpa: "7.8" },
    { id: 3, name: "Carol Davis", email: "carol.davis@bit.edu", rollno: "BIT2021003", department: "Mechanical Engineering", status: "Inactive", type: "Postgraduate", phone: "+1-555-0128", year: "1st Year", cgpa: "8.2" },
  ];

  const filteredMentors = useMemo(() => {
    return mentorData.filter(mentor => {
      const statusMatch = selectedStatus === "All Statuses" || mentor.status === selectedStatus;
      const typeMatch = selectedType === "All Types" || mentor.type === selectedType;
      const termMatch = !searchTerm ||
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.department.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && typeMatch && termMatch;
    });
  }, [searchTerm, mentorData, selectedStatus, selectedType]);

  const filteredStudents = useMemo(() => {
    return studentData.filter(student => {
      const statusMatch = selectedStatus === "All Statuses" || student.status === selectedStatus;
      const typeMatch = selectedType === "All Types" || student.type === selectedType;
      const termMatch = !searchTerm ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && typeMatch && termMatch;
    });
  }, [searchTerm, studentData, selectedStatus, selectedType]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setSelectedStatus("All Statuses");
    setSelectedType("All Types");
    setSelectedUser(null);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const toggleSectionExpansion = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const TabButton = ({ label, value, icon: Icon }) => (
    <button
      onClick={() => handleTabClick(value)}
      className={`py-3 px-6 font-medium text-sm focus:outline-none -mb-px border-b-2 flex items-center space-x-2 ${activeTab === value ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  const FilterDropdown = ({ value, onChange, options, label }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown size={18} />
      </div>
    </div>
  );

  const renderContent = () => {
    const data = activeTab === 'mentor' ? filteredMentors : filteredStudents;

    // Group users by status
    const groupedUsers = data.reduce((acc, user) => {
      if (!acc[user.status]) {
        acc[user.status] = [];
      }
      acc[user.status].push(user);
      return acc;
    }, {});

    const statuses = Object.keys(groupedUsers);

    if (data.length === 0) {
      return (
        <div className="text-center py-10">
          <div className="text-gray-400 mb-4">
            {activeTab === 'mentor' ? <User size={48} /> : <GraduationCap size={48} />}
          </div>
          <p className="text-gray-500 text-lg font-medium">No {activeTab}s found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {statuses.map((status) => (
          <div key={status} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSectionExpansion(status)}
              className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-100 hover:bg-slate-200 transition-colors duration-150 focus:outline-none"
              aria-expanded={expandedSections[status]}
              aria-controls={`user-list-${status}`}
            >
              <h2 className="text-lg sm:text-xl font-semibold text-indigo-700">
                {status} {activeTab === 'mentor' ? 'Faculty' : 'Students'} ({groupedUsers[status].length})
              </h2>
              {expandedSections[status] ? (
                <ChevronUp size={24} className="text-indigo-600" />
              ) : (
                <ChevronDown size={24} className="text-indigo-600" />
              )}
            </button>

            {expandedSections[status] && (
              <div id={`user-list-${status}`} className="p-4 sm:p-6">
                <ul className="space-y-3">
                  {groupedUsers[status].map((user, index) => (
                    <li
                      key={user.id || index}
                      onClick={() => handleUserClick(user)}
                      className={`p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-indigo-300 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${selectedUser?.id === user.id ? 'border-indigo-500 shadow-md' : ''}`}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleUserClick(user);
                        }
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center mb-1 sm:mb-0">
                          {activeTab === 'mentor' ? (
                            <User size={18} className="text-indigo-500 mr-2.5 flex-shrink-0" />
                          ) : (
                            <GraduationCap size={18} className="text-green-500 mr-2.5 flex-shrink-0" />
                          )}
                          <span className="font-medium text-gray-700">{user.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Hash size={16} className="text-gray-400 mr-1.5 flex-shrink-0" />
                          <span>
                            {activeTab === 'student' ? `Roll No: ${user.rollno}` : `Dept: ${user.department}`}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        {user.email}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const statusOptions = ["All Statuses", "Active", "Inactive"];
  const mentorTypeOptions = ["All Types", "Faculty", "Professor", "Associate Professor"];
  const studentTypeOptions = ["All Types", "Undergraduate", "Postgraduate", "PhD"];

  return (
    <>
      <div className="bg-gray-100 min-h-screen py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex -mb-px space-x-1">
              <TabButton label="Mentors" value="mentor" icon={User} />
              <TabButton label="Students" value="student" icon={GraduationCap} />
            </nav>
          </div>

          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow w-full md:max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base shadow-sm border border-gray-300"
                placeholder={`Search ${activeTab}s...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <FilterDropdown
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={statusOptions}
                label="Filter by status"
              />
              <FilterDropdown
                value={selectedType}
                onChange={setSelectedType}
                options={activeTab === 'mentor' ? mentorTypeOptions : studentTypeOptions}
                label="Filter by type"
              />
              {/* Updated button to open the modal */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white py-2.5 px-6 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>+</span>
                <span>{activeTab === 'mentor' ? 'Add Faculty' : 'Add Student'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3">
              {renderContent()}
            </div>
            <div className="lg:w-1/3">
              <SelectedDetail selectedUser={selectedUser} userType={activeTab} />
            </div>
          </div>
        </div>
      </div>
      <AddUsersModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userType={activeTab}
      />
    </>
  );
}