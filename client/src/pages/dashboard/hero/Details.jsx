import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import MilitaryTechOutlinedIcon from "@mui/icons-material/MilitaryTechOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import Box from "@mui/material/Box";
import useAuth from "../../../store/UseAuth";

export default function Details() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { fetchUser, rollno } = useAuth();
  useEffect(() => {
    fetchUser();
  }, []);
  const [rank, setRank] = useState("Not Available");
  const [rewardPoints, setRewardPoints] = useState(0);
  const [achievementPoints, setAchievementPoints] = useState(0.0);
  const [creditDays, setCreditDays] = useState(0);
  const [penaltyDays, setPenaltyDays] = useState(0);
  const handleDetails = async () => {
    try {
      const response = await fetch(
        `${API_URL}api/fetch/header_details/${rollno}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      setRank(data.current_rank);
      setAchievementPoints(data.total_points);
      setCreditDays(data.positive_points_count);
      setPenaltyDays(data.penalty_count);
      if (response.ok) {
        // console.log("Details fetched successfully:", data);
      } else {
        console.error("Error fetching details:", data);
      }
    } catch (error) {
      console.error("Error  fetching details:", error);
    }
  };
  useEffect(() => {
    handleDetails();
  }, []);
  const statCards = [
    {
      title: "Rank",
      value: rank,
      icon: <LeaderboardOutlinedIcon />,
      color: "#0057FF",
    },
    {
      title: "Reward Points",
      value: rewardPoints,
      icon: <EmojiEventsOutlinedIcon />,
      color: "#fed402",
    },
    {
      title: "Achievement Points",
      value: achievementPoints,
      icon: <MilitaryTechOutlinedIcon />,
      color: "#FF8A00",
    },
    {
      title: "Credit Days",
      value: creditDays,
      icon: <ThumbUpAltOutlinedIcon />,
      color: "#4CAF50",
    },
    {
      title: "Penalty Days",
      value: penaltyDays,
      icon: <ThumbDownOffAltOutlinedIcon />,
      color: "#F44336",
    },
  ];
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {statCards.map((card, index) => (
          <div
            key={index}
            onClick={handleDetails}
            className="p-4 h-17 bg-white rounded-xl shadow hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="flex flex-col justify-center h-full">
              <p className="mb-1 text-gray-600 text-xs sm:text-sm font-medium">
                {card.title}
              </p>

              <div className="flex items-center">
                <div
                  className="mr-2 flex items-center justify-center"
                  style={{ color: card.color }}
                >
                  {card.icon}
                </div>

                <h3
                  className="font-semibold text-lg sm:text-xl"
                  style={{ color: card.color }}
                >
                  {card.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
