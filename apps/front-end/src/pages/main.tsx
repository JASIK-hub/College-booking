import { Sidebar } from "../components/panel/sideBar";
import { BookingCalendar } from "../components/panel/calendar/bookingCalendar";
import { Navigate } from "react-router-dom";


export default function MainPage() {
  interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
  return (
    <AuthGuard>
      <div className="flex h-screen p-5 bg-gray-200 gap-2">
        <Sidebar />
        <BookingCalendar />
      </div>
    </AuthGuard>
  );
}
