import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useUserContext } from "../../context/user.context";
import { LogOut, User, Shield, Award, Bell, ArrowRight } from "lucide-react";
import { BookingStatus } from "../../types/booking-status.type";
import type { NotificationType } from "../../types/notification.type";

export const Sidebar = () => {
  const navigate = useNavigate();
  const { callApi } = useApi();
  const { setUser } = useUserContext();
  const { role, username } = useUserContext();

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await callApi<{ name: string }>("/user/info", undefined, "GET");
        setUser(`${data.name}`, data.role);
      } catch (err) {
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const data = await callApi<NotificationType[]>(
          "/booking/all/admin/pending",
          undefined,
          "GET"
        );
        setNotifications(data);
      } catch (err) {
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();

    // ✅ ОБНОВЛЯЕМ УВЕДОМЛЕНИЯ КАЖДЫЕ 5 СЕКУНД
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const pendingCount = notifications.filter(
    (n) => n.status === BookingStatus.PENDING
  ).length;

  return (
    <div className="rounded-2xl w-72 h-full bg-gradient-to-b from-slate-50 to-blue-50 border-r border-blue-100 shadow-lg flex flex-col justify-between p-6">
      {/* Верхняя часть - Информация о пользователе */}
      <div className="space-y-6">
        {/* Карточка пользователя */}
        <div className="bg-white rounded-2xl p-5 border-2 border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
              <User size={24} className="text-white" />
            </div>
            <div className="flex-1">
              {username && (
                <h3 className="text-base font-bold text-gray-900 truncate">
                  {username}
                </h3>
              )}
              <p className="text-xs text-gray-500">Пользователь</p>
            </div>
          </div>

          {/* Роль */}
          {role && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
              {isAdmin ? (
                <Shield size={16} className="text-purple-600" />
              ) : (
                <Award size={16} className="text-blue-600" />
              )}
              <span
                className={`text-sm font-semibold ${
                  isAdmin ? "text-purple-700" : "text-blue-700"
                }`}
              >
                {isAdmin ? "Администратор" : "Преподаватель"}
              </span>
            </div>
          )}
        </div>

        {/* Разделитель */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>

        {/* ✅ КРАСИВАЯ СЕКЦИЯ УВЕДОМЛЕНИЙ ДЛЯ АДМИНА */}
        {isAdmin && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Bell size={14} className="text-blue-600" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Запросы на бронирование
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/notifications")}
              className="w-full group relative overflow-hidden rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md p-4"
            >
              {/* Фоновый градиент при наведении */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Содержимое */}
              <div className="relative flex items-center justify-between gap-3">
                {/* Левая часть - иконка и текст */}
                <div className="flex items-center gap-3 flex-1">
                  {/* Иконка колокольчика с пульсацией */}
                  <div
                    className={`p-2.5 rounded-lg transition-all duration-300 ${
                      pendingCount > 0
                        ? "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                        : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                    }`}
                  >
                    <Bell size={18} />
                    {pendingCount > 0 && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </div>

                  {/* Текст */}
                  <div className="text-left">
                    <p className="text-xs font-medium text-gray-600">
                      {pendingCount > 0 ? "Новые запросы" : "Нет запросов"}
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        pendingCount > 0 ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      {loadingNotifications ? "..." : pendingCount}
                    </p>
                  </div>
                </div>

                {/* Правая часть - стрелка и бэдж */}
                <div className="flex items-center gap-2">
                  {pendingCount > 0 && (
                    <div className="px-2.5 py-1 bg-red-100 rounded-lg">
                      <span className="text-red-600 font-bold text-xs">
                        {pendingCount}
                      </span>
                    </div>
                  )}
                  <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <ArrowRight
                      size={16}
                      className="text-blue-600 group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Нижняя часть - Выход */}
      <div className="space-y-3 border-t border-blue-100 pt-6">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md hover:from-red-600 hover:to-pink-600 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group transform hover:scale-105 active:scale-95"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Выход</span>
        </button>
      </div>
    </div>
  );
};