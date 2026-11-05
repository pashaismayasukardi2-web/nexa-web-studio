'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthSession, IAMUser } from '../types/auth';
import { getSession, login as authLogin, logout as authLogout } from '../lib/auth';

interface AuthContextType {
  session: AuthSession | null;
  user: IAMUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  refreshSession: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSession = () => {
    const current = getSession();
    setSession(current);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        isAuthenticated: !!session,
        isLoading,
        login: authLogin,
        logout: authLogout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

