
import React from 'react';
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export default function A4Page({ children }) {
  return (
    <div
      className="bg-white shadow-lg my-5 p-[2cm]" 
      style={{
        width: `${A4_WIDTH_PX}px`,
        minHeight: `${A4_HEIGHT_PX}px`,
      }}
    >
      {children}
    </div>
  );
}