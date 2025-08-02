import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Data for the graph
const data = [
  { name: 'Request Verified', students: 20 },
  { name: 'Pending Verification', students: 10 },
  { name: 'Request Approved', students: 25 },
  { name: 'Pending Approval', students: 15 },
];

export default function ProgressGraph() {
  return (
    // Make the main container fill its parent's height and use flexbox
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-full flex flex-col">
      {/* Titles Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Student Progress</h2>
        <p className="text-sm text-gray-500 mb-4">Monthly Report</p>
      </div>

      {/* Chart container: will now grow to fill the remaining space */}
      <div className="w-full flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 30]}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #ccc',
                borderRadius: '0.5rem',
              }}
            />
            <Bar
              dataKey="students"
              fill="#0000FF"
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}