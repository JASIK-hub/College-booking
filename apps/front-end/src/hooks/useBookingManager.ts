import { useState } from "react";
import { useApi } from "./useApi";

export interface Booking {
  id: number;
  startTime: Date;
  endTime: Date;
  location: {
    id: number;
    name: string;
  };
  description: string;
  author: string;
}

export const useBookingManager = () => {
  const { callApi, loading, error } = useApi();
  const [bookings, setBookings] = useState<Booking[]>([]);

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
          startTime: new Date(b.startTime),
          endTime: new Date(b.endTime),
          location: b.location,
          description: b.description,
          author: `${b.user.firstName} ${b.user.lastName}`,
        }))
      );
    } catch (err) {
      console.error("Ошибка загрузки бронирований:", err);
    }
  };

  const createBooking = async (
    start: Date,
    end: Date,
    location: string,
    description: string
  ) => {
    try {
      const newBooking = await callApi("/booking", {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        location,
        description,
      });

      await fetchAllBookings();

      return newBooking;
    } catch (err) {
      throw err;
    }
  };

  return { bookings, loading, error, fetchAllBookings, createBooking };
};
