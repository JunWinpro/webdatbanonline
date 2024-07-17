import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const updateUser = async (updatedData) => {
    try {
      const response = await axiosInstance.put(
        `/users/${user._id}`,
        updatedData
      );
      if (response.data.success) {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return true;
      }
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};