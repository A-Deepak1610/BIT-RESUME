import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useAuth from '../../../../store/UseAuth';

// Initial state for the chart data, starting at zero.
const initialProgress = [
  { name: 'Verified', students: 0 },
  { name: 'Pending Verify', students: 0 },
  { name: 'Approved', students: 0 },
  { name: 'Pending Approve', students: 0 },
];

export default function ProgressGraph() {
  const [progressData, setProgressData] = useState(initialProgress);
  const [yAxisMax, setYAxisMax] = useState(30); // Default max for the Y-axis
  const {rollno} = useAuth(); // Assuming useAuth provides the roll number, though not used here
  const API_BASE = import.meta.env.VITE_API_URL;
  useEffect(() => {
    // This function fetches data from both APIs and calculates the total counts.
    const fetchAndProcessData = async () => {
      try {
        // Fetch both datasets in parallel for better performance.
        // NOTE: The '/approvels' endpoint is called without a rollno to get all data, as requested.
        const [approvalsResponse, verificationsResponse] = await Promise.all([
          axios.get(`${API_BASE}api/manageactivities/approvels/${rollno}`, { withCredentials: true }),
          axios.get(`${API_BASE}api/studentrequests/varifications`, { withCredentials: true })
        ]);

        const approvalsData = approvalsResponse.data || [];
        const verificationsData = verificationsResponse.data || [];

        // --- 1. Process Approvals Data (Event Registrations) ---
        let approvedCount = 0;
        let pendingApproveCount = 0;

        approvalsData.forEach(item => {
          if (item.verified === 'accepted') {
            approvedCount++;
          } else if (item.verified === 'pending') {
            pendingApproveCount++;
          }
        });

        // --- 2. Process Verifications Data (Activity Submissions) ---
        let verifiedCount = 0;
        let pendingVerifyCount = 0;

        verificationsData.forEach(item => {
          // Patents have a unique status field 'patent_status'
          if (item.upload_type === 'patents') {
            if (item.patent_status === 'Pending') {
              pendingVerifyCount++;
            } else {
              verifiedCount++;
            }
          } else {
            // All other types use 'approval_status'
            const status = item.approval_status;
            // Treat 'Pending', '0', or a missing status field as pending
            if (status === 'Pending' || status === '0' || status === null || status === undefined) {
              pendingVerifyCount++;
            } else {
              verifiedCount++;
            }
          }
        });

        // --- 3. Update state with the final counts ---
        const newProgressData = [
          { name: 'Verified', students: verifiedCount },
          { name: 'Pending Verify', students: pendingVerifyCount },
          { name: 'Approved', students: approvedCount },
          { name: 'Pending Approve', students: pendingApproveCount },
        ];

        setProgressData(newProgressData);

        // --- 4. Dynamically adjust the Y-axis for better chart readability ---
        const maxCount = Math.max(verifiedCount, pendingVerifyCount, approvedCount, pendingApproveCount);
        setYAxisMax(Math.ceil((maxCount + 5) / 5) * 5 || 10); // Set max to nearest 5, default to 10

      } catch (error) {
        console.error("Error fetching or processing progress data:", error);
        // You could set an error state here to display a message in the UI
      }
    };

    fetchAndProcessData();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 mb-3">
        <h2 className="text-lg font-bold text-gray-800">Overall Progress</h2>
        <p className="text-xs text-gray-500">Summary of all submissions</p>
      </div>

      <div className="flex-grow min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={progressData}
            margin={{
              top: 10,
              right: 20,
              left: -10, // Adjusted to prevent Y-axis labels from being cut off
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
              domain={[0, yAxisMax]} // Use the dynamic max value for the Y-axis
            />
            <Tooltip
              cursor={{ fill: 'rgba(239, 246, 255, 0.7)' }}
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
              radius={[4, 4, 0, 0]}
              barSize={50} // Using a fixed bar size for a cleaner look
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}