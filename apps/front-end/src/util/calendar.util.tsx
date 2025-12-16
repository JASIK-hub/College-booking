import type { Booking } from "../hooks/useBookingManager";
import { CALENDAR_CONFIG } from "../config/calendar.config";

export const getFilteredEvents = (bookings: Booking[], selectedLocation: string) => {
  return bookings
    .filter((b) => b.location.name === selectedLocation)
    .map((b) => ({
      id: b.id,
      title: b.author,
      start: new Date(b.startTime),
      end: new Date(b.endTime),
      location: b.location,
    }));
};

export const getCalendarMin = (date: Date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    CALENDAR_CONFIG.minHour,
    0
  );
};

export const getCalendarMax = (date: Date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    CALENDAR_CONFIG.maxHour,
    0
  );
};

export const CalendarEvent = ({ event }: any) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      height: "90%",
    }}
  >
    <span style={{ textAlign: "left", fontSize: "12px" }}>
      {event.title}
    </span>
  </div>
);