// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(() => {
    const savedSignedInState = localStorage.getItem('isSignedIn');
    return savedSignedInState ? JSON.parse(savedSignedInState) : false;
  });

  useEffect(() => {
    localStorage.setItem('isSignedIn', JSON.stringify(isSignedIn));
  }, [isSignedIn]);

  const signIn = () => setIsSignedIn(true);
  const signOut = () => {
    setIsSignedIn(false);
    localStorage.removeItem('isSignedIn'); // Ensure local storage is cleared
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
