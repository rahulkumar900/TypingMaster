'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  id: number | string;
  username: string;
  email: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('typing_thunder_token');
      const savedUser = localStorage.getItem('typing_thunder_user');

      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } catch (e) {
          // Clear corrupt data
          localStorage.removeItem('typing_thunder_token');
          localStorage.removeItem('typing_thunder_user');
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('typing_thunder_token', jwtToken);
    localStorage.setItem('typing_thunder_user', JSON.stringify(userData));
    toast.success(`Welcome back, ${userData.username}!`);
    router.push('/typing-test');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('typing_thunder_token');
    localStorage.removeItem('typing_thunder_user');
    toast.success("Successfully logged out. See you next time!");
    router.push('/login');
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...userData };
    setUser(updated);
    localStorage.setItem('typing_thunder_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
