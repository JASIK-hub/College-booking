import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { useUserContext } from "../../context/user.context";
import { useNavigate } from "react-router-dom";
import { Check, X, Clock, MapPin, Mail, ArrowLeft, Edit2 } from "lucide-react";
import type { NotificationType } from "../../types/notification.type";
import { NotificationSidebar } from "./notification-sideBar";

export default function NotificationsPage() {
  const { callApi } = useApi();
  const { role } = useUserContext();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState<number | null>(null);
  const [declineLoading, setDeclineLoading] = useState<number | null>(null);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/main");
      return;
    }
  }, [role, navigate]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setPageLoading(true);
      const data = await callApi<NotificationType[]>("/booking/all/admin/pending", undefined, "GET");
      setNotifications(data);
      console.log(data)
    } catch (err) {
    } finally {
      setPageLoading(false);
    }
  };

  const getRequestType = (notif: NotificationType) => {
    const hasPendingTimes = notif.pendingStartTime && notif.pendingEndTime;
    return hasPendingTimes ? "edit" : "create";
  };

  const getApproveEndpoint = (notif: NotificationType) => {
    const type = getRequestType(notif);
    if (type === "edit") return `/booking/${notif.id}/admin/edit/approve`;
    return `/booking/${notif.id}/admin/approve`;
  };

  const handleApprove = async (notif: NotificationType) => {
    try {
      setApproveLoading(notif.id);
      const endpoint = getApproveEndpoint(notif);
      const method = getRequestType(notif) === "edit" ? "PATCH" : "POST";
      await callApi(endpoint, {}, method);
      setNotifications(notifications.filter((n) => n.id !== notif.id));
    } catch (err) {
      alert("Ошибка при одобрении");
    } finally {
      setApproveLoading(null);
    }
  };

  const handleDecline = async (notif: NotificationType) => {
    try {
      setDeclineLoading(notif.id);
      await callApi(`/booking/${notif.id}/admin/decline`,undefined, "DELETE");
      setNotifications(notifications.filter((n) => n.id !== notif.id));
    } catch (err) {
      console.error("Error declining booking:", err);
      alert("Ошибка при отклонении");
    } finally {
      setDeclineLoading(null);
    }
  };
   const getTimeHHMM = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};



  return (
    <div className="flex h-screen bg-gray-50">
      <NotificationSidebar/>
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate("/main")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition"
                  title="Вернуться в главное меню"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                  Запросы на бронирование
                </h1>
              </div>
              <p className="text-gray-600 ml-11">
                Все запросы ожидают вашего решения
              </p>
            </div>
          </div>

          {/* Stat Card */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 border-2 border-yellow-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Новых запросов
                  </p>
                  <p className="text-4xl font-bold text-yellow-600">
                    {notifications.length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Loading & Empty State */}
          {pageLoading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-gray-600 mt-4">Загрузка запросов...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-200">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-gray-600 text-lg font-medium">
                Все запросы обработаны!
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Новых запросов пока нет
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notif) => {
                const requestType = getRequestType(notif);
                const isEdit = requestType === "edit";

                return (
                  <div
                    key={notif.id}
                    className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200 transition-all shadow-sm hover:shadow-md"
                  >
                    {/* Badge */}
                    <div className="mb-4 flex items-center gap-2">
                      {isEdit ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 border border-blue-300 rounded-lg">
                          <Edit2 size={14} className="text-blue-600" />
                          <span className="text-xs font-semibold text-blue-700">
                            Запрос на редактирование
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 border border-green-300 rounded-lg">
                          <Check size={14} className="text-green-600" />
                          <span className="text-xs font-semibold text-green-700">
                            Новое бронирование
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div className="col-span-2 space-y-4">
                        {/* Location */}
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-white bg-opacity-50 rounded-lg">
                            <MapPin size={20} className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                              Место
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                              {notif.location.name}
                            </p>
                          </div>
                        </div>

                        {/* Current Time */}
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-white bg-opacity-50 rounded-lg">
                            <Clock size={20} className="text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                              {isEdit ? "Текущее время" : "Время"}
                            </p>
                            <div className="space-y-1">
                              <p className="text-lg font-bold text-gray-900">
                                {getTimeHHMM(notif.startTime)} {"- "}
                                {getTimeHHMM(notif.endTime) }
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Pending Time */}
                        {isEdit && notif.pendingStartTime && notif.pendingEndTime && (
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Edit2 size={20} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Новое время (предложено)
                              </p>
                              <div className="space-y-1">
                                <p className="text-lg font-bold text-blue-700">
                                  {getTimeHHMM(notif.pendingStartTime)} -{" "}
                                  {getTimeHHMM(notif.pendingEndTime)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Email */}
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-white bg-opacity-50 rounded-lg">
                            <Mail size={20} className="text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                              Заявитель
                            </p>
                            <div className="space-y-0.5">
                              <p className="text-sm font-medium text-gray-900">
                                {notif.user.name}
                              </p>
                              <p className="text-xs text-gray-600">{notif.user.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="bg-white bg-opacity-50 rounded-xl p-4 flex flex-col items-center justify-center">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Статус</p>
                        <div className="flex flex-col items-center">
                          <div className="text-4xl mb-2">⏳</div>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold whitespace-nowrap">
                            Ожидает решения
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6 pb-6 border-b border-yellow-300 border-opacity-50">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Описание
                      </p>
                      <p className="text-sm text-gray-700 bg-white bg-opacity-50 p-3 rounded-lg">
                        {notif.description || "Нет описания"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(notif)}
                          disabled={approveLoading === notif.id}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Check size={18} />
                          {approveLoading === notif.id ? "Одобрение..." : "✅ Одобрить"}
                        </button>
                        <button
                          onClick={() => handleDecline(notif)}
                          disabled={declineLoading === notif.id}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <X size={18} />
                          {declineLoading === notif.id ? "Отклонение..." : "❌ Отклонить"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
