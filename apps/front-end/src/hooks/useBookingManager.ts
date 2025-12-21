import { useState } from "react";
import { useApi } from "./useApi";
import type { BookingStatus } from "../types/booking-status.type";

export interface Booking {
  id: number;
  startTime: Date;
  endTime: Date;
  location: {
    id: number;
    name: string;
  };
  pendingStartTime: Date | null;
  pendingEndTime: Date | null;
  description: string;
  author: string;
  status: BookingStatus;
}

export const useBookingManager = () => {
  const { callApi, loading, error } = useApi();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const parseUTCToLocal = (utcString: string | null): Date | null => {
    if (!utcString) return null;

    const utcDate = new Date(utcString);

    const localDate = new Date(
      utcDate.getUTCFullYear(),
      utcDate.getUTCMonth(),
      utcDate.getUTCDate(),
      utcDate.getUTCHours(),
      utcDate.getUTCMinutes(),
      utcDate.getUTCSeconds()
    );

    return localDate;
  };

  const fetchAllBookings = async () => {
    try {
      const data = await callApi<undefined, any[]>(
        "/booking/getAll",
        undefined,
        "GET"
      );

      setBookings(
        data.map((b) => ({
          id: b.id,
          startTime: parseUTCToLocal(b.startTime) || new Date(),
          endTime: parseUTCToLocal(b.endTime) || new Date(),
          pendingStartTime: b.pendingStartTime
            ? parseUTCToLocal(b.pendingStartTime)
            : null,
          pendingEndTime: b.pendingEndTime
            ? parseUTCToLocal(b.pendingEndTime)
            : null,
          location: b.location,
          description: b.description,
          author: b.user.name,
          status: b.status,
        }))
      );
    } catch (err: any) {
      setBookings([]);
    }
  };

  const createBooking = async (
    start: Date,
    end: Date,
    location: string,
    description: string
  ) => {
    try {
      const startUTC = new Date(
        Date.UTC(
          start.getFullYear(),
          start.getMonth(),
          start.getDate(),
          start.getHours(),
          start.getMinutes(),
          start.getSeconds()
        )
      );

      const endUTC = new Date(
        Date.UTC(
          end.getFullYear(),
          end.getMonth(),
          end.getDate(),
          end.getHours(),
          end.getMinutes(),
          end.getSeconds()
        )
      );

      const newBooking = await callApi(
        "/booking",
        {
          startTime: startUTC.toISOString(),
          endTime: endUTC.toISOString(),
          location,
          description,
        },
        "POST"
      );

      await fetchAllBookings();

      return newBooking;
    } catch (err) {
      console.error("Error creating booking:", err);
      throw err;
    }
  };

  const updateBooking = async (
    bookingId: number,
    startTime: Date,
    endTime: Date,
    description: string
  ) => {
    try {
      const startUTC = new Date(
        Date.UTC(
          startTime.getFullYear(),
          startTime.getMonth(),
          startTime.getDate(),
          startTime.getHours(),
          startTime.getMinutes(),
          startTime.getSeconds()
        )
      );

      const endUTC = new Date(
        Date.UTC(
          endTime.getFullYear(),
          endTime.getMonth(),
          endTime.getDate(),
          endTime.getHours(),
          endTime.getMinutes(),
          endTime.getSeconds()
        )
      );

      const response = await callApi(
        `/booking/${bookingId}`,
        {
          startTime: startUTC.toISOString(),
          endTime: endUTC.toISOString(),
          description,
        },
        "PATCH"
      );

      await fetchAllBookings();

      return response;
    } catch (err) {
      console.error("Error updating booking:", err);
      throw err;
    }
  };

  const deleteBooking = async (bookingId: number) => {
    try {
      const response = await callApi(
        `/booking/${bookingId}`,
        undefined,
        "DELETE"
      );

      await fetchAllBookings();

      return response;
    } catch (err) {
      throw err;
    }
  };

  return {
    bookings,
    loading,
    error,
    fetchAllBookings,
    createBooking,
    updateBooking,
    deleteBooking,
  };
};
