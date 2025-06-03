import React from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import "../../../../index.css"; // Ensure this path is correct relative to SkillCard.js

// Added onMouseEnter and onMouseLeave to props
const SkillCard = ({ skillName, completed, totalLevels, onMouseEnter, onMouseLeave }) => {
  const value = (completed / totalLevels) * 100;
  const startAngle = -130;
  const endAngle = 130;

  const getDotPosition = (value) => {
    const angle = startAngle + (endAngle - startAngle) * (value / 100);
    const radian = ((angle - 90) * Math.PI) / 180;

    const radius = 27;
    const centerX = 42.5;
    const centerY = 30;

    let xOffset = 0;
    let yOffset = 0;
    
    if (value <= 30) {
      xOffset = 5;
      yOffset = 5;
    } else if (value > 30 && value <= 85) {
      xOffset = -2;
      yOffset = 10;
    } else if (value > 85 && value <= 99) {
      xOffset = -5;
      yOffset = 5;
    } else {
      xOffset = -3;
      yOffset = 0;
    }

    return {
      x: centerX + radius * Math.cos(radian) + xOffset,
      y: centerY + radius * Math.sin(radian) + yOffset,
    };
  };

  const dotPosition = getDotPosition(value);

  return (
        <div
          className="bg-white rounded-3xl border-2 border-gray-100 flex flex-col items-center p-1 w-[95px]"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >

      <div className="relative w-[85px] h-[60px]"> {/* Gauge container */}
        <Gauge
          value={value}
          min={0}
          max={100}
          startAngle={startAngle}
          endAngle={endAngle}
          text={`${completed}/${totalLevels}`}
          cornerRadius="50%"
          sx={{
            [`& .${gaugeClasses.valueArc}`]: {
              fill: "var(--color-primary)",
            },
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: "1.0rem",
              fontWeight: "bold",
              fontFamily: "DM Sans, sans-serif",
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: "#B9C0FF",
            },
          }}
        />

        {value > 0 && (
          <div
            className="absolute w-3 h-3 bg-primary border-[3px] border-white rounded-full shadow-md"
            style={{
              left: `${dotPosition.x}px`,
              top: `${dotPosition.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>
      
      <div className="text-center flex items-center  justify-center flex-grow"> 
        <p 
          className="text-[#000] w-20 text-[15px] leading-tight break-words line-clamp-2" 
          title={skillName} 
        >
          {skillName}
        </p>
      </div>
    </div>
  );
};

export default SkillCard;