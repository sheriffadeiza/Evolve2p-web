'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type LoginStep = 'LoginE&P' | 'LoginSecpin' | 'LoginAuth';

interface UserData {
    email: string;
    username?: string;
    password: string; 
    country?: string;
    phone?: string;
    verified?: boolean;
    pin?: string;
}

interface LoginContextType {
  user: UserData | null;
  setUser: (user: UserData | Partial<UserData>) => void;
  updateUser: (data: Partial<UserData>) => void;
  currentStep: LoginStep;
  setCurrentStep: (step: LoginStep) => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserData | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
      } catch (error) {
        console.error('Failed to parse user data:', error);
        return null;
      }
    }
    return null;
  });

  const [currentStep, setCurrentStep] = useState<LoginStep>('LoginE&P');

  const setUser = (newUser: UserData | Partial<UserData>) => {
    try {
      // Never store password in localStorage
      const userToStore = { ...newUser };
      delete userToStore.password;

      if ('email' in newUser) {
        // Complete user object
        const updatedUser = userToStore as UserData;
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        setUserState(updatedUser);
      } else {
        // Partial update
        setUserState(prev => {
          const updatedUser = prev ? { ...prev, ...userToStore } : null;
          if (updatedUser && typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          return updatedUser;
        });
      }
    } catch (error) {
      console.error('Error setting user:', error);
    }
  };

  const updateUser = (data: Partial<UserData>) => {
    try {
      // Never store password in localStorage
      const dataToStore = { ...data };
      delete dataToStore.password;

      setUserState(prev => {
        const updatedUser = prev ? { ...prev, ...dataToStore } : null;
        if (updatedUser && typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return updatedUser;
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  useEffect(() => {
    console.log('User context updated:', user);
  }, [user]);

  return (
    <LoginContext.Provider value={{ user, setUser, updateUser, currentStep, setCurrentStep }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};      