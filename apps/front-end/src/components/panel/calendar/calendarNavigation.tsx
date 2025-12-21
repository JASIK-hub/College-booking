import React from "react";
import type { View } from "react-big-calendar";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

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
    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 border border-blue-100 shadow-sm">
      {/* Верхняя часть - Кнопки навигации и заголовок */}
      <div className="flex justify-between items-center mb-6">
        {/* Кнопки навигации */}
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="p-2.5 rounded-lg bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md group"
            title="Предыдущий период"
          >
            <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            onClick={goNext}
            className="p-2.5 rounded-lg bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md group"
            title="Следующий период"
          >
            <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
          </button>

          <div className="w-px h-6 bg-blue-200 mx-1"></div>

          <button
            onClick={goToToday}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 group"
          >
            <Calendar size={16} className="group-hover:rotate-12 transition-transform" />
            <span>Сегодня</span>
          </button>
        </div>

        {/* Заголовок */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {headerTitle}
        </h2>

        {/* Выбор вида */}
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-blue-200 shadow-sm">
          {(['day', 'week', 'month'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md font-medium text-sm transition-all duration-200 ${
                view === v
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {v === 'day' ? 'День' : v === 'week' ? 'Неделя' : 'Месяц'}
            </button>
          ))}
        </div>
      </div>

      {/* Нижняя часть - Выбор места */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Место:</label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg bg-white border-2 border-blue-200 text-gray-700 font-medium focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200 shadow-sm hover:border-blue-300 cursor-pointer appearance-none bg-no-repeat bg-right pr-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234f46e5' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 1rem center',
          }}
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Индикатор выбранного места */}
        <div className="px-3 py-2.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
            {selectedLocation}
          </span>
        </div>
      </div>
    </div>
  );
};