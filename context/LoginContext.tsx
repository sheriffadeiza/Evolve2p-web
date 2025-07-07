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
  const [user, setUserState] = useState<UserData | null>(null);
  const [currentStep, setCurrentStep] = useState<LoginStep>('LoginE&P');

  // Sync user state with localStorage on mount and when localStorage changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUserState(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse user data:', error);
          setUserState(null);
        }
      } else {
        setUserState(null);
      }

      // Listen for changes to localStorage from other tabs/windows
      const handleStorage = (event: StorageEvent) => {
        if (event.key === 'user') {
          if (event.newValue) {
            setUserState(JSON.parse(event.newValue));
          } else {
            setUserState(null);
          }
        }
      };
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }
  }, []);

  // Save user to localStorage whenever it changes (except password)
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const { password, ...userToStore } = user;
      localStorage.setItem('user', JSON.stringify(userToStore));
    }
  }, [user]);

  const setUser = (newUser: UserData | Partial<UserData>) => {
    try {
      // Never store password in localStorage
      const userToStore = { ...newUser };
      delete userToStore.password;

      if ('email' in newUser) {
        // Complete user object
        const updatedUser = userToStore as UserData;
        setUserState(prev => ({ ...prev, ...updatedUser }));
      } else {
        // Partial update
        setUserState(prev => (prev ? { ...prev, ...userToStore } : null));
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

      setUserState(prev => (prev ? { ...prev, ...dataToStore } : null));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

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