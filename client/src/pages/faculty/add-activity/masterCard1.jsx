import React from "react";
import master from "../../../assets/ActivityMaster/master.jpg";
import { MapPin, Trophy, Users, Trash2 } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const MasterCard1 = ({ data, onCardClick, onDelete }) => {
  if (!data || data.length === 0) {
    return (
      <p className="col-span-full text-center text-gray-500 py-10">
        No events found matching your criteria.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {data.map((item) => {
        const imageUrl = item.image_url ? `${BACKEND_URL}${item.image_url}` : master;

        return (
          <div
            key={item.id}
            className="relative bg-white shadow-xl rounded-xl overflow-hidden flex flex-col transition-transform hover:scale-105 duration-300 ease-in-out cursor-pointer"
            onClick={() => onCardClick?.(item)}
          >


            <img
              src={imageUrl}
              alt={item.event_name || "Event"}
              className="w-full h-[150px] object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = master;
              }}
            />

            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-sm text-gray-500 font-medium">{item.deadline}</span>
                {item.type && (
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full
                      ${
                        item.type.toLowerCase() === "online"
                          ? "text-indigo-700 bg-indigo-100 border border-indigo-200"
                          : "text-green-700 bg-green-100 border border-green-200"
                      }`}
                  >
                    {item.type}
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-gray-800 mb-3.5 leading-tight">
                {item.event_name}
              </h2>

              <div className="mt-auto space-y-2 text-sm">
                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-600">{item.location || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Trophy size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-600">
                    Prize: {item.final_prize1 || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-600">
                    Team Size : {item.min_team_size} - {item.max_team_size}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MasterCard1;