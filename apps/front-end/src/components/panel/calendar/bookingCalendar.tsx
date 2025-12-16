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
import { getFilteredEvents,CalendarEvent,getCalendarMax,getCalendarMin } from "../../../util/calendar.util";
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
      setPendingBooking(null);
    } catch (err) {
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPendingBooking(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedBooking(null);
  };

  
const filteredEvents =getFilteredEvents(bookings,selectedLocation);
const calendarMin=getCalendarMin(date)
const calendarMax=getCalendarMax(date)
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
        <Calendar
          localizer={localizer}
          events={filteredEvents}
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
          eventPropGetter={(e) => getEventStyle(e.id)}
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
        />
      )}

      <BookingDescriptionModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        booking={selectedBooking}
      />
    </>
  );
};