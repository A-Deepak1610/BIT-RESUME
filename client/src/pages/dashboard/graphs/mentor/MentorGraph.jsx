import React, { useState, useEffect, useMemo } from "react";
import { Box, Stack } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "../../../../index.css";
import useAuth from "../../../../store/UseAuth";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center">
    <div
      className="w-3 h-3 rounded-full mr-2"
      style={{ backgroundColor: color }}
    />
    <span className="text-sm text-gray-600">{label}</span>
  </div>
);

const MentorMenteesGraph = (props) => {
  // --- CHANGE 1: REMOVED `instituteAverageData` state. We only need one state for the source data.
  const [mentorshipData, setMentorshipData] = useState([]);
  const [processedChartData, setProcessedChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchUser, rollno } = useAuth();
  const student_rollno = props.rollno || '-';

  useEffect(() => {
    fetchUser();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL;

  // --- CHANGE 2: Simplified the fetch logic. We only need one function now.
  const fetchMentorshipData = async () => {
    try {
      const res = await fetch(`${API_URL}api/ps/metorships/${student_rollno}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      const data = await res.json();
      console.log("API Response Data:", data);

      // IMPORTANT: Extract the array from the 'mentorships' key.
      if (data && Array.isArray(data.mentorships)) {
        setMentorshipData(data.mentorships);
      } else {
        console.error("API response is not in the expected format.", data);
        setMentorshipData([]);
      }
    } catch (error) {
      console.error("Failed to fetch mentorship data:", error);
      setMentorshipData([]); // Reset on error
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch data on component mount or when rollno changes
  useEffect(() => {
    if (student_rollno) {
      setIsLoading(true);
      fetchMentorshipData();
    }
  }, [student_rollno]);

  // --- CHANGE 3: Simplified the data processing logic. No more merging needed.
  useEffect(() => {
    if (mentorshipData && mentorshipData.length > 0) {
      // Directly map the single data source to the format the chart needs.
      const combinedData = mentorshipData.map((item) => ({
        skill: item.skill_name,
        Mentees: item.mentee_count,
        ArvgMentees: item.institute_avg, // Use `institute_avg` directly from the data
      }));
      setProcessedChartData(combinedData);
    } else {
      setProcessedChartData(null); // Reset if there's no data
    }
  }, [mentorshipData]); // This effect now only depends on `mentorshipData`

  // The rest of your component (chartConfig, JSX) remains largely the same.
  // It will now work correctly with the simplified data flow.

  const chartConfig = useMemo(() => {
    if (!processedChartData || processedChartData.length === 0) {
      return {
        data: { labels: [], datasets: [] },
        options: { maintainAspectRatio: false, responsive: true },
      };
    }

    const data = {
      labels: processedChartData.map((d) => d.skill),
      datasets: [
        {
          label: "Mentees",
          data: processedChartData.map((d) => d.Mentees),
          backgroundColor: "#0200e1",
          barPercentage: 1,
          borderRadius: 20,
          barThickness: 10,
        },
        {
          label: "Average Mentees",
          data: processedChartData.map((d) => d.ArvgMentees),
          backgroundColor: "#9b9aff",
          barPercentage: 1,
          borderRadius: 20,
          barThickness: 10,
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "white",
          titleColor: "#333",
          bodyColor: "#333",
          borderColor: "#ddd",
          borderWidth: 1,
          padding: 10,
          boxPadding: 6,
          cornerRadius: 8,
          titleFont: { weight: "bold", size: 14 },
          bodyFont: { size: 13 },
          displayColors: true,
          mode: "index",
          intersect: false,
          callbacks: {
            title: (tooltipItems) => tooltipItems[0].label,
            label: (context) =>
              `${context.dataset.label}: ${context.parsed.y || 0}`,
          },
        },
      },
      scales: {
        x: {
          stacked: false,
          grid: { display: false },
          ticks: {
            minRotation: 0,
            maxRotation: 0,
            autoSkip: false,
            font: (context) => {
              const width = context.chart.width;
              return {
                size: width < 400 ? 9 : width < 600 ? 10 : 12,
              };
            },
            callback: function (val, index, ticks) {
              const label = this.getLabelForValue(val);
              return label.length > 10 && processedChartData.length > 5
                ? label.slice(0, 8) + "…"
                : label;
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: { color: "#F1F4F9" },
          suggestedMax:
            Math.max(
              10,
              ...processedChartData.map((d) =>
                Math.max(d.Mentees, d.ArvgMentees)
              )
            ) * 1.2,
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
    };
    return { data, options };
  }, [processedChartData]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading mentorship data...
      </div>
    );
  }

  if (!processedChartData || processedChartData.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          mb={2}
        >
          <h1 className="text-[20px] font-[500] text-gray-800">
            Mentorship Status
          </h1>
        </Box>
        <div className="flex justify-center items-center flex-grow text-gray-500">
          No mentorship data to display for {student_rollno}.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        mb={2}
      >
        <h1 className="text-[20px] font-[500] text-gray-800">
          Mentorship Status
        </h1>
        <div className="hidden md:flex">
          <Stack direction="row" spacing={2}>
            <LegendItem color="#0200e1" label="Mentees" />
            <LegendItem color="#9b9aff" label="Average Mentees" />
          </Stack>
        </div>
      </Box>

      <div
        className="flex-grow relative"
        style={{ height: "calc(100% - 70px)" }}
      >
        <Bar
          data={chartConfig.data}
          options={chartConfig.options}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
      </div>

      <div className="flex w-full justify-center mt-2 md:hidden">
        <Stack direction="row" spacing={1}>
          <LegendItem color="#0200e1" label="Mentees" />
          <LegendItem color="#9b9aff" label="Avg. Mentees" />
        </Stack>
      </div>
    </div>
  );
};

export default MentorMenteesGraph;