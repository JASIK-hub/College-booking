import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface UserContextType {
  username: string;
  role: string;
  setUser: (username: string, role: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const setUser = (name: string, role: string) => {
    setUsername(name);
    setRole(role);
  };

  return (
    <UserContext.Provider value={{ username, role, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
