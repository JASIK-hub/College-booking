import React from "react";
import type { View } from "react-big-calendar";

interface CalendarNavigationProps {
  goPrev: () => void;
  goNext: () => void;
  goToToday: () => void;
  view: View;
  setView: (v: View) => void;
  headerTitle: string;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  locations: string[];
}

export const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  goPrev,
  goNext,
  goToToday,
  view,
  setView,
  headerTitle,
  selectedLocation,
  setSelectedLocation,
  locations,
}) => {
  return (
    <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-gradient-to-r from-blue-200 to-purple-200">
      <div className="flex items-center gap-3">
        <button
          onClick={goPrev}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold"
        >
          ←
        </button>
        <button
          onClick={goNext}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold"
        >
          →
        </button>
        <button
          onClick={goToToday}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold"
        >
          Сегодня
        </button>
      </div>

      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {headerTitle}
      </h2>
      <select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        className="border-2 border-indigo-200 rounded-xl px-4 py-2 bg-white/50 backdrop-blur-sm"
      >
        {locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
      <select
        className="border-2 border-indigo-200 rounded-xl px-4 py-2 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300 font-medium text-gray-700"
        value={view}
        onChange={(e) => setView(e.target.value as View)}
      >
        <option value="day">День</option>
        <option value="week">Неделя</option>
        <option value="month">Месяц</option>
      </select>
    </div>
  );
};
