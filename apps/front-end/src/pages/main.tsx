import { Sidebar } from "../components/panel/sideBar";
import { BookingCalendar } from "../components/panel/calendar/bookingCalendar";


export default function MainPage() {
  return (
    <div className="flex h-screen p-5 bg-gray-200 gap-2">
      <Sidebar />
      <BookingCalendar />
    </div>
  );
}
