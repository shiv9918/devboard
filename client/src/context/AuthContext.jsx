import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// ── Helper: safely parse JSON ──────────────────
const parseUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(parseUser);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // ── login: persist token + user ───────────────
  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user",  JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  // ── logout: clear everything ──────────────────
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // ── updateUser: e.g. after profile edit ───────
  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
