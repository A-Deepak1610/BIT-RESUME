import React, {useState} from "react";
import {Search, UserX, X} from "lucide-react";

export default function StudentPerformance({
  datas = [],
  selectedStudentName,
  onStudentSelect,
  onClose,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredStudents = datas.filter(
    (student) =>
      student.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickOnLeft = (student) => {
    if (onStudentSelect) {
      onStudentSelect(student);
    }
  };

  return (
    <div className="p-4 bg-gray-50 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-xl text-gray-800">Students</h1>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-200"
          aria-label="Close panel"
        >
          <X size={24} />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={16} />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                           text-sm placeholder-gray-400"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredStudents.length > 0 ? (
        <div className="space-y-3">
          {filteredStudents.map((item, index) => (
            <div
              key={item.rollno || index}
              className={`bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer
                                        ${
                                          selectedStudentName === item.user_name
                                            ? "ring-2 ring-indigo-500 border-indigo-500"
                                            : ""
                                        }`}
              onClick={() => handleClickOnLeft(item)}
            >
              <h3 className="text-base font-semibold text-indigo-700">
                {item.user_name}
              </h3>
              <p className="text-sm text-gray-500">{item.rollno}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg">
          <UserX size={36} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 text-sm">
            {searchTerm ? "No matching students" : "No students found"}
          </p>
        </div>
      )}
    </div>
  );
}
