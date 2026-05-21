import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(token ? JSON.parse(atob(token.split(".")[1])) : null);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setToken(null); setUser(null); localStorage.removeItem("token");
  };

  useEffect(() => {
    // Optionally: verify token via ping to backend here
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}