import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const cachedUser = localStorage.getItem('user');
      return token && cachedUser ? JSON.parse(cachedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (userObj) => {
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
    if (userObj?.token) localStorage.setItem('token', userObj.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
