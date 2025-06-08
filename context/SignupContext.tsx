'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type SignupStep = 'email' | 'password' | 'verify' | 'profile' | 'secpin' | 'confirm' | 'sconfirm';

interface SignupData {
  email: string;
  username: string;
  password: string;
  country: string;
  phone: string;
  verified: boolean;
}

interface SignupContextType {
  currentStep: SignupStep;
  setCurrentStep: (step: SignupStep) => void;
  signupData: SignupData;
  updateSignupData: (data: Partial<SignupData>) => void;
}

const defaultSignupData: SignupData = {
  email: '',
  username: '',
  password: '',
  country: '',
  phone: '',
  verified: true,
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<SignupStep>('email');
  const [signupData, setSignupData] = useState<SignupData>(defaultSignupData);

  // Load signup data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('signupData');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          setSignupData((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {
      console.warn('Error loading signup data from localStorage:', e);
    }
  }, []);

  // Update signup data and persist to localStorage
  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData((prev) => {
      const newData = { ...prev, ...data };
      try {
        localStorage.setItem('signupData', JSON.stringify(newData));
      } catch (e) {
        console.warn('Could not save signup data to localStorage:', e);
      }
      return newData;
    });
  };

  return (
    <SignupContext.Provider value={{ currentStep, setCurrentStep, signupData, updateSignupData }}>
      {children}
    </SignupContext.Provider>
  );
}

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
};

export default SignupContext;