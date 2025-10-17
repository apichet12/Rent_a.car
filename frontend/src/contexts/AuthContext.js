import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // โหลด user จาก localStorage + fetch updated createdAt จาก server
  useEffect(() => {
    const loadUser = async () => {
      const stored = localStorage.getItem('user');
      if (!stored) {
        setLoading(false);
        return;
      }
      let parsedUser = JSON.parse(stored);

      try {
        const res = await fetch(`/api/user/${parsedUser.username}`);
        const data = await res.json();
        if (data.success) {
          parsedUser = {
            username: data.username,
            role: data.role,
            name: data.name,
            email: data.email,
            createdAt: data.createdAt, // ใช้วันที่จาก server
          };
          setUser(parsedUser);
          localStorage.setItem('user', JSON.stringify(parsedUser));
        } else {
          setUser(parsedUser); // fallback
        }
      } catch (err) {
        console.error('Fetch user error:', err);
        setUser(parsedUser); // fallback
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // login
  const login = useCallback((username, role) => {
    const data = {
      username,
      role,
      email: `${username}@example.com`,
      createdAt: new Date().toISOString(),
    };
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  }, []);

  // logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      login,
      logout,
      isAdmin,
      isUser,
      isLoggedIn,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
