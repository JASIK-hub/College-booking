import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { Button } from "../ui/button";
import { useUser } from "../../context/user.context";


export const Sidebar = () => {
  const navigate = useNavigate();
  const { callApi} = useApi();
  const {setUser} = useUser()
  const {role,username}=useUser()
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await callApi<{ name: string }>("/user/info", undefined, "GET");
        setUser(`${data.firstName} ${data.lastName}`,data.role)
      } catch (err) {
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAuthenticated');
    
    navigate('/login');
  };

  const userRole = role === 'admin' ? 'Admin' : 'Teacher';

  return (
    <div className="rounded-3xl p-6 w-72 border-r bg-white border-gray-200 shadow-lg flex flex-col justify-between h-full">
      <div>
        <div className="flex gap-1 items-end">
          {username && (
            <div className="text-left text-indigo-700 text-xl font-bold">
              {username}
            </div>
          )}
          {role && (
            <div className="text-indigo-900 text-md font-bold">
              {userRole}
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={handleLogout}
        className="w-full mt-4 py-2 rounded-lg font-medium transition
                  hover:bg-red-50 hover:text-red-600 hover:border-red-600"
      >
        Logout
      </Button>
    </div>
  );
};