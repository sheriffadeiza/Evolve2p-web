'use client';

import React, { createContext, useContext, useState } from 'react';

type SignupStep = 'email' | 'password' | 'verify' | 'profile' | 'secpin' | 'confirm';

interface SignupData {
  email: string;
  username: string;
  password: string;
  country: string;
  phone: string;
  verified?: boolean;  // Add verified field
}

interface SignupContextType {
  currentStep: SignupStep;
  setCurrentStep: (step: SignupStep) => void;
  signupData: SignupData;
  updateSignupData: (data: Partial<SignupData>) => void;
}

const initialSignupData: SignupData = {
  username: 'temp_user',  // Provide temporary values
  password: 'temp_pass',
  country: 'default',
  phone: '0000000000',
  email: '',
  verified: false
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<SignupStep>('email');
  const [signupData, setSignupData] = useState<SignupData>(initialSignupData);

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...data }));
  };

  return (
    <SignupContext.Provider value={{ currentStep, setCurrentStep, signupData, updateSignupData }}>
      {children}
    </SignupContext.Provider>
  );
}

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
};

export default SignupContext;