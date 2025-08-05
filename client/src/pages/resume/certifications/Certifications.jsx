import React, { useEffect, useState } from 'react';
import { ShieldCheck } from "lucide-react";
import linkedin_icon from "../../../assets/linkedin.png";
import useAuth from '../../../store/UseAuth';

export default function Certifications() {
  // const certificationsData = [
  //   {
  //     title: "Certified JavaScript Developer",
  //     link: "https://www.example.com/certificate1",
  //   },
  //   {
  //     title: "Full Stack Web Development",
  //     link: "https://www.example.com/certificate2",
  //   },
  //   {
  //     title: "AIML from IIT Madras",
  //     link: "https://www.example.com/certificate3",
  //   },
  //   {
  //     title: "Data Science and Machine Learning",
  //     link: "https://www.example.com/certificate4",
  //   },
  //   {
  //     title: "Data Science and Machine Learning",
  //     link: "https://www.example.com/certificate4",
  //   },
  // ];

  var [certificationsData,setCertificationsData] = useState([])
  var {rollno} = useAuth();

  useEffect(() => {
    if(!rollno){
      console.log("Could not fetch the rollno");
      return
    }
    fetch(`http://localhost:6001/api/resume/getcertificates/${rollno}`)
    .then(res => {
      if(!res.ok){
        throw new Error("Network response is not ok");
      }
      return res.json();
    })
    .then((data) => {
      setCertificationsData(data)
    })
    .catch((err) => {
      console.log("Error fetching certification data",err);
    });
  },[rollno]);

  return (
    <div className="p-2 lg:ml-2 bg-white shadow rounded-lg h-[30vh] flex flex-col">
    <div className="flex items-center text-gray-800 font-medium flex-shrink-0">
      <ShieldCheck className="text-[#7371ff]" />
      <span className="ml-1">Professional Certification</span>
    </div>
  
    <div className="mt-2 overflow-y-auto space-y-3 pr-1 flex-1">
      {certificationsData.map((certification, index) => (
        <div key={index} className="mb-2 p-2">
          <div className="flex items-start ">
            <div className="w-6 h-6 border  flex items-center justify-center border-[#9b9aff] rounded-full">
              <img src={linkedin_icon} className="w-4 h-4 rounded" alt="icon" />
            </div>
            <a
              // href={certification.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#01009E] text-[14px] font-semibold ml-2 hover:underline"
            >
              {certification.title}
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
  
  );
}