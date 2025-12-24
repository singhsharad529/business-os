import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { mockUsers } from '../data/mockData';
import userService from '@/api/userService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('businessos_user');
        console.log('Stored user from localStorage:', storedUser);

        if (storedUser && storedUser !== 'undefined') {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && typeof parsedUser === 'object') {
            setUser(parsedUser);
          } else {
            console.warn('Invalid user data in localStorage');
          }
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {

    try {

      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {

        const response = await userService.login({ email, password }, {});
        if (response) {
          localStorage.setItem('businessos_access_token', response.access_token);
        }
        else {
          return null;
        }

        const userWithoutPassword = { ...foundUser, password: '' };
        setUser(userWithoutPassword);
        localStorage.setItem('businessos_user', JSON.stringify(userWithoutPassword));

        return userWithoutPassword;
      }

    }
    catch (error) {
      console.error(error);
      return null;
    }

    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('businessos_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
