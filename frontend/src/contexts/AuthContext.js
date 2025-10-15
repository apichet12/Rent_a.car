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
    const data = { username, role };
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  }, []);

  // logout: ลบข้อมูล user
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  // ตรวจสอบว่าเป็นแอดมินหรือไม่
  const isAdmin = user && user.role === 'admin';
  // ตรวจสอบว่าเป็นยูสเซอร์ทั่วไปหรือไม่
  const isUser = user && user.role === 'user';
  // ตรวจสอบว่าเข้าสู่ระบบหรือไม่
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isUser, isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
