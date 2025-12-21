import React, { useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import type { SlotInfo } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarNavigation } from "./calendarNavigation";
import { getEventStyle } from "./calendarEvents";
import { useCalendarNavigation } from "../../../hooks/useCalendarNavigation";
import { useBookingManager } from "../../../hooks/useBookingManager";
import type { Booking } from "../../../hooks/useBookingManager";
import { BookingModal } from "./booking.modal";
import { BookingDescriptionModal } from "./bookingDetails";
import { localizer } from "./localizer";
import { CALENDAR_CONFIG } from "../../../config/calendar.config";
import {
  CalendarEvent,
  getCalendarMax,
  getCalendarMin,
} from "../../../util/calendar.util";
import { BookingStatus } from "../../../types/booking-status.type";
import type { CSSProperties } from "react";

export const BookingCalendar: React.FC = () => {
  const { bookings, createBooking, fetchAllBookings } = useBookingManager();

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const [selectedLocation, setSelectedLocation] = useState(
    CALENDAR_CONFIG.locations[0]
  );

  const {
    date,
    view,
    setView,
    setDate,
    goPrev,
    goNext,
    goToToday,
    getHeaderTitle,
  } = useCalendarNavigation("week");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const [pendingBooking, setPendingBooking] = useState<{
    start: Date;
    end: Date;
    location: string;
  } | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setPendingBooking({
      start: slotInfo.start,
      end: slotInfo.end,
      location: selectedLocation,
    });
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: any) => {
    const booking = bookings.find((b) => b.id === event.id);
    if (booking) {
      setSelectedBooking(booking);
      setIsDetailsModalOpen(true);
    }
  };

  const handleConfirmBooking = async (
    description: string,
    startTime: Date,
    endTime: Date
  ) => {
    if (!pendingBooking) return;

    try {
      await createBooking(
        startTime,
        endTime,
        pendingBooking.location,
        description
      );
      setIsModalOpen(false);
      setBookingError(null);
      setPendingBooking(null);
      // ✅ ПЕРЕЗАГРУЖАЕМ БРОНИРОВАНИЯ
      await fetchAllBookings();
    } catch (err: any) {
      if (err?.status === 400 || err?.message) {
        setBookingError("Бронирование запрещено на выбранное время");
      } else {
        setBookingError("Произошла ошибка при бронировании");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPendingBooking(null);
    setBookingError(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedBooking(null);
  };

  const getCalendarEvents = () => {
    return bookings
      .filter((b) => b.location.name === selectedLocation)
      .map((booking) => ({
        id: booking.id,
        title: booking.description || "Бронирование",
        start: new Date(booking.startTime), 
        end: new Date(booking.endTime),     
        resource: booking,
        author:booking.author
      }));
  };

  const calendarEvents = getCalendarEvents();
  const calendarMin = getCalendarMin(date);
  const calendarMax = getCalendarMax(date);

  const getEventStyleWithStatus = (event: any) => {
    const booking = bookings.find((b) => b.id === event.id);
    const hasPendingChanges =
      booking?.pendingStartTime && booking?.pendingEndTime;

    if (hasPendingChanges) {
      const style: CSSProperties = {
        backgroundColor: "#60A5FA",
        borderColor: "#1E40AF",
        borderWidth: "3px",
        color: "#FFFFFF",
        fontWeight: "bold",
        backgroundImage: "repeating-linear-gradient(135deg, #60A5FA, #60A5FA 10px, #3B82F6 10px, #3B82F6 20px)",
        boxShadow: "0 0 12px rgba(59, 130, 246, 0.6), inset 0 0 0 2px #1E40AF",
      };
      return { style };
    }

    // ✅ PENDING (ожидает первого одобрения) - жёлтый
    if (booking?.status === BookingStatus.PENDING) {
      const style: CSSProperties = {
        backgroundColor: "#FBBF24",
        borderColor: "#F59E0B",
        borderWidth: "2px",
        color: "#78350F",
        fontWeight: "bold",
        opacity: 0.8,
        backgroundImage: "repeating-linear-gradient(45deg, #FBBF24, #FBBF24 10px, #FCD34D 10px, #FCD34D 20px)",
        boxShadow: "0 0 0 2px #F59E0B inset",
      };
      return { style };
    }

    // ✅ BOOKED (одобрено) - зелёный
    if (booking?.status === BookingStatus.BOOKED) {
      const style: CSSProperties = {
        backgroundColor: "#10B981",
        borderColor: "#059669",
        borderWidth: "2px",
        color: "#FFFFFF",
        fontWeight: "bold",
      };
      return { style };
    }

    // Fallback
    return getEventStyle(event.id);
  };

  return (
    <>
      <div className="rounded-2xl w-full h-full bg-white/80 backdrop-blur-sm shadow-2xl p-8 flex flex-col border border-white/20">
        <CalendarNavigation
          goPrev={goPrev}
          goNext={goNext}
          goToToday={goToToday}
          view={view}
          setView={setView}
          headerTitle={getHeaderTitle()}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          locations={CALENDAR_CONFIG.locations}
        />

        {/* ✅ ЛЕГЕНДА СТАТУСОВ */}
        <div className="mb-4 flex items-center gap-6 px-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 border-2 border-yellow-600 rounded-sm"></div>
            <span className="text-xs font-semibold text-gray-700">
              ⏳ Ожидает одобрения (Pending)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 border-2 border-green-600 rounded-sm"></div>
            <span className="text-xs font-semibold text-gray-700">
              ✅ Одобрено (Booked)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-sm"
              style={{
                background: "repeating-linear-gradient(135deg, #60A5FA, #60A5FA 5px, #3B82F6 5px, #3B82F6 10px)",
                border: "2px solid #1E40AF"
              }}
            ></div>
            <span className="text-xs font-semibold text-gray-700">
              📝 На редактирование (Pending changes)
            </span>
          </div>
        </div>

        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          toolbar={false}
          culture={CALENDAR_CONFIG.culture}
          step={CALENDAR_CONFIG.step}
          timeslots={CALENDAR_CONFIG.timeslots}
          min={calendarMin}
          max={calendarMax}
          components={{
            event: CalendarEvent,
          }}
          eventPropGetter={getEventStyleWithStatus}
          style={{ height: "600px", overflowY: "auto" }}
        />
      </div>

      {pendingBooking && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmBooking}
          startTime={pendingBooking.start}
          endTime={pendingBooking.end}
          location={pendingBooking.location}
          error={bookingError}
        />
      )}

      {selectedBooking && (
        <BookingDescriptionModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          booking={selectedBooking}
        />
      )}
    </>
  );
};