import React, { createContext, useState, useEffect } from 'react';

// สร้าง Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // โหลด user จาก localStorage เวลาเริ่ม app
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (username, role) => {
    const data = { username, role };
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
