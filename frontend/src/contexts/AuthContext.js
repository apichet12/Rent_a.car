import React, { createContext, useState, useEffect, useCallback } from 'react';

// สร้าง Context สำหรับ Auth
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // โหลด user จาก localStorage เวลาเริ่ม app
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  // login: บันทึก user + role
  const login = useCallback((username, role) => {
    const data = { username, role, email: `${username}@example.com` };
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  }, []);

  // logout: ลบข้อมูล user
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isUser, isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
