export const BookingStatus = {
  PENDING: "pending",
  BOOKED: "booked",
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
