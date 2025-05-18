'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type SignupStep = 'email' | 'password' | 'verify' | 'profile' | 'secpin' | 'confirm';

interface SignupData {
  email: string;
  username: string;
  password: string;
  country: string;
  phone: string;
  verified?: boolean;
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
  verified: false
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<SignupStep>('email');
  const [signupData, setSignupData] = useState<SignupData>(defaultSignupData);

  useEffect(() => {
    // Load email and password from localStorage if available
    const email = localStorage.getItem('userEmail') || '';
    const password = localStorage.getItem('userPassword') || '';
    if (email && password) {
      setSignupData(prev => ({
        ...prev,
        email,
        password
      }));
    }
  }, []);

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData(prev => ({
      ...prev,
      ...data
    }));
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
