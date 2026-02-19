import React, { useEffect, useState } from "react";
import googleicon from "../../assets/googleicon.png";
import logo from "../../assets/logo.png";
import useAuth from "../../store/UseAuth";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const API_URL = import.meta.env.VITE_API_URL
  const { fetchUser } = useAuth();
  const handleGoogleLogin = () => {
    const width = 500;
    const height = 550;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const loginWindow = window.open(
      `${API_URL}api/auth/google/login`,
      "GoogleLogin",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (!loginWindow) {
      alert("Popup blocked!");
      return;
    }

    const interval = setInterval(async () => {
      if (loginWindow.closed) {
        clearInterval(interval);
        console.log("Login popup closed. Refetching user...");
        await fetchUser(); // Fetch user again
      }
    }, 500);

    return () => clearInterval(interval);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600">BIT RESUME</h1>
            <p className="text-gray-600 mt-2">
              Your professional resume builder
            </p>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
          </div>
          <div className="flex justify-center mb-8">
            <div className=" p-4 rounded-lg">
              <img src={logo} alt="BIT Resume Logo" className="w-14 h-14" />
            </div>
          </div>
          <button
            onClick={handleGoogleLogin}
            className="flex gap-2 outline-blue-600 cursor-pointer items-center justify-center w-full py-3 px-4 rounded-md border border-gray-300 bg-white text-gray-800 font-medium hover:bg-gray-50 transition duration-150 mb-6"
          >
            <img src={googleicon} className="w-5 h-5 rounded-full" alt="" />
            Login with Google
          </button>
          <p className="text-center text-gray-500 text-sm">
            Login in with bitsathy mail id.
          </p>
        </div>
      </div>
    </div>
  );
}
