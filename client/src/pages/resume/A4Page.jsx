import React from "react";

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export default function A4Page({ children, className }) {
  // Check if className contains height override
  const hasHeightOverride =
    className?.includes("h-auto") || className?.includes("min-h-0");

  return (
    <div
      className={`a4-page bg-white shadow-lg p-[1.5cm] mb-5 ${className || ""}`}
      style={{
        width: `${A4_WIDTH_PX}px`,
        minHeight: hasHeightOverride ? "auto" : `${A4_HEIGHT_PX}px`,
        height: hasHeightOverride ? "auto" : `${A4_HEIGHT_PX}px`,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}
