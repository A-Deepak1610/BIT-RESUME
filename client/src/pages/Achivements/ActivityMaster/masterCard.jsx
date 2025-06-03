// Your existing MasterCard.js
import React from "react";
import master from "../../../assets/ActivityMaster/master.jpg"; // Your image path
import { MapPin, Trophy, Users } from "lucide-react";

const MasterCard = ({ data, onCardClick }) => { // Added onCardClick prop
  if (!data || data.length === 0) {
    return (
      <p className="col-span-full text-center text-gray-500 py-10">
        No events found matching your criteria.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {data.map((item, index) => (
        <div
          key={`${item["Event Name"]}-${index}`}
          className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col transition-transform hover:scale-105 duration-300 ease-in-out cursor-pointer"
          onClick={() => onCardClick(item)} // Call onCardClick with item data
        >
          <img
            src={master} // Assuming 'master' is the correct image variable
            alt={item["Event Name"] || "Event"} // Added alt text
            className="w-full h-[150px] object-cover"
          />

          <div className="p-4 flex flex-col flex-grow">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-sm text-gray-500 font-medium">{item.Date}</span>
              {item.Mode && (
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full
                    ${
                      item.Mode.toLowerCase() === "online"
                        ? "text-indigo-700 bg-indigo-100 border border-indigo-200"
                        : "text-green-700 bg-green-100 border border-green-200"
                    }`}
                >
                  {item.Mode}
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-3.5 leading-tight"> {/* text-lg is fine */}
              {item["Event Name"]}
            </h2>

            <div className="mt-auto space-y-2 text-sm">
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-600">{item.Location}</span> {/* Changed to text-xs */}
              </div>
              <div className="flex items-center gap-2.5">
                <Trophy size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-600"> {/* Changed to text-xs */}
                  Prize Amount : {item["Prize Money"]}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Users size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-600"> {/* Changed to text-xs */}
                  Team Size : {item["Team size"]}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MasterCard;