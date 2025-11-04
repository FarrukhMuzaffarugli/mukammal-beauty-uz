import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '@/api/auth';
import { AuthResponse, User } from '@/types';
import { getTokens, setTokens } from '@/api/client';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (!getTokens()) {
          setLoading(false);
          return;
        }
        const profile = await authApi.profile();
        if (!profile.roles.includes('admin')) {
          await authApi.logout();
          setUser(null);
        } else {
          setUser(profile);
        }
      } catch (error) {
        setTokens(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response: AuthResponse = await authApi.login({ email, password });
      if (!response.user.roles.includes('admin')) {
        throw new Error('Admin huquqi talab qilinadi');
      }
      setUser(response.user);
    } catch (error: any) {
      setTokens(null);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
