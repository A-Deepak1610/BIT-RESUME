import React from "react";
import { Award,Medal  } from "lucide-react";
import himg1 from "../../../../public/himg1.jpg";
export default function Hackathons() {
  const hackathonsData = [
    {
      title: "Innovators' Arena ",
      imgpath:"../../../../public/himg1.jpg",
      link: "https://example.com/hackathon1",
    },
    {
      title: "Hack the Future ",
      imgpath:"../../../../public/himg2.jpg",
      link: "https://example.com/hackathon2",
    },
    {
      title: "Code for Change ",
      imgpath:"../../../../public/himg3.jpg",
      link: "https://example.com/hackathon3",
    },
    {
      title: "NextGen Hack",
      imgpath:"../../../../public/himg4.jpg",
      link: "https://example.com/hackathon4",
    },
    {
      title: "NextGen Hack",
      imgpath:"../../../../public/himg4.jpg",
      link: "https://example.com/hackathon4",
    },
  ];
  return (
    <div>
  <div className="p-2 lg:ml-2 bg-white shadow rounded-lg h-[30vh] flex flex-col">
    <div className="flex items-center text-gray-800 font-medium flex-shrink-0">
      <Award className="text-[#7371ff]" />
      <span className="ml-1">Hackathon Wins</span>
    </div>

    {/* Scrollable List Container */}
    <div className="mt-2 space-y-3 pr-1 overflow-y-auto" style={{ maxHeight: '22vh' }}>
      {hackathonsData.map((hackathon, index) => (
        <div key={index} className="mb-2 p-2">
          <div className="flex items-start">
            <div className="rounded-full">
              <img
                src={hackathon.imgpath}
                className="w-6 h-6 rounded-full"
                alt="icon"
              />
            </div>
            <a
              href={hackathon.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#01009E] text-[14px] font-semibold ml-2 hover:underline"
            >
              {hackathon.title}
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

  );
}
