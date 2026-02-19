import React, { useState, useMemo, useEffect } from "react";
import { Search, PlusCircle, AlertTriangle, Loader2 } from "lucide-react";
import AddActivityModal from "./AddActivityModal";
import MasterCard1 from "./masterCard1";
import EventDetailModal1 from "./EventDetailModl1";
export default function AddActivity() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Event data
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API constants
  const API_BASE = `${import.meta.env.VITE_API_URL}api/activitymaster`;
  const FETCH_URL = `${API_BASE}/fetch`;
  const limit = 100;
  const offset = 0;

  // Fetch activities
  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${FETCH_URL}?limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Network response was not ok");
      }

      const data = await response.json();
      setActivities(data.events || []);
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtered list
  const filteredActivities = useMemo(() => {
    if (!activities) return [];
    if (!searchTerm) return activities;
    const term = searchTerm.toLowerCase();
    return activities.filter((activity) => {
      return (
        (activity.event_name && activity.event_name.toLowerCase().includes(term)) ||
        (activity.description && activity.description.toLowerCase().includes(term)) ||
        (activity.domains && activity.domains.toLowerCase().includes(term)) ||
        (activity.type && activity.type.toLowerCase().includes(term))
      );
    });
  }, [searchTerm, activities]);

  // Modal handlers
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Card click -> open detail modal
  const handleCardClick = (activity) => {
    setSelectedActivity(activity);
    setIsDetailOpen(true);
  };
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedActivity(null);
  };

  // Delete event (faculty)
  const handleDelete = async (activityOrId) => {
    const id = typeof activityOrId === "object" ? activityOrId?.id : activityOrId;
    if (!id) return;
    const ok = window.confirm("Are you sure you want to delete this event?");
    console.log(`Deleting event with ID: ${id}`);   
    if (!ok) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/deleteevents/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete event");
      }
      await fetchActivities();
      if (selectedActivity?.id === id) {
        handleCloseDetail();
      }
    } catch (e) {
      console.error(e);
      alert(e.message || "Error deleting event");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-slate-100 min-h-screen">
      {/* Search + Add */}
      <div className="mb-6 sm:mb-8 p-4 bg-white rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-500 shadow-sm"
              placeholder="Search by event name, domain, type, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleOpenModal}
            className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-150 ease-in-out cursor-pointer"
          >
            <PlusCircle size={18} />
            <span>Add New Event</span>
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="ml-3 text-gray-600">Loading Events...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="col-span-full text-center py-10 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow p-6">
          <AlertTriangle size={40} className="mx-auto mb-3" />
          <p className="text-lg font-medium">Error loading events.</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <>
          {filteredActivities.length > 0 ? (
            <MasterCard1
              data={filteredActivities}
              onCardClick={handleCardClick}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center py-10 bg-white rounded-xl shadow">
              <Search size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 text-lg font-medium">No Events Found</p>
              {searchTerm ? (
                <p className="text-gray-500 text-sm">Try adjusting your search term.</p>
              ) : (
                <p className="text-gray-500 text-sm">Click 'Add New Event' to get started.</p>
              )}
            </div>
          )}
        </>
      )}

      {/* Add Event Modal */}
      <AddActivityModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        onActivityCreated={fetchActivities}
      />

      {/* Faculty Detail Modal (no Apply button) */}
      <EventDetailModal1
        isOpen={isDetailOpen}
        eventData={selectedActivity}
        onClose={handleCloseDetail}
        onDelete={handleDelete}
      />
    </div>
  );
}