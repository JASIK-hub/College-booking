// BookingDescriptionModal.tsx
import React, { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import type { Booking } from "../../../hooks/useBookingManager";
import { useApi } from "../../../hooks/useApi";
import { useUser } from "../../../context/user.context";

interface BookingDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onBookingUpdated?: () => void; 
}

export const BookingDescriptionModal: React.FC<BookingDescriptionModalProps> = ({
  isOpen,
  onClose,
  booking,
  onBookingUpdated,
}) => {
  const { callApi, loading } = useApi();
  const { role } = useUser();

  const [isEditMode, setEditMode] = useState(false);
  const [isDeleteMode, setDeleteMode] = useState(false);
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  if (!isOpen || !booking) return null;

  // --- Edit handlers ---
  const handleEditClick = () => {
    setDescription(booking.description || "");
    setStartTime(format(booking.startTime, "HH:mm"));
    setEndTime(format(booking.endTime, "HH:mm"));
    setEditMode(true);
  };

  const handleEditConfirm = async () => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const newStartTime = new Date(booking.startTime);
    newStartTime.setHours(startHour, startMinute, 0, 0);

    const newEndTime = new Date(booking.endTime);
    newEndTime.setHours(endHour, endMinute, 0, 0);

    try {
      await callApi(`/booking/${booking.id}/change`, {
        description,
        startTime: newStartTime,
        endTime: newEndTime,
      }, "PATCH");
      onBookingUpdated?.();
      setEditMode(false);
      onClose();
      window.location.reload()
    } catch (err) {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditConfirm();
    }
  };

  const handleDeleteClick = () => {
    setDeleteMode(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await callApi(`/booking/${booking.id}/delete`, undefined, "DELETE");
      alert("Бронирование удалено");
      onBookingUpdated?.();
      setDeleteMode(false);
      onClose();
      window.location.reload()
    } catch (err) {
      alert("Ошибка при удалении");
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setDeleteMode(false);
  };

  // --- Edit Mode ---
  if (isEditMode) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCancel}>
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Изменить бронирование</h2>

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Место</p>
              <p className="text-lg font-semibold text-gray-900">{booking.location.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Дата и время</p>
              <p className="text-lg font-semibold text-gray-900 mb-3">
                {format(booking.startTime, "dd MMMM yyyy", { locale: ru })}
              </p>
              
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition text-base"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition text-base"
                />
              </div>
            </div>

            <div>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Описание</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Введите описание события..."
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
                  rows={3}
                  required
                />
              </label>
            </div>

            <div>
              <p className="text-sm text-gray-500">Автор бронирования</p>
              <p className="text-lg font-semibold text-gray-900">{booking.author}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleCancel} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition">Отмена</button>
            <button onClick={handleEditConfirm} disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">Сохранить</button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">Нажмите Enter для сохранения</p>
        </div>
      </div>
    );
  }

  // --- Delete Mode ---
  if (isDeleteMode) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCancel}>
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Удалить бронирование</h2>
          <p className="text-gray-700 mb-6">Вы уверены, что хотите удалить бронирование: <strong>{booking.description || "Без описания"}</strong>?</p>

          <div className="flex gap-3">
            <button onClick={handleCancel} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition">Отмена</button>
            <button onClick={handleDeleteConfirm} disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition">Удалить</button>
          </div>
        </div>
      </div>
    );
  }

  // --- View Mode ---
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Детали бронирования</h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Место</p>
            <p className="text-lg font-semibold text-gray-900">{booking.location.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Дата</p>
            <p className="text-lg font-semibold text-gray-900">{format(booking.startTime, "dd MMMM yyyy", { locale: ru })}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Время</p>
            <p className="text-lg font-semibold text-gray-900">{format(booking.startTime, "HH:mm")} - {format(booking.endTime, "HH:mm")}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Описание</p>
            <p className="text-base text-gray-900">{booking.description || "Нет описания"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Автор бронирования</p>
            <p className="text-lg font-semibold text-gray-900">{booking.author}</p>
          </div>
        </div>

        {role === "admin" && (
          <div className="flex gap-4 mt-4">
            <button onClick={handleEditClick} disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition">Изменить</button>
            <button onClick={handleDeleteClick} disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition">Удалить</button>
          </div>
        )}

        <button onClick={onClose} className="mt-6 w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition cursor-pointer">Закрыть</button>
      </div>
    </div>
  );
};
