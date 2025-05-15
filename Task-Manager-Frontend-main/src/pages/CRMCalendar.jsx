import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";

export default function CRMCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Client Meeting",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      type: "meeting",
      status: "confirmed",
    },
    {
      id: 2,
      title: "Project Deadline",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
      type: "deadline",
      status: "pending",
    },
    {
      id: 3,
      title: "Team Review",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      type: "internal",
      status: "confirmed",
    },
  ]);
  const [newEventModal, setNewEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "meeting",
    status: "pending",
  });
  const [view, setView] = useState("month"); // "month", "week", "day"

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const renderCalendarDays = () => {
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const days = [];

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 border border-gray-200 bg-gray-50"
        ></div>
      );
    }

    // Add cells for days in month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected =
        selectedDate && selectedDate.toDateString() === date.toDateString();

      // Get events for this day
      const dayEvents = events.filter(
        (event) =>
          event.date.getDate() === day &&
          event.date.getMonth() === currentDate.getMonth() &&
          event.date.getFullYear() === currentDate.getFullYear()
      );

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 ${
            isToday ? "bg-blue-50" : ""
          } ${isSelected ? "ring-2 ring-blue-500" : ""} relative`}
          onClick={() => {
            setSelectedDate(date);
            setNewEvent((prev) => ({ ...prev, date: date }));
          }}
        >
          <div className="p-1 flex justify-between">
            <span
              className={`text-sm ${isToday ? "font-bold text-blue-600" : ""}`}
            >
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="text-xs bg-gray-200 rounded-full px-2">
                {dayEvents.length}
              </span>
            )}
          </div>
          <div className="px-1 overflow-y-auto max-h-16">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 mb-1 rounded truncate ${
                  event.type === "meeting"
                    ? "bg-blue-100 text-blue-800"
                    : event.type === "deadline"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                } ${
                  event.status === "confirmed"
                    ? "border-l-2 border-blue-500"
                    : "border-l-2 border-yellow-500"
                }`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const addNewEvent = () => {
    if (newEvent.title && selectedDate) {
      const eventDate = new Date(selectedDate);
      setEvents([
        ...events,
        {
          id: events.length + 1,
          title: newEvent.title,
          date: eventDate,
          type: newEvent.type,
          status: newEvent.status,
        },
      ]);
      setNewEventModal(false);
      setNewEvent({ title: "", type: "meeting", status: "pending" });
    }
  };

  const renderWeekView = () => {
    // This is a simplified week view
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    return (
      <div className="grid grid-cols-7 gap-2 mt-4">
        {Array.from({ length: 7 }).map((_, index) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + index);
          const dayEvents = events.filter(
            (event) =>
              event.date.getDate() === date.getDate() &&
              event.date.getMonth() === date.getMonth() &&
              event.date.getFullYear() === date.getFullYear()
          );

          return (
            <div key={index} className="border border-gray-200 rounded p-2">
              <div className="text-center font-medium mb-2">
                {dayNames[index]}
                <div className="text-sm text-gray-500">{date.getDate()}</div>
              </div>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className={`text-xs p-2 mb-1 rounded ${
                    event.type === "meeting"
                      ? "bg-blue-100 text-blue-800"
                      : event.type === "deadline"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const hoursOfDay = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM
    const dayEvents = events.filter(
      (event) =>
        event.date.getDate() === currentDate.getDate() &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear()
    );

    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">
          {monthNames[currentDate.getMonth()]} {currentDate.getDate()},{" "}
          {currentDate.getFullYear()}
        </h3>
        <div className="border rounded divide-y">
          {hoursOfDay.map((hour) => (
            <div key={hour} className="p-2 grid grid-cols-12">
              <div className="col-span-2 text-right pr-2 text-sm text-gray-500">
                {hour % 12 || 12} {hour >= 12 ? "PM" : "AM"}
              </div>
              <div className="col-span-10 min-h-12 relative">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`absolute w-4/5 left-2 p-2 rounded text-sm ${
                      event.type === "meeting"
                        ? "bg-blue-100 text-blue-800"
                        : event.type === "deadline"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                    style={{ top: "10%" }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">CRM Calendar</h2>

          <div className="flex items-center space-x-4">
            <div className="flex border rounded overflow-hidden">
              <button
                className={`px-4 py-2 ${
                  view === "month"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => setView("month")}
              >
                Month
              </button>
              <button
                className={`px-4 py-2 ${
                  view === "week"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => setView("week")}
              >
                Week
              </button>
              <button
                className={`px-4 py-2 ${
                  view === "day"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => setView("day")}
              >
                Day
              </button>
            </div>

            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                if (selectedDate) {
                  setNewEventModal(true);
                } else {
                  setSelectedDate(new Date());
                  setNewEventModal(true);
                }
              }}
            >
              <Plus size={18} className="mr-1" /> Add Event
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <button className="p-2 rounded hover:bg-gray-100" onClick={prevMonth}>
            <ChevronLeft size={20} />
          </button>

          <h3 className="text-xl font-medium flex items-center">
            <CalendarIcon size={20} className="mr-2" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>

          <button className="p-2 rounded hover:bg-gray-100" onClick={nextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Filters and Legend */}
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-xs">Meetings</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span className="text-xs">Deadlines</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs">Internal</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="flex items-center">
              <div className="w-3 h-3 border-l-2 border-blue-500 mr-1"></div>
              <span className="text-xs">Confirmed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 border-l-2 border-yellow-500 mr-1"></div>
              <span className="text-xs">Pending</span>
            </div>
          </div>
        </div>

        {view === "month" && (
          <>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-px mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-sm font-medium text-center py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px">
              {renderCalendarDays()}
            </div>
          </>
        )}

        {view === "week" && renderWeekView()}

        {view === "day" && renderDayView()}

        {/* New Event Modal */}
        {newEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-lg font-bold mb-4">Add New Event</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="Enter event title..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Event Type
                </label>
                <select
                  className="w-full p-2 border rounded bg-white"
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, type: e.target.value })
                  }
                >
                  <option value="meeting">Client Meeting</option>
                  <option value="deadline">Project Deadline</option>
                  <option value="internal">Internal</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded bg-white"
                  value={newEvent.status}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Date:{" "}
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "No date selected"}
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                  onClick={() => setNewEventModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={addNewEvent}
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
