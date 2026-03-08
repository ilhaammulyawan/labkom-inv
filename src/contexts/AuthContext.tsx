import React, { createContext, useContext, useState, useCallback } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const VALID_USERNAME = "ilham";
const VALID_PASSWORD = "Rahasia;";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("siilaku_auth") === "true";
  });
  const [username, setUsername] = useState<string | null>(() => {
    return sessionStorage.getItem("siilaku_user");
  });

  const login = useCallback((user: string, pass: string) => {
    if (user === VALID_USERNAME && pass === VALID_PASSWORD) {
      setIsAuthenticated(true);
      setUsername(user);
      sessionStorage.setItem("siilaku_auth", "true");
      sessionStorage.setItem("siilaku_user", user);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUsername(null);
    sessionStorage.removeItem("siilaku_auth");
    sessionStorage.removeItem("siilaku_user");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
