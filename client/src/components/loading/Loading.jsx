import React from 'react';
import useAuth from '../../store/UseAuth';
const LoadingBar = () => {
  const { loading } = useAuth();  
  if (!loading) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50 overflow-hidden">
      <div 
        className="absolute h-full w-full bg-gradient-to-r from-transparent via-blue-600 to-transparent"
        style={{
          animation: 'loadingSlide 1.5s infinite linear',
        }}
      />
    </div>
  );
};

export default LoadingBar;