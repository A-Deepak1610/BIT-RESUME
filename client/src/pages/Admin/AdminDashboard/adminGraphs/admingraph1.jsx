import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const allStudentsData = [
  // Computer Science Engineering (CSE)
  { year: 'Year 1', department: 'CSE', status: 'Active', count: 50 },
  { year: 'Year 2', department: 'CSE', status: 'Active', count: 45 },
  { year: 'Year 3', department: 'CSE', status: 'Active', count: 60 },
  { year: 'Year 4', department: 'CSE', status: 'Active', count: 55 },
  { year: 'Year 1', department: 'CSE', status: 'Inactive', count: 5 },
  { year: 'Year 2', department: 'CSE', status: 'Inactive', count: 8 },
  { year: 'Year 3', department: 'CSE', status: 'Students on OD', count: 12 },
  { year: 'Year 4', department: 'CSE', status: 'Students on OD', count: 7 },

  // Electronics and Communication Engineering (ECE)
  { year: 'Year 1', department: 'ECE', status: 'Active', count: 40 },
  { year: 'Year 2', department: 'ECE', status: 'Active', count: 35 },
  { year: 'Year 3', department: 'ECE', status: 'Active', count: 42 },
  { year: 'Year 4', department: 'ECE', status: 'Active', count: 38 },
  { year: 'Year 1', department: 'ECE', status: 'Inactive', count: 4 },
  { year: 'Year 3', department: 'ECE', status: 'Inactive', count: 6 },
  { year: 'Year 2', department: 'ECE', status: 'Students on OD', count: 10 },
  { year: 'Year 4', department: 'ECE', status: 'Students on OD', count: 5 },

  // Mechanical Engineering (MECH)
  { year: 'Year 1', department: 'MECH', status: 'Active', count: 60 },
  { year: 'Year 2', department: 'MECH', status: 'Active', count: 65 },
  { year: 'Year 3', department: 'MECH', status: 'Active', count: 70 },
  { year: 'Year 4', department: 'MECH', status: 'Active', count: 62 },
  { year: 'Year 1', department: 'MECH', status: 'Inactive', count: 10 },
  { year: 'Year 2', department: 'MECH', status: 'Students on OD', count: 15 },
  { year: 'Year 3', department: 'MECH', status: 'Inactive', count: 8 },
];

// Options for the dropdowns
const statusOptions = ['Active', 'Inactive', 'Students on OD'];
const yearOptions = ['All Years', 'Year 1', 'Year 2', 'Year 3', 'Year 4'];
const departmentOptions = ['All Departments', 'CSE', 'ECE', 'MECH'];


export default function Admingraph1() {
  // --- STATE MANAGEMENT ---
  const [studentStatus, setStudentStatus] = useState('Active');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [chartData, setChartData] = useState([]);
  const [xAxisDataKey, setXAxisDataKey] = useState('year');

  // --- DATA FILTERING AND PROCESSING ---
  useEffect(() => {
    // Filter data based on selections
    const filtered = allStudentsData.filter(item => {
      const statusMatch = item.status === studentStatus;
      const yearMatch = selectedYear === 'All Years' || item.year === selectedYear;
      const departmentMatch = selectedDepartment === 'All Departments' || item.department === selectedDepartment;
      return statusMatch && yearMatch && departmentMatch;
    });

    let processedData;
    // Determine the grouping for the X-axis
    if (selectedYear === 'All Years') {
      // Group by year if all years are selected
      setXAxisDataKey('year');
      processedData = yearOptions.slice(1).map(year => ({
        year: year,
        students: filtered
          .filter(item => item.year === year)
          .reduce((sum, current) => sum + current.count, 0),
      }));
    } else {
      // Otherwise, group by department
      setXAxisDataKey('department');
      processedData = departmentOptions.slice(1).map(dept => ({
        department: dept,
        students: filtered
          .filter(item => item.department === dept)
          .reduce((sum, current) => sum + current.count, 0),
      }));
    }
    
    setChartData(processedData);

  }, [studentStatus, selectedYear, selectedDepartment]);


  return (
    <div className="p-4 rounded-lg w-full h-full flex flex-col">
      {/* --- DIALOG/CONTROL PANEL --- */}
      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap items-center gap-4">
        <h3 className="text-md font-bold text-gray-700 mr-2">Filter Data:</h3>
        {/* Status Dropdown */}
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="status-select" className="block text-sm font-medium text-gray-600 mb-1">Status</label>
          <select id="status-select" value={studentStatus} onChange={(e) => setStudentStatus(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        
        {/* Year Dropdown */}
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="year-select" className="block text-sm font-medium text-gray-600 mb-1">Year</label>
          <select id="year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {yearOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        {/* Department Dropdown */}
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="dept-select" className="block text-sm font-medium text-gray-600 mb-1">Department</label>
          <select id="dept-select" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {departmentOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </div>

      {/* --- CHART DISPLAY --- */}
      <div className="w-full flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={xAxisDataKey}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 'dataMax + 20']}
            />
            <Tooltip
              cursor={{ fill: 'rgba(238, 242, 255, 0.5)' }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Bar
              dataKey="students"
              name={studentStatus} 
              fill="#0000FF"
              barSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}