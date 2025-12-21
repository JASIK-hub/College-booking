import React, { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (description: string, startTime: Date, endTime: Date) => void;
  startTime: Date;
  endTime: Date;
  location: string;
  error: any;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  startTime: initialStartTime,
  endTime: initialEndTime,
  location,
  error,
}) => {
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(format(initialStartTime, "HH:mm"));
  const [endTime, setEndTime] = useState(format(initialEndTime, "HH:mm"));

  if (!isOpen) return null;

  // ✅ Преобразуем выбранное время в локальное (КЗ) для отправки
  const convertToKZTime = (date: Date, timeString: string): Date => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
  };

  const handleSubmit = () => {
    const newStartTimeKZ = convertToKZTime(initialStartTime, startTime);
    const newEndTimeKZ = convertToKZTime(initialEndTime, endTime);

    console.log("Local start time:", startTime);
    console.log("KZ start time (to send):", newStartTimeKZ.toISOString());
    console.log("Local end time:", endTime);
    console.log("KZ end time (to send):", newEndTimeKZ.toISOString());

    onConfirm(description, newStartTimeKZ, newEndTimeKZ);
    setDescription("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Создать бронирование
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Место</p>
            <p className="text-lg font-semibold text-gray-900">{location}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Дата и время</p>
            <p className="text-lg font-semibold text-gray-900 mb-3">
              {format(initialStartTime, "dd MMMM yyyy", { locale: ru })}
            </p>

            <div className="flex items-center gap-3">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 
                  outline-none transition text-base"
              />
              <span className="text-gray-500">-</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 
                  outline-none transition text-base"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2">
            <span className="text-sm font-medium text-gray-700">
              Описание
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите описание события..."
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 
                outline-none transition resize-none"
              rows={3}
              required
            />
          </label>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 
                text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 
                text-white font-medium hover:bg-indigo-700 transition cursor-pointer"
            >
              Создать
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-3 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};
