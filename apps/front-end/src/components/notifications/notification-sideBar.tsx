import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useUserContext } from "../../context/user.context";
import { LogOut, User, Shield, Award } from "lucide-react";

export const NotificationSidebar = () => {
  const navigate = useNavigate();
  const { callApi } = useApi();
  const { setUser, role, username } = useUserContext();

  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await callApi<{ name: string; role: string }>(
          "/user/info",
          undefined,
          "GET"
        );
        setUser(data.name, data.role);
      } catch (err) {
        console.error("Ошибка загрузки пользователя", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div className="rounded-2xl w-72 h-full bg-gradient-to-b from-slate-50 to-blue-50 border-r border-blue-100 shadow-lg flex flex-col justify-between p-6">
      {/* Верхняя часть */}
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
        <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
      </div>

      {/* Нижняя часть */}
      <div className="space-y-3 border-t border-blue-100 pt-6">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md hover:from-red-600 hover:to-pink-600 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group transform hover:scale-105 active:scale-95"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Выход</span>
        </button>
      </div>
    </div>
  );
};
