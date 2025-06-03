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

const MentorMenteesGraph = () => {
  const [mentorSkillData, setMentorSkillData] = useState([]);
  const [instituteAverageData, setInstituteAverageData] = useState([]);
  const [processedChartData, setProcessedChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {fetchUser,rollno}=useAuth();
  useEffect(() => {
    fetchUser();
  }, []);
  const API_URL = import.meta.env.VITE_API_URL;
  const fetchMentorDetails = async (currentRollno) => {
    try {
      const res = await fetch(`${API_URL}api/mentor/details/${currentRollno}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
      });
      if (!res.ok) {
        throw new Error(`HTTP Error (Mentor Details): ${res.status}`);
      }
      const data = await res.json();
      console.log("Mentor Details:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Fetch mentor details error:", error);
      return [];
    }
  };

  const fetchInstituteAverage = async () => {
    try {
      const res = await fetch(
        `${API_URL}api/mentor/institute_avg/fetchData`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP Error (Institute Avg): ${res.status}`);
      }
      const data = await res.json();
      console.log("Institute Average Data:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Fetch institute average error:", error);
      return [];
    }
  };
  // Effect to fetch data on component mount or when rollno changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [mentorRes, avgRes] = await Promise.all([
          fetchMentorDetails(rollno),
          fetchInstituteAverage(),
        ]);
        setMentorSkillData(mentorRes);
        setInstituteAverageData(avgRes);
      } catch (error) {
        setMentorSkillData([]); // Ensure state is reset on top-level error too
        setInstituteAverageData([]);
      }
      setIsLoading(false);
    };
    loadData();
  }, [rollno]);
  useEffect(() => {
    if (mentorSkillData.length > 0 && instituteAverageData.length > 0) {
      const instituteAvgMap = new Map(
        instituteAverageData.map((item) => [
          item.skill_name,
          item.avg_mentees_per_mentor,
        ])
      );
      const combinedData = mentorSkillData.map((mentorSkill) => ({
        skill: mentorSkill.skill_name,
        Mentees: mentorSkill.mentee_count,
        ArvgMentees: instituteAvgMap.get(mentorSkill.skill_name) || 0, // Use 0 if no institute avg for this skill
      }));
      setProcessedChartData(combinedData);
    } else if (
      mentorSkillData.length > 0 &&
      instituteAverageData.length === 0
    ) {
      const combinedData = mentorSkillData.map((mentorSkill) => ({
        skill: mentorSkill.skill_name,
        Mentees: mentorSkill.mentee_count,
        ArvgMentees: 0, // Default average to 0
      }));
      setProcessedChartData(combinedData);
    } else {
      setProcessedChartData(null); // No data or only one dataset loaded
    }
  }, [mentorSkillData, instituteAverageData]); // Re-process if source data changes

  const chartConfig = useMemo(() => {
    if (!processedChartData || processedChartData.length === 0) {
      return {
        data: { labels: [], datasets: [] },
        options: { maintainAspectRatio: false, responsive: true }, // Basic options for empty chart
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
            autoSkip: false, // Consider `true` if many skills
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

  // async function testSubmission() { // For testing API calls
  //   setIsLoading(true);
  //   await fetchInstituteAverage();
  //   await fetchMentorDetails(rollno);
  //   setIsLoading(false);
  // }

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
          <h1 onClick={()=>{fetchInstituteAverage();fetchMentorDetails();}} className="text-[20px] font-[500] text-gray-800">
            Mentorship Status
          </h1>
        </Box>
        <div className="flex justify-center items-center flex-grow text-gray-500">
          No mentorship data to display for {rollno}.
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
        {/* <button onClick={testSubmission}>Fetch Test</button> */}
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
        {" "}
        {/* Adjust height as needed */}
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
