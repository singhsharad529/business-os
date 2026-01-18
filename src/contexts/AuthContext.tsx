import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { mockUsers } from '../data/mockData';
import userService from '@/api/userService';
import { toast } from '@/hooks/useToast';
import voiceBotService from '@/api/voicebotService';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string, role: 'super_admin' | 'company_admin' | 'standard_user' | '') => Promise<User | null>;
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
        // console.log('Stored user from localStorage:', storedUser);

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

  const login = async (email: string, password: string, role: 'super_admin' | 'company_admin' | 'standard_user' | ''): Promise<User | null> => {

    try {

      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );


      let apiRole: string = role === "company_admin" ? "users" : "admin";

      console.log('apiRole', apiRole);
      const response = await userService.login({ email, password, role: apiRole }, {});


      if (response) {
        localStorage.setItem('businessos_access_token', response.access_token);

        // console.log('company id', companyId);
        console.log('respons', response);


        if (response?.admin?.role === "ADMIN") {
          const userWithoutPassword = { ...response, role: "super_admin" };
          setUser(userWithoutPassword);
          localStorage.setItem('businessos_user', JSON.stringify(userWithoutPassword));
          return userWithoutPassword;
        }
        else {
          // const companyResponse = await voiceBotService.getCompanyList({});

          // console.log('compay list', companyResponse);

          // const companyId = companyResponse.companies.filter((company: any) => company.userId === response.user.id);

          // const userWithoutPassword = { ...response.user, companyId: companyId.length > 0 ? companyId[0].id : null, role: "company_admin" };
          const companyId = response.companies?.[0]?.id || null;
          const userWithoutPassword = { ...response, companyId, role: "company_admin" };

          setUser(userWithoutPassword);
          localStorage.setItem('businessos_user', JSON.stringify(userWithoutPassword));
          return userWithoutPassword;
        }



        // return userWithoutPassword;
      }
      else {
        return null;
      }


    }
    catch (error) {
      console.error(error);
      toast.danger('Failed to login. Please try again.');
      return null;
    }

    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('businessos_user');
    localStorage.removeItem('businessos_access_token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isLoading }}>
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
