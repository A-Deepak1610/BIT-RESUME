import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Verified', students: 20 },
  { name: 'Pending Verify', students: 10 },
  { name: 'Approved', students: 25 },
  { name: 'Pending Approve', students: 15 },
];

export default function ProgressGraph() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 mb-3">
        <h2 className="text-lg font-bold text-gray-800">Student Progress</h2>
        <p className="text-xs text-gray-500">Monthly Report</p>
      </div>

      <div className="flex-grow min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 30]}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }}
            />
            <Bar
              dataKey="students"
              fill="#3B82F6"
              radius={[3, 3, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}