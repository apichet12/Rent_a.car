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

  // login: บันทึก user + role
  const login = (username, role) => {
    const data = { username, role };
    console.log('[AuthContext] login:', data);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const logout = () => {
    console.log('[AuthContext] logout');
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
