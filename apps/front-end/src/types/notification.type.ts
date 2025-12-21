import type { BookingStatus } from "./booking-status.type";

export interface NotificationType {
  id: number;
  location: {
    id: number;
    name: string;
  };
  startTime: string;
  endTime: string;
  pendingStartTime: string | null;
  pendingEndTime: string | null;
  description: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  status: BookingStatus;
}
