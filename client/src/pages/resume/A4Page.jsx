import React from 'react';

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export default function A4Page({ children, className }) {
  return (
    <div
      className={`a4-page bg-white shadow-lg p-[2cm] mb-5 ${className || ''}`} 
      style={{
        width: `${A4_WIDTH_PX}px`,
        height: `${A4_HEIGHT_PX}px`, // Use fixed height for consistency
        boxSizing: 'border-box',
        // REMOVED: overflow: 'hidden', // Let's not hide content; the paginator should prevent overflow.
      }}
    >
      {children}
    </div>
  );
}