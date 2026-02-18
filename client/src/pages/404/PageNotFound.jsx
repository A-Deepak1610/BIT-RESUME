import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-semibold mb-4">404 | Page Not Found...||..</h1>
    
    </div>
  );
}
